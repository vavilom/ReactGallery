var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

//The modal window for show big image
var Modal = React.createClass({
    render: function() {
        if(this.props.isOpen){
            return (
                <ReactCSSTransitionGroup transitionName={this.props.transitionName}>
                    <div className="modalDialog">
	                    <div>
                            {this.props.children}
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        }
        else {
            return <ReactCSSTransitionGroup transitionName={this.props.transitionName} />;
        }
    }
});

//The main component for work with images
var DataGalery = React.createClass({
    getInitialState: function() {
      return {
          data: null,
          pageNumber: '1',
          bigImg: '',
          isModalOpen: false
      };
    },
    componentDidMount: function () { //first loading fo images
        var self = this;
        $.getJSON(this.props.url + '&page=' + this.state.pageNumber, function (response) {
            self.setState({ data: response });
        });
    },
    onBtnClickHandler: function (e) { //change pages
        this.state.pageNumber = e.target.id.substring(3); //set page number from button id
        var self = this;
        $.getJSON(this.props.url + '&page=' + this.state.pageNumber, function (response) {
            self.setState({ data: response });
        });
    },
    openFullImg: function (urlFullImg, e) {//show modal with new url of big image
        this.setState({
            bigImg: urlFullImg,
            isModalOpen: true
        });
    },
    closeModal: function () {
        this.setState({ isModalOpen: false });
    },
    render: function () {
        var data = this.state.data,
            firstPage = this.state.firstPage,
            imgTemplate,
            self = this;

        if (data) {
            imgTemplate = data.photos.map(function (item, index) {
                return (
                    <div className="imgBox" key={index}>
                        <img src={item.image_url} 
                             onClick={self.openFullImg.bind(null, item.user.cover_url)} />
                    </div>
                );
            });
        }
        else {
            imgTemplate = <p>Images loading...</p>
        }

        console.log(this.state.pageNumber);
        return (
            <div className="images">
                <div className="imgContainer clearfix">
                    {imgTemplate}
                </div>
                <div className="buttonGroup">
                    <div className="line"></div>
                    <button onClick={this.onBtnClickHandler} id="btn1" disabled={this.state.pageNumber == '1'}>
                        1
                    </button>
                    <button onClick={this.onBtnClickHandler} id="btn2"  disabled={this.state.pageNumber == '2'}>
                        2
                    </button>
                </div>
                <Modal isOpen={this.state.isModalOpen}
                       transitionName="modal-anim">
                    <img className="modalImg" src={this.state.bigImg} />
                    <div className="closeModal" onClick={this.closeModal}>X</div>
                </Modal>
            </div>
        );
    }
});


React.render(
    <DataGalery url={'https://api.500px.com/v1/photos?feature=popular&consumer_key=wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF'}/>,
    document.getElementById('root')
);


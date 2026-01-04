// ==UserScript==
// @name         MyModal
// @namespace    http://https://wish123.cnblogs.com/?MyModal
// @version      0.1.1.2
// @description  原生js弹出层
// @author       Wilson

function MyModal(options) {
  this.zIndex = 1010
  this.config = options || {}
  this.modal = null;
  if(this.config) {
    this.createStyle();
    this.create();
  }
}
MyModal.prototype.createStyle = function() {
  if(document.querySelector("#myModalStyle")) {
    return;
  }
  let style = `
<style id="myModalStyle">
/* The Modal (background) */
.my-modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1010; /* Sit on top */
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.my-modal button {
  background-color: #1c9fff;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.my-modal button:hover {
  opacity:1;
}

.my-modal h2{
    margin: 15px 0;
}

/* Modal Content */
.my-modal .modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 50%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
  border-radius: 5px;
}

.my-modal .modal-body-content{
  font-size: 16px;
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
.my-modal .close {
  color: #333;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.my-modal .modal-header .close{
  margin-top: 6px;
}

.my-modal .close:hover,
.my-modal .close:focus {
  color: #333;
  text-decoration: none;
  cursor: pointer;
  opacity: 0.60;
}

.my-modal .modal-header {
  padding: 2px 16px;
  background-color: #fff;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 5px;
}

.my-modal .modal-body {
  padding: 10px 16px;
  min-height: 28px;
  line-height: 28px;
  overflow: auto;
}

.my-modal .modal-footer {
  padding: 2px 16px;
  background-color: #fff;
  color: #333;
  /* border-top: 1px solid #f0f0f0; */
  border-radius: 5px;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.my-modal .cancelbtn,.my-modal .okbtn {
  float: right;
  width: 50%;
}

/* Add a color to the cancel button */
.my-modal .cancelbtn {
  background-color: #f1f1f1;
  color: #333;
  /* border: 1px solid #dedede; */
}

/* Add a color to the delete button */
.my-modal .okbtn {
  background-color: #1c9fff;
}

@media screen and (max-width: 300px) {
  .my-modal .cancelbtn,.my-modal  .okbtn {
     width: 100%;
  }
}
</style>
  `
  document.body.insertAdjacentHTML("beforeend", style);
}
MyModal.prototype.create = function(options) {
  options = options || this.config
  if(document.querySelector("#myModal")) {
    document.querySelector("#myModal").remove();
  }
  let width = options.width ? 'width:'+options.width+';' : '';
  let height = options.height ? 'height:'+options.height+';' : '';
  let borderRadius = options.borderRadius ? 'border-radius:'+options.borderRadius+';' : '';
  let zIndex = options.zIndex ? 'z-index:'+options.zIndex+';' : '';
  let myModal = `
  <div id="myModal" class="my-modal" style="${zIndex}${options.top?'padding-top:'+options.top+';':''}">
    <div class="modal-content" style="${width}${height}${borderRadius}">
      <div class="modal-header" style="${borderRadius}${options.title===null?'display:none;':''}${options.content===null?'border-bottom:none':''}">
        <span class="close">&times;</span>
        <h2>${options.title||''}</h2>
      </div>
      <div class="modal-body" style="${options.content===null?'display:none;':''}">
        ${options.title===null?'<span class="close">&times;</span>':''}
        <div class="modal-body-content">${options.content||''}</div>
      </div>
      <div class="modal-footer" style="${borderRadius}${options.okText===null&&options.closeText===null?'display:none;':''}">
          <div class="clearfix">
              <button type="button" class="okbtn" style="${options.okText===null?'display:none;':''}${options.okWidth?'width:'+options.okWidth+';':''}">${options.okText||'OK'}</button>
              <button type="button" class="cancelbtn" style="${options.closeText===null?'display:none;':''}${options.closeWidth?'width:'+options.closeWidth+';':''}">${options.closeText||'Cancel'}</button>
          </div>
      </div>
    </div>
  </div>`
  document.body.insertAdjacentHTML("beforeend", myModal);
  this.modal = document.querySelector(`#myModal`);

  if(options.height) {
    document.querySelector("#myModal .modal-body").style.height = (parseFloat(options.height) - 125) + 'px';
  }

  let modalContent = document.querySelector(".modal-content");
  setTimeout(()=>{
    if(modalContent.offsetHeight){
      let padding = document.documentElement.clientHeight - modalContent.offsetHeight;
      padding = padding > 0 ? padding : 0;
      this.modal.style.paddingTop = (padding/2)+'px';
    }
  });

  let _this = this;
  //绑定关闭事件
  let headerCloseBtn = document.querySelector(`#myModal .modal-header .close`);
  if(headerCloseBtn) {
        headerCloseBtn.addEventListener("click", function(e){
            _this.close();
        });
  }
  let bodyCloseBtn = document.querySelector(`#myModal .modal-body .close`);
  if(bodyCloseBtn){
    bodyCloseBtn.addEventListener("click", function(e){
        _this.close();
    });
  }
  //绑定cancel事件
  document.querySelector(`#myModal .cancelbtn`).addEventListener("click", function(e){
    if(_this.config.closeFn) {
      e.myModal = _this;
      _this.config.closeFn(e);
    } else {
      _this.close();
    }
  });
  //绑定OK事件
  document.querySelector(`#myModal .okbtn`).addEventListener("click", function(e){
    if(_this.config.okFn) {
      e.myModal = _this;
      _this.config.okFn(e);
    } else {
      _this.close();
    }
  });
  //点击空白，菜单消失
  document.addEventListener('click', function(e){
    if (e.target == _this.modal) {
      _this.close();
    }
  });
}
MyModal.prototype.show = function() {
  if(this.modal) {
    this.modal.style.display = 'block';
  }
}
MyModal.prototype.close = function() {
  if(this.modal) {
    this.modal.remove();
  }
}

// //测试1
// document.querySelector("#test1").addEventListener("click", function(){
//   new MyModal({
//     top: '',
//     width: '50%',
//     height: 'auto',
//     borderRadius: '5px',
//     zIndex: 1010,
//     //null，不显示title
//     title: 'test1',
//     //支持HTML格式，null不显示content
//     content: 'Hello World!',
//     //closeText:null，不显示关闭按钮
//     closeText: '关闭',
//     closeWidth: '',
//     //okText:null，不显示ok按钮
//     okText: '好了',
//     okWidth: '',
//     //closeFn和okFn可以省略
//     closeFn: function (e) {
//       console.log('closeFn clicked');
//       e.myModal.close();
//     },
//     okFn: function (e) {
//       console.log('okFn clicked');
//       e.myModal.close();
//     }
//   }).show();
// });

// //测试2
// document.querySelector("#test2").addEventListener("click", function(){
//   new MyModal({
//     top: '',
//     width: '50%',
//     height: 'auto',
//     borderRadius: '5px',
//     zIndex: 1010,
//     title: 'test2',
//     content: 'Hello World2!',
//     closeText: '取消',
//     closeWidth: '',
//     okText: '确定',
//     okWidth: '',
//     closeFn: function (e) {
//       console.log('closeFn clicked');
//       e.myModal.close();
//     },
//     okFn: function (e) {
//       console.log('okFn clicked');
//       e.myModal.close();
//     }
//   }).show();
// });
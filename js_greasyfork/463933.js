// ==UserScript==
// @name         MyDropdown
// @namespace    http://https://wish123.cnblogs.com/?MyDropdown
// @version      0.1.1.1
// @description  原生js实现简洁的下拉菜单
// @author       Wilson

//构造方法
function MyDropdown(options){
    //_count是某实例下的菜单个数
	this._count = 0;
	this._zIndex = 1000;
	this._config = options;
    window._MyDropdownPosIndex = (window._MyDropdownPosIndex||this._zIndex)+1;
    //实例总个数
    window._MyDropdownInsCount = (window._MyDropdownInsCount||0)+1;
    //当前第几个实例
    this.insCount = window._MyDropdownInsCount;
	if(this._config) {
	    this.config(options);
	    this.createStyle();
	}
}
MyDropdown.prototype.createStyle = function() {
  if(document.querySelector("#myDropdownStyle")) {
    return;
  }
  let = style = `
<style id="myDropdownStyle">
.my-dropdown-wrapper {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.my-dropdown-wrapper .my-dropdown-item:hover{
    background-color: #ddd;
}
.my-dropdown-wrapper .my-dropdown-item.selected {background-color: #ddd;}
.my-dropdown-wrapper a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  padding-right: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-dropdown-wrapper a:hover {background-color: #ddd;}
.my-dropdown-wrapper a.selected {background-color: #ddd;}
.show {display: block;}
.my-dropdown-item-icon svg{width: 24px;height: 24px;float: left;}
.my-dropdown-wrapper .close {
  width: 24px;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  text-align: center;
  font-size: 18px;
  float: right;
  position: relative;
  top: 10px;
  right: 6px;
  cursor: pointer;
}
.my-dropdown-wrapper .close:hover{
  opacity: 0.6;
}
</style>
  `
  document.body.insertAdjacentHTML("beforeend", style);
}
//返回对象类型
MyDropdown.prototype.type = function(obj) {
    return Object.prototype.toString
          .call(obj)
          .replace(/^\[object (.+)\]$/, '$1')
          .toLowerCase();
}
//设置用户配置
MyDropdown.prototype.config = function(options) {
    var _this = this;
    //设置用户配置
    _this._config = options || _this._config;
    if(_this._config.toggleEvent && _this._config.toggleEvent.toLowerCase() === 'mouseover') {
        _this._config.toggleEvent = 'mouseenter';
    }

    if(_this.type(_this._config.el) !== 'string') {
        //手动绑定
        //初始化事件按钮
        _this._config.byManual = true;
        const btnObj = _this._config.el.target || _this._config.el;
        let event = null;
        if(_this._config.el.target) {
            event = _this._config.el;
        }
        if(_this._config.event) {
            event = _this._config.event;
        }
        let id = btnObj.getAttribute("id");
        if(!id) {
            id = "myDropdownBtn" + _this.insCount;
            btnObj.setAttribute("id", id);
        }
        const count = btnObj.dataset.count;
        if(!count) btnObj.dataset.count = 1;
        btnObj.classList.add('my-btn'+_this.insCount+btnObj.dataset.count);
        if(!btnObj.classList.contains('my-btn-by-manual')) btnObj.classList.add('my-btn-by-manual');
        _this._config.el = "#" + id;
        _this.create(btnObj);
        _this.show(btnObj);
        if(event) event.stopPropagation();
    } else {
        //自动绑定
        //绑定事件源按钮点击事件
        document.querySelectorAll(_this._config.el||".my-dropdown-btn").forEach(function(item){
            item.addEventListener(_this._config.toggleEvent||'click', function(e){
                _this.create(this);
                _this.show(this);
                e.stopPropagation();
                return false;
            });
        });
    }
}
//创建菜单
MyDropdown.prototype.create = function(objBtn, options) {
    var _this = this;
    options = options || _this._config;
    if(options.el) {
        _this._config.el = options.el;
    }

    if(objBtn) {
        if (!objBtn.dataset.count) {
            objBtn.dataset.count = _this._count++;
            objBtn.classList.add('my-btn'+_this.insCount+objBtn.dataset.count);
        }
    }
    var count = objBtn.dataset.count || 0;

    //已存在则返回
    if(document.querySelector(`#myDropdownWrapper${_this.insCount}${count}`)) {
        return;
    }

    //点击空白，菜单消失（每次显示后，重新绑定一次）
    if(!window._MyDropdownEventListener) {
        window._MyDropdownEventListener = 1;
        document.addEventListener('click', (e) => {
           if (!e.target.matches(this._config.el||'.my-dropdown-btn')) {
             this.hide();
           }
       });
    }

    var mouseenterClass = "";
    if(_this._config.toggleEvent && _this._config.toggleEvent.toLowerCase() === 'mouseenter') {
        mouseenterClass = " mouseenter";
    }
    var byManualClass = "";
    if(objBtn.classList.contains("my-btn-by-manual")) {
        byManualClass = " my-dropdown-by-manual"
    }
    //生成菜单 这里count是某实例下的菜单个数，_this.insCount是实例个数
    var menu = `<div id="myDropdownWrapper${_this.insCount}${count}" class="my-dropdown-wrapper${mouseenterClass}${byManualClass}" style="overflow:auto;${options.maxWidth?'max-width:'+options.maxWidth+';':''}${options.maxHeight?'max-height:'+options.maxHeight+';':''}" data-count="${count}">`;
    if(options.items) {
        for(var i in options.items){
            var item = options.items[i];
            //处理icon选项
            var iconHtml = '';
            if(item.icon){
                if(_this.type(item.icon) === 'object'){
                    iconHtml = item.icon.html ? item.icon.html : '';
                } else {
                    iconHtml = item.icon ? item.icon : '';
                }
            }

            //处理op选项
            var opHtml = '';
            if(item.op){
                if(_this.type(item.op) === 'object'){
                    opHtml = item.op.html ? item.op.html : '';
                } else {
                    opHtml = item.op ? item.op : '';
                }
            }
            //生成菜单项
            menu += `<div class="my-dropdown-item${item.selected?' selected':''}" data-index="${i}" data-value="${item.value}"><span class="my-dropdown-item-op">${opHtml}</span><a href="##" class="${item.selected?'selected':''}" data-index="${i}" data-value="${item.value}"><span class="my-dropdown-item-icon">${iconHtml}</span>${item.name}</a></div>`;
        }
    }
    menu += `</div>`;
    //追加到body中
    document.body.insertAdjacentHTML("beforeend", menu);

    //记录hidden回调
    window._MyDropdownConfig = window._MyDropdownConfig || {};
    window._MyDropdownConfig[`myDropdownWrapper${_this.insCount}${count}`] = _this._config || {};

    //绑定菜单事件
    if(_this._config.toggleEvent && _this._config.toggleEvent.toLowerCase() === 'mouseenter') {
        //绑定菜单列表
        document.querySelector("#myDropdownWrapper" + _this.insCount + count).addEventListener("mouseleave", function(e){
            _this.hide(this);
        });
    }

    //绑定菜单item点击事件
    document.querySelectorAll("#myDropdownWrapper" + _this.insCount + count + " .my-dropdown-item").forEach(function(item){
        item.addEventListener("click", function(e){
            if(typeof this.dataset.index !== 'undefined' && options.items[this.dataset.index]) {
                options.items[this.dataset.index].fn(e);
            }
        });
    });

    //绑定菜单项icon按钮点击事件
    document.querySelectorAll("#myDropdownWrapper" + _this.insCount + count + " .my-dropdown-item-icon").forEach(function(item){
        //if(!item.innerHTML) return;
        item.addEventListener("click", function(e){
            if(typeof this.parentElement.dataset.index !== 'undefined' && options.items[this.parentElement.dataset.index] && 
            options.items[this.parentElement.dataset.index].icon && options.items[this.parentElement.dataset.index].icon.fn) {
                var _this_item = this;
                (function(e){
                    options.items[_this_item.parentElement.dataset.index].icon.fn(e);
                    e.stopPropagation();
                    return false;
                })(e);
            }
        });
    });

    //绑定菜单项操作按钮点击事件
    document.querySelectorAll("#myDropdownWrapper" + _this.insCount + count + " .my-dropdown-item-op").forEach(function(item){
        //if(!item.innerHTML) return;
        item.addEventListener("click", function(e){
            if(typeof this.nextElementSibling.dataset.index !== 'undefined' && options.items[this.nextElementSibling.dataset.index] && 
            options.items[this.nextElementSibling.dataset.index].op && options.items[this.nextElementSibling.dataset.index].op.fn) {
                var _this_item = this;
                (function(e){
                    options.items[_this_item.nextElementSibling.dataset.index].op.fn(e);
                    e.stopPropagation();
                    return false;
                })(e);
            }
        });
    });

    if(options.created) options.created(document.querySelector(`#myDropdownWrapper${_this.insCount}${count}`));
};
//菜单显示
MyDropdown.prototype.show = function(objBtn, callback) {
  var count = objBtn.dataset.count || 0;
  var myDropdownWrapper = document.getElementById("myDropdownWrapper"+this.insCount+count);
  if(objBtn){
      myDropdownWrapper.style.top = (objBtn.offsetTop + objBtn.offsetHeight) + "px";
      myDropdownWrapper.style.left = objBtn.offsetLeft + "px";
  }
  if (myDropdownWrapper.classList.contains('show')) {
      if(this._config.toggleEvent && this._config.toggleEvent.toLowerCase() === 'mouseenter'){
        return;
      }
      //隐藏菜单
      myDropdownWrapper.classList.remove('show');
      if(this._config.hidden) this._config.hidden();
  } else {
      if(this._config.toggleEvent && this._config.toggleEvent.toLowerCase() === 'mouseenter'){
        this.hide();
      }
      //显示菜单
      myDropdownWrapper.style.zIndex = window._MyDropdownPosIndex++;
      myDropdownWrapper.classList.add('show');
      callback = callback || this._config.shown;
      if(callback) callback(myDropdownWrapper);
  }
  //myDropdownWrapper.classList.toggle("show");
}
//菜单隐藏
MyDropdown.prototype.hide = function(objMenu, callback) {
    objMenu = typeof objMenu === 'string' ? document.querySelector(objMenu) : objMenu;
    if(objMenu) {
        //单个菜单隐藏
        var id = objMenu.getAttribute("id");
        var config = window._MyDropdownConfig[id] || {};
        if(config.byManual && objMenu.classList.contains("my-dropdown-by-manual")){
            let idNum = objMenu.getAttribute("id").match(/\d+/);
            idNum = idNum ? (idNum[0]||0) : 0;
            let myBtn = document.querySelector(".my-btn"+idNum);
            if(myBtn) myBtn.classList.remove("my-btn"+idNum);
            objMenu.remove();
            callback = callback || config.hidden;
            if(callback) callback(objMenu);
        } else {
            if (objMenu.classList.contains('show')) {
                objMenu.classList.remove('show');
                callback = callback || config.hidden;
                if(callback) callback(objMenu);
            }
        }
    } else {
        //所有菜单隐藏
        var dropdowns = document.querySelectorAll(".my-dropdown-wrapper");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            var id = openDropdown.getAttribute("id");
            var config = window._MyDropdownConfig[id] || {};
            if(config.byManual && openDropdown.classList.contains("my-dropdown-by-manual")){
                let idNum = openDropdown.getAttribute("id").match(/\d+/);
                idNum = idNum ? (idNum[0]||0) : 0;
                let myBtn = document.querySelector(".my-btn"+idNum);
                if(myBtn) myBtn.classList.remove("my-btn"+idNum);
                openDropdown.remove();
                if(window._MyDropdownConfig[id] && window._MyDropdownConfig[id].hidden){
                    callback = callback || config.hidden;
                    if(callback) callback(openDropdown);
                }
                delete window._MyDropdownConfig[id];
            } else {
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                    if(window._MyDropdownConfig[id] && window._MyDropdownConfig[id].hidden){
                        callback = callback || config.hidden;
                        if(callback) callback(openDropdown);
                    }
                }
            }
        }
    }
}

//使用示例
// //测试1
// var clicked = function(e) {
//     console.log("clicked", e.target.dataset.value)
// }
// new MyDropdown({
//     el: ".my-dropdown-btn",
//     maxWidth: '200px',
//     maxHeight: '400px',
//     //支持click mouseenter dblclick等，默认click
//     toggleEvent: 'mouseenter',
//     items: [
//         {
//             name: 'Home',
//             value: 'home',
//             icon: '',
//             fn: clicked
//         },
//         {
//             name: 'About',
//             value: 'about',
//             icon: '',
//             selected: false,
//             fn: clicked
//         },
//         {
//             name: 'Contact',
//             value: 'contact',
//             icon: '',
//             fn: clicked,
//             //icon也支持对象传值，同样具有html和fn属性
//             op: {
//                 html: `<span class="close">&times;</span>`,
//                 fn: function(e) {
//                     console.log('op clicked');
//                 }
//             }
//         }
//     ],
//     created: function(menu) {
//         console.log('After created callback1');
//     },
//     shown: function(menu) {
//         console.log('After shown callback1');
//     },
//     hidden: function(menu) {
//         console.log('After hidden callback1');
//     }
// });

// //测试2
// var clicked2 = function(e) {
//     console.log("clicked2", e.target.dataset.value)
// }
// new MyDropdown({
//     el: ".my-dropdown-btn2",
//     items: [
//         {
//             name: 'Home2',
//             value: 'home2',
//             icon: '',
//             fn: clicked2
//         },
//         {
//             name: 'About2',
//             value: 'about2',
//             icon: '',
//             selected: false,
//             fn: clicked2
//         },
//         {
//             name: 'Contact2',
//             value: 'contact2',
//             icon: '',
//             fn: clicked2
//         }
//     ],
//     created: function(menu) {
//         console.log('After created callback2');
//     },
//     shown: function(menu) {
//         console.log('After shown callback2');
//     },
//     hidden: function(menu) {
//         console.log('After hidden callback2');
//     }
// });

// //测试3
// document.querySelector("#test3").addEventListener('click', function(e){
//     new MyDropdown({
//         el: this,
//         maxWidth: '200px',
//         maxHeight: '400px',
//         items: [
//             {
//                 name: 'Home3',
//                 value: 'home3',
//                 fn: (e) => {
//                     console.log("clicked", e.target.dataset.value)
//                 }
//             },
//             {
//                 name: 'About3',
//                 value: 'about3',
//                 selected: false,
//                 fn: (e) => {
//                     console.log("clicked", e.target.dataset.value)
//                 }
//             },
//             {
//                 name: 'Contact3',
//                 value: 'contact3',
//                 selected: false,
//                 fn: (e) => {
//                     console.log("clicked", e.target.dataset.value)
//                 },
//                 op: {
//                     html: `<span class="close">&times;</span>`,
//                     fn: (e) => {
//                         console.log('op clicked');
//                     }
//                 }
//             }
//         ],
//         created: function(menu) {
//             console.log('After created callback3');
//         },
//         shown: function(menu) {
//             console.log('After shown callback3');
//         },
//         hidden: function(menu) {
//             console.log('After hidden callback3');
//         }
//     });
//     e.stopPropagation();
//     return false;
// });
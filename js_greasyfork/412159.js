// ==UserScript==
// @name         MyDrag
// @namespace    http://bbs.91wc.net/
// @version      0.1.3
// @description  DIV拖动库，稳定高效，专为您解决DIV拖动的烦恼，支持多实例
// @author       Wilson
// ==/UserScript==

var MyDragHelper={}, MyDrag = (function(){
    function Drag(){
        //初始化
        this.initialize.apply(this, arguments)
    }
    Drag.prototype = {
        //初始化
        initialize : function (drag, options){
            this.drag = this.$(drag);
            this.drag.style.width = (parseInt(this.drag.style.width)||this.drag.offsetWidth);
            this._x = this._y = 0;
            this._moveDrag = this.bind(this, this.moveDrag);
            this._stopDrag = this.bind(this, this.stopDrag);
            this.setOptions(options);
            this.handle = this.$(this.options.handle);
            this.left = this.options.left;
            this.top = this.options.top;
            this.right = this.options.right;
            this.bottom = this.options.bottom;
            this.position = this.options.position;
            this.onlyViewport = this.options.onlyViewport;
            this.maxContainer = this.$(this.options.maxContainer);
            this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight + this.maxContainer.offsetTop;
            this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth + this.maxContainer.offsetLeft;
            this.limit = this.options.limit;
            this.lockX = this.options.lockX;
            this.lockY = this.options.lockY;
            this.lock = this.options.lock;
            this.onStart = this.options.onStart;
            this.onMove = this.options.onMove;
            this.onStop = this.options.onStop;
            this.handle.style.cursor = "move";
            this.zIndex = this.options.zIndex;
            this.alone = this.options.alone;
            if(!this.alone){
                MyDragHelper.zIndex = MyDragHelper.zIndex ? ++MyDragHelper.zIndex : this.zIndex;
                MyDragHelper.count = MyDragHelper.count ? ++MyDragHelper.count : 1;
            }
            this.changeLayout();
            this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag));
        },
        changeLayout : function (){
            if(this.right){
                this.drag.style.right = this.right + "px";
            } else {
                this.drag.style.left = (this.maxContainer.offsetLeft + this.left) + "px";
            }
            if(this.bottom){
                this.drag.style.bottom = this.bottom + "px";
            } else {
                this.drag.style.top = (this.maxContainer.offsetLeft + this.top) + "px";
            }
            this.drag.style.position = this.position;
            this.drag.style.margin = "0"
            this.drag.style.zIndex = !this.alone ? MyDragHelper.zIndex : this.zIndex;
        },
        startDrag : function (event){       
            var event = event || window.event;
            this._x = event.clientX - this.drag.offsetLeft;
            this._y = event.clientY - this.drag.offsetTop;
            if(!this.alone && MyDragHelper.count > 1) this.drag.style.zIndex = ++MyDragHelper.zIndex;
            this.addHandler(document, "mousemove", this._moveDrag);
            this.addHandler(document, "mouseup", this._stopDrag);
            event.preventDefault && event.preventDefault();
            this.handle.setCapture && this.handle.setCapture();
            this.onStart();
        },
        moveDrag : function (event){
            var event = event || window.event;
            var iTop = event.clientY - this._y;
            var iLeft = event.clientX - this._x;
            if (this.lock) return;
            if(this.limit){
                if(iTop < this.maxContainer.offsetTop) iTop = this.maxContainer.offsetTop;
                if(iLeft < this.maxContainer.offsetLeft) iLeft = this.maxContainer.offsetLeft;
                if(iTop > this.maxTop) iTop = this.maxTop;
                if(iLeft > this.maxLeft) iLeft = this.maxLeft;
            }
            this.lockY || (this.drag.style.top = iTop + "px");
            this.lockX || (this.drag.style.left = iLeft + "px");
            var iWinWidth = this.onlyViewport ? document.documentElement.clientWidth : this.maxContainer.offsetLeft + this.maxContainer.offsetWidth;
            var iWinHeight = this.onlyViewport ? document.documentElement.clientHeight : this.maxContainer.offsetTop + this.maxContainer.offsetHeight;
            if(this.drag.offsetLeft<0){
                this.drag.style.left =0+'px';
            }else if(this.drag.offsetLeft>(iWinWidth-this.drag.offsetWidth)){
                this.drag.style.left =iWinWidth-this.drag.offsetWidth+'px';
            }
            if(this.drag.offsetTop<0){
                this.drag.style.top =0+'px';
            }else if(this.drag.offsetTop>(iWinHeight-this.drag.offsetHeight)){
                this.drag.style.top =iWinHeight-this.drag.offsetHeight+'px';
            }
            event.preventDefault && event.preventDefault();
            this.onMove()
        },
        stopDrag : function (){
            this.removeHandler(document, "mousemove", this._moveDrag);
            this.removeHandler(document, "mouseup", this._stopDrag);
             
            this.handle.releaseCapture && this.handle.releaseCapture();
             
            this.onStop()
        },
        //参数设置
        setOptions : function (options){
            var thisDragCssZIndex = window.getComputedStyle(this.drag,null).zIndex;
            thisDragCssZIndex = isNaN(thisDragCssZIndex) ? 0 : thisDragCssZIndex;
            this.options ={
                handle:           this.drag, //事件对象
                top:              0, //默认顶部位置
                bottom:           0, //默认底部位置，不支持非body的限定容器
                left:             0, //默认左边位置
                right:            0, //默认右边位置，不支持非body的限定容器
                position:         'absolute', //默认浮动方式
                onlyViewport:     true, //仅在视窗内拖动
                limit:            true, //锁定范围
                lock:             false, //锁定位置
                lockX:            false, //锁定水平位置
                lockY:            false, //锁定垂直位置
                maxContainer:     document.documentElement || document.body, //指定限制容器
                onStart:          function () {}, //开始时回调函数
                onMove:           function () {}, //拖拽时回调函数
                onStop:           function () {},  //停止时回调函数
                zIndex:           this.drag.style.zIndex || thisDragCssZIndex || 999999999, //z轴高度
                alone:            false //是否孤立的，为了防止拖动目标覆盖，默认会和其他拖动层的zIndex相互增加高度
            };
            for (var p in options) this.options[p] = options[p]
        },
        //获取id
        $ : function (id)
        {
            return typeof id === "string" ? document.getElementById(id) : id
        },
        //添加绑定事件
        addHandler : function (oElement, sEventType, fnHandler)
        {
            return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
        },
        //删除绑定事件
        removeHandler : function (oElement, sEventType, fnHandler)
        {
            return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
        },
        //绑定事件到对象
        bind : function (object, fnHandler)
        {
            return function ()
            {
                return fnHandler.apply(object, arguments)   
            }
        }
    };
    return Drag;
})();

/**
//使用示例：
//这里样式仅仅为了演示好看，实际上只需要设置box宽度就好了,如果没设置宽度，div默认100%，不利于看到效果
body,div,h2,p{margin:0;padding:0}
body{font:14px/1.5 arial}
#box{width:300px;height:100px;background:#fef4eb;padding:5px;border:1px solid #666}
#box #title{height:25px;background:#ccc;display:inline-block;cursor:move;width:100%;text-align:center}
.content{text-align:center;line-height:50px}
<div id="box">
    <span id="title">按下我拖拽</span>
    <div class='content'>内容区</div>
</div>
//调用
var box = document.getElementById("box");    
var title = document.getElementById("title");  
new MyDrag(box, {handle:title});
//box是拖拽最外层的div，title是按下时控制句柄的div

//其他参数
handle:           //拖动控制句柄，就是上面示例的title
limit:            //是否限制拖动范围，默认是true
maxContainer:     //拖动限制范围的容器，默认是body，可设置在某个div内拖动
top:              //顶部位置,默认0
bottom:           0, //默认底部位置，不支持非body的限定容器
left:             //左边位置,默认0
right:            0, //默认右边位置，不支持非body的限定容器
position:         'absolute', //默认浮动方式
onlyViewport:      //是否仅在视窗内拖动，默认true
lock:             //是否锁定位置，默认false，锁定后无法拖动
lockX:            //是否锁定水平位置，默认false，锁定后只能y轴拖动
lockY:            //是否锁定垂直位置，默认false，锁定后只能x轴拖动
onStart:          function () {}, //开始时回调函数
onMove:           function () {}, //拖拽时回调函数
onStop:           function () {}  //停止时回调函数
zIndex:           可以设置z轴高度，默认会先读取内联样式的设置，再读取css样式设置，都无则是999999999
alone:            是否孤立的，为了防止拖动目标覆盖，默认会和其他拖动层的zIndex相互增加高度
*/
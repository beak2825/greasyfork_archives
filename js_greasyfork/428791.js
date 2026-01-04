// ==UserScript==
// @icon        https://github.com/favicon.ico
// @name        【自用】浏览器看图 for FireFox
// @namespace   Violentmonkey Scripts
// @match       http*://*/*.jpg
// @match       http*://*/*.jpeg
// @match       http*://*/*.png
// Homepage URL https://greasyfork.org/zh-CN/scripts/428791-%E8%87%AA%E7%94%A8-jpg
// 更新页面      https://greasyfork.org/zh-CN/scripts/428791/versions/new
// @grant       none
// @version     2023.04.22
// @author      heckles
// @description 针对火狐浏览器：去除火狐自带缩放（改为默认100%大小自动居中） | 可拖拽 | 以鼠标中心缩放 | 限定最小缩放（图片大小和屏幕大小较小值的50%） | 左上角显示缩放比例，点击还原 | 可旋转、水平翻转 | 图片加载完毕后闪烁一次
// @downloadURL https://update.greasyfork.org/scripts/428791/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9C%8B%E5%9B%BE%20for%20FireFox.user.js
// @updateURL https://update.greasyfork.org/scripts/428791/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9C%8B%E5%9B%BE%20for%20FireFox.meta.js
// ==/UserScript==



//==================测试网址==============
// 1  http://www.netbian.com/
// 2  https://wallhaven.cc/
// 3  https://hdqwalls.com/
// 4  https://www.deviantart.com/wlop/gallery


function addNewStyle(newStyle) {//增加新样式表
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}


const cssjs = `
body{
margin:0;background-color:#333;
}
@-moz-keyframes flash {
0%,  100% {opacity: 1;}50% {opacity: 0;}
}
`

addNewStyle( cssjs );

//document.body.style.cssText = "margin:0;background-color:#333;";
var img = new Image(); // 创建一个新的img，不过也不设定属性，相当于一个备份，后台应该是加载了，会有img.width产生，而且不操作它，因此是个定量
img.src = document.getElementsByTagName("img")[0].src;// + "?" + Date.parse(new Date()); //重构地址    //看来没必要，有的网站不知道是不是防外链，重构就无法加载例如DA和wallhaven     //另外位置提到最前，能避免后面函数偶尔不生效的bug


//1.1==================上面是从网上摘的=====================

//*绑定事件*/
function addEvent(obj, sType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(sType, fn, false);
    } else {
        obj.attachEvent('on' + sType, fn);
    }
};
function removeEvent(obj, sType, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(sType, fn, false);
    } else {
        obj.detachEvent('on' + sType, fn);
    }
};
function prEvent(ev) {
    var oEvent = ev || window.event;
    if (oEvent.preventDefault) {
        oEvent.preventDefault();
    }
    return oEvent;
}
//*添加滑轮事件*/
function addWheelEvent(obj, callback) {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
        addEvent(obj, 'DOMMouseScroll', wheel);
    } else {
        addEvent(obj, 'mousewheel', wheel);
    }
    function wheel(ev) {
        var oEvent = prEvent(ev),
        delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
        callback && callback.call(oEvent, delta);
        return false;
    }
};


//1.1==================上面是从网上摘的=====================




var css_s = document.querySelectorAll("head > link"); //获取浏览器自带的图片css
css_s[0].href = ""; //删了，要不有冲突
css_s[1].href = ""; //删了，要不有冲突
//css_s[2].href = ""; //删了，要不有冲突




//var pichref = window.location.href;//获取当前网址，也就是图片地址
var imgs = document.getElementsByTagName("img");
var img0 = imgs[0]; //获取默认图片
img0.style.cssText = "display:none;height:0px" //隐藏默认图片
var pic_xx = document.createElement("img"); //创建img

document.body.appendChild(pic_xx); //div加到页面最后
pic_xx.setAttribute("Id", "pic_xx_img"); //定ID
pic_xx.style.cssText = "box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;position:absolute;z-index:1;";//拖拽函数运行之前就得定义position，要不拖不了
pic_xx.src = window.location.href;


//1.2======本来是window.onload = function(){};后来发现img.onload也行，但是都得图片完全加载之后才能拖动和缩放，干脆去了，图片开始加载也就是定义网址后，直接执行========================================
    var oImg = document.getElementById('pic_xx_img'); //【【】【】【】【此处自己改】【】【】【】【】】
    /*拖拽功能*/
    (function () {
        addEvent(oImg, 'mousedown', function (ev) {
            var oEvent = prEvent(ev),
            oParent = oImg.parentNode,
            disX = oEvent.clientX - oImg.offsetLeft,
            disY = oEvent.clientY - oImg.offsetTop,
            startMove = function (ev) {
                if (oParent.setCapture) {
                    oParent.setCapture();
                }
                var oEvent = ev || window.event,
                l = oEvent.clientX - disX,
                t = oEvent.clientY - disY;
                oImg.style.left = l + 'px';
                oImg.style.top = t + 'px';
                oParent.onselectstart = function () {
                    return false;
                }
            },
            endMove = function (ev) {
                if (oParent.releaseCapture) {
                    oParent.releaseCapture();
                }
                oParent.onselectstart = null;
                removeEvent(oParent, 'mousemove', startMove);
                removeEvent(oParent, 'mouseup', endMove);
            };
            addEvent(oParent, 'mousemove', startMove);
            addEvent(oParent, 'mouseup', endMove);
            pic_xx.style.transitionDuration = "0s";//缩放时过渡关了，要不不跟手
            return false;
        });
    })();
    //*以鼠标位置为中心的滑轮放大功能*/
    (function () {
       addWheelEvent(oImg, function (delta) {
            var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
            ratioimg = oImg.width/oImg.height,//!!!这里是自己修改的，限定最小缩放
            ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
            ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
            w = Math.max(parseInt(oImg.offsetWidth * ratioDelta), Math.min(0.5*window.innerWidth,0.5 * screen.width, 0.5 * img.width)), //!!!这里是自己修改的，限定最小缩放
            h = Math.max(parseInt(oImg.offsetHeight * ratioDelta), Math.min(0.5*window.innerWidth/ratioimg,0.5 * screen.width/ratioimg, 0.5 * img.height)), //!!!这里是自己修改的，限定最小缩放
            l = Math.round(this.clientX - (w * ratioL)),
            t = Math.round(this.clientY - (h * ratioT));
            with (oImg.style) {
                width = w + 'px';
                height = h + 'px';
                left = l + 'px';
                top = t + 'px';
              btn100.innerHTML = (w/img.width*100).toFixed(0) + "%";
              btn100.style.backgroundColor = "#2D8CF0";
              pic_xx.style.transitionDuration = "0s";//缩放时过渡关了，要不不跟手
            }
        });
    })();
//1.2==================================================================================================================================================================================



function align100(){// 加载完成执行
var le = 0.5*(window.innerWidth - img.width);
var to = 0.5*(window.innerHeight - img.height);
pic_xx.style.cssText = "box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;\
position:absolute;z-index:1;\
left:"+le+"px;top:"+to+"px;"
btn100.style.backgroundColor = "#FFF";
currentrt = 0;//清零一下旋转
currentfl = 0;//清零一下旋转
btn100.innerHTML = "100%";
}

//align100;

pic_xx.onload = function(){
  align100();
  pic_xx.style.animation = "flash 2s .2s ease both";//加载完成之后加一个CSS动画，缺点是只能一次，配合最开始的@-moz-keyframes
}


const btnstyle = `border: none !important;
width:60px;
font-size: 14px !important;
font-weight: 200 !important;
letter-spacing: 0em !important;
line-height: 0em !important;
height:24px !important;
display: inline-block !important;
outline: 0 !important;
padding: 0px 12px !important;
margin-top: 0px !important;
margin-bottom: 10px !important;
vertical-align: middle !important;
overflow: hidden !important;
text-decoration: none !important;
color: #fff !important;
text-align: center !important;
transition: .2s ease-out !important;
cursor: pointer !important;
white-space: nowrap !important;
box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;
border-radius: 2px  !important;
opacity:0.3;`;
//定义按钮的CSS

var btn100 = document.createElement("button"); //创建一个按钮
btn100.setAttribute("Id", "btn100"); //定义按钮ID
document.body.appendChild(btn100); //把按钮加到页面
btn100.style.cssText = "z-index:2;position:fixed;top:20px;left:20px;background-color: #2D8CF0;width:60px;opacity:0.3;" + btnstyle;//确定按钮位置
btn100.onmouseover = function(){btn100.style.opacity = "1";}
btn100.onmouseout = function(){btn100.style.opacity = "0.3";}
btn100.innerHTML = "100%"; //按钮文本
btn100.onclick = align100; //给按钮加函数


var btnrt = document.createElement("button"); //创建一个按钮
btn100.setAttribute("Id", "btnrt"); //定义按钮ID
document.body.appendChild(btnrt); //把按钮加到页面
btnrt.style.cssText = "z-index:1;position:fixed;top:50px;left:20px;background-color: #FC5531;" + btnstyle; //改变按钮位置
btnrt.onmouseover = function(){btnrt.style.opacity = "1";}
btnrt.onmouseout = function(){btnrt.style.opacity = "0.3";}
btnrt.innerHTML = "rotate"; //按钮文本
var currentrt = 0;//这里必须赋值，还得在函数外面
var currentfl = 0;//这里必须赋值，还得在函数外面
btnrt.onclick =function rotate90(){
      currentrt = currentrt + 90;
      pic_xx.style.transform = 'rotate('+ currentrt +'deg)';
      pic_xx.style.transitionDuration = "0.3s";//加一个过渡，没那么楞
}

var btnfl = document.createElement("button"); //创建一个按钮
btnfl.setAttribute("Id", "btnrt"); //定义按钮ID
document.body.appendChild(btnfl); //把按钮加到页面
btnfl.style.cssText = "z-index:1;position:fixed;top:80px;left:20px;background-color: #FC5531;" + btnstyle; //改变按钮位置
btnfl.onmouseover = function(){btnfl.style.opacity = "1";}
btnfl.onmouseout = function(){btnfl.style.opacity = "0.3";}
btnfl.innerHTML = "flip H"; //按钮文本
var current = 0;//这里必须赋值，还得在函数外面
btnfl.onclick =function flip180(){
      currentfl = currentfl + 180;
      pic_xx.style.transform = 'rotateY('+ currentfl +'deg)';
      pic_xx.style.transitionDuration = "0.3s";//加一个过渡，没那么楞
}
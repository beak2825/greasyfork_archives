// ==UserScript==
// @icon        https://github.com/favicon.ico
// @name        【自用】直接跳转图片 - erowall.com
// @namespace   Violentmonkey Scripts
// @match       https://erowall.com/*
// @exclude     https://erowall.com/*/*.jpg
// @grant       none
// @version     2021.08.06
// @author      heckles
// @description v2021.08.06
// @downloadURL https://update.greasyfork.org/scripts/428547/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%9B%BE%E7%89%87%20-%20erowallcom.user.js
// @updateURL https://update.greasyfork.org/scripts/428547/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%9B%BE%E7%89%87%20-%20erowallcom.meta.js
// ==/UserScript==

function addNewStyle(newStyle) { //增加新样式表
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

addNewStyle('\
    #header nav {z-index:0 !important;}           \
    ');

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

/*页面载入后*/
window.onload = function () {
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
            pic_xx.style.transitionDuration = "0s"; //缩放时过渡关了，要不不跟手
            return false;
        });
    })();
    //*以鼠标位置为中心的滑轮放大功能*/
    (function () {
        addWheelEvent(oImg, function (delta) {
            var img = new Image(); // 创建一个新的img，不过也不设定属性，相当于一个备份，后台应该是加载了，会有img.width产生，而且不操作它，因此是个定量 //这里得重新定义一个
            img.src = oImg.src;
            var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
            ratioimg = oImg.width / oImg.height, //!!!这里是自己修改的，限定最小缩放
            ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
            ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
            w = Math.max(parseInt(oImg.offsetWidth * ratioDelta), 0.5 * screen.width), //!!!这里是自己修改的，限定最小缩放
            h = Math.max(parseInt(oImg.offsetHeight * ratioDelta), 0.5 * screen.width / ratioimg), //!!!这里是自己修改的，限定最小缩放
            l = Math.round(this.clientX - (w * ratioL)),
            t = Math.round(this.clientY - (h * ratioT));
            with (oImg.style) {
                width = w + 'px';
                height = h + 'px';
                left = l + 'px';
                top = t + 'px';
                var pct = (w / img.width * 100).toFixed(0);
                btn100.innerHTML = pct + "%";
                pic_xx.style.transitionDuration = "0s"; //缩放时过渡关了，要不不跟手
            }

        });
    })();
};

//===================================看图相关============================================
var grey_bg = document.createElement("div"); //创建一个DIV用来当透明背景
grey_bg.setAttribute("Id", "grey_bg_div"); //定灰背景的ID
var imgbox_s = document.createElement("div"); //创建装预览图的div，必须得有个div做fixed的容器，要不滚轮就往下翻页了
var pic_xxs = document.createElement("img"); //创建预览图img
imgbox_s.setAttribute("Id", "imgbox_s_div"); //定预览图的div的ID
pic_xxs.setAttribute("Id", "pic_xx_img_s"); //定预览图的ID
var imgbox = document.createElement("div"); //创建装原图片的div
var pic_xx = document.createElement("img"); //创建原图img
imgbox.setAttribute("Id", "imgbox_div"); //定原图片的div的ID
pic_xx.setAttribute("Id", "pic_xx_img"); //定原图的ID

document.body.appendChild(grey_bg); //灰背景加到页面
document.getElementById("grey_bg_div").appendChild(imgbox_s); //预览图的div层加到透明背景
document.getElementById("imgbox_s_div").appendChild(pic_xxs); //预览图加到div里
document.getElementById("grey_bg_div").appendChild(imgbox); //原图的div层加到透明背景
document.getElementById("imgbox_div").appendChild(pic_xx); //原图加到透明背景

//下面给灰背景加属性，默认高度0来隐藏，转移符后面不能乱加空格
grey_bg.style.cssText = "position:fixed;\
    top:0px;\
    left:0px;\
    width:100%;\
    height:0px;\
    background-color: rgb(0, 0, 0, 0.8);\
    text-align:center;\
    vertical-align:middle;"; //定CSS

imgbox_s.style.cssText = "padding:0px;"; //padding缩边,margin是扩，但后续因为还有一个div，这里直接就设成0

function img_prev(a) { //【当前页面打开图片】后面添加到每一个链接
    grey_bg.style.height = "100%"; //开灰背景
    imgbox_s.style.height = "100%"; //开预览图div
    imgbox.style.height = "0"; //关大图div
    pic_xxs.style.cssText = "height:100%;width:auto;padding:20px;box-sizing:border-box;"; //开预览图
    pic_xxs.setAttribute("src", a.getAttribute("href")); //设定链接
    return; //这里得加，要不drag运行后，都变成false了
}

function close_prev() { //【关闭打开的图片】点击非图片部分
    grey_bg.style.height = "0%"; //关闭灰背景
    pic_xxs.style.height = "0px"; //关闭预览
    pic_xxs.setAttribute("src", ""); //清空缓存，要不刚点开还是上次加载的图片
    pic_xx.style.height = "0px"; //关闭原图
    pic_xx.setAttribute("src", ""); //清空缓存，要不刚点开还是上次加载的图片
    imgbox_s.style.width = "100%"; //恢复宽度
    spancl.style.display = "none"; //隐藏关闭按钮
    btnrt.style.display = "none"; //显示
    btn100.style.display = "none"; //显示
    current = 0;
    pic_xx.style.transitionDuration = "0s"; //缩放时过渡关了，要不不跟手
}

function full_view() { //【100%大小，可拖动】
    event.stopPropagation(); //!!!!!!!!不加这个，会穿透到父元素的事件！！！！！
    var img_url = document.getElementById("pic_xx_img_s").src; // + "?" + Date.parse(new Date()); //重构地址    //看来没必要加随机后缀，有的网站不知道是不是防外链，重构就无法加载例如DA和wallhaven
    var imghid = new Image(); // 创建一个新的img，不过也不设定属性，相当于一个备份，后台应该是加载了，会有img.width产生，而且不操作它，因此是个定量
    imghid.src = img_url;
    var le = 0.5 * (window.innerWidth - imghid.width);
    var to = 0.5 * (window.innerHeight - imghid.height);
    imgbox_s.style.height = "0"; //关预览图div
    imgbox.style.height = "100%"; //关预览图div
    imgbox.style.position = "fixed"; //关预览图div
    pic_xxs.style.height = "0"; //关预览图
    pic_xx.style.height = ""; //开预览图
    pic_xx.setAttribute("src", img_url); //预览图地址
    pic_xx.style.cssText = "box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;\
        position:absolute;top:" + to + "px;left:" + le + "px;z-index:99;";
    imgbox_s.style.width = "0px"; //这里不清零，后面drag函数运行后图片初始靠右了
    spancl.style.display = "block"; //显示关闭按钮
    btnrt.style.display = "block"; //显示
    btn100.style.display = "block"; //显示
    return false; //阻止默认，注意这里只阻止了点击pic_xxs的默认事件

}

grey_bg.onclick = close_prev; //点击关闭
pic_xxs.onclick = full_view; //点击看100%大小
pic_xx.onclick = function () {
    event.stopPropagation();
}; //单独设定阻止默认，不能放到上面那个函数里面，不知道为什么，多层触发？

//===================================备份链接、替换链接============================================
var dir_links = "div.wpmini > a"; //这里的规则需要按网站修改    ◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀
var anchors = document.querySelectorAll(dir_links); //用CSS选择器获取目标链接
var linkbak = "";
for (i = 0; i < anchors.length; i++) {
    linkbak += "<a href=" + anchors[i] + ">" + i + "</a>" + "<br>"; //+=两个符号不能分开
} //把原链接重构一下，变相的深拷贝，后续直接写入html不会出现object NodeList

var divbak = document.createElement("div"); //创建一个DIV用来储存链接
divbak.setAttribute("Id", "baklink"); //定ID
//document.getElementById("wrapper").appendChild(btn);
document.body.appendChild(divbak); //div加到页面最后
divbak.style.cssText = "position:fixed;top:500px;left:0px;     display:none;       "; //改DIV的位置，然后隐藏一下     display:none;

for (var i = 0; i < anchors.length; i++) {
    anchors[i].href = anchors[i].href.replace("/w/","/wallpapers/original/").slice(0,-1) + ".jpg"; //这里的规则需要按网站修改     ◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀
    anchors[i].target = "_blank";
    anchors[i].onclick = function () {
        img_prev(this);
        return false;
    }; //添加函数
} //.replace替换.slice修剪，最后加一个后缀，新标签页打开          //这里开始修改目标链接
var linkbakQ = "";
for (i = 0; i < anchors.length; i++) {
    linkbakQ += "<a href=" + anchors[i] + ">" + [i + anchors.length] + "</a>" + "<br>"; //[i+anchors.length]必须用中括号，要不当成字符串相加了
} //把原链接重构一下，变相的深拷贝，后续直接写入html不会出现object NodeList
divbak.innerHTML = linkbak + linkbakQ; //把链接写到新建的DIV中   ！！这里的位置是在修改原链接之后，也没事，证明之前重构成功了
var backedlink = document.querySelectorAll("div#baklink a"); //获取储存的链接,  !!!注意必须得重新获取，直接用会是undefine

function reslink() {
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].href = backedlink[i].href; //
    }
}; //定义恢复链接的函数

function writelink() {
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].href = backedlink[i + anchors.length].href; //
    }
}; //定义重写链接的函数


var spancl = document.createElement("span"); //创建一个按钮
spancl.setAttribute("Id", "spancl"); //定义按钮ID
document.body.appendChild(spancl); //把按钮加到页面
spancl.style.cssText = "cursor: pointer;\
    position: fixed;\
    right: 0px;\
    top: 0px;\
    width: 46px;\
    background: url(\"data: image / png;base64, iVBORw0KGgoAAAANSUhEUgAAAC4AAAARCAIAAAAt9wkYAAA\
    AGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw / eHBh\
    Y2tldCBiZWdpbj0i77u / IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8 + IDx4OnhtcG1ldGEgeG1sbnM6eD0i\
    YWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0x\
    NDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1ze\
    W50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3\
    hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6L\
    y9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG\
    9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0I3NzA1RDAxQ0Y3MTFFMkJGMTU4MTc4OEQ2N0Mz\
    QjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0I3NzA1RDExQ0Y3MTFFMkJGMTU4MTc4OEQ2N0MzQjkiPiA8eG1wTU06RGV\
    yaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQjc3MDVDRTFDRjcxMUUyQkYxNTgxNzg4RDY3QzNCOSIgc3RSZ\
    WY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQjc3MDVDRjFDRjcxMUUyQkYxNTgxNzg4RDY3QzNCOSIvPiA8L3JkZjpEZXNjcmlwdGl\
    vbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI / PmUW1owAAADqSURBVHja5FWxCoQwDL2W + x\
    4X / QmHujvXzV0XadHN31HUn2gR / KD2AgWRAytETpTLEF5eSfqaaEvyPH / dw97W2rtIMcY8uytKKQeiKPKTP5fSdZ0DSZKE\
    YQhAa72SdV0japIsy3D9XPdjjIHv + 96FUkpPFqV0VwrnHD3dpmm + GCHEwdEJ2VVpTlhVVdtaEB6m2H2j9oTN87yVAuFhikcl\
    viuw8TAMWykQAonuCvJeWZZlmiaHy7IE37Yt + HEc4zgOggBREzmgVUdRFI4B4BhYwg2IpGl65ZXq + ZmvfoM838MfP4fPGNBH\
    gAEAi7gyuvHuhZcAAAAASUVORK5CYII =\") no-repeat center bottom;\
    height: 17px;\
    opacity: 0.9;\
    border: none;\
    padding: 0;\
    padding-top: 0px;\
    background-color: #1771FF;\
    display:none;\
    z-index:9999999999999999999999999999";
spancl.onclick = close_prev; //点击关闭


var btnstyle = "border: none !important;\
    width:60px;\
    font-size: 12px !important;\
    font-weight: 200 !important;\
    letter-spacing: 0em !important;\
    line-height: 0em !important;\
    height:24px !important;\
    display: inline-block;\
    outline: 0 !important;\
    padding: 3px 12px !important;\
    margin-top: 15px !important;\
    margin-bottom: 10px !important;\
    vertical-align: middle !important;\
    overflow: hidden !important;\
    text-decoration: none !important;\
    color: #fff !important;\
    text-align: center !important;\
    transition: .2s ease-out !important;\
    cursor: pointer !important;\
    white-space: nowrap !important;\
    box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;\
    border-radius:0px  !important;\
    opacity:0.3;";
//定义按钮的CSS

function align100() { // 加载完成执行
    var img_url = document.getElementById("pic_xx_img_s").src; // + "?" + Date.parse(new Date()); //重构地址    //看来没必要加随机后缀，有的网站不知道是不是防外链，重构就无法加载例如DA和wallhaven
    var img = new Image(); // 创建一个新的img，不过也不设定属性，相当于一个备份，后台应该是加载了，会有img.width产生，而且不操作它，因此是个定量
    img.src = img_url;
    var le = 0.5 * (window.innerWidth - img.width);
    var to = 0.5 * (window.innerHeight - img.height);
    pic_xx.style.cssText = "box-shadow: 0px 2px 6px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24) !important;position:absolute;z-index:2;left:" + le + "px;top:" + to + "px;";
    btn100.innerHTML = "100%";
    current = 0;
}

var btn100 = document.createElement("button"); //创建一个按钮
btn100.setAttribute("Id", "btn100"); //定义按钮ID
document.body.appendChild(btn100); //把按钮加到页面
btn100.style.cssText = "z-index:1;position:fixed;top:460px;left:20px;background-color: #2D8CF0;display:none !important;" + btnstyle; //改变按钮位置
btn100.onmouseover = function () {
    btn100.style.opacity = "1";
}
btn100.onmouseout = function () {
    btn100.style.opacity = "0.3";
}
btn100.innerHTML = "100%"; //按钮文本
btn100.onclick = align100; //给按钮加函数


var btnrt = document.createElement("button"); //创建一个按钮
btn100.setAttribute("Id", "btnrt"); //定义按钮ID
document.body.appendChild(btnrt); //把按钮加到页面
btnrt.style.cssText = "z-index:1;position:fixed;top:420px;left:20px;background-color: #FC5531;display:none !important;" + btnstyle; //改变按钮位置
btnrt.onmouseover = function () {
    btnrt.style.opacity = "1";
}
btnrt.onmouseout = function () {
    btnrt.style.opacity = "0.3";
}
btnrt.innerHTML = "右转"; //按钮文本
var current = 0; //这里必须赋值，还得在函数外面
btnrt.onclick = function rotate90() {
    current = current + 90;
    pic_xx.style.transform = 'rotate(' + current + 'deg)';
    pic_xx.style.transitionDuration = "0.3s"; //缩放时过渡关了，要不不跟手
}

var btnre = document.createElement("button"); //创建一个按钮
btnre.setAttribute("Id", "btnre"); //定义按钮ID
document.body.appendChild(btnre); //把按钮加到页面
btnre.style.cssText = "position:fixed;z-index:0;top:500px;left:20px;background-color: #1EA362;" + btnstyle; //改变按钮位置,z-index取负值能在greylayer下面
btnre.innerHTML = "恢复"; //按钮文本
btnre.onclick = reslink; //给按钮加函数
btnre.onmouseover = function () {
    btnre.style.opacity = "1";
}
btnre.onmouseout = function () {
    btnre.style.opacity = "0.3";
}

var btnwr = document.createElement("button"); //创建一个按钮
btnwr.setAttribute("Id", "btnwr"); //定义按钮ID
document.body.appendChild(btnwr); //把按钮加到页面
btnwr.style.cssText = "position:fixed;z-index:0;top:540px;left:20px;background-color: #e9686b;" + btnstyle; //改变按钮位置,z-index取负值能在greylayer下面
btnwr.innerHTML = "重写"; //按钮文本
btnwr.onclick = writelink; //给按钮加函数
btnwr.onmouseover = function () {
    btnwr.style.opacity = "1";
}
btnwr.onmouseout = function () {
    btnwr.style.opacity = "0.3";
}

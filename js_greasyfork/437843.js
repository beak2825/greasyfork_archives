// ==UserScript==
// @name         VIP视频观看腾讯优酷爱奇艺
// @namespace    没有
// @version      0.0.1
// @description  VIP视频
// @author       mm
// @match        https://www.doc88.com/p-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437843/VIP%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437843/VIP%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA.meta.js
// ==/UserScript==
var new_element_N = document.createElement("style");
new_element_N.innerHTML = '#drager {' +
    '   position: fixed;' +
    '   width: 100px;' +
    '   height:100px;' +
    '   background-color: rgba(192, 192, 192, 0.45);' +
    '   z-index: 1000;' +
    '   cursor: pointer;' +
    '   top: 0px;' +
    '   left: 0px;' +
    '   border-radius: 100%;' +
    '   padding: 10px;' +
    ' }' +
    ' ' +
    ' #drager>div {' +
    '   border-radius: 100%;' +
    '   width: 100%;' +
    '   height: 100%;' +
    '   background-color: rgba(255,255, 255,0.5);' +
    '   transition: all 0.2s;' +
    '  -webkit-transition: all 0.2s;' +
    '  -moz-transition: all 0.2s;' +
    '  -o-transition: all 0.2s;' +
    ' }' +
    ' #drager:hover>div{' +
    '   background-color: rgba(255,255, 255,0.5);' +
    ' } ';
document.body.appendChild(new_element_N);
new_element_N = document.createElement('div');
new_element_N.setAttribute("id", "drager");
new_element_N.style.top = "480px";
new_element_N.style.left = "160px";
new_element_N.innerHTML = ' <div></div>';
document.body.appendChild(new_element_N);
// 
var a = window.location.href;
let Base64 = {
	encode(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	}, decode(str) {
		return decodeURIComponent(atob(str).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}
};
var B = Base64.encode(a); 
// 
var posX;
var posY;
var screenWidth = document.documentElement.clientWidth;
var screenHeight = document.documentElement.clientHeight;
var fdiv = document.getElementById("drager");
fdiv.onmousedown = function (e) {
    screenWidth = document.documentElement.clientWidth;
    screenHeight = document.documentElement.clientHeight;
    if (!e) {
        e = window.event;
    } //IE
    posX = e.clientX - parseInt(fdiv.style.left);
    posY = e.clientY - parseInt(fdiv.style.top);
    document.onmousemove = mousemove;
}

function mousemove(ev) {
    if (ev == null) {
        ev = window.event;
    } //IE
    if ((ev.clientY - posY) <= 0) { //超过顶部
        fdiv.style.top = "0px";
    } else if ((ev.clientY - posY) > (screenHeight - parseInt(fdiv.clientHeight))) { //超过底部
        fdiv.style.top = (screenHeight - parseInt(fdiv.clientHeight)) + "px";
    } else {
        fdiv.style.top = (ev.clientY - posY) + "px";
    }

    if ((ev.clientX - posX) <= 0) { //超过左边
        fdiv.style.left = "0px";
    } else if ((ev.clientX - posX) > (screenWidth - parseInt(fdiv.clientWidth))) { //超过右边
        fdiv.style.left = (screenWidth - parseInt(fdiv.clientWidth)) + "px";
    } else {
        fdiv.style.left = (ev.clientX - posX) + "px";
    }
    // console.log( posX +" "+ fdiv.style.left);
}
window.onload = window.onresize = function () { //窗口大小改变事件
    screenWidth = document.documentElement.clientWidth;
    screenHeight = document.documentElement.clientHeight;
    if ((parseInt(fdiv.style.top) + parseInt(fdiv.clientHeight)) > screenHeight) { //窗口改变适应超出的部分
        fdiv.style.top = (screenHeight - parseInt(fdiv.clientHeight)) + "px";
    }
    if ((parseInt(fdiv.style.left) + parseInt(fdiv.clientWidth)) > screenWidth) { //窗口改变适应超出的部分
        fdiv.style.left = (screenWidth - parseInt(fdiv.clientWidth)) + "px";
    }
    document.onmouseup.apply()
};
fdiv.addEventListener('touchstart', fdiv.onmousedown, false);
fdiv.addEventListener('touchmove', function (event) {
    // 如果这个元素的位置内只有一个手指的话
    if (event.targetTouches.length == 1) {　　　　
        event.preventDefault(); // 阻止浏览器默认事件，重要 
        var touch = event.targetTouches[0];
        if ((touch.pageY) <= 0) { //超过顶部
            fdiv.style.top = "0px";
        } else if (touch.pageY > (screenHeight - parseInt(fdiv.clientHeight))) { //超过底部
            fdiv.style.top = (screenHeight - parseInt(fdiv.clientHeight)) + "px";
        } else {
            fdiv.style.top = (touch.pageY - parseInt(fdiv.clientHeight) / 2) + "px";
        }

        if (touch.pageX <= 0) { //超过左边
            fdiv.style.left = "0px";
        } else if (touch.pageX > (screenWidth - parseInt(fdiv.clientWidth))) { //超过右边
            fdiv.style.left = (screenWidth - parseInt(fdiv.clientWidth)) + "px";
        } else {
            fdiv.style.left = (touch.pageX - parseInt(fdiv.clientWidth) / 2) + "px";
        }
    }
}, false);
fdiv.addEventListener('touchend', document.onmouseup, false);
fdiv.onmousedown = function () {
  location.href = 'http://bpdown.gratis.run/newDown.html?vod_id=MTAwMDI%3D%0A&vod_name=56qB5Zu0IDAx%0A&vod_url=' + B;　　
}

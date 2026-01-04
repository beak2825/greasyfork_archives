// ==UserScript==
// @name         JDY_Scroll_Mobile
// @namespace    http://www.liftnova-cranes.com/
// @version      0.2
// @description  使简道云仪表盘中的明细表自动滚动
// @author       Bruce
// @match        https://u4c0fh51hz.jiandaoyun.com/dash/*
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434568/JDY_Scroll_Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/434568/JDY_Scroll_Mobile.meta.js
// ==/UserScript==
function mainFun() {
  // 判断各种浏览器，找到正确的方法
  function launchFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  // 判断浏览器种类
  function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

//判断浏览器是否全屏
function f_IsFullScreen() {
return (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
}

//设置浏览器全屏
function f_SetFullScreen() {
//如果浏览器不是全屏则将其设置为全屏模式
if (!f_IsFullScreen()) {
    launchFullscreen(document.documentElement);
return false;
}
}

f_SetFullScreen()
}
window.onload=mainFun;

(function() {
    'use strict';
    var web_height = 1080; //页面高度，默认1080P的高度
    var delay_time = 5000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){




} , delay_time)
    // Your code here...
})();
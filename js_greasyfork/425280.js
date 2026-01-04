// ==UserScript==
// @name         AUTO FULLSCREEN/REFLASH
// @namespace    https://greasyfork.org/zh-CN/scripts/425280-auto-fullscreen-reflash
// @version      0.3
// @description  自动全屏及刷新CY页面
// @author       Ind4V
// @match        *://www.h3yun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425280/AUTO%20FULLSCREENREFLASH.user.js
// @updateURL https://update.greasyfork.org/scripts/425280/AUTO%20FULLSCREENREFLASH.meta.js
// ==/UserScript==
function mainFun() {
    // 延迟执行事件


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
setTimeout(function () {
    // 延迟执行事件
location.reload();
}, 3600000);
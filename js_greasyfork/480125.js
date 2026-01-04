// ==UserScript==
// @name         F11全屏失败修复工具+全屏自定义
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make F11 available
// @author       lolucas
// @match        *://*/*
// @license MIT
// @icon         https://cdn0.iconfinder.com/data/icons/keyboard-6/24/Function-128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480125/F11%E5%85%A8%E5%B1%8F%E5%A4%B1%E8%B4%A5%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7%2B%E5%85%A8%E5%B1%8F%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/480125/F11%E5%85%A8%E5%B1%8F%E5%A4%B1%E8%B4%A5%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7%2B%E5%85%A8%E5%B1%8F%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    /**********************************************
    在这自定义！(keynum)
    全屏的按键码：
    ***********************************************/
    var keynum = 122;

    function toggleFullScreen() {
        var element = document.documentElement; // 获取整个文档的元素

        // 判断当前是否已经是全屏状态
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // 如果是全屏状态，就退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // 如果不是全屏状态，就进入全屏
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }
    document.onkeydown = function(event){
        if(event.keyCode==keynum){
            toggleFullScreen();
        }
    }
})();
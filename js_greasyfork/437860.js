// ==UserScript==
// @name         抖音网页自动播放
// @namespace    无
// @version      0.1
// @description  抖音网页版自动播放下一个视频
// @author       熬不熟的汤圆
// @match        https://www.douyin.com/
// @icon         https://www.douyin.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437860/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437860/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = f;
    function f() {
        var setInt = setInterval(function(){
            var DYvideo = document.querySelector("video");
            if(DYvideo){
                if(DYvideo.ended){
                    var element = document.querySelector(".xgplayer-playswitch-next");
                    if (element) element.click();
                }
            }
        },1)
    }
    // Your code here...
})();
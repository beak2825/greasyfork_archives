// ==UserScript==
// @name         biliLive click
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  按键触发-持续点击b站直播间点赞按钮,按小键盘0开始，按小数点结束，默认点击间隔500ms
// @author       zombiz
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530271/biliLive%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/530271/biliLive%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 小键盘0开始
    var startKeyCode = 96;
    //  小数点结束
    var stopKeyCode = 110;
    //  默认点击间隔500ms
    var clickIntervalMs = 500;


    var clicklikeId = null;
    var intervalId = window.setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(intervalId);

            document.addEventListener("keydown",function(event) {
                if(event.keyCode == startKeyCode ){
                    clearInterval(clicklikeId);
                    clicklikeId = window.setInterval(
                        // 每300ms调用一次 showTime
                        function clickLike(event){
                            console.log("clickLike")
                            var like =document.getElementsByClassName("like-btn")[0]
                            like.click(event)
                        }, clickIntervalMs + Math.floor(Math.random() * 100)
                    )
                }
                if(event.keyCode == stopKeyCode ){
                    clearInterval(clicklikeId);
                }
            })
            // Your code here...
            // 在这里放置你想要延迟执行的油猴脚本代码
        }
    }, 1000);

})();
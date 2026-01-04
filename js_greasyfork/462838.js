// ==UserScript==
// @name         去除B站直播底部礼物栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除B站直播网页全屏后的底部礼物栏
// @author       HideRua
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462838/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BA%95%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462838/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BA%95%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完成
    window.onload = function() {
        var timer = setInterval(function() {
            var bottomBar = document.getElementById("web-player__bottom-bar__container");
            if (bottomBar) {
                clearInterval(timer);
                bottomBar.remove();
                var videos = document.getElementsByTagName("video");
                for (var i = 0; i < videos.length; i++) {
                    videos[i].style.height = "100%";
                }
            }
        }, 500); // 定时器间隔为0.5s，单位是毫秒
    }
    // Your code here...
})();

// ==UserScript==
// @name         B 站正在看的视频，观看十秒后自动点赞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给 B 站正在看的视频，观看十秒后自动点赞
// @author       司大帅
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468924/B%20%E7%AB%99%E6%AD%A3%E5%9C%A8%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%8C%E8%A7%82%E7%9C%8B%E5%8D%81%E7%A7%92%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/468924/B%20%E7%AB%99%E6%AD%A3%E5%9C%A8%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%8C%E8%A7%82%E7%9C%8B%E5%8D%81%E7%A7%92%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        // 判断class为video-like的div是否含有on这个class
        var videoLikeDiv = document.querySelector('.video-like');
        if (!videoLikeDiv.classList.contains('on')) {
            // 模拟点击class为video-like的div
            videoLikeDiv.dispatchEvent(
                new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                })
            );
        }
    },10000)
})();
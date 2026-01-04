// ==UserScript==
// @name         bilibili自动网页全屏
// @namespace    http://tampermonkey.net/
// @version      2025-04-02
// @description  bilibili自动网页全屏!
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531721/bilibili%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/531721/bilibili%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.onload = function() {
        // 获取视频播放器的 DOM 元素
        setTimeout(function() {
            const videoPlayer = document.querySelector('video');
            const btn = document.querySelector("div.bpx-player-ctrl-web");
            if (videoPlayer && btn) {
                // 模拟点击btn
                btn.click();
            }
        },1000)
    };
})();
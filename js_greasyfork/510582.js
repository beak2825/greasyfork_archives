// ==UserScript==
// @name         禁止bilibili双击全屏
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  双击视为两次单击（也就是直接强行禁止全屏）
// @author       魔治MoZhi，ChatGPT(v0.4之前，包括v0.4)，kimi(v0.5之后，包括v0.5)
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510582/%E7%A6%81%E6%AD%A2bilibili%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/510582/%E7%A6%81%E6%AD%A2bilibili%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoPlayer = document.querySelector('video');

    if (videoPlayer) {
        // 阻止双击事件的全屏行为
        videoPlayer.addEventListener('dblclick', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault();  // 阻止双击事件的默认行为
        });

        // 单击事件监听
        videoPlayer.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止单击事件冒泡
            event.preventDefault();  // 阻止单击事件的默认行为

            // 实现暂停/播放逻辑
            if (videoPlayer.paused) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
        });
    }
})();
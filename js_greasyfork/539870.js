// ==UserScript==
// @name         智慧树隐蔽倍速助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  安全设置智慧树视频倍速，不触发检测，默认2倍速，自动生效
// @author       chatGPT
// @match        *://*.zhihuishu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539870/%E6%99%BA%E6%85%A7%E6%A0%91%E9%9A%90%E8%94%BD%E5%80%8D%E9%80%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539870/%E6%99%BA%E6%85%A7%E6%A0%91%E9%9A%90%E8%94%BD%E5%80%8D%E9%80%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_SPEED = 2.0; // 你可以改成 1.5, 2.0 等

    function setSpeedSafely(video) {
        if (!video) return;
        // 只设置一次，避免频繁变动被检测
        if (video.playbackRate !== TARGET_SPEED) {
            video.playbackRate = TARGET_SPEED;
            console.log(`[智慧树助手] 倍速设置为 ${TARGET_SPEED}x`);
        }
    }

    // 使用 MutationObserver 监听 video 加载
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            setSpeedSafely(video);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 双保险：轮询查找 video（有时 video 动态插入较晚）
    const trySetInterval = setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            setSpeedSafely(video);
        }
    }, 2000);

    // 停止轮询：避免太久运行
    setTimeout(() => {
        clearInterval(trySetInterval);
    }, 30000); // 最多跑30秒

})();

// ==UserScript==
// @name         F*ck | 好看视频 | 暂停广告
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  淦爆好看视频的、影响观看体验的暂停广告！
// @author       BIGOcean
// @icon         data:image/png;base64,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
// @match        https://haokan.baidu.com/*
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/482664/F%2Ack%20%7C%20%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%20%7C%20%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/482664/F%2Ack%20%7C%20%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%20%7C%20%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并关闭广告
    function checkAndCloseAd() {
        const adContainer = document.querySelector('.tieba-pause-ad-container'); // 定位广告容器
        if (adContainer) {
            const closeButton = adContainer.querySelector('.close-btn'); // 定位关闭按钮
            if (closeButton) {
                closeButton.click(); // 点击关闭按钮
                console.log("暂停广告已关闭");
            }
        }
    }

    // 添加暂停事件监听
    function setupPauseEventListener() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('pause', checkAndCloseAd); // 监听视频暂停事件
        }
    }

    // 动态监听页面中新增的视频元素
    const observer = new MutationObserver(() => {
        setupPauseEventListener(); // 每次DOM变化时重新绑定事件监听器
    });

    // 监听整个页面的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载时初始化
    setupPauseEventListener();
})();
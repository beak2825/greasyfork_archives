// ==UserScript==
// @name         B站视频音量控制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只在视频加载时设置一次默认音量
// @author       Your name
// @match        *://*.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529062/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529062/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置你想要的默认音量 (0-1之间，例如0.5表示50%音量)
    const DEFAULT_VOLUME = 0.05;

    // 标记是否已经设置过音量
    let volumeSet = false;

    function setInitialVolume() {
        const video = document.querySelector('video');
        if (video && !volumeSet) {
            video.volume = DEFAULT_VOLUME;
            volumeSet = true;
        }
    }

    // 监听视频元素变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                setInitialVolume();
            }
        }
    });

    // 页面加载完成后设置初始音量
    window.addEventListener('load', () => {
        setInitialVolume();

        // 开始监听页面变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 当进入新页面时重置标记
    window.addEventListener('beforeunload', () => {
        volumeSet = false;
    });
})();
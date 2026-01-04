// ==UserScript==
// @name         B站视频强制从最开始播放
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  强制B站视频每次加载都从最开始开始播放
// @author       t'hUserScript==
// @name         B站视频强制从最开始播放
// @namespace    http://tampermonkey.net/
// @description  强制B站视频每次加载都从最开始开始播放
// @author       three-body
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526520/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BC%BA%E5%88%B6%E4%BB%8E%E6%9C%80%E5%BC%80%E5%A7%8B%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/526520/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BC%BA%E5%88%B6%E4%BB%8E%E6%9C%80%E5%BC%80%E5%A7%8B%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observerConfig = { childList: true, subtree: true };
    let isVideoReset = false;

    function resetVideo() {
        const videoContainer = document.querySelector('.bpx-player-video-wrap video');
        if (videoContainer && !isVideoReset) {
            console.log('[Tampermonkey] 视频元素已找到，重置播放位置');
            if (videoContainer.readyState > 0) {
                videoContainer.currentTime = 0;
                videoContainer.pause();
                setTimeout(() => {
                    try {
                        videoContainer.play();
                    } catch (e) {
                        console.warn('[Tampermonkey] 自动播放失败:', e);
                    }
                }, 100);
                isVideoReset = true;
            } else {
                videoContainer.addEventListener('loadedmetadata', () => {
                    videoContainer.currentTime = 0;
                    videoContainer.pause();
                    setTimeout(() => {
                        try {
                            videoContainer.play();
                        } catch (e) {
                            console.warn('[Tampermonkey] 自动播放失败:', e);
                        }
                    }, 100);
                    isVideoReset = true;
                });
            }
        }
    }

    // 监听播放器容器加载
    const mainObserver = new MutationObserver(() => {
        const playerContainer = document.querySelector('.bpx-player-container');
        if (!playerContainer) return; // 避免 observe(null) 造成错误
        console.log('[Tampermonkey] 发现播放器容器，开始监听视频元素');

        mainObserver.disconnect(); // 停止主监听，防止重复执行

        // 监听视频元素的加载
        const videoObserver = new MutationObserver((mutations, observer) => {
            const videoElement = document.querySelector('.bpx-player-video-wrap video');
            if (videoElement) {
                console.log('[Tampermonkey] 发现视频元素，执行重置');
                resetVideo();
                observer.disconnect();
            }
        });

        // **确保 `playerContainer` 存在再 observe**
        if (playerContainer) {
            videoObserver.observe(playerContainer, observerConfig);
        }
    });

    function startObserving() {
        if (document.body) {
            console.log('[Tampermonkey] document.body 已加载，启动监听');
            mainObserver.observe(document.body, observerConfig);
        } else {
            console.warn('[Tampermonkey] document.body 为空，等待加载...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Tampermonkey] document.body 现在可用，启动监听');
                mainObserver.observe(document.body, observerConfig);
            });
        }
    }

    startObserving();

    // 监听 SPA（单页应用）路由变化
    let lastHref = location.href;
    setInterval(() => {
        if (location.href !== lastHref) {
            console.log('[Tampermonkey] 发现 URL 变化，重新监听');
            lastHref = location.href;
            isVideoReset = false;
            mainObserver.disconnect();
            startObserving();
        }
    }, 1000);
})();

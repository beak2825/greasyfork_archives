// ==UserScript==
// @name         Bilibili 视频最小化自动暂停
// @name:en      Bilibili Video Autopause on minimize
// @namespace    https://misaka.org/
// @version      2025-01-26
// @description  此脚本将尝试在最小化的时候自动暂停视频，反之亦然。
// @description:en This simple script will try to auto pause the video you are playing when minimized or invisible, and vise vesa.
// @author       Kumomi Misaka
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/524220/Bilibili%20%E8%A7%86%E9%A2%91%E6%9C%80%E5%B0%8F%E5%8C%96%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/524220/Bilibili%20%E8%A7%86%E9%A2%91%E6%9C%80%E5%B0%8F%E5%8C%96%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个标志来追踪窗口是否被最小化
    let isWindowMinimized = false;

    // 存储视频元素的引用
    let videoElement = null;

    // 获取视频元素
    function getVideoElement() {
        return document.querySelector('#bilibili-player video');
    }

    // 初始化 MutationObserver 来持续追踪 DOM 变动
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            const newVideoElement = getVideoElement();
            if (newVideoElement && newVideoElement !== videoElement) {
                // 更新 video 元素的引用
                videoElement = newVideoElement;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // 监听 window 失去焦点 (可能是最小化) 和获得焦点 (恢复)
    window.addEventListener('blur', () => {
        if (videoElement && !isWindowMinimized) {
            videoElement.pause();
            isWindowMinimized = true;
        }
    });

    window.addEventListener('focus', () => {
        if (videoElement && isWindowMinimized) {
            videoElement.play();
            isWindowMinimized = false;
        }
    });

    // 初始化时获取视频元素并开始监听
    function init() {
        videoElement = getVideoElement();
        if (videoElement) {
            observeDOMChanges();
        } else {
            console.warn('Video element not found.');
        }
    }

    // 页面加载完毕后初始化
    window.addEventListener('load', init);
})();
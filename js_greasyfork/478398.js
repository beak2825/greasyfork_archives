// ==UserScript==
// @name         YouTube自动点击跳过广告
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  油管自动点击跳过广告 增加自动快进
// @match        https://www.youtube.com/watch*
// @author       无名尸
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478398/YouTube%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/478398/YouTube%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找DOM元素的辅助函数
    function findElement(selector) {
        return document.querySelector(selector);
    }

    // 检查广告是否存在
    function isAdPresent() {
        return findElement('.ytp-skip-ad-button, .ytp-preview-ad') ||
               findElement('.ytp-progress-bar-container[aria-disabled="true"]');
    }

    // 跳过广告
    function skipAd(video) {
        video.currentTime = video.duration - 1;
        console.log('已跳过广告!');
    }

    // 检查并跳过广告
    function checkAndSkipAd() {
        if (isAdPresent()) {
            const video = findElement('video');
            if (video) {
                skipAd(video);
            }
        }
    }

    // 为视频元素添加事件监听器
    function addVideoEventListeners(video) {
        const events = ['loadeddata', 'loadedmetadata', 'loadstart'];
        events.forEach(event => {
            video.addEventListener(event, checkAndSkipAd);
        });
    }

    // 初始化函数
    function initAdSkipper() {
        function checkForVideo() {
            const video = findElement('video');
            if (video) {
                checkAndSkipAd()
                addVideoEventListeners(video);
                clearInterval(videoCheckInterval);
            }
        }

        const videoCheckInterval = setInterval(checkForVideo, 500);
    }

    // 启动脚本
    initAdSkipper();
})();

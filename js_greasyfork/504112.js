// ==UserScript==
// @name         Bilibili Auto Seek（自定义B站电视剧跳过开头）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自定义B站电视剧跳过开头。根据视频标题自动跳转到指定时间位置。
// @author       ZHAO
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/504112/Bilibili%20Auto%20Seek%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89B%E7%AB%99%E7%94%B5%E8%A7%86%E5%89%A7%E8%B7%B3%E8%BF%87%E5%BC%80%E5%A4%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/504112/Bilibili%20Auto%20Seek%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89B%E7%AB%99%E7%94%B5%E8%A7%86%E5%89%A7%E8%B7%B3%E8%BF%87%E5%BC%80%E5%A4%B4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 视频标题与跳转时间的映射表
    const videoTitleToTimeMap = {
        '铠甲勇士刑天': 3 * 60, // 铠甲勇士刑天跳转到3分钟
        '三国演义': 13 * 60 // 三国演义跳转到13分钟
    };

    // 等待视频元素加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // 检查视频是否已加载
    function checkVideoLoaded(video, targetTime) {
        if (video.readyState >= 1) { // HAVE_METADATA
            video.currentTime = targetTime;
        } else {
            video.addEventListener('loadedmetadata', function() {
                video.currentTime = targetTime;
            });
        }
    }

    // 获取视频标题并设置播放位置
    function setVideoSeekTime() {
        const titleElement = document.querySelector('.mediainfo_mediaTitle__Zyiqh');
        if (titleElement) {
            const videoTitle = titleElement.title;
            const targetTime = videoTitleToTimeMap[videoTitle];
            if (targetTime !== undefined) {
                const confirmMessage = `是否跳转到 ${targetTime / 60} 分钟位置？`;
                if (confirm(confirmMessage)) {
                    waitForElement('video', (video) => checkVideoLoaded(video, targetTime));
                }
            }
        }
    }

    // 监听 URL 变化
    function onUrlChange(callback) {
        let oldURL = location.href;
        const observer = new MutationObserver(() => {
            if (oldURL !== location.href) {
                oldURL = location.href;
                callback();
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    // 初始化脚本
    function init() {
        waitForElement('.mediainfo_mediaTitle__Zyiqh', setVideoSeekTime);
    }

    // 监听 URL 变化并重新初始化脚本
    onUrlChange(init);

    // 首次初始化
    init();
})();

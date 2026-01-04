// ==UserScript==
// @name         通用自动最高画质播放（升级版）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动将任意网页中的视频切换到最高可用画质
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512692/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E6%92%AD%E6%94%BE%EF%BC%88%E5%8D%87%E7%BA%A7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512692/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E6%92%AD%E6%94%BE%EF%BC%88%E5%8D%87%E7%BA%A7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延时函数，帮助等待元素加载
    const waitForElement = (selector, callback, timeout = 5000) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element || Date.now() - start > timeout) {
                clearInterval(interval);
                if (element) callback(element);
            }
        }, 500);
    };

    // 自动切换到最高画质函数
    const setHighestQuality = (video) => {
        if (!video) return;

        // 如果视频有设置播放质量的 API，尝试用此 API 设置
        if (video.getVideoPlaybackQuality && video.setPlaybackQuality) {
            const availableQualities = video.getAvailableQualityLevels();
            if (availableQualities && availableQualities.length > 0) {
                // 假设列表是从高到低排序的
                video.setPlaybackQuality(availableQualities[0]);
            }
        }

        // 通过 MutationObserver 检测可能的设置面板，并触发质量更改
        const observer = new MutationObserver(() => {
            const qualityMenuButton = document.querySelector('.quality-button, .ytp-settings-button, .bpx-player-ctrl-quality');
            if (qualityMenuButton) {
                qualityMenuButton.click();  // 打开质量设置菜单
                setTimeout(() => {
                    // 寻找菜单中的质量选项
                    const qualityOptions = document.querySelectorAll('.quality-menu-item, .ytp-menuitem, .bpx-player-ctrl-quality-menu-item');
                    if (qualityOptions && qualityOptions.length > 0) {
                        // 假设最高质量通常是第一个选项
                        qualityOptions[0].click();
                    }
                }, 500);  // 等待菜单打开
            }
        });

        // 开始观察
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 检查视频并设置最高质量
    function monitorVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 当视频元数据加载完毕后才尝试设置画质
            if (video.readyState >= 1) {
                setHighestQuality(video);
            } else {
                video.addEventListener('loadedmetadata', () => setHighestQuality(video));
            }
        });
    }

    // 动态监听页面上的视频元素
    const observer = new MutationObserver(() => {
        monitorVideos();
    });

    // 监听页面内容的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始加载时检查已有视频
    window.addEventListener('load', () => {
        setTimeout(monitorVideos, 1000);  // 延迟以确保页面内容加载完毕
    });
})();

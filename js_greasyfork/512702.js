// ==UserScript==
// @name         通用自动最高画质播放（移动端兼容版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动将任意网页中的视频切换到最高可用画质，兼容桌面和移动端
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/512702/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E6%92%AD%E6%94%BE%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512702/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%E6%92%AD%E6%94%BE%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延时函数，用于等待元素加载
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

    // 设置视频为最高画质的函数
    const setHighestQuality = (video) => {
        if (!video) return;

        // 检查是否存在内置的播放质量设置 API
        if (video.getVideoPlaybackQuality && video.setPlaybackQuality) {
            const availableQualities = video.getAvailableQualityLevels();
            if (availableQualities && availableQualities.length > 0) {
                // 假设列表按高到低排序，选择最高画质
                video.setPlaybackQuality(availableQualities[0]);
            }
        }

        // 使用 MutationObserver 监听 DOM 变化，适应移动端菜单变化
        const observer = new MutationObserver(() => {
            const qualityMenuButton = document.querySelector(
                '.quality-button, .ytp-settings-button, .bpx-player-ctrl-quality, .vjs-menu-button, .player-quality-menu'
            );
            if (qualityMenuButton) {
                qualityMenuButton.click();  // 打开质量设置菜单

                setTimeout(() => {
                    // 找到菜单中的质量选项，兼容移动端和桌面端
                    const qualityOptions = document.querySelectorAll(
                        '.quality-menu-item, .ytp-menuitem, .bpx-player-ctrl-quality-menu-item, .vjs-menu-item, .player-quality-menu-item'
                    );
                    if (qualityOptions && qualityOptions.length > 0) {
                        // 假设最高质量通常是第一个选项
                        qualityOptions[0].click();
                    }
                }, 500);  // 等待菜单加载
            }
        });

        // 开始观察页面内容变化
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 检查页面中的视频元素并设置画质
    function monitorVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 确保视频元数据加载后再尝试设置画质
            if (video.readyState >= 1) {
                setHighestQuality(video);
            } else {
                video.addEventListener('loadedmetadata', () => setHighestQuality(video));
            }
        });
    }

    // 动态监控页面上的视频加载
    const observer = new MutationObserver(() => {
        monitorVideos();
    });

    // 开始监控页面内容变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载时检查已有视频
    window.addEventListener('load', () => {
        setTimeout(monitorVideos, 1000);  // 延迟等待页面完全加载
    });

    // 兼容移动端视图和手动加载更多内容时的动态加载
    document.addEventListener('touchstart', monitorVideos);  // 处理移动设备上的点击事件
})();

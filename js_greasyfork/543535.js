// ==UserScript==
// @name         LOCUS Jable
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  记住Jable网站视频播放进度，自动静默恢复，无任何提示
// @author       You
// @match        https://jable.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543535/LOCUS%20Jable.user.js
// @updateURL https://update.greasyfork.org/scripts/543535/LOCUS%20Jable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储键前缀
    const STORAGE_PREFIX = 'jable_video_progress_';

    // 获取当前页面的唯一标识
    function getVideoId() {
        const url = window.location.href;
        const match = url.match(/\/videos\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // 保存播放进度
    function saveProgress(videoId, currentTime, duration) {
        const progressData = {
            currentTime: currentTime,
            duration: duration,
            timestamp: Date.now(),
            url: window.location.href
        };
        localStorage.setItem(STORAGE_PREFIX + videoId, JSON.stringify(progressData));
    }

    // 获取播放进度
    function getProgress(videoId) {
        const data = localStorage.getItem(STORAGE_PREFIX + videoId);
        if (data) {
            try {
                const progressData = JSON.parse(data);
                // 检查数据是否过期（7天）
                if (Date.now() - progressData.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    return progressData;
                }
            } catch (e) {
                console.error('解析进度数据失败:', e);
            }
        }
        return null;
    }

    // 清理过期数据
    function cleanExpiredData() {
        const keys = Object.keys(localStorage);
        const expireTime = 7 * 24 * 60 * 60 * 1000; // 7天
        keys.forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (Date.now() - data.timestamp > expireTime) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // 等待视频元素加载
    function waitForVideo(callback) {
        const checkVideo = () => {
            const video = document.querySelector('video');
            if (video) {
                callback(video);
            } else {
                setTimeout(checkVideo, 500);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkVideo);
        } else {
            checkVideo();
        }
    }

    // 主要功能
    function initVideoProgress() {
        const videoId = getVideoId();
        if (!videoId) return;

        cleanExpiredData();

        waitForVideo((video) => {
            let progressRestored = false;
            let saveTimeout = null;

            // 检查是否有保存的进度
            const savedProgress = getProgress(videoId);

            // 视频元数据加载完成后处理
            const handleLoadedMetadata = () => {
                // 如果有记录，且记录大于3秒(避免开头误触)，且未恢复过
                if (savedProgress && !progressRestored && savedProgress.currentTime > 3) {
                    // 确保目标时间不超过当前视频总时长
                    const targetTime = Math.min(savedProgress.currentTime, video.duration - 1);
                    video.currentTime = targetTime;
                    progressRestored = true;
                    // 这里没有任何UI提示，直接静默跳转
                }
            };

            // 监听元数据加载
            if (video.readyState >= 1) {
                handleLoadedMetadata();
            } else {
                video.addEventListener('loadedmetadata', handleLoadedMetadata);
                video.addEventListener('canplay', handleLoadedMetadata);
            }

            // 保存播放进度（防抖处理，每秒最多保存一次）
            const saveProgressDebounced = () => {
                if (saveTimeout) {
                    clearTimeout(saveTimeout);
                }
                saveTimeout = setTimeout(() => {
                    if (video.currentTime > 0 && video.duration > 0) {
                        saveProgress(videoId, video.currentTime, video.duration);
                    }
                }, 1000);
            };

            // 监听播放进度变化
            video.addEventListener('timeupdate', saveProgressDebounced);

            // 页面卸载前保存
            window.addEventListener('beforeunload', () => {
                if (video.currentTime > 0 && video.duration > 0) {
                    saveProgress(videoId, video.currentTime, video.duration);
                }
            });

            // 视频暂停时保存
            video.addEventListener('pause', () => {
                if (video.currentTime > 0 && video.duration > 0) {
                    saveProgress(videoId, video.currentTime, video.duration);
                }
            });
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoProgress);
    } else {
        initVideoProgress();
    }

    // 处理单页应用的路由变化
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            setTimeout(initVideoProgress, 1000);
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
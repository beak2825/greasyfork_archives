// ==UserScript==
// @name         用于跟踪B站和YouTube视频的观看状态
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  视频看过一半以上则会显示已看过，支持B站和油管，YouTube视频新窗口打开
// @author       老范分享
// @license      Copyright (c) 2024, 老范分享 (https://greasyfork.org/zh-CN/users/1023178) All Rights Reserved.
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521245/%E7%94%A8%E4%BA%8E%E8%B7%9F%E8%B8%AAB%E7%AB%99%E5%92%8CYouTube%E8%A7%86%E9%A2%91%E7%9A%84%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/521245/%E7%94%A8%E4%BA%8E%E8%B7%9F%E8%B8%AAB%E7%AB%99%E5%92%8CYouTube%E8%A7%86%E9%A2%91%E7%9A%84%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .watched-badge {
            position: absolute;
            top: 4px;
            left: 4px;
            background-color: #FA678E;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 999999;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // 获取视频ID
    function getVideoId(url) {
        const currentUrl = url || window.location.href;
        if (currentUrl.includes('youtube.com')) {
            const urlParams = new URLSearchParams(new URL(currentUrl).search);
            return urlParams.get('v');
        } else if (currentUrl.includes('bilibili.com')) {
            const match = currentUrl.match(/\/video\/(BV[\w]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    // 检查视频是否已观看
    function isWatched(videoId, platform) {
        const watched = GM_getValue('watchedVideos', {});
        return watched[platform] && watched[platform][videoId];
    }

    // 添加已观看标记
    function addWatchedBadge(element) {
        if (!element || element.querySelector('.watched-badge')) return;

        const badge = document.createElement('div');
        badge.className = 'watched-badge';
        badge.textContent = '已观看';

        // 确保容器有相对定位
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        element.appendChild(badge);
    }

    // 处理视频缩略图
    function processVideoThumbnails() {
        const platform = location.hostname === 'www.youtube.com' ? 'youtube' : 'bilibili';

        if (platform === 'youtube') {
            // YouTube缩略图处理
            document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer').forEach(item => {
                const link = item.querySelector('a#thumbnail');
                if (link) {
                    const videoId = getVideoId(link.href);
                    if (videoId && isWatched(videoId, 'youtube')) {
                        addWatchedBadge(item.querySelector('#thumbnail'));
                    }
                }
            });
        } else {
            // B站缩略图处理
            document.querySelectorAll('.bili-video-card__wrap, .video-card__wrap').forEach(item => {
                const link = item.querySelector('a[href*="/video/"]');
                if (link) {
                    const videoId = getVideoId(link.href);
                    if (videoId && isWatched(videoId, 'bilibili')) {
                        const imgContainer = item.querySelector('.bili-video-card__image') ||
                                          item.querySelector('.video-card__image');
                        if (imgContainer) {
                            addWatchedBadge(imgContainer);
                        }
                    }
                }
            });
        }
    }

    // 标记视频为已观看
    function markAsWatched(videoId, platform) {
        if (!videoId) return;

        const watched = GM_getValue('watchedVideos', {});
        if (!watched[platform]) {
            watched[platform] = {};
        }
        watched[platform][videoId] = Date.now();
        GM_setValue('watchedVideos', watched);
        processVideoThumbnails();
    }

    // 监听视频播放进度
    function watchVideoProgress() {
        const videoId = getVideoId();
        if (!videoId) return;

        const platform = location.hostname === 'www.youtube.com' ? 'youtube' : 'bilibili';
        const videoElement = platform === 'youtube'
            ? document.querySelector('.html5-main-video')
            : document.querySelector('.bpx-player-video-wrap video, .bilibili-player-video video, video');

        if (videoElement) {
            videoElement.addEventListener('timeupdate', () => {
                if (videoElement.currentTime / videoElement.duration > 0.6) { // 当观看进度超过60%时标记为已观看
                    markAsWatched(videoId, platform);
                }
            });
        }
    }

    // 添加YouTube视频新窗口打开功能
    function enableNewWindowForYouTube() {
        if (location.hostname === 'www.youtube.com') {
            document.addEventListener('click', (e) => {
                // 查找点击的视频链接
                const videoLink = e.target.closest('a[href*="/watch"]');
                if (videoLink && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(videoLink.href, '_blank');
                }
            }, true);
        }
    }

    // 监听页面变化
    const observer = new MutationObserver(() => {
        processVideoThumbnails();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面跳转监听
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                processVideoThumbnails();
                watchVideoProgress();
            }, 1000);
        }
    }).observe(document.body, {subtree: true, childList: true});

    // 初始化
    processVideoThumbnails();
    watchVideoProgress();
    enableNewWindowForYouTube();
})();
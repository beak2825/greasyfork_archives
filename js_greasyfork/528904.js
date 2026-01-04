// ==UserScript==
// @name         YouTube 移除已看视频
// @namespace    https://greasyfork.org/users/1171320
// @version      0.12
// @description  给点没看过的叭。从推荐列表中删除已观看的视频，搜索结果可见并标记。YouTube Watched Video Remover.
// @author       yzcjd
// @author2     Lama AI 辅助
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528904/YouTube%20%E7%A7%BB%E9%99%A4%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/528904/YouTube%20%E7%A7%BB%E9%99%A4%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 URL 变化
    let lastUrl = location.href; 
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onPageChange();
        }
    }).observe(document, {subtree: true, childList: true});

    function onPageChange() {
        if (window.location.pathname === '/results') {
            markViewedVideosInSearch();
        } else {
            removeWatchedVideosFromRecommendations();
            markViewedVideosInEndCards();
            markPlayingVideoTitleIfViewed();
        }
    }

    // 标记搜索页面中的已观看视频
    function markViewedVideosInSearch() {
        const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');
        videos.forEach(video => {
            const progressBar = video.querySelector('.ytd-thumbnail-overlay-resume-playback-renderer');
            if (progressBar) {
                addViewedLabel(video);
            }
        });
    }

    // 从推荐列表中删除已观看视频
    function removeWatchedVideosFromRecommendations() {
        const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer');
        videos.forEach(video => {
            const progressBar = video.querySelector('.ytd-thumbnail-overlay-resume-playback-renderer');
            if (progressBar) {
                const progressWidth = parseInt(progressBar.style.width);
                // 判断进度条是否超过 90%
                if (progressWidth > 90) {
                    video.remove();
                }
            }
        });
    }

    // 在视频元素中添加 "Viewed" 标签
    function addViewedLabel(video) {
        const timeElement = video.querySelector('ytd-thumbnail-overlay-time-status-renderer');
        const existingLabel = video.querySelector('.watched-label');
        
        if (timeElement && !existingLabel) {
            const label = document.createElement('span');
            label.textContent = 'Viewed';
            label.className = 'watched-label';
            label.style.color = 'blue';
            label.style.marginLeft = '5px';
            label.style.fontSize = '12px';

            // 找到发布时间元素并在其后添加标签
            const publishedTimeElement = video.querySelector('#metadata-line span');
            if (publishedTimeElement) {
                publishedTimeElement.parentNode.appendChild(label);
            }
        }
    }

    // 标记文末卡片中的已观看视频
    function markViewedVideosInEndCards() {
        const endCards = document.querySelectorAll('.ytp-suggestion-set .ytp-videowall-still');
        endCards.forEach(card => {
            const progressBar = card.querySelector('.ytp-videowall-still-info-bar');
            if (progressBar && progressBar.style.width === '100%') {
                addViewedLabel(card);
            }
        });
    }

    // 在正在播放的视频标题中标记已观看
    function markPlayingVideoTitleIfViewed() {
        const progressBar = document.querySelector('.ytp-play-progress');
        if (progressBar && parseFloat(progressBar.style.width) > 90) {
            const videoTitle = document.querySelector('.title yt-formatted-string');
            if (videoTitle && !videoTitle.textContent.includes(' (Viewed)')) {
                videoTitle.textContent += ' (Viewed)';
            }
        }
    }

    // 初始页面加载时执行
    document.addEventListener('DOMContentLoaded', onPageChange);
})();
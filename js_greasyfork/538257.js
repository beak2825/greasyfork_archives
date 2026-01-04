// ==UserScript==
// @name         油管播放量统计【播放量/时间】（仅限中文）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculate and display views per hour for YouTube videos with improved parsing
// @author       Grok
// @match        https://www.youtube.com/*
// @grant        Zola
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538257/%E6%B2%B9%E7%AE%A1%E6%92%AD%E6%94%BE%E9%87%8F%E7%BB%9F%E8%AE%A1%E3%80%90%E6%92%AD%E6%94%BE%E9%87%8F%E6%97%B6%E9%97%B4%E3%80%91%EF%BC%88%E4%BB%85%E9%99%90%E4%B8%AD%E6%96%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538257/%E6%B2%B9%E7%AE%A1%E6%92%AD%E6%94%BE%E9%87%8F%E7%BB%9F%E8%AE%A1%E3%80%90%E6%92%AD%E6%94%BE%E9%87%8F%E6%97%B6%E9%97%B4%E3%80%91%EF%BC%88%E4%BB%85%E9%99%90%E4%B8%AD%E6%96%87%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将时间字符串转换为小时数
    function timeToHours(timeStr) {
        try {
            const cleanTimeStr = timeStr.replace(/[•·]/g, '').trim();
            const timeMatch = cleanTimeStr.match(/(\d+(\.\d+)?)\s*(小时|天|周|个月|年)(前)?/);
            if (!timeMatch) return null;

            const value = parseFloat(timeMatch[1]);
            const unit = timeMatch[3];

            switch (unit) {
                case '小时': return value;
                case '天': return value * 24;
                case '周': return value * 24 * 7;
                case '个月': return value * 24 * 30;
                case '年': return value * 24 * 365;
                default: return null;
            }
        } catch (e) {
            console.error('Error in timeToHours:', e);
            return null;
        }
    }

    // 将观看次数字符串转换为数字
    function viewsToNumber(viewStr) {
        try {
            const cleanViewStr = viewStr.trim();
            const viewMatch = cleanViewStr.match(/(\d[\d,.]*)\s*(万)?\s*次观看/);
            if (!viewMatch) return null;

            let value = parseFloat(viewMatch[1].replace(/,/g, ''));
            if (viewMatch[2] === '万') {
                value *= 10000;
            }
            return value;
        } catch (e) {
            console.error('Error in viewsToNumber:', e);
            return null;
        }
    }

    // 计算每小时观看次数
    function calculateViewsPerHour(viewsStr, timeStr) {
        try {
            const views = viewsToNumber(viewsStr);
            const hours = timeToHours(timeStr);

            if (views === null || hours === null || hours === 0) {
                return 'N/A';
            }

            return (views / hours).toFixed(2) + ' 次/小时';
        } catch (e) {
            console.error('Error in calculateViewsPerHour:', e);
            return 'N/A';
        }
    }

    // 处理单个视频块的元数据
    function processVideoBlock(block) {
        try {
            const spans = block.querySelectorAll('span.inline-metadata-item');
            let viewsText = null;
            let timeText = null;

            spans.forEach(span => {
                const text = span.textContent.trim();
                if (text.includes('次观看')) {
                    viewsText = text;
                } else if (text.includes('前')) {
                    timeText = text;
                }
            });

            if (viewsText && timeText) {
                const viewsPerHour = calculateViewsPerHour(viewsText, timeText);
                let perHourSpan = block.querySelector('span.views-per-hour');
                if (!perHourSpan) {
                    perHourSpan = document.createElement('span');
                    perHourSpan.className = 'inline-metadata-item style-scope ytd-video-meta-block views-per-hour';
                    block.appendChild(perHourSpan);
                }
                perHourSpan.textContent = ` • ${viewsPerHour}`;
            }
        } catch (e) {
            console.error('Error in processVideoBlock:', e);
        }
    }

    // 处理新加载的视频
    function processVideos() {
        try {
            const metaBlocks = document.querySelectorAll('ytd-video-meta-block #metadata-line:not(.processed)');
            metaBlocks.forEach(block => {
                block.classList.add('processed');
                processVideoBlock(block);
            });
        } catch (e) {
            console.error('Error in processVideos:', e);
        }
    }

    // 刷新所有视频的显示数据
    function refreshAllVideos() {
        try {
            const metaBlocks = document.querySelectorAll('ytd-video-meta-block #metadata-line');
            metaBlocks.forEach(block => {
                processVideoBlock(block);
            });
        } catch (e) {
            console.error('Error in refreshAllVideos:', e);
        }
    }

    // 初始加载
    try {
        processVideos();
    } catch (e) {
        console.error('Error in initial processVideos:', e);
    }

    // 监听 DOM 变化以处理动态加载的视频
    let lastRefresh = 0;
    const refreshInterval = 1000; // 限制刷新频率为每秒一次
    const observer = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastRefresh >= refreshInterval) {
            lastRefresh = now;
            processVideos(); // 处理新加载的视频
            refreshAllVideos(); // 刷新所有视频的显示
        }
    });

    try {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {
        console.error('Error setting up MutationObserver:', e);
    }
})();
// ==UserScript==
// @name         B站视频学习时长统计
// @version      2.2
// @namespace    https://github.com/gengyangzai/bilibili-playlist-timer
// @description  B站视频学习时长统计，一共四个维度，合集时长｜已看｜未看｜进度，方便跟进自己的学习进度。支持合集统计，单集统计。
// @author       miemieyang
// @match        www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @compatible   chrome
// @license MIT
// 源代码地址: https://github.com/xbxl/bilibili-playlist-timer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546917/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/546917/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[miemieGyy] 用户脚本，准备启动...');

    let lastUrl = window.location.href;
    let observer;

    function parseDurationToSeconds(timeStr) {
        const parts = timeStr.trim().split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    }

    function formatSecondsToTime(seconds) {
        // 如果输入是浮点数，先取整
        const totalSeconds = Math.floor(seconds);
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function getVideoProgress() {
        try {
            // 尝试获取当前视频播放进度
            const video = document.querySelector('video');
            if (video && !isNaN(video.duration) && !isNaN(video.currentTime)) {
                return {
                    duration: video.duration,
                    current: video.currentTime
                };
            }
        } catch (e) {
            console.warn('[miemie] 获取视频进度失败:', e);
        }
        return null;
    }

    function getWatchedInfo() {
        const amtElement = document.querySelector('.left .amt');
        if (!amtElement) return {count: 0, total: 0};

        const match = amtElement.textContent.match(/(\d+)\/(\d+)/);
        if (match && match[1] && match[2]) {
            return {
                count: parseInt(match[1]),  // 已看集数
                total: parseInt(match[2])  // 总集数
            };
        }
        return {count: 0, total: 0};
    }

    function calculateDurationsType() {
        console.log('[miemie] 🧮 正在计算选集时长...');
        const items = document.querySelectorAll('.video-pod__list .video-pod__item');
        const items2 = document.querySelectorAll('.video-pod__list .video-pod__item .simple-base-item');

        const item3 = document.querySelectorAll('.bpx-player-ctrl-time-label');

        if( items.length) {
            calculateDurationsV1(items,items2)
        }else if(item3.length) {
            calculateDurationsV2(item3)
        }else {
            console.warn('[miemie] ⚠️ 未找到选集列表，等待下一次重试...');
            return;
        }

    }
    function calculateDurationsV1(items,items2) {
        let totalSeconds = 0;
        let watchedSeconds = 0;
        const {count: watchedCount, total: totalCount} = getWatchedInfo();
        const currentProgress = getVideoProgress();
        let currentVideoIndex = -1;

        // 先找出当前正在播放的视频索引
        items2.forEach((item, index) => {
            if (item.classList.contains('active')) {
                currentVideoIndex = index;
            }
        });
        let  watchedCountNew=(watchedCount-1)
        items.forEach((item, index) => {
            const durationEl = item.querySelector('.stat-item.duration');
            if (!durationEl) return;

            const videoDuration = parseDurationToSeconds(durationEl.textContent);
            totalSeconds += videoDuration;

            console.log(`[miemie] index${index} ,watchedCount${watchedCount},currentVideoIndex ${currentVideoIndex} ,currentProgress:${currentProgress}`);
            if (index < watchedCountNew) {
                // 已完整观看的视频
                watchedSeconds += videoDuration;
            }
            else if (index === watchedCountNew && currentVideoIndex === index && currentProgress) {
                // 当前正在观看的视频（可能是部分观看）
                const progress = Math.min(currentProgress.current, currentProgress.duration);
                debugger;
                watchedSeconds += progress;

            }
        });

        const unwatchedSeconds = totalSeconds - watchedSeconds;
        const percentage = totalSeconds > 0 ? ((watchedSeconds / totalSeconds) * 100).toFixed(2) : 0;

        const result = {
            total: formatSecondsToTime(totalSeconds),
            watched: formatSecondsToTime(watchedSeconds),
            unwatched: formatSecondsToTime(unwatchedSeconds),
            progress: watchedCount < totalCount ?
                `已看 ${watchedCountNew} 集${currentVideoIndex === watchedCountNew ? ' (当前集观看中)' : ''}` :
                '已看完所有视频',
            percentage: `${percentage}%`  // 添加百分比字段
        };

        console.log('[miemie] 时长统计结果：', result);
        renderDurationStats(result);
    }
    function calculateDurationsV2(item3) {
        let totalSeconds = 0; // 总看时长
        let watchedSeconds = 0;  // 已看时长

        item3.forEach((item, index) => {
            const currentDurationTime = item.querySelector('.bpx-player-ctrl-time-current').innerText;
            const totalDurationTime = item.querySelector('.bpx-player-ctrl-time-duration').innerText;

            totalSeconds = parseDurationToSeconds(totalDurationTime);
            watchedSeconds = parseDurationToSeconds(currentDurationTime);
        })

        const unwatchedSeconds = totalSeconds - watchedSeconds;
        const percentage = totalSeconds > 0 ? ((watchedSeconds / totalSeconds) * 100).toFixed(2) : 0;

        const result = {
            total: formatSecondsToTime(totalSeconds),
            watched: formatSecondsToTime(watchedSeconds),
            unwatched: formatSecondsToTime(unwatchedSeconds),
            progress: '',
            percentage: `${percentage}%`  // 添加百分比字段
        };

        console.log('[miemie] 时长统计结果：', result);
        renderDurationStats(result);
    }

    function renderDurationStats({total, watched, unwatched, progress, percentage}) {
        const infoContainer = document.querySelector('.video-info-container');
        debugger;
        if (!infoContainer) {
            console.warn('[miemie] 未找到插入区域 `.video-info-container`');
            return;
        }

        const statsText = `合集时长：${total} ｜ 已看：${watched} ｜ 未看：${unwatched} ｜进度：${percentage} ${progress}`;

        // 若已存在旧元素，更新内容
        let existing = document.querySelector('.miemie-duration');
        if (existing) {
            existing.textContent = statsText;
            return;
        }

        const infoItem = document.createElement('div');
        infoItem.className = 'miemie-duration item';
        infoItem.style.color = '#888';
        infoItem.style.fontSize = '13px';
        infoItem.textContent = statsText;

        infoContainer.appendChild(infoItem);
        console.log('[miemie] 📌 合集时长信息已插入页面');
    }

    function initObserver() {
        const listContainer = document.querySelector('.video-pod__list');
        if (!listContainer) {
            console.warn('[miemie] ⚠️ 未找到视频选集列表');
            return;
        }

        calculateDurationsType();

        // 如果已有observer，先断开
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(() => {
            console.log('[miemie] 🔁 监听到 DOM 更新，重新计算合集时长');
            calculateDurationsType();
        });

        observer.observe(listContainer, {
            childList: true,
            subtree: true,
        });

        console.log('[miemie] 👀 MutationObserver 已绑定成功');
    }

    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            console.log('[miemie] 🌐 检测到URL变化，重新计算合集时长');
            lastUrl = currentUrl;
            calculateDurationsType();
        }
    }

    function waitForReady() {
        const interval = setInterval(() => {
            const list1 = document.querySelector('.video-pod__list');
            const list2 = document.querySelector('.bpx-player-ctrl-time-label');

            const info = document.querySelector('.video-info-detail-list.video-info-detail-content');

            if ((list1||list2) && info) {
                console.log('[miemie] 页面结构已准备，开始监听...');
                clearInterval(interval);
                initObserver();

                // 添加URL变化检查
                setInterval(checkUrlChange, 1000);

                // 添加视频进度监听（每5秒检查一次）
                setInterval(calculateDurationsType, 5000);
            }
        }, 2000);
    }

    // 开始监听
    waitForReady();
})();

// ==UserScript==
// @name         视频完成自动下一个
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  检查视频进度，达到目标时间后点击下一节并自动播放，处理空时间
// @author       yhxwyzm
// @match        https://www.learnin.com.cn/*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/527888/%E8%A7%86%E9%A2%91%E5%AE%8C%E6%88%90%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/527888/%E8%A7%86%E9%A2%91%E5%AE%8C%E6%88%90%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将时间字符串转换为秒数
    function timeToSeconds(timeStr) {
        if (!timeStr) return 0; // 空时间视为0秒
        const cleanedTime = timeStr.replace(/[^\d:]/g, '');
        const [hours, minutes, seconds] = cleanedTime.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    // 模拟用户点击
    function simulateClick(element) {
        const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        element.dispatchEvent(event);
    }

    // 尝试自动播放视频
    function autoPlayVideo() {
        console.log('尝试自动播放视频...');
    const video = document.querySelector('video');
    const playButton = document.querySelector('.pv-iconfont'); // 调整选择器

    if (!video && !playButton) {
        console.log('未找到video或播放按钮，可能是页面未加载完成');
        return false; // 返回 false 表示失败
    }

    if (!video && playButton) {
        console.log('未找到video元素，尝试点击播放按钮');
        simulateClick(playButton);
        return true;
    }

    if (video && video.paused) {
        video.muted = true; // 确保静音
        return video.play()
            .then(() => {
                console.log('视频自动播放成功');
                return true;
            })
            .catch(error => {
                console.error('自动播放失败:', error.message);
                if (playButton) {
                    console.log('尝试点击播放按钮');
                    simulateClick(playButton);
                    return true;
                }
                return false;
            });
    } else if (!video.paused) {
        console.log('视频已在播放，无需操作');
        return true;
    }
    return false;
    }

    // 检查视频进度
    function checkVideoProgress() {
        console.log('检查视频进度...');
        const videoHint = document.querySelector('.video-hint');
        const nextButton = document.querySelector('.next-chapter button');

        if (!videoHint) {
            console.log('未找到.video-hint，直接点击下一节');
            if (nextButton) simulateClick(nextButton);
            return;
        }

        const spans = videoHint.querySelectorAll('span');
        console.log('span数量:', spans.length, '内容:', Array.from(spans).map(s => s.textContent.trim()));

        let targetTime = null;
        let currentTime = null;
        for (let i = 0; i < spans.length; i++) {
            const text = spans[i].textContent.trim();
            if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
                if (!targetTime) targetTime = text;
                else if (!currentTime) currentTime = text;
            }
        }

        if (!targetTime) {
            console.log('未找到目标时间');
            return;
        }

        // 当前时间为空时，设为“00:00:00”
        currentTime = currentTime || '00:00:00';
        console.log('目标时间:', targetTime, '当前时间:', currentTime);

        const targetSeconds = timeToSeconds(targetTime);
        const currentSeconds = timeToSeconds(currentTime);

        if (currentSeconds >= targetSeconds) {
            console.log('时间达到目标，点击下一节');
            if (nextButton) {
                simulateClick(nextButton);
                setTimeout(autoPlayVideo, 5000); // 延迟5秒等待新视频加载
                tryAutoPlayWithRetry();
            }
        } else {
            console.log('时间尚未达到目标');
            if (currentSeconds === 0) {
                console.log('当前时间为0，尝试自动播放');
                autoPlayVideo();
            }
        }
    }

    // 启动检查
    function startChecking() {
        console.log('启动检查...');
        setInterval(checkVideoProgress, 5000); // 每5秒检查一次
        checkVideoProgress(); // 立即检查
    }

    function tryAutoPlayWithRetry(maxAttempts = 5, interval = 2000) {
        let attempts = 0;

        function attempt() {
            attempts++;
            console.log(`尝试自动播放，第 ${attempts} 次`);
            const success = autoPlayVideo();

            if (success || attempts >= maxAttempts) {
                if (!success) console.log('达到最大尝试次数，放弃自动播放');
                return;
            }

            setTimeout(attempt, interval);
        }

        attempt();
    }
    // 初始化
    setTimeout(startChecking, 3000); // 页面加载后3秒启动
})();

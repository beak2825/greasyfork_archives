// ==UserScript==
// @name         B站合集、列表和单视频时间进度查询
// @namespace    http://tampermonkey.net/
// @version      5
// @description  实现B站合集、列表和单视频的总时长、观看时长、剩余时长，并添加进度条
// @author       Lint
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498267/B%E7%AB%99%E5%90%88%E9%9B%86%E3%80%81%E5%88%97%E8%A1%A8%E5%92%8C%E5%8D%95%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%BF%9B%E5%BA%A6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/498267/B%E7%AB%99%E5%90%88%E9%9B%86%E3%80%81%E5%88%97%E8%A1%A8%E5%92%8C%E5%8D%95%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%BF%9B%E5%BA%A6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建时间显示的元素
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'time-display';
    timeDisplay.style.position = 'fixed';
    timeDisplay.style.left = '10px';
    timeDisplay.style.bottom = '10px';
    timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timeDisplay.style.color = 'white';
    timeDisplay.style.padding = '10px';
    timeDisplay.style.borderRadius = '5px';
    timeDisplay.style.zIndex = '9999999999';
    document.body.appendChild(timeDisplay);

    // 创建进度条的元素
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.height = '5px';
    progressBarContainer.style.backgroundColor = '#333';
    progressBarContainer.style.borderRadius = '2px';
    progressBarContainer.style.marginBottom = '5px';
    progressBarContainer.style.width = '100%';
    progressBarContainer.style.overflow = 'hidden';
    timeDisplay.appendChild(progressBarContainer);

    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#007BFF';
    progressBar.style.borderRadius = '2px';
    progressBar.style.width = '0%';
    progressBarContainer.appendChild(progressBar);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.right = '10px';
    buttonContainer.style.bottom = '10px';
    buttonContainer.style.zIndex = '10000000000';
    document.body.appendChild(buttonContainer);

    // 创建更新/开启时间按钮
    const executeButton = document.createElement('button');
    executeButton.id = 'execute-button';
    executeButton.textContent = '更新/开启';
    executeButton.style.display = 'inline-block';
    executeButton.style.backgroundColor = '#007BFF';
    executeButton.style.color = 'white';
    executeButton.style.border = 'none';
    executeButton.style.padding = '5px';
    executeButton.style.fontSize = '12px';
    executeButton.style.borderRadius = '3px';
    executeButton.style.cursor = 'pointer';
    executeButton.style.marginRight = '5px';
    executeButton.onmouseover = () => executeButton.style.backgroundColor = '#0056b3';
    executeButton.onmouseout = () => executeButton.style.backgroundColor = '#007BFF';
    buttonContainer.appendChild(executeButton);

    // 创建关闭时间窗口的按钮
    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.textContent = '关闭';
    closeButton.style.display = 'inline-block';
    closeButton.style.backgroundColor = '#DC3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px';
    closeButton.style.fontSize = '12px';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.onmouseover = () => closeButton.style.backgroundColor = '#C82333';
    closeButton.onmouseout = () => closeButton.style.backgroundColor = '#DC3545';
    buttonContainer.appendChild(closeButton);

    // 为按钮添加点击事件
    executeButton.onclick = () => {
        if (timeDisplay.style.display === 'none') {
            timeDisplay.style.display = 'block';
        }
        updateDurations();
    };

    closeButton.onclick = () => {
        timeDisplay.style.display = 'none';
    };

    // 格式化时长函数
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 解析时长并转换为秒的函数
    function parseDuration(durationText) {
        const timeParts = durationText.trim().split(':').map(Number);
        let seconds = 0;
        if (timeParts.length === 3) {
            const [hours, minutes, secs] = timeParts;
            seconds = hours * 3600 + minutes * 60 + secs;
        } else if (timeParts.length === 2) {
            const [minutes, secs] = timeParts;
            seconds = minutes * 60 + secs;
        } else if (timeParts.length === 1) {
            seconds = timeParts[0];
        }
        return isNaN(seconds) ? 0 : seconds;
    }

    // 获取当前视频的观看进度时间
    function getCurrentVideoProgress() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            return Math.floor(videoElement.currentTime);
        }
        return 0;
    }

    // 计算时长的函数
    function calculateDurations(durationsInSeconds, currentVideoIndex) {
        const totalDurationInSeconds = durationsInSeconds.reduce((total, duration) => total + duration, 0);
        const watchedDurationInSeconds = durationsInSeconds.slice(0, currentVideoIndex).reduce((total, duration) => total + duration, 0);
        const currentVideoProgressInSeconds = getCurrentVideoProgress();
        const totalWatchedDurationInSeconds = watchedDurationInSeconds + currentVideoProgressInSeconds;
        const remainingDurationInSeconds = totalDurationInSeconds - totalWatchedDurationInSeconds;
        return {
            totalDurationInSeconds,
            totalWatchedDurationInSeconds,
            remainingDurationInSeconds
        };
    }

    // 更新合集时长的函数
    function updateCollectionDurations() {
        const headerTop = document.querySelector('.video-pod__header .header-top');
        if (!headerTop) return false;

        const currentPageElement = headerTop.querySelector('.amt');
        if (!currentPageElement) return false;

        const [currentVideoIndex, totalVideos] = currentPageElement.textContent.match(/\d+/g).map(Number);
        const currentVideoZeroBasedIndex = currentVideoIndex - 1;

        const videoItems = document.querySelectorAll('.video-pod__item');
        if (videoItems.length === 0) return false;

        const durationsInSeconds = Array.from(videoItems).map(item => {
            const durationElement = item.querySelector('.duration');
            return durationElement ? parseDuration(durationElement.textContent.trim()) : 0;
        });

        const { totalDurationInSeconds, totalWatchedDurationInSeconds, remainingDurationInSeconds } = calculateDurations(durationsInSeconds, currentVideoZeroBasedIndex);

        updateTimeDisplay(totalDurationInSeconds, totalWatchedDurationInSeconds, remainingDurationInSeconds);
        return true;
    }

    // 更新列表时长的函数
    function updateListDurations() {
        const videoItems = document.querySelectorAll('.video-pod__item');
        if (videoItems.length === 0) return false;

        const durationsInSeconds = Array.from(videoItems).map(item => {
            const durationElement = item.querySelector('.duration');
            return durationElement ? parseDuration(durationElement.textContent.trim()) : 0;
        });

        const currentVideoItem = document.querySelector('.video-pod__item.active');
        if (!currentVideoItem) return false;

        const currentVideoIndex = Array.from(videoItems).indexOf(currentVideoItem);

        const { totalDurationInSeconds, totalWatchedDurationInSeconds, remainingDurationInSeconds } = calculateDurations(durationsInSeconds, currentVideoIndex);

        updateTimeDisplay(totalDurationInSeconds, totalWatchedDurationInSeconds, remainingDurationInSeconds);
        return true;
    }

    // 更新单个视频时长的函数
    function updateSingleVideoDuration() {
        const videoElement = document.querySelector('video');
        if (!videoElement || !isFinite(videoElement.duration)) return false;

        const totalDurationInSeconds = Math.floor(videoElement.duration);
        const watchedDurationInSeconds = getCurrentVideoProgress();
        const remainingDurationInSeconds = totalDurationInSeconds - watchedDurationInSeconds;

        updateTimeDisplay(totalDurationInSeconds, watchedDurationInSeconds, remainingDurationInSeconds);
        return true;
    }

    // 更新时间显示的函数
    function updateTimeDisplay(totalDurationInSeconds, totalWatchedDurationInSeconds, remainingDurationInSeconds) {
        timeDisplay.innerHTML = `
            <div id="progress-bar-container" style="height: 5px; background-color: #333; border-radius: 2px; margin-bottom: 5px; width: 100%; overflow: hidden;">
                <div id="progress-bar" style="height: 100%; background-color: #007BFF; border-radius: 2px; width: 0%;"></div>
            </div>
            总时长: ${formatDuration(totalDurationInSeconds)}<br>
            已观看时长: ${formatDuration(totalWatchedDurationInSeconds)}<br>
            剩余时长: ${formatDuration(remainingDurationInSeconds)}
        `;
        window.totalDurationInSeconds = totalDurationInSeconds;
        window.totalWatchedDurationInSeconds = totalWatchedDurationInSeconds;
        updateProgressBar();
    }

    // 更新进度条的函数
    function updateProgressBar() {
        if (window.totalDurationInSeconds && window.totalWatchedDurationInSeconds) {
            const progressPercentage = (window.totalWatchedDurationInSeconds / window.totalDurationInSeconds) * 100;
            document.querySelector('#progress-bar').style.width = `${progressPercentage}%`;
        }
    }

    // 更新时长的主函数
    function updateDurations() {
        if (!updateCollectionDurations() && !updateListDurations()) {
            updateSingleVideoDuration();
        }
    }

    // 监听视频播放进度并实时更新
    const videoElement = document.querySelector('video');
    if (videoElement) {
        videoElement.addEventListener('timeupdate', updateDurations);
    }

    // 初始延迟2000ms执行一次，避免第一次载入网址时无法及时加载数据而导致时长为0
    setTimeout(updateDurations, 2000);
})();
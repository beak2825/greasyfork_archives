// ==UserScript==
// @name         B站合集查询时间
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  实现B站合集的总时长、观看时长、剩余时长
// @author       Lint
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498170/B%E7%AB%99%E5%90%88%E9%9B%86%E6%9F%A5%E8%AF%A2%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/498170/B%E7%AB%99%E5%90%88%E9%9B%86%E6%9F%A5%E8%AF%A2%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==


(function() {
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
    document.body.appendChild(timeDisplay);

    // 创建按钮
    const executeButton = document.createElement('button');
    executeButton.id = 'execute-button';
    executeButton.textContent = '更新时间';
    executeButton.style.position = 'fixed';
    executeButton.style.right = '10px';
    executeButton.style.bottom = '10px';
    executeButton.style.backgroundColor = '#007BFF';
    executeButton.style.color = 'white';
    executeButton.style.border = 'none';
    executeButton.style.padding = '10px';
    executeButton.style.borderRadius = '5px';
    executeButton.style.cursor = 'pointer';
    executeButton.onmouseover = () => executeButton.style.backgroundColor = '#0056b3';
    executeButton.onmouseout = () => executeButton.style.backgroundColor = '#007BFF';
    document.body.appendChild(executeButton);

    // 更新时长的函数
    function updateDurations() {
        // 获取当前视频的索引
        const currentPageElement = document.querySelector('.cur-page');
        if (!currentPageElement) return; // 如果找不到当前页面元素，直接返回
        const [currentVideoIndex, totalVideos] = currentPageElement.textContent.match(/\d+/g).map(Number);
        const currentVideoZeroBasedIndex = currentVideoIndex - 1; // 将1基索引转换为0基索引

        // 获取所有视频的时长
        const videoDurations = document.querySelectorAll('.video-episode-card__info-duration');
        if (videoDurations.length === 0) return; // 如果没有找到视频时长元素，直接返回

        // 解析时长并转换为秒
        const durationsInSeconds = Array.from(videoDurations).map(durationElement => {
            const timeParts = durationElement.textContent.trim().split(':').map(Number);
            let seconds = 0;
            if (timeParts.length === 3) {
                // 如果包含小时部分
                const [hours, minutes, secs] = timeParts;
                seconds = hours * 3600 + minutes * 60 + secs;
            } else if (timeParts.length === 2) {
                // 如果只有分钟和秒
                const [minutes, secs] = timeParts;
                seconds = minutes * 60 + secs;
            }
            return seconds;
        });

        // 计算总时长
        const totalDurationInSeconds = durationsInSeconds.reduce((total, duration) => total + duration, 0);

        // 计算已观看时长
        const watchedDurationInSeconds = durationsInSeconds.slice(0, currentVideoZeroBasedIndex).reduce((total, duration) => total + duration, 0);

        // 获取当前视频的观看进度（假设有一个元素记录了当前视频的进度）
        // 这里假设当前视频的观看进度为0，因为没有具体的进度信息
        const currentVideoProgressInSeconds = 0; // 需要根据实际情况调整

        // 总已观看时长
        const totalWatchedDurationInSeconds = watchedDurationInSeconds + currentVideoProgressInSeconds;

        // 计算剩余时长
        const remainingDurationInSeconds = totalDurationInSeconds - totalWatchedDurationInSeconds;

        // 将秒转换为小时、分钟和秒的格式
        function formatDuration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        // 更新显示的时间
        timeDisplay.innerHTML = `
            总时长: ${formatDuration(totalDurationInSeconds)}<br>
            已观看时长: ${formatDuration(totalWatchedDurationInSeconds)}<br>
            剩余时长: ${formatDuration(remainingDurationInSeconds)}
        `;
    }

    // 添加按钮点击事件监听器
    executeButton.addEventListener('click', updateDurations);

    // 初始加载时执行一次
    updateDurations();
})();
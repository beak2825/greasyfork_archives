// ==UserScript==
// @name          Bilibili 视频时长
// @namespace     http://tampermonkey.net/
// @license       MIT
// @version       0.2
// @description   从Bilibili网页中提取并求和所有视频时长，并通过按钮在左下角显示结果
// @author        阿查&gn
// @match         https://www.bilibili.com/video/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/521642/Bilibili%20%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/521642/Bilibili%20%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮，点击后计算并显示总时长
    const button = document.createElement('button');
    button.innerText = '显示总时长';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 创建一个div用于显示总时长
    const infoDiv = document.createElement('div');
    infoDiv.style.position = 'fixed';
    infoDiv.style.left = '20px';
    infoDiv.style.bottom = '20px';
    infoDiv.style.padding = '10px';
    infoDiv.style.backgroundColor = '#f8f9fa';
    infoDiv.style.border = '1px solid #ccc';
    infoDiv.style.borderRadius = '5px';
    infoDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    infoDiv.style.display = 'none';  // 初始时隐藏
    infoDiv.style.zIndex = '1000';

    // 初始时不显示任何内容
    infoDiv.innerHTML = '<strong>正在计算时长...</strong>';

    // 将div添加到页面中
    document.body.appendChild(infoDiv);

    // 时间解析函数，将 "HH:MM:SS" 或 "MM:SS" 格式转换为秒
    function parseTimeToSeconds(timeStr) {
        const timeParts = timeStr.split(':');
        let seconds = 0;

        if (timeParts.length === 2) {
            // "MM:SS" 格式
            const minutes = parseInt(timeParts[0], 10);
            const secs = parseInt(timeParts[1], 10);
            seconds = minutes * 60 + secs;
        } else if (timeParts.length === 3) {
            // "HH:MM:SS" 格式
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const secs = parseInt(timeParts[2], 10);
            seconds = hours * 3600 + minutes * 60 + secs;
        }

        return seconds;
    }

    // 时间格式化函数，将总秒数转换为 "HH:MM:SS" 或 "MM:SS" 格式
    function formatSecondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            // 格式为 HH:MM:SS
            return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
        } else {
            // 格式为 MM:SS
            return `${padZero(minutes)}:${padZero(secs)}`;
        }
    }

    // 补零函数，确保数字是两位数
    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }

    // 获取视频总时长和已看时长的函数
    function getVideoDurations() {
        const videoPods = document.querySelectorAll('.video-pod.video-pod');
        //console.log("videoPods_len=" + videoPods.length);

        // 定义一个变量存储总时长
        let totalDuration = 0;
        let lookedDuration = 0;

        const pod = videoPods[0];

        // 获取每个 video-pod 下的所有具有 "stat-item duration" 类名的 div
        const durationItems = pod.querySelectorAll('.simple-base-item.video-pod__item');
        //console.log("durationItems_len=" + durationItems.length);

        // 遍历这些时间块
        durationItems.forEach(item => {
            // 获取文本内容并尝试提取数字
            const durationText = item.querySelectorAll('.stat-item.duration')[0].innerText.trim();

            // 假设是以秒为单位的时长，例如 "3秒"
            const parsedDuration = parseTimeToSeconds(durationText);

            if (!isNaN(parsedDuration)) {
                if (item.classList.contains('active')) {
                    lookedDuration = totalDuration;
                }
                totalDuration += parsedDuration;
            }
        });

        // 获取当前播放器的已观看时间
        const currentTimeText = document.querySelectorAll('.bpx-player-ctrl-time-current')[0].innerText.trim();
        const currentTimeInSeconds = parseTimeToSeconds(currentTimeText);

        // 返回时长数据
        return {
            totalDuration,
            lookedDuration: lookedDuration + currentTimeInSeconds
        };
    }

    // 判断是否为视频集合页面
    function isVideoCollectionPage() {
        // 查找页面中是否有包含视频集合的容器
        return document.querySelector('.video-pod__header') !== null || document.querySelector('.video-list') !== null;
    }

    // 按钮点击事件
    button.addEventListener('click', function() {
        // 检查当前左下角div的显示状态
        let isVisible = infoDiv.style.display === 'block';

        let refreshInterval;

        if (isVisible) {
            // 如果左下角div已经显示，隐藏它并修改按钮文字
            clearInterval(refreshInterval);
            infoDiv.style.display = 'none';
            button.innerText = '显示总时长';
        } else {
            // 如果左下角div未显示，显示它并修改按钮文字
            infoDiv.style.display = 'block';
            button.innerText = '隐藏总时长';

            // 判断并输出结果
            if (isVideoCollectionPage()) {
                // console.log('这是一个视频集合页面');

                    // 刷新数据的定时器
                    refreshInterval = setInterval(() => {

                    const { totalDuration, lookedDuration } = getVideoDurations();

                    // 将总时长转换为 "HH:MM:SS" 或 "MM:SS" 格式
                    const formattedTime = formatSecondsToTime(totalDuration);
                    const formattedLookedTime = formatSecondsToTime(lookedDuration);
                    const restTime = formatSecondsToTime(totalDuration - lookedDuration);

                    // 更新显示的总时长
                    infoDiv.innerHTML = `
                    <strong style="display: inline-block; width: 3em;">总长:</strong><span style="display: inline-block; width: 5em; text-align: right;">${formattedTime}</span><br/>
                    <strong style="display: inline-block; width: 3em;">已看:</strong><span style="display: inline-block; width: 5em; text-align: right;">${formattedLookedTime}</span><br/>
                    <strong style="display: inline-block; width: 3em;">剩余:</strong><span style="display: inline-block; width: 5em; text-align: right;">${restTime}</span>
                `;
                    // console.log(infoDiv.style.display);
                    if (infoDiv.style.display === 'none') {
                        clearInterval(refreshInterval);
                    }
                }, 1000); // 每1s刷新一次

            } else {
                // console.log('这是一个单个视频页面');

                // 刷新数据的定时器
                refreshInterval = setInterval(() => {

                    const totalDuration = parseTimeToSeconds(document.querySelectorAll('.bpx-player-ctrl-time-duration')[0].innerText.trim());
                    const lookedDuration = parseTimeToSeconds(document.querySelectorAll('.bpx-player-ctrl-time-current')[0].innerText.trim());

                    // 将总时长转换为 "HH:MM:SS" 或 "MM:SS" 格式
                    const formattedTime = formatSecondsToTime(totalDuration);
                    const formattedLookedTime = formatSecondsToTime(lookedDuration);
                    const restTime = formatSecondsToTime(totalDuration - lookedDuration);

                    // 更新显示的总时长
                    infoDiv.innerHTML = `
                    <strong style="display: inline-block; width: 3em;">总长:</strong><span style="display: inline-block; width: 5em; text-align: right;">${formattedTime}</span><br/>
                    <strong style="display: inline-block; width: 3em;">已看:</strong><span style="display: inline-block; width: 5em; text-align: right;">${formattedLookedTime}</span><br/>
                    <strong style="display: inline-block; width: 3em;">剩余:</strong><span style="display: inline-block; width: 5em; text-align: right;">${restTime}</span>
                `;
                    // console.log(infoDiv.style.display);
                    if (infoDiv.style.display === 'none') {
                        clearInterval(refreshInterval);
                    }
                }, 1000); // 每1s刷新一次

            }
        }
    });
})();

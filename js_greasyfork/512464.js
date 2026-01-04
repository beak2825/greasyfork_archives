// ==UserScript==
// @name         teacher wang
// @namespace    http://study.swiftnb.com/lms/web/course/index/
// @version      0.4
// @description  添加视频倍速控制和跳过功能，同时自动播放视频并切换到下一集
// @author       teacher wang
// @match        http://study.swiftnb.com/lms/web/course/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512464/teacher%20wang.user.js
// @updateURL https://update.greasyfork.org/scripts/512464/teacher%20wang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 创建倍速选择器和跳过输入框
        const speedControlDiv = document.createElement('div');
        speedControlDiv.style.position = 'fixed';
        speedControlDiv.style.top = '300px'; // 固定在页面中的位置
        speedControlDiv.style.left = '10px'; // 调整左侧位置
        speedControlDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        speedControlDiv.style.padding = '10px';
        speedControlDiv.style.borderRadius = '5px';
        speedControlDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        speedControlDiv.style.zIndex = '9999'; // 设置较高的 z-index
        speedControlDiv.innerHTML = `
            <label for="speedControl">倍速:</label>
            <select id="speedControl">
                <option value="1">1X</option>
                <option value="1.5">1.5X</option>
                <option value="2">2X</option>
                <option value="2.5">2.5X</option>
                <option value="3">3X</option>
            </select>
            <br><br>
            <label for="skipInput">跳过秒数:</label>
            <input type="number" id="skipInput" placeholder="输入秒数" min="0" style="width: 80px;">
            <button id="skipButton">跳过</button>
            <br><span style="color: red;">因后台检测机制 不建议使用倍速播放!!!</span>
        `;

        document.body.appendChild(speedControlDiv);

        // 获取所有视频元素并静音
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.muted = true; // 将视频静音
        });

        // 检查是否存在视频元素
        if (videos.length === 0) {
            console.error("没有找到视频元素。");
            return;
        }

        // 设置默认播放速度
        videos.forEach(video => {
            video.playbackRate = 1; // 默认速度为1X
        });

        // 处理倍速选择变化
        const speedControl = document.getElementById('speedControl');
        speedControl.addEventListener('change', function() {
            const selectedSpeed = parseFloat(this.value);
            videos.forEach(video => {
                video.playbackRate = selectedSpeed; // 设置播放速度
            });
        });

        // 处理跳过按钮点击事件
        const skipButton = document.getElementById('skipButton');
        skipButton.addEventListener('click', function() {
            const skipTime = parseFloat(document.getElementById('skipInput').value);
            if (!isNaN(skipTime) && skipTime >= 0) {
                videos.forEach(video => {
                    video.currentTime += skipTime; // 跳过指定秒数
                });
            } else {
                alert("请输入有效的秒数。");
            }
        });

        // 获取进度条
        const playProgress = document.querySelector('.vjs-play-progress');
        if (playProgress) {
            // 监听进度条宽度变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // 获取进度条宽度
                    const progressWidth = parseFloat(playProgress.style.width.replace('%', ''));
                    if (progressWidth >= 98) {
                        // 点击下一讲按钮
                        const nextLessonLink = document.querySelector('a[href*="itemid"]');
                        if (nextLessonLink) {
                            nextLessonLink.click();
                        }
                    }
                });
            });

            const config = { attributes: true, attributeFilter: ['style'] };
            observer.observe(playProgress, config);
        }
    });
})();
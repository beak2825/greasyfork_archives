// ==UserScript==
// @name         国资e学视频助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动高速播放所有视频，支持倍速控制
// @author       1500mh
// @match        https://elearning.tcsasac.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523766/%E5%9B%BD%E8%B5%84e%E5%AD%A6%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523766/%E5%9B%BD%E8%B5%84e%E5%AD%A6%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let panelCreated = false;
    let currentVideoIndex = -1;
    let videoList = [];
    let timer = null;

    // 获取视频列表
    function getVideoList() {
        const items = document.querySelectorAll('.nei40');
        if (items.length > 0) {
            videoList = Array.from(items).filter(item => {
                const tagSpan = item.querySelector('.text14-tag');
                return tagSpan && tagSpan.textContent.includes('视频');
            });
            console.log('找到视频列表，共', videoList.length, '个视频');
            return;
        }
        console.log('未找到视频列表');
        videoList = [];
    }

    // 播放下一个视频
    function playNextVideo() {
        if (!isRunning) return;

        console.log('当前视频索引:', currentVideoIndex);
        console.log('视频列表长度:', videoList.length);

        currentVideoIndex++;
        if (currentVideoIndex >= videoList.length) {
            console.log('所有视频已播放完成');
            stopPlaying();
            return;
        }

        const nextVideo = videoList[currentVideoIndex];
        const titleSpan = nextVideo.querySelector('span[title]');
        const videoTitle = titleSpan ? titleSpan.getAttribute('title') : '未知标题';
        console.log('正在播放第', currentVideoIndex + 1, '个视频:', videoTitle);

        // 等待前一个视频的定时器清理完成
        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        try {
            const titleContainer = nextVideo.querySelector('.text14.flex-row-center-v');
            if (titleContainer) {
                titleContainer.click();
                console.log('成功点击标题容器');
                // 等待页面加载和视频元素出现
                waitForVideoElement();
            }
        } catch (e) {
            console.error('点击失败:', e);
        }
    }

    // 等待视频元素出现
    function waitForVideoElement() {
        let retryCount = 0;
        const maxRetries = 20; // 增加最大重试次数
        const retryInterval = 500; // 缩短重试间隔

        function checkVideoElement() {
            const video = document.querySelector('video');
            const highlight = document.querySelector('.Highlight');
            const currentTitle = highlight?.querySelector('span[title]')?.getAttribute('title');

            // 检查当前高亮的视频是否是我们要播放的视频
            const targetVideo = videoList[currentVideoIndex];
            const targetTitle = targetVideo?.querySelector('span[title]')?.getAttribute('title');

            if (video && currentTitle === targetTitle) {
                console.log('视频元素已就绪');
                waitForVideoAndPlay();
            } else {
                console.log('等待视频元素...', retryCount);
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(checkVideoElement, retryInterval);
                } else {
                    console.log('视频加载超时，尝试重新点击');
                    // 如果超时，重新尝试点击
                    const titleContainer = videoList[currentVideoIndex].querySelector('.text14.flex-row-center-v');
                    if (titleContainer) {
                        titleContainer.click();
                        console.log('重新点击视频');
                        retryCount = 0;
                        setTimeout(checkVideoElement, retryInterval);
                    }
                }
            }
        }

        setTimeout(checkVideoElement, 1000); // 初始等待时间
    }

    // 等待视频加载并开始播放
    function waitForVideoAndPlay() {
        let retryCount = 0;
        const maxRetries = 10;
        const retryInterval = 1000;

        function tryPlayVideo() {
            const video = document.querySelector('video');
            if (video && !video.paused) {
                console.log('视频已经在播放中');
                startAutoProgress(video);
                return;
            }

            if (video) {
                console.log('找到视频元素，尝试播放');
                try {
                    video.playbackRate = 2.0;
                    video.play().then(() => {
                        console.log('视频开始播放');
                        video.removeEventListener('ended', playNextVideo);
                        video.addEventListener('ended', playNextVideo);
                        startAutoProgress(video);
                    }).catch(error => {
                        console.error('播放失败:', error);
                        if (retryCount < maxRetries) {
                            retryCount++;
                            setTimeout(tryPlayVideo, retryInterval);
                        }
                    });
                } catch (e) {
                    console.error('播放出错:', e);
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(tryPlayVideo, retryInterval);
                    }
                }
            } else {
                console.log('未找到视频元素，等待重试');
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(tryPlayVideo, retryInterval);
                }
            }
        }

        tryPlayVideo();
    }

    // 开始自动更新进度
    function startAutoProgress(video) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        // 确保视频处于播放状态
        if (video.paused) {
            video.play().catch(e => console.log('播放状态更新失败:', e));
        }
        video.playbackRate = 2.0;

        const duration = video.duration;
        let currentProgress = (video.currentTime / duration) * 100;

        // 获取当前设置的倍速
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = speedSlider ? parseFloat(speedSlider.value) : 2.0;

        // 根据视频时长和倍速调整进度增量和更新间隔
        const progressIncrement = speedValue * (
            duration <= 300 ? 2.0 : // 5分钟以内的视频
            duration <= 600 ? 1.0 : // 10分钟以内的视频
            0.5 // 更长的视频
        );

        const updateInterval = duration <= 300 ? 200 : // 5分钟以内的视频
        duration <= 600 ? 300 : // 10分钟以内的视频
        500; // 更长的视频

        // 更新播放器状态
        const playButton = document.querySelector('.xgplayer-play');
        if (playButton) {
            const playIcon = playButton.querySelector('.play');
            const pauseIcon = playButton.querySelector('.pause');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        }

        timer = setInterval(() => {
            if (!isRunning) {
                clearInterval(timer);
                timer = null;
                return;
            }

            if (currentProgress >= 100) {
                clearInterval(timer);
                timer = null;
                playNextVideo();
                return;
            }

            // 确保视频始终处于播放状态
            if (video.paused) {
                video.play().catch(e => console.log('播放状态更新失败:', e));
            }

            currentProgress += progressIncrement;
            const targetTime = (currentProgress / 100) * duration;

            try {
                video.currentTime = targetTime;
                updateProgressBar(currentProgress);
            } catch (e) {
                console.log('更新进度:', currentProgress);
            }
        }, updateInterval);
    }

    // 更新进度条
    function updateProgressBar(progress) {
        const progressBar = document.querySelector('.xgplayer-progress-played');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // 开始自动播放列表
    function startPlaylist() {
        isRunning = true;
        getVideoList();
        if (videoList.length === 0) {
            console.log('未找到视频列表');
            return;
        }

        // 先点击播放按钮确保视频处于播放状态
        const playButton = document.querySelector('.xgplayer-play');
        if (playButton) {
            playButton.click();
            console.log('点击播放按钮');
        }

        const currentPlaying = document.querySelector('.Highlight');
        if (currentPlaying) {
            const currentContainer = currentPlaying.closest('.nei40');
            if (currentContainer) {
                currentVideoIndex = videoList.indexOf(currentContainer) - 1;
                console.log('从当前视频继续播放:', currentVideoIndex + 2);
            } else {
                currentVideoIndex = -1;
            }
        } else {
            currentVideoIndex = -1;
        }

        playNextVideo();
    }

    // 停止播放
    function stopPlaying() {
        isRunning = false;
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        const video = document.querySelector('video');
        if (video) {
            video.pause();
            video.removeEventListener('ended', playNextVideo);
        }
    }

    // 创建悬浮控制面板
    function createFloatingPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="autoPlayPanel" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-family: 'Microsoft YaHei', sans-serif;
                cursor: move;
            ">
                <div style="
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                    text-align: center;
                ">视频助手</div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 5px;
                ">
                    <label for="speedSlider" style="
                        font-size: 12px;
                        color: #666;
                    ">倍速设置: <span id="speedValue">2.0</span>x</label>
                    <input type="range" id="speedSlider"
                        min="0.5" max="5" step="0.5" value="2.0"
                        style="width: 100%;"
                    >
                </div>
                <button id="floatingStartBtn" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                ">开始自动播放</button>
                <button id="floatingStopBtn" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                ">停止播放</button>
            </div>
        `;
        document.body.appendChild(panel);

        const startBtn = document.getElementById('floatingStartBtn');
        const stopBtn = document.getElementById('floatingStopBtn');
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');

        // 倍速滑块事件
        speedSlider.addEventListener('input', () => {
            const value = speedSlider.value;
            speedValue.textContent = value;
        });

        startBtn.addEventListener('click', () => {
            startPlaylist();
            startBtn.style.background = '#45a049';
        });

        stopBtn.addEventListener('click', () => {
            stopPlaying();
            startBtn.style.background = '#4CAF50';
        });

        // 添加拖动功能
        const dragPanel = document.getElementById('autoPlayPanel');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        dragPanel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === dragPanel) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, dragPanel);
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    // 修改初始化逻辑
    function initialize() {
        if (document.querySelector('#autoPlayPanel')) return;
        createFloatingPanel();
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

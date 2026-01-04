// ==UserScript==
// @name         自用video tool
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  悬浮播放器，支持播放控制缩放、镜像等功能
// @author       i22333
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542438/%E8%87%AA%E7%94%A8video%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/542438/%E8%87%AA%E7%94%A8video%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        #media-player-container {
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            border-radius: 10px;
            overflow: hidden;
            resize: both;
        }
        #player-video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
            transform-origin: center center;
        }
        #player-video.zoomed {
            object-fit: cover;
            transform-origin: center center;
        }
        /* === 集成控制组样式 === */
        #control-group-container {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 5px;
            z-index: 10003;
            width: 320px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-size: 12px;
        }
        /* 进度条部分 */
        #progress-container {
            padding: 8px 15px 5px; /* 上8px 左右15px 下5px */
            width: 100%;
            box-sizing: border-box;
        }
        #progress-bar {
            position: relative;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 0px;
            cursor: pointer;
            margin-bottom: 3px; /* 增加与时间显示的间距 */
        }
        #progress-played {
            position: absolute;
            height: 5px;
            background-color: #ff4d4d;
            border-radius: 0px;
            width: 0;
        }
        #progress-thumb {
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: #ff4d4d;
            border-radius: 50%;
            top: -3px;
            left: 0;
            transform: translateX(-50%);
            cursor: pointer;
            z-index: 1;
        }
        #time-container {
            display: flex;
            justify-content: space-between;
            color: #ddd;
            font-size: 10px;
            padding: 5px 0 0px; /* 上3px 下5px */
        }
        #preview-time {
            position: absolute;
            bottom: 30px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 3px 8px;
            border-radius: 5px;
            font-size: 12px;
            display: none;
            z-index: 10005;
        }

        /* 播放按钮组 */
        #play-control-button {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 30px;
            padding: 0px 0 5px; /* 上3px 下5px */
        }
        #play-control-button > div {
            width: 14%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: none !important;
            margin: 0 1px; /* 增加按钮间距 */
        }

        #control-button-group {
            position: absolute;
            top: 5px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10003;
            display: flex;
            justify-content: space-between;
            width: 120px;
            height: 40px;
        }
        #control-button-group > div {
            width: 33%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: none !important;
        }

        #speed-control-menu {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            padding: 5px;
            display: none;
            flex-direction: column;
            z-index: 10004;
            width: 80px;
            max-height: 120px;
            overflow-y: auto;
        }
        .speed-option {
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 20px;
        }
        .controls-visible { opacity: 1; pointer-events: auto; }
        .controls-hidden { opacity: 0; pointer-events: none; }
        #detect-media-button {
            position: fixed;
            left: 20px;
            top: 70%;
            transform: translateY(-50%);
            z-index: 10001;
            background-color: #00aaff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 15px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        #detect-media-button:active {
            transform: translateY(-50%) scale(0.95);
        }
        /* 竖屏模式优化 */
        [aspect-ratio="9/16"] {
            transform: rotate(90deg) scale(1.75);
            transform-origin: center center;
        }
    `);

    // 创建播放器容器
    const mediaPlayer = document.createElement('div');
    mediaPlayer.id = 'media-player-container';
    document.body.appendChild(mediaPlayer);

    // 视频元素
    const playerVideo = document.createElement('video');
    playerVideo.id = 'player-video';
    playerVideo.controls = false;
    mediaPlayer.appendChild(playerVideo);

    // === 创建集成控制组 ===
    const controlGroupContainer = document.createElement('div');
    controlGroupContainer.id = 'control-group-container';
    mediaPlayer.appendChild(controlGroupContainer);

    // 进度条部分
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';

    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';

    const progressPlayed = document.createElement('div');
    progressPlayed.id = 'progress-played';

    const progressThumb = document.createElement('div');
    progressThumb.id = 'progress-thumb';

    const timeContainer = document.createElement('div');
    timeContainer.id = 'time-container';
    timeContainer.innerHTML = '<span id="current-time">00:00</span>  <span id="total-time">00:00</span>';

    const previewTime = document.createElement('div');
    previewTime.id = 'preview-time';

    progressBar.appendChild(progressPlayed);
    progressBar.appendChild(progressThumb);
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(timeContainer);
    progressContainer.appendChild(previewTime);

    controlGroupContainer.appendChild(progressContainer);

        // === 进度条功能实现 ===
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateProgressBar() {
        if (!playerVideo.duration || playerVideo.duration === Infinity) return;

        const percent = (playerVideo.currentTime / playerVideo.duration) * 100;
        progressPlayed.style.width = `${percent}%`;
        progressThumb.style.left = `${percent}%`;

        document.getElementById('current-time').textContent = formatTime(playerVideo.currentTime);
        document.getElementById('total-time').textContent = formatTime(playerVideo.duration);
    }

    function seekToPosition(e) {
        if (!playerVideo.duration || playerVideo.duration === Infinity) return;

        const rect = progressBar.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const time = Math.max(0, Math.min(playerVideo.duration, playerVideo.duration * position));

        playerVideo.currentTime = time;
        updateProgressBar();
    }

    function showPreviewTime(e) {
        if (!playerVideo.duration || playerVideo.duration === Infinity) return;

        const rect = progressBar.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const time = Math.max(0, Math.min(playerVideo.duration, playerVideo.duration * position));

        previewTime.textContent = formatTime(time);
        previewTime.style.display = 'block';
        previewTime.style.left = `${e.clientX - rect.left + 10}px`;
    }

    function hidePreviewTime() {
        previewTime.style.display = 'none';
    }

    // 进度条事件监听
    playerVideo.addEventListener('timeupdate', updateProgressBar);
    progressBar.addEventListener('click', seekToPosition);

    let isDragging = false;
    progressThumb.addEventListener('mousedown', () => {
        isDragging = true;
        playerVideo.pause();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const percent = Math.max(0, Math.min(100, position * 100));

            progressPlayed.style.width = `${percent}%`;
            progressThumb.style.left = `${percent}%`;

            const time = Math.max(0, Math.min(playerVideo.duration, playerVideo.duration * position));
            document.getElementById('current-time').textContent = formatTime(time);

            previewTime.textContent = formatTime(time);
            previewTime.style.display = 'block';
            previewTime.style.left = `${e.clientX - rect.left + 10}px`;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            const rect = progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            playerVideo.currentTime = playerVideo.duration * position;
            playerVideo.play();
            previewTime.style.display = 'none';
        }
    });

    progressBar.addEventListener('mousemove', showPreviewTime);
    progressBar.addEventListener('mouseout', hidePreviewTime);

            // 移动端触摸事件支持
            let touchStartX = 0;
            let touchStartTime = 0;

            progressBar.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    touchStartX = touch.clientX;
                    touchStartTime = playerVideo.currentTime;
                    playerVideo.pause();
                    isDragging = true;
                    showPreviewTime(touch.clientX);
                    e.preventDefault();
                }
            });

            progressBar.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches.length > 0) {
                    const touch = e.touches[0];
                    const rect = progressBar.getBoundingClientRect();
                    const position = (touch.clientX - rect.left) / rect.width;
                    const percent = Math.max(0, Math.min(100, position * 100));

                    progressPlayed.style.width = `${percent}%`;
                    progressThumb.style.left = `${percent}%`;

                    const time = Math.max(0, Math.min(playerVideo.duration, playerVideo.duration * position));
                    document.getElementById('current-time').textContent = formatTime(time);

                    previewTime.textContent = formatTime(time);
                    previewTime.style.display = 'block';
                    previewTime.style.left = `${touch.clientX - rect.left + 10}px`;
                    e.preventDefault();
                }
            });

            progressBar.addEventListener('touchend', (e) => {
                if (isDragging) {
                    isDragging = false;
                    if (e.changedTouches.length > 0) {
                        const touch = e.changedTouches[0];
                        const rect = progressBar.getBoundingClientRect();
                        const position = (touch.clientX - rect.left) / rect.width;
                        playerVideo.currentTime = playerVideo.duration * position;
                        playerVideo.play();
                        previewTime.style.display = 'none';
                    }
                    e.preventDefault();
                }
            });

    // 初始隐藏时间提示
    previewTime.style.display = 'none';

    // 播放按钮组
    const playControlButton = document.createElement('div');
    playControlButton.id = 'play-control-button';
    ['缩', '方', '10s', '播停', '10s', '速', '全'].forEach(text => {
        const btn = document.createElement('div');
        btn.innerText = text;
        playControlButton.appendChild(btn);
    });
    controlGroupContainer.appendChild(playControlButton);

    // 统一状态管理
    let videoState = {
        isMirrored: false,
        currentScale: 1,
        isZoomed: false,
        isSeeking: false,
        isPlaying: false,
        isDetectionVisible: true,
        screenOrientation: 'landscape',
    };

    // 状态变量
    let screenOrientation = 'landscape';
    let isFullscreen = false;
    let windowStates = [
        { width: '328px', height: '185px', desc: '默认尺寸' },
        { width: '328px', height: '583px', desc: '竖版尺寸' },
    ];
    let currentWindowState = 0;

    // 添加全屏状态管理
    let originalDimensions = {
        width: '',
        height: ''
    };

    // 统一更新变换
    function updateVideoTransform() {
        const transforms = [];
        if (videoState.screenOrientation === 'portrait') {
            transforms.push('rotate(90deg) scale(1.78)');
        }
        if (videoState.currentScale !== 1) {
            transforms.push(`scale(${videoState.currentScale})`);
        }
        if (videoState.isMirrored) {
            transforms.push('scaleX(-1)');
        }
        playerVideo.style.transform = transforms.join(' ') || 'none';
    }

    // 窗口尺寸监听
    new ResizeObserver(() => {
        if (videoState.isZoomed && !playerVideo.classList.contains('zoomed')) {
            videoState.currentScale = Math.max(
                mediaPlayer.clientWidth / playerVideo.videoWidth,
                mediaPlayer.clientHeight / playerVideo.videoHeight
            );
            updateVideoTransform();
        }
    }).observe(mediaPlayer);

    // 按钮功能绑定
    playControlButton.children[0].addEventListener('click', toggleScale);
    playControlButton.children[1].addEventListener('click', toggleOrientation);
    playControlButton.children[2].addEventListener('click', () => playerVideo.currentTime -= 10);
    playControlButton.children[3].addEventListener('click', togglePlay);
    playControlButton.children[4].addEventListener('click', () => playerVideo.currentTime += 10);
    playControlButton.children[5].addEventListener('click', toggleSpeedMenu);
    playControlButton.children[6].addEventListener('click', toggleFullscreen);

    // 缩放功能
    function toggleScale() {
        const containerWidth = mediaPlayer.clientWidth;
        const containerHeight = mediaPlayer.clientHeight;
        const videoWidth = playerVideo.videoWidth;
        const videoHeight = playerVideo.videoHeight;

        if (!videoState.isZoomed) {
            const containerRatio = containerWidth / containerHeight;
            const videoRatio = videoWidth / videoHeight;
            if (Math.abs(containerRatio - videoRatio) > 0.01) {
                playerVideo.classList.add('zoomed');
            } else {
                videoState.currentScale = Math.max(
                    containerWidth / videoWidth,
                    containerHeight / videoHeight
                );
                updateVideoTransform();
            }
        } else {
            playerVideo.classList.remove('zoomed');
            videoState.currentScale = 1;
            updateVideoTransform();
        }
        videoState.isZoomed = !videoState.isZoomed;
    }

    // 方向切换
    function toggleOrientation() {
        videoState.screenOrientation =
            videoState.screenOrientation === 'landscape' ? 'portrait' : 'landscape';
        mediaPlayer.style.aspectRatio =
            videoState.screenOrientation === 'portrait' ? '9/16' : '16/9';
        updateVideoTransform();
    }

    // 播放控制
    function togglePlay() {
        if (playerVideo.paused) {
            playerVideo.play();
            ControlsManager.scheduleHide();
        } else {
            playerVideo.pause();
            ControlsManager.cancelHide();
            ControlsManager.show();
        }
        updatePlayButton();
    }

    // 更新播放按钮文本
    function updatePlayButton() {
        playControlButton.children[3].innerText = playerVideo.paused ? '播放' : '暂停';
    }

    // 控件管理模块
    const ControlsManager = (() => {
        let hideTimer;
        const controls = [
            '#control-group-container',
            '#control-button-group'
        ];

        return {
            init() {
                mediaPlayer.addEventListener('mousemove', () => this.reset());
                mediaPlayer.addEventListener('mouseleave', () => this.scheduleHide());
                playerVideo.addEventListener('play', () => this.scheduleHide());
                playerVideo.addEventListener('pause', () => this.cancelHide());
            },

            show() {
                controls.forEach(selector => {
                    const el = document.querySelector(selector);
                    el?.classList.remove('controls-hidden');
                    el.style.pointerEvents = 'auto';
                });
            },

            hide() {
                if(playerVideo.paused) return;
                controls.forEach(selector => {
                    const el = document.querySelector(selector);
                    el?.classList.add('controls-hidden');
                    el.style.pointerEvents = 'none';
                });
            },

            scheduleHide(delay = 3000) {
                this.cancelHide();
                hideTimer = setTimeout(() => this.hide(), delay);
            },

            cancelHide() {
                clearTimeout(hideTimer);
            },

            reset() {
                this.show();
                this.scheduleHide();
            }
        };
    })();

    ControlsManager.init();

    // 速度控制菜单
    const speedOptions = [0.1, 0.25, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];

    const speedControlMenu = document.createElement('div');
    speedControlMenu.id = 'speed-control-menu';
    speedOptions.forEach(speed => {
        const option = document.createElement('div');
        option.className = 'speed-option';
        option.innerText = `${speed}x`;
        option.addEventListener('click', () => {
            playerVideo.playbackRate = speed;
            speedControlMenu.style.display = 'none';
        });
        speedControlMenu.appendChild(option);
    });
    mediaPlayer.appendChild(speedControlMenu);

    // 显示/隐藏速度菜单
    function toggleSpeedMenu() {
        speedControlMenu.style.display = speedControlMenu.style.display === 'flex' ? 'none' : 'flex';
        resetMenuTimeout();
    }

    // 增强全屏函数
    function toggleFullscreen() {
        if (!isFullscreen) {
            originalDimensions = {
                width: mediaPlayer.style.width,
                height: mediaPlayer.style.height,
                aspectRatio: mediaPlayer.style.aspectRatio
            };

            mediaPlayer.requestFullscreen().then(() => {
                isFullscreen = true;
                mediaPlayer.style.width = '100%';
                mediaPlayer.style.height = '100%';
                applyOrientation();
            });
        } else {
            document.exitFullscreen();
        }
    }

    // 增强全屏状态监听
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
        if (!isFullscreen) {
            mediaPlayer.style.width = originalDimensions.width;
            mediaPlayer.style.height = originalDimensions.height;
            mediaPlayer.style.aspectRatio = originalDimensions.aspectRatio;
            playerVideo.style.transform = 'none';
        }
    });

    // 更新全屏按钮状态
    function updateFullscreenButton() {
        const fullscreenBtn = playControlButton.children[6];
        fullscreenBtn.innerText = isFullscreen ? '退出' : '全';
        fullscreenBtn.title = isFullscreen ? '退出全屏 (Esc)' : '进入全屏';
    }

    // 视频状态同步
    playerVideo.addEventListener('play', () => {
        videoState.isPlaying = true;
        videoState.isDetectionVisible = false;
        detectMediaButton.style.display = 'none';
        updatePlayButton();
    });

    playerVideo.addEventListener('pause', () => {
        videoState.isPlaying = false;
        videoState.isDetectionVisible = true;
        detectMediaButton.style.display = 'block';
        updatePlayButton();
    });

    playerVideo.addEventListener('ended', () => {
        videoState.isPlaying = false;
        videoState.isDetectionVisible = true;
        detectMediaButton.style.display = 'block';
        updatePlayButton();
    });

    // 创建控制按钮组
    const controlButtonGroup = document.createElement('div');
    controlButtonGroup.id = 'control-button-group';
    ['关', '切', '镜'].forEach(text => {
        const btn = document.createElement('div');
        btn.innerText = text;
        controlButtonGroup.appendChild(btn);
    });
    mediaPlayer.appendChild(controlButtonGroup);

    // 按钮功能绑定
    controlButtonGroup.children[0].addEventListener('click', closePlayer);
    controlButtonGroup.children[1].addEventListener('click', toggleResize);
    controlButtonGroup.children[2].addEventListener('click', toggleMirror);

    // 关闭功能
    let originalVideo = null;
    function closePlayer() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        if (playerVideo.src && originalVideo) {
            originalVideo.pause();
        }
        mediaPlayer.style.display = 'none';
        playerVideo.pause();
        playerVideo.src = '';
        detectMediaButton.style.display = 'block';

        document.documentElement.style.overflow = '';
    }

    // 切换窗口尺寸
    function toggleResize() {
        if (isFullscreen) {
            document.exitFullscreen().then(() => {
                currentWindowState = (currentWindowState + 1) % windowStates.length;
                applyWindowState();
            });
        } else {
            currentWindowState = (currentWindowState + 1) % windowStates.length;
            applyWindowState();
        }
    }

    // 应用窗口状态
    function applyWindowState() {
        const state = windowStates[currentWindowState];
        mediaPlayer.style.width = state.width;
        mediaPlayer.style.height = state.height;
        console.log(`切换到状态: ${state.desc}`);
    }

    // 镜像功能
    function toggleMirror() {
        videoState.isMirrored = !videoState.isMirrored;
        updateVideoTransform();
    }

    // 检测媒体功能
    const detectMediaButton = document.createElement('button');
    detectMediaButton.id = 'detect-media-button';
    detectMediaButton.innerText = '检';
    detectMediaButton.style.display = 'none';
    document.body.appendChild(detectMediaButton);

    const detectMedia = () => {
        const videos = document.querySelectorAll('video');
        let targetVideo = null;

        for (const video of videos) {
            if (video.src && (
                video.src.endsWith('.m3u8') ||
                video.querySelector('source[src$=".m3u8"]') !== null
            )) {
                targetVideo = video;
                break;
            }

            if (!video.paused && !targetVideo) {
                targetVideo = video;
            }
        }
        return targetVideo || videos[0] || null;
    };

    document.addEventListener('play', (e) => {
        if (e.target.tagName === 'VIDEO' && !e.target.isSameNode(playerVideo)) {
            videoState.isDetectionVisible = true;
            detectMediaButton.style.display = 'block';
        }
    }, true);

    detectMediaButton.addEventListener('click', () => {
        if (!videoState.isDetectionVisible) return;

        const media = detectMedia();
        if (media) {
            originalVideo = media;
            const source = media.src || media.querySelector('source')?.src;

            playerVideo.src = source;
            playerVideo.currentTime = media.currentTime;
            media.pause();
            mediaPlayer.style.display = 'block';
            ControlsManager.show();
            playerVideo.play();
            videoState.isDetectionVisible = false;
            detectMediaButton.style.display = 'none';
        }
    });

    // 视频结束自动隐藏
    playerVideo.addEventListener('ended', () => {
        playerVideo.src = '';
        detectMediaButton.style.display = 'block';
    });
})();
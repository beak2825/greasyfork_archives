// ==UserScript==
// @name         建行学习刷课脚本1.2版本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键静音，一键加速，一键评论
// @author       听说你很会玩
// @match        https://u.ccb.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccb.com
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/544944/%E5%BB%BA%E8%A1%8C%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC12%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/544944/%E5%BB%BA%E8%A1%8C%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC12%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //关闭debugger断点
    window.debugger = function(){};
    Function.prototype.constructor = function() {};
    function waitForVideo() {
        // 尝试穿透Shadow DOM
        const findVideoInShadow = (node) => {
            if (node instanceof ShadowRoot) {
                const video = node.querySelector('video');
                if (video) return video;
                for (const child of node.children) {
                    const result = findVideoInShadow(child);
                    if (result) return result;
                }
            }
            return null;
        };

        // 常规查找
        let video = document.querySelector('video');
        if (video) return video;

        // 查找iframe
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                // 尝试访问同源iframe
                if (iframe.contentDocument) {
                    video = iframe.contentDocument.querySelector('video');
                    if (video) return video;
                }
            } catch (e) {
                // 跨域iframe会抛出安全错误
                console.log('无法访问iframe内容:', e);
            }
        }

        // 查找Shadow DOM
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const video = findVideoInShadow(el.shadowRoot);
            if (video) return video;
        }

        return null;
    }

    // 模拟用户点击
    function simulateClick(element) {
        console.log("模拟用户点击...");
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(event);
        setTimeout(() => {
            if (element.paused) {
                console.log("模拟点击失败，尝试直接播放");
                element.play().catch(e => console.log(`直接播放失败: ${e}`));
            }
        }, 500);
    }

   

    // 初始检查
    const video = waitForVideo();
    if (video) {
        console.log('立即找到视频元素:', video);
    }



    //
      // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = `
    .video-control-sidebar {
        width: 320px;
        background: rgba(30, 30, 30, 0.95);
        border-radius: 12px;
        padding: 20px;
        position: fixed;
        top: 20px;
        right: 20px;
        height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .control-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #333;
    }

    .control-header h2 {
        font-size: 1.4rem;
        font-weight: 600;
        color: #fff;
    }

    .pin-button {
        background: #444;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .control-section {
        margin-bottom: 25px;
    }

    .section-title {
        font-size: 1rem;
        color: #aaa;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
    }

    .playback-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .control-button {
        flex: 1;
        background: #333;
        border: none;
        color: white;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        transition: background 0.2s;
    }

    .control-button:hover {
        background: #444;
    }

    .control-button.active {
        background: #ff5e5e;
        color: white;
    }

    .slider-container {
        margin-bottom: 20px;
    }

    .slider-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        color: #ccc;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #444;
        outline: none;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ff5e5e;
        cursor: pointer;
    }

    .quality-options {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
    }

    .quality-option {
        flex: 1;
        background: #333;
        border: none;
        color: #ccc;
        padding: 8px 5px;
        border-radius: 6px;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
    }

    .quality-option:hover {
        background: #444;
    }

    .quality-option.active {
        background: #ff5e5e;
        color: white;
    }

    .speed-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 20px;
    }

    .speed-option {
        background: #333;
        border: none;
        color: #ccc;
        padding: 8px 5px;
        border-radius: 6px;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
    }

    .speed-option:hover {
        background: #444;
    }

    .speed-option.active {
        background: #ff5e5e;
        color: white;
    }

    .additional-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .additional-option {
        background: #333;
        border: none;
        color: white;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        transition: background 0.2s;
    }

    .additional-option:hover {
        background: #444;
    }

    .toggle-controls {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: #ff5e5e;
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        .video-control-sidebar {
            width: 280px;
            right: 10px;
        }
    }

    .hidden {
        display: none;
    }
`;

    // 将样式添加到文档中
    document.head.appendChild(styleElement);
    // 创建右侧控制面板
    function createVideoControlSidebar() {
        // 检查是否已经存在控制面板
        if (document.querySelector('.video-control-sidebar')) {
            return;
        }

        // 创建控制面板
        const sidebar = document.createElement('div');
        sidebar.className = 'video-control-sidebar';
        sidebar.innerHTML = `
                <div class="control-header">
                    <h2>播放控制</h2>
                    <button class="pin-button">📌</button>
                </div>

                <div class="control-section">
                    <div class="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                        播放控制
                    </div>
                    <div class="playback-controls">
                        <button class="control-button active" data-action="play">
                            <span>▶</span>
                            <span>播放</span>
                        </button>
                        <button class="control-button" data-action="pause">
                            <span>⏸</span>
                            <span>暂停</span>
                        </button>
                        <button class="control-button" data-action="stop">
                            <span>⏹</span>
                            <span>停止</span>
                        </button>
                    </div>

                    <div class="slider-container">
                        <div class="slider-label">
                            <span>音量</span>
                            <span id="volume-value">80%</span>
                        </div>
                        <input type="range" min="0" max="100" value="80" class="slider" id="volume-slider">
                    </div>

                    <div class="slider-container">
                        <div class="slider-label">
                            <span>播放进度</span>
                            <span id="progress-time">32:15 / 120:00</span>
                        </div>
                        <input type="range" min="0" max="100" value="27" class="slider" id="progress-slider">
                    </div>
                </div>

                <div class="control-section">
                    <div class="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20V10M18 20V4M6 20v-4"></path>
                        </svg>
                        画质设置
                    </div>
                    <div class="quality-options">
                        <button class="quality-option" data-quality="360">360P</button>
                        <button class="quality-option" data-quality="480">480P</button>
                        <button class="quality-option active" data-quality="720">720P</button>
                        <button class="quality-option" data-quality="1080">1080P</button>
                        <button class="quality-option" data-quality="2160">4K</button>
                    </div>
                </div>

                <div class="control-section">
                    <div class="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        播放速度
                    </div>
                    <div class="speed-options">
                    <button class="speed-option active" data-speed="1">1x</button>
                        <button class="speed-option" data-speed="2">2x</button>
                        <button class="speed-option" data-speed="4">4x</button>
                        <button class="speed-option" data-speed="8">8x</button>
                        <button class="speed-option" data-speed="16">16x</button>
                    </div>
                </div>

                <div class="control-section">
                    <div class="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 极狐 4.6 9a1.65 1.65 极狐 0-.33-1.82l-.06-.06a2 2 极狐 0 0 1 0-2.83 2 2 极狐 0 0 1 2.83 0l.06.06a1.65 1.65 极狐 0 0 0 1.82.33H9a1.65 1.65 极狐 0 0 0 1-1.51V3a2 2 极狐 0 0 1 2-2 极狐 2 2 0 0 1 2 2v.09a1.65 1.65 极狐 0 0 0 1 1.51 1.65 1.65 极狐 0 0 0 1.82-.33l.06-.06a2 2 极狐 0 0 1 2.83 0 2 2 极狐 0 0 1 极狐 0 2.83l-.06.06a1.65 1.65 极狐 0 0 0-.33 1.82V9a1.65 1.65 极狐 0 0 0 1.51 1H21a2 2 极狐 0 0 1 2 2 2 2 极狐 0 0 1-2 2h-.09a1.65 1.65 极狐 0 0 0-1.51 1z"></path>
                        </svg>
                        其他设置
                    </div>
                    <div class="additional-options">
                        <button class="additional-option" data-action="comment">
                            <span>评论</span>
                            <span>一键评论</span>
                        </button>
                        <button class="additional-option" data-action="share">
                            <span>🔗</span>
                            <span>分享</span>
                        </button>
                        <button class="additional-option" data-action="subtitles">
                            <span>📋</span>
                            <span>字幕</span>
                        </button>
                        <button class="additional-option" data-action="brightness">
                            <span>🔆</span>
                            <span>亮度</span>
                        </button>
                        <button class="additional-option" data-action="pip">
                            <span>🗗</span>
                            <span>画中画</span>
                        </button>
                        <button class="additional-option" data-action="fullscreen">
                            <span>⛶</span>
                            <span>全屏</span>
                        </button>
                        <button class="additional-option" data-action="settings">
                            <span>⚙️</span>
                            <span>更多</span>
                        </button>
                    </div>
                </div>
            `;

        // 添加到页面中
        document.body.appendChild(sidebar);

        // 添加交互功能
        addControlInteractions();
    }

    // 添加控制区交互功能
    function addControlInteractions() {
        // 控制按钮激活状态切换
        const controlButtons = document.querySelectorAll('.control-button');
        controlButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                controlButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 执行相应的视频控制操作
                controlVideo(action);
            });
        });

        // 画质选项激活状态切换
        const qualityOptions = document.querySelectorAll('.quality-option');
        qualityOptions.forEach(option => {
            option.addEventListener('click', function() {
                const quality = this.getAttribute('data-quality');
                qualityOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                // 执行画质切换操作
                setVideoQuality(quality);
            });
        });

        // 速度选项激活状态切换
        const speedOptions = document.querySelectorAll('.speed-option');
        speedOptions.forEach(option => {
            option.addEventListener('click', function() {
                const speed = this.getAttribute('data-speed');
                speedOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                // 执行速度设置操作
                setPlaybackSpeed(speed);
            });
        });

        // 固定按钮功能
        const pinButton = document.querySelector('.pin-button');
        pinButton.addEventListener('click', function() {
            this.classList.toggle('active');
            // 这里可以添加固定/取消固定控制栏的逻辑
        });

        // 音量滑块
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', function() {
                volumeValue.textContent = `${this.value}%`;
                setVolume(this.value / 100);
            });
        }

        // 进度滑块
        const progressSlider = document.getElementById('progress-slider');
        if (progressSlider) {
            progressSlider.addEventListener('input', function() {
                // 这里可以添加更新播放进度的逻辑
                seekVideo(this.value);
            });
        }

        // 其他选项按钮
        const additionalOptions = document.querySelectorAll('.additional-option');
        additionalOptions.forEach(option => {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                // 执行相应的操作
                handleAdditionalAction(action);
            });
        });

        // 显示/隐藏控制面板
        const toggleButton = document.querySelector('.toggle-controls');
        const controlSidebar = document.querySelector('.video-control-sidebar');

        toggleButton.addEventListener('click', function() {
            controlSidebar.classList.toggle('hidden');
        });
    }

    // 视频控制函数
    function controlVideo(action) {
        // 这里需要根据实际网站的视频播放器API进行调整
        console.log(`执行视频控制操作: ${action}`);

        // 尝试查找页面中的视频元素
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];

            switch(action) {
                case 'play':
                    video.play();
                    break;
                case 'pause':
                    video.pause();
                    break;
                case 'stop':
                    video.pause();
                    video.currentTime = 0;
                    break;
            }
        } else {
            console.warn('未找到视频元素');
        }
    }

    // 设置视频画质
    function setVideoQuality(quality) {
        console.log(`设置视频画质: ${quality}p`);
        // 这里需要根据实际网站API实现画质切换
    }

    // 设置播放速度
    function setPlaybackSpeed(speed) {
        // 尝试查找页面中的视频元素
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];
            video.playbackRate = parseFloat(speed);
            console.log(`设置播放速度: ${speed}`);
        } else {
            console.warn('未找到视频元素');
        }
    }

    // 设置音量
    function setVolume(volume) {
        // 尝试查找页面中的视频元素
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];
            video.volume = volume;
            console.log(`设置音量: ${volume}`);
        } else {
            console.warn('未找到视频元素');
        }
    }

    // 跳转到指定进度
    function seekVideo(percent) {
        // 尝试查找页面中的视频元素
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];
            video.currentTime = (percent / 100) * video.duration;
            console.log(`跳转到: ${percent}%`);
        } else {
            console.warn('未找到视频元素');
        }
    }

    // 处理其他操作
    function handleAdditionalAction(action) {
        console.log(`执行操作: ${action}`);

        // 尝试查找页面中的视频元素
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];

            switch(action) {
                case 'fullscreen':
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.msRequestFullscreen) {
                        video.msRequestFullscreen();
                    }
                    break;
                case 'pip':
                    if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                        video.requestPictureInPicture();
                    }
                    break;
            }
        }
    }

    // 初始化函数
    function initVideoControls() {
        // 创建控制面板
        createVideoControlSidebar();

        // 设置定时器，定期更新进度条
        setInterval(updateProgress, 1000);
    }

    // 更新进度条
    function updateProgress() {
        const videos = document.querySelectorAll('video');

        if (videos.length > 0) {
            const video = videos[0];
            const progressSlider = document.getElementById('progress-slider');
            const progressTime = document.getElementById('progress-time');

            if (progressSlider && progressTime && !isNaN(video.duration)) {
                const percent = (video.currentTime / video.duration) * 100;
                progressSlider.value = percent;

                // 格式化时间
                const currentTime = formatTime(video.currentTime);
                const totalTime = formatTime(video.duration);
                progressTime.textContent = `${currentTime} / ${totalTime}`;
            }
        }
    }

    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 页面加载完成后初始化控制区
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoControls);
    } else {
        initVideoControls();
    }

    // 使用MutationObserver确保控制面板始终存在
    const observer = new MutationObserver(function(mutations) {
        // 检查控制面板是否被移除
        if (!document.querySelector('.video-control-sidebar')) {
            createVideoControlSidebar();
        }
        if (!document.querySelector('.toggle-controls')) {
            // 重新添加切换按钮
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-controls';
            toggleButton.textContent = '⚙️';
            document.body.appendChild(toggleButton);

            // 重新绑定事件
            const controlSidebar = document.querySelector('.video-control-sidebar');
            toggleButton.addEventListener('click', function() {
                controlSidebar.classList.toggle('hidden');
            });
        }
    });

    // 开始观察页面变化
    observer.observe(document.body, { childList: true, subtree: true });
})();



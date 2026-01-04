// ==UserScript==
    // @name         Instagram简易视频进度条
    // @namespace    http://tampermonkey.net/
    // @version      0.0.3
    // @description  Control video playback on Instagram
    // @author       Blysh
    // @match           *://*.instagram.com/*
    // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542689/Instagram%E7%AE%80%E6%98%93%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/542689/Instagram%E7%AE%80%E6%98%93%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

// 用户设置
var userSettings = {
    defaultMuted: false, // 默认不静音为 false，默认静音为 true
    defaultSeekTime: 3, // 默认快进/回退时间为 3 秒
    defaultPlaybackRate: 2 // 默认加速的播放速度为 2.0
}

// 全局管理器
class VideoProgressManager {
    constructor(userSettings) {
        this.videoControllers = new Map();
        this.currentPlayingVideo = null;
        this.userSettings = userSettings;
        this.init();
    }

    init() {
        this.setupMutationObserver();
        this.setupIntersectionObserver();
        this.handleExistingVideos();
        this.setupKeyboardControl();
    }

     // 设置键盘控制
    setupKeyboardControl() {
        // 使用 keydown 事件来阻止默认行为
        document.addEventListener('keydown', (e) => {
            // 只有在当前有播放视频时才响应键盘事件
            //if (!this.currentPlayingVideo) return;
            
            // 检查是否在输入框中，避免干扰正常输入
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            )) {
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    this.seekVideo(-this.userSettings.defaultSeekTime); // 回退3秒
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleRightArrowDown();
                    break;
                case ' ':
                case 'Space':
                    // 强制阻止空格键的默认滚动行为
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.togglePlayPause(); // 空格键暂停/播放
                    break;
            }
        }, { 
            passive: false, // 允许调用 preventDefault
            capture: true   // 在捕获阶段处理，优先级更高
        });

        // 额外添加 keyup 事件来确保完全阻止空格键行为
        document.addEventListener('keyup', (e) => {
            if (!this.currentPlayingVideo) return;
            
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            )) {
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleRightArrowUp(); // 处理右键释放
                    break;
                case ' ':
                case 'Space':
                    if (this.currentPlayingVideo) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                    break;
            }
        }, { 
            passive: false,
            capture: true 
        });
    }

    // 处理右键按下
    handleRightArrowDown() {
        if (!this.currentPlayingVideo) return;

        // 清除之前的计时器
        if (this.keyPressTimer) {
            clearTimeout(this.keyPressTimer);
        }

        if(this.isLongPress === undefined) this.isLongPress = false;

        // 设置长按检测计时器（300毫秒）
        this.keyPressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.startSpeedUp(); // 开始倍速播放
        }, 200);

    }

    // 处理右键释放
    handleRightArrowUp() {
        if (!this.currentPlayingVideo) return;

        // 清除计时器
        if (this.keyPressTimer) {
            clearTimeout(this.keyPressTimer);
            this.keyPressTimer = null;
        }


        if (this.isLongPress) {
            this.stopSpeedUp();
        } else {
            this.seekVideo(this.userSettings.defaultSeekTime);
        }

        this.isLongPress = false;
    }

    // 开始倍速播放
    startSpeedUp() {
        if (this.currentPlayingVideo) {
            //this.originalPlaybackRate = this.currentPlayingVideo.playbackRate;
            this.currentPlayingVideo.playbackRate = this.userSettings.defaultPlaybackRate; // 2倍速
        }
    }

    // 停止倍速播放
    stopSpeedUp() {
        if (this.currentPlayingVideo) {
            this.currentPlayingVideo.playbackRate = 1.0;
        }
    }

    // 快进/回退视频
    seekVideo(seconds) {
        if (this.currentPlayingVideo) {
            const newTime = Math.max(0, Math.min(
                this.currentPlayingVideo.currentTime + seconds,
                this.currentPlayingVideo.duration
            ));
            this.currentPlayingVideo.currentTime = newTime;
            
        }
    }

    // 切换播放/暂停
    togglePlayPause() {
        if (this.currentPlayingVideo) {
            if (this.currentPlayingVideo.paused) {
                this.currentPlayingVideo.play();
            } else {
                this.currentPlayingVideo.pause();
            }
        }
    }

    // 监听DOM变化，处理新加载的视频
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                        videos.forEach(video => this.addVideoController(video));
                        
                        // 如果添加的节点本身就是video
                        if (node.tagName === 'VIDEO') {
                            this.addVideoController(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监听视频是否在视口中
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // 视频进入视口
                    this.handleVideoInView(video);
                } else {
                    // 视频离开视口
                    this.handleVideoOutOfView(video);
                }
            });
        }, {
            threshold: 0.5 // 视频50%可见时触发
        });
    }

    // 处理现有视频
    handleExistingVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => this.addVideoController(video));
    }

    // 为视频添加控制器
    addVideoController(video) {
        if (this.videoControllers.has(video)) return;

        const controller = new VideoController(video, this);
        this.videoControllers.set(video, controller);
        
        // 监听视频播放事件
        video.addEventListener('play', () => {
            this.setCurrentPlayingVideo(video);
        });

        // 添加到视口监听
        this.intersectionObserver.observe(video);
    }

    // 设置当前播放的视频
    setCurrentPlayingVideo(video) {
        // 暂停其他视频
        if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
            this.currentPlayingVideo.pause();
        }
        this.currentPlayingVideo = video;
        setTimeout(() => {
            this.currentPlayingVideo.muted = this.userSettings.defaultMuted; // 确保视频不静音
        },500)
    }

    // 视频进入视口
    handleVideoInView(video) {
        const controller = this.videoControllers.get(video);
        if (controller) {
            controller.setVisible(true);
        }
    }

    // 视频离开视口
    handleVideoOutOfView(video) {
        const controller = this.videoControllers.get(video);
        if (controller) {
            controller.setVisible(false);
            // 视频离开视口时暂停播放
            video.pause();
        }
    }
}

// 单个视频控制器
class VideoController {
    constructor(video, manager) {
        this.video = video;
        this.manager = manager;
        this.vElement = video.parentElement;
        this.isVisible = false;
        this.isDragging = false;
        this.progressContainer = null;
        
        this.init();
    }

    init() {
        // 检查是否已存在进度条
        if (this.vElement.querySelector('.progress-container')) {
            return;
        }

        this.createProgressBar();
        this.setupEventListeners();
    }

    createProgressBar() {
        // 创建进度条容器
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'progress-container';
        this.progressContainer.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50px;
            right: 50px;
            height: 30px;
            background: rgba(0,0,0,0.7);
            border-radius: 15px;
            display: none;
            align-items: center;
            padding: 0 15px;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;

        // 创建时间显示
        this.timeDisplay = document.createElement('span');
        this.timeDisplay.className = 'time-display';
        this.timeDisplay.style.cssText = `
            color: white;
            font-size: 12px;
            margin-right: 10px;
            min-width: 80px;
            font-family: auto;
        `;

        // 创建进度条轨道
        this.progressTrack = document.createElement('div');
        this.progressTrack.className = 'progress-track';
        this.progressTrack.style.cssText = `
            flex: 1;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        `;

        // 创建进度条填充
        this.progressFill = document.createElement('div');
        this.progressFill.className = 'progress-fill';
        this.progressFill.style.cssText = `
            height: 100%;
            background: #ff4757;
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s ease;
        `;


        // 组装进度条
        this.progressTrack.appendChild(this.progressFill);
        this.progressContainer.appendChild(this.timeDisplay);
        this.progressContainer.appendChild(this.progressTrack);

        // 确保父元素有相对定位
        this.vElement.style.position = 'relative';
        this.vElement.appendChild(this.progressContainer);
    }

    setupEventListeners() {
        // 鼠标进入显示进度条
        this.vElement.addEventListener("mouseenter", () => {
            if (this.isVisible) {
                this.showProgressBar();
            }
        });

        // 鼠标离开隐藏进度条
        this.vElement.addEventListener("mouseleave", () => {
            if (!this.isDragging) {
                this.hideProgressBar();
            }
        });

        // 进度条点击跳转
        this.progressTrack.addEventListener('click', (e) => {
            if (this.isDragging) return;
            this.seekToPosition(e);
        });

        this.progressTrack.addEventListener('mousedown', (e) => {
            if (this.isDragging) return;
            this.startDrag(e);
        });

        // 悬停显示预览时间
        this.progressTrack.addEventListener('mousemove', (e) => {
            this.showPreviewTime(e);
        });

        // 监听视频时间更新
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // 监听视频元数据加载完成
        this.video.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        // 监听播放状态变化
        this.video.addEventListener('play', () => {
            this.showProgressBar();
        });

        this.video.addEventListener('pause', () => {
            // 暂停时可以选择隐藏或保持显示
        });
    }

    showProgressBar() {
        if (this.progressContainer) {
            this.progressContainer.style.display = 'flex';
        }
    }

    hideProgressBar() {
        if (this.progressContainer && !this.isDragging) {
            this.progressContainer.style.display = 'none';
        }
    }

    updateProgress() {
        if (this.video.duration && this.progressFill && this.timeDisplay) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = progress + '%';
            
            const currentTime = this.formatTime(this.video.currentTime);
            const duration = this.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${currentTime} / ${duration}`;
        }
    }

    seekToPosition(e) {
        const rect = this.progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * this.video.duration;
        this.video.currentTime = newTime;
    }

startDrag(e) {
    this.isDragging = true;
    e.preventDefault();
    
    // 记录原始静音状态
    if (this.originMutedState === undefined) {
        this.originMutedState = this.video.muted;
    }
    this.video.muted = true; // 拖动开始时就静音

    if (this.originPlayedState === undefined) {
        this.originPlayedState = this.video.paused;
    }
    this.video.pause(); // 拖动开始时暂停视频
    
    // 使用节流优化性能
    let lastUpdate = 0;
    const throttleDelay = 16; // 约60fps
    
    // 缓存getBoundingClientRect结果
    const rect = this.progressTrack.getBoundingClientRect();
    
    const handleDrag = (e) => {
        const now = Date.now();
        if (now - lastUpdate < throttleDelay) {
            return; // 跳过本次更新
        }
        lastUpdate = now;
        
        // 使用requestAnimationFrame确保平滑更新
        requestAnimationFrame(() => {
            if (!this.isDragging) return; // 防止拖动结束后还在更新
            const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const newTime = (dragX / rect.width) * this.video.duration;
            
            // 批量更新，减少重排重绘
            if (Math.abs(this.video.currentTime - newTime) > 0.1) {
                this.video.currentTime = newTime;
            }
            
            // 立即更新进度条显示，不等待timeupdate事件
            const progress = (newTime / this.video.duration) * 100;
            this.progressFill.style.width = progress + '%';
            
            // 更新时间显示
            const currentTime = this.formatTime(newTime);
            const duration = this.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${currentTime} / ${duration}`;
        });
    };
    
    const stopDrag = () => {
        this.isDragging = false;
        
        // 延迟恢复静音状态，避免音频突然播放
        setTimeout(() => {
            if (this.originMutedState !== undefined) {
                this.video.muted = this.originMutedState;
                this.originMutedState = undefined;
            }
            if (this.originPlayedState !== undefined) {
                if (!this.originPlayedState) {
                    this.video.play(); 
                } else {
                    this.video.pause(); 
                }
                this.originPlayedState = undefined;
            }
        }, 100);
        
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
        
        // 拖动结束后确保进度显示正确
        this.updateProgress();
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

    showPreviewTime(e) {
        const rect = this.progressTrack.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const hoverTime = (hoverX / rect.width) * this.video.duration;
        this.progressTrack.title = this.formatTime(hoverTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setVisible(visible) {
        this.isVisible = visible;
        if (!visible) {
            this.hideProgressBar();
        }
    }

    destroy() {
        if (this.progressContainer) {
            this.progressContainer.remove();
        }
    }
}

// 初始化管理器
let videoManager;

function initializeVideoManager() {
    if (!videoManager) {
        videoManager = new VideoProgressManager(userSettings);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVideoManager);
} else {
    initializeVideoManager();
}
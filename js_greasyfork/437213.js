// ==UserScript==
// @name         全能视频控制器
// @namespace    https://greasyfork.org/zh-CN/users/104201-%E9%BB%84%E7%9B%90
// @version      2.7
// @author       VisJoker
// @description  视频播放增强工具，提供快捷键控制、鼠标拖动调整进度和音量等功能
// @icon         https://image.suysker.xyz/i/2023/10/09/artworks-QOnSW1HR08BDMoe9-GJTeew-t500x500.webp
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepage     https://greasyfork.org/zh-CN/scripts/437213-%E9%BB%84%E9%87%91%E5%B7%A6%E5%8F%B3%E9%94%AEvisjoker
// @supportURL   https://github.com/Suysker/Golden-Left-Right
// @downloadURL https://update.greasyfork.org/scripts/437213/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437213/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------- Configuration Constants --------------------
    const DEFAULT_RATE = 2;                // 默认倍速
    const DEFAULT_TIME = 5;                // 默认秒数
    const DEFAULT_SENSITIVITY = 0.25;         // 默认灵敏度
    const SHOW_PROGRESS_INFO_KEY = "showProgressInfo"; // 存储是否显示进度信息的键名
    const VOLUME_SENSITIVITY = 0.005;      // 音量控制灵敏度
    const SHIFT_TIME = 30;                 // Shift+左右键快进/快退秒数

    // -------------------- State Variables --------------------
    const debug = false;                   // 控制日志的输出，正式环境关闭
    let cachedVideos = [];                 // 缓存视频列表
    let speedDisplayElement;               // 用于显示速度的元素
    let progressInfoElement;               // 用于显示进度信息的元素
    let dragIndicatorElement;              // 拖动指示器元素
    let showProgressInfo = true;           // 是否显示进度信息

    // 拖动控制相关变量
    let video = null;                      // 当前操作的视频元素
    let isDragging = false;                // 是否正在拖动
    let startX = 0;                        // 拖动开始的X坐标
    let startY = 0;                        // 拖动开始的Y坐标
    let startTime = 0;                     // 拖动开始时的视频时间
    let baseSensitivity = DEFAULT_SENSITIVITY; // 基础灵敏度
    let currentSensitivity = baseSensitivity;  // 当前灵敏度
    let wasPlaying = false;                // 拖动开始前视频是否在播放
    let hasMoved = false;                  // 是否发生了移动（判断是点击还是拖动）
    let defaultVideoWidth = 0;             // 默认视频宽度
    let dragDirection = null;              // 拖动方向 ('horizontal' 或 'vertical' 或 null)
    let initialVolume = 0;                 // 拖动开始时的音量

    const state = {
        playbackRate: DEFAULT_RATE,        // 播放倍速
        changeTime: DEFAULT_TIME,          // 快进/回退秒数
        pageVideo: null,
        lastPlayedVideo: null,             // 记录上一个播放过的视频（通过 play 事件更新）
        originalPlaybackRate: 1,           // 存储原来的播放速度
        rightKeyDownCount: 0,              // 追踪右键按下次数
        leftKeyDownCount: 0,               // 追踪左键按下次数
        isManualSpeedSet: false            // 标记是否用户手动设置了播放速度
    };

    // -------------------- Utility Functions --------------------

    /**
     * Logs messages to the console if debugging is enabled.
     * @param  {...any} args - The messages or objects to log.
     */
    const log = (...args) => {
        if (debug) {
            console.log('[全能视频控制器]', ...args);
        }
    };

    /**
     * Loads a setting from GM storage with a default value.
     * @param {string} key - The key of the setting.
     * @param {*} defaultValue - The default value if the setting is not found.
     * @returns {Promise<*>} - The loaded value.
     */
    const loadSetting = async (key, defaultValue) => {
        const value = await GM_getValue(key, defaultValue);
        return value !== undefined ? value : defaultValue;
    };

    /**
     * Saves a setting to GM storage.
     * @param {string} key - The key of the setting.
     * @param {*} value - The value to save.
     */
    const saveSetting = async (key, value) => {
        await GM_setValue(key, value);
    };

    /**
     * Checks if any input-related element (除了 <input type="range">) is currently focused.
     * @returns {boolean} - True if an input is focused, else false.
     */
    const isInputFocused = () => {
        const activeElement = document.activeElement;
        // 如果当前激活的元素是 <input type="range"> 则忽略（不阻止脚本响应）
        if (activeElement && activeElement.tagName.toLowerCase() === 'input' && activeElement.type === 'range') {
            return false;
        }
        const inputTypes = ['input', 'textarea', 'select', 'button'];
        const isContentEditable = activeElement && activeElement.isContentEditable;
        const isInputElement = activeElement && inputTypes.includes(activeElement.tagName.toLowerCase());
        return isContentEditable || isInputElement;
    };

    /**
     * Determines if a video element is visible within the viewport.
     * @param {HTMLVideoElement} video - The video element to check.
     * @returns {boolean} - True if visible, else false.
     */
    const isVideoVisible = (video) => {
        const rect = video.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * Determines if a video is currently playing.
     * @param {HTMLVideoElement} video - The video element to check.
     * @returns {boolean} - True if playing, else false.
     */
    const isVideoPlaying = (video) => {
        return video && !video.paused && video.currentTime > 0;
    };

    // -------------------- Video Management --------------------

    /**
     * Adds event listeners to a video element to track playback.
     * @param {HTMLVideoElement} videoElement - The video element.
     */
    const addPlayEventListeners = (videoElement) => {
        videoElement.addEventListener('play', () => {
            state.lastPlayedVideo = videoElement; // 仅在视频播放时更新
            log('更新 lastPlayedVideo: 当前播放的视频', videoElement);
        });

        videoElement.addEventListener('remove', () => {
            removeFromCache([videoElement]);
        });

        // 更新进度信息相关事件监听
        videoElement.addEventListener('play', updateProgressInfo);
        videoElement.addEventListener('pause', updateProgressInfo);
        videoElement.addEventListener('timeupdate', updateProgressInfo);

        // 阻止视频元素的所有鼠标默认行为
        videoElement.addEventListener('mousedown', handleVideoMouseDown, { capture: true });
        videoElement.addEventListener('click', handleVideoClick, { capture: true });

        // 监听窗口大小变化，更新灵敏度
        const resizeObserver = new ResizeObserver(() => {
            updateSensitivity();
        });
        resizeObserver.observe(videoElement);
    };

    /**
     * Initializes event listeners for a list of video elements.
     * @param {HTMLVideoElement[]} videos - Array of video elements.
     */
    const initVideoListeners = (videos) => {
        videos.forEach(videoElement => {
            if (!cachedVideos.includes(videoElement)) {  // 避免重复添加
                cachedVideos.push(videoElement);         // 缓存新视频
                addPlayEventListeners(videoElement);     // 为每个新视频添加监听
            }
        });
    };

    /**
     * Removes video elements from the cache.
     * @param {HTMLVideoElement[]} removedVideos - Array of video elements to remove.
     */
    const removeFromCache = (removedVideos) => {
        cachedVideos = cachedVideos.filter(video => !removedVideos.includes(video));
        log('从缓存中移除视频:', removedVideos);
    };

    /**
     * Finds all video elements within a given node.
     * @param {Node} node - The root node to search within.
     * @returns {HTMLVideoElement[]} - Array of found video elements.
     */
    const findVideosRecursively = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return [];
        const videos = [];
        if (node.tagName.toLowerCase() === 'video') {
            videos.push(node);
        }
        videos.push(...node.querySelectorAll('video'));
        return videos;
    };

    /**
     * Caches all video elements currently present on the page.
     */
    const cacheAllVideos = () => {
        const allVideos = Array.from(document.getElementsByTagName('video'));
        initVideoListeners(allVideos);
        log('缓存所有视频:', allVideos);
    };

    /**
     * Determines the optimal video element to control.
     * @returns {Promise<HTMLVideoElement|null>} - The selected video element or null.
     */
    const getOptimalPageVideo = async () => {
        // 检查 lastPlayedVideo 是否存在且可见，不检查是否正在播放
        if (state.lastPlayedVideo && isVideoVisible(state.lastPlayedVideo)) {
            log('lastPlayedVideo 存在且可见');
            return state.lastPlayedVideo;
        }

        // 如果 lastPlayedVideo 不存在或不可见，检查是否有其他视频正在播放
        const allVideos = Array.from(document.getElementsByTagName('video'));
        const playingVideo = allVideos.find(isVideoPlaying);
        if (playingVideo) {
            log('找到其他正在播放的视频:', playingVideo);
            return playingVideo;
        }

        // 如果没有合适的视频，返回 null 并记录状态
        log('未找到合适的视频');
        return null;
    };

    /**
     * Checks and updates the current page video.
     * @returns {Promise<boolean>} - True if a video is found, else false.
     */
    const checkPageVideo = async () => {
        state.pageVideo = await getOptimalPageVideo();
        if (!state.pageVideo) {
            log('未找到符合条件的视频');
            return false;
        }
        return true;
    };

    // -------------------- UI Elements --------------------

    /**
     * Creates an element to display playback speed.
     */
    const createSpeedDisplay = () => {
        speedDisplayElement = document.createElement('div');
        speedDisplayElement.style.position = 'absolute';
        speedDisplayElement.style.right = '10px';
        speedDisplayElement.style.bottom = '10px';
        speedDisplayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        speedDisplayElement.style.color = 'white';
        speedDisplayElement.style.padding = '5px';
        speedDisplayElement.style.borderRadius = '3px';
        speedDisplayElement.style.zIndex = '9999';
        speedDisplayElement.style.display = 'none';
        document.body.appendChild(speedDisplayElement);
    };

    /**
     * Updates the speed display with the current playback rate.
     * @param {number} speed - The playback speed to display.
     */
    const updateSpeedDisplay = (speed) => {
        if (speedDisplayElement) {
            speedDisplayElement.textContent = `速度: ${speed.toFixed(1)}x`;
            speedDisplayElement.style.display = 'block';
            clearTimeout(speedDisplayElement.hideTimeout);
            speedDisplayElement.hideTimeout = setTimeout(() => {
                speedDisplayElement.style.display = 'none';
            }, 2000); // 显示 2 秒后隐藏
        }
    };

    /**
     * Creates an element to display progress information.
     */
    const createProgressInfo = () => {
        progressInfoElement = document.createElement('div');
        progressInfoElement.style.position = 'fixed';
        progressInfoElement.style.bottom = '20px';
        progressInfoElement.style.right = '20px';
        progressInfoElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        progressInfoElement.style.color = 'white';
        progressInfoElement.style.padding = '10px';
        progressInfoElement.style.borderRadius = '5px';
        progressInfoElement.style.zIndex = '9999';
        progressInfoElement.style.fontFamily = 'Arial, sans-serif';
        progressInfoElement.style.userSelect = 'none';
        // 添加过渡动画
        progressInfoElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        progressInfoElement.style.opacity = '0';
        progressInfoElement.style.transform = 'translateY(10px)';
        progressInfoElement.style.pointerEvents = 'none'; // 防止鼠标事件干扰
        document.body.appendChild(progressInfoElement);
    };

    /**
     * 显示进度信息框（带渐入效果）
     */
    const showProgressInfoWithFade = () => {
        if (progressInfoElement) {
            // 先确保元素是可见的
            progressInfoElement.style.display = 'block';
            // 强制浏览器重排
            void progressInfoElement.offsetWidth;
            // 应用过渡效果
            progressInfoElement.style.opacity = '1';
            progressInfoElement.style.transform = 'translateY(0)';
        }
    };

    /**
     * 隐藏进度信息框（带渐出效果）
     */
    const hideProgressInfoWithFade = () => {
        if (progressInfoElement) {
            progressInfoElement.style.opacity = '0';
            progressInfoElement.style.transform = 'translateY(10px)';
            // 等待过渡动画完成后再隐藏
            setTimeout(() => {
                progressInfoElement.style.display = 'none';
            }, 300);
        }
    };

    /**
     * Creates an element to indicate dragging position and show relevant information.
     */
    const createDragIndicator = () => {
        dragIndicatorElement = document.createElement('div');
        // 设置基础样式
        dragIndicatorElement.style.position = 'fixed';
        dragIndicatorElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        dragIndicatorElement.style.color = 'white';
        dragIndicatorElement.style.padding = '8px 12px';
        dragIndicatorElement.style.borderRadius = '6px';
        dragIndicatorElement.style.zIndex = '9998';
        dragIndicatorElement.style.pointerEvents = 'none';
        dragIndicatorElement.style.fontFamily = 'Arial, sans-serif';
        dragIndicatorElement.style.fontSize = '14px';
        dragIndicatorElement.style.fontWeight = 'bold';
        dragIndicatorElement.style.textAlign = 'center';
        dragIndicatorElement.style.minWidth = '80px';
        dragIndicatorElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.5)';
        dragIndicatorElement.style.display = 'none';
        // 添加过渡动画
        dragIndicatorElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        dragIndicatorElement.style.opacity = '0';
        dragIndicatorElement.style.transform = 'translateY(10px)';
        // 添加三角形指示器
        dragIndicatorElement.innerHTML = `
            <div class="drag-info-text"></div>
            <div class="drag-info-value"></div>
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
                        width: 0; height: 0; border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid rgba(0, 0, 0, 0.8);"></div>
        `;
        document.body.appendChild(dragIndicatorElement);
    };

    /**
     * 显示拖动指示器（带渐入效果）
     */
    const showDragIndicatorWithFade = () => {
        if (dragIndicatorElement) {
            // 先确保元素是可见的
            dragIndicatorElement.style.display = 'block';
            // 强制浏览器重排
            void dragIndicatorElement.offsetWidth;
            // 应用过渡效果
            dragIndicatorElement.style.opacity = '1';
            dragIndicatorElement.style.transform = 'translateY(0)';
        }
    };

    /**
     * 隐藏拖动指示器（带渐出效果）
     */
    const hideDragIndicatorWithFade = () => {
        if (dragIndicatorElement) {
            dragIndicatorElement.style.opacity = '0';
            dragIndicatorElement.style.transform = 'translateY(10px)';
            // 等待过渡动画完成后再隐藏
            setTimeout(() => {
                dragIndicatorElement.style.display = 'none';
            }, 300);
        }
    };

    /**
     * 显示播放/暂停图标
     */
    const showPlayPauseIndicator = (x, y, isPlaying) => {
        if (dragIndicatorElement) {
            // 设置位置
            dragIndicatorElement.style.left = (x - dragIndicatorElement.offsetWidth / 2) + 'px';
            dragIndicatorElement.style.top = (y - 50) + 'px';

            // 设置内容
            const textElement = dragIndicatorElement.querySelector('.drag-info-text');
            const valueElement = dragIndicatorElement.querySelector('.drag-info-value');

        if (textElement && valueElement) {
            textElement.textContent = '';

            // 使用SVG图标
            if (isPlaying) {
                // 暂停图标
                valueElement.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>`;
            } else {
                // 播放图标
                valueElement.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <polygon points="8,5 19,12 8,19"/>
                </svg>`;
            }

            valueElement.style.display = 'flex';
            valueElement.style.justifyContent = 'center';
            valueElement.style.alignItems = 'center';
            valueElement.style.marginTop = '0';
            valueElement.style.fontSize = 'inherit';
        }

            // 显示指示器
            showDragIndicatorWithFade();

            // 2秒后自动隐藏
            setTimeout(() => {
                hideDragIndicatorWithFade();
            }, 1000);
        }
    };

    /**
     * Updates the drag indicator position and content.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {string} text - The text to display (e.g., '进度' or '音量').
     * @param {string} value - The value to display (e.g., '+5.0秒' or '80%').
     */
    function updateDragIndicator(x, y, text, value) {
        if (!dragIndicatorElement) return;

        // 设置位置，让指示器显示在鼠标上方一点
        dragIndicatorElement.style.left = (x - dragIndicatorElement.offsetWidth / 2) + 'px';
        dragIndicatorElement.style.top = (y - 50) + 'px';

        // 设置文本内容
        const textElement = dragIndicatorElement.querySelector('.drag-info-text');
        const valueElement = dragIndicatorElement.querySelector('.drag-info-value');

        if (textElement && valueElement) {
            textElement.textContent = text;
            valueElement.textContent = value;
            valueElement.style.fontSize = '16px';
            valueElement.style.marginTop = '2px';
        }
    }

    // -------------------- Keyboard Event Handlers --------------------

    /**
     * Registers keyboard event listeners.
     */
    const registerKeyboardEvents = () => {
        // 将事件监听器绑定到 document 对象，使用 capture 模式，确保优先级更高
        document.addEventListener('keydown', onRightKeyDown, { capture: true });
        document.addEventListener('keydown', onLeftKeyDown, { capture: true });
        document.addEventListener('keyup', onRightKeyUp, { capture: true });
        document.addEventListener('keyup', onLeftKeyUp, { capture: true });
        // 处理 Shift + 上方向键的事件监听器
        document.addEventListener('keydown', onShiftUpKeyDown, { capture: true });
        // 处理 Shift + 下方向键的事件监听器
        document.addEventListener('keydown', onShiftDownKeyDown, { capture: true });
        // 处理右 Ctrl 键的事件监听器
        document.addEventListener('keydown', onRightCtrlKeyDown, { capture: true });
        // 处理小键盘 1 - 9 键的事件监听器
        document.addEventListener('keydown', onNumpadKeyDown, { capture: true });

        // 添加全局鼠标事件监听
        document.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', endDrag);

        log('键盘和鼠标事件已注册');
    };



    /**
     * Handles the right arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onRightKeyDown = async (e) => {
        if (e.code !== 'ArrowRight' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        state.rightKeyDownCount++;



        // 检查是否按住了Shift键，如果是，则快进15秒
        if (e.shiftKey && await checkPageVideo()) {
            state.pageVideo.currentTime += SHIFT_TIME;
            log('Shift+右键快进 ' + SHIFT_TIME + ' 秒');
            return;
        }

        if (state.rightKeyDownCount === 2 && await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.originalPlaybackRate = state.pageVideo.playbackRate;
            state.pageVideo.playbackRate = state.playbackRate;
            log('加速播放中, 倍速: ' + state.playbackRate);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the right arrow key up event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onRightKeyUp = async (e) => {
        if (e.code !== 'ArrowRight' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();

        // 检查是否按住了Shift键，如果是，则不执行原有的5秒快进（因为已经在keydown时执行了15秒快进）
        if (!e.shiftKey && state.rightKeyDownCount === 1 && await checkPageVideo()) {
            state.pageVideo.currentTime += state.changeTime;
            log('前进 ' + state.changeTime + ' 秒');
        }

        // 恢复原来的倍速
        // 修改：无论是否手动设置了倍速，都恢复到原始倍速
        if (state.pageVideo && state.pageVideo.playbackRate !== state.originalPlaybackRate) {
            state.pageVideo.playbackRate = state.originalPlaybackRate;
            log('恢复原来的倍速: ' + state.originalPlaybackRate);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }

        state.rightKeyDownCount = 0;
    };

    /**
     * Handles the left arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onLeftKeyDown = async (e) => {
        if (e.code !== 'ArrowLeft' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        state.leftKeyDownCount++;



        // 检查是否按住了Shift键，如果是，则快退15秒
        if (e.shiftKey && await checkPageVideo()) {
            state.pageVideo.currentTime -= SHIFT_TIME;
            // 确保时间不会小于0
            state.pageVideo.currentTime = Math.max(0, state.pageVideo.currentTime);
            log('Shift+左键快退 ' + SHIFT_TIME + ' 秒');
            return;
        }

        if (state.leftKeyDownCount === 2 && await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.originalPlaybackRate = state.pageVideo.playbackRate;
            state.pageVideo.playbackRate = 0.5; // 减速播放
            log('减速播放中, 倍速: 0.5');
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the left arrow key up event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onLeftKeyUp = async (e) => {
        if (e.code !== 'ArrowLeft' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();

        // 检查是否按住了Shift键，如果是，则不执行原有的5秒快退（因为已经在keydown时执行了15秒快退）
        if (!e.shiftKey && state.leftKeyDownCount === 1 && await checkPageVideo()) {
            state.pageVideo.currentTime -= state.changeTime;
            // 确保时间不会小于0
            state.pageVideo.currentTime = Math.max(0, state.pageVideo.currentTime);
            log('后退 ' + state.changeTime + ' 秒');
        }

        // 恢复原来的倍速
        // 修改：无论是否手动设置了倍速，都恢复到原始倍速
        if (state.pageVideo && state.pageVideo.playbackRate !== state.originalPlaybackRate) {
            state.pageVideo.playbackRate = state.originalPlaybackRate;
            log('恢复原来的倍速: ' + state.originalPlaybackRate);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }

        state.leftKeyDownCount = 0;
    };

    /**
     * Handles the Shift + Up arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onShiftUpKeyDown = async (e) => {
        if (e.code !== 'ArrowUp' || !e.shiftKey || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        if (await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.pageVideo.playbackRate = Math.min(state.pageVideo.playbackRate + 0.5, 16); // 限制最大播放速度为 16 倍
            state.originalPlaybackRate = state.pageVideo.playbackRate;  // 更新原始播放速度
            state.isManualSpeedSet = true;  // 标记为手动设置速度
            log('播放速度增加到: ' + state.pageVideo.playbackRate);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the Shift + Down arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onShiftDownKeyDown = async (e) => {
        if (e.code !== 'ArrowDown' || !e.shiftKey || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        if (await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.pageVideo.playbackRate = Math.max(state.pageVideo.playbackRate - 0.5, 0.1); // 限制最小播放速度为 0.1 倍
            state.originalPlaybackRate = state.pageVideo.playbackRate;  // 更新原始播放速度
            state.isManualSpeedSet = true;  // 标记为手动设置速度
            log('播放速度减少到: ' + state.pageVideo.playbackRate);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the right Ctrl key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onRightCtrlKeyDown = async (e) => {
        if (e.code !== 'ControlRight' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        if (await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.pageVideo.playbackRate = 1;
            log('恢复正常播放速度: 1 倍');
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the numpad key down event (1 - 9).
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onNumpadKeyDown = async (e) => {
        if (isInputFocused()) return;
        const keyMap = {
            'Numpad0': 1,
            'Numpad1': 1.5,
            'Numpad2': 2,
            'Numpad3': 3,
            'Numpad4': 4,
            'Numpad5': 5,
            'Numpad6': 6,
            'Numpad7': 7,
            'Numpad8': 8,
            'Numpad9': 9
        };
        const speed = keyMap[e.code];
        if (speed && await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.pageVideo.playbackRate = speed;
            state.originalPlaybackRate = speed;  // 更新原始播放速度为用户设置的速度
            state.isManualSpeedSet = true;       // 标记为手动设置速度
            log(`设置播放速度为: ${speed} 倍`);
            updateSpeedDisplay(state.pageVideo.playbackRate);
        }
    };

    // -------------------- Mouse Drag Control --------------------

    /**
     * Initializes the video element for drag control.
     */
    function initVideo() {
        video = document.querySelector('video');
        if (video) {
            // 设置默认窗口大小（只在第一次初始化时设置）
            if (defaultVideoWidth === 0) {
                defaultVideoWidth = video.offsetWidth;
                log('默认视频宽度设置为:', defaultVideoWidth);
            }

            updateSensitivity(); // 初始化灵敏度
            updateProgressInfo();

            // 找到B站的播放器容器
            const playerWrap = document.querySelector('.bpx-player-video-wrap, .bilibili-player-video');
            if (playerWrap) {
                playerWrap.addEventListener('mousedown', handleVideoMouseDown, { capture: true });
                playerWrap.addEventListener('click', handleVideoClick, { capture: true });

                // 监听窗口大小变化
                const resizeObserver = new ResizeObserver(() => {
                    updateSensitivity();
                });
                resizeObserver.observe(playerWrap);
            }
        } else {
            setTimeout(initVideo, 500);
        }
    }

    /**
     * Updates sensitivity based on current video window size.
     */
    function updateSensitivity() {
        if (!video) return;

        const currentWidth = video.offsetWidth;
        if (defaultVideoWidth > 0 && currentWidth > 0) {
            // 灵敏度与窗口大小成反比（窗口越大，灵敏度越低）
            currentSensitivity = baseSensitivity * (defaultVideoWidth / currentWidth);
            log(`更新灵敏度: 窗口宽度 ${currentWidth}px, 灵敏度 ${currentSensitivity.toFixed(2)}`);
        }
    }

    /**
     * Handles mousedown events on video elements.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleVideoMouseDown(e) {
        if (e.button === 0) { // 只处理左键
            e.stopImmediatePropagation();
            e.preventDefault();
            startDrag(e);
        }
    }

    /**
     * Handles click events on video elements.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleVideoClick(e) {
        if (e.button === 0) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }

    /**
     * Updates the progress information display.
     */
    function updateProgressInfo() {
        if (!video || !progressInfoElement) return;

        // 只在显示模式开启或正在拖动时更新和显示进度信息
        if (showProgressInfo || isDragging) {
            const currentTime = video.currentTime;
            const duration = video.duration;
            const progressPercent = (currentTime / duration * 100).toFixed(2);

            progressInfoElement.innerHTML = `
                <div>当前时间: ${formatTime(currentTime)}</div>
                <div>总时长: ${formatTime(duration)}</div>
                <div>进度: ${progressPercent}%</div>
                <div>剩余时间: ${formatTime(duration - currentTime)}</div>
                <div style="font-size:12px;color:#ccc;">当前灵敏度: ${currentSensitivity.toFixed(2)}</div>
                <div>音量: ${Math.round(video.volume * 100)}%</div>
            `;

            showProgressInfoWithFade();
        } else {
            // 非拖动状态且显示模式关闭时隐藏
            hideProgressInfoWithFade();
        }
    }

    /**
     * Formats seconds into HH:MM:SS format.
     * @param {number} seconds - The time in seconds to format.
     * @returns {string} - The formatted time string.
     */
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00:00';

        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    /**
     * Starts the drag operation.
     * @param {MouseEvent} e - The mouse event.
     */
function startDrag(e) {
    // 检查鼠标是否在视频元素上点击，如果不是则不执行任何操作
    const targetElement = e.target;
    let isClickOnVideo = false;

    // 检查点击目标是否是视频元素或视频元素的子元素
    if (targetElement.tagName.toLowerCase() === 'video') {
        isClickOnVideo = true;
    } else {
        // 查找最近的视频元素祖先
        const closestVideo = targetElement.closest('video');
        if (closestVideo) {
            isClickOnVideo = true;
        } else {
            // 也检查是否点击在常见的视频容器上
            const closestPlayer = targetElement.closest('.bpx-player-video-wrap, .bilibili-player-video, .video-container, .player-container');
            if (closestPlayer) {
                isClickOnVideo = true;
            }
        }
    }

    // 如果不是在视频上点击，直接返回
    if (!isClickOnVideo) return;

    if (!video || e.button !== 0) return;

    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    startTime = video.currentTime;
    initialVolume = video.volume;
    wasPlaying = !video.paused;
    dragDirection = null; // 重置拖动方向

    // 显示拖动指示器（带渐入效果）
    updateDragIndicator(e.clientX, e.clientY, '', '');
    showDragIndicatorWithFade();

    document.body.style.userSelect = 'none';
}

    /**
     * Handles drag movement.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleDrag(e) {
        if (!isDragging || !video) return;

        // 检查鼠标是否移动（超过5像素视为拖动）
        if (!hasMoved && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) {
            hasMoved = true;

            // 确定初始拖动方向
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 使用较小的阈值(1.2)来确定初始方向，这样更容易准确判断用户的意图
            if (Math.abs(deltaX) > Math.abs(deltaY * 1.2)) {
                dragDirection = 'horizontal';
            } else if (Math.abs(deltaY) > Math.abs(deltaX * 1.2)) {
                dragDirection = 'vertical';
            } else {
                // 如果没有明显的方向，默认视为水平拖动（保持原有功能的优先性）
                dragDirection = 'horizontal';
            }
        }

        if (hasMoved && dragDirection) {
            const deltaX = e.clientX - startX;
            const deltaY = startY - e.clientY; // 反转Y轴方向，向上拖动增加音量

            // 根据初始确定的方向执行相应操作
            if (dragDirection === 'horizontal') {
                // 水平拖动控制进度
                const deltaTime = deltaX * currentSensitivity;
                let newTime = startTime + deltaTime;
                newTime = Math.max(0, Math.min(video.duration, newTime));
                video.currentTime = newTime;

                // 更新拖动指示器显示进度信息
                const timeText = deltaTime > 0 ? '+' + deltaTime.toFixed(1) : deltaTime.toFixed(1);
                updateDragIndicator(e.clientX, e.clientY, '进度调整', timeText + '秒');

                // 进度信息 - 拖动时始终显示
                if (progressInfoElement) {
                    const progressPercent = (newTime / video.duration * 100).toFixed(2);
                    progressInfoElement.innerHTML = `
                        <div>当前时间: ${formatTime(newTime)}</div>
                        <div>总时长: ${formatTime(video.duration)}</div>
                        <div>进度: ${progressPercent}%</div>
                        <div>剩余时间: ${formatTime(video.duration - newTime)}</div>
                        <div style="color: #ff9; font-weight: bold;">拖动中 (${deltaTime > 0 ? '+' : ''}${deltaTime.toFixed(1)}秒)</div>
                        <div style="font-size:12px;color:#ccc;">当前灵敏度: ${currentSensitivity.toFixed(2)}</div>
                        <div>音量: ${Math.round(video.volume * 100)}%</div>
                    `;
                    showProgressInfoWithFade(); // 拖动时强制显示，带渐入效果
                }
            } else if (dragDirection === 'vertical') {
                // 垂直拖动控制音量
                const deltaVolume = deltaY * VOLUME_SENSITIVITY;
                let newVolume = Math.max(0, Math.min(1, initialVolume + deltaVolume));
                video.volume = newVolume;

                // 更新拖动指示器显示**当前音量**（而不是变化量）
                const currentVolumePercent = Math.round(newVolume * 100);
                updateDragIndicator(e.clientX, e.clientY, '当前音量', currentVolumePercent + '%');

                // 音量信息 - 拖动时始终显示
                if (progressInfoElement) {
                    const progressPercent = (video.currentTime / video.duration * 100).toFixed(2);
                    progressInfoElement.innerHTML = `
                        <div>当前时间: ${formatTime(video.currentTime)}</div>
                        <div>总时长: ${formatTime(video.duration)}</div>
                        <div>进度: ${progressPercent}%</div>
                        <div>剩余时间: ${formatTime(video.duration - video.currentTime)}</div>
                        <div style="color: #ff9; font-weight: bold;">音量调整 (${deltaVolume > 0 ? '+' : ''}${Math.round(deltaVolume * 100)}%)</div>
                        <div style="font-size:12px;color:#ccc;">当前灵敏度: ${currentSensitivity.toFixed(2)}</div>
                        <div>音量: ${currentVolumePercent}%</div>
                    `;
                    progressInfoElement.style.display = 'block'; // 拖动时强制显示
                }
            }

            // 更新拖动指示器位置
            const centerX = e.clientX - dragIndicatorElement.offsetWidth / 2;
            const centerY = e.clientY - 70; // 向上偏移50像素，让指示器显示在鼠标上方
            dragIndicatorElement.style.left = centerX + 'px';
            dragIndicatorElement.style.top = centerY + 'px';
        }
    }

    /**
     * Ends the drag operation.
     * @param {MouseEvent} e - The mouse event.
     */
    function endDrag(e) {
        if (!isDragging) return;

        isDragging = false;
        const wasClick = !hasMoved;

        // 重置用户选择
        document.body.style.userSelect = '';

        // 如果没有移动（视为点击），则切换播放状态并显示图标
        if (wasClick && video) {
            const willPlay = video.paused;

            if (willPlay) {
                video.play().catch(e => log('播放失败:', e));
            } else {
                video.pause();
            }

            // 显示播放/暂停图标
            showPlayPauseIndicator(e.clientX, e.clientY, !willPlay); // 显示相反状态图标
        } else if (wasPlaying && video.paused) {
            video.play().catch(e => log('自动播放失败:', e));

            // 如果不是点击而是拖动，正常隐藏指示器
            hideDragIndicatorWithFade();
        } else {
            // 正常隐藏指示器
            hideDragIndicatorWithFade();
        }

        // 拖动结束后，根据showProgressInfo设置决定是否隐藏信息框
        updateProgressInfo();
    }

    // -------------------- Configuration Functions --------------------

    /**
     * Toggles the display of progress information.
     */
    const toggleProgressInfoDisplay = async () => {
        showProgressInfo = !showProgressInfo;
        await saveSetting(SHOW_PROGRESS_INFO_KEY, showProgressInfo);

        if (progressInfoElement) {
            if (showProgressInfo) {
                showProgressInfoWithFade();
            } else {
                hideProgressInfoWithFade();
            }
        }

        // 拖动指示器不受此设置影响
        if (dragIndicatorElement) {
            dragIndicatorElement.style.display = 'none';
        }

        alert(showProgressInfo ? '已启用右下角播放信息显示' : '已禁用右下角播放信息显示');
        log(`播放信息显示状态: ${showProgressInfo ? '启用' : '禁用'}`);
    };

    /**
     * Prompts the user to set a new playback rate.
     */
    const configurePlaybackRate = async () => {
        const newRate = prompt('请输入新的播放倍速 (当前: ' + state.playbackRate + ')', state.playbackRate);
        if (newRate !== null) {
            const parsedRate = parseFloat(newRate);
            if (!isNaN(parsedRate) && parsedRate > 0) {
                state.playbackRate = parsedRate;
                await saveSetting('playbackRate', state.playbackRate);
                log('播放倍速设置为: ' + state.playbackRate);
            } else {
                alert('请输入一个有效的倍速数字。');
            }
        }
    };

    /**
     * Prompts the user to set a new change time for fast-forward/rewind.
     */
    const configureChangeTime = async () => {
        const newTime = prompt('请输入新的快进/回退秒数 (当前: ' + state.changeTime + ')', state.changeTime);
        if (newTime !== null) {
            const parsedTime = parseFloat(newTime);
            if (!isNaN(parsedTime) && parsedTime > 0) {
                state.changeTime = parsedTime;
                await saveSetting('changeTime', state.changeTime);
                log('快进/回退秒数设置为: ' + state.changeTime);
            } else {
                alert('请输入一个有效的秒数。');
            }
        }
    };

    /**
     * Sets the tabIndex of all progress bars to control focus behavior.
     */
    function configureProgressBars() {
        const configureProgressBar = (progressBar) => {
            // 防止在有视频时意外获得焦点
            progressBar.addEventListener('focus', () => {
                if (checkPageVideo()) {
                    progressBar.blur(); // 移除焦点
                }
            });

            log(`已配置进度条:`, progressBar);
        };

        // 初始配置页面上已有的进度条
        const progressBars = document.querySelectorAll('input[type="range"][class*="slider"], input[type="range"][class*="progress"], input[type="range"][role="slider"]');
        progressBars.forEach(configureProgressBar);

        // 监听DOM变化，处理新添加的进度条
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const progressBars = node.matches('input[type="range"]') ? [node] : node.querySelectorAll('input[type="range"][class*="slider"], input[type="range"][class*="progress"], input[type="range"][role="slider"]');
                        progressBars.forEach(configureProgressBar);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // -------------------- Initialization --------------------

    /**
     * Initializes the userscript by setting up event listeners and observers.
     */
    const init = async () => {
        try {
            // 创建UI元素
            createSpeedDisplay();
            createProgressInfo();
            createDragIndicator();

            // 加载是否显示进度信息的设置
            showProgressInfo = await loadSetting(SHOW_PROGRESS_INFO_KEY, true);
            if (progressInfoElement) {
                if (showProgressInfo) {
                    showProgressInfoWithFade();
                } else {
                    progressInfoElement.style.display = 'none';
                }
            }

            // 拖动指示器默认隐藏
            if (dragIndicatorElement) {
                dragIndicatorElement.style.display = 'none';
            }

            // 注册菜单命令
            GM_registerMenuCommand('设置播放倍速', configurePlaybackRate);
            GM_registerMenuCommand('设置快进/回退秒数', configureChangeTime);
            GM_registerMenuCommand('启用/禁用右下角播放信息', toggleProgressInfoDisplay);

            // 缓存现有视频并设置监听器
            cacheAllVideos();

            // 监听DOM变化，处理动态添加或删除的视频
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        const addedVideos = findVideosRecursively(node); // 查找新增节点中的 video
                        if (addedVideos.length > 0) {
                            initVideoListeners(addedVideos); // 初始化新增视频
                            log('添加新视频:', addedVideos);
                        }
                    });

                    const removedNodes = Array.from(mutation.removedNodes);
                    removedNodes.forEach(node => {
                        const removedVideos = findVideosRecursively(node); // 查找移除节点中的 video
                        if (removedVideos.length > 0) {
                            removeFromCache(removedVideos); // 移除缓存中的视频
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
            log('MutationObserver 已启动');

            // 配置进度条的焦点行为
            configureProgressBars();

            // 初始化视频拖动控制
            initVideo();

            // 注册键盘事件监听器
            registerKeyboardEvents();
        } catch (error) {
            console.error('初始化脚本时发生错误:', error);
        }
    };

    // 执行初始化
    init();
})();
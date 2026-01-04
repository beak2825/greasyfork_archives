// ==UserScript==
// @name         按C快进
// @name:en      Video Fast Forward (Hold C) - Bottom-Right Selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在非输入状态下，长按 'C' 键加速。视频暂停时，在视频右下角显示速度选择器 (2.0x-5.0x)，选择会保存。
// @description:en Hold 'C' (when not typing) to speed up video. Shows a speed selector (2.0x-5.0x) near video bottom-right when paused; choice is saved.
// @author       haku
// @match        https://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535020/%E6%8C%89C%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/535020/%E6%8C%89C%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = null;
    let speedSelectorElement = null;
    let originalPlaybackRate = 1.0;
    let isSpeedingUp = false;
    let targetSpeed = 2.0;

    const speedOptions = [2.0, 2.5, 3.0, 5.0];
    const storageKey = 'holdCSpeedTarget';
    let isSelectorVisible = false;
    let currentVideoListeners = {};
    const cornerPadding = 15; // 设置选择器距离视频右下角的边距 (像素)

    // --- 核心按键处理函数 (handleKeyDown, handleKeyUp - 无变化) ---
    function handleKeyDown(event) {
        if (event.key.toLowerCase() !== 'c' || isSpeedingUp) return;
        const target = event.target;
        const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
        if (isTyping) return;
        if (!videoElement) {
             videoElement = findVideoElement();
             if (!videoElement) return;
        }
        isSpeedingUp = true;
        originalPlaybackRate = videoElement.playbackRate;
        videoElement.playbackRate = targetSpeed;
    }

    function handleKeyUp(event) {
        if (event.key.toLowerCase() !== 'c' || !isSpeedingUp) return;
        if (videoElement) {
            videoElement.playbackRate = originalPlaybackRate;
        }
        isSpeedingUp = false;
    }

    // --- UI 样式 (addControlStyles - 无变化) ---
     function addControlStyles() {
        GM_addStyle(`
            #speed-selector-container {
                position: absolute;
                z-index: 2147483640;
                background-color: rgba(30, 30, 30, 0.88);
                padding: 10px 15px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                color: #f0f0f0;
                display: none;
                align-items: center;
                gap: 10px;
                cursor: default;
                transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
                opacity: 0;
                transform: scale(0.9);
                white-space: nowrap;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            #speed-selector-container.visible {
                display: flex;
                opacity: 1;
                transform: scale(1);
            }
            #speed-selector-container label {
                margin: 0; padding: 0; color: #e0e0e0; user-select: none;
            }
            #speed-selector-select {
                background-color: #444; color: #f0f0f0; border: 1px solid #666;
                border-radius: 4px; padding: 4px 6px; font-size: 14px;
                vertical-align: middle; cursor: pointer; outline: none;
            }
            #speed-selector-select:focus {
                border-color: #99c; box-shadow: 0 0 5px rgba(153, 153, 204, 0.5);
            }
        `);
    }

    // --- UI 创建 (createSpeedSelector - 无变化) ---
    function createSpeedSelector(currentSpeed) {
        const container = document.createElement('div');
        container.id = 'speed-selector-container';
        container.addEventListener('keydown', (e) => e.stopPropagation());
        container.addEventListener('keyup', (e) => e.stopPropagation());

        const label = document.createElement('label');
        label.htmlFor = 'speed-selector-select';
        label.textContent = '按 C 加速:';

        const select = document.createElement('select');
        select.id = 'speed-selector-select';

        speedOptions.forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.textContent = `${speed.toFixed(1)}x`;
            if (speed === currentSpeed) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', handleSpeedSelectionChange);

        container.appendChild(label);
        container.appendChild(select);
        document.body.appendChild(container);
        speedSelectorElement = container;
    }

    // --- UI 定位与可见性控制 (updateSelectorPosition - **修改**) ---
    function updateSelectorPosition() {
        if (!videoElement || !speedSelectorElement || !isSelectorVisible) return;

        const videoRect = videoElement.getBoundingClientRect();

        // 如果视频完全不可见，则隐藏选择器
        if (videoRect.width <= 0 || videoRect.height <= 0 || videoRect.bottom <= 0 || videoRect.top >= window.innerHeight || videoRect.right <= 0 || videoRect.left >= window.innerWidth) {
            hideSelector();
            return;
        }

        const selectorWidth = speedSelectorElement.offsetWidth;
        const selectorHeight = speedSelectorElement.offsetHeight;
        if (selectorWidth === 0 || selectorHeight === 0) {
            requestAnimationFrame(updateSelectorPosition); // 等待渲染获取尺寸
            return;
        }

        // **** 定位逻辑修改 ****
        // 计算目标 top: 视频底部 - 选择器高度 - 边距
        const targetTop = videoRect.bottom + window.scrollY - selectorHeight - cornerPadding;
        // 计算目标 left: 视频右侧 - 选择器宽度 - 边距
        const targetLeft = videoRect.right + window.scrollX - selectorWidth - cornerPadding;
        // **** 定位逻辑修改结束 ****


        // 边界检查: 确保选择器至少在视口内可见 (距离视口边缘至少5px)
        const finalTop = Math.max(window.scrollY + 5, Math.min(targetTop, window.scrollY + window.innerHeight - selectorHeight - 5));
        const finalLeft = Math.max(window.scrollX + 5, Math.min(targetLeft, window.scrollX + window.innerWidth - selectorWidth - 5));

        speedSelectorElement.style.top = `${finalTop}px`;
        speedSelectorElement.style.left = `${finalLeft}px`;
        // console.log(`定位选择器到右下角: top=${finalTop}px, left=${finalLeft}px`);
    }

    function showSelector() { // (无变化)
        if (!speedSelectorElement || isSelectorVisible) return;
        isSelectorVisible = true;
        speedSelectorElement.classList.add('visible');
        requestAnimationFrame(updateSelectorPosition);
        window.addEventListener('scroll', updateSelectorPosition, { passive: true });
        window.addEventListener('resize', updateSelectorPosition, { passive: true });
    }

    function hideSelector() { // (无变化)
        if (!speedSelectorElement || !isSelectorVisible) return;
        speedSelectorElement.classList.remove('visible');
        isSelectorVisible = false;
        window.removeEventListener('scroll', updateSelectorPosition);
        window.removeEventListener('resize', updateSelectorPosition);
    }

    // --- 视频事件处理 (setupVideoListeners, cleanupVideoListeners - 无变化) ---
    function setupVideoListeners() {
        if (!videoElement) return;
        cleanupVideoListeners();
        currentVideoListeners.pause = showSelector;
        currentVideoListeners.play = hideSelector;
        currentVideoListeners.playing = hideSelector;
        currentVideoListeners.seeking = hideSelector;
        currentVideoListeners.ended = hideSelector;
        for (const eventName in currentVideoListeners) {
            videoElement.addEventListener(eventName, currentVideoListeners[eventName]);
        }
        if (videoElement.paused) showSelector();
        else hideSelector();
    }

    function cleanupVideoListeners() {
        if (!videoElement || Object.keys(currentVideoListeners).length === 0) return;
        for (const eventName in currentVideoListeners) {
            videoElement.removeEventListener(eventName, currentVideoListeners[eventName]);
        }
        currentVideoListeners = {};
    }

    // --- 选择器交互 (handleSpeedSelectionChange - 无变化) ---
    async function handleSpeedSelectionChange(event) {
        const newSpeed = parseFloat(event.target.value);
        if (!isNaN(newSpeed) && speedOptions.includes(newSpeed)) {
            targetSpeed = newSpeed;
            await GM_setValue(storageKey, newSpeed);
            if (isSpeedingUp && videoElement) {
                 videoElement.playbackRate = targetSpeed;
            }
        }
    }

    // --- 查找视频元素 (findVideoElement - 无变化) ---
     function findVideoElement() {
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return null;
        if (videos.length > 1) {
            console.warn('脚本警告: 页面上找到多个视频元素。将控制第一个找到的视频。');
            // Optional: Add logic to select the largest or most visible video
        }
        return videos[0];
    }

     // --- (可选) Mutation Observer (setupMutationObserver - 无变化) ---
     function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
             if (!videoElement) {
                const addedVideos = mutations.flatMap(m => Array.from(m.addedNodes))
                                             .flatMap(node => node.nodeType === 1 ? (node.matches('video') ? [node] : Array.from(node.querySelectorAll('video'))) : []);
                if (addedVideos.length > 0) {
                    const foundVideo = findVideoElement();
                    if (foundVideo) {
                        videoElement = foundVideo;
                        setupVideoListeners();
                    }
                }
             }
             else {
                 const removedNodes = mutations.flatMap(m => Array.from(m.removedNodes));
                 if (removedNodes.includes(videoElement) || removedNodes.some(node => node.contains(videoElement))) {
                     hideSelector();
                     cleanupVideoListeners();
                     videoElement = null;
                 }
             }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- 初始化 (initialize - 无变化) ---
    async function initialize() {
        const savedSpeed = await GM_getValue(storageKey, 2.0);
        targetSpeed = speedOptions.includes(savedSpeed) ? savedSpeed : 2.0;
        if (targetSpeed !== savedSpeed) {
            await GM_setValue(storageKey, targetSpeed);
        }
        addControlStyles();
        createSpeedSelector(targetSpeed);
        videoElement = findVideoElement();
        if (videoElement) {
            setupVideoListeners();
        } else {
            setupMutationObserver();
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    // --- 启动脚本 ---
    initialize().catch(error => {
        console.error("脚本初始化失败:", error);
    });

})();
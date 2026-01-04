// ==UserScript==
// @name         知识星球视频缩放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在知识星球为视频添加一个美观的、不遮挡内容的布局缩放控制器。支持视频从中心突破边界放大，并自动推开上下文内容。
// @author       Gemini、Claude、Lint
// @match        https://*.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zsxq.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542411/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/542411/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    let currentTarget = null; // 当前正在控制的视频容器元素
    let currentGallery = null; // 当前的 gallery 元素

    // --- 样式定义 ---
    GM_addStyle(`
        /* 控制器容器的样式：固定在右下角，垂直紧凑设计 */
        .video-zoom-control-container-fixed {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background-color: rgba(30, 30, 30, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
            z-index: 9999;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
        }

        /* 控制器显示时的样式 */
        .video-zoom-control-container-fixed.visible {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        /* 标题样式 */
        .controller-title {
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            padding-bottom: 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            width: 100%;
            text-align: center;
        }

        /* 控件行的样式 */
        .control-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* 控制器图标样式 */
        .control-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            transition: background-color 0.2s ease;
        }
        .control-icon:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .control-icon svg {
            width: 18px;
            height: 18px;
            fill: #ffffff;
            transition: transform 0.2s ease;
        }
        .control-icon:hover svg {
            transform: scale(1.15);
        }

        /* 滑块样式 */
        .video-zoom-control-container-fixed input[type="range"] {
            width: 110px;
            cursor: pointer;
            margin: 0;
        }

        /* 百分比显示样式 */
        .video-zoom-control-container-fixed .zoom-percentage {
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            min-width: 40px;
            text-align: center;
            font-family: monospace;
        }

        /* 视频缩放相关样式 (核心修改) */
        .zsxq-video-resizer-target {
            /* 修改1: 缩放原点改为中心 */
            transform-origin: center !important;
            /* 修改2: 为 transform 和 margin 添加平滑过渡效果 */
            transition: transform 0.2s ease-in-out, margin 0.2s ease-in-out !important;
        }
    `);

    /**
     * 【核心修改】应用缩放到视频容器
     * 通过 scale transform 放大视觉效果，同时用 margin 推开周围内容
     * @param {HTMLElement} target - 目标元素（视频的直接父容器）
     * @param {number} scale - 缩放比例（0.5-3.0）
     */
    function applyScale(target, scale) {
        if (!target) return;

        // 首次操作时，记录下元素的原始高度
        if (!target.dataset.originalHeight) {
            target.dataset.originalHeight = target.getBoundingClientRect().height;
        }
        const originalHeight = parseFloat(target.dataset.originalHeight);

        // 计算因缩放产生的额外高度，并将其均分为上下外边距
        let verticalMargin = 0;
        if (scale > 1) {
            // (缩放后的总高度 - 原始高度) / 2
            verticalMargin = (originalHeight * (scale - 1)) / 2;
        }

        // 应用 transform 和 margin
        target.style.transform = `scale(${scale})`;
        target.style.marginTop = `${verticalMargin}px`;
        target.style.marginBottom = `${verticalMargin}px`;

        console.log(`ZSXQ Resizer: 应用缩放 ${Math.round(scale * 100)}%`);
    }

    /**
     * 【核心修改】重置视频尺寸
     * @param {HTMLElement} target - 目标元素
     */
    function resetScale(target) {
        if (!target) return;

        // 恢复 transform 和 margin
        target.style.transform = 'scale(1)';
        target.style.marginTop = '0px';
        target.style.marginBottom = '0px';

        console.log('ZSXQ Resizer: 重置视频尺寸');
    }

    /**
     * 创建并初始化全局的缩放控制器
     * @returns {object} 包含控制器各个部分的元素对象
     */
    function createGlobalControls() {
        const container = document.createElement('div');
        container.className = 'video-zoom-control-container-fixed';

        const title = document.createElement('div');
        title.className = 'controller-title';
        title.textContent = '视频尺寸缩放';

        const controlRow = document.createElement('div');
        controlRow.className = 'control-row';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 50;
        slider.max = 300;
        slider.value = 100;
        slider.step = 5;

        const percentageDisplay = document.createElement('span');
        percentageDisplay.className = 'zoom-percentage';
        percentageDisplay.textContent = '100%';

        const resetIcon = document.createElement('div');
        resetIcon.className = 'control-icon';
        resetIcon.title = '恢复原始尺寸';
        resetIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 6v3l4-4l-4-4v3c-4.42 0-8 3.58-8 8c0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8c0 3.31-2.69 6-6 6v-3l-4 4l4 4v-3c4.42 0 8-3.58 8-8c0-1.57-.46-3.03-1.24-4.26z"/></svg>`;

        controlRow.append(slider, percentageDisplay, resetIcon);
        container.append(title, controlRow);
        document.body.appendChild(container);

        // --- 事件监听 ---
        const updateScale = (value) => {
            if (currentTarget) {
                const scaleValue = parseInt(value);
                const scaleFactor = scaleValue / 100;
                percentageDisplay.textContent = `${scaleValue}%`;
                applyScale(currentTarget, scaleFactor);
            }
        };

        slider.addEventListener('input', (e) => {
            updateScale(e.target.value);
        });

        resetIcon.addEventListener('click', () => {
            if (currentTarget) {
                slider.value = 100;
                percentageDisplay.textContent = '100%';
                resetScale(currentTarget);
            }
        });

        return { container, slider, percentageDisplay };
    }

    const controls = createGlobalControls();

    /**
     * 为指定的视频容器添加缩放控制功能
     * @param {HTMLElement} videoGallery - 包含 <video> 标签的 app-video-gallery 元素
     */
    function addZoomControls(videoGallery) {
        if (videoGallery.dataset.zoomControllerAdded) {
            return;
        }
        videoGallery.dataset.zoomControllerAdded = 'true';

        const videoElement = videoGallery.querySelector('video');
        if (!videoElement) {
            console.log('ZSXQ Resizer: 在 gallery 中未找到 video 元素');
            return;
        }

        const targetToResize = videoElement.parentElement;
        if (!targetToResize) {
            console.log('ZSXQ Resizer: 未找到视频的父容器');
            return;
        }

        // 【新增逻辑】在切换到新视频前，重置上一个视频的缩放状态
        if (currentTarget && currentTarget !== targetToResize) {
             resetScale(currentTarget);
        }

        targetToResize.classList.add('zsxq-video-resizer-target');

        // 设置为当前目标
        currentTarget = targetToResize;
        currentGallery = videoGallery;

        // 重置控制器状态并应用到新目标
        controls.slider.value = 100;
        controls.percentageDisplay.textContent = '100%';
        resetScale(currentTarget); // 确保新目标是默认状态

        // 显示控制器
        controls.container.classList.add('visible');

        console.log('ZSXQ Resizer: 已为视频添加缩放控制功能');
    }

    /**
     * 检查并处理页面上所有尚未处理的视频 gallery
     */
    function processVideoGalleries() {
        const galleries = document.querySelectorAll('app-video-gallery:not([data-zoom-controller-added])');

        if (galleries.length > 0) {
            if (currentTarget) {
                 controls.container.classList.remove('visible');
            }

            // 处理最新的视频
            const latestGallery = galleries[galleries.length - 1];
            addZoomControls(latestGallery);
        }
    }

    /**
     * 隐藏控制器并清除目标
     */
    function hideControls() {
        if (currentTarget) {
            resetScale(currentTarget);
        }
        currentTarget = null;
        currentGallery = null;
        controls.container.classList.remove('visible');
    }

    // --- 核心逻辑：使用 MutationObserver ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                let hasNewVideo = false;
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const gallery = node.matches && node.matches('app-video-gallery') ? node :
                                        node.querySelector && node.querySelector('app-video-gallery');
                        if (gallery) {
                            hasNewVideo = true;
                        }
                    }
                });

                if (hasNewVideo) {
                    setTimeout(processVideoGalleries, 100);
                }
            }
        }
    });

    // 定期检查当前目标是否还在页面上
    setInterval(() => {
        if (currentGallery && !document.body.contains(currentGallery)) {
            hideControls();
        }
    }, 1000);

    // 首次加载时，先立即运行一次
    setTimeout(processVideoGalleries, 200);

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
// ==UserScript==
// @name         东软智慧平台视频助手 2025
// @namespace    zhangyisuidrzhpt
// @version      1.0
// @description  自动跳过智慧平台音视频，带开关
// @author       zhangyisui
// @match        https://neustudydl.neumooc.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530313/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/530313/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 开关：控制是否启用自动跳过功能
    const ENABLE_AUTO_SKIP = true; // 设置为 true 启用，false 禁用

    // CSS 样式定义
    const cssStyles = `
        .skip-button {
            display: inline-block;
            border-radius: 4px;
            background-color: #000000;
            border: none;
            color: #FFFFFF;
            text-align: center;
            font-size: 14px;
            padding: 8px 16px;
            transition: all 0.6s;
            cursor: pointer;
            margin: 5px;
            position: fixed;
            bottom: 160px;
            right: 10px;
            z-index: 10000;
        }
        .skip-button:hover {
            background-color: #444444;
            color: #FFFF00;
        }
        .skip-button:active {
            background-color: #222222;
            box-shadow: 0 3px #666;
            transform: translateY(4px);
        }
    `;

    // 添加样式到页面
    const styleElement = document.createElement('style');
    styleElement.textContent = cssStyles;
    document.head.appendChild(styleElement);

    // 使用 WeakSet 存储已处理的媒体元素
    const processedMedia = new WeakSet();

    // 等待媒体元数据加载完成
    const waitForMetadata = (media) => {
        return new Promise((resolve) => {
            if (media.readyState >= 1) { // HAVE_METADATA
                resolve();
            } else {
                media.addEventListener('loadedmetadata', resolve, { once: true });
            }
        });
    };

    // 处理单个媒体元素
    const processSingleMedia = async (media) => {
        if (processedMedia.has(media) || media.ended) return;

        try {
            media.muted = false;
            await waitForMetadata(media); // 等待元数据加载
            await media.play(); // 确保播放开始
            if (!isNaN(media.duration) && media.duration > 0) {
                media.currentTime = media.duration; // 跳转到末尾
            }
            media.addEventListener('ended', () => {
                processedMedia.add(media);
                checkAllProcessed();
            }, { once: true });
        } catch (err) {
            console.log(`无法处理 ${media.tagName.toLowerCase()}: ${err}`);
        }
    };

    // 检查是否所有媒体都已处理并停止观察
    const checkAllProcessed = () => {
        const mediaTypes = ['video', 'audio'];
        let allProcessed = true;

        mediaTypes.forEach(tag => {
            const elements = document.getElementsByTagName(tag);
            Array.from(elements).forEach(media => {
                if (!processedMedia.has(media) && !media.ended) {
                    allProcessed = false;
                }
            });
        });

        if (allProcessed) {
            observer.disconnect();
        }
    };

    // 处理所有现有媒体
    const processMedia = () => {
        if (!ENABLE_AUTO_SKIP) return; // 如果开关关闭，不执行自动处理
        const mediaTypes = ['video', 'audio'];
        mediaTypes.forEach(tag => {
            const elements = document.getElementsByTagName(tag);
            Array.from(elements).forEach(media => processSingleMedia(media));
        });
    };

    // 初次加载时处理现有媒体（受开关控制）
    if (ENABLE_AUTO_SKIP) {
        processMedia();
    }

    // 创建手动触发按钮
    const skipButton = document.createElement('button');
    skipButton.textContent = '跳到媒体末尾';
    skipButton.className = 'skip-button';
    skipButton.addEventListener('click', processMedia); // 按钮始终可用，不受开关限制
    document.body.appendChild(skipButton);

    // 动态监测新添加的媒体元素（受开关控制）
    const observer = new MutationObserver((mutations) => {
        if (!ENABLE_AUTO_SKIP) return; // 如果开关关闭，不处理动态添加的媒体
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                        processSingleMedia(node);
                    }
                    node.querySelectorAll('video, audio').forEach(processSingleMedia);
                }
            });
        });
    });
    if (ENABLE_AUTO_SKIP) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 定时检查未处理的媒体（受开关控制）
    if (ENABLE_AUTO_SKIP) {
        setInterval(processMedia, 2000);
    }
})();
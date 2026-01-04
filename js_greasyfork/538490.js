// ==UserScript==
// @name         HDR图片亮度自动调节
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动降低HDR图片亮度，鼠标悬停显示原始效果
// @author       Lex
// @match        https://www.hdrify.com/*
// @match        https://hdrify.com/*
// @match        https://v2ex.com/*
// @match        https://www.v2ex.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538490/HDR%E5%9B%BE%E7%89%87%E4%BA%AE%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/538490/HDR%E5%9B%BE%E7%89%87%E4%BA%AE%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 固定的滤镜设置 - 可以根据需要调整这些值
    const FILTER_SETTINGS = {
        brightness: 75,    // 亮度 (百分比)
        contrast: 80,      // 对比度 (百分比)
        saturate: 85,      // 饱和度 (百分比)
        transition: '0.3s' // 过渡动画时间
    };

    // 生成滤镜CSS
    function getFilterCSS() {
        return `brightness(${FILTER_SETTINGS.brightness}%) contrast(${FILTER_SETTINGS.contrast}%) saturate(${FILTER_SETTINGS.saturate}%)`;
    }

    // 添加全局样式
    function addGlobalStyles() {
        GM_addStyle(`
            /* 对所有图片应用滤镜 */
            img {
                filter: ${getFilterCSS()} !important;
                transition: filter ${FILTER_SETTINGS.transition} ease !important;
            }

            /* 鼠标悬停时显示原始效果 */
            img:hover {
                filter: none !important;
            }

            /* 同样处理canvas元素 */
            canvas {
                filter: ${getFilterCSS()} !important;
                transition: filter ${FILTER_SETTINGS.transition} ease !important;
            }

            canvas:hover {
                filter: none !important;
            }

            /* 处理可能的背景图片 */
            [style*="background-image"] {
                filter: ${getFilterCSS()} !important;
                transition: filter ${FILTER_SETTINGS.transition} ease !important;
            }

            [style*="background-image"]:hover {
                filter: none !important;
            }

            /* 特殊处理一些可能包含图片的容器 */
            .image-container,
            .photo-container,
            .hdr-image,
            .enhanced-image,
            .result-image {
                filter: ${getFilterCSS()} !important;
                transition: filter ${FILTER_SETTINGS.transition} ease !important;
            }

            .image-container:hover,
            .photo-container:hover,
            .hdr-image:hover,
            .enhanced-image:hover,
            .result-image:hover {
                filter: none !important;
            }
        `);
    }

    // 处理动态加载的图片
    function processNewImages() {
        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 处理新添加的图片
                        if (node.tagName === 'IMG') {
                            applyFilterToElement(node);
                        }

                        // 处理新添加的canvas
                        if (node.tagName === 'CANVAS') {
                            applyFilterToElement(node);
                        }

                        // 递归处理子元素中的图片和canvas
                        if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img, canvas');
                            images.forEach(applyFilterToElement);
                        }
                    }
                });
            });
        });

        // 开始观察
        const targetNode = document.body || document.documentElement;
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 对单个元素应用滤镜
    function applyFilterToElement(element) {
        if (!element || !element.style) return;

        // 设置滤镜
        element.style.filter = getFilterCSS();
        element.style.transition = `filter ${FILTER_SETTINGS.transition} ease`;

        // 添加悬停事件监听器
        element.addEventListener('mouseenter', function() {
            this.style.filter = 'none';
        });

        element.addEventListener('mouseleave', function() {
            this.style.filter = getFilterCSS();
        });
    }

    // 处理现有的图片
    function processExistingImages() {
        // 等待DOM加载完成
        const processImages = () => {
            const images = document.querySelectorAll('img, canvas');
            images.forEach(applyFilterToElement);

            // 处理可能的背景图片元素
            const bgElements = document.querySelectorAll('[style*="background-image"]');
            bgElements.forEach(applyFilterToElement);
        };

        // 如果DOM已经准备好，立即处理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processImages);
        } else {
            processImages();
        }

        // 页面完全加载后再处理一次
        window.addEventListener('load', processImages);
    }

    // 添加键盘快捷键支持 (可选)
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + Alt + H 临时禁用/启用滤镜
            if (e.ctrlKey && e.altKey && e.key === 'h') {
                e.preventDefault();
                toggleFilters();
            }
        });
    }

    // 切换滤镜开关 (通过快捷键)
    let filtersEnabled = true;
    function toggleFilters() {
        filtersEnabled = !filtersEnabled;

        const allElements = document.querySelectorAll('img, canvas, [style*="background-image"]');
        allElements.forEach(element => {
            if (filtersEnabled) {
                element.style.filter = getFilterCSS();
            } else {
                element.style.filter = 'none';
            }
        });

        // 显示临时提示
        showTemporaryMessage(filtersEnabled ? 'HDR滤镜已启用' : 'HDR滤镜已禁用');
    }

    // 显示临时消息
    function showTemporaryMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // 3秒后自动移除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 主初始化函数
    function initialize() {
        console.log('HDR图片亮度调节脚本已启动');
        console.log(`当前设置: 亮度=${FILTER_SETTINGS.brightness}%, 对比度=${FILTER_SETTINGS.contrast}%, 饱和度=${FILTER_SETTINGS.saturate}%`);
        console.log('快捷键: Ctrl+Alt+H 切换滤镜开关');

        // 添加全局样式
        addGlobalStyles();

        // 处理现有图片
        processExistingImages();

        // 监听新图片
        processNewImages();

        // 添加快捷键支持
        addKeyboardShortcuts();
    }

    // 立即执行初始化
    initialize();

})();
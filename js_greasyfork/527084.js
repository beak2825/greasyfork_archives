// ==UserScript==
// @name         卓而越助手
// @namespace    http://tampermonkey.net/
// @version      2.4
// @license MIT
// @description  复制 pub.xdtech.top 页面上的特定数据，支持拖动按钮，并拦截修改 API 请求，兼容iPhone
// @author       moxia
// @match        https://pub.xdtech.top/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527084/%E5%8D%93%E8%80%8C%E8%B6%8A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527084/%E5%8D%93%E8%80%8C%E8%B6%8A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局标志位，确保 init 只执行一次
    let isInitialized = false;

    // ---------------------------
    // 1. 添加自定义提示样式
    // ---------------------------
    const toastStyle = `
        .custom-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            z-index: 10001;
            font-size: 16px;
            text-align: center;
            animation: fadeInOut 2s ease-in-out;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
        /* 为iOS设备添加的辅助样式 */
        .copy-textarea {
            position: absolute;
            top: -9999px;
            left: -9999px;
            opacity: 0;
            /* iOS默认字体大小为16px */
            font-size: 16px;
            z-index: -1;
            width: 0;
            height: 0;
            padding: 0;
            margin: 0;
            border: none;
            pointer-events: none;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(toastStyle);
    } else {
        const styleElement = document.createElement('style');
        styleElement.textContent = toastStyle;
        document.head.appendChild(styleElement);
    }

    // ---------------------------
    // 2. 自定义提示函数
    // ---------------------------
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;

        toast.style.backgroundColor = type === 'error'
            ? 'rgba(220, 53, 69, 0.9)'
            : 'rgba(40, 167, 69, 0.9)';

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // ---------------------------
    // 3. 创建可拖动的复制按钮
    // ---------------------------
    function createDraggableButton() {
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制文字';
        copyButton.id = 'copyTextButton';
        copyButton.style.cssText = `
            position: fixed !important;
            bottom: 5px !important;
            right: 20px !important;
            z-index: 10000 !important;
            padding: 10px 20px !important;
            background-color: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: bold !important;
            outline: none !important;
            user-select: none !important; /* 防止拖动时选中按钮文字 */
            -webkit-user-select: none !important; /* 兼容Safari */
            -webkit-touch-callout: none !important; /* 禁用iOS上的长按菜单 */
            -webkit-tap-highlight-color: transparent !important; /* 禁用iOS上的点击高亮 */
            pointer-events: auto !important;
        `;

        // 初始化状态
        let isDragging = false;
        let hasDragged = false; // 标记是否发生过拖动
        let dragStartTime = 0; // 记录开始拖动的时间
        let offsetX, offsetY;
        let lastTouchEnd = 0; // 用于防止双击缩放

        // 阻止页面双击缩放
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // 限制按钮在可视区域内的函数
        function keepButtonInViewport(x, y, buttonWidth, buttonHeight) {
            const minPadding = 10; // 设置按钮与边界的最小距离
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 限制 X 坐标范围
            x = Math.max(minPadding, x);
            x = Math.min(viewportWidth - buttonWidth - minPadding, x);

            // 限制 Y 坐标范围
            y = Math.max(minPadding, y);
            y = Math.min(viewportHeight - buttonHeight - minPadding, y);

            return { x, y };
        }

        // PC 端：鼠标事件
        copyButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false; // 初始化拖动标记
            dragStartTime = Date.now();
            offsetX = e.clientX - copyButton.getBoundingClientRect().left;
            offsetY = e.clientY - copyButton.getBoundingClientRect().top;
            copyButton.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // 只有移动超过5px才标记为拖动
                if (!hasDragged &&
                    (Math.abs(e.clientX - (copyButton.getBoundingClientRect().left + offsetX)) > 5 ||
                     Math.abs(e.clientY - (copyButton.getBoundingClientRect().top + offsetY)) > 5)) {
                    hasDragged = true;
                }

                const buttonWidth = copyButton.offsetWidth;
                const buttonHeight = copyButton.offsetHeight;

                const rawX = e.clientX - offsetX;
                const rawY = e.clientY - offsetY;

                // 应用限制，保持按钮在可视区域内
                const pos = keepButtonInViewport(rawX, rawY, buttonWidth, buttonHeight);

                copyButton.style.left = `${pos.x}px`;
                copyButton.style.top = `${pos.y}px`;
                copyButton.style.right = 'unset';
                copyButton.style.bottom = 'unset';
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                copyButton.style.cursor = 'pointer';

                // 如果没拖动过，且时间小于200ms，视为点击
                if (!hasDragged && (Date.now() - dragStartTime < 200)) {
                    copyData(e);
                }

                hasDragged = false;
            }
        });

        // 手机端：触摸事件（修改这部分以解决iPhone兼容性问题）
        copyButton.addEventListener('touchstart', (e) => {
            isDragging = true;
            hasDragged = false; // 初始化拖动标记
            dragStartTime = Date.now();
            const touch = e.touches[0];
            offsetX = touch.clientX - copyButton.getBoundingClientRect().left;
            offsetY = touch.clientY - copyButton.getBoundingClientRect().top;
            // 不阻止默认行为，避免影响点击
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];

                // 只有移动超过5px才标记为拖动
                if (!hasDragged &&
                    (Math.abs(touch.clientX - (copyButton.getBoundingClientRect().left + offsetX)) > 5 ||
                     Math.abs(touch.clientY - (copyButton.getBoundingClientRect().top + offsetY)) > 5)) {
                    hasDragged = true;
                    // 对于确认是拖动的情况，阻止默认行为（防止页面滚动）
                    e.preventDefault();
                }

                if (hasDragged) {
                    const buttonWidth = copyButton.offsetWidth;
                    const buttonHeight = copyButton.offsetHeight;

                    const rawX = touch.clientX - offsetX;
                    const rawY = touch.clientY - offsetY;

                    // 应用限制，保持按钮在可视区域内
                    const pos = keepButtonInViewport(rawX, rawY, buttonWidth, buttonHeight);

                    copyButton.style.left = `${pos.x}px`;
                    copyButton.style.top = `${pos.y}px`;
                    copyButton.style.right = 'unset';
                    copyButton.style.bottom = 'unset';
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (isDragging) {
                // 如果没拖动过，且时间小于200ms，视为点击
                if (!hasDragged && (Date.now() - dragStartTime < 200)) {
                    copyData(e);
                }

                isDragging = false;
                hasDragged = false;
            }
        });

        // 为iOS设备添加特殊的点击事件处理
        if (isIOS()) {
            copyButton.addEventListener('click', (e) => {
                // 阻止默认行为，防止页面跳动
                e.preventDefault();
                e.stopPropagation();

                // iOS上点击事件单独处理
                copyData(e);
            });
        }

        document.body.appendChild(copyButton);
    }

    // ---------------------------
    // 检测是否为iOS设备
    // ---------------------------
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // ---------------------------
    // 4. 复制数据的核心逻辑（修复iPhone兼容性问题）
    // ---------------------------
    function copyData(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            const activeSlide = document.querySelector('.swiper-slide-active');
            if (!activeSlide) {
                showToast('未找到复制目标', 'error');
                return;
            }

            // 提取 .hint 内容
            const hintText = activeSlide.querySelector('.hint')?.textContent.trim() || '';

            // 提取 .options 内容（精确控制顿号）
            const options = Array.from(activeSlide.querySelectorAll('.options div'))
                .map(div => {
                    const icon = (div.querySelector('.icon')?.textContent || '').trim();
                    const desc = (div.querySelector('.desc')?.textContent || '').trim();
                    return icon && desc ? `${icon}、${desc}` : ''; // 仅当两者都存在时添加顿号
                })
                .filter(text => text) // 过滤空选项
                .join('\n'); // 选项间换行分隔

            // 组合文本
            const finalText = `${hintText}${options ? '\n\n' + options : ''}\n\n选择哪个？`;

            // 为iOS设备使用更可靠的复制方法
            if (isIOS()) {
                copyTextIOSCompatible(finalText);
            }
            // 非iOS设备使用原有方法
            else if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(finalText);
                showToast('复制成功');
            } else {
                navigator.clipboard.writeText(finalText)
                    .then(() => showToast('复制成功'))
                    .catch(() => {
                        fallbackCopyToClipboard(finalText);
                    });
            }
        } catch (error) {
            console.error('复制失败:', error);
            showToast('复制失败', 'error');
        }
    }

    // ---------------------------
    // iOS兼容的复制方法（修复页面跳动问题）
    // ---------------------------
    function copyTextIOSCompatible(text) {
        // 移除之前可能存在的任何textarea
        const oldTextarea = document.querySelector('.copy-textarea');
        if (oldTextarea) {
            oldTextarea.remove();
        }

        // 创建textarea并添加特殊类，避免影响页面布局
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.className = 'copy-textarea';
        textarea.contentEditable = true;
        textarea.readOnly = false;

        // 使用绝对定位并放在视口之外，避免页面跳动
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        textarea.style.width = '0';
        textarea.style.height = '0';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.margin = '0';

        document.body.appendChild(textarea);

        // 将textarea完全放到DOM中后再选择文本，防止视图滚动
        setTimeout(() => {
            try {
                textarea.focus({preventScroll: true});
                textarea.select();

                // 尝试复制
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            showToast('复制成功');
                            setTimeout(() => textarea.remove(), 50);
                        })
                        .catch(() => {
                            fallbackCopyToClipboard(text, textarea);
                        });
                } else {
                    fallbackCopyToClipboard(text, textarea);
                }
            } catch (err) {
                fallbackCopyToClipboard(text, textarea);
            }
        }, 0);
    }

    // ---------------------------
    // 后备复制方法（优化防止页面跳动）
    // ---------------------------
    function fallbackCopyToClipboard(text, existingTextarea) {
        try {
            const textarea = existingTextarea || document.createElement('textarea');
            if (!existingTextarea) {
                textarea.value = text;
                textarea.className = 'copy-textarea';
                document.body.appendChild(textarea);
            }

            // 防止文本选择时页面滚动
            const previousScrollPosition = window.scrollY;

            textarea.focus({preventScroll: true});
            textarea.select();

            // 如果页面发生了滚动，恢复原来的位置
            if (window.scrollY !== previousScrollPosition) {
                window.scrollTo(window.scrollX, previousScrollPosition);
            }

            const successful = document.execCommand('copy');
            if (successful) {
                showToast('复制成功');
            } else {
                showToast('复制失败，请手动复制', 'error');
            }
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制', 'error');
        } finally {
            if (existingTextarea) {
                setTimeout(() => {
                    existingTextarea.remove();
                }, 50);
            }
        }
    }

    // ---------------------------
    // 5. XMLHttpRequest 拦截逻辑
    // ---------------------------
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.includes && url.includes('https://pub.xdapi.top/zhuoyue/api/v1/tiku/dayexercise/1626/dayrank')) {
            const modifiedUrl = new URL(url);
            modifiedUrl.searchParams.set('size', '10000');
            arguments[1] = modifiedUrl.toString();
            console.log('已修改请求参数:', arguments[1]);
        }
        originalOpen.apply(this, arguments);
    };

    // ---------------------------
    // 6. 初始化脚本
    // ---------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (isInitialized) return;
        isInitialized = true;
        createDraggableButton();
    }
})();
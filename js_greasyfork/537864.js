// ==UserScript==
// @name         Auto Remove Datacaciques Ad
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  DataCaciques 广告屏蔽脚本
// @match        *://*.datacaciques.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537864/Auto%20Remove%20Datacaciques%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/537864/Auto%20Remove%20Datacaciques%20Ad.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        // 定义颜色渐变数组
        const colorPalettes = [
            { start: '#2EC4B6', end: '#1A936F', hoverStart: '#56D4C7', hoverEnd: '#136B4F' }, // Teal to Deep Teal
            { start: '#FF6B6B', end: '#D00000', hoverStart: '#FF8787', hoverEnd: '#A00000' }, // Coral to Crimson
            { start: '#7209B7', end: '#3A0CA3', hoverStart: '#9B59D0', hoverEnd: '#2A0877' }, // Purple to Indigo
            { start: '#F48C06', end: '#DC2F02', hoverStart: '#F7A634', hoverEnd: '#B02402' }  // Orange to Amber
        ];

        // 添加 CSS 屏蔽，优化按钮样式
        GM_addStyle(`
            .listingExceedModal {
                display: none !important;
            }
            #backdropHideBtn {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 100000;
                background: linear-gradient(135deg, ${colorPalettes[0].start}, ${colorPalettes[0].end});
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                display: none;
                transition: transform 0.2s ease, background 0.3s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                outline: none;
                touch-action: none;
            }
            #backdropHideBtn:hover {
                background: linear-gradient(135deg, ${colorPalettes[0].hoverStart}, ${colorPalettes[0].hoverEnd});
                box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                transform: scale(1.05);
            }
            #backdropHideBtn:active {
                transform: scale(0.95);
            }
            #backdropHideBtn:focus {
                box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
            }
            #backdropHideBtn.dragging {
                opacity: 0.8;
                cursor: grabbing;
            }
            #backdropHideBtn.color-switch {
                animation: pulse 0.3s ease;
            }
            #backdropHideBtn::after {
                content: '✕';
                font-size: 20px;
                line-height: 48px;
                text-align: center;
                display: block;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            @media (max-width: 768px) {
                #backdropHideBtn {
                    width: 40px;
                    height: 40px;
                    top: 15px;
                    right: 15px;
                }
                #backdropHideBtn::after {
                    font-size: 18px;
                    line-height: 40px;
                }
            }
            .__web-inspector-hide-shortcut__ {
                display: none !important;
            }
        `);

        // 创建按钮
        function createBackdropButton() {
            try {
                if (document.querySelector('#backdropHideBtn')) {
                    console.log('Button already exists');
                    return;
                }
                const button = document.createElement('button');
                button.id = 'backdropHideBtn';
                button.setAttribute('aria-label', '隐藏遮罩 (右键切换颜色，长按或按住鼠标拖拽移动)');
                button.setAttribute('title', '隐藏遮罩 (右键切换颜色，长按或按住鼠标拖拽移动)');
                button.setAttribute('role', 'button');

                // 加载保存的颜色和位置
                const savedColorIndex = localStorage.getItem('backdropButtonColorIndex') || '0';
                applyButtonColor(button, parseInt(savedColorIndex));
                const savedPosition = JSON.parse(localStorage.getItem('backdropButtonPosition')) || {  top: '50%',right: '20px',transform: 'translateY(-50%)' };
                button.style.top = savedPosition.top;
                button.style.right = savedPosition.right;
                button.style.left = 'auto';
                button.style.bottom = 'auto';

                // 事件监听
                button.addEventListener('click', hideBackdrop);
                button.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    switchButtonColor(button);
                });
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        hideBackdrop();
                    } else if (e.key === 'c') {
                        switchButtonColor(button);
                    }
                });

                // 拖拽支持
                let isDragging = false;
                let longPressTimeout;
                let startX, startY;

                // 鼠标拖拽
                button.addEventListener('mousedown', (e) => {
                    longPressTimeout = setTimeout(() => {
                        isDragging = true;
                        button.classList.add('dragging');
                        startX = e.clientX - parseInt(button.style.left || window.getComputedStyle(button).left);
                        startY = e.clientY - parseInt(button.style.top || window.getComputedStyle(button).top);
                        console.log('Started dragging button');
                    }, 500);
                });

                document.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        const newX = e.clientX - startX;
                        const newY = e.clientY - startY;
                        // 限制按钮在视口内
                        const maxX = window.innerWidth - button.offsetWidth;
                        const maxY = window.innerHeight - button.offsetHeight;
                        button.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                        button.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                        button.style.right = 'auto';
                        button.style.bottom = 'auto';
                    }
                });

                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        button.classList.remove('dragging');
                        // 保存位置
                        localStorage.setItem('backdropButtonPosition', JSON.stringify({
                            top: button.style.top,
                            left: button.style.left
                        }));
                        console.log('Stopped dragging, saved position:', button.style.top, button.style.left);
                    }
                    clearTimeout(longPressTimeout);
                });

                // 触摸拖拽
                button.addEventListener('touchstart', (e) => {
                    longPressTimeout = setTimeout(() => {
                        isDragging = true;
                        button.classList.add('dragging');
                        const touch = e.touches[0];
                        startX = touch.clientX - parseInt(button.style.left || window.getComputedStyle(button).left);
                        startY = touch.clientY - parseInt(button.style.top || window.getComputedStyle(button).top);
                        console.log('Started touch dragging button');
                    }, 500);
                });

                document.addEventListener('touchmove', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const newX = touch.clientX - startX;
                        const newY = touch.clientY - startY;
                        const maxX = window.innerWidth - button.offsetWidth;
                        const maxY = window.innerHeight - button.offsetHeight;
                        button.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                        button.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                        button.style.right = 'auto';
                        button.style.bottom = 'auto';
                    }
                });

                document.addEventListener('touchend', () => {
                    if (isDragging) {
                        isDragging = false;
                        button.classList.remove('dragging');
                        localStorage.setItem('backdropButtonPosition', JSON.stringify({
                            top: button.style.top,
                            left: button.style.left
                        }));
                        console.log('Stopped touch dragging, saved position:', button.style.top, button.style.left);
                    }
                    clearTimeout(longPressTimeout);
                });

                if (document.body) {
                    document.body.appendChild(button);
                    console.log('Backdrop button created and appended');
                } else {
                    console.warn('document.body not ready, retrying...');
                    setTimeout(createBackdropButton, 500);
                }
            } catch (e) {
                console.error('Error creating button:', e);
            }
        }

        // 应用按钮颜色
        function applyButtonColor(button, colorIndex) {
            const palette = colorPalettes[colorIndex];
            button.style.background = `linear-gradient(135deg, ${palette.start}, ${palette.end})`;
            button.setAttribute('data-color-index', colorIndex);
            GM_addStyle(`
                #backdropHideBtn:hover {
                    background: linear-gradient(135deg, ${palette.hoverStart}, ${palette.hoverEnd}) !important;
                }
            `);
        }

        // 切换按钮颜色
        function switchButtonColor(button) {
            try {
                let currentIndex = parseInt(button.getAttribute('data-color-index') || '0');
                currentIndex = (currentIndex + 1) % colorPalettes.length;
                applyButtonColor(button, currentIndex);
                localStorage.setItem('backdropButtonColorIndex', currentIndex);
                button.classList.add('color-switch');
                setTimeout(() => button.classList.remove('color-switch'), 300);
                console.log('Switched button color to index:', currentIndex);
            } catch (e) {
                console.error('Error switching button color:', e);
            }
        }

        // 隐藏遮罩函数
        function hideBackdrop() {
            try {
                const backdrops = document.querySelectorAll('.modal-backdrop.in');
                const button = document.querySelector('#backdropHideBtn');
                if (backdrops.length > 0) {
                    backdrops.forEach(backdrop => {
                        backdrop.style.display = 'none';
                        backdrop.classList.add('__web-inspector-hide-shortcut__');
                        console.log('Hid backdrop:', backdrop, 'Classes:', backdrop.classList.toString(), 'Style:', backdrop.style.display);
                    });
                    if (button) button.style.display = 'none';
                } else {
                    console.warn('No .modal-backdrop.in found');
                }
            } catch (e) {
                console.error('Error hiding backdrop:', e);
            }
        }

        // 显示/隐藏按钮
        function toggleBackdropButton() {
            try {
                const button = document.querySelector('#backdropHideBtn');
                const backdrops = document.querySelectorAll('.modal-backdrop.in');
                if (button && backdrops.length > 0) {
                    let isVisible = false;
                    backdrops.forEach(backdrop => {
                        if (backdrop.style.display !== 'none' && !backdrop.classList.contains('__web-inspector-hide-shortcut__')) {
                            isVisible = true;
                        }
                    });
                    if (isVisible) {
                        const backdropZIndex = backdrops[0] ? parseInt(window.getComputedStyle(backdrops[0]).zIndex) || 1050 : 1050;
                        button.style.zIndex = backdropZIndex + 1;
                        button.style.display = 'block';
                        console.log('Backdrop detected, button shown. Backdrop count:', backdrops.length, 'Z-index:', backdropZIndex);
                    } else {
                        button.style.display = 'none';
                        console.log('No visible backdrop, button hidden');
                    }
                } else {
                    console.warn('Button or backdrop missing. Button:', !!button, 'Backdrops:', backdrops.length);
                }
            } catch (e) {
                console.error('Error toggling button:', e);
            }
        }

        // 移除遮罩函数，支持重试
        function removeBackdrop() {
            try {
                const backdrop = document.querySelector('.modal-backdrop.in');
                const hasNormalModal = document.querySelector('.editItem, .pgUploadModal');
                if (backdrop && !hasNormalModal) {
                    backdrop.remove();
                    console.log('Removed ad backdrop');
                    return true;
                }
                return false;
            } catch (e) {
                console.error('Error removing backdrop:', e);
                return false;
            }
        }

        // 使用 MutationObserver 监控 DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                try {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.matches('.listingExceedModal')) {
                            // 检查标题
                            const title = node.querySelector('h1, h4');
                            if (title && title.textContent.includes('在线Listing数量已超过套餐上限')) {
                                try {
                                    node.remove(); // 移除广告弹窗
                                    // 移除遮罩，尝试 5 次
                                    let attempts = 0;
                                    const maxAttempts = 5;
                                    const retryInterval = setInterval(() => {
                                        if (removeBackdrop() || attempts >= maxAttempts) {
                                            clearInterval(retryInterval);
                                        }
                                        attempts++;
                                    }, 200);
                                    const closeButton = node.querySelector('.btnClose, .close-button, [class*="close"], button');
                                    if (closeButton) {
                                        closeButton.removeAttribute('disabled');
                                        closeButton.click(); // 自动点击关闭
                                    }
                                    hideBackdrop(); // 确保遮罩被隐藏
                                    console.log('Removed ad modal:', node);
                                } catch (e) {
                                    console.error('Error removing modal:', e);
                                }
                            }
                        }
                    });
                } catch (e) {
                    console.error('Error in MutationObserver:', e);
                }
            });
        });

        // 初始化
        function init() {
            try {
                createBackdropButton();
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                });
                console.log('MutationObserver started');
                toggleBackdropButton();
                setInterval(toggleBackdropButton, 1000);
            } catch (e) {
                console.error('Error initializing:', e);
            }
        }

        // 在 DOM 加载完成后启动
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            init();
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }

        // 拦截 15-25 秒倒计时
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, time) {
            if (time >= 15000 && time <= 25000) {
                console.log('Blocked ad countdown:', time);
                return null;
            }
            return originalSetTimeout.apply(this, arguments);
        };
    })();
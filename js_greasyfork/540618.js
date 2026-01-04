// ==UserScript==
// @name         Reddit中文翻译助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为Reddit页面添加中文翻译功能，支持响应式适配
// @author       djzhao
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540618/Reddit%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540618/Reddit%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentElement = null; // 当前显示的元素（按钮或指示器）

    // 检查当前URL是否已经包含中文翻译参数
    function hasChineseTranslation() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tl') === 'zh-hans';
    }

    // 约束元素位置在视窗范围内
    function constrainToViewport(element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newLeft = rect.left;
        let newTop = rect.top;
        let needsUpdate = false;

        // 检查右边界
        if (rect.right > viewportWidth) {
            newLeft = viewportWidth - element.offsetWidth - 10; // 留10px边距
            needsUpdate = true;
        }

        // 检查左边界
        if (rect.left < 0) {
            newLeft = 10; // 留10px边距
            needsUpdate = true;
        }

        // 检查下边界
        if (rect.bottom > viewportHeight) {
            newTop = viewportHeight - element.offsetHeight - 10; // 留10px边距
            needsUpdate = true;
        }

        // 检查上边界
        if (rect.top < 0) {
            newTop = 10; // 留10px边距
            needsUpdate = true;
        }

        // 如果需要更新位置
        if (needsUpdate) {
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
    }

    // 处理窗口大小变化
    function handleResize() {
        // 添加防抖处理，避免频繁调用
        clearTimeout(handleResize.timeout);
        handleResize.timeout = setTimeout(() => {
            constrainToViewport(currentElement);
        }, 100);
    }

    // 创建可拖拽功能
    function makeDraggable(element, onClickCallback) {
        let isDragging = false;
        let hasMoved = false;
        let startPos = { x: 0, y: 0 };
        let elementPos = { x: 0, y: 0 };

        element.addEventListener('mousedown', function(e) {
            isDragging = true;
            hasMoved = false;
            startPos.x = e.clientX;
            startPos.y = e.clientY;

            const rect = element.getBoundingClientRect();
            elementPos.x = rect.left;
            elementPos.y = rect.top;

            element.style.cursor = 'grabbing';
            element.style.transition = 'none'; // 禁用过渡动画以提高跟手性
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const deltaX = e.clientX - startPos.x;
                const deltaY = e.clientY - startPos.y;

                // 如果移动距离超过5px，认为是拖拽操作
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    hasMoved = true;
                }

                const newX = elementPos.x + deltaX;
                const newY = elementPos.y + deltaY;

                // 限制按钮在视窗范围内，留出边距
                const margin = 10;
                const maxX = window.innerWidth - element.offsetWidth - margin;
                const maxY = window.innerHeight - element.offsetHeight - margin;

                const constrainedX = Math.max(margin, Math.min(newX, maxX));
                const constrainedY = Math.max(margin, Math.min(newY, maxY));

                element.style.left = constrainedX + 'px';
                element.style.top = constrainedY + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'pointer';
                element.style.transition = 'all 0.3s ease'; // 恢复过渡动画

                // 如果没有移动，则触发点击事件
                if (!hasMoved && onClickCallback) {
                    onClickCallback();
                }
            }
        });

        // 触摸设备支持
        element.addEventListener('touchstart', function(e) {
            isDragging = true;
            hasMoved = false;
            const touch = e.touches[0];
            startPos.x = touch.clientX;
            startPos.y = touch.clientY;

            const rect = element.getBoundingClientRect();
            elementPos.x = rect.left;
            elementPos.y = rect.top;

            element.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - startPos.x;
                const deltaY = touch.clientY - startPos.y;

                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    hasMoved = true;
                }

                const newX = elementPos.x + deltaX;
                const newY = elementPos.y + deltaY;

                const margin = 10;
                const maxX = window.innerWidth - element.offsetWidth - margin;
                const maxY = window.innerHeight - element.offsetHeight - margin;

                const constrainedX = Math.max(margin, Math.min(newX, maxX));
                const constrainedY = Math.max(margin, Math.min(newY, maxY));

                element.style.left = constrainedX + 'px';
                element.style.top = constrainedY + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';

                e.preventDefault();
            }
        });

        document.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                element.style.transition = 'all 0.3s ease';

                if (!hasMoved && onClickCallback) {
                    onClickCallback();
                }
            }
        });
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'reddit-translate-btn';
        button.innerHTML = '中文';
        button.style.cssText = `
            position: fixed;
            top: 64px;
            right: 16px;
            width: 32px;
            height: 32px;
            background: #ff4500;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
            transition: all 0.3s ease;
            user-select: none;
            touch-action: none;
        `;

        // 响应式字体大小
        function updateButtonSize() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) {
                // 移动设备
                button.style.width = '30px';
                button.style.height = '30px';
                button.style.fontSize = '10px';
            } else {
                // 桌面设备
                button.style.width = '32px';
                button.style.height = '32px';
                button.style.fontSize = '10px';
            }
        }

        updateButtonSize();

        // 鼠标悬停效果
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        });

        // 添加拖拽功能和点击事件
        makeDraggable(button, function() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('tl', 'zh-hans');
            window.location.href = currentUrl.toString();
        });

        // 监听窗口大小变化以更新按钮尺寸
        const resizeObserver = new ResizeObserver(updateButtonSize);
        resizeObserver.observe(document.documentElement);

        return button;
    }

    // 创建已翻译状态的指示器
    function createTranslatedIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'reddit-translated-indicator';
        indicator.innerHTML = '已翻译';
        indicator.style.cssText = `
            position: fixed;
            top: 64px;
            right: 16px;
            padding: 4px 8px;
            background: rgba(40, 167, 69, 0.8);
            color: white;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 1px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            user-select: none;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
            touch-action: none;
        `;

        // 响应式字体大小
        function updateIndicatorSize() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) {
                // 移动设备
                indicator.style.fontSize = '9px';
                indicator.style.padding = '3px 6px';
            } else {
                // 桌面设备
                indicator.style.fontSize = '10px';
                indicator.style.padding = '4px 8px';
            }
        }

        updateIndicatorSize();

        // 鼠标悬停效果
        indicator.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.05)';
        });

        indicator.addEventListener('mouseleave', function() {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        });

        // 添加拖拽功能和点击事件（点击移除翻译）
        makeDraggable(indicator, function() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete('tl');
            window.location.href = currentUrl.toString();
        });

        // 监听窗口大小变化以更新指示器尺寸
        const resizeObserver = new ResizeObserver(updateIndicatorSize);
        resizeObserver.observe(document.documentElement);

        return indicator;
    }

    // 初始化脚本
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 移除已存在的按钮或指示器
        const existingBtn = document.getElementById('reddit-translate-btn');
        const existingIndicator = document.getElementById('reddit-translated-indicator');
        if (existingBtn) existingBtn.remove();
        if (existingIndicator) existingIndicator.remove();

        // 检查是否已经是中文翻译状态
        if (hasChineseTranslation()) {
            // 显示已翻译指示器
            currentElement = createTranslatedIndicator();
            document.body.appendChild(currentElement);
        } else {
            // 显示翻译按钮
            currentElement = createFloatingButton();
            document.body.appendChild(currentElement);
        }
    }

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 监听设备方向变化（移动设备）
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            constrainToViewport(currentElement);
        }, 300); // 等待方向变化完成
    });

    // 监听URL变化（适用于单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 500); // 延迟执行以确保页面更新完成
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始化
    init();
})();

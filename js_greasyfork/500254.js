// ==UserScript==
// @name         网页缩放调节器
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  添加按钮以调节网页缩放，点击主按钮后再显示+-按钮，并添加动画效果，按钮为白色半透明，支持触摸拖动，贴边收起
// @author       xinke
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500254/%E7%BD%91%E9%A1%B5%E7%BC%A9%E6%94%BE%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500254/%E7%BD%91%E9%A1%B5%E7%BC%A9%E6%94%BE%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    const buttonStyle = `
        .zoom-button-container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            transition: right 0.3s ease, left 0.3s ease; /* 添加动画效果 */
        }
        .zoom-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7); /* White semi-transparent */
            color: #333; /* Dark text color */
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            cursor: pointer;
            opacity: 0;
            pointer-events: none; /* 禁用点击 */
            transition: opacity 0.3s ease, transform 0.3s ease;
            user-select: none; /* 禁用文本选择 */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
        }
        .zoom-button.show {
            opacity: 1;
            pointer-events: auto; /* 启用点击 */
            transform: translateY(0);
        }
        .zoom-button.hide {
            opacity: 0;
            pointer-events: none; /* 禁用点击 */
            transform: translateY(20px);
        }
        .zoom-button:hover {
            background-color: rgba(255, 255, 255, 0.9); /* Hover效果 */
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Hover时的阴影 */
        }
        .zoom-button-container.show .zoom-button {
            animation: slideIn 0.3s forwards;
        }
        .zoom-button-container.hide .zoom-button {
            animation: slideOut 0.3s forwards;
        }
        @keyframes slideIn {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(20px);
                opacity: 0;
            }
        }
    `;

    // 将样式添加到页面的头部
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = buttonStyle;
    document.head.appendChild(styleElement);

    // 创建按钮容器
    const container = document.createElement('div');
    container.className = 'zoom-button-container';
    document.body.appendChild(container);

    // 创建缩放按钮
    const createButton = (id, text) => {
        const button = document.createElement('div');
        button.id = id;
        button.className = 'zoom-button';
        button.textContent = text;
        container.appendChild(button);
        return button;
    };

    // 初始化缩放级别
    let zoomLevel = 100;

    // 更新缩放
    const updateZoom = (increment) => {
        zoomLevel = Math.min(Math.max(zoomLevel + increment, 10), 500); // 限制缩放级别在10%到500%之间
        document.body.style.zoom = zoomLevel / 100;
    };

    // 显示或隐藏按钮
    const toggleButtons = (show) => {
        if (show) {
            zoomInButton.classList.add('show');
            zoomInButton.classList.remove('hide');
            zoomOutButton.classList.add('show');
            zoomOutButton.classList.remove('hide');
        } else {
            zoomInButton.classList.remove('show');
            zoomInButton.classList.add('hide');
            zoomOutButton.classList.remove('show');
            zoomOutButton.classList.add('hide');
        }
    };

    // 防抖函数
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // 创建增加缩放按钮并添加事件监听器
    const zoomInButton = createButton('zoomIn', '+');
    zoomInButton.addEventListener('click', debounce(() => {
        updateZoom(10);
    }, 300));

    // 创建减少缩放按钮并添加事件监听器
    const zoomOutButton = createButton('zoomOut', '-');
    zoomOutButton.addEventListener('click', debounce(() => {
        updateZoom(-10);
    }, 300));

    // 创建主按钮并添加事件监听器
    const zoomToggleButton = createButton('zoomToggle', 'Z');
    zoomToggleButton.classList.add('show');
    zoomToggleButton.addEventListener('click', () => {
        const isHidden = !zoomInButton.classList.contains('show');
        toggleButtons(isHidden);
    });

    // 添加拖动功能
    const enableDrag = (element) => {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: true });

        function startDrag(event) {
            isDragging = true;
            startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
            startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function drag(event) {
            if (!isDragging) return;
            event.preventDefault();

            const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
            const clientY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            element.style.left = initialX + dx + 'px';
            element.style.top = initialY + dy + 'px';
            element.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);

            // 贴边收起
            const containerRect = container.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const offsetX = containerRect.left < windowWidth / 2 ? -containerRect.left : windowWidth - containerRect.right;
            const offsetY = containerRect.top < windowHeight / 2 ? -containerRect.top : windowHeight - containerRect.bottom;

            if (Math.abs(offsetX) < Math.abs(offsetY)) {
                if (containerRect.left < windowWidth / 2) {
                    container.style.left = '10px';
                    container.style.right = 'auto';
                } else {
                    container.style.left = 'auto';
                    container.style.right = '10px';
                }
            } else {
                if (containerRect.top < windowHeight / 2) {
                    container.style.top = '10px';
                } else {
                    container.style.top = 'auto';
                    container.style.bottom = '10px';
                }
            }
        }
    };

    // 启用容器的拖动功能
    enableDrag(container);
})();

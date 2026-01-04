// ==UserScript==
// @name         视频字幕遮罩条
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  创建一个磨砂半透明遮罩条来遮挡视频字幕
// @author       Aaron Hu
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519460/%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E9%81%AE%E7%BD%A9%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/519460/%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E9%81%AE%E7%BD%A9%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create container for the mask
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '2147483647',
        pointerEvents: 'none',
        display: 'none',
    });
    document.body.appendChild(container);

    function createMask() {
        const newMask = document.createElement('div');
        Object.assign(newMask.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            zIndex: '2147483647',
            cursor: 'move',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            pointerEvents: 'auto',
            userSelect: 'none',
        });

        // Add resizers
        const leftResizer = document.createElement('div');
        const rightResizer = document.createElement('div');
        const topResizer = document.createElement('div');

        // Style for horizontal resizers
        const horizontalResizerStyle = {
            position: 'absolute',
            top: '0',
            width: '10px',
            height: '100%',
            cursor: 'ew-resize',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
        };

        Object.assign(leftResizer.style, {
            ...horizontalResizerStyle,
            left: '-5px',
        });

        Object.assign(rightResizer.style, {
            ...horizontalResizerStyle,
            right: '-5px',
        });

        // Style for vertical resizer
        Object.assign(topResizer.style, {
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40px',
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            cursor: 'ns-resize',
            borderRadius: '4px',
        });

        // Add resize functionality
        let isResizing = false;
        let currentResizer = null;
        let initialWidth, initialHeight, initialX, initialY, initialBottom, initialTop;

        function startResize(e, resizer) {
            isResizing = true;
            currentResizer = resizer;
            const rect = newMask.getBoundingClientRect();
            initialWidth = rect.width;
            initialHeight = rect.height;
            initialX = e.clientX;
            initialY = e.clientY;
            initialBottom = rect.bottom;
            initialTop = rect.top;
            e.stopPropagation();
        }

        function resize(e) {
            if (!isResizing) return;
            e.preventDefault();

            if (currentResizer === leftResizer || currentResizer === rightResizer) {
                // 计算鼠标移动距离
                const deltaX = e.clientX - initialX;

                // 从中心点同时调整两侧
                const widthChange = deltaX * 2;
                const newWidth = initialWidth + widthChange;

                if (newWidth > 100) {
                    newMask.style.width = `${newWidth}px`;
                    // 保持中心点不变
                    const centerX = window.innerWidth / 2;
                    newMask.style.left = '50%';
                    newMask.style.transform = 'translateX(-50%)';
                }
            } else if (currentResizer === topResizer) {
                const mouseY = e.clientY;
                const deltaY = mouseY - initialY;

                // 跟随鼠标移动方向自然变化
                if (deltaY > 0) { // 向下移动，增加高度
                    const newHeight = initialHeight + deltaY;
                    if (newHeight > 20) {
                        newMask.style.height = `${newHeight}px`;
                        newMask.style.bottom = `${initialBottom - window.innerHeight}px`;
                    }
                } else { // 向上移动，减少高度
                    const newHeight = initialHeight - Math.abs(deltaY);
                    if (newHeight > 20) {
                        newMask.style.height = `${newHeight}px`;
                        newMask.style.bottom = `${initialBottom - window.innerHeight}px`;
                    }
                }
            }
        }

        function stopResize() {
            isResizing = false;
            currentResizer = null;
        }

        leftResizer.addEventListener('mousedown', (e) => startResize(e, leftResizer));
        rightResizer.addEventListener('mousedown', (e) => startResize(e, rightResizer));
        topResizer.addEventListener('mousedown', (e) => startResize(e, topResizer));
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);

        // Add close button
        const closeButton = document.createElement('div');
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
            color: 'white',
            textAlign: 'center',
            lineHeight: '20px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '2147483648',
        });
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => {
            container.removeChild(newMask);
        });

        // Append all elements
        newMask.appendChild(closeButton);
        newMask.appendChild(leftResizer);
        newMask.appendChild(rightResizer);
        newMask.appendChild(topResizer);

        // Add drag functionality
        let isDragging = false;
        let initialDragX, initialDragY;

        newMask.addEventListener('mousedown', (e) => {
            if (e.target !== newMask) return;
            const rect = newMask.getBoundingClientRect();
            initialDragX = e.clientX - rect.left;
            initialDragY = e.clientY - rect.top;
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.clientX - initialDragX;
            const y = e.clientY - initialDragY;
            newMask.style.left = `${x}px`;
            newMask.style.top = `${y}px`;
            newMask.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        return newMask;
    }

    // 切换显示状态的函数
    function toggleMask() {
        const isVisible = container.style.display === 'none';
        container.style.display = isVisible ? 'block' : 'none';

        // 如果切换为显示状态且容器内没有遮罩条，则创建一个
        if (isVisible && container.children.length === 0) {
            const newMask = createMask();
            container.appendChild(newMask);
        }
    }

    function addNewMask() {
        container.style.display = 'block'; // 确保容器可见
        const newMask = createMask();
        container.appendChild(newMask);
    }

    function clearAllMasks() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.display = 'none'; // 清空后隐藏容器
    }

    // Register Tampermonkey menu commands
    GM_registerMenuCommand('切换显示', toggleMask);
    GM_registerMenuCommand('新增遮罩条', addNewMask);
    GM_registerMenuCommand('一键清空', clearAllMasks);

    // 处理全屏
    function handleFullscreen() {
        const fullscreenElement = document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.mozFullScreenElement ||
                                document.msFullscreenElement;

        if (fullscreenElement) {
            fullscreenElement.appendChild(container);
            container.style.position = 'absolute';
        } else {
            document.body.appendChild(container);
            container.style.position = 'fixed';
        }
    }

    document.addEventListener('fullscreenchange', handleFullscreen);
    document.addEventListener('webkitfullscreenchange', handleFullscreen);
    document.addEventListener('mozfullscreenchange', handleFullscreen);
    document.addEventListener('MSFullscreenChange', handleFullscreen);
})();
// ==UserScript==
// @name         Edge Android 全屏浏览 (可拖动按钮)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在Android版Edge浏览器中添加一个可拖动的按钮来切换全屏模式。
// @author       Gemini
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538073/Edge%20Android%20%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538073/Edge%20Android%20%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个悬浮按钮
    const fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = '进入全屏'; // 按钮初始文本
    fullscreenButton.style.position = 'fixed';
    fullscreenButton.style.bottom = '20px';
    fullscreenButton.style.right = '20px';
    fullscreenButton.style.zIndex = '9999';
    fullscreenButton.style.padding = '10px 15px';
    fullscreenButton.style.backgroundColor = '#0078D4'; // Edge 蓝色
    fullscreenButton.style.color = 'white';
    fullscreenButton.style.border = 'none';
    fullscreenButton.style.borderRadius = '5px';
    fullscreenButton.style.cursor = 'grab'; // 初始光标样式表示可抓取
    fullscreenButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    fullscreenButton.style.fontSize = '14px';
    fullscreenButton.style.userSelect = 'none'; // 防止拖动时选中文本

    document.body.appendChild(fullscreenButton);

    // 检查当前是否处于全屏状态的函数
    function isFullscreen() {
        return document.fullscreenElement ||
               document.mozFullScreenElement ||
               document.webkitFullscreenElement ||
               document.msFullscreenElement;
    }

    // 切换全屏的函数
    function toggleFullScreen() {
        if (!isFullscreen()) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }

    // 监听全屏状态变化，更新按钮文本
    document.addEventListener('fullscreenchange', updateButtonText);
    document.addEventListener('webkitfullscreenchange', updateButtonText);
    document.addEventListener('mozfullscreenchange', updateButtonText);
    document.addEventListener('MSFullscreenChange', updateButtonText);

    function updateButtonText() {
        if (isFullscreen()) {
            fullscreenButton.textContent = '退出全屏';
        } else {
            fullscreenButton.textContent = '进入全屏';
        }
    }
    updateButtonText(); // 初始加载时更新一次

    // --- 拖动逻辑 ---
    let isDragging = false;
    let hasDraggedSignificantDistance = false; // 是否已发生有意义的拖动
    let offsetX, offsetY; // 鼠标/触摸点相对于按钮左上角的偏移
    let initialMoveCheckX, initialMoveCheckY; // 用于拖拽阈值判断的初始位置
    const DRAG_THRESHOLD = 5; // 至少拖动5像素才算作有效拖动

    function dragStart(e) {
        isDragging = true;
        hasDraggedSignificantDistance = false;
        fullscreenButton.style.cursor = 'grabbing'; // 拖动时光标样式

        // 判断是触摸事件还是鼠标事件
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        initialMoveCheckX = clientX; // 记录用于拖拽阈值判断的初始点
        initialMoveCheckY = clientY;

        const rect = fullscreenButton.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        // 确保按钮使用 left/top 定位以便拖动计算
        // getComputedStyle 用于获取最终应用的样式值
        if (getComputedStyle(fullscreenButton).position === 'fixed') {
            // 如果按钮当前是通过 right/bottom 定位的，则转换为 left/top
            if (fullscreenButton.style.right !== 'auto' || fullscreenButton.style.bottom !== 'auto') {
                fullscreenButton.style.left = rect.left + 'px';
                fullscreenButton.style.top = rect.top + 'px';
                fullscreenButton.style.right = 'auto';
                fullscreenButton.style.bottom = 'auto';
            }
        }

        // 阻止默认行为：
        // - 鼠标：防止选中文本
        // - 触摸：防止页面滚动/缩放
        e.preventDefault();

        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        } else if (e.type === 'touchstart') {
            // { passive: false } 允许在 touchmove 中调用 e.preventDefault()
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('touchend', dragEnd);
        }
    }

    function dragMove(e) {
        if (!isDragging) return;

        // 对于触摸移动，也需要阻止默认行为
        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        // 检查是否拖动超过阈值
        if (!hasDraggedSignificantDistance) {
            const dx = Math.abs(clientX - initialMoveCheckX);
            const dy = Math.abs(clientY - initialMoveCheckY);
            if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
                hasDraggedSignificantDistance = true;
            }
        }

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        const buttonWidth = fullscreenButton.offsetWidth;
        const buttonHeight = fullscreenButton.offsetHeight;

        // 边界检查，防止按钮拖出视窗
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + buttonWidth > window.innerWidth) newLeft = window.innerWidth - buttonWidth;
        if (newTop + buttonHeight > window.innerHeight) newTop = window.innerHeight - buttonHeight;

        fullscreenButton.style.left = newLeft + 'px';
        fullscreenButton.style.top = newTop + 'px';
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        fullscreenButton.style.cursor = 'grab'; // 恢复光标样式

        if (e.type === 'mouseup') {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        } else if (e.type === 'touchend') {
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
        }
        // hasDraggedSignificantDistance 的状态会保留，用于 click 事件判断
    }

    // 为按钮添加拖动相关的事件监听器 (鼠标和触摸)
    fullscreenButton.addEventListener('mousedown', dragStart);
    fullscreenButton.addEventListener('touchstart', dragStart, { passive: false });

    // 修改后的点击事件处理，区分单击和拖拽后的释放
    fullscreenButton.addEventListener('click', (e) => {
        if (hasDraggedSignificantDistance) {
            // 如果是拖拽后释放，则阻止默认的点击行为（切换全屏）
            e.stopPropagation();
            e.preventDefault();
            // hasDraggedSignificantDistance 会在下一次 dragStart 时重置
            return;
        }
        // 如果不是拖拽，则执行全屏切换
        toggleFullScreen();
    });

})();
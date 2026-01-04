// ==UserScript==
// @name         网站暗黑模式切换器
// @version      1.6
// @description  一键切换网站暗黑/日间模式，支持拖拽吸附与边缘图标化
// @author       Your Name
// @match        *://*/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/542886/%E7%BD%91%E7%AB%99%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542886/%E7%BD%91%E7%AB%99%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 排除iframe场景
    if (window !== window.top) return;

    // 常量定义
    const STORAGE_KEY = 'darkMode';
    const POSITION_KEY = 'darkModeButtonPosition';
    const SNAP_DISTANCE = 10;    // 吸附触发距离
    const ICON_ONLY_DISTANCE = 15; // 图标化触发距离
    const DRAG_THRESHOLD = 3;    // 拖拽阈值
    const FULL_PADDING = '10px 15px'; // 完整显示时的内边距
    const ICON_PADDING = '10px';   // 图标显示时的内边距

    // 检查本地存储的模式偏好
    const isDarkMode = localStorage.getItem(STORAGE_KEY) === 'true';

    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dark-mode-toggle';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = FULL_PADDING;
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '20px';
    toggleBtn.style.cursor = 'move';
    toggleBtn.style.fontWeight = 'bold';
    toggleBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toggleBtn.style.transition = 'all 0.3s ease-out';
    toggleBtn.style.userSelect = 'none';

    // 应用初始模式
    function applyMode(dark) {
        const html = document.documentElement;
        if (dark) {
            html.style.filter = 'invert(1) hue-rotate(180deg)';
            toggleBtn.dataset.mode = 'light';
            toggleBtn.innerHTML = '<span class="full-text">🌞 日间模式</span><span class="icon-text">🌞</span>';
            toggleBtn.style.backgroundColor = '#fff';
            toggleBtn.style.color = '#000';
        } else {
            html.style.filter = 'none';
            toggleBtn.dataset.mode = 'dark';
            toggleBtn.innerHTML = '<span class="full-text">🌙 暗黑模式</span><span class="icon-text">🌙</span>';
            toggleBtn.style.backgroundColor = '#333';
            toggleBtn.style.color = '#fff';
        }
        // 处理媒体元素复原
        document.querySelectorAll('img, video, iframe, svg, canvas, .avatar, .logo, .icon').forEach(el => {
            el.style.filter = dark ? 'invert(1) hue-rotate(180deg)' : 'none';
        });
        localStorage.setItem(STORAGE_KEY, dark);
    }

    // 恢复保存的位置
    function restorePosition() {
        const position = localStorage.getItem(POSITION_KEY);
        if (position) {
            const { left, top } = JSON.parse(position);
            toggleBtn.style.left = `${left}px`;
            toggleBtn.style.top = `${top}px`;
        } else {
            // 默认位置
            toggleBtn.style.right = '20px';
            toggleBtn.style.bottom = '20px';
        }
    }

    // 保存当前位置
    function savePosition() {
        const rect = toggleBtn.getBoundingClientRect();
        localStorage.setItem(POSITION_KEY, JSON.stringify({
            left: rect.left,
            top: rect.top
        }));
    }

    // 边缘检测与图标化
    function checkEdgePosition() {
        const rect = toggleBtn.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算与各边的距离
        const distances = {
            left: rect.left,
            right: windowWidth - rect.right,
            top: rect.top,
            bottom: windowHeight - rect.bottom
        };

        // 找到最近的边
        let closestSide = 'left';
        let minDistance = distances.left;

        for (const side in distances) {
            if (distances[side] < minDistance) {
                minDistance = distances[side];
                closestSide = side;
            }
        }

        // 应用图标化效果
        const isIconMode = minDistance < ICON_ONLY_DISTANCE;

        if (isIconMode) {
            toggleBtn.style.padding = ICON_PADDING;
            toggleBtn.querySelector('.full-text').style.display = 'none';
            toggleBtn.querySelector('.icon-text').style.display = 'inline';

            // 根据边调整样式并紧贴边缘
            switch (closestSide) {
                case 'left':
                    toggleBtn.style.left = '0px';
                    toggleBtn.style.borderTopLeftRadius = '0';
                    toggleBtn.style.borderBottomLeftRadius = '0';
                    break;
                case 'right':
                    toggleBtn.style.right = '0px';
                    toggleBtn.style.left = 'auto';
                    toggleBtn.style.borderTopRightRadius = '0';
                    toggleBtn.style.borderBottomRightRadius = '0';
                    break;
                case 'top':
                    toggleBtn.style.top = '0px';
                    toggleBtn.style.borderTopLeftRadius = '0';
                    toggleBtn.style.borderTopRightRadius = '0';
                    break;
                case 'bottom':
                    toggleBtn.style.bottom = '0px';
                    toggleBtn.style.borderBottomLeftRadius = '0';
                    toggleBtn.style.borderBottomRightRadius = '0';
                    break;
            }
        } else {
            toggleBtn.style.padding = FULL_PADDING;
            toggleBtn.querySelector('.full-text').style.display = 'inline';
            toggleBtn.querySelector('.icon-text').style.display = 'none';
            toggleBtn.style.borderRadius = '20px';
        }

        return isIconMode;
    }

    // 拖拽状态变量
    let isDragging = false;
    let startX, startY, offsetX, offsetY;
    let btnWidth, btnHeight;
    let windowWidth, windowHeight;

    // 吸附到最近的边缘
    function snapToEdge() {
        const rect = toggleBtn.getBoundingClientRect();
        const distances = {
            left: rect.left,
            right: windowWidth - rect.right,
            top: rect.top,
            bottom: windowHeight - rect.bottom
        };

        // 找到最近的边
        let closestSide = 'left';
        let minDistance = distances.left;

        for (const side in distances) {
            if (distances[side] < minDistance) {
                minDistance = distances[side];
                closestSide = side;
            }
        }

        // 如果足够近则吸附
        if (minDistance < SNAP_DISTANCE) {
            // 如果是图标模式则完全贴边，否则保留小间距
            const offset = checkEdgePosition() ? 0 : 5;

            switch (closestSide) {
                case 'left':
                    toggleBtn.style.left = `${offset}px`;
                    break;
                case 'right':
                    // 修复右边吸附逻辑
                    toggleBtn.style.right = `${offset}px`;
                    toggleBtn.style.left = 'auto';
                    break;
                case 'top':
                    toggleBtn.style.top = `${offset}px`;
                    break;
                case 'bottom':
                    toggleBtn.style.top = 'auto';
                    toggleBtn.style.bottom = `${offset}px`;
                    break;
            }
            return true; // 已吸附
        }
        return false; // 未吸附
    }

    // 实现拖拽功能
    toggleBtn.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = toggleBtn.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        btnWidth = rect.width;
        btnHeight = rect.height;
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        // 提升拖拽时的视觉反馈
        toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.style.transition = 'transform 0.1s, padding 0.3s, borderRadius 0.3s';

        // 防止拖拽时选中文本
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 计算新位置
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // 边界限制
        newX = Math.max(0, Math.min(newX, windowWidth - btnWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - btnHeight));

        // 应用新位置
        toggleBtn.style.right = 'auto';
        toggleBtn.style.bottom = 'auto';
        toggleBtn.style.left = `${newX}px`;
        toggleBtn.style.top = `${newY}px`;

        // 实时边缘检测与吸附
        if (!snapToEdge()) {
            checkEdgePosition();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;

        isDragging = false;
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.transition = 'all 0.3s ease-out';

        // 执行最终吸附
        snapToEdge();

        // 保存新位置
        savePosition();

        // 只有微小移动时视为点击
        const moveX = Math.abs(e.clientX - startX);
        const moveY = Math.abs(e.clientY - startY);

        if (moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD) {
            const current = localStorage.getItem(STORAGE_KEY) === 'true';
            applyMode(!current);
        }
    });

    // 窗口大小改变时重新计算位置
    window.addEventListener('resize', () => {
        const rect = toggleBtn.getBoundingClientRect();
        const newWindowWidth = window.innerWidth;
        const newWindowHeight = window.innerHeight;

        // 检查按钮是否超出边界，如有则调整位置
        if (rect.right > newWindowWidth) {
            toggleBtn.style.left = 'auto';
            toggleBtn.style.right = '0px';
        }

        if (rect.bottom > newWindowHeight) {
            toggleBtn.style.top = 'auto';
            toggleBtn.style.bottom = '0px';
        }

        // 保存调整后的位置
        savePosition();
        // 边缘检测
        checkEdgePosition();
    });

    // 初始化
    toggleBtn.innerHTML = '<span class="full-text">🌙 暗黑模式</span><span class="icon-text">🌙</span>';
    toggleBtn.querySelector('.icon-text').style.display = 'none';
    document.body.appendChild(toggleBtn);
    restorePosition();
    applyMode(isDarkMode);
    checkEdgePosition();
})();
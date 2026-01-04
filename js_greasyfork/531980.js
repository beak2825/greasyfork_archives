// ==UserScript==
// @name         Claude SessionKey Manager
// @version      3.2
// @description  轻松管理和切换Claude的SessionKey（可拖拽浮动按钮，简洁弹出式菜单）。此脚本基于 https://greasyfork.org/scripts/501296，原作者: https://greasyfork.org/zh-CN/users/1337296
// @match        https://claude.ai/*
// @match        https://demo.fuclaude.com/*
// @grant        none
// @license      GNU GPLv3
// @author       f14xuanlv
// @namespace    https://greasyfork.org/users/1454591
// @downloadURL https://update.greasyfork.org/scripts/531980/Claude%20SessionKey%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/531980/Claude%20SessionKey%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============== 配置项 ===============
    const tokens = [
        {name: 'default_empty', key: 'sk-ant-sid01-xxx'},
        {name: 'default_empty1', key: 'sk-ant-sid01-xxx'},
        // 此处添加更多的SessionKey
    ];

    // =============== 样式设置 ===============
    const styles = document.createElement('style');
    styles.textContent = `
    .skm-main-button {
        position: fixed;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #C96442;
        color: white;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        user-select: none;
        touch-action: none;
        border: none;
    }

    .skm-main-button:hover {
        background: #E67816;
    }

    .skm-dragging {
        opacity: 0.8;
    }

    .skm-popup {
        position: fixed;
        z-index: 9999;
        width: 350px;
        background-color: #FFF8F0 !important;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transition: opacity 0.2s ease;
        opacity: 0;
        pointer-events: none;
    }

    .skm-popup.active {
        opacity: 1;
        pointer-events: all;
    }

    .skm-popup-header {
        background: #C96442;
        color: white !important;
        padding: 12px 16px;
        font-weight: bold;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .skm-close-btn {
        background: none;
        border: none;
        color: white !important;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .skm-close-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .skm-popup-content {
        padding: 16px;
        background-color: #FFF8F0 !important;
    }

    .skm-token-list {
        margin-bottom: 16px;
        max-height: 400px;
        overflow-y: auto;
    }

    .skm-token-item {
        padding: 6px 10px;
        margin-bottom: 6px;
        border-radius: 6px;
        border: 1px solid #E8DFD5;
        background-color: white !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        color: #333 !important;
    }

    .skm-token-item:hover {
        background-color: #FFF5EA !important;
        border-color: #C96442;
        color: #333 !important;
    }

    .skm-token-item.active {
        background-color: #FFF0DD !important;
        border-color: #C96442;
        color: #333 !important;
    }

    .skm-token-name {
        flex-grow: 1;
        font-size: 14px;
        padding-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333 !important;
    }

    .skm-use-btn {
        background-color: #C96442;
        color: white !important;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        min-width: 42px;
        text-align: center;
    }

    .skm-use-btn:hover {
        background-color: #E67816;
    }

    .skm-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 8px;
        border-top: 1px solid #E8DFD5;
    }

    .skm-version {
        font-size: 12px;
        color: #999 !important;
        margin-right: auto;
        align-self: center;
    }

    .skm-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #C96442 #FFF8F0;
    }

    .skm-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .skm-scrollbar::-webkit-scrollbar-track {
        background: #FFF8F0;
    }

    .skm-scrollbar::-webkit-scrollbar-thumb {
        background-color: #C96442;
        border-radius: 6px;
    }

    .skm-hint {
        margin-bottom: 12px;
        padding: 8px;
        background-color: #FFF0DD !important;
        border-radius: 4px;
        border-left: 3px solid #C96442;
    }

    .skm-hint-text {
        font-size: 12px;
        color: #996633 !important;
    }

    /* Force correct colors in all themes */
    @media (prefers-color-scheme: light), (prefers-color-scheme: dark) {
        .skm-popup, .skm-popup-content {
            background-color: #FFF8F0 !important;
        }

        .skm-token-item {
            background-color: white !important;
            color: #333 !important;
        }

        .skm-token-name {
            color: #333 !important;
        }

        .skm-hint-text {
            color: #996633 !important;
        }
    }
    `;
    document.head.appendChild(styles);

    // =============== 创建主按钮 ===============
    const mainButton = document.createElement('button');
    mainButton.className = 'skm-main-button';
    mainButton.innerHTML = 'SK';
    mainButton.title = 'Claude SessionKey Manager';
    document.body.appendChild(mainButton);

    // =============== 创建弹出菜单 ===============
    const popup = document.createElement('div');
    popup.className = 'skm-popup';

    const popupContent = `
        <div class="skm-popup-header">
            <span>SessionKey Manager</span>
            <button class="skm-close-btn">&times;</button>
        </div>
        <div class="skm-popup-content">
            <div class="skm-hint">
                <div class="skm-hint-text">提示：鼠标长按 SK 图标可以拖动位置</div>
            </div>
            <div class="skm-token-list skm-scrollbar">
                ${tokens.map((token, index) => `
                    <div class="skm-token-item" data-index="${index}">
                        <div class="skm-token-name">${token.name}</div>
                        <button class="skm-use-btn">使用</button>
                    </div>
                `).join('')}
            </div>
            <div class="skm-footer">
                <div class="skm-version">v3.2</div>
            </div>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // =============== 功能实现 ===============

    // 自动登录函数
    function autoLogin(token) {
        const currentURL = new URL(window.location.href);
        const host = currentURL.host;
        const protocol = currentURL.protocol;

        // 根据当前网站构建登录URL
        const loginUrl = `${protocol}//${host}/login_token?session_key=${token}`;

        console.log('Redirecting to:', loginUrl);
        window.location.href = loginUrl;
    }

    // 加载保存的位置
    function loadSavedPosition() {
        const savedPosition = localStorage.getItem('skmButtonPosition');
        if (savedPosition) {
            try {
                const position = JSON.parse(savedPosition);
                // 兼容旧版本的right定位
                if (position.right !== undefined) {
                    mainButton.style.top = `${position.top}px`;
                    mainButton.style.right = `${position.right}px`;
                } else {
                    mainButton.style.left = `${position.left}px`;
                    mainButton.style.top = `${position.top}px`;
                }
            } catch (error) {
                console.error('Failed to parse saved position', error);
                setDefaultPosition();
            }
        } else {
            setDefaultPosition();
        }
    }

    // 设置默认位置
    function setDefaultPosition() {
        mainButton.style.top = '70px';
        mainButton.style.right = '20px';
    }

    // 保存位置
    function savePosition() {
        const rect = mainButton.getBoundingClientRect();
        const position = {
            left: rect.left,
            top: rect.top
        };
        localStorage.setItem('skmButtonPosition', JSON.stringify(position));
    }

    // 拖拽功能实现
    let isDragging = false;
    let hasMoved = false;
    let startX, startY;
    let startLeft, startTop;

    function handleMouseDown(e) {
        e.preventDefault();

        const rect = mainButton.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;

        hasMoved = false;
        isDragging = false;

        // 如果菜单是打开的，关闭它
        popup.classList.remove('active');
    }

    function handleMouseMove(e) {
        if (startX === undefined) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // 移动超过3像素就开始拖拽
        if (distance > 3) {
            if (!isDragging) {
                isDragging = true;
                mainButton.classList.add('skm-dragging');
            }

            hasMoved = true;

            // 计算新位置
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;

            // 限制在窗口内
            const maxLeft = window.innerWidth - mainButton.offsetWidth - 10;
            const maxTop = window.innerHeight - mainButton.offsetHeight - 10;

            mainButton.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + 'px';
            mainButton.style.top = Math.max(10, Math.min(newTop, maxTop)) + 'px';
            mainButton.style.right = 'auto'; // 清除right定位
        }
    }

    function handleMouseUp(e) {
        if (startX === undefined) return;

        if (isDragging) {
            mainButton.classList.remove('skm-dragging');
            savePosition();
        }

        // 重置状态
        isDragging = false;
        startX = undefined;
        startY = undefined;

        // 短暂延迟重置移动状态，避免立即触发点击
        setTimeout(() => {
            hasMoved = false;
        }, 10);
    }

    // 加载之前选择的token
    function loadSelectedToken() {
        const storedToken = localStorage.getItem('skmSelectedToken');
        if (storedToken) {
            const tokenItems = document.querySelectorAll('.skm-token-item');
            tokenItems.forEach(item => {
                const index = parseInt(item.dataset.index);
                if (tokens[index] && tokens[index].key === storedToken) {
                    item.classList.add('active');
                }
            });
        }
    }

    // 处理token选择
    function handleTokenSelection(token) {
        if (token === '') {
            console.log('Empty token selected. No action taken.');
        } else {
            autoLogin(token);
        }
    }

    // 显示/隐藏弹出菜单
    function togglePopup(e) {
        // 如果刚完成拖拽，不触发菜单
        if (hasMoved) {
            return;
        }

        // 阻止事件冒泡
        e.stopPropagation();

        const rect = mainButton.getBoundingClientRect();
        const isActive = popup.classList.contains('active');

        if (!isActive) {
            // 计算弹出位置，确保在屏幕内
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let left = rect.left;
            if (left + popup.offsetWidth > windowWidth - 10) {
                left = windowWidth - popup.offsetWidth - 10;
            }

            let top = rect.bottom + 10;
            // 如果下方空间不足，则显示在按钮上方
            if (top + popup.offsetHeight > windowHeight - 10) {
                top = rect.top - popup.offsetHeight - 10;
            }

            popup.style.left = `${Math.max(10, left)}px`;
            popup.style.top = `${Math.max(10, top)}px`;

            popup.classList.add('active');
            loadSelectedToken();

            // 点击外部关闭菜单
            setTimeout(() => {
                document.addEventListener('click', closePopupOnOutsideClick);
            }, 10);
        } else {
            popup.classList.remove('active');
            document.removeEventListener('click', closePopupOnOutsideClick);
        }
    }

    // 点击外部关闭菜单
    function closePopupOnOutsideClick(e) {
        if (!popup.contains(e.target) && e.target !== mainButton) {
            popup.classList.remove('active');
            document.removeEventListener('click', closePopupOnOutsideClick);
        }
    }

    // =============== 事件绑定 ===============

    // 主按钮点击事件
    mainButton.addEventListener('click', togglePopup);

    // 拖拽相关事件
    mainButton.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // ESC键关闭菜单
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            popup.classList.remove('active');
        }
    });

    // 关闭按钮事件
    const closeBtn = popup.querySelector('.skm-close-btn');
    closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        popup.classList.remove('active');
        document.removeEventListener('click', closePopupOnOutsideClick);
    });

    // Token选择事件
    const tokenItems = popup.querySelectorAll('.skm-token-item');
    tokenItems.forEach(item => {
        const useBtn = item.querySelector('.skm-use-btn');

        // 使用按钮点击事件
        useBtn.addEventListener('click', e => {
            e.stopPropagation();
            const index = parseInt(item.dataset.index);
            const selectedToken = tokens[index].key;

            // 更新选中状态
            tokenItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 保存选择并登录
            localStorage.setItem('skmSelectedToken', selectedToken);
            handleTokenSelection(selectedToken);
        });

        // 点击整个item也可以选择
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            const selectedToken = tokens[index].key;

            // 更新选中状态
            tokenItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 保存选择
            localStorage.setItem('skmSelectedToken', selectedToken);
        });
    });

    // 初始化位置
    loadSavedPosition();
})();
// ==UserScript==
// @name         开发环境 Token 同步工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从测试环境同步 Token 到开发环境
// @author       lusuijie
// @license      MIT
// @match        http://localhost:8080/*
// @match        https://beebo-m.test.wonderbox.team/unlock-assist*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532799/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%20Token%20%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532799/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%20Token%20%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #token-sync-container {
            position: fixed;
            z-index: 9999;
        }
        #token-sync-btn {
            padding: 6px 12px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            user-select: none;
            touch-action: none;
            cursor: move;
        }
        #token-sync-btn:hover {
            background: #40a9ff;
        }
        .token-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            margin-top: 4px;
            min-width: 150px;
            z-index: 10000;
        }
        .token-dropdown.show {
            display: block;
        }
        .token-dropdown-item {
            padding: 6px 12px;
            cursor: pointer;
            color: #333;
        }
        .token-dropdown-item:hover {
            background: #f5f5f5;
        }
        .token-input-container {
            display: none;
            padding: 8px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            z-index: 10000;
        }
        .token-input-container.show {
            display: block;
        }
        #token-input {
            width: 200px;
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        #token-submit {
            padding: 4px 8px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        #token-submit:hover {
            background: #40a9ff;
        }
    `);

    // 在测试环境
    if (location.hostname === 'beebo-m.test.wonderbox.team') {
        const existingToken = localStorage.getItem('accessToken');
        if (existingToken) {
            GM_setValue('accessToken', existingToken);
            console.log('已保存现有 Token');
        }

        // 继续监听 localStorage 变化
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key === 'accessToken') {
                GM_setValue('accessToken', value);
                console.log('Token 已更新');
            }
        };
    }
    // 在开发环境
    else if (location.hostname === 'localhost') {
        createDraggableContainer();
    }

    function createDraggableContainer() {
        const container = document.createElement('div');
        container.id = 'token-sync-container';

        // 主按钮
        const button = document.createElement('button');
        button.id = 'token-sync-btn';
        button.textContent = 'Token 工具';

        // 下拉菜单
        const dropdown = document.createElement('div');
        dropdown.className = 'token-dropdown';

        // 同步选项
        const syncOption = document.createElement('div');
        syncOption.className = 'token-dropdown-item';
        syncOption.textContent = '同步测试环境Token';

        // 手动输入选项
        const manualOption = document.createElement('div');
        manualOption.className = 'token-dropdown-item';
        manualOption.textContent = '手动输入Token';

        // 输入框容器
        const inputContainer = document.createElement('div');
        inputContainer.className = 'token-input-container';

        // 输入框
        const input = document.createElement('input');
        input.id = 'token-input';
        input.placeholder = '请输入Token';

        // 提交按钮
        const submit = document.createElement('button');
        submit.id = 'token-submit';
        submit.textContent = '确认';

        // 组装DOM
        dropdown.appendChild(syncOption);
        dropdown.appendChild(manualOption);
        inputContainer.appendChild(input);
        inputContainer.appendChild(submit);
        container.appendChild(button);
        container.appendChild(dropdown);
        container.appendChild(inputContainer);

        // 从存储中获取位置
        const savedPosition = GM_getValue('buttonPosition', { x: 20, y: 20 });
        let currentX = savedPosition.x;
        let currentY = savedPosition.y;
        let isDragging = false;
        let initialX;
        let initialY;
        let dragStartTime;

        // 拖动事件处理函数
        function dragStart(e) {
            dragStartTime = new Date().getTime();
            if (e.type === 'mousedown') {
                initialX = e.clientX - container.offsetLeft;
                initialY = e.clientY - container.offsetTop;
            } else {
                initialX = e.touches[0].clientX - container.offsetLeft;
                initialY = e.touches[0].clientY - container.offsetTop;
            }
            isDragging = false; // 初始设置为 false
            e.preventDefault();
        }

        function drag(e) {
            if (dragStartTime && new Date().getTime() - dragStartTime > 200) {
                isDragging = true;
            }

            if (isDragging) {
                e.preventDefault();

                let clientX, clientY;
                if (e.type === 'mousemove') {
                    clientX = e.clientX;
                    clientY = e.clientY;
                } else {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }

                currentX = clientX - initialX;
                currentY = clientY - initialY;

                // 限制在窗口范围内
                currentX = Math.min(Math.max(0, currentX), window.innerWidth - container.offsetWidth);
                currentY = Math.min(Math.max(0, currentY), window.innerHeight - container.offsetHeight);

                container.style.left = currentX + 'px';
                container.style.top = currentY + 'px';
            }
        }

        function dragEnd(e) {
            const dragEndTime = new Date().getTime();
            const dragDuration = dragEndTime - dragStartTime;

            if (dragDuration < 200 && !isDragging) {
                // 这是一个点击事件
                dropdown.classList.toggle('show');
                inputContainer.classList.remove('show');
            }

            if (isDragging) {
                GM_setValue('buttonPosition', { x: currentX, y: currentY });
            }

            isDragging = false;
            dragStartTime = null;
        }

        // 添加拖动事件监听
        button.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        button.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        // 同步选项点击事件
        syncOption.addEventListener('click', () => {
            const token = GM_getValue('accessToken');
            if (token) {
                localStorage.setItem('accessToken', token);
                alert('Token 注入成功！页面将刷新');
                setTimeout(() => location.reload(), 500);
            } else {
                const testEnvUrl = 'https://beebo-m.test.wonderbox.team/unlock-assist';
                alert(`未找到 Token，请先访问测试环境: ${testEnvUrl}，在测试环境登陆后重新返回可直接再点击获取token`);
                window.open(testEnvUrl, '_blank');
            }
            dropdown.classList.remove('show');
        });

        // 手动输入选项点击事件
        manualOption.addEventListener('click', () => {
            dropdown.classList.remove('show');
            inputContainer.classList.add('show');
        });

        // 提交按钮点击事件
        submit.addEventListener('click', () => {
            const token = input.value.trim();
            if (token) {
                localStorage.setItem('accessToken', token);
                GM_setValue('accessToken', token);
                alert('Token 设置成功！页面将刷新');
                setTimeout(() => location.reload(), 500);
            } else {
                alert('请输入有效的Token');
            }
            inputContainer.classList.remove('show');
        });

        // 点击外部关闭下拉菜单和输入框
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.classList.remove('show');
                inputContainer.classList.remove('show');
            }
        });

        // 初始化位置
        container.style.left = currentX + 'px';
        container.style.top = currentY + 'px';

        document.body.appendChild(container);
    }
})();
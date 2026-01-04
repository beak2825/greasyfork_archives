// ==UserScript==
// @name         电报网页版-屏蔽群组用户发言 Telegram Web - Block Specific Users
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  【经典UI回归】完整功能版：用户屏蔽+关键词屏蔽+优雅界面
// @author       南竹 & grok AI & deepseek AI
// @match        https://web.telegram.org/k/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531922/%E7%94%B5%E6%8A%A5%E7%BD%91%E9%A1%B5%E7%89%88-%E5%B1%8F%E8%94%BD%E7%BE%A4%E7%BB%84%E7%94%A8%E6%88%B7%E5%8F%91%E8%A8%80%20Telegram%20Web%20-%20Block%20Specific%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/531922/%E7%94%B5%E6%8A%A5%E7%BD%91%E9%A1%B5%E7%89%88-%E5%B1%8F%E8%94%BD%E7%BE%A4%E7%BB%84%E7%94%A8%E6%88%B7%E5%8F%91%E8%A8%80%20Telegram%20Web%20-%20Block%20Specific%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        debug: false,
        blockKeywords: []
    };

    // 初始化数据
    let blockedUsers = JSON.parse(GM_getValue('blockedUsers', '[]'));
    if (GM_getValue('blockKeywords')) {
        config.blockKeywords = JSON.parse(GM_getValue('blockKeywords'));
    }

    // 调试输出
    function log(...args) {
        if (config.debug) console.log('[TG Block]', ...args);
    }

    // ========================
    // 经典UI样式 (v1.0风格)
    // ========================
    const style = document.createElement('style');
    style.textContent = `
        .block-users-window {
            position: fixed;
            top: 80px;
            left: 20px;
            width: 350px;
            background: white;
            border: 1px solid #d1d1d1;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            padding: 0;
            font-family: Arial, sans-serif;
            border-radius: 6px;
            overflow: hidden;
        }
        .block-users-window .header {
            background: #f5f5f5;
            padding: 10px 15px;
            cursor: move;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            color: #333;
        }
        .block-users-window .close-btn {
            cursor: pointer;
            font-size: 18px;
            color: #777;
            background: none;
            border: none;
            padding: 0 5px;
        }
        .block-users-window .close-btn:hover {
            color: #333;
        }
        .block-users-window .tabs {
            display: flex;
            background: #f0f0f0;
            border-bottom: 1px solid #ddd;
        }
        .block-users-window .tab {
            padding: 8px 0;
            cursor: pointer;
            flex: 1;
            text-align: center;
            font-size: 13px;
            color: #555;
            transition: all 0.2s;
        }
        .block-users-window .tab:hover {
            background: #e8e8e8;
        }
        .block-users-window .tab.active {
            background: white;
            color: #0088cc;
            font-weight: bold;
            border-bottom: 2px solid #0088cc;
        }
        .block-users-window .tab-content {
            padding: 12px 15px;
            max-height: 300px;
            overflow-y: auto;
        }
        .block-users-window .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
        }
        .block-users-window .list-item:last-child {
            border-bottom: none;
        }
        .block-users-window .list-item button {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            transition: background 0.2s;
        }
        .block-users-window .list-item button:hover {
            background: #ff5252;
        }
        .block-users-window .add-section {
            display: flex;
            gap: 8px;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .block-users-window select {
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            flex: 0.8;
        }
        .block-users-window input {
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            flex: 2;
        }
        .block-users-window .add-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 3px;
            flex: 0.7;
            transition: background 0.2s;
        }
        .block-users-window .add-btn:hover {
            background: #45a049;
        }
        .block-users-window .empty-tip {
            color: #999;
            text-align: center;
            padding: 20px 0;
            font-size: 13px;
        }
    `;
    document.head.appendChild(style);

    // ========================
    // 核心功能函数
    // ========================
    function getUserInfo(message) {
        const usernameElement = message.querySelector('.peer-title');
        return usernameElement ? {
            id: usernameElement.getAttribute('data-peer-id'),
            nickname: usernameElement.textContent.trim()
        } : null;
    }

    function getMessageText(message) {
        const selectors = ['.text-content', '.message-text', '.translatable-message'];
        for (const selector of selectors) {
            const el = message.querySelector(selector);
            if (el && el.textContent.trim()) return el.textContent.trim();
        }
        return '';
    }

    function checkKeywords(text) {
        return config.blockKeywords.some(keyword =>
            new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text)
        );
    }

    // ========================
    // 经典浮动控制面板
    // ========================
    function createBlockUsersWindow() {
        // 移除现有窗口
        const existingWindow = document.querySelector('.block-users-window');
        if (existingWindow) existingWindow.remove();

        // 创建窗口DOM
        const windowDiv = document.createElement('div');
        windowDiv.className = 'block-users-window';
        windowDiv.innerHTML = `
            <div class="header">
                <span>屏蔽管理 v1.4</span>
                <button class="close-btn">×</button>
            </div>
            <div class="tabs">
                <div class="tab active" data-tab="users">用户屏蔽</div>
                <div class="tab" data-tab="keywords">关键词屏蔽</div>
            </div>
            <div class="tab-content active" data-tab="users">
                <div class="content"></div>
                <div class="add-section">
                    <select id="block-type">
                        <option value="nickname">按昵称</option>
                        <option value="id">按ID</option>
                    </select>
                    <input id="block-value" placeholder="输入内容" />
                    <button class="add-btn" id="add-btn">添加</button>
                </div>
            </div>
            <div class="tab-content" data-tab="keywords">
                <div class="content"></div>
                <div class="add-section">
                    <input id="keyword-value" placeholder="输入关键词" style="flex:2.8" />
                    <button class="add-btn" id="add-keyword-btn">添加</button>
                </div>
            </div>
        `;
        document.body.appendChild(windowDiv);

        // 窗口拖动功能
        const header = windowDiv.querySelector('.header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            windowDiv.style.top = (windowDiv.offsetTop - pos2) + "px";
            windowDiv.style.left = (windowDiv.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        // 标签页切换
        windowDiv.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                windowDiv.querySelectorAll('.tab, .tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                this.classList.add('active');
                const tabContent = windowDiv.querySelector(`.tab-content[data-tab="${this.dataset.tab}"]`);
                if (tabContent) tabContent.classList.add('active');
            });
        });

        // 关闭按钮
        windowDiv.querySelector('.close-btn').addEventListener('click', () => {
            windowDiv.remove();
        });

        // 更新列表显示
        function updateLists() {
            updateUserList();
            updateKeywordList();
        }

        function updateUserList() {
            const content = windowDiv.querySelector('.tab-content[data-tab="users"] .content');
            content.innerHTML = blockedUsers.length ? '' : '<div class="empty-tip">暂无屏蔽用户</div>';

            blockedUsers.forEach((user, index) => {
                const item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = `
                    <span>${user.type === 'nickname' ? '昵称' : 'ID'}: <strong>${user.value}</strong></span>
                    <button data-index="${index}">删除</button>
                `;
                content.appendChild(item);
            });

            // 绑定删除事件
            content.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function() {
                    blockedUsers.splice(parseInt(this.dataset.index), 1);
                    GM_setValue('blockedUsers', JSON.stringify(blockedUsers));
                    updateLists();
                    hideMessages();
                });
            });
        }

        function updateKeywordList() {
            const content = windowDiv.querySelector('.tab-content[data-tab="keywords"] .content');
            content.innerHTML = config.blockKeywords.length ? '' : '<div class="empty-tip">暂无屏蔽关键词</div>';

            config.blockKeywords.forEach((keyword, index) => {
                const item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = `
                    <span>关键词: <strong>${keyword}</strong></span>
                    <button data-index="${index}">删除</button>
                `;
                content.appendChild(item);
            });

            // 绑定删除事件
            content.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function() {
                    config.blockKeywords.splice(parseInt(this.dataset.index), 1);
                    GM_setValue('blockKeywords', JSON.stringify(config.blockKeywords));
                    updateLists();
                    hideMessages();
                });
            });
        }

        // 添加按钮事件
        windowDiv.querySelector('#add-btn').addEventListener('click', addBlockUser);
        windowDiv.querySelector('#add-keyword-btn').addEventListener('click', addKeyword);

        function addBlockUser() {
            const type = windowDiv.querySelector('#block-type').value;
            const value = windowDiv.querySelector('#block-value').value.trim();

            if (!value) {
                alert('请输入有效内容！');
                return;
            }

            if (blockedUsers.some(u => u.type === type && u.value === value)) {
                alert('该条目已存在！');
                return;
            }

            blockedUsers.push({ type, value });
            GM_setValue('blockedUsers', JSON.stringify(blockedUsers));
            windowDiv.querySelector('#block-value').value = '';
            updateLists();
            hideMessages();
        }

        function addKeyword() {
            const keyword = windowDiv.querySelector('#keyword-value').value.trim();

            if (!keyword) {
                alert('请输入有效关键词！');
                return;
            }

            if (config.blockKeywords.includes(keyword)) {
                alert('该关键词已存在！');
                return;
            }

            config.blockKeywords.push(keyword);
            GM_setValue('blockKeywords', JSON.stringify(config.blockKeywords));
            windowDiv.querySelector('#keyword-value').value = '';
            updateLists();
            hideMessages();
        }

        // 初始化列表
        updateLists();
    }

    // ========================
    // 消息屏蔽核心逻辑
    // ========================
    function hideMessages() {
        document.querySelectorAll('.bubble:not(.block-processed)').forEach(message => {
            message.classList.add('block-processed');
            const userInfo = getUserInfo(message);
            const text = getMessageText(message);

            const isUserBlocked = userInfo && blockedUsers.some(user =>
                (user.type === 'nickname' && userInfo.nickname &&
                 user.value.toLowerCase() === userInfo.nickname.toLowerCase()) ||
                (user.type === 'id' && userInfo.id && user.value === userInfo.id)
            );

            const isKeywordBlocked = text && checkKeywords(text);

            if (isUserBlocked || isKeywordBlocked) {
                message.style.display = 'none';
                if (config.debug) {
                    console.log('屏蔽消息:',
                        isUserBlocked ? `用户匹配 (${userInfo.nickname || userInfo.id})` : `关键词匹配: "${text.substring(0, 20)}..."`,
                        message
                    );
                }
            }
        });
    }

    // ========================
    // 初始化脚本
    // ========================
    GM_registerMenuCommand('打开屏蔽面板', createBlockUsersWindow);
    GM_registerMenuCommand('清空屏蔽列表', () => {
        if (confirm('确定要清空所有屏蔽规则吗？')) {
            blockedUsers = [];
            config.blockKeywords = [];
            GM_setValue('blockedUsers', '[]');
            GM_setValue('blockKeywords', '[]');
            document.querySelectorAll('.bubble').forEach(m => m.style.display = '');
            alert('已清空所有屏蔽规则！');
        }
    });

    // 监听DOM变化
    const observer = new MutationObserver(hideMessages);
    observer.observe(document.querySelector('#column-center') || document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载后初始化
    window.addEventListener('load', () => {
        setTimeout(() => {
            hideMessages();
            if (config.debug) console.log('屏蔽脚本已加载', {
                version: '1.4',
                users: blockedUsers,
                keywords: config.blockKeywords
            });
        }, 3000);
    });
})();
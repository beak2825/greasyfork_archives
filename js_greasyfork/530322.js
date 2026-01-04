// ==UserScript==
// @name         B站直播间弹幕备注显示
// @namespace    https://www.mcbaoge.com/
// @version      2.0
// @description  支持可视化管理的Bilibili直播弹幕备注系统
// @author       MC豹哥
// @match        https://live.bilibili.com/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/530322/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%A4%87%E6%B3%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530322/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%A4%87%E6%B3%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) [year] [copyright holders]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function() {
    'use strict';
    let userRemarks = GM_getValue('userRemarks') || {};

    // 创建Shadow DOM容器
    function createShadowContainer() {
        const container = document.createElement('div');
        container.id = 'manager-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '2147483647';
        document.body.appendChild(container);
        return container.attachShadow({ mode: 'open' });
    }

    // 添加全局样式到文档头
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .remarkTag {
                color: #FFD700 !important;
                margin-left: 5px;
                font-size: 0.8em;
                background: rgba(0, 0, 0, 0.5);
                padding: 2px 5px;
                border-radius: 3px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建控制UI（在Shadow DOM内）
    function createControlUI(shadow) {
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
        #manager-container {
            font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
            color: #333;
            max-width: 450px;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            transform: scale(0.85);
            transform-origin: bottom right;
        }

        #manager-container #remark-manager-btn {
            background: linear-gradient(135deg, #00a1d6, #47c1ff);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            box-shadow: 0 3px 12px rgba(0, 161, 214, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #manager-container #remark-manager-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 16px rgba(0, 161, 214, 0.6);
        }

        #manager-container #remark-count-badge {
            background: #ffffff;
            color: #00a1d6;
            border-radius: 50px;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 700;
            margin-left: 8px;
        }

        #manager-container #remark-manager-ui {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 120, 180, 0.25);
            overflow: hidden;
            margin-top: 12px;
            display: block;
            max-height: 50vh;
            overflow-y: auto;
        }

        #manager-container .manager-header {
            background: linear-gradient(to right, #00a1d6, #29b6f6);
            color: white;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #manager-container .manager-header h3 {
            font-size: 16px;
            font-weight: 600;
        }

        #manager-container .close-btn {
            background: rgba(255, 255, 255, 0.25);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s;
        }

        #manager-container .close-btn:hover {
            background: rgba(255, 255, 255, 0.35);
            transform: scale(1.1);
        }

        #manager-container .manager-body {
            padding: 16px;
        }

        #manager-container .form-group {
            margin-bottom: 14px;
        }

        #manager-container .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #01579b;
            font-size: 13px;
        }

        #manager-container .input-control {
            width: 90%;
            padding: 10px 12px;
            border: 1px solid #b3e5fc;
            border-radius: 6px;
            font-size: 13px;
            background-color: #f1f9ff;
            transition: all 0.3s;
            color: #000000 !important;
        }

        #manager-container .input-control:focus {
            outline: none;
            border-color: #00a1d6;
            box-shadow: 0 0 0 3px rgba(0, 161, 214, 0.2);
            background-color: white;
        }

        #manager-container .input-control::placeholder {
            color: #81d4fa;
        }

        #manager-container #save-remark {
            background: linear-gradient(to right, #00a1d6, #29b6f6);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            margin-top: 4px;
            box-shadow: 0 3px 8px rgba(0, 161, 214, 0.35);
        }

        #manager-container #save-remark:hover {
            box-shadow: 0 4px 10px rgba(0, 161, 214, 0.45);
            transform: translateY(-2px);
        }

        #manager-container #save-remark:active {
            transform: translateY(0);
        }

        #manager-container #remark-list {
            margin-top: 20px;
            border-top: 1px solid #e1f5fe;
            padding-top: 16px;
        }

        #manager-container .remark-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 10px;
            background: #e1f5fe;
            border: 1px solid #b3e5fc;
            transition: all 0.3s;
        }

        #manager-container .remark-item:hover {
            background: #c8ebff;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 161, 214, 0.15);
        }

        #manager-container .remark-content-container {
            flex-grow: 1;
            min-width: 0;
        }

        #manager-container .remark-uid {
            font-size: 12px;
            font-weight: 500;
            color: #0288d1;
            margin-bottom: 4px;
        }

        #manager-container .remark-content {
            font-size: 14px;
            font-weight: 600;
            color: #01579b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #manager-container .edit-input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #b3e5fc;
            border-radius: 5px;
            font-size: 14px;
            background: white;
            color: #000000 !important;
            font-weight: 600;
        }

        #manager-container .remark-actions {
            display: flex;
            gap: 6px;
            margin-left: 8px;
        }

        #manager-container .edit-btn {
            background: linear-gradient(to right, #4fc3f7, #29b6f6);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        #manager-container .edit-btn:hover {
            background: linear-gradient(to right, #29b6f6, #039be5);
        }

        #manager-container .delete-btn {
            background: linear-gradient(to right, #ff5252, #ff4081);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        #manager-container .delete-btn:hover {
            background: linear-gradient(to right, #ff4081, #f50057);
        }

        #manager-container .stats-bar {
            background-color: #e1f5fe;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #b3e5fc;
        }

        #manager-container .stats-bar span {
            font-size: 13px;
            font-weight: 500;
            color: #01579b;
        }

        #manager-container #total-remarks {
            font-weight: 700;
            color: #00a1d6;
        }

        #manager-container #clear-all {
            background: linear-gradient(to right, #ff5252, #ff4081);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        #manager-container #clear-all:hover {
            background: linear-gradient(to right, #ff4081, #f50057);
        }
        `;
        shadow.appendChild(style);

        // 创建容器
        const container = document.createElement('div');
        container.id = 'manager-container';
        container.innerHTML = `
            <button id="remark-manager-btn">
                <span>弹幕备注管理</span>
                <span id="remark-count-badge" style="margin-left:8px; background:#fff; color:#00a1d6; border-radius:10px; padding:2px 6px; font-size:12px">${Object.keys(userRemarks).length}</span>
            </button>
            <div id="remark-manager-ui">
                <div class="manager-header">
                    <h3>弹幕备注管理</h3>
                    <button class="close-btn">✕</button>
                </div>
                <div class="manager-body">
                    <div class="form-group">
                        <label for="remark-uid">用户UID</label>
                        <input type="text" id="remark-uid" class="input-control" placeholder="输入用户UID或者点击对应弹幕自动获取">
                    </div>
                    <div class="form-group">
                        <label for="remark-text">备注内容</label>
                        <input type="text" id="remark-text" class="input-control" placeholder="输入备注内容">
                    </div>
                    <button id="save-remark" class="btn btn-primary">保存备注</button>
                    <div id="remark-list"></div>
                </div>
                <div class="stats-bar">
                    <span>备注总数: <span id="total-remarks">0</span></span>
                    <button id="clear-all" class="btn btn-sm btn-danger">清除全部</button>
                </div>
            </div>
        `;
        shadow.appendChild(container);

        return {
            btn: container.querySelector('#remark-manager-btn'),
            ui: container.querySelector('#remark-manager-ui'),
            saveBtn: container.querySelector('#save-remark'),
            closeBtn: container.querySelector('.close-btn'),
            uidInput: container.querySelector('#remark-uid'),
            textInput: container.querySelector('#remark-text'),
            list: container.querySelector('#remark-list'),
            totalRemarks: container.querySelector('#total-remarks'),
            badge: container.querySelector('#remark-count-badge'),
            clearAllBtn: container.querySelector('#clear-all')
        };
    }

    // 渲染备注列表
    function renderRemarkList(list) {
        const remarks = Object.entries(userRemarks);

        if (!remarks.length) {
            list.innerHTML = '<div class="no-remarks">暂无备注，请添加新备注</div>';
            return;
        }

        list.innerHTML = remarks.map(([uid, remark]) => `
            <div class="remark-item" data-uid="${uid}">
                <div class="remark-content-container">
                    <div class="remark-uid">UID: ${uid}</div>
                    <div class="remark-content">${remark}</div>
                </div>
                <div class="remark-actions">
                    <button class="edit-btn btn btn-sm" style="background:#e6f7ff">编辑</button>
                    <button class="delete-btn btn btn-sm btn-danger">删除</button>
                </div>
            </div>
        `).join('');
    }

    // 进入编辑模式
    function enterEditMode(item) {
        const contentContainer = item.querySelector('.remark-content-container');
        const uid = item.dataset.uid;
        const originalText = userRemarks[uid];

        contentContainer.innerHTML = `
            <div class="remark-uid" style="margin-bottom:6px">UID: ${uid}</div>
            <input type="text" class="edit-input" value="${originalText}">
        `;

        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');

        editBtn.textContent = '保存';
        deleteBtn.textContent = '取消';
    }

    // 退出编辑模式
    function exitEditMode(item, success = false) {
        const uid = item.dataset.uid;
        const input = item.querySelector('input');

        if (success && input.value.trim()) {
            userRemarks[uid] = input.value.trim();
            GM_setValue('userRemarks', userRemarks);
            updateStats();
        }

        // 恢复显示
        item.querySelector('.remark-content-container').innerHTML = `
            <div class="remark-uid">UID: ${uid}</div>
            <div class="remark-content">${userRemarks[uid]}</div>
        `;

        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');

        editBtn.textContent = '编辑';
        deleteBtn.textContent = '删除';
    }

    // 更新统计信息
    function updateStats() {
        const count = Object.keys(userRemarks).length;
        if (uiElements.totalRemarks) uiElements.totalRemarks.textContent = count;
        if (uiElements.badge) uiElements.badge.textContent = count;
    }

    // 初始化弹幕点击事件
    function initDanmakuClick() {
        document.querySelectorAll('.chat-item.danmaku-item').forEach(item => {
            if (!item.dataset.clickBound) {
                item.addEventListener('click', handleDanmakuClick);
                item.dataset.clickBound = true;
            }
        });
    }

    // 弹幕点击处理
    function handleDanmakuClick(e) {
        const uid = e.currentTarget.getAttribute('data-uid');
        if (uiElements.uidInput) uiElements.uidInput.value = uid;

        // 如果UI是隐藏的，同时打开UI
        if (uiElements.ui.style.display === 'none') {
            uiElements.ui.style.display = 'block';
        }

        // 聚焦到备注输入框
        if (uiElements.textInput) {
            uiElements.textInput.focus();
        }
    }

    // 弹幕备注显示
    function addRemarkToDanmaku(item) {
        const uid = item.getAttribute('data-uid');
        const remark = userRemarks[uid];
        const userNameEl = item.querySelector('.user-name');

        if (!userNameEl) return;

        // 无备注时恢复原始用户名（可选）
        if (!remark) return;

        // 避免重复修改
        if (userNameEl.dataset.remarkApplied === 'true') return;

        // 替换用户名为备注
        userNameEl.textContent = remark + ' : ';
        userNameEl.style.color = '#FFD700';
        userNameEl.style.fontWeight = 'bold';
        userNameEl.dataset.remarkApplied = 'true';
    }

    function refreshAllDanmakus() {
        document.querySelectorAll('.chat-item.danmaku-item').forEach(addRemarkToDanmaku);
    }

    // 弹幕监听器
    function initDanmakuObserver() {
        // 1. 首先刷新现有弹幕
        refreshAllDanmakus();

        // 2. 初始化点击事件
        initDanmakuClick();

        // 3. 创建观察器捕获新弹幕
        const observer = new MutationObserver(mutations => {
            let hasNewDanmaku = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('chat-item')) {
                        addRemarkToDanmaku(node);
                        hasNewDanmaku = true;
                    }
                });
            });

            // 新弹幕添加后重新绑定点击事件
            if (hasNewDanmaku) initDanmakuClick();
        });

        // 4. 智能选择观察目标（B站最新DOM结构）
        const containerSelectors = [
            '.chat-history-list',  // 常规直播弹幕容器
            '.room-history-list',  // 特殊直播间容器
            '.list-box',           // 旧版容器
            '.danmaku-item-wrap'   // 新版弹幕容器
        ];

        let containerFound = false;
        containerSelectors.forEach(selector => {
            const container = document.querySelector(selector);
            if (container && !containerFound) {
                observer.observe(container, { childList: true, subtree: true });
                containerFound = true;
            }
        });

        // 5. 兜底方案：监听整个body
        if (!containerFound) {
            console.warn("【弹幕备注】未找到弹幕容器，启用全文档监听");
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 主函数
    async function main() {
        // 创建shadow root
        const shadow = createShadowContainer();

        // 添加全局样式
        addGlobalStyles();

        // 创建UI元素
        window.uiElements = createControlUI(shadow);
        const { btn, ui, saveBtn, closeBtn, uidInput, textInput, list, totalRemarks, badge, clearAllBtn } = uiElements;

        // 渲染备注列表
        renderRemarkList(list);
        updateStats();

        // 按钮打开管理界面
        btn.addEventListener('click', () => {
            ui.style.display = 'block';
        });

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            ui.style.display = 'none';
        });

        // 保存备注
        saveBtn.addEventListener('click', () => {
            const uid = uidInput.value.trim();
            const text = textInput.value.trim();

            if (uid && text) {
                userRemarks[uid] = text;
                GM_setValue('userRemarks', userRemarks);

                // 清空输入框
                uidInput.value = '';
                textInput.value = '';

                renderRemarkList(list);
                updateStats();

                // ✅ 立即刷新弹幕显示
                refreshAllDanmakus();

                // 显示反馈
                const originalText = saveBtn.textContent;
                saveBtn.textContent = '✓ 已保存';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                }, 1500);
            }
        });

        // 清除全部按钮
        clearAllBtn.addEventListener('click', () => {
            if (Object.keys(userRemarks).length) {
                if (confirm('确定要清除所有备注吗？此操作不可撤销。')) {
                    userRemarks = {};
                    GM_setValue('userRemarks', {});
                    renderRemarkList(list);
                    updateStats();
                }
            }
        });

        // 事件委托处理备注项操作
        list.addEventListener('click', e => {
            const item = e.target.closest('.remark-item');
            if (!item) return;

            const isEditBtn = e.target.classList.contains('edit-btn');
            const isDeleteBtn = e.target.classList.contains('delete-btn');

            if (isEditBtn) {
                if (e.target.textContent === '编辑') {
                    enterEditMode(item);
                } else {
                    exitEditMode(item, true);
                    renderRemarkList(list);
                    updateStats();
                }
            }

            if (isDeleteBtn) {
                if (e.target.textContent === '删除') {
                    delete userRemarks[item.dataset.uid];
                    GM_setValue('userRemarks', userRemarks);
                    renderRemarkList(list);
                    updateStats();
                } else {
                    exitEditMode(item);
                }
            }
        });

        // 初始化弹幕监听
        initDanmakuObserver();

        // 添加弹幕点击监听器
        initDanmakuClick();

        // 刷新页面时也应用已有备注到当前弹幕
        refreshAllDanmakus();

        // 定期检查（10秒一次）
        setInterval(initDanmakuClick, 10000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
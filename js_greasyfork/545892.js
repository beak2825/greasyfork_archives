// ==UserScript==
// @name         PageMemory
// @namespace    scroll-historian.js
// @version      2.2
// @description  带历史记录管理的位置记忆器（支持拖拽）
// @author       QWAS-zx
// @match        *://*/*
// @match        about:srcdoc
// @match        file:///*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545892/PageMemory.user.js
// @updateURL https://update.greasyfork.org/scripts/545892/PageMemory.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const STORAGE_KEY = 'Global_Position_History';
    const HELPER_POSITION_KEY = 'Global_Helper_Position';
    let menuVisible = false;
    let historyVisible = false;
    let isDragging = false;
    let dragStartX, dragStartY;
    let initialX, initialY;

    // 添加全局样式
    GM_addStyle(`
        /* 主按钮和菜单样式 */
        #mdn-position-helper {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 10000;
            cursor: grab;
        }
        
        #mdn-position-helper.dragging {
            cursor: grabbing;
            opacity: 0.9;
            box-shadow: 0 0 15px rgba(38, 139, 210, 0.8);
        }
        
        #mdn-main-btn {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            background: #002b36;
            color: #fdf6e3;
            border: 2px solid #268bd2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transition: all 0.3s;
            user-select: none;
        }
        
        #mdn-main-btn:hover {
            transform: scale(1.1);
            background: #073642;
        }
        
        #mdn-action-menu {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 180px;
            background: #002b36;
            border: 1px solid #268bd2;
            border-radius: 8px;
            padding: 10px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: none;
            z-index: 10001;
        }
        
        .mdn-menu-item {
            padding: 10px 15px;
            color: #fdf6e3;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            align-items: center;
        }
        
        .mdn-menu-item:hover {
            background: #073642;
        }
        
        /* 历史记录面板样式 */
        #mdn-history-panel {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 320px;
            max-height: 60vh;
            background: #002b36;
            border: 1px solid #268bd2;
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            z-index: 10002;
            display: none;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        
        #mdn-history-header {
            padding: 15px;
            background: #073642;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #268bd2;
        }
        
        #mdn-history-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #268bd2;
        }
        
        #mdn-clear-history {
            background: #dc322f;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        #mdn-clear-history:hover {
            background: #ff4136;
        }
        
        #mdn-history-list {
            padding: 10px;
            overflow-y: auto;
            max-height: calc(60vh - 100px);
        }
        
        .mdn-history-item {
            padding: 12px;
            margin-bottom: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            border-left: 3px solid #268bd2;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .mdn-history-item:hover {
            background: rgba(38, 139, 210, 0.15);
            transform: translateX(-3px);
        }
        
        .mdn-history-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #fdf6e3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .mdn-history-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.85em;
            color: #93a1a1;
        }
        
        .mdn-history-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
        }
        
        .mdn-restore-btn, .mdn-delete-btn {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.85em;
            cursor: pointer;
        }
        
        .mdn-restore-btn {
            background: rgba(38, 139, 210, 0.3);
            color: #268bd2;
        }
        
        .mdn-delete-btn {
            background: rgba(220, 50, 47, 0.3);
            color: #dc322f;
        }
        
        /* 标记线 */
        #mdn-position-marker {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #ff4136, transparent);
            z-index: 9999;
            pointer-events: none;
            display: none;
        }
        
        /* 通知样式 */
        #mdn-position-notify {
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: rgba(0, 43, 54, 0.9);
            color: #fdf6e3;
            border: 1px solid #268bd2;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10001;
            max-width: 300px;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `);

    // 创建主容器
    const helperContainer = document.createElement('div');
    helperContainer.id = 'mdn-position-helper';
    document.body.appendChild(helperContainer);
    
    // 创建主按钮
    const mainBtn = document.createElement('div');
    mainBtn.id = 'mdn-main-btn';
    mainBtn.textContent = '📌';
    helperContainer.appendChild(mainBtn);
    
    // 创建菜单
    const actionMenu = document.createElement('div');
    actionMenu.id = 'mdn-action-menu';
    helperContainer.appendChild(actionMenu);
    
    // 创建保存按钮
    const saveBtn = document.createElement('div');
    saveBtn.className = 'mdn-menu-item';
    saveBtn.innerHTML = '<span style="margin-right:8px">💾</span> 保存当前位置';
    actionMenu.appendChild(saveBtn);
    
    // 创建历史记录按钮
    const historyBtn = document.createElement('div');
    historyBtn.className = 'mdn-menu-item';
    historyBtn.innerHTML = '<span style="margin-right:8px">📋</span> 历史记录';
    actionMenu.appendChild(historyBtn);
    
    // 创建历史记录面板
    const historyPanel = document.createElement('div');
    historyPanel.id = 'mdn-history-panel';
    historyPanel.innerHTML = `
        <div id="mdn-history-header">
            <div id="mdn-history-title">保存的位置历史</div>
            <button id="mdn-clear-history">清空记录</button>
        </div>
        <div id="mdn-history-list"></div>
    `;
    document.body.appendChild(historyPanel);
    
    // 创建位置标记线
    const positionMarker = document.createElement('div');
    positionMarker.id = 'mdn-position-marker';
    document.body.appendChild(positionMarker);

    // 获取历史记录
    function getHistory() {
        return GM_getValue(STORAGE_KEY, []);
    }

    // 保存历史记录
    function saveHistory(history) {
        GM_setValue(STORAGE_KEY, history);
    }

    // 添加新记录
    function addNewRecord() {
        const history = getHistory();
        
        const newRecord = {
            id: Date.now(),
            url: window.location.href,
            path: window.location.pathname,
            scrollY: window.scrollY,
            timestamp: Date.now(),
            pageTitle: document.title,
            scrollPercent: getScrollPercentage()
        };
        
        // 添加到历史记录开头
        history.unshift(newRecord);
        
        // 只保留最近的20条记录
        if (history.length > 20) history.pop();
        
        saveHistory(history);
        showNotification(`📍 位置已保存!<br>${newRecord.scrollPercent}%`);
        updateHistoryUI();
    }

    // 删除记录
    function deleteRecord(id) {
        const history = getHistory();
        const newHistory = history.filter(record => record.id !== id);
        saveHistory(newHistory);
        updateHistoryUI();
        showNotification('🗑️ 记录已删除');
    }

    // 清空历史
    function clearHistory() {
        saveHistory([]);
        updateHistoryUI();
        showNotification('🧹 历史记录已清空');
        hideHistoryPanel();
    }

    // 恢复记录
    function restoreRecord(record) {
        // 显示位置标记线
        positionMarker.style.display = 'block';
        positionMarker.style.top = `${record.scrollY}px`;
        setTimeout(() => positionMarker.style.display = 'none', 3000);

        if (window.location.href === record.url) {
            window.scrollTo({ top: record.scrollY, behavior: 'smooth' });
            showNotification(`↩️ 已恢复位置!<br>${record.scrollPercent}%`);
        } else {
            showNotification(`⏳ 正在跳转到保存的页面...`);
            setTimeout(() => {
                window.location.href = record.url;
                // 存储记录以便新页面加载后滚动
                GM_setValue('Global_Pending_Restore', record);
            }, 500);
        }
        
        hideHistoryPanel();
    }

    // 更新历史记录UI
    function updateHistoryUI() {
        const history = getHistory();
        const historyList = document.getElementById('mdn-history-list');
        
        if (history.length === 0) {
            historyList.innerHTML = `<div style="padding:20px; text-align:center; color:#93a1a1;">
                暂无保存的位置记录
            </div>`;
            return;
        }
        
        historyList.innerHTML = '';
        
        history.forEach(record => {
            const item = document.createElement('div');
            item.className = 'mdn-history-item';
            item.innerHTML = `
                <div class="mdn-history-title">${record.pageTitle}</div>
                <div class="mdn-history-meta">
                    <span>${formatTime(record.timestamp)}</span>
                    <span>${record.scrollPercent}%</span>
                </div>
                <div class="mdn-history-actions">
                    <div class="mdn-restore-btn">恢复</div>
                    <div class="mdn-delete-btn">删除</div>
                </div>
            `;
            
            // 添加事件监听
            item.querySelector('.mdn-restore-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                restoreRecord(record);
            });
            
            item.querySelector('.mdn-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteRecord(record.id);
            });
            
            item.addEventListener('click', () => {
                restoreRecord(record);
            });
            
            historyList.appendChild(item);
        });
    }

    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // 获取滚动百分比
    function getScrollPercentage(scrollY = window.scrollY) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        return totalHeight > 0 ? Math.round((scrollY / totalHeight) * 100) : 0;
    }

    // 显示通知
    function showNotification(message) {
        const existingNote = document.getElementById('mdn-position-notify');
        if (existingNote) existingNote.remove();
        
        const notification = document.createElement('div');
        notification.id = 'mdn-position-notify';
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // 显示菜单
    function showMenu() {
        menuVisible = true;
        actionMenu.style.display = 'block';
        hideHistoryPanel();
    }

    // 隐藏菜单
    function hideMenu() {
        menuVisible = false;
        actionMenu.style.display = 'none';
    }

    // 显示历史面板
    function showHistoryPanel() {
        historyVisible = true;
        historyPanel.style.display = 'block';
        updateHistoryUI();
        hideMenu();
    }

    // 隐藏历史面板
    function hideHistoryPanel() {
        historyVisible = false;
        historyPanel.style.display = 'none';
    }

    // 切换菜单显示
    function toggleMenu() {
        if (menuVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    // 切换历史面板显示
    function toggleHistory() {
        if (historyVisible) {
            hideHistoryPanel();
        } else {
            showHistoryPanel();
        }
    }

    // 加载保存的位置
    function loadSavedPosition() {
        const savedPos = GM_getValue(HELPER_POSITION_KEY, null);
        if (savedPos) {
            helperContainer.style.left = savedPos.left;
            helperContainer.style.top = savedPos.top;
            helperContainer.style.right = 'auto';
            helperContainer.style.bottom = 'auto';
        }
    }

    // 保存当前位置
    function saveCurrentPosition() {
        const rect = helperContainer.getBoundingClientRect();
        const pos = {
            left: `${rect.left}px`,
            top: `${rect.top}px`
        };
        GM_setValue(HELPER_POSITION_KEY, pos);
    }

    // 主按钮点击事件
    mainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // 菜单按钮事件
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addNewRecord();
        hideMenu();
    });

    historyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHistory();
    });

    // 清空历史按钮
    document.getElementById('mdn-clear-history').addEventListener('click', (e) => {
        e.stopPropagation();
        clearHistory();
    });

    // 点击页面其他区域关闭所有面板
    document.addEventListener('click', (e) => {
        if (!helperContainer.contains(e.target) && !historyPanel.contains(e.target)) {
            hideMenu();
            hideHistoryPanel();
        }
    });

    // 检查是否有待恢复的记录（跨页面恢复）
    const pendingRestore = GM_getValue('Global_Pending_Restore', null);
    if (pendingRestore) {
        setTimeout(() => {
            window.scrollTo({ top: pendingRestore.scrollY, behavior: 'smooth' });
            showNotification(`✅ 位置已恢复!<br>${pendingRestore.pageTitle}`);
            GM_setValue('Global_Pending_Restore', null);
        }, 1000);
    }

    // 初始化历史记录
    updateHistoryUI();
    
    // 初始化位置
    loadSavedPosition();
    
    // ==============================
    // 拖拽功能实现
    // ==============================
    
    mainBtn.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        if (e.button !== 0) return; // 只处理左键点击
        
        // 防止拖拽时触发其他事件
        e.preventDefault();
        e.stopPropagation();
        
        // 记录初始位置
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        // 获取当前helperContainer的位置
        const rect = helperContainer.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        // 添加拖拽样式
        helperContainer.classList.add('dragging');
        
        // 添加事件监听
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        
        // 关闭菜单
        hideMenu();
        hideHistoryPanel();
    }
    
    function doDrag(e) {
        if (!isDragging) return;
        
        // 计算偏移量
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        
        // 更新位置
        helperContainer.style.left = `${initialX + dx}px`;
        helperContainer.style.top = `${initialY + dy}px`;
        helperContainer.style.right = 'auto';
        helperContainer.style.bottom = 'auto';
    }
    
    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        helperContainer.classList.remove('dragging');
        
        // 保存位置
        saveCurrentPosition();
        
        // 移除事件监听
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
})();
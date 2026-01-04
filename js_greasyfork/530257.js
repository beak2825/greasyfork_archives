// ==UserScript==
// @name         Steam元素隐藏管理器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在Steam页面添加可自定义隐藏元素的控制面板
// @author       YourName
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530257/Steam%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530257/Steam%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置项
    const CONFIG = {
        storageKey: 'steamHiddenElements',
        buttonPosition: 'afterbegin', // 在页面顶栏插入按钮
        panelStyle: `
            position: fixed;
            top: 20%;
            right: 20px;
            background: #1b2838;
            padding: 15px;
            z-index: 9999;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            color: #c6d4df;
            min-width: 280px;
        `
    };

    // 初始化存储
    let hiddenIds = GM_getValue(CONFIG.storageKey, []);
    if (!Array.isArray(hiddenIds)) hiddenIds = [];

    // 创建控制面板
    function createControlPanel() {
        // 主容器
        const panel = document.createElement('div');
        panel.style.cssText = CONFIG.panelStyle;
        panel.innerHTML = `
            <div style="margin-bottom:15px">
                <input type="text" id="customElementId" 
                    placeholder="输入要隐藏的元素ID" 
                    style="padding:5px;width:180px;background:#2a475e;border:1px solid #417a9b;color:white;">
                <button style="margin-left:5px;padding:5px 10px;background:#417a9b;border:none;color:white;cursor:pointer">添加</button>
            </div>
            <div id="currentList" style="max-height:200px;overflow-y:auto;"></div>
            <div style="margin-top:10px;font-size:0.9em;color:#66c0f4">
                当前已隐藏 <span id="counter">0</span> 个元素
            </div>
        `;

        // 添加按钮事件
        panel.querySelector('button').addEventListener('click', addNewElement);
        panel.querySelector('input').addEventListener('keypress', e => {
            if (e.key === 'Enter') addNewElement();
        });

        // 初始隐藏面板
        panel.style.display = 'none';
        document.body.appendChild(panel);
        return panel;
    }

    // 创建触发按钮
    function createTriggerButton(panel) {
        const btn = document.createElement('div');
        btn.innerHTML = '🎚️ 元素隐藏管理器';
        btn.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: #1b2838;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            color: #66c0f4;
            font-family: Arial;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: 0.3s;
        `;
        btn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            updateListDisplay();
        });
        document.body.appendChild(btn);
    }

    // 更新元素列表显示
    function updateListDisplay() {
        const listContainer = document.getElementById('currentList');
        listContainer.innerHTML = hiddenIds.map(id => `
            <div style="padding:5px;margin:3px 0;background:#2a475e;display:flex;justify-content:space-between">
                <span>${id}</span>
                <button data-id="${id}" 
                    style="background:none;border:1px solid #c6d4df;color:#c6d4df;cursor:pointer">×</button>
            </div>
        `).join('');

        // 添加删除事件
        listContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                hiddenIds = hiddenIds.filter(id => id !== btn.dataset.id);
                GM_setValue(CONFIG.storageKey, hiddenIds);
                updateListDisplay();
                applyHideRules();
            });
        });

        document.getElementById('counter').textContent = hiddenIds.length;
    }

    // 添加新元素
    function addNewElement() {
        const input = document.getElementById('customElementId');
        const newId = input.value.trim();
        
        if (newId && !hiddenIds.includes(newId)) {
            hiddenIds.push(newId);
            GM_setValue(CONFIG.storageKey, hiddenIds);
            input.value = '';
            applyHideRules();
            updateListDisplay();
        }
    }

    // 应用隐藏规则
    function applyHideRules() {
        hiddenIds.forEach(id => {
            const elements = document.querySelectorAll(`#${CSS.escape(id)}`);
            elements.forEach(el => el.style.display = 'none');
        });
    }

    // 主初始化
    const panel = createControlPanel();
    createTriggerButton(panel);
    
    // 使用增强版Observer
    const observer = new MutationObserver(mutations => {
        applyHideRules();
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 初始执行
    applyHideRules();
    updateListDisplay();

    // 自动清理
    setTimeout(() => observer.disconnect(), 30000); // 30秒后停止观察
})();
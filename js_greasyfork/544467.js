// ==UserScript==
// @name         Bilibili 热搜屏蔽 搜索栏灰字屏蔽
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  管理B站热搜屏蔽词并隐藏匹配的热搜项目，同时屏蔽搜索框的灰字提示
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        *://www.bilibili.com/*
// @match        *://bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://t.bilibili.com/*
// @match        *://search.bilibili.com/*
// @match        *://message.bilibili.com/*
// @match        *://account.bilibili.com/*
// @match        *://live.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544467/Bilibili%20%E7%83%AD%E6%90%9C%E5%B1%8F%E8%94%BD%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E7%81%B0%E5%AD%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544467/Bilibili%20%E7%83%AD%E6%90%9C%E5%B1%8F%E8%94%BD%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E7%81%B0%E5%AD%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //-------------------------
    // 搜索框屏蔽
    //-------------------------
    function cleanSearchInput(inputEl) {
        if (!inputEl) return;
        if (inputEl.placeholder !== " ") {
            inputEl.placeholder = " ";
        }
        if (inputEl.getAttribute('title') !== " ") {
            inputEl.setAttribute('title', " ");
        }
    }

    // 初始检查
    const initInput = document.querySelector('input.nav-search-input');
    if (initInput) cleanSearchInput(initInput);

    //-------------------------
    // 初始化 UI
    //-------------------------
    const panel = document.createElement('div');
    panel.id = 'block-panel';
    panel.innerHTML =`
        <div class="header">
            <span>热搜屏蔽管理</span>
            <button id="hide-btn">隐藏</button>
        </div>
        <div class="input-row">
            <input type="text" id="block-input" placeholder="输入热搜屏蔽词">
            <button id="add-block">添加</button>
        </div>
        <div id="tags-container"></div>
    `;
    panel.classList.add('hidden'); // 默认隐藏
    document.body.appendChild(panel);

    //-------------------------
    // 样式：右上角固定
    //-------------------------
    const style = document.createElement('style');
    style.textContent =`
        #block-panel.hidden {
            display: none !important;
        }
        #block-panel .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            margin-bottom: 6px;
        }
        #hide-btn {
            padding: 2px 6px;
            border: none;
            background: #ff6a6a;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        #block-panel {
            position: fixed;
            top: 60px;  /* 避开导航栏 */
            right: 20px;
            background: rgba(30,30,30,0.95);
            padding: 12px;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            z-index: 999999;
            width: 300px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        #block-panel .input-row {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }
        #block-panel input {
            flex: 1;
            padding: 4px 8px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
        #block-panel button {
            padding: 4px 8px;
            border: none;
            background: #ff6a6a;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
        }
        .hb-tag {
            display: inline-block;
            background: #555;
            padding: 2px 8px;
            margin: 2px;
            border-radius: 12px;
            font-size: 13px;
            cursor: pointer;
            color: #fff;
            user-select: none;
        }
        .hb-tag:hover {
            background: #ff6a6a;
        }
        #block-panel.hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    //-------------------------
    // 数据操作
    //-------------------------
    function getWords() {
        return JSON.parse(GM_getValue('hotBlockWords') || '[]');
    }

    function saveWord(word) {
        let list = getWords();
        if (!list.includes(word)) {
            list.push(word);
            GM_setValue('hotBlockWords', JSON.stringify(list));
        }
        renderTags();
        safeReorder();
    }

    function removeWord(word) {
        let list = getWords().filter(w => w !== word);
        GM_setValue('hotBlockWords', JSON.stringify(list));
        renderTags();
        safeReorder();
    }

    function clearHotSearchRanks() {
        // 清空首页热搜编号
        document.querySelectorAll('.trending-item').forEach(item => {
            const rankNode = item.querySelector('.trendings-rank, .prefix');
            if (rankNode) {
                rankNode.innerText = '';
            }
        });

        // 清空动态热搜编号
        document.querySelectorAll('.bili-dyn-search-trendings .trending').forEach(item => {
            const rankNode = item.querySelector('.prefix');
            if (rankNode) {
                rankNode.innerText = '';
            }
        });
    }

    //-------------------------
    // 渲染标签
    //-------------------------
    function renderTags() {
        const container = document.getElementById('tags-container');
        container.innerHTML = '';
        getWords().forEach(word => {
            const tag = document.createElement('span');
            tag.className = 'hb-tag';
            tag.textContent = word + ' ×';
            tag.onclick = () => removeWord(word);
            container.appendChild(tag);
        });
    }

    //-------------------------
    // 添加事件
    //-------------------------
    document.getElementById('add-block').addEventListener('click', () => {
        const input = document.getElementById('block-input');
        const word = input.value.trim();
        if (word) {
            saveWord(word);
            input.value = '';
        }
    });

    document.getElementById('block-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-block').click();
        }
    });


    //-------------------------
    // 屏蔽热搜榜
    //-------------------------
    let debugTimer = null;
    function hideHotSearch() {
        clearTimeout(debugTimer);
        debugTimer = setTimeout(() => {
            observer.disconnect(); // 暂停 Observer，防止 rank 更新触发循环

         const words = getWords();
        // 先恢复所有热搜项
        document.querySelectorAll('.trending-item').forEach(item => {
            item.style.display = '';  // 恢复为默认显示
        });
        document.querySelectorAll('.bili-dyn-search-trendings .trending').forEach(item => {
            item.style.display = '';
        });
        // 屏蔽逻辑（保持不变）
        document.querySelectorAll('.trending-item').forEach(item => {
            const textNode = item.querySelector('.trending-text');
            if (!textNode) return;
            const text = textNode.innerText.trim().toLowerCase();
            if (words.some(w => text.toLowerCase().includes(w.trim().toLowerCase()))) {
                item.style.display = 'none';
            }
        });
        // 动态页
        document.querySelectorAll('.bili-dyn-search-trendings .trending .text').forEach(textNode => {
            const text = textNode.innerText.trim().toLowerCase();
            if (words.some(w => text.includes(w.trim().toLowerCase()))) {
            const trendingItem = textNode.closest('.trending');
            if (trendingItem) trendingItem.style.display = 'none';
        }
        });
        observer.observe(document.body, { childList: true, subtree: true }); // 恢复监听
        }, 20); // 防抖
    }
    function safeReorder() {
    // 暂停 MutationObserver，防止触发循环
        observer.disconnect();
        clearHotSearchRanks();
        // 调用一次 hideHotSearch() 进行屏蔽
        hideHotSearch();

        // 50ms 后重新监听，确保 DOM 更新完成
        setTimeout(() => {
            observer.observe(document.body, { childList: true, subtree: true });
        }, 50);
    }


    //-------------------------
    // MutationObserver 监听页面变化
    //-------------------------
    let timer = null;
    const observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            clearHotSearchRanks();
            hideHotSearch();
            const inputEl = document.querySelector('input.nav-search-input');
            if (inputEl) cleanSearchInput(inputEl);
        }, 20);  // 20ms 防抖
    });
    observer.observe(document.body, { childList: true, subtree: true });

    //-------------------------
    // 折叠/显示控制
    //-------------------------
    function togglePanel() {
        panel.classList.toggle('hidden');
    }

    GM_registerMenuCommand('屏蔽词管理', togglePanel);


    // 按钮点击隐藏
    document.getElementById('hide-btn').addEventListener('click', () => {
        panel.classList.add('hidden');
        localStorage.setItem('hotPanelVisible', 'false');
    });

    // 记住上次状态
    if (localStorage.getItem('hotPanelVisible') === 'false') {
        panel.classList.add('hidden');
    }
    //-------------------------
    // 初始化
    //-------------------------
    renderTags();
    hideHotSearch();
})();

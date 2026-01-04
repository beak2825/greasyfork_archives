// ==UserScript==
// @name         搜索求职者
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  搜索块列表中同时匹配两个属性的元素，支持上下导航
// @author       You
// @license      MIT
// @match        *://*.zhipin.com/web/chat/search
// @match        *://*.zhipin.com/web/chat/search/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531545/%E6%90%9C%E7%B4%A2%E6%B1%82%E8%81%8C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/531545/%E6%90%9C%E7%B4%A2%E6%B1%82%E8%81%8C%E8%80%85.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const rdocument = window.top.document;
    
    // 添加CSS样式
    GM_addStyle(`
        #blockSearchContainer {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        #blockSearchContainer h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        #blockSearchContainer input {
            margin: 5px 0;
            padding: 5px;
            width: 200px;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        #blockSearchContainer button {
            margin: 2px;
            padding: 5px 10px;
            cursor: pointer;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #blockSearchContainer button:hover {
            background: #e0e0e0;
        }
        .search-match {
            background-color: rgba(255, 255, 0, 0.3);
            outline: 2px solid yellow;
        }
        .current-match {
            background-color: rgba(255, 165, 0, 0.5) !important;
            outline: 2px solid orange !important;
        }
        #matchInfo {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
        }
    `);

    // 创建搜索界面
    const searchContainer = document.createElement('div');
    searchContainer.id = 'blockSearchContainer';
    searchContainer.innerHTML = `
        <h3>列表搜索</h3>
        <div>
            <label>姓名:</label>
            <input type="text" id="attrA" placeholder="输入姓名关键词">
        </div>
        <div>
            <label>学校名:</label>
            <input type="text" id="attrB" placeholder="输入学校名关键词">
        </div>
        <div>
            <button id="searchBtn">搜索</button>
            <button id="prevBtn">上一个</button>
            <button id="nextBtn">下一个</button>
            <button id="closeBtn">关闭</button>
            <button id="flushBtn">刷新</button>
            <button id="resetBtn">重置</button>
        </div>
        <div id="matchInfo">准备搜索...</div>
    `;

    document.body.appendChild(searchContainer);

    // 获取DOM元素
    const attrAInput = document.getElementById('attrA');
    const attrBInput = document.getElementById('attrB');
    const searchBtn = document.getElementById('searchBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = document.getElementById('closeBtn');
    const matchInfo = document.getElementById('matchInfo');
    const flushBtn = document.getElementById('flushBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 全局变量
    let matchedBlocks = [];
    let currentIndex = -1;
    const blockSelector = 'div.card-container'; // 修改为你的块元素选择器

    // 清除所有高亮
    function clearHighlights() {
        document.querySelectorAll('.search-match, .current-match').forEach(el => {
            el.classList.remove('search-match', 'current-match');
        });
    }

    // 滚动到匹配块
    function scrollToMatch(index) {
        if (matchedBlocks.length === 0 || index < 0 || index >= matchedBlocks.length) {
            return;
        }

        clearHighlights();

        currentIndex = index;
        const block = matchedBlocks[index];
        block.classList.add('current-match');

        // 滚动到元素
        block.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 更新信息显示
        matchInfo.textContent = `匹配 ${currentIndex + 1}/${matchedBlocks.length}`;
        matchInfo.style.color = '#333';
    }

    // 搜索块
    function searchBlocks() {

        const keywordA = attrAInput.value.trim().toLowerCase();
        const keywordB = attrBInput.value.trim().toLowerCase();

        if (!keywordA && !keywordB) {
            matchInfo.textContent = "请输入至少一个属性关键词";
            matchInfo.style.color = 'red';
            return;
        }

        clearHighlights();
        matchedBlocks = [];
        currentIndex = -1;
        let tdocument = rdocument.querySelector('div.frame-box').children[0].contentWindow.document;
        // 获取所有块元素
        const blocks = tdocument.querySelectorAll(blockSelector);

        blocks.forEach(block => {
            // 获取属性值（根据实际HTML结构调整）
            const attrA = block.querySelector('span.name-label').textContent;
            const attrB = block.querySelector('ul.exp-box.edu-exp-box.dot-none').textContent;

            // 检查是否匹配
            const matchesA = keywordA ? attrA.toLowerCase().includes(keywordA) : true;
            const matchesB = keywordB ? attrB.toLowerCase().includes(keywordB) : true;

            if (matchesA && matchesB) {
                matchedBlocks.push(block);
                block.classList.add('search-match');
            }
        });

        if (matchedBlocks.length > 0) {
            scrollToMatch(0);
        } else {
            matchInfo.textContent = "未找到匹配的块";
            matchInfo.style.color = 'red';
        }
    }

    async function loadAllItems(tdocument) {
    let attempts = 0;
    const maxAttempts = 20; // 防止无限循环

    while (attempts < maxAttempts) {
        const loadMoreButtons = tdocument.querySelectorAll('p.click-class');
        if (loadMoreButtons.length === 0) break;

        loadMoreButtons[0].click(); // 点击第一个"加载更多"
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        attempts++;
    }

    if (attempts >= maxAttempts) {
        console.warn('达到最大尝试次数，可能仍有未加载的内容');
    }
}

    // 事件监听
    searchBtn.addEventListener('click', searchBlocks);

    prevBtn.addEventListener('click', () => {
        if (matchedBlocks.length === 0) return;
        const newIndex = (currentIndex - 1 + matchedBlocks.length) % matchedBlocks.length;
        scrollToMatch(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        if (matchedBlocks.length === 0) return;
        const newIndex = (currentIndex + 1) % matchedBlocks.length;
        scrollToMatch(newIndex);
    });

    flushBtn.addEventListener('click', () =>{
        let tdocument = rdocument.querySelector('div.frame-box').children[0].contentWindow.document;
        loadAllItems(tdocument);
    });
    resetBtn.addEventListener('click', () =>{
        matchedBlocks = [];
        attrAInput.value = '';
        attrBInput.value = '';
    });

    closeBtn.addEventListener('click', () => {
        clearHighlights();
        searchContainer.style.display = 'none';
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // 忽略在输入框中按下的键
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // Ctrl+F 显示/隐藏搜索框
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();

            searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
        }

        // 在搜索激活时，Enter下一个，Shift+Enter上一个
        if (matchedBlocks.length > 0) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const newIndex = (currentIndex + 1) % matchedBlocks.length;
                scrollToMatch(newIndex);
            } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                const newIndex = (currentIndex - 1 + matchedBlocks.length) % matchedBlocks.length;
                scrollToMatch(newIndex);
            }
        }
    });

    // 初始隐藏搜索框
    searchContainer.style.display = 'none';



})();
// ==UserScript==
// @name         Git Branch Name Generator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Generate git branch name from ClickUp page title
// @author       Ethan (with Phind)
// @match        https://app.clickup.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530673/Git%20Branch%20Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/530673/Git%20Branch%20Name%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查標題是否包含 | #<id>
    function hasTaskId(title) {
        return / \| #\w+$/.test(title);
    }

    // 從標題生成分支名稱
    function generateBranchName(title) {
        // 移除中文字符
        const safeTitle = title
        .trim()
        .replace(/[\u4E00-\u9FFF]+/g, '')
        .replace(/\s+/g, '-') // 將空格替換為連字號
        .replace(/[^a-zA-Z0-9_-]/g, '') // 移除特殊字元
        .replace(/--(?=[^--]*$)/, '__CU-') // 匹配最後一個 --

        return safeTitle || 'untitled-branch';
    }

    // 創建浮動按鈕容器
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px; /* 💥 靠右對齊 💥 */
        z-index: 2147483647;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column; /* 保持垂直結構 */
        overflow: hidden;
        min-width: 250px;
    `;
    document.body.appendChild(container);

    // 頂部欄位，用於包含拖曳區和最小化按鈕
    const topBar = document.createElement('div');
    topBar.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        flex-shrink: 0;
        background: #f0f0f0;
    `;
    container.appendChild(topBar);

    // 拖曳專用區塊 (Handle)
    const dragHandle = document.createElement('div');
    dragHandle.textContent = '拖曳此處 🖱️';
    dragHandle.style.cssText = `
        padding: 5px 10px;
        background: #f0f0f0;
        color: #333;
        font-weight: bold;
        flex-grow: 1;
        cursor: move;
        user-select: none;
    `;
    topBar.appendChild(dragHandle);

    // 最小化按鈕 (獨立於 contentArea)
    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = '▼';
    minimizeButton.style.cssText = `
        padding: 5px 10px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 0;
        cursor: pointer;
        pointer-events: auto;
        flex-shrink: 0;
    `;
    topBar.appendChild(minimizeButton);

    // 內容區塊 (包含分支名稱和複製按鈕)
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        display: flex;
        align-items: center;
        padding: 5px;
        flex-shrink: 0;
    `;
    container.appendChild(contentArea);


    // 分支名稱顯示區域
    const branchNameElement = document.createElement('div');
    branchNameElement.style.cssText = `
        font-family: monospace;
        padding: 8px;
        background: #f5f5f5;
        color: #000;
        border-radius: 4px;
        margin: 0 5px;
        flex-grow: 1;
        min-width: 100px;
    `;
    contentArea.appendChild(branchNameElement);

    // 複製按鈕
    const copyButton = document.createElement('button');
    copyButton.textContent = '複製分支名稱';
    copyButton.style.cssText = `
        padding: 5px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 5px;
        width: 100px;
        pointer-events: auto;
        flex-shrink: 0;
    `;
    contentArea.appendChild(copyButton);

    // =======================================================
    // 💥 拖動功能的核心邏輯 💥
    // =======================================================
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    // 1. 滑鼠按下事件 (只綁定到 topBar)
    topBar.addEventListener('mousedown', (e) => {
        // 排除按鈕被點擊的情況
        if (e.target.tagName === 'BUTTON') {
            return;
        }

        isDragging = true;

        const currentRect = container.getBoundingClientRect();

        // 💥 轉換 right/bottom 為 top/left 進行拖曳 💥
        container.style.right = null;
        container.style.bottom = null;
        container.style.top = `${currentRect.top}px`;
        container.style.left = `${currentRect.left}px`;

        // 計算偏移量
        offset = {
            x: e.clientX - currentRect.left,
            y: e.clientY - currentRect.top
        };

        dragHandle.style.cursor = 'grabbing';
        e.preventDefault();
    });

    // 2. 滑鼠移動事件 (執行拖動)
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

        container.style.left = `${newX}px`;
        container.style.top = `${newY}px`;
    });

    // 3. 滑鼠鬆開事件 (結束拖動)
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;

            // 💥 拖曳結束後，將當前 top/left 位置轉換回 right/bottom 💥

            const currentRect = container.getBoundingClientRect();

            // 計算新的 right 和 bottom 值
            const newRight = window.innerWidth - currentRect.right;
            const newBottom = window.innerHeight - currentRect.bottom;

            // 應用新的 right/bottom 並移除 top/left
            container.style.left = null;
            container.style.top = null;
            container.style.right = `${newRight}px`;
            container.style.bottom = `${newBottom}px`;

            dragHandle.style.cursor = 'move';
        }
    });

    // =======================================================
    // 其他功能 (最小化和更新)
    // =======================================================

    // 追蹤最小化狀態
    let isMinimized = false;

    // 最小化/還原功能：只控制 contentArea
    function toggleMinimize() {
        isMinimized = !isMinimized;

        if (isMinimized) {
            // 最小化 (將 contentArea 隱藏)
            contentArea.style.display = 'none';
            minimizeButton.textContent = '▲';

            // 修正容器的底部圓角
            container.style.borderBottomLeftRadius = '4px';
            container.style.borderBottomRightRadius = '4px';

        } else {
            // 還原
            contentArea.style.display = 'flex';
            minimizeButton.textContent = '▼';

            // 恢復圓角
            container.style.borderBottomLeftRadius = '0';
            container.style.borderBottomRightRadius = '0';
        }
    }

    minimizeButton.onclick = toggleMinimize;

    copyButton.onclick = async (e) => {
        e.stopPropagation();

        const branchName = branchNameElement.textContent;
        try {
            await navigator.clipboard.writeText(branchName);
            copyButton.textContent = '已複製！';
            setTimeout(() => {
                copyButton.textContent = '複製分支名稱';
            }, 2000);
        } catch (err) {
            console.error('複製失敗:', err);
            copyButton.textContent = '複製失敗';
        }
    };

    // 更新分支名稱
    function updateBranchName() {
        const title = document.title;

        if (!hasTaskId(title)) {
            branchNameElement.textContent = 'NOT TASK PAGE';
        } else {
            const branchName = generateBranchName(title);
            branchNameElement.textContent = branchName;
        }
    }

    // 監聽標題變化
    let lastTitle = '';
    setInterval(() => {
        const title = document.title;
        if (title !== lastTitle) {
            lastTitle = title;
            updateBranchName();
        } else if (branchNameElement.textContent === 'NOT TASK PAGE') {
            updateBranchName();
        }
    }, 500);

    // 初始更新
    updateBranchName();
})();
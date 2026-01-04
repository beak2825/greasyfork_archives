// ==UserScript==
// @name         BUPT_自定义待办过滤助手_北京邮电大学云邮教学空间
// @namespace    https://ucloud.bupt.edu.cn/
// @version      2.3
// @description  允许用户自定义需要隐藏的待办项
// @match        https://ucloud.bupt.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523658/BUPT_%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BE%85%E5%8A%9E%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B_%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/523658/BUPT_%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BE%85%E5%8A%9E%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B_%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hiddenItems = new Set(JSON.parse(localStorage.getItem('hiddenTitles') || '[]'));
    let isProcessing = false;
    let isPanelVisible = false;
    let originalTaskCount = null;

    // 创建控制面板
    function createControlPanel() {
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            .filter-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border: none;
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                transition: all 0.3s ease;
            }
            .filter-panel.hidden {
                transform: translateX(calc(100% + 20px));
            }
            .filter-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 8px 16px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
                z-index: 10000;
            }
            .filter-toggle-btn:hover {
                background: #45a049;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            .filter-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 14px;
                box-sizing: border-box;
            }
            .filter-input:focus {
                border-color: #4CAF50;
                outline: none;
                box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
            }
            .filter-add-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .filter-add-btn:hover {
                background: #45a049;
            }
            .filter-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px;
                background: #f5f5f5;
                border-radius: 4px;
                margin-top: 8px;
            }
            .filter-item-text {
                margin-right: 10px;
                font-size: 14px;
                color: #333;
            }
            .filter-delete-btn {
                background: #ff4444;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            .filter-delete-btn:hover {
                background: #cc0000;
            }
            .filter-list-title {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 2px solid #4CAF50;
            }
        `;
        document.head.appendChild(style);

        // 创建切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'filter-toggle-btn';
        toggleButton.textContent = '过滤设置';
        toggleButton.onclick = togglePanel;
        document.body.appendChild(toggleButton);

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'filterControlPanel';
        panel.className = 'filter-panel' + (isPanelVisible ? '' : ' hidden');

        // 添加标题输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'filter-input';
        input.placeholder = '输入要隐藏的待办项标题';
        panel.appendChild(input);

        // 添加按钮
        const addButton = document.createElement('button');
        addButton.className = 'filter-add-btn';
        addButton.textContent = '添加过滤';
        addButton.onclick = () => {
            const title = input.value.trim();
            if (title) {
                hiddenItems.add(title);
                updateHiddenItemsList();
                saveHiddenItems();
                filterItems();
                input.value = '';
            }
        };
        panel.appendChild(addButton);

        // 显示当前隐藏的项目列表
        const list = document.createElement('div');
        list.id = 'hiddenItemsList';
        list.style.marginTop = '15px';
        panel.appendChild(list);

        document.body.appendChild(panel);
        updateHiddenItemsList();
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = document.getElementById('filterControlPanel');
        const toggleButton = document.querySelector('.filter-toggle-btn');

        isPanelVisible = !isPanelVisible;
        panel.className = 'filter-panel' + (isPanelVisible ? '' : ' hidden');
        toggleButton.textContent = isPanelVisible ? '隐藏设置' : '过滤设置';
    }

    // 更新隐藏项目列表显示
    function updateHiddenItemsList() {
        const list = document.getElementById('hiddenItemsList');
        list.innerHTML = '<div class="filter-list-title">当前隐藏的项目</div>';

        hiddenItems.forEach(title => {
            const item = document.createElement('div');
            item.className = 'filter-item';

            const text = document.createElement('span');
            text.className = 'filter-item-text';
            text.textContent = title;
            item.appendChild(text);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'filter-delete-btn';
            deleteButton.textContent = '删除';
            deleteButton.onclick = () => {
                hiddenItems.delete(title);
                updateHiddenItemsList();
                saveHiddenItems();
                filterItems();
            };
            item.appendChild(deleteButton);

            list.appendChild(item);
        });
    }

    // 保存隐藏项目列表到localStorage
    function saveHiddenItems() {
        localStorage.setItem('hiddenTitles', JSON.stringify([...hiddenItems]));
    }

    // 更新待办数字的函数
    function updateTaskCount() {
        const taskItems = document.querySelectorAll('.teacher-task-item');
        taskItems.forEach(item => {
            const label = item.querySelector('.task-label');
            if (label && label.textContent.trim() === '待办') {
                const taskValueElement = item.querySelector('.task-value');
                if (taskValueElement) {
                    // 如果还没有记录原始数量，或者检测到新的原始数量
                    const currentCount = parseInt(taskValueElement.textContent.trim());
                    if (originalTaskCount === null || currentCount > originalTaskCount) {
                        originalTaskCount = currentCount;
                        console.log('记录/更新初始待办数:', originalTaskCount);
                    }

                    // 计算隐藏的待办项数量
                    const hiddenCount = countHiddenTasks();

                    // 计算新的待办数量
                    const newCount = Math.max(0, originalTaskCount - hiddenCount);
                    console.log('更新待办数为:', newCount, '(原始:', originalTaskCount, '隐藏:', hiddenCount, ')');

                    // 更新显示的数量
                    taskValueElement.textContent = newCount.toString();
                }
            }
        });
    }

    // 计算当前隐藏的待办项数量
    function countHiddenTasks() {
        let count = 0;
        const items = document.querySelectorAll('div.in-progress-item.home-inline-block');
        items.forEach(item => {
            const titleElement = item.querySelector('.activity-title');
            if (titleElement && [...hiddenItems].some(hiddenTitle => titleElement.innerText.includes(hiddenTitle))) {
                count++;
            }
        });
        return count;
    }

    // 过滤待办项
    function filterItems() {
        if (isProcessing) return;
        isProcessing = true;

        const items = document.querySelectorAll('div.in-progress-item.home-inline-block');
        console.log('检查到的项目数量:', items.length);

        items.forEach(item => {
            const titleElement = item.querySelector('.activity-title');
            if (titleElement) {
                const title = titleElement.innerText;
                console.log('检查标题:', title);
                updateTaskCount();
                if ([...hiddenItems].some(hiddenTitle => title.includes(hiddenTitle))) {
                    console.log('找到需要隐藏的项目:', title);
                    item.style.display = 'none';
                } else {
                    console.log('显示项目:', title);
                    item.style.display = '';
                }
            }
        });

        console.log('当前隐藏项目数:', hiddenItems.size);
        isProcessing = false;
    }

    // 初始化
    console.log('脚本开始运行');
    createControlPanel();

    // 设置观察器
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' ||
                mutation.type === 'characterData' ||
                mutation.target.classList?.contains('in-progress-item') ||
                mutation.target.classList?.contains('teacher-task-item')) {
                console.log('检测到相关页面变化');
                filterItems();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    console.log('已设置观察器');
    filterItems();
})();
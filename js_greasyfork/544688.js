// ==UserScript==
// @name         DeepSeek Chat 简约提示语助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  支持多步撤销、大窗口、完美输入体验
// @author       Dost51552
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544688/DeepSeek%20Chat%20%E7%AE%80%E7%BA%A6%E6%8F%90%E7%A4%BA%E8%AF%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544688/DeepSeek%20Chat%20%E7%AE%80%E7%BA%A6%E6%8F%90%E7%A4%BA%E8%AF%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认预设提示语
    const defaultPrompts = [
        "请帮我总结这篇文章的主要内容",
        "用简洁的语言解释这个概念",
        "这段代码有什么问题？如何优化？",
        "请用中文回答我的问题",
    ];

    // 获取或初始化存储的提示语
    let savedPrompts = GM_getValue("savedPrompts", defaultPrompts);
    let deletedHistory = []; // 改用数组记录删除历史
    let undoTimeout = null;

    // 创建菜单样式（终极优化版）
    GM_addStyle(`
        #prompt-menu {
            position: fixed;
            bottom: 130px;
            right: 30px;
            width: 280px;
            background-color: rgb(38, 38, 38);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            font-family: "Microsoft YaHei", sans-serif;
            color: rgb(210, 210, 210);
            z-index: 9999;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
        }
        #prompt-menu.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        #prompt-menu-header {
            padding: 12px;
            background-color: rgb(30, 30, 30);
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #undo-btn {
            color: rgb(180, 180, 180);
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            margin-left: 10px;
            white-space: nowrap;
        }
        #undo-btn.visible {
            opacity: 1;
        }
        #undo-count {
            display: inline-block;
            min-width: 15px;
            text-align: center;
        }
        #prompt-menu-content {
            max-height: 300px;
            overflow-y: auto;
        }
        .prompt-item {
            padding: 12px 40px 12px 12px;
            border-bottom: 1px solid rgb(50, 50, 50);
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
        }
        .prompt-item:hover {
            background-color: rgb(50, 50, 50);
        }
        .delete-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: rgb(160, 160, 160);
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
        }
        .delete-btn:hover {
            color: rgb(210, 210, 210);
            background-color: rgba(255,255,255,0.1);
        }
        #prompt-menu-footer {
            padding: 12px;
            display: flex;
            gap: 8px;
            background-color: rgb(30, 30, 30);
        }
        #new-prompt-input {
            flex: 1;
            padding: 8px;
            background-color: rgb(50, 50, 50);
            border: 1px solid rgb(70, 70, 70);
            color: rgb(210, 210, 210);
            border-radius: 4px;
            font-family: "Microsoft YaHei", sans-serif;
        }
        #add-prompt-btn {
            padding: 0 12px;
            background-color: rgb(70, 70, 70);
            border: none;
            color: rgb(210, 210, 210);
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #add-prompt-btn:hover {
            background-color: rgb(90, 90, 90);
        }
        #menu-trigger {
            position: fixed;
            bottom: 80px;
            right: 30px;
            width: 44px;
            height: 44px;
            background-color: rgb(38, 38, 38);
            border: 2px solid rgb(42, 42, 42);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s;
        }
        #menu-trigger:hover {
            transform: scale(1.1);
            background-color: rgb(50, 50, 50);
        }
    `);

    // 创建悬浮触发器
    const trigger = document.createElement('div');
    trigger.id = 'menu-trigger';
    trigger.innerHTML = '⚡';
    document.body.appendChild(trigger);

    // 创建菜单 DOM
    const menu = document.createElement('div');
    menu.id = 'prompt-menu';
    menu.innerHTML = `
        <div id="prompt-menu-header">
            <span>预设提示语</span>
            <span id="undo-btn">撤销(<span id="undo-count">0</span>)</span>
        </div>
        <div id="prompt-menu-content"></div>
        <div id="prompt-menu-footer">
            <input type="text" id="new-prompt-input" placeholder="输入新提示语...">
            <button id="add-prompt-btn">添加</button>
        </div>
    `;
    document.body.appendChild(menu);

    const menuContent = document.getElementById('prompt-menu-content');
    const newPromptInput = document.getElementById('new-prompt-input');
    const addPromptBtn = document.getElementById('add-prompt-btn');
    const undoBtn = document.getElementById('undo-btn');
    const undoCount = document.getElementById('undo-count');

    // 菜单交互状态管理
    let menuTimeout;
    const showMenu = () => {
        clearTimeout(menuTimeout);
        menu.classList.add('active');
    };
    const hideMenu = () => {
        menuTimeout = setTimeout(() => {
            if (!menu.matches(':hover') && !trigger.matches(':hover')) {
                menu.classList.remove('active');
            }
        }, 300);
    };

    // 绑定悬停事件
    trigger.addEventListener('mouseenter', showMenu);
    menu.addEventListener('mouseenter', showMenu);
    trigger.addEventListener('mouseleave', hideMenu);
    menu.addEventListener('mouseleave', hideMenu);

    // 保存提示语数据
    const savePrompts = () => {
        GM_setValue("savedPrompts", savedPrompts);
    };

    // 更新撤销按钮状态
    const updateUndoButton = () => {
        undoCount.textContent = deletedHistory.length;
        if (deletedHistory.length > 0) {
            undoBtn.classList.add('visible');
        } else {
            undoBtn.classList.remove('visible');
        }
    };

    // 撤销删除操作
    undoBtn.addEventListener('click', () => {
        if (deletedHistory.length > 0) {
            const lastDeleted = deletedHistory.pop();
            savedPrompts.splice(lastDeleted.index, 0, lastDeleted.text);
            savePrompts();
            loadPrompts();
            updateUndoButton();

            // 重置计时器
            if (undoTimeout) clearTimeout(undoTimeout);
            undoTimeout = setTimeout(clearUndoHistory, 10000);
        }
    });

    // 清除撤销历史
    const clearUndoHistory = () => {
        deletedHistory = [];
        updateUndoButton();
        if (undoTimeout) clearTimeout(undoTimeout);
    };

    // 智能追加文本到输入框
    const appendToInput = (text) => {
        const chatInput = document.querySelector('#chat-input');
        if (!chatInput) return;

        const setNativeValue = (element, value) => {
            const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
            const prototype = Object.getPrototypeOf(element);
            const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

            if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else if (valueSetter) {
                valueSetter.call(element, value);
            } else {
                element.value = value;
            }
        };

        const currentValue = chatInput.value.trim();
        const separator = currentValue ? '\n\n' : '';
        const newValue = `${currentValue}${separator}${text}`;

        setNativeValue(chatInput, newValue);
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.dispatchEvent(new Event('change', { bubbles: true }));
        chatInput.focus();
        navigator.clipboard.writeText(text);
    };

    // 加载提示语列表
    function loadPrompts() {
        menuContent.innerHTML = '';
        savedPrompts.forEach((prompt, index) => {
            const promptItem = document.createElement('div');
            promptItem.className = 'prompt-item';
            promptItem.innerHTML = `
                ${prompt}
                <div class="delete-btn">×</div>
            `;

            promptItem.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) return;
                appendToInput(prompt);

                promptItem.style.backgroundColor = 'rgb(60, 60, 60)';
                setTimeout(() => {
                    promptItem.style.backgroundColor = '';
                }, 300);
            });

            const deleteBtn = promptItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 记录删除历史（包括内容和位置）
                deletedHistory.push({
                    text: prompt,
                    index: index,
                    time: Date.now()
                });
                savedPrompts.splice(index, 1);
                savePrompts();
                loadPrompts();
                updateUndoButton();

                if (undoTimeout) clearTimeout(undoTimeout);
                undoTimeout = setTimeout(clearUndoHistory, 10000);
            });

            menuContent.appendChild(promptItem);
        });
    }

    // 添加新提示语
    addPromptBtn.addEventListener('click', () => {
        const newPrompt = newPromptInput.value.trim();
        if (newPrompt) {
            savedPrompts.push(newPrompt);
            savePrompts();
            newPromptInput.value = '';
            loadPrompts();
            clearUndoHistory();
        }
    });

    newPromptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addPromptBtn.click();
        }
    });

    // 初始化加载
    loadPrompts();
})();
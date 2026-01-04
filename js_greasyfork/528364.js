// ==UserScript==
// @name         Prompt Manager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixed focus issue with search, import, and export (search below list)
// @author       yowaimono
// @match        https://grok.com/chat/*
// @match        https://askmanyai.cn/chat/*
// @match        https://chat.deepseek.com/a/chat/*
// @match        https://yuanbao.tencent.com/*
// @match        https://kimi.moonshot.cn/chat/*
// @match        https://www.wenxiaobai.com/chat/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528364/Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/528364/Prompt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置数据
    const STORAGE_KEY = 'promptManagerData';
    let prompts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let filteredPrompts = [...prompts]; // 用于存储搜索结果
    let currentEditIndex = null;
    let isMinimized = false;
    let lastFocusedElement = null; // 新增：记录最后聚焦的元素

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'prompt-manager';
    container.innerHTML = `
        <div class="pm-header">
            <h3>提示词管理</h3>
            <div class="pm-header-buttons">
                <button class="pm-icon-btn" id="pm-export">
                    <span class="pm-icon">⬇</span>
                </button>
                <button class="pm-icon-btn" id="pm-import">
                    <span class="pm-icon">⬆</span>
                </button>
                <button class="pm-icon-btn" id="pm-minimize">
                    <span class="pm-icon">-</span>
                </button>
                <button class="pm-icon-btn" id="pm-add">
                    <span class="pm-icon">+</span>
                </button>
            </div>
        </div>
        <div class="pm-list" id="pm-list"></div>
        <div class="pm-search-container">
            <input type="text" id="pm-search" placeholder="搜索提示词" class="pm-input">
        </div>

        <div class="pm-modal" id="pm-modal">
            <div class="pm-modal-content">
                <div class="pm-modal-header">
                    <h4>${currentEditIndex !== null ? '编辑提示词' : '新建提示词'}</h4>
                    <button class="pm-icon-btn" id="pm-close">
                        <span class="pm-icon">×</span>
                    </button>
                </div>
                <div class="pm-modal-body">
                    <input type="text" id="pm-title" placeholder="请输入标题" class="pm-input">
                    <textarea id="pm-content" placeholder="请输入内容" class="pm-textarea"></textarea>
                </div>
                <div class="pm-modal-footer">
                    <button class="pm-btn pm-primary" id="pm-save">保存</button>
                    <button class="pm-btn" id="pm-cancel">取消</button>
                </div>
            </div>
        </div>
        <input type="file" id="pm-import-file" style="display: none;" accept=".json">
    `;
    document.body.appendChild(container);

    // 主样式（完全保持原样）
    const style = document.createElement('style');
    style.textContent = `
        #prompt-manager {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            z-index: 9999;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            transition: all 0.3s ease;
        }

        #prompt-manager.minimized {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
        }

        #prompt-manager.minimized .pm-header {
            border-bottom: none;
            padding: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #prompt-manager.minimized .pm-header h3 {
            display: none;
        }

        #prompt-manager.minimized .pm-header-buttons {
            display: none;
        }

        #prompt-manager.minimized .pm-list,
        #prompt-manager.minimized .pm-modal,
        #prompt-manager.minimized .pm-search-container {
            display: none !important;
        }

        #prompt-manager.minimized .pm-header::before {
            content: 'AI';
            color: #1890ff;
            font-size: 16px;
            font-weight: bold;
        }

        .pm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;
        }

        .pm-header h3 {
            margin: 0;
            font-size: 16px;
            color: #1f1f1f;
        }

        .pm-header-buttons {
            display: flex;
            gap: 8px;
            align-items: center; /* 垂直居中 */
        }

        .pm-icon-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: #1890ff;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            color: #fff;
        }

        .pm-icon-btn:hover {
            background: #40a9ff;
        }

        .pm-icon-btn#pm-minimize {
            background: #blue;
            color: blue;
            border: 1px solid #1890ff;
            font-size: 14px;
            font-weight: bold;
        }

        .pm-icon {
            color: #fff;
            font-size: 20px;
            line-height: 1;
        }

        .pm-list {
            max-height: 150px; /* 固定高度为200px */
            overflow-y: auto;
            padding: 8px;
        }

        .pm-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin: 4px;
            background: #f8fafb;
            border-radius: 8px;
            transition: background 0.2s;
            cursor: pointer;
        }

        .pm-item:hover {
            background: #e6f4ff;
        }

        .pm-item-title {
            flex: 1;
            font-size: 14px;
            color: #434343;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .pm-item-actions {
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .pm-item:hover .pm-item-actions {
            opacity: 1;
        }

        .pm-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            justify-content: center;
            align-items: center;
            overflow: auto;
        }

        .pm-modal-content {
            background: #fff;
            width: 440px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            max-height: 90vh;
            overflow: auto;
        }

        .pm-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;
        }

        .pm-modal-header h4 {
            margin: 0;
            font-size: 16px;
            color: #1d1d1d;
        }

        .pm-modal-body {
            padding: 16px;
        }

        .pm-input, .pm-textarea {
            width: 90%;
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin: 8px 0;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .pm-input:focus, .pm-textarea:focus {
            border-color: #1890ff;
            outline: none;
        }

        .pm-textarea {
            height: 100px;
            resize: vertical;
        }

        .pm-modal-footer {
            padding: 16px;
            text-align: right;
            border-top: 1px solid #f0f0f0;
        }

        .pm-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }

        .pm-primary {
            background: #1890ff;
            color: #fff;
        }

        .pm-primary:hover {
            background: #40a9ff;
        }

        .pm-btn:not(.pm-primary) {
            background: #f5f5f5;
            color: #666;
            margin-left: 8px;
        }

        .pm-btn:not(.pm-primary):hover {
            background: #e0e0e0;
        }

        .pm-search-container {
            padding: 8px;
            border-top: 1px solid #f0f0f0;
        }
    `;
    document.head.appendChild(style);

    // 新增：焦点追踪逻辑
    document.addEventListener('focusin', (e) => {
        if (!container.contains(e.target)) {
            const target = e.target;
            if (target.matches('input, textarea, [contenteditable="true"]')) {
                lastFocusedElement = target;
            }
        }
    });

    // 渲染列表
    function renderList() {
        const list = document.getElementById('pm-list');
        list.innerHTML = ''; // 清空列表

        filteredPrompts.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('pm-item');
            listItem.innerHTML = `
                <span class="pm-item-title">${item.title}</span>
                <div class="pm-item-actions">
                    <button class="pm-icon-btn" style="background:#52c41a">
                        <span class="pm-icon">✎</span>
                    </button>
                    <button class="pm-icon-btn" style="background:#ff4d4f">
                        <span class="pm-icon">✕</span>
                    </button>
                </div>
            `;

            // 修改事件处理
            const [editBtn, deleteBtn] = listItem.querySelectorAll('.pm-icon-btn');

            // 阻止按钮获取焦点
            editBtn.addEventListener('mousedown', e => e.preventDefault());
            deleteBtn.addEventListener('mousedown', e => e.preventDefault());

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editPrompt(prompts.indexOf(item)); // 传递原始索引
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePrompt(prompts.indexOf(item)); // 传递原始索引
            });

            // 阻止列表项获取焦点
            listItem.addEventListener('mousedown', e => e.preventDefault());

            listItem.addEventListener('click', () => {
                if (lastFocusedElement) {
                    pasteToFocusedElement(item.content);
                } else {
                    alert('请先点击需要输入的位置');
                }
            });

            list.appendChild(listItem);
        });
    }

    // 修改粘贴函数
    function pasteToFocusedElement(text) {
        if (!lastFocusedElement) return;

        try {
            // 强制恢复焦点
            lastFocusedElement.focus();

            if (lastFocusedElement.isContentEditable) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                selection.collapseToEnd();
            } else {
                const elem = lastFocusedElement;
                const start = elem.selectionStart;
                elem.setRangeText(text, start, start, 'end');
                elem.selectionStart = elem.selectionEnd = start + text.length;
            }

            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            lastFocusedElement.dispatchEvent(event);
        } catch (error) {
            console.error('粘贴失败，使用剪贴板回退');
            navigator.clipboard.writeText(text);
            alert('已复制到剪贴板，请手动粘贴');
        }
    }

    // 编辑提示词
    window.editPrompt = function(index) {
        currentEditIndex = index;
        document.getElementById('pm-title').value = prompts[index].title;
        document.getElementById('pm-content').value = prompts[index].content;
        document.getElementById('pm-modal').style.display = 'flex';
    };

    // 删除提示词
    window.deletePrompt = function(index) {
        prompts.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        filterPrompts(); // 重新过滤列表
    };

    // 添加新提示词
    document.getElementById('pm-add').addEventListener('click', () => {
        currentEditIndex = null;
        document.getElementById('pm-title').value = '';
        document.getElementById('pm-content').value = '';
        document.getElementById('pm-modal').style.display = 'flex';
    });

    // 关闭模态框
    document.getElementById('pm-close').addEventListener('click', () => {
        document.getElementById('pm-modal').style.display = 'none';
    });

    // 取消操作
    document.getElementById('pm-cancel').addEventListener('click', () => {
        document.getElementById('pm-modal').style.display = 'none';
    });

    // 保存提示词
    document.getElementById('pm-save').addEventListener('click', () => {
        const title = document.getElementById('pm-title').value.trim();
        const content = document.getElementById('pm-content').value.trim();

        if (!title || !content) {
            alert('标题和内容不能为空');
            return;
        }

        if (currentEditIndex !== null) {
            prompts[currentEditIndex] = { title, content };
        } else {
            prompts.push({ title, content });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        filterPrompts(); // 刷新列表
        document.getElementById('pm-modal').style.display = 'none';
    });

    // 最小化功能
    document.getElementById('pm-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;
        container.classList.toggle('minimized', isMinimized);
    });

    container.addEventListener('click', () => {
        if (isMinimized) {
            isMinimized = false;
            container.classList.remove('minimized');
        }
    });

    // 导出功能
    document.getElementById('pm-export').addEventListener('click', () => {
        const json = JSON.stringify(prompts);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 导入功能
    document.getElementById('pm-import').addEventListener('click', () => {
        document.getElementById('pm-import-file').click();
    });

    document.getElementById('pm-import-file').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (Array.isArray(json)) {
                        prompts = json;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
                        filterPrompts(); // 重新渲染列表
                        alert('导入成功');
                    } else {
                        alert('文件格式不正确，应为JSON数组');
                    }
                } catch (error) {
                    alert('文件解析失败：' + error);
                }
            };
            reader.readAsText(file);
        }
    });

    // 搜索功能
    const searchInput = document.getElementById('pm-search');
    searchInput.addEventListener('input', () => {
        filterPrompts(searchInput.value.trim());
    });

    // 过滤提示词
    function filterPrompts(searchTerm = '') {
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredPrompts = prompts.filter(item =>
                item.title.toLowerCase().includes(lowerSearchTerm) ||
                item.content.toLowerCase().includes(lowerSearchTerm)
            );
        } else {
            filteredPrompts = [...prompts]; // 恢复到所有提示词
        }
        renderList();
    }

    // 初始化
    filterPrompts();
})();

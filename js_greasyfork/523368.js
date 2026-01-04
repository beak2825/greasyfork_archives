// ==UserScript==
// @name         给DeepSeek添加原生化的提示词管理功能
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  为 DeepSeek 添加提示词管理功能，点击直接进输入框。
// @author       独爱冰淇淋
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523368/%E7%BB%99DeepSeek%E6%B7%BB%E5%8A%A0%E5%8E%9F%E7%94%9F%E5%8C%96%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523368/%E7%BB%99DeepSeek%E6%B7%BB%E5%8A%A0%E5%8E%9F%E7%94%9F%E5%8C%96%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .prompt-list {
            position: fixed;
            background: #FFFFFF;
            border-radius: 12px;
            width: 640px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.08);
            padding: 0;
        }
        .prompt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            position: sticky;
            top: 0;
            background: #FFFFFF;
            z-index: 1;
        }
        .prompt-title {
            font-size: 16px;
            font-weight: 600;
            color: rgb(28, 28, 28);
            margin: 0;
        }
        .add-prompt-btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            background: rgb(77, 107, 254);
            color: #FFFFFF;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .add-prompt-btn:hover {
            background: rgb(56, 86, 233);
        }
        .prompt-list-content {
            padding: 12px 16px;
        }
        .prompt-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 4px 0;
            border: 1px solid transparent;
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
            gap: 6px;
        }
        .prompt-item:hover {
            background: rgb(248, 248, 249);
            border-color: rgba(0, 0, 0, 0.06);
        }
        .prompt-item-left {
            font-size: 13px;
            font-weight: 600;
            color: #1c1c1c;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-shrink: 0;
            position: relative;
            padding-right: 12px;
            line-height: 1.5;
            min-width: 60px;
        }
        .prompt-item-left::after {
            content: '';
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 14px;
            background-color: rgba(0, 0, 0, 0.1);
        }
        .prompt-item-content {
            flex: 1;
            min-width: 0;
            font-size: 13px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 4px;
            line-height: 1.5;
        }
        .prompt-actions {
            position: static;
            display: none;
            transform: none;
            margin-left: auto;
            padding-left: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .prompt-item:hover .prompt-actions {
            display: flex;
            opacity: 1;
        }
        .prompt-action-btn {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1c1c1c;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .prompt-action-btn:hover {
            opacity: 1;
        }
        .edit-prompt {
            color: #1c1c1c;
        }
        .edit-prompt:hover {
            color: #000000;
        }
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: start;
            justify-content: center;
            z-index: 1001;
            padding-top: 100px;
        }
        .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
            padding: 24px 32px;
        }
        .modal-header {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-right: 24px;
        }
        .modal-close {
            position: absolute;
            right: 16px;
            top: 16px;
            cursor: pointer;
            padding: 8px;
            background: none;
            border: none;
            color: #666;
            font-size: 18px;
            line-height: 1;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #1c1c1c;
        }
        .form-label span {
            color: #ff4d4f;
            margin-left: 4px;
        }
        .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.5;
            box-sizing: border-box;
            transition: all 0.2s;
        }
        .form-input:focus {
            outline: none;
            border-color: #4d6bfe;
            box-shadow: 0 0 0 2px rgba(77, 107, 254, 0.1);
        }
        .form-input::placeholder {
            color: #bfbfbf;
        }
        textarea.form-input {
            min-height: 120px;
            resize: vertical;
        }
        .modal-footer {
            margin-top: 24px;
            text-align: right;
        }
        .save-btn {
            background: rgb(79, 70, 229);
            color: white;
            border: none;
            padding: 8px 32px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }
        .save-btn:hover {
            background: rgb(67, 56, 202);
        }
        .delete-prompt {
            background-color: #dc2626;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .delete-prompt:hover {
            background-color: #b91c1c;
            color: white;
        }
        .confirm-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1003;
            width: 300px;
        }
        .confirm-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1002;
        }
        .confirm-dialog-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
            color: #1c1c1c;
        }
        .confirm-dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        }
        .confirm-dialog-button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .confirm-dialog-cancel {
            background: #f3f4f6;
            color: #374151;
        }
        .confirm-dialog-cancel:hover {
            background: #e5e7eb;
        }
        .confirm-dialog-confirm {
            background: #dc2626;
            color: white;
        }
        .confirm-dialog-confirm:hover {
            background: #b91c1c;
        }
        .prompt-action-btn {
            padding: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #666;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .prompt-action-btn:hover {
            background: rgba(0, 0, 0, 0.06);
            color: #333;
        }
        .edit-prompt svg {
            width: 16px;
            height: 16px;
        }
        .prompt-header-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .import-export-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border: none;
            background: transparent;
            color: #666;
            cursor: pointer;
            border-radius: 4px;
        }
        .import-export-btn:hover {
            background: rgba(0, 0, 0, 0.06);
            color: #333;
        }
        .import-export-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            padding: 4px;
            z-index: 1001;
        }
        .import-export-menu button {
            display: block;
            width: 100%;
            padding: 8px 16px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            color: #1c1c1c;
            font-size: 14px;
        }
        .import-export-menu button:hover {
            background: rgba(0, 0, 0, 0.06);
        }
    `);

    function createElements() {
        // 找到按钮容器
        const buttonContainer = document.querySelector('.ec4f5d61');
        if (!buttonContainer) {
            console.log('Button container not found');
            return;
        }

        // 创建按钮
        const promptButtonWrapper = document.createElement('div');
        promptButtonWrapper.setAttribute('role', 'button');
        promptButtonWrapper.className = 'ds-button ds-button--rect ds-button--m prompt-saver-button';
        promptButtonWrapper.style.cssText = `
            background-color: #FFFFFF;
            padding: 4px 6px;
            height: 28px;
            border-radius: 14px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 1.5px;
            font-size: 12px;
            line-height: 1;
            white-space: nowrap;
            transition: all 0.2s;
            box-sizing: border-box;
            margin: 0 12px 0 4px;
        `;

        // 添加鼠标悬停效果
        promptButtonWrapper.addEventListener('mouseenter', () => {
            if (promptList.style.display === 'none') {  // 只在列表隐藏时改变悬停颜色
                promptButtonWrapper.style.backgroundColor = 'rgb(224, 228, 237)';
            }
        });
        promptButtonWrapper.addEventListener('mouseleave', () => {
            if (promptList.style.display === 'none') {  // 只在列表隐藏时恢复背景色
                promptButtonWrapper.style.backgroundColor = '#FFFFFF';
            }
        });

        // 创建图标
        const iconSpan = document.createElement('span');
        iconSpan.className = 'ds-button__icon';
        iconSpan.style.cssText = `
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: #1c1c1c;
            margin-right: -1px;
        `;

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('width', '18');
        iconSvg.setAttribute('height', '18');
        iconSvg.setAttribute('viewBox', '0 0 16 16');
        iconSvg.setAttribute('fill', 'none');
        iconSvg.style.cssText = `
            color: inherit;
            width: 100%;
            height: 100%;
        `;
        iconSvg.innerHTML = `
            <path d="M8 1.5L9.79611 5.11475L13.7063 5.68237L10.8532 8.46525L11.5922 12.3676L8 10.52L4.40785 12.3676L5.14683 8.46525L2.29366 5.68237L6.20389 5.11475L8 1.5Z"
                  stroke="currentColor"
                  fill="none"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
        `;
        iconSpan.appendChild(iconSvg);

        // 创建按钮文本
        const buttonText = document.createElement('span');
        buttonText.className = 'ad0c98fd';
        buttonText.style.cssText = `
            font-size: 12px;
            line-height: 1;
            color: rgb(76, 76, 76);
        `;
        buttonText.textContent = '提示词库';

        promptButtonWrapper.appendChild(iconSpan);
        promptButtonWrapper.appendChild(buttonText);

        // 创建一个包装容器
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.cssText = `
            display: inline-flex;
            align-items: center;
            position: relative;
        `;
        wrapperDiv.appendChild(promptButtonWrapper);

        // 将按钮插入到容器中的第二个位置
        const buttons = buttonContainer.children;
        if (buttons.length >= 1) {
            buttonContainer.insertBefore(wrapperDiv, buttons[1]);
        } else {
            buttonContainer.appendChild(wrapperDiv);
        }

        // 创建提示词列表容器
        const promptList = document.createElement('div');
        promptList.className = 'prompt-list';
        promptList.style.cssText = `
            position: fixed;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            padding: 8px;
        `;

        // 添加样式到 head
        const style = document.createElement('style');
        style.textContent = `
            .prompt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 8px;
                margin-bottom: 4px;
            }
            .prompt-title {
                font-size: 14px;
                font-weight: 500;
                margin: 0;
            }
            .add-prompt-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border: none;
                background: rgb(79, 70, 229);
                color: white;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
            }
            .prompt-item {
                display: flex;
                align-items: flex-start;
                padding: 8px 12px;
                border-radius: 6px;
                margin: 4px 0;
                border: 1px solid transparent;
                transition: all 0.2s;
                cursor: pointer;
                position: relative;
                gap: 6px;
            }
            .prompt-item:hover {
                background: rgb(248, 248, 249);
                border-color: rgba(0, 0, 0, 0.06);
            }
            .prompt-item-left {
                font-size: 13px;
                font-weight: 600;
                color: #1c1c1c;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex-shrink: 0;
                position: relative;
                padding-right: 12px;
            }
            .prompt-item-left::after {
                content: '';
                position: absolute;
                right: 6px;
                top: 50%;
                transform: translateY(-50%);
                width: 1px;
                height: 14px;
                background-color: rgba(0, 0, 0, 0.1);
            }
            .prompt-item-content {
                flex: 1;
                min-width: 0;
                font-size: 13px;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 4px;
                line-height: 1.5;
            }
            .prompt-actions {
                position: static;
                display: none;
                transform: none;
                margin-left: auto;
                padding-left: 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            .prompt-item:hover .prompt-actions {
                display: flex;
                opacity: 1;
            }
            .delete-prompt {
                background-color: #dc2626;
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
                font-size: 12px;
                line-height: 1.5;
                border: none;
                cursor: pointer;
                white-space: nowrap;
            }
            .delete-prompt:hover {
                background-color: #b91c1c;
                color: white;
            }
            .confirm-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1003;
                width: 300px;
            }
            .confirm-dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1002;
            }
            .confirm-dialog-title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 12px;
                color: #1c1c1c;
            }
            .confirm-dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
            .confirm-dialog-button {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .confirm-dialog-cancel {
                background: #f3f4f6;
                color: #374151;
            }
            .confirm-dialog-cancel:hover {
                background: #e5e7eb;
            }
            .confirm-dialog-confirm {
                background: #dc2626;
                color: white;
            }
            .confirm-dialog-confirm:hover {
                background: #b91c1c;
            }
        `;
        document.head.appendChild(style);

        wrapperDiv.appendChild(promptList);

        // 点击按钮时的处理
        promptButtonWrapper.addEventListener('click', () => {
            const isVisible = promptList.style.display === 'none';
            if (isVisible) {
                promptList.style.display = 'block';
                updatePromptList();  // 更新列表内容
                updatePromptListPosition();  // 计算位置
                promptButtonWrapper.style.backgroundColor = 'rgb(195,218,248)';
                buttonText.style.color = 'rgb(77,107,254)';
                iconSpan.style.color = 'rgb(77,107,254)';
            } else {
                promptList.style.display = 'none';
                promptButtonWrapper.style.backgroundColor = '#FFFFFF';
                buttonText.style.color = 'rgb(76, 76, 76)';
                iconSpan.style.color = '#1c1c1c';
            }
        });

        // 点击页面其他地方时也要恢复颜色
        document.addEventListener('click', (e) => {
            const promptButtonWrapper = document.querySelector('.prompt-saver-button');
            const promptList = document.querySelector('.prompt-list');

            // 如果点击的是提示词列表内部或按钮本身，不关闭列表
            if (promptButtonWrapper.contains(e.target) ||
                (promptList && promptList.contains(e.target))) {
                return;
            }

            // 其他区域的点击才关闭列表
            if (promptList) {
                promptList.style.display = 'none';
                promptButtonWrapper.style.backgroundColor = '#FFFFFF';
                promptButtonWrapper.querySelector('.ad0c98fd').style.color = 'rgb(76, 76, 76)';
                promptButtonWrapper.querySelector('.ds-button__icon').style.color = '#1c1c1c';
            }
        });
    }

    function updatePromptList() {
        const promptList = document.querySelector('.prompt-list');
        const savedPrompts = GM_getValue('savedPrompts', []);

        // 更新 HTML 内容
        promptList.innerHTML = `
            <div class="prompt-header">
                <h3 class="prompt-title">我创建的</h3>
                <div class="prompt-header-buttons">
                    <button class="import-export-btn" title="导入/导出">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v12m0 0l-4-4m4 4l4-4M8 17H6a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="add-prompt-btn">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 2.33334V11.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M11.6667 7L2.33334 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        创建指令
                    </button>
                </div>
            </div>
            <div class="prompt-list-content">
                ${savedPrompts.map((prompt, index) => `
                    <div class="prompt-item" data-content="${encodeURIComponent(prompt.content)}">
                        <div class="prompt-item-left">${prompt.title}</div>
                        <div class="prompt-item-content">${prompt.content}</div>
                        <div class="prompt-actions">
                            <button class="prompt-action-btn edit-prompt" data-index="${index}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // 为每个提示词项添加点击事件
        const promptItems = promptList.querySelectorAll('.prompt-item');
        promptItems.forEach(item => {
            item.addEventListener('click', async function(e) {
                // 如果点击的是编辑按钮，不执行填充操作
                if (e.target.closest('.edit-prompt')) {
                    return;
                }

                const content = decodeURIComponent(this.dataset.content);
                try {
                    // 找到输入框并填充内容
                    const textArea = document.querySelector('#chat-input');
                    if (!textArea) {
                        throw new Error('找不到输入框');
                    }

                    // 先聚焦输入框
                    textArea.focus();
                    // 选中所有内容并删除
                    document.execCommand('selectAll', false, null);
                    document.execCommand('delete', false, null);
                    // 插入新内容
                    document.execCommand('insertText', false, content);

                    // 关闭提示词列表并恢复按钮样式
                    promptList.style.display = 'none';
                    const promptButton = document.querySelector('.prompt-saver-button');
                    if (promptButton) {
                        promptButton.style.backgroundColor = '#FFFFFF';
                        promptButton.querySelector('.ad0c98fd').style.color = 'rgb(76, 76, 76)';
                        promptButton.querySelector('.ds-button__icon').style.color = '#1c1c1c';
                    }
                } catch (err) {
                    console.error('Failed to fill prompt:', err);
                    alert('填充失败，请重试');
                }
            });
        });

        // 为编辑按钮添加事件监听
        promptList.querySelectorAll('.edit-prompt').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                showEditPromptModal(savedPrompts[index], index);
            });
        });

        // 为创建指令按钮添加点击事件
        const addButton = promptList.querySelector('.add-prompt-btn');
        addButton?.addEventListener('click', () => showEditPromptModal());

        setupImportExport();
    }

    function showEditPromptModal(prompt = null, index = null) {
        const isEditing = prompt !== null;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="color: #1c1c1c;">
                    ${isEditing ? '编辑指令' : '创建指令'}
                    ${isEditing ? `
                        <button class="delete-prompt" style="position: absolute; right: 50px; top: 24px;">
                            删除
                        </button>
                    ` : ''}
                    <button class="modal-close">✕</button>
                </div>
                <div class="form-group">
                    <label class="form-label">指令标题<span>*</span></label>
                    <input type="text" class="form-input" placeholder="请输入指令标题" value="${isEditing ? prompt.title : ''}" style="padding: 8px 12px;">
                </div>
                <div class="form-group">
                    <label class="form-label">指令内容<span>*</span></label>
                    <textarea class="form-input" placeholder="请输入指令内容" style="padding: 12px 16px;">${isEditing ? prompt.content : ''}</textarea>
                </div>
                <div class="modal-footer">
                    <button class="save-btn">${isEditing ? '保存修改' : '保存'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 如果是新建且有当前输入框的内容，自动填充到内容框
        if (!isEditing) {
            const textArea = document.querySelector('[role="textbox"]');
            if (textArea && textArea.textContent.trim()) {
                modal.querySelector('textarea').value = textArea.textContent.trim();
            }
        }

        // 删除按钮事件
        if (isEditing) {
            const deleteBtn = modal.querySelector('.delete-prompt');
            deleteBtn.onclick = () => {
                const overlay = document.createElement('div');
                overlay.className = 'confirm-dialog-overlay';
                overlay.innerHTML = `
                    <div class="confirm-dialog">
                        <div class="confirm-dialog-title">确认删除</div>
                        <div>确定要删除这条提示词吗？此操作无法撤销。</div>
                        <div class="confirm-dialog-buttons">
                            <button class="confirm-dialog-button confirm-dialog-cancel">取消</button>
                            <button class="confirm-dialog-button confirm-dialog-confirm">删除</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);

                overlay.querySelector('.confirm-dialog-cancel').onclick = () => {
                    document.body.removeChild(overlay);
                };

                overlay.querySelector('.confirm-dialog-confirm').onclick = () => {
                    const savedPrompts = GM_getValue('savedPrompts', []);
                    savedPrompts.splice(index, 1);
                    GM_setValue('savedPrompts', savedPrompts);
                    document.body.removeChild(modal);
                    document.body.removeChild(overlay);
                    updatePromptList();
                };

                overlay.onclick = (e) => {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                    }
                };
            };
        }

        // 关闭按钮事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };

        // 点击遮罩层关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };

        // 保存按钮事件
        const saveBtn = modal.querySelector('.save-btn');
        saveBtn.onclick = () => {
            const title = modal.querySelector('input').value.trim();
            const content = modal.querySelector('textarea').value.trim();

            if (!title || !content) {
                alert('请填写完整信息');
                return;
            }

            const savedPrompts = GM_getValue('savedPrompts', []);
            if (isEditing) {
                savedPrompts[index] = { title, content };
            } else {
                savedPrompts.push({ title, content });
            }
            GM_setValue('savedPrompts', savedPrompts);

            document.body.removeChild(modal);
            updatePromptList();
        };
    }

    // 优化弹出框定位逻辑
    function updatePromptListPosition() {
        const promptList = document.querySelector('.prompt-list');
        const button = document.querySelector('.prompt-saver-button');
        if (!promptList || !button) return;

        const { top, bottom, left } = button.getBoundingClientRect();
        const promptListHeight = promptList.getBoundingClientRect().height;

        // 判断是否在主界面
        const isMainPage = window.location.pathname === '/';
        
        if (isMainPage) {
            // 主界面：显示在输入框上方中间位置
            const inputArea = document.querySelector('[aria-label="给 DeepSeek 发送消息"]');
            if (inputArea) {
                const inputRect = inputArea.getBoundingClientRect();
                const topPosition = inputRect.top - promptListHeight - 20;
                const leftPosition = inputRect.left + (inputRect.width - promptList.offsetWidth) / 2;
                
                promptList.style.position = 'fixed';
                promptList.style.top = `${topPosition}px`;
                promptList.style.left = `${leftPosition}px`;
            }
        } else {
            // chat页面：显示在按钮上方
            const topPosition = top < promptListHeight + 10 ? bottom + 10 : top - promptListHeight - 10;
            
            promptList.style.position = 'fixed';
            promptList.style.left = `${left}px`;
            promptList.style.top = `${topPosition}px`;
        }

        // 确保列表不会超出视口边界
        const promptListRect = promptList.getBoundingClientRect();
        if (promptListRect.right > window.innerWidth) {
            promptList.style.left = `${window.innerWidth - promptList.offsetWidth - 10}px`;
        }
        if (promptListRect.left < 0) {
            promptList.style.left = '10px';
        }
    }

    // 使用防抖优化窗口大小变化监听
    const debounce = (fn, delay) => {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    window.addEventListener('resize', debounce(() => {
        if (promptList.style.display !== 'none') {
            updatePromptListPosition();
        }
    }, 100));

    // 优化 MutationObserver
    const observer = new MutationObserver((mutations, obs) => {
        const buttonContainer = document.querySelector('.ec4f5d61');
        if (buttonContainer && !document.querySelector('.prompt-saver-button')) {
            createElements();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    createElements();

    // 添加导入导出功能
    function setupImportExport() {
        const importExportBtn = document.querySelector('.import-export-btn');
        if (!importExportBtn) return;

        importExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // 移除已存在的菜单
            const existingMenu = document.querySelector('.import-export-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            // 创建菜单
            const menu = document.createElement('div');
            menu.className = 'import-export-menu';
            menu.innerHTML = `
                <button class="export-btn">导出提示词</button>
                <button class="import-btn">导入提示词</button>
            `;

            // 定位菜单
            const btnRect = importExportBtn.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = `${btnRect.bottom + 4}px`;
            menu.style.right = `${window.innerWidth - btnRect.right}px`;

            document.body.appendChild(menu);

            // 导出功能
            menu.querySelector('.export-btn').addEventListener('click', () => {
                const savedPrompts = GM_getValue('savedPrompts', []);
                const blob = new Blob([JSON.stringify(savedPrompts, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'deepseek-prompts.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                menu.remove();
            });

            // 导入功能
            menu.querySelector('.import-btn').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const prompts = JSON.parse(e.target.result);
                                if (Array.isArray(prompts)) {
                                    GM_setValue('savedPrompts', prompts);
                                    updatePromptList();
                                    alert('导入成功！');
                                } else {
                                    alert('文件格式错误！');
                                }
                            } catch (err) {
                                alert('导入失败，请确保文件格式正确！');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
                menu.remove();
            });

            // 点击其他地方关闭菜单
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !importExportBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
    }
})();
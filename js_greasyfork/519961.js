// ==UserScript==
// @name         网页文本修改器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  允许通过右键菜单修改网页上选中的文本
// @author       BIG-huang44
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/519961/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/519961/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .text-edit-popup {
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        .text-edit-textarea {
            min-width: 200px;
            min-height: 100px;
            margin-bottom: 10px;
        }
        .text-edit-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .mobile-edit-button {
            position: fixed;
            background: #4CAF50;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            touch-action: none;
        }
    `);

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 创建编辑弹窗
    function createEditPopup(x, y, originalText, targetElement) {
        const popup = document.createElement('div');
        popup.className = 'text-edit-popup';
        
        // 移动端适配：确保弹窗在可视区域内
        if (isMobile) {
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.width = '90%';
            popup.style.maxWidth = '400px';
        } else {
            popup.style.left = x + 'px';
            popup.style.top = y + 'px';
        }

        const textarea = document.createElement('textarea');
        textarea.className = 'text-edit-textarea';
        textarea.value = originalText;
        if (isMobile) {
            textarea.style.width = '100%';
        }
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'text-edit-buttons';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.onclick = () => {
            targetElement.textContent = textarea.value;
            document.body.removeChild(popup);
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.onclick = () => {
            document.body.removeChild(popup);
        };

        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        popup.appendChild(textarea);
        popup.appendChild(buttonsDiv);

        return popup;
    }

    // 处理选中文本的函数
    function handleSelectedText() {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const targetElement = container.nodeType === 3 ? container.parentNode : container;
            
            const rect = range.getBoundingClientRect();
            const x = rect.left + window.scrollX;
            const y = rect.bottom + window.scrollY;

            const popup = createEditPopup(x, y, selection.toString(), targetElement);
            document.body.appendChild(popup);
            return true;
        }
        return false;
    }

    // 为移动端添加编辑按钮
    function createMobileEditButton(x, y) {
        const button = document.createElement('button');
        button.className = 'mobile-edit-button';
        button.textContent = '编辑文本';
        button.style.left = x + 'px';
        button.style.top = y + 'px';
        
        button.onclick = () => {
            handleSelectedText();
            document.body.removeChild(button);
        };
        
        document.body.appendChild(button);
        
        // 3秒后自动移除按钮
        setTimeout(() => {
            if (button.parentNode) {
                document.body.removeChild(button);
            }
        }, 3000);
    }

    // 注册 Tampermonkey 菜单命令
    GM_registerMenuCommand("修改选中文本", function() {
        if (!handleSelectedText()) {
            GM_notification({
                text: "请先选择要修改的文本",
                timeout: 2000
            });
        }
    });

    // 添加快捷键支持
    document.addEventListener('keydown', function(e) {
        // 支持 Windows(Ctrl+Q) 和 Mac(Command+Q)
        if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
            e.preventDefault();
            handleSelectedText();
        }
    });
})(); 
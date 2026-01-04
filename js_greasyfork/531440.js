// ==UserScript==
// @name         MWI Chat Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为MWI聊天框添加emoji表情选择功能
// @author       shykai,Tare
// @match        https://www.milkywayidle.com/*
// @grant        none
// @require      https://unpkg.com/@joeattardi/emoji-button@3.1.1/dist/index.js
// @downloadURL https://update.greasyfork.org/scripts/531440/MWI%20Chat%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531440/MWI%20Chat%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用MutationObserver监视DOM变化
    function startObserving() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver(function(mutationsList, observer) {
            // 检查聊天输入框是否存在
            const chatInput = document.querySelector('.Chat_chatInput__16dhX');
            const emojiButton = document.querySelector('#inputEmoji');
            if (chatInput && !emojiButton) {
                initEmojiButton(chatInput);
                console.log('聊天输入框已找到并添加了emoji按钮');
            }
        });

        // 开始观察
        observer.observe(targetNode, config);
    }

    // 页面加载完成后开始监视
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

    function initEmojiButton(chatInput) {
        // 创建emoji按钮
        const emojiButton = document.createElement('button');
        emojiButton.id = 'inputEmoji';
        emojiButton.innerHTML = '😊';
        emojiButton.style.background = 'transparent';
        emojiButton.style.border = 'none';
        emojiButton.style.fontSize = '20px';
        emojiButton.style.cursor = 'pointer';
        emojiButton.style.zIndex = '10';
        emojiButton.title = '插入表情';

        // 将按钮添加到聊天输入框容器中
        const chatInputContainer = document.querySelector('.Chat_chatInputContainer__2euR8');
        if (chatInputContainer) {
            chatInputContainer.style.position = 'relative';
            chatInputContainer.appendChild(emojiButton);

            // 保存原始的value setter
            const originalSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

            // 定义新的属性描述符
            Object.defineProperty(chatInput, 'value', {
                set: function(newValue) {
                    // 调用原始setter
                    originalSetter.call(this, newValue);
                },
                enumerable: true,
                configurable: true
            });

            // 初始化EmojiButton
            const picker = new EmojiButton({
                position: 'top',
                autoHide: false,
            });

            // 监听emoji选择事件
            picker.on('emoji', selection => {
                // 获取当前光标位置
                const cursorPos = chatInput.selectionStart;
                const text = chatInput.value;

                // 在光标位置插入emoji
                const newText = text.substring(0, cursorPos) + selection + text.substring(cursorPos);

                // 标记为我们的设置操作
                chatInput.value = newText;

                // 将光标移动到插入的emoji之后
                chatInput.selectionStart = cursorPos + selection.length;
                chatInput.selectionEnd = cursorPos + selection.length;
                chatInput.focus();

                // 触发input事件，确保聊天应用能够检测到输入变化
                const inputEvent = new Event('input', { bubbles: true });
                chatInput.dispatchEvent(inputEvent);
            });

            // 点击按钮时显示emoji选择器
            emojiButton.addEventListener('click', function(event) {
                event.preventDefault();
                picker.togglePicker(emojiButton);
            });
        }
    }
})();
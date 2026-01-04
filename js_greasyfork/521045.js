// ==UserScript==
// @name         Moonshot AI Chat Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个优雅的AI聊天助手
// @author       Dch
// @match        *://km.sankuai.com/collabpage/2335976704
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521045/Moonshot%20AI%20Chat%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/521045/Moonshot%20AI%20Chat%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式
    GM_addStyle(`
        .chat-bot-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
        }

        .chat-bot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #252525;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-bot-button:hover {
            transform: scale(1.1);
        }

        .chat-window {
            position: fixed;
            right: 20px;
            bottom: 90px;
            width: 350px;
            height: 500px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-window.hidden {
            display: none;
        }

        .chat-header {
            padding: 16px;
            background: #409EFF;
            color: #fff;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .message {
            margin-bottom: 12px;
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 12px;
        }

        .user-message {
            margin-left: auto;
            background: #409EFF;
            color: #fff;
            border-radius: 12px 12px 0 12px;
        }

        .bot-message {
            margin-right: auto;
            background: #f4f4f5;
            border-radius: 12px 12px 12px 0;
        }

        .chat-input {
            padding: 16px;
            border-top: 1px solid #eee;
            display: flex;
        }

        .chat-input input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            margin-right: 8px;
            outline: none;
        }

        .chat-input button {
            padding: 8px 16px;
            background: #409EFF;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .chat-input button:disabled {
            background: #a0cfff;
            cursor: not-allowed;
        }
    `);

    // 创建HTML结构
    const chatBotHTML = `
        <div class="chat-bot-container">
            <div class="chat-bot-button" id="chatBotButton">
                <img style="width: 60px;" src="https://p0.meituan.net/travelcube/aba410aa33b07fada5eeb4c99718cac929737.png" />
            </div>

            <div class="chat-window hidden" id="chatWindow">
                <div class="chat-header">
                    <h3>AI助手</h3>
                </div>

                <div class="chat-messages" id="chatMessages">
                </div>

                <div class="chat-input">
                    <input
                        id="chatInput"
                        placeholder="请输入消息..."
                        type="text"
                    >
                    <button id="sendButton">发送</button>
                </div>
            </div>
        </div>
    `;

    // 添加到页面
    const container = document.createElement('div');
    container.innerHTML = chatBotHTML;
    document.body.appendChild(container);

    // 获取DOM元素
    const chatBotButton = document.getElementById('chatBotButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // 消息列表
    let messages = [];

    // 切换聊天窗口
    chatBotButton.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    // 添加消息到界面
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送消息
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || sendButton.disabled) return;

        // 禁用发送按钮
        sendButton.disabled = true;
        sendButton.textContent = '发送中...';

        // 添加用户消息
        addMessage(message, true);
        chatInput.value = '';

        try {
            // 这里替换为实际的 Moonshot Chat API 调用
            const response = await new Promise(resolve =>
                setTimeout(() => resolve("这是一个模拟的AI回复消息"), 1000)
            );

            // 添加机器人回复
            addMessage(response, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，我遇到了一些问题，请稍后再试。', false);
        } finally {
            // 恢复发送按钮
            sendButton.disabled = false;
            sendButton.textContent = '发送';
        }
    }

    // 绑定发送事件
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
})();
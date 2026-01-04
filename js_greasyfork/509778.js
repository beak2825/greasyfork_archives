// ==UserScript==
// @name         智能问答学习助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  考试学习必备，在任意网页嵌入一个聊天交互界面，用户可以通过问问题然后得到回复，支持拖拽和悬浮小球展开，支持Tab切换和API Key加密显示
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.bigmodel.cn
// @author       不会使用使用过程遇到问题请联系q:2430486030  如果获取apikey:https://sa6z03i7sec.feishu.cn/docx/FemzdZ1mnosEgVxRVNocwKEnneY?from=from_copylink
// @downloadURL https://update.greasyfork.org/scripts/509778/%E6%99%BA%E8%83%BD%E9%97%AE%E7%AD%94%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/509778/%E6%99%BA%E8%83%BD%E9%97%AE%E7%AD%94%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    let apiKey = GM_getValue('apiKey', ''); // 从油猴存储获取 API Key

    // 创建悬浮小球
    function createFloatingBall() {
        const ball = document.createElement('div');
        ball.id = 'floating-ball';
        ball.style.position = 'fixed';
        ball.style.bottom = '20px';
        ball.style.right = '20px';
        ball.style.width = '50px';
        ball.style.height = '50px';
        ball.style.backgroundColor = '#007bff';
        ball.style.borderRadius = '50%';
        ball.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        ball.style.zIndex = '2147483647';
        ball.style.cursor = 'pointer';
        ball.style.display = 'flex';
        ball.style.alignItems = 'center';
        ball.style.justifyContent = 'center';
        ball.style.color = 'white';
        ball.style.fontSize = '24px';
        ball.textContent = '+';
        document.body.appendChild(ball);
        makeDraggable(ball);
        ball.onclick = toggleChatContainer;
        return ball;
    }

    // 创建聊天界面容器
    function createChatContainer() {
        const container = document.createElement('div');
        container.id = 'chat-container';
        container.style.position = 'fixed';
        container.style.bottom = '80px';
        container.style.right = '20px';
        container.style.width = '300px';
        container.style.height = '400px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        container.style.zIndex = '2147483647';
        container.style.display = 'none';
        container.style.flexDirection = 'column';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        return container;
    }

    // 切换聊天界面显示状态
    function toggleChatContainer() {
        const container = document.getElementById('chat-container');
        if (container.style.display === 'none') {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    // 创建聊天界面
    function createChatInterface(container) {
        const tabHeader = document.createElement('div');
        tabHeader.style.display = 'flex';
        tabHeader.style.borderBottom = '1px solid #ccc';

        const chatTab = document.createElement('div');
        chatTab.textContent = '聊天';
        chatTab.style.flex = '1';
        chatTab.style.padding = '10px';
        chatTab.style.cursor = 'pointer';
        chatTab.style.textAlign = 'center';
        chatTab.style.backgroundColor = '#007bff';
        chatTab.style.color = 'white';
        chatTab.onclick = () => switchTab('chat');
        tabHeader.appendChild(chatTab);

        const aboutTab = document.createElement('div');
        aboutTab.textContent = '关于';
        aboutTab.style.flex = '1';
        aboutTab.style.padding = '10px';
        aboutTab.style.cursor = 'pointer';
        aboutTab.style.textAlign = 'center';
        aboutTab.style.backgroundColor = '#f1f1f1';
        aboutTab.style.color = 'black';
        aboutTab.onclick = () => switchTab('about');
        tabHeader.appendChild(aboutTab);

        container.appendChild(tabHeader);

        const chatContent = document.createElement('div');
        chatContent.id = 'chat-content';
        chatContent.style.flex = '1';
        chatContent.style.padding = '10px';
        chatContent.style.overflowY = 'auto';
        chatContent.style.backgroundColor = '#f9f9f9';
        container.appendChild(chatContent);

        const aboutContent = document.createElement('div');
        aboutContent.id = 'about-content';
        aboutContent.style.flex = '1';
        aboutContent.style.padding = '10px';
        aboutContent.style.overflowY = 'auto';
        aboutContent.style.backgroundColor = '#f9f9f9';
        aboutContent.style.display = 'none';
        container.appendChild(aboutContent);

        createChatContent(chatContent);
        createAboutContent(aboutContent);
    }

    // 切换Tab
    function switchTab(tab) {
        const chatTab = document.querySelector('#chat-container div:nth-child(1) div:nth-child(1)');
        const aboutTab = document.querySelector('#chat-container div:nth-child(1) div:nth-child(2)');
        const chatContent = document.getElementById('chat-content');
        const aboutContent = document.getElementById('about-content');

        if (tab === 'chat') {
            chatTab.style.backgroundColor = '#007bff';
            chatTab.style.color = 'white';
            aboutTab.style.backgroundColor = '#f1f1f1';
            aboutTab.style.color = 'black';
            chatContent.style.display = 'block';
            aboutContent.style.display = 'none';
        } else {
            chatTab.style.backgroundColor = '#f1f1f1';
            chatTab.style.color = 'black';
            aboutTab.style.backgroundColor = '#007bff';
            aboutTab.style.color = 'white';
            chatContent.style.display = 'none';
            aboutContent.style.display = 'block';
        }
    }

    // 创建聊天内容
    function createChatContent(container) {
        const chatBody = document.createElement('div');
        chatBody.id = 'chat-body';
        chatBody.style.flex = '1';
        chatBody.style.padding = '10px';
        chatBody.style.overflowY = 'auto';
        chatBody.style.backgroundColor = '#f9f9f9';
        container.appendChild(chatBody);

        const chatFooter = document.createElement('div');
        chatFooter.style.display = 'flex';
        chatFooter.style.padding = '10px';
        chatFooter.style.borderTop = '1px solid #ccc';
        container.appendChild(chatFooter);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'chat-input';
        input.style.flex = '1';
        input.style.padding = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        chatFooter.appendChild(input);

        const sendButton = document.createElement('button');
        sendButton.textContent = '发送';
        sendButton.style.marginLeft = '10px';
        sendButton.style.padding = '10px';
        sendButton.style.border = 'none';
        sendButton.style.borderRadius = '5px';
        sendButton.style.backgroundColor = '#007bff';
        sendButton.style.color = 'white';
        sendButton.style.cursor = 'pointer';
        sendButton.onclick = sendMessage;
        chatFooter.appendChild(sendButton);
    }

    // 创建关于内容
    function createAboutContent(container) {
        const helpText = document.createElement('div');
        helpText.textContent = '帮助文档：在聊天界面中输入问题并点击发送按钮，您会看到回复显示在聊天界面中。';
        helpText.style.marginBottom = '10px';
        container.appendChild(helpText);

        const apiKeyContainer = document.createElement('div');
        apiKeyContainer.style.display = 'flex';
        apiKeyContainer.style.alignItems = 'center';

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.id = 'api-key-input';
        apiKeyInput.placeholder = '输入API Key';
        apiKeyInput.style.flex = '1';
        apiKeyInput.style.padding = '10px';
        apiKeyInput.style.border = '1px solid #ccc';
        apiKeyInput.style.borderRadius = '5px';
        apiKeyInput.value = apiKey;
        apiKeyInput.onchange = function() {
            apiKey = apiKeyInput.value;
            GM_setValue('apiKey', apiKey); // 保存 API Key 到油猴存储
            apiKeyInput.type = 'password'; // 将输入框类型改为密码
        };
        apiKeyContainer.appendChild(apiKeyInput);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '👁️';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.padding = '10px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.backgroundColor = '#007bff';
        toggleButton.style.color = 'white';
        toggleButton.style.cursor = 'pointer';
        toggleButton.onclick = function() {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
            } else {
                apiKeyInput.type = 'password';
            }
        };
        apiKeyContainer.appendChild(toggleButton);

        container.appendChild(apiKeyContainer);

        if (apiKey) {
            apiKeyInput.type = 'password'; // 如果已有 API Key，将输入框类型改为密码
        }

        // const contactImage = document.createElement('img');
        // contactImage.src = 'data:image/jpeg;base64,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';
        // contactImage.alt = '联系方式';
        // contactImage.style.width = '100%';
        // contactImage.style.marginTop = '10px';
        // container.appendChild(contactImage);
    }

    // 发送消息
    function sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (message) {
            appendMessage('user', message);
            input.value = '';
            getReply(message);
        }
    }

    // 获取回复
    function getReply(message) {
        const chatBody = document.getElementById('chat-body');
        const loadingMessage = appendMessage('bot', '正在思考...');

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'glm-4',
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            }),
            onload: function(response) {
                console.log('API response:', response.responseText); // 调试信息
                const data = JSON.parse(response.responseText);
                if (data && data.choices && data.choices.length > 0) {
                    loadingMessage.textContent = data.choices[0].message.content;
                } else {
                    loadingMessage.textContent = '抱歉，我无法理解您的问题。';
                }
            },
            onerror: function() {
                loadingMessage.textContent = '请求失败，请稍后再试。';
            }
        });
    }

    // 添加消息到聊天界面
    function appendMessage(role, content) {
        const chatBody = document.getElementById('chat-body');
        const message = document.createElement('div');
        message.style.marginBottom = '10px';
        message.style.padding = '10px';
        message.style.borderRadius = '5px';
        message.style.backgroundColor = role === 'user' ? '#007bff' : '#f1f1f1';
        message.style.color = role === 'user' ? 'white' : 'black';
        message.style.alignSelf = role === 'user' ? 'flex-end' : 'flex-start';
        message.textContent = content;
        chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;
        return message;
    }

    // 添加拖动功能
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 初始化悬浮小球和聊天界面
    const floatingBall = createFloatingBall();
    const chatContainer = createChatContainer();
    createChatInterface(chatContainer);
    // 监听鼠标选中事件
    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            const input = document.getElementById('chat-input');
            input.value = selectedText;
        }
    });
})();

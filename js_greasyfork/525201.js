// ==UserScript==
// @name         Deepseek Chat Assistant
// @namespace    shy
// @version      1.0
// @description  调用Deepseek API进行对话。
// @author       shy
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525201/Deepseek%20Chat%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/525201/Deepseek%20Chat%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let apiKey = GM_getValue('apiKey', '');
    let model = GM_getValue('model', 'deepseek-chat');
    const icon = document.createElement('div');
    icon.style.position = 'fixed';
    icon.style.bottom = '20px';
    icon.style.right = '20px';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.backgroundColor = '#007bff';
    icon.style.borderRadius = '50%';
    icon.style.cursor = 'pointer';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    icon.style.color = '#fff';
    icon.style.fontSize = '24px';
    icon.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    icon.style.transition = 'transform 0.2s, box-shadow 0.2s';
    icon.innerText = 'AI';
    document.body.appendChild(icon);

    const chatWindow = document.createElement('div');
    chatWindow.style.position = 'fixed';
    chatWindow.style.bottom = '80px';
    chatWindow.style.right = '20px';
    chatWindow.style.width = '350px';
    chatWindow.style.height = '450px';
    chatWindow.style.backgroundColor = '#f9f9f9';
    chatWindow.style.border = '1px solid #ddd';
    chatWindow.style.borderRadius = '15px';
    chatWindow.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.transition = 'opacity 0.3s, transform 0.3s';
    chatWindow.style.opacity = '0';
    chatWindow.style.transform = 'translateY(20px)';
    document.body.appendChild(chatWindow);

    const settingsIcon = document.createElement('div');
    settingsIcon.style.position = 'absolute';
    settingsIcon.style.top = '10px';
    settingsIcon.style.right = '10px';
    settingsIcon.style.cursor = 'pointer';
    settingsIcon.style.fontSize = '16px';
    settingsIcon.style.color = '#666';
    settingsIcon.innerText = '⚙️';
    chatWindow.appendChild(settingsIcon);

    settingsIcon.addEventListener('click', () => {
        const newApiKey = prompt('请输入您的API密钥:', apiKey);
        if (newApiKey !== null) {
            apiKey = newApiKey;
            GM_setValue('apiKey', apiKey);
        }

        const newModel = prompt('请选择模型 (deepseek-chat 或 deepseek-reasoner):', model);
        if (newModel !== null) {
            model = newModel;
            GM_setValue('model', model);
        }
    });

    const chatContent = document.createElement('div');
    chatContent.style.flex = '1';
    chatContent.style.padding = '15px';
    chatContent.style.overflowY = 'auto';
    chatContent.style.backgroundColor = '#fff';
    chatContent.style.borderBottom = '1px solid #ddd';
    chatWindow.appendChild(chatContent);

    const inputBox = document.createElement('input');
    inputBox.style.width = 'calc(100% - 20px)';
    inputBox.style.padding = '10px';
    inputBox.style.border = '1px solid #ddd';
    inputBox.style.borderRadius = '8px';
    inputBox.style.margin = '10px';
    inputBox.style.outline = 'none';
    inputBox.style.transition = 'border-color 0.3s';
    inputBox.placeholder = '输入你的问题...';
    chatWindow.appendChild(inputBox);

    inputBox.addEventListener('focus', () => {
        inputBox.style.borderColor = '#007bff';
    });

    inputBox.addEventListener('blur', () => {
        inputBox.style.borderColor = '#ddd';
    });

    icon.addEventListener('click', () => {
        if (chatWindow.style.display === 'none') {
            chatWindow.style.display = 'flex';
            setTimeout(() => {
                chatWindow.style.opacity = '1';
                chatWindow.style.transform = 'translateY(0)';
            }, 10);
        } else {
            chatWindow.style.opacity = '0';
            chatWindow.style.transform = 'translateY(20px)';
            setTimeout(() => {
                chatWindow.style.display = 'none';
            }, 300);
        }
    });

    function sendMessage(message) {
        if (!apiKey) {
            alert('请先设置API密钥！');
            return;
        }

        const userMessage = document.createElement('div');
        userMessage.innerText = `你: ${message}`;
        userMessage.style.marginBottom = '10px';
        userMessage.style.color = '#333';
        chatContent.appendChild(userMessage);

        const thinkingMessage = document.createElement('div');
        thinkingMessage.innerText = 'AI: 思考中...';
        thinkingMessage.style.color = '#666';
        chatContent.appendChild(thinkingMessage);

        chatContent.scrollTop = chatContent.scrollHeight;

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.deepseek.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: message }]
            }),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const aiMessage = data.choices[0].message.content;
                chatContent.removeChild(thinkingMessage);
                const aiResponse = document.createElement('div');
                aiResponse.innerText = `AI: ${aiMessage}`;
                aiResponse.style.marginBottom = '10px';
                aiResponse.style.color = '#007bff';
                chatContent.appendChild(aiResponse);
                chatContent.scrollTop = chatContent.scrollHeight;
            },
            onerror: function(error) {
                chatContent.removeChild(thinkingMessage);
                const errorMessage = document.createElement('div');
                errorMessage.innerText = 'AI: 请求失败，请稍后重试。';
                errorMessage.style.color = '#ff0000';
                chatContent.appendChild(errorMessage);
                chatContent.scrollTop = chatContent.scrollHeight;
            }
        });
    }

    inputBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = inputBox.value.trim();
            if (message) {
                sendMessage(message);
                inputBox.value = '';
            }
        }
    });
})();
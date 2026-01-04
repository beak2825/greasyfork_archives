// ==UserScript==
// @name         gpt-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  easy tool
// @author       skymilong
// @match           *://**/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481670/gpt-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481670/gpt-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 响应文本字符串
    const respnoseText = "";

    // API的终端URL
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    // 创建并添加CSS样式和HTML元素到文档中
    createBody();

    // 绑定事件监听器到元素
    bindEventListeners();

    function createBody() {
        // 添加CSS样式到文档头部
        const style = document.createElement('style');
        style.innerHTML = `
            #chatgpt-helper {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background-color: white;
                border: 1px solid gray;
                padding: 10px;
                cursor: move;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                height: 50%;
            }

            #chatgpt-helper input {
                width: 100%;
                margin-bottom: 10px;
            }

            #chatgpt-helper textarea {
                width: 100%;
                flex: 1;
                overflow-y: auto;
                margin-bottom: 10px;
            }

            #chatgpt-helper button {
                width: 100%;
            }
        `;
        document.head.appendChild(style);

        // 创建并添加元素到文档主体
        const container = document.createElement('div');
        container.id = 'chatgpt-helper';
        container.innerHTML = `
            <input type="text" id="sky-api-key" placeholder="API Key">
            <textarea id="sky-output" rows="5" placeholder="Output" readonly></textarea>
            <input type="text" id="sky-input" placeholder="Input">
            <button id="submit-btn">Submit</button>
        `;
        document.body.appendChild(container);

        // 创建并添加提问按钮到文档主体
        const questionBtn = document.createElement('button');
        questionBtn.id = "sky-ask";
        questionBtn.innerText = '提问';
        questionBtn.style.position = 'absolute';
        questionBtn.style.zIndex = '999';
        questionBtn.style.display = 'none'; // 初始状态隐藏按钮
        document.body.appendChild(questionBtn);
    }

    function bindEventListeners() {
        const container = document.getElementById('chatgpt-helper');
        const apiKeyInput = document.getElementById('sky-api-key');
        const userInput = document.getElementById('sky-input');
        const submitBtn = document.getElementById('submit-btn');
        const outputTextarea = document.getElementById('sky-output');
        const questionBtn = document.getElementById('sky-ask');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialX = 0;
        let initialY = 0;
        let selectedText = ''; // 存储选中的文本

        // 添加事件监听器到容器以使其可以拖动
        container.addEventListener('mousedown', (event) => {
            if (event.target == container) {
                startX = event.clientX;
                startY = event.clientY;
                initialX = container.offsetLeft;
                initialY = container.offsetTop;
                isDragging = true;
            }
        });

        container.addEventListener('mouseup', (event) => {
            isDragging = false;
        });

        container.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                container.style.left = `${initialX + dx}px`;
                container.style.top = `${initialY + dy}px`;
            }
        });

        // 添加点击事件监听器到提交按钮
        submitBtn.addEventListener('click', async () => {
            outputTextarea.value = outputTextarea.value + '\n' + 'user:' + userInput.value + '\n';
            interactWithAPI(apiKeyInput.value, userInput.value);
        });

        // 添加鼠标抬起事件监听器到文档
        document.addEventListener('mouseup', (event) => {
            const selection = window.getSelection();
            selectedText = selection.toString().trim(); // 获取选中的文本并去除首尾空格

            if (selectedText !== '') {
                questionBtn.style.top = `${event.pageY}px`;
                questionBtn.style.left = `${event.pageX}px`;
                questionBtn.style.display = 'block'; // 显示按钮
            } else {
                questionBtn.style.display = 'none'; // 隐藏按钮
            }
        });

        // 添加点击事件监听器到提问按钮
        questionBtn.addEventListener('click', () => {
            userInput.value = selectedText;
            selectedText = "";
            questionBtn.style.display = 'none'; // 点击后隐藏按钮
        });
    }

    // 与API进行交互并处理响应
    async function interactWithAPI(apiKey, userInputValue) {
        const outputTextarea = document.getElementById('sky-output');

        try {
            const data = {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInputValue }
                ]
            };

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const data = await response.json();
                // 更新输出文本区域的内容
                outputTextarea.value = outputTextarea.value + '\n' + 'gpt:' + data.choices[0].message.content  + '\n';
            } else {
                // 处理错误响应
                throw new Error('API request failed');
            }
        } catch (error) {
            // 处理异常或网络错误
            console.error(error);
            // 更新输出文本区域的内容或显示错误消息
            outputTextarea.value = outputTextarea.value + '\n' + 'gpt:Error occurred. Please try again.\n';
        }
    }
})();

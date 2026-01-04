// ==UserScript==
// @name         DeepSeek Local助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  本地部署DeepSeek模型后，直接浏览器对话
// @author       xiafancat下饭猫
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      localhost
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527207/DeepSeek%20Local%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527207/DeepSeek%20Local%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义样式
    GM_addStyle(`
        #ds-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        #ds-header {
            background: #2c3e50;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            cursor: move;
        }
        #ds-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        #ds-input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        #ds-response {
            white-space: pre-wrap;
            line-height: 1.5;
        }
        .ds-button {
            background: #3498db;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            float: right;
        }
        .ds-select-container {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
        }
        #ds-model {
            width: calc(100% - 120px);
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .ds-label {
            margin-bottom: 5px;
        }
        .clear-both {
            clear: both;
        }
    `);

    // 创建界面
    const container = document.createElement('div');
    container.id = 'ds-container';
    container.innerHTML = `
        <div id="ds-header">DeepSeek助手</div>
        <div id="ds-content">
            <div id="ds-response"></div>
            <textarea id="ds-input" rows="3" placeholder="输入您的问题..."></textarea>
            <div class="ds-select-container">
                <div class="ds-label">选择模型：</div>
                <select id="ds-model">
                    <option value="deepseek-r1:1.5b">deepseek-r1:1.5b</option>
                    <option value="deepseek-r1:7b">deepseek-r1:7b</option>
                    <option value="deepseek-r1:8b">deepseek-r1:8b</option>
                    <option value="deepseek-r1:14b">deepseek-r1:14b</option>
                    <option value="deepseek-r1:32b">deepseek-r1:32b</option>
                    <option value="deepseek-r1:70b">deepseek-r1:70b</option>
                </select>
                <button class="ds-button" id="ds-send">发送</button>
            </div>
            <div class="clear-both"></div>
        </div>
    `;
    document.body.appendChild(container);

    // 简单拖动功能
    let isDragging = false;
    let xOffset = 0, yOffset = 0, initialX, initialY;
    const header = container.querySelector('#ds-header');

    header.addEventListener('mousedown', (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            xOffset = e.clientX - initialX;
            yOffset = e.clientY - initialY;
            container.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 调用Ollama API 使用 GM_xmlhttpRequest
    async function queryDeepSeek(prompt, model) {
        const responseArea = document.getElementById('ds-response');
        responseArea.textContent = '思考中...';

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://localhost:11434/api/generate",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                        model: model,
                        prompt: prompt,
                        stream: true
                    }),
                    responseType: "text",
                    onload: resolve,
                    onerror: reject
                });
            });

            console.log('Response Status:', response.status);
            console.log('Response Text:', response.responseText);

            if (response.status !== 200) {
                if (response.statusText.toLowerCase().includes('model not found')) {
                    responseArea.textContent = `错误: 模型 ${model} 未安装`;
                } else {
                    responseArea.textContent = `错误: ${response.status} - ${response.statusText}`;
                }
                return;
            }

            // 处理返回的数据，并移除 <think> 和 </think>部分：
            const data = response.responseText.split('\n').map((chunk) => chunk.trim()).filter((chunk) => chunk);
            let fullResponse = '';
            data.forEach((chunk) => {
                try {
                    const jsonChunk = JSON.parse(chunk);
                    if (jsonChunk.response) {
                        fullResponse += jsonChunk.response;
                    }
                } catch (e) {
                    console.error('JSON 解析错误:', e, chunk);
                }
            });

            // 移除 <think> 和 </think> 及其之间的内容
            fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/s, '');

            responseArea.textContent = fullResponse;
            responseArea.scrollTop = responseArea.scrollHeight;

        } catch (error) {
            console.error('请求失败:', error);
            responseArea.textContent = `错误: 网络请求失败`;
        }
    }

    // 绑定事件
    document.getElementById('ds-send').addEventListener('click', () => {
        const input = document.getElementById('ds-input').value.trim();
        const model = document.getElementById('ds-model').value;
        if (input) {
            queryDeepSeek(input, model);
            document.getElementById('ds-input').value = '';
        }
    });

    // 回车发送
    document.getElementById('ds-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('ds-send').click();
        }
    });
})();
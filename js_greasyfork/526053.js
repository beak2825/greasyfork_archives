// ==UserScript==
// @name         AI自动斗蛐蛐助手
// @author       Jerry_Chiang&deepseek
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  使用硅基流动的api，支持DeepSeek系列模型的AI自动斗蛐蛐助手，也可自行设置其他兼容openai协议的api
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526053/AI%E8%87%AA%E5%8A%A8%E6%96%97%E8%9B%90%E8%9B%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526053/AI%E8%87%AA%E5%8A%A8%E6%96%97%E8%9B%90%E8%9B%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const CONFIG = {
        apiKey: 'sk-',//apikey
        apiEndpoint: 'https://api.siliconflow.cn/v1/chat/completions',//apiurl
        defaultModel: 'deepseek-ai/DeepSeek-V3',
        availableModels: [
            'deepseek-ai/DeepSeek-R1',
            'deepseek-ai/DeepSeek-V3',
            'deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
            'meta-llama/Meta-Llama-3.1-8B-Instruct'
        ],
        apiParams: {
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            max_tokens: 512,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stream: false,
            n: 1,
            stop: ["null"],
            response_format: { type: "text" }
        }
    };

    // 状态变量
    let isRunning = false;
    let observer = null;

    // 创建UI界面
    function createUI() {
        const uiHTML = `
        <div id="ai-control" style="position:fixed; top:20px; right:20px; background:#1a1a1a; color:#fff; padding:20px; border-radius:8px; z-index:9999; width:380px; box-shadow:0 4px 6px rgba(0,0,0,0.1); cursor:grab;">
            <h3 id="drag-handle" style="margin:0 0 15px; color:#fff; cursor:move;">AI斗蛐蛐控制台</h3>

            <!-- 模型选择 -->
            <div style="margin-bottom:10px;">
                <select id="model-select" style="width:100%; padding:6px; background:#333; color:#fff; border:1px solid #444;"></select>
            </div>

            <!-- 系统提示词 -->
            <div style="margin-bottom:10px;">
                <input type="text" id="system-prompt" style="width:100%; padding:6px; background:#333; color:#fff; border:1px solid #444;" placeholder="系统提示词（可选）">
            </div>

            <!-- 初始提示 -->
            <textarea id="init-prompt" style="width:100%; height:60px; margin-bottom:10px; background:#333; color:#fff; border:1px solid #444; padding:6px;" placeholder="用户初始消息..."></textarea>

            <!-- API参数调整 -->
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-bottom:15px;">
                <div>
                    <label style="font-size:12px;">温度 (0-2)</label>
                    <input type="number" id="temperature" step="0.1" value="${CONFIG.apiParams.temperature}" style="width:100%; padding:4px; background:#333; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:12px;">最大长度</label>
                    <input type="number" id="max_tokens" value="${CONFIG.apiParams.max_tokens}" style="width:100%; padding:4px; background:#333; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:12px;">Top P (0-1)</label>
                    <input type="number" id="top_p" step="0.1" value="${CONFIG.apiParams.top_p}" style="width:100%; padding:4px; background:#333; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:12px;">Top K</label>
                    <input type="number" id="top_k" value="${CONFIG.apiParams.top_k}" style="width:100%; padding:4px; background:#333; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:12px;">频率惩罚</label>
                    <input type="number" id="frequency_penalty" step="0.1" value="${CONFIG.apiParams.frequency_penalty}" style="width:100%; padding:4px; background:#333; color:#fff; border:1px solid #444;">
                </div>
            </div>

            <!-- 控制按钮 -->
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button id="start-btn" style="flex:1; padding:8px; background:#28a745; border:none; color:#fff; border-radius:4px; cursor:pointer;">开始</button>
                <button id="stop-btn" style="flex:1; padding:8px; background:#dc3545; border:none; color:#fff; border-radius:4px; cursor:pointer;">停止</button>
            </div>

            <!-- 日志面板 -->
            <div id="log" style="height:200px; overflow-y:auto; background:#222; padding:10px; border-radius:4px; font-size:12px; line-height:1.4;"></div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHTML);

        // 初始化模型选择
        const modelSelect = document.getElementById('model-select');
        CONFIG.availableModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
        modelSelect.value = GM_getValue('selectedModel', CONFIG.defaultModel);
        modelSelect.addEventListener('change', () => GM_setValue('selectedModel', modelSelect.value));

        makeDraggable(document.getElementById('ai-control'));
    }
    // 使UI可拖动
    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;
        const handle = document.getElementById("drag-handle");

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'grab';
        });
    }

    // 日志记录功能
    function addLog(message, type = 'info') {
        const logElement = document.getElementById('log');
        const colors = { info: '#fff', error: '#ff4444', success: '#44ff44' };
        logElement.innerHTML += `<div style="color:${colors[type]}; margin:5px 0;">${new Date().toLocaleTimeString()} - ${message}</div>`;
        logElement.scrollTop = logElement.scrollHeight;
    }

    // 获取当前API参数
    function getCurrentParams() {
        return {
            temperature: parseFloat(document.getElementById('temperature').value) || CONFIG.apiParams.temperature,
            top_p: parseFloat(document.getElementById('top_p').value) || CONFIG.apiParams.top_p,
            top_k: parseInt(document.getElementById('top_k').value) || CONFIG.apiParams.top_k,
            max_tokens: parseInt(document.getElementById('max_tokens').value) || CONFIG.apiParams.max_tokens,
            frequency_penalty: parseFloat(document.getElementById('frequency_penalty').value) || CONFIG.apiParams.frequency_penalty,
            presence_penalty: 0,
            stream: false,
            n: 1,
            stop: ["null"],
            response_format: { type: "text" }
        };
    }

    // 调用DeepSeek-V3 API
    async function callDeepSeekAPI(message) {
        const systemPrompt = document.getElementById('system-prompt').value.trim();
        const params = getCurrentParams();
        const modelSelect = document.getElementById('model-select').value;

        const messages = [];
        if (systemPrompt) {
            messages.push({ role: "system", content: systemPrompt });
        }
        messages.push({ role: "user", content: message });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.apiEndpoint,
                headers: {
                    'Authorization': `Bearer ${CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000, // 60秒超时
                data: JSON.stringify({
                    model: modelSelect,
                    messages: messages,
                    ...params
                }),
                onload: function (response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const data = JSON.parse(response.responseText);
                            if (data.choices?.[0]?.message?.content) {
                                resolve(data.choices[0].message.content);
                            } else {
                                reject('API返回无效的响应格式');
                            }
                        } else {
                            let errorMsg = `HTTP错误: ${response.status}`;
                            try {
                                const errData = JSON.parse(response.responseText);
                                errorMsg += ` - ${errData.error?.message || errData.message}`;
                            } catch(e) {}
                            reject(errorMsg);
                        }
                    } catch (e) {
                        reject('响应解析失败: ' + e.message);
                    }
                },
                onerror: function (error) {
                    let errorMsg = '网络请求失败';
                    try {
                        const errData = JSON.parse(error.responseText);
                        errorMsg = errData.error?.message || errData.message;
                    } catch(e) {}
                    reject(errorMsg);
                },
                ontimeout: function () {
                    reject('请求超时（60秒）');
                }
            });
        });
    }

    // 发送消息到ChatGPT
    async function sendToChatGPT(message) {
        const inputBox = document.querySelector('#prompt-textarea');
        if (!inputBox) return;

        inputBox.focus();
        inputBox.textContent = message;
        inputBox.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, 500));

        const sendButton = document.querySelector('button[data-testid="send-button"]');
        if (sendButton) {
            sendButton.click();
            addLog(`已发送消息: ${message}`, 'success');
        }
    }

    // 监听回复
    function watchResponse(callback) {
        let responseTimer = null;
        let lastContent = '';
        const maxWaitTime = 5000; // 5秒超时

        const observer = new MutationObserver(() => {
            const targetElement = document.querySelector('article:last-child [data-message-author-role="assistant"]');
            if (!targetElement) return;

            // 排除正在输入状态
            const isTyping = targetElement.querySelector('.result-streaming');
            if (isTyping) {
                addLog('检测到流式输出中...', 'info');
                return;
            }

            const currentContent = targetElement.textContent.trim();

            // 内容发生变化时处理
            if (currentContent && currentContent !== lastContent) {
                lastContent = currentContent;

                // 清除旧定时器
                if (responseTimer) clearTimeout(responseTimer);

                // 启动新定时器
                responseTimer = setTimeout(() => {
                    observer.disconnect();
                    callback(lastContent);
                    addLog('获取到完整响应内容', 'success');
                }, maxWaitTime);
            }
        });

        // 监听整个对话容器
        const chatContainer = document.querySelector('main');
        if (chatContainer) {
            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    // 主对话循环
    async function chatLoop(initialMessage) {
        let currentMessage = initialMessage;
        await sendToChatGPT(currentMessage);

        while (isRunning) {
            try {
                // 监听一次回复
                const chatGPTReply = await new Promise(resolve => watchResponse(resolve));

                if (!isRunning) break; // 检查是否已停止

                addLog(`ChatGPT 回复: ${chatGPTReply}`, 'info');

                addLog('正在调用DeepSeek API...');
                const apiResponse = await callDeepSeekAPI(chatGPTReply);
                addLog(`API 响应: ${apiResponse}`, 'success');

                if (!isRunning) break; // 再次检查是否已停止

                currentMessage = apiResponse;
                await sendToChatGPT(currentMessage);
                await new Promise(resolve => setTimeout(resolve, 3000));

            } catch (error) {
                addLog(`错误: ${error}`, 'error');
                stopChatLoop();
            }
        }
    }

    // 停止对话
    function stopChatLoop() {
        isRunning = false;
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        addLog('对话已强制停止', 'error');
    }

    // 初始化
    (function init() {
        GM_addStyle(`
            #ai-control input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            #ai-control label {
                display: block;
                margin-bottom: 2px;
                color: #888;
            }
        `);
        createUI();
        document.getElementById('start-btn').addEventListener('click', () => {
            if (!isRunning) {
                const initialMessage = document.getElementById('init-prompt').value.trim();
                if (!initialMessage) {
                    addLog('请输入初始对话内容', 'error');
                    return;
                }
                isRunning = true;
                addLog('对话已启动', 'success');
                chatLoop(initialMessage);
            }
        });
        document.getElementById('stop-btn').addEventListener('click', stopChatLoop);
        addLog('系统初始化完成');
    })();
})();
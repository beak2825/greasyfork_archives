// ==UserScript==
// @name         Vercel ASK AI
// @namespace    https://ai-sdk.dev/playground
// @version      2.7
// @description  通过WebSocket自动填充提示词Vercel ASK AI并执行
// @author       You
// @match        https://ai-sdk.dev/playground
// @match        https://ai-sdk.dev/playground/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542446/Vercel%20ASK%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/542446/Vercel%20ASK%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 判断当前窗口是否是顶层窗口
    if (window.top === window.self) {
        // 是顶层窗口，执行你的主要代码
        console.log("脚本在主页面运行");
        // ... 你的所有代码都放在这里 ...
    } else {
        // 是在 iframe 中，不执行或执行其他逻辑
        console.log("脚本在 iframe 中，已跳过");
        return;
    }
    let ws = null;
    let reconnectInterval = null;
    const WS_URL = 'ws://localhost:6688'; // WebSocket端口
    let currentRequestId = null;
    let isProcessing = false;

    // 日志函数
    function log(message, data = null) {
        console.log(`[Vercel ASK AI] ${message}`, data || '');
    }

    // 连接WebSocket
    function connectWebSocket() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            return;
        }

        log('正在连接WebSocket服务器...');
        ws = new WebSocket(WS_URL);

        ws.onopen = function() {
            log('WebSocket连接成功');
            if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
            }
            // 发送注册消息
            ws.send(JSON.stringify({
                type: 'register',
                clientId: generateClientId()
            }));
        };

        ws.onmessage = async function(event) {
            try {
                const data = JSON.parse(event.data);
                log(`收到消息:${data.type}`);

                if (data.type === 'prompt') {
                    if(isProcessing){
                        log('正在处理中，忽略');
                        return;
                    }

                    currentRequestId = data.requestId;
                    await processPrompt(data);
                }
                else if(data.type === 'refresh_page') {
                    log('收到页面刷新信号，即将刷新页面...');
                    // 等待1秒后刷新页面，给用户一个视觉提示的时间
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
                else if(data.type === 'action'){

                }
                else{
                    sendFinishResponse('')
                }
            } catch (error) {
                log('处理消息错误:', error);
                isProcessing = false;
            }
        };

        ws.onclose = function() {
            log('WebSocket连接关闭');
            ws = null;
            startReconnect();
        };

        ws.onerror = function(error) {
            log('WebSocket错误:', error);
        };
    }

    // 自动重连
    function startReconnect() {
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                log('尝试重新连接...');
                connectWebSocket();
            }, 5000);
        }
    }

    // 生成客户端ID
    function generateClientId() {
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }

    // 方法1: 直接点击元素（推荐用于 SPA）
    async function clickNewChatLink() {
        // Find the specific anchor element with href="/playground" and aria-label="New Chat"
        const newChatLink = document.querySelector('a[role="link"][href="/playground"][aria-label="New Chat"]');

        if (newChatLink) {
            log('找到 "New Chat" 链接,正在点击...');
            simulateRealClick(newChatLink);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI to update
            return true;
        } else {
            log('未找到 "New Chat" 链接');
            return false;
        }
    }
    // 处理提示词
    async function processPrompt(data) {
        // const prompt = data.content;
        const modelName = data.modelName;
        log('开始处理提示词:',modelName, data.content.length);

        try {
            let clickNewChatSuccessed = await clickNewChatLink();
            if(!clickNewChatSuccessed){
                throw new Error('未点击新对话logo');
                // log('未点击新对话logo');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 查找textarea元素
            let retry=0;
            let textarea;
            while(retry<3){
                retry++;
                textarea = document.querySelector('textarea[placeholder="Type your message…"]');
                if(!textarea){
                    log('获取失败，尝试重新获取:');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }else{
                    break;
                }
            }
            if(!textarea){
                throw new Error('未找到输入框');
            }
            // 使用真实鼠标点击聚焦
            simulateRealClick(textarea);
            await new Promise(resolve => setTimeout(resolve, 300));

            // 设置实际的提示词内容
            const promptText = data.content;

            // 清除原内容并设置新内容
            textarea.focus();
            textarea.select();

            // 使用React的方式设置值
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            nativeInputValueSetter.call(textarea, promptText);

            // 触发React的input事件
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);

            // 触发change事件
            const changeEvent = new Event('change', { bubbles: true });
            textarea.dispatchEvent(changeEvent);

            await new Promise(resolve => setTimeout(resolve, 100));

            // 移除占位符样式
            textarea.style.webkitTextFillColor = '';
            textarea.style.color = 'rgb(50, 48, 44)';

            log('使用React方式设置内容完成:', promptText.substring(0, 50) + '...');

            log('已设置提示词到输入框');

            // 等待按钮可用
            await waitForRunButton();

            // // 启用提交按钮
            // const submitButton = document.querySelector('button[type="submit"][data-geist-menu-button]');
            // if (submitButton) {
            //     submitButton.disabled = false;
            //     submitButton.removeAttribute('disabled');
            //     submitButton.dataset.state = 'closed';
            //     submitButton.classList.remove('opacity-50', 'pointer-events-none');
            // }
            await new Promise(resolve => setTimeout(resolve, 100));

            // 开始监听响应
            interceptResponse(data);

            // 点击运行按钮
            await clickRunButton();
            // clickNewChatLink();
        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
        }
    }

    // 等待运行按钮可用
    async function waitForRunButton(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            const button = document.querySelector('button[type="submit"][data-geist-button][aria-label="Send Message"]');
            if (button) {
                log('运行按钮已可用');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('运行按钮未能可用');
    }

    // 点击运行按钮
    async function clickRunButton() {
        const button = document.querySelector('button[type="submit"][data-geist-button][aria-label="Send Message"]');
        if (!button) {
            throw new Error('运行按钮不可用');
        }

        log('点击运行按钮');
        log(button);
        // 使用模拟真实鼠标点击来点击按钮
        simulateRealClick(button);
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }

    // 发送响应
    function sendResponse(content) {
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送响应内容');
            ws.send(JSON.stringify({
                type: 'response',
                requestId: currentRequestId,
                content: content,
                success: true
            }));
        }
    }

    function sendFinishResponse(content){
        isProcessing = false;
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送结束消息');
            ws.send(JSON.stringify({
                type: 'finish',
                requestId: currentRequestId,
                content: content,
                success: true
            }));
            currentRequestId = null;
        }
    }

    // 发送错误
    function sendError(error) {
        isProcessing = false;
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送错误信息:', error);
            ws.send(JSON.stringify({
                type: 'response',
                requestId: currentRequestId,
                error: error,
                success: false
            }));
            currentRequestId = null;
        }
    }

    // 拦截响应
    function interceptResponse(requestBody) {
        let responseIntercepted = false;

        // 拦截 fetch
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const [resource, config] = args;
            const url = (typeof resource === 'string') ? resource : resource.url;
            // log('拦截到 fetch 请求:', url);           // 如果是目标请求
            if (url.includes('/api/generate')) {
                log('拦截到 api/generate fetch 请求:', url);
                responseIntercepted = true;

                try {
                    isProcessing = true;
                    // console.warn(args[1].body);
                    // // 修改body
                    const body = JSON.parse(args[1].body);
                    body.model = requestBody.modelId;
                    requestBody.max_tokens && (body.maxTokens=requestBody.max_tokens);
                    requestBody.temperature && (body.temperature=requestBody.temperature);
                    requestBody.top_p && (body.topP= requestBody.top_p);
                    requestBody.stop && (body.stopSequences = requestBody.stop);
                    body.messages = [
                        {
                            "id": requestBody.requestId,
                            "role": "user",
                            "parts": [
                                {
                                    "type": "text",
                                    "text": requestBody.content
                                }
                            ]
                        }
                    ]
                    args[1].body = JSON.stringify(body);
                    const response = await originalFetch.apply(this, args);
                    // Clone the response before reading from it
                    const responseClone = response.clone();
                    const reader = responseClone.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const {value, done} = await reader.read();
                        if (done) {
                            log('Stream complete');
                            sendFinishResponse('');
                            isProcessing = false;
                            window.fetch = originalFetch;
                            break;
                        }

                        const chunk = decoder.decode(value, {stream: true});
                        // log('收到数据块:', chunk);
                        sendResponse(chunk);
                    }

                    return response;
                } catch (error) {
                    log('Fetch 错误:', error);
                    window.fetch = originalFetch;
                    sendError(error.toString());
                    throw error;
                }
            }

            // 非目标请求直接放行
            return originalFetch.apply(this, args);
        };

        // 超时处理
        setTimeout(() => {
            if (!responseIntercepted ) {
                log('发送超时，恢复原始方法');
                window.fetch = originalFetch;
                sendError('发送超时');
            }
        }, 6000);
    }

    // 辅助函数：睡眠
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 模拟真实的鼠标点击
    function simulateRealClick(element) {
        if (!element) return false;

        // 获取元素位置
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 模拟鼠标移动到元素上
        const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY
        });
        element.dispatchEvent(moveEvent);

        // 模拟鼠标按下
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(mouseDownEvent);

        // 模拟鼠标松开
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(mouseUpEvent);

        // 模拟点击
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(clickEvent);

        return true;
    }

    // 监控所有网络请求（调试用）
    function monitorAllRequests() {
        // 监控 XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (url.includes('google.com')) {
                console.log(`[Network Monitor] XHR ${method} ${url}`);
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        // 监控 fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url] = args;
            if (typeof url === 'string' && url.includes('google.com')) {
                console.log(`[Network Monitor] Fetch ${url}`);
            }
            return originalFetch.apply(this, args);
        };
    }


    // 初始化
    function init() {
        log('油猴脚本初始化');

        // 启用网络监控（调试用，可注释掉）
        if (window.location.href.includes('debug=true')) {
            monitorAllRequests();
            log('网络监控已启用');
        }

        connectWebSocket();

        // 监听页面变化，确保元素存在
        const observer = new MutationObserver(() => {
//            log('页面元变换');
            const textarea = document.querySelector('textarea[placeholder="Type your message…"]');
            const button = document.querySelector('button[type="submit"][data-geist-button][aria-label="Send Message"]');
            if (textarea && button) {
                log('页面元素已就绪');
            }else{
                if(textarea){
                    log('⚠️页面元素未找到 textarea');
                }
                if(button){
                    log('⚠️页面元素未找到 button');
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
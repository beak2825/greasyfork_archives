// ==UserScript==
// @name         HONGDOULI
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过WebSocket自动填充提示词并执行
// @author       You
// @match        https://aistudio.google.com/prompts/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539609/HONGDOULI.user.js
// @updateURL https://update.greasyfork.org/scripts/539609/HONGDOULI.meta.js
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
    const WS_URL = 'ws://localhost:7888'; // WebSocket端口
    let currentRequestId = null;
    let isProcessing = false;

    // 日志函数
    function log(message, data = null) {
        console.log(`[MakerSuite Bridge] ${message}`, data || '');
    }

    // 连接WebSocket
    function connectWebSocket() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            return;
        }

        log('正在连接WebSocket服务器...');
        ws = new WebSocket(WS_URL);

        ws.onopen = async function() {
            log('WebSocket连接成功');
            if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
            }
            const gmailId =  await generateClientId()

            // 发送注册消息
            ws.send(JSON.stringify({
                type: 'register',
                clientId: gmailId
            }));
        };

        ws.onmessage = async function(event) {
            try {
                const data = JSON.parse(event.data);
                log('收到消息:');

                if (data.type === 'prompt' && data.content && !isProcessing) {
                    isProcessing = true;
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
    async function generateClientId() {
        // 尝试从avatar元素获取账号信息
        let retry=0;
        while(retry<5){
            const avatarContainer = document.querySelector('.mat-mdc-tooltip-trigger.button-container[aria-label*="Google Account"]');
            
            if (avatarContainer) {
                const ariaLabel = avatarContainer.getAttribute('aria-label');
                // 从aria-label中提取邮箱，格式为"Google Account: Name (email@example.com)"
                const emailMatch = ariaLabel && ariaLabel.match(/\(([^)]+)\)/);
                if (emailMatch && emailMatch[1]) {
                    return emailMatch[1];
                }
                else if(ariaLabel){
                    return 'client_' + Math.random().toString(36).substr(2, 9)+'_'+ariaLabel;
                }
            }else{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            retry++;

        }
        
        // 如果无法获取账号信息，则使用随机ID作为后备
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }

    // 方法1: 直接点击元素（推荐用于 SPA）
    function clickLogoLink() {
        const logoLink = document.querySelector('a.logo-title-wrapper[href="/prompts/new_chat"]');
        if (logoLink) {
            logoLink.click();
            console.log('点击了 logo 链接');
            return true;
        }
        return false;
    }
    // 处理提示词
    async function processPrompt(data) {
        const prompt = data.content;
        const modelName = data.modelName;
        log('开始处理提示词:',modelName, prompt.substr(0,50));

        try {
            let clickLogoSuccessed = clickLogoLink();
            if(!clickLogoSuccessed){
                throw new Error('未点击新对话logo');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 查找textarea元素
            let retry=0;
            let textarea;
            while(retry<3){
                retry++;
                textarea = document.querySelector('ms-autosize-textarea textarea.textarea');
                if(!textarea){
                    log('获取失败，尝试重新获取:');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                break;
            }

            if (!textarea) {
                throw new Error('未找到输入框');
            }
            // 清空并填充新内容
            textarea.value = '';
            textarea.focus();

            // 模拟用户输入
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });

            textarea.value = prompt;
            textarea.dispatchEvent(inputEvent);
            textarea.dispatchEvent(changeEvent);

            // 触发Angular的变更检测
            const ngModel = textarea.getAttribute('ng-reflect-model');
            if (ngModel !== prompt) {
                textarea.setAttribute('ng-reflect-model', prompt);
            }

            // 等待按钮可用
            await waitForRunButton();

            // 开始监听响应
            interceptResponse(data);

            // 点击运行按钮
            await clickRunButton();
            clickLogoLink();
        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
            isProcessing = false;
        }
    }

    // 等待运行按钮可用
    async function waitForRunButton(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            const button = document.querySelector('run-button button.run-button:not(.disabled)');
            if (button && !button.disabled) {
                log('运行按钮已可用');
                return true;
            }
            await sleep(100);
        }
        throw new Error('运行按钮未能可用');
    }

    // 点击运行按钮
    async function clickRunButton() {
        const button = document.querySelector('run-button button.run-button');
        if (!button || button.disabled) {
            throw new Error('运行按钮不可用');
        }


        log('点击运行按钮');
        button.click();
        return true;
    }

    // 拦截响应
    function interceptResponse(requestBody) {
        let responseIntercepted = false;

        // 拦截 XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;


        const restoreHttpRequest = function(){
            XMLHttpRequest.prototype.open = originalXHROpen;
            XMLHttpRequest.prototype.send = originalXHRSend;
            XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;
            isProcessing = false;
        }

        let targetXHR = null;
        let requestURL;
        let requestMethod;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            log('open url',url);
            // 存储一些信息到 XHR 实例上，以便后续使用
            if (url.includes('/GenerateContent')) {
                log('拦截到GenerateContent XHR请求:', url);
                targetXHR = this;
                this.requestURL = url;
                requestURL = url;
                requestMethod = method;
                log(`[XHR Intercept] OPEN: ${method} ${url}`);
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        // 保存请求头
        const requestHeaders = new Map();
        XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
            if (targetXHR === this) {
                requestHeaders.set(name, value);
                log(`设置请求头: ${name} = ${value}`);
            }
            return originalXHRSetRequestHeader.apply(this, arguments);
        };

        let accumulatedData = '';
        XMLHttpRequest.prototype.send = function(data) {
            if (targetXHR === this) {
                log('发送XHR请求数据:', data ? data.substring(0, 200) + '...' : 'null');
            }
            // 关键：在这里为当前 XHR 实例添加事件监听器
            if (this.requestURL && typeof this.requestURL === 'string' && this.requestURL.includes("GenerateContent")) {
                console.log(`[XHR Intercept] Attaching listener for ${this.requestURL}`);

                this.addEventListener('progress', function(event) {
                    if (targetXHR !== this) {
                        return;
                    }
                    responseIntercepted = true;
                    // event.currentTarget.response
                    // responseText in progress might give you chunks, but gRPC framing is an issue
                    console.log(`[XHR Intercept] PROGRESS event for ${this.status} ${this.requestURL}`);
                    // This part is tricky due to gRPC-Web framing.
                    // A simple concatenation of responseText might not work.
                    // You'd ideally want to work with response (if arraybuffer) and decode frames.
                    // For text-based gRPC-Web, chunks might appear in responseText
                    if (this.status < 200 || this.status >= 300) {
                        sendError(this.responseText);
                        restoreHttpRequest();
                        return;
                    }
                    if (this.responseText) {
                        // The challenge is that responseText might give you parts of the base64 string
                        // or parts of the JSON array structure across progress events.
                        // The end of this.responseText might not be a complete message.
                        // You'd need a robust parser.
                        let accData = this.responseText.substring(accumulatedData.length);
                        // console.log('  Partial responseText in progress:',this.responseText.length,accData );
                        accumulatedData = this.responseText; // This is a simplification
                        sendResponse(accData);
                    }
                });



                this.addEventListener('error', function() {
                    if (targetXHR !== this) {
                        return;
                    }
                    console.error(`[XHR Intercept] ERROR event for ${this.status} ${this.requestURL}: Network error or CORS issue.`);
                    sendError('error');
                    restoreHttpRequest();
                });

                this.addEventListener('timeout', function() {
                    if (targetXHR !== this) {
                        return;
                    }
                    console.warn(`[XHR Intercept] TIMEOUT event for ${this.status} ${this.requestURL}.`);
                    sendError('timeout');
                    restoreHttpRequest();
                });

                // 如果你需要更细致地跟踪状态变化，可以使用 readystatechange
                this.addEventListener('readystatechange', function() {
                    if (targetXHR !== this) {
                        return;
                    }
                    console.log(`[XHR Intercept] READYSTATECHANGE for ${this.status} , ${this.readyState}`);
                    if (this.readyState === XMLHttpRequest.DONE || this.readyState === XMLHttpRequest.UNSENT) { // DONE = 4 UNSENT= 0
                        sendFinishResponse('');
                        restoreHttpRequest();
                    }
                });


                // models/gemini-2.5-pro-exp-03-25
                let payload = JSON.parse(data);
                payload[0] = 'models/'+requestBody.modelName;
                requestBody.stop && (payload[3][1] = [requestBody.stop]);
                requestBody.max_tokens && (payload[3][3] = requestBody.max_tokens);
                requestBody.top_p && (payload[3][5] = requestBody.top_p);
                if(requestBody.thinking){
                    payload[3][16] = [1,-1];
                }else{
                    payload[3][16] = [0,-1];
                }
                const modifiedData = JSON.stringify(payload);
                return originalXHRSend.call(this, modifiedData);
            }
            return originalXHRSend.apply(this, arguments);
        };

        // 超时处理
        setTimeout(() => {
            if (!responseIntercepted && isProcessing) {
                log('响应超时，恢复原始方法');
                restoreHttpRequest();
                // window.fetch = originalFetch;
                sendError('响应超时');

            }
        }, 128000);
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

    // 辅助函数：睡眠
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
            const textarea = document.querySelector('ms-autosize-textarea textarea.textarea');
            const button = document.querySelector('run-button button.run-button');
            if (textarea && button) {
                //log('页面元素已就绪');
            }else{
                log('⚠️页面元素未找到');
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
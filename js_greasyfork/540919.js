// ==UserScript==
// @name         VERTEX AI
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  通过WebSocket自动填充提示词并执行
// @author       You
// @match        https://console.cloud.google.com/vertex-ai/studio/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540919/VERTEX%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/540919/VERTEX%20AI.meta.js
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
    const WS_URL = 'ws://localhost:7666'; // WebSocket端口
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

                if (data.type === 'prompt') {
                    if(isProcessing){
                        sendError('正在处理中');
                        return;
                    }
                    if(!data.contents || data.contents.length === 0){
                        sendError('提示词为空');
                        return;
                    }
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
        // Extract project ID from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        console.log('urlParams', urlParams);
        let projectId = urlParams.get('project');
        if (!projectId || projectId.length === 0) {
            projectId = 'project_' + Math.random().toString(36).substr(2, 9);
        }
        
        // Try to get account info as fallback
        let retry = 0;
        while (retry < 5) {
            const accountButton = document.querySelector('button.cfc-accountchooser-link[aria-label*="Account:"]');
            console.log('accountButton', accountButton);
            if (accountButton) {
                const ariaLabel = accountButton.getAttribute('aria-label');
                // 从aria-label中提取邮箱，格式为"Account: Name (email@example.com)"
                const emailMatch = ariaLabel && ariaLabel.match(/\(([^)]+)\)/);
                if (emailMatch && emailMatch[1]) {
                    return emailMatch[1]+'_'+projectId;
                } else if (ariaLabel) {
                    return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + ariaLabel+'_'+projectId;;
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            retry++;
        }
        
        // If all else fails, return a random client ID
        return 'client_' + Math.random().toString(36).substr(2, 9)+'_'+projectId;;
    }

    // 方法1: 直接点击元素（推荐用于 SPA）
    function clickLogoLink() {
        // 查找 Auto-clear 按钮
        // mat-button-toggle auto-clear-button mat-button-toggle-standalone cfc-tooltip cfc-tooltip-disable-user-select-on-touch-device
        const autoClearButton1 = document.querySelector('button.mat-button-toggle-button[aria-label="Auto-clear"]');
        const autoClearButton2 = document.querySelector('button.mat-button-toggle-button[aria-label="自动清除"]');
        const autoClearButton3 = document.querySelector('button.mat-button-toggle-button[cfctooltip="自动清除"]');
        const autoClearButton = autoClearButton1 || autoClearButton2 || autoClearButton3
        if (autoClearButton) {
            const ariaPressed = autoClearButton.getAttribute('aria-pressed');
            if (ariaPressed === 'false') {
                autoClearButton.click();
                console.log('点击了 Auto-clear 按钮');
                return true;
            } else {
                console.log('Auto-clear 按钮已启用 (aria-pressed=' + ariaPressed + ')，无需点击');
                return true;
            }
        }
        console.log('未找到 Auto-clear 按钮');
        return false;
    }
    // 处理提示词
    async function processPrompt(data) {
        const contents = data.contents;
        const modelName = data.modelName;
        log('开始处理提示词:',modelName, contents.length);

        try {
            let clickLogoSuccessed = clickLogoLink();
            if(!clickLogoSuccessed){
                throw new Error('点击Auto-clear失败');
            }
            // if(!clickLogoSuccessed){
            //     let menuBtn = document.querySelector('button[mat-icon-button][color="primary"][aria-haspopup="menu"]')
            //     if(menuBtn){
            //         menuBtn.click();
            //         await new Promise(resolve => setTimeout(resolve, 500));
            //         clickLogoSuccessed = clickLogoLink();
            //         if(!clickLogoSuccessed){
            //             sendLog('点击Clear失败2');
            //         }
            //     }else{
            //         sendLog('点击Clear失败1');
            //     }
            // }
//             <button type="button" class="mat-button-toggle-button mat-focus-indicator" sandboxuid="0" id="_0rif_mat-button-toggle-4-button" role="button" tabindex="0" aria-pressed="false" aria-label="Auto-clear" aria-labelledby="_0rif_mat-button-toggle-4-button _0rif_cfc-labelledby-message-goog_1079189009" cfc-labelledby-host=""><!----><span class="mat-button-toggle-label-content" sandboxuid="0"><cm-icon _ngcontent-ng-c2585504229="" _nghost-ng-c2497461059="" sandboxuid="0"><svg data-icon-name="refreshIcon" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" sandboxuid="0"><path fill-rule="evenodd" d="M13.95 4.05A7 7 0 1015.93 10H13.9A5 5 0 014 9a5 5 0 018.536-3.536L10 8h6V2l-2.05 2.05z" sandboxuid="0"></path></svg></cm-icon> Auto-clear
// </span></button>
            await new Promise(resolve => setTimeout(resolve, 500));
            // 查找ql-editor元素
            let retry=0;
            let editorElement;
            while(retry<3){
                retry++;
                // <div class="ql-editor" sandboxuid="0" data-gramm="false" contenteditable="true" data-placeholder="撰写提示，或使用 /commands"><div sandboxuid="0">Please provide an income statement analysis.</div></div>
                const editorElement1 = document.querySelector('div.ql-editor[contenteditable="true"]');
                const editorElement2 = document.querySelector('div.ql-editor[contenteditable="true"][data-placeholder="Write a prompt, or use /commands"]');
                const editorElement3 = document.querySelector('div.ql-editor[contenteditable="true"][data-placeholder="撰写提示，或使用 /commands"]');
                editorElement = editorElement1 || editorElement2 || editorElement3;
                if(!editorElement){
                    log('获取失败，尝试重新获取:');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                if(editorElement){
                    break;
                }
            }

            if (!editorElement) {
                throw new Error('未找到输入框');
            }
            
            editorElement.textContent = 'hello world'; // 清空内容
            await new Promise(resolve => setTimeout(resolve, 500));


            // 等待按钮可用
            await waitForRunButton();

            // 开始监听响应
            interceptResponse(data);

            // 点击运行按钮
            await clickRunButton();
            sendLog('点击运行按钮');

            // clickLogoLink();
        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
            isProcessing = false;
        }
    }

    // 等待运行按钮可用
    async function waitForRunButton(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            const button1 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="Submit"]');
            const button2 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="提交"]');
            const button = button1||button2
            // const editorElement = editorElement1 || editorElement2
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
        const button1 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="Submit"]');
        const button2 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="提交"]');
        const button = button1||button2
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
        let sendSuccessed = false;

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

        // Replace single targetXHR with a map of tracked XHRs
        let trackedXHRs = new Map();
        // let targetXHR = null;
        // let requestURL;
        // let requestMethod;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            // log('open url',url);
            // 存储一些信息到 XHR 实例上，以便后续使用
            if (url.includes('/AIPLATFORM_GRAPHQL')) {
                log('记录GenerateContent XHR请求:', url);
                // targetXHR = this;
                // this.requestURL = url;
                // requestURL = url;
                // requestMethod = method;
                trackedXHRs.set(this, {
                    url: url,
                    method: method,
                    requestURL: url,
                    requestMethod: method
                });
                log(`[XHR Intercept] OPEN: ${method} ${url}`);
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        // // 保存请求头
        // const requestHeaders = new Map();
        // XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        //     if (targetXHR === this) {
        //         requestHeaders.set(name, value);
        //         log(`设置请求头: ${name} = ${value}`);
        //     }
        //     return originalXHRSetRequestHeader.apply(this, arguments);
        // };

        let accumulatedData = '';
        XMLHttpRequest.prototype.send = function(data) {
            const trackedXHR = trackedXHRs.get(this);
            // if (trackedXHR) {
                log(`[XHR Intercept] Sending data to ${trackedXHR.url} `);
            //     // 在这里处理数据
            // }
            // if (targetXHR === this) {
            //     log('发送XHR请求数据:', data ? data.substring(0, 200) + '...' : 'null');
            // }
            // 关键：在这里为当前 XHR 实例添加事件监听器
            if (trackedXHR.requestURL && typeof trackedXHR.requestURL === 'string' && trackedXHR.requestURL.includes("AIPLATFORM_GRAPHQL")) {
                let payload = JSON.parse(data);
                if(payload.operationName === 'StreamGenerateContentAnonymous' || payload.operationName === 'StreamGenerateContent'){
                    console.log(`[XHR Intercept] Attaching payload.operationName: ${payload.operationName} listener for ${trackedXHR.requestURL} `);
                    sendSuccessed = true;
                    // targetXHR = this;
                    this.addEventListener('progress', function(event) {
                        // if (trackedXHR !== this) {
                        //     return;
                        // }
                        responseIntercepted = true;
                        // event.currentTarget.response
                        // responseText in progress might give you chunks, but gRPC framing is an issue
                        console.log(`[XHR Intercept] PROGRESS event for ${this.status} ${this.responseText.length}`);
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
                        // if (trackedXHR !== this) {
                        //     return;
                        // }
                        console.error(`[XHR Intercept] ERROR event for ${this.status} ${this.requestURL}: Network error or CORS issue.`);
                        sendError('error');
                        restoreHttpRequest();
                    });

                    this.addEventListener('timeout', function() {
                        // if (trackedXHR !== this) {
                        //     return;
                        // }
                        console.warn(`[XHR Intercept] TIMEOUT event for ${this.status} ${this.requestURL}.`);
                        sendError('timeout');
                        restoreHttpRequest();
                    });

                    // 如果你需要更细致地跟踪状态变化，可以使用 readystatechange
                    this.addEventListener('readystatechange', function() {
                        // if (trackedXHR !== this) {
                        //     return;
                        // }
                        console.log(`[XHR Intercept] READYSTATECHANGE for ${this.status} , ${this.readyState}`);
                        if (this.readyState === XMLHttpRequest.DONE || this.readyState === XMLHttpRequest.UNSENT) { // DONE = 4 UNSENT= 0
                            sendFinishResponse('');
                            restoreHttpRequest();
                        }
                    });


                    
                    
                    payload.variables.contents = requestBody.contents;

                    if(payload.variables.region){
                        payload.variables.model = requestBody.modelName;
                        payload.variables.region = "global";
                    }else{
                        const headerPart = payload.variables.model.lastIndexOf('/');
                        payload.variables.model = payload.variables.model.substring(0,headerPart+1)+requestBody.modelName;
                        // "projects/aerial-tide-460503-u0/locations/global/publishers/google/models/gemini-2.5-flash";
                        // "gemini-2.5-flash"
                    }
                    // or
                    //
                    requestBody.system_instruction && (payload.variables.systemInstruction = requestBody.system_instruction);
                    payload.variables.safetySettings = requestBody.safetySettings;
                    requestBody.top_p && (payload.variables.generationConfig.topP = requestBody.top_p);
                    requestBody.max_tokens && (payload.variables.generationConfig.maxOutputTokens = requestBody.max_tokens);
                    requestBody.temperature && (payload.variables.generationConfig.temperature = requestBody.temperature);
                    requestBody.imageConfig && (payload.variables.generationConfig.imageConfig = requestBody.imageConfig);
                    requestBody.responseModalities && (payload.variables.generationConfig.responseModalities = requestBody.responseModalities);

                    if(requestBody.thinking){
                        payload.variables.generationConfig.thinkingConfig = {
                            thinkingBudget: -1
                        }
                    }else{
                        payload.variables.generationConfig.thinkingConfig = {
                            thinkingBudget: 128
                        }
                    }
                    const modifiedData = JSON.stringify(payload);
                    return originalXHRSend.call(this, modifiedData);
                }
            }
            return originalXHRSend.apply(this, arguments);
        };

        setTimeout(() => {
            if (!sendSuccessed && isProcessing) {
                log('发送超时，恢复原始方法');
                restoreHttpRequest();
                // window.fetch = originalFetch;
                sendError('发送超时');
            }
        }, requestBody.timeout || 9000);

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
        if (ws && ws.readyState === WebSocket.OPEN) {
            log('发送错误信息:', error);
            ws.send(JSON.stringify({
                type: 'response',
                requestId: currentRequestId,
                error: error,
                success: false
            }));
        }
        currentRequestId = null;
    }

    // 发送日志
    function sendLog(info) {
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送日志:', info);
            ws.send(JSON.stringify({
                type: 'info',
                requestId: currentRequestId,
                info: info,
                success: true
            }));
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
            const editorElement1 = document.querySelector('div.ql-editor[contenteditable="true"][data-placeholder=" "]');
            const editorElement2 = document.querySelector('div.ql-editor[contenteditable="true"][data-placeholder="Write your prompt here"]');
            const button1 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="Submit"]');
            const button2 = document.querySelector('button[instrumentationid="prompt-submit-button"][aria-label="提交"]');
            const button = button1||button2
            const editorElement = editorElement1 || editorElement2
            if (!editorElement) {
                log('⚠️editorElement输入框未找到');
            }else if(!button){
                log('⚠️button运行按钮未找到');
            }else{
                log('页面元素已就绪');
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
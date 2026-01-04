// ==UserScript==
// @match *
// @name         AI内容捕获模块
// @version      3.0
// @license MIT
// @namespace http://tampermonkey.net/  // Optional: Change to your namespace (e.g., your website or GitHub)
// @description 在页面上添加一个可拖动、可折叠、带标签切换和新控件的紫色主题交互式面板。
// @downloadURL https://update.greasyfork.org/scripts/534231/AI%E5%86%85%E5%AE%B9%E6%8D%95%E8%8E%B7%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/534231/AI%E5%86%85%E5%AE%B9%E6%8D%95%E8%8E%B7%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==

var ContentCaptureModule = (function() {
    'use strict';

    const SCRIPT_NAME = 'AI内容捕获模块 v1.2';
    let DEBUG = false; // 可由 init 配置

    // --- 默认配置 ---
    const DEFAULT_CONFIG = {
        debug: false,
        chatContainerSelector: '.mx-auto.pt-24.w-full.max-w-\\[720px\\].px-4.relative',
        aiMessageSelector: '#ai-chat-answer',
        aiReplyBodySelector: '.markdown-body',
        integralTextPattern: /消耗\s*\d+\s*积分/,
        sectionsToExtract: [
            { key: 'thinking', selector: 'div.thinking-area', description: '思考区', extractMethod: 'innerHTML' },
            { key: 'textBody', selector: 'div.text-body', description: '回复主体', extractMethod: 'innerHTML' },
            { key: 'statusBar', selector: 'div.status-bar', description: '状态栏', extractMethod: 'innerHTML' },
            { key: 'memoryArea', selector: 'div.memory-area', description: '记忆区', extractMethod: 'innerHTML' },
            { key: 'optionsArea', selector: 'div.options-area ol', description: '选项区列表', extractMethod: 'innerHTML' } // 直接取 ol 的内容
        ],
         optionItemSelector: 'div.options-area ol li', // 用于提取 optionTexts
         optionTextRegex: /\[(.*?)\]/, // 用于提取选项文本
        maxObserverRetries: 5,
        observerRetryDelayBase: 2000
    };

    // --- 模块状态变量 ---
    let mainObserver = null;
    let currentContentObserver = null;
    let watchingAiNode = null;
    let latestFullyLoadedAiNode = null;
    let observerRetryCount = 0;
    let currentConfig = { ...DEFAULT_CONFIG };
    let updateCallback = null; // 由 init 传入
    let isRunning = false;

    // --- 工具函数 ---
    const log = (...args) => currentConfig.debug && console.log(`[${SCRIPT_NAME}]`, ...args);
    const logInfo = (...args) => console.log(`[${SCRIPT_NAME}]`, ...args); // 关键信息
    const logError = (...args) => console.error(`[${SCRIPT_NAME}] [ERROR]`, ...args);

    // --- 核心功能：提取内容 (修改自 extractAndLogContent) ---
    function extractContent(aiMessageNode) {
        if (!aiMessageNode) { /* ... 错误处理 ... */ return null; }
        log(`Starting content extraction from node: ${aiMessageNode.id}`);
        const contentBody = aiMessageNode.querySelector(currentConfig.aiReplyBodySelector);
        if (!contentBody) { /* ... 错误处理 ... */ return null; }

        const extractedData = {
            timestamp: new Date().toISOString(),
            messageId: aiMessageNode.id || 'N/A',
            // rawHtmlBody: contentBody.innerHTML, // 可以移除或保留用于调试
            sections: {}
        };

        currentConfig.sectionsToExtract.forEach(config => {
            const sectionElement = contentBody.querySelector(config.selector);
            if (sectionElement) {
                if (config.extractMethod === 'innerHTML') {
                    extractedData.sections[config.key] = sectionElement.innerHTML.trim();
                } else { // 默认或指定 innerText
                    extractedData.sections[config.key] = sectionElement.innerText.trim();
                }
                log(`   -> Extracted [${config.key}] using ${config.extractMethod}`);
            } else {
                extractedData.sections[config.key] = null; // 用 null 表示未找到，而不是字符串
                log(`   -> Section [${config.key}] not found using selector: ${config.selector}`);
            }
        });

         // 单独提取选项文本 (使用配置)
        const optionItems = contentBody.querySelectorAll(currentConfig.optionItemSelector);
         if (optionItems.length > 0) {
             extractedData.sections.optionTexts = Array.from(optionItems).map(li => {
                 const textContent = li.textContent?.trim();
                 const match = currentConfig.optionTextRegex ? textContent.match(currentConfig.optionTextRegex) : null;
                 // 如果正则匹配到，取捕获组1；否则取整个文本；如果正则为null，也取整个文本
                 return match ? match[1].trim() : textContent;
             }).filter(text => text);
             log(`   -> Extracted specific option texts:`, extractedData.sections.optionTexts);
         } else {
             extractedData.sections.optionTexts = []; // 未找到选项 li 或列表容器
             log(`   -> No option items found using selector: ${currentConfig.optionItemSelector}`);
         }

        log("Content extraction complete:", extractedData);
        return extractedData; // 返回数据，不在此处 log
    }

    // --- 清理内容观察器 ---
    function disconnectContentObserver() { /* ... 代码基本不变 ... */ }

    // --- 内部内容观察器的回调 ---
    const contentObserverCallback = function(mutationsList, observer) {
        if (!watchingAiNode || !updateCallback) return; // 增加 updateCallback 检查
        let integralFound = currentConfig.integralTextPattern.test(watchingAiNode.textContent);

        if (integralFound) {
            log(`Completion pattern found in node: ${watchingAiNode.id}. Finalizing capture.`);
            latestFullyLoadedAiNode = watchingAiNode;
            disconnectContentObserver();
            const data = extractContent(latestFullyLoadedAiNode); // 获取数据
            if (data) {
                log("Invoking updateCallback with extracted data.");
                updateCallback(data); // **调用回调函数**
            } else {
                logError("Extraction failed after completion detected.");
            }
        }
    };

    // --- 主 MutationObserver 回调 ---
    const mainObserverCallback = function(mutationsList, observer) {
        if (!updateCallback) return; // 增加 updateCallback 检查
        let newAiMessageNode = null;
        // ... (查找 newAiMessageNode 的逻辑不变, 使用 currentConfig.aiMessageSelector) ...

        if (newAiMessageNode) {
            log(`New AI message node detected: ${newAiMessageNode.id || '(no id)'}`);
            disconnectContentObserver();
            watchingAiNode = newAiMessageNode;

            if (currentConfig.integralTextPattern.test(watchingAiNode.textContent)) {
                log(`Completion pattern found immediately in new node: ${watchingAiNode.id}.`);
                latestFullyLoadedAiNode = watchingAiNode;
                const data = extractContent(latestFullyLoadedAiNode);
                if (data) {
                     log("Invoking updateCallback for immediately complete node.");
                     updateCallback(data); // **调用回调函数**
                } else {
                     logError("Extraction failed for immediately complete node.");
                }
                watchingAiNode = null; // 处理完毕
            } else {
                log(`Setting up content observer for node: ${watchingAiNode.id}`);
                // ... (设置 currentContentObserver 的逻辑不变) ...
            }
        }
    };

    // --- 查找并设置主观察器 ---
    function setupObserver() {
        const targetNode = document.querySelector(currentConfig.chatContainerSelector);
        if (targetNode) {
            log(`Starting Main Observer on ${currentConfig.chatContainerSelector}.`);
            // ... (设置 mainObserver 的逻辑不变, 使用 mainObserverCallback) ...
            mainObserver.observe(targetNode, { childList: true, subtree: false });
            observerRetryCount = 0;
            isRunning = true; // 标记为运行中
            log('Main Observer started.');

            // 初始加载检查 (逻辑不变, 但提取后调用回调)
            const existingAiMessages = targetNode.querySelectorAll(currentConfig.aiMessageSelector);
            if (existingAiMessages.length > 0) {
               const lastExistingMessage = existingAiMessages[existingAiMessages.length - 1];
               if (currentConfig.integralTextPattern.test(lastExistingMessage.textContent)) {
                    latestFullyLoadedAiNode = lastExistingMessage;
                    const data = extractContent(latestFullyLoadedAiNode);
                    if (data && updateCallback) { // 检查回调是否存在
                        log("Invoking updateCallback for existing complete message on load.");
                        updateCallback(data); // **调用回调函数**
                    } else if (!data) {
                         logError("Extraction failed for existing complete message on load.");
                    }
               } else {
                    // ... (设置 currentContentObserver 观察现有未完成消息的逻辑不变) ...
               }
            }

        } else {
            observerRetryCount++;
            logError(`Chat container not found. Retry ${observerRetryCount}/${currentConfig.maxObserverRetries}...`);
            if (observerRetryCount < currentConfig.maxObserverRetries) {
                setTimeout(setupObserver, currentConfig.observerRetryDelayBase * observerRetryCount);
            } else {
                logError(`Failed to find chat container. Observer not started.`);
                isRunning = false; // 标记为未运行
            }
        }
    }

    // --- 公共接口方法 ---
    function init(config = {}, callback) {
         currentConfig = { ...DEFAULT_CONFIG, ...config }; // 合并配置
         DEBUG = currentConfig.debug; // 更新 DEBUG 标志
         if (typeof callback !== 'function') {
             logError("Initialization failed: updateCallback must be a function.");
             return false;
         }
         updateCallback = callback;
         logInfo("ContentCaptureModule initialized. Config:", currentConfig);
         return true;
    }

    function start() {
        if (isRunning) {
            log("Observer already running.");
            return;
        }
        if (!updateCallback) {
             logError("Cannot start: Module not initialized with a callback function.");
             return;
        }
        logInfo("Starting content observation...");
        observerRetryCount = 0; // 重置重试计数器
        setupObserver(); // 开始尝试设置观察器
    }

    function stop() {
        logInfo("Stopping content observation...");
        disconnectContentObserver();
        if (mainObserver) {
            mainObserver.disconnect();
            mainObserver = null;
            log('Main Observer disconnected.');
        }
        isRunning = false; // 标记为停止
        watchingAiNode = null;
        // latestFullyLoadedAiNode 保留，refresh 可能会用到
    }

    function refresh() {
        logInfo("Manual refresh triggered.");
        if (!updateCallback) {
             logError("Cannot refresh: Module not initialized.");
             return Promise.reject("Module not initialized.");
        }

        const aiMessages = document.querySelectorAll(currentConfig.aiMessageSelector);
        if (aiMessages.length > 0) {
             const latestMessage = aiMessages[aiMessages.length - 1];
             log(`Found latest AI message (ID: ${latestMessage.id}) for refresh.`);
             const data = extractContent(latestMessage); // 直接提取最新的
             if (data) {
                 log("Invoking updateCallback with refreshed data.");
                 updateCallback(data);
                 return Promise.resolve(data); // 返回提取到的数据
             } else {
                 logError("Extraction failed during manual refresh.");
                 return Promise.reject("Extraction failed during refresh.");
             }
        } else {
             logInfo("No AI messages found on page for refresh.");
             // 可以选择调用回调传递一个空状态，或者什么都不做
             // updateCallback({ timestamp: new Date().toISOString(), sections: {}, isEmpty: true });
             return Promise.resolve(null); // 表示没有内容可刷新
        }
    }

    // 清理事件监听器
    window.addEventListener('beforeunload', stop);

    // --- 返回模块的公共接口 ---
    return {
        init: init,
        start: start,
        stop: stop,
        refresh: refresh,
        isRun: () => { // 添加一个状态检查方法
            return isRunning;
        }
    };

})();
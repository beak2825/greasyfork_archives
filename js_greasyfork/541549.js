// ==UserScript==
// @name         PonyTown自动翻译
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      GPL-3.0-only
// @description  ponytown自动翻译, 请自行申请彩云小译文本翻译api的token以获得最好的服务
// @author       Lonel
// @match        https://pony.town/*
// @match        https://event.pony.town/*
// @match        https://eventgreen.pony.town/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541549/PonyTown%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/541549/PonyTown%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置默认值
    const DEFAULT_CONFIG = {
        token: "3975l6lr5pcbvidl6jl2",
        direction: "auto2zh",
        checkInterval: 100,
        batchInterval: 3000,
        batchSize: 5,
        maxQueueLength: 100,
        retryTimes: 0,
        cooldownTime: 10000
    };

    // 初始化配置
    function initConfig() {
        const savedConfig = GM_getValue('ponyTownTranslateConfig');
        if (!savedConfig) {
            GM_setValue('ponyTownTranslateConfig', DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }
        const mergedConfig = { ...DEFAULT_CONFIG, ...savedConfig };
        GM_setValue('ponyTownTranslateConfig', mergedConfig);
        return mergedConfig;
    }

    let CONFIG = initConfig();

    let isRateLimited = false;
    let rateLimitEndTime = 0;


    function restartTimers() {
    if (checkTimer) clearInterval(checkTimer);
    if (batchTimer) clearInterval(batchTimer);
    checkTimer = setInterval(checkMessages, CONFIG.checkInterval);
    startBatchProcessor();
    console.log("已重启定时器，应用新配置");
    }

    GM_registerMenuCommand('配置PonyTown翻译', () => {
        const configStr = prompt('请输入翻译配置（JSON格式）：', JSON.stringify(CONFIG, null, 2));
        if (configStr) {
            try {
                const newConfig = JSON.parse(configStr);
                if (typeof newConfig.token === 'string' &&
                    typeof newConfig.checkInterval === 'number' &&
                    typeof newConfig.batchInterval === 'number' &&
                    typeof newConfig.batchSize === 'number' &&
                    typeof newConfig.maxQueueLength === 'number' &&
                    typeof newConfig.retryTimes === 'number' &&
                    typeof newConfig.cooldownTime === 'number') {

                    CONFIG = newConfig;
                    GM_setValue('ponyTownTranslateConfig', newConfig);
                    alert('配置已保存');
                } else {
                    alert('配置格式错误，缺少必要参数或参数类型不正确');
                }
            } catch (e) {
                alert('JSON格式错误：' + e.message);
            }
        }
    });

    const container = document.createElement('div');
    container.id = 'translation-controls';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    const translateBtn = document.createElement('button');
    translateBtn.id = 'translate-btn';
    translateBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" style="width: 24px; height: 24px; vertical-align: middle;"><path fill="currentColor" d="m250.73 210.63l-56-112a12 12 0 0 0-21.46 0l-20.52 41A84.2 84.2 0 0 1 114 126.22A107.5 107.5 0 0 0 139.33 68H160a12 12 0 0 0 0-24h-52V32a12 12 0 0 0-24 0v12H32a12 12 0 0 0 0 24h83.13A83.7 83.7 0 0 1 96 110.35A84 84 0 0 1 83.6 91a12 12 0 1 0-21.81 10A107.6 107.6 0 0 0 78 126.24A83.54 83.54 0 0 1 32 140a12 12 0 0 0 0 24a107.47 107.47 0 0 0 64-21.07a108.4 108.4 0 0 0 45.39 19.44l-24.13 48.26a12 12 0 1 0 21.46 10.73L151.41 196h65.17l12.68 25.36a12 12 0 1 0 21.47-10.73M163.41 172L184 130.83L204.58 172Z"/></svg>`;
    translateBtn.style.cursor = 'pointer';
    translateBtn.style.backgroundColor = '#00000000';
    translateBtn.style.color = 'white';
    translateBtn.style.border = 'none';
    translateBtn.style.borderRadius = '4px';
    translateBtn.style.display = 'flex';
    translateBtn.style.alignItems = 'center';
    translateBtn.style.justifyContent = 'center';

    const select = document.createElement('select');
    select.id = 'language-select';

    const style = document.createElement('style');
    style.textContent = `
        #language-select {
            -webkit-appearance: none;
           -moz-appearance: none;
            appearance: none;
            background: transparent;
            border: none;
            outline: none;
            padding: 0 15px 0 5px;
            margin: 0;
            width: auto;
            font-family: inherit;
            font-size: 14px;
            color: white;
            cursor: pointer;
            font-weight: 500;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right center;
            background-size: 16px;
        }
        #language-select option {
            background: #2d2d2d;
            color: white;
            border: none;
            outline: none;
            padding: 8px 12px;
        }
        #language-select option:hover {
            background: #000;
        }
        #language-select::-ms-expand {
            display: none;
        }
        #translate-btn:hover {
            background-color: #000000;
        }
        .translation-controls-added {
            padding-right: 175px !important;
        }
        .translation-controls-added-long {
            padding-right: 195px !important;
        }
    `;
    document.head.appendChild(style);

    const languages = ['Chinese', 'English', 'Russian', 'Spanish', 'Portuguese', 'Indonesian'];
    const languageCodes = ['zh', 'en', 'ru', 'es', 'pt', 'id'];

    languages.forEach((lang, index) => {
        const option = document.createElement('option');
        option.value = languageCodes[index];
        option.textContent = lang;
        select.appendChild(option);
    });

    function adjustSelectWidth() {
        const selectedText = select.options[select.selectedIndex].textContent;
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.font = 'inherit';
        tempSpan.style.fontSize = '14px';
        tempSpan.style.padding = '6px 10px';
        tempSpan.textContent = selectedText;
        document.body.appendChild(tempSpan);
        select.style.width = `${tempSpan.getBoundingClientRect().width + 5}px`;
        document.body.removeChild(tempSpan);
    }

    adjustSelectWidth();
    select.addEventListener('change', adjustSelectWidth);

    const hiddenDiv = document.createElement('div');
    hiddenDiv.id = 'translation-data';
    hiddenDiv.style.display = 'none';
    hiddenDiv.dataset.targetLanguage = 'en';
    hiddenDiv.dataset.translationStatus = 'translated';
    document.body.appendChild(hiddenDiv);

    async function caiyunTranslate(texts, direction = CONFIG.direction) {
        if (isRateLimited) {
            const remainingTime = rateLimitEndTime - Date.now();
            if (remainingTime > 0) {
                console.log(`API频率限制中，剩余${Math.ceil(remainingTime / 1000)}秒`);
                return texts.map(text => `[翻译频率限制中，请稍后再试] ${text}`);
            } else {
                isRateLimited = false;
                console.log("API频率限制已解除，恢复翻译服务");
            }
        }

        if (Date.now() - lastErrorTime < CONFIG.cooldownTime) {
            return texts.map(text => `[翻译服务冷却中] ${text}`);
        }

        const url = "https://api.interpreter.caiyunai.com/v1/translator";
        const payload = {
            source: texts,
            trans_type: direction,
            detect: direction.startsWith("auto")
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-authorization": "token " + CONFIG.token
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            //console.log(data);
            if (data.message === 'API rate limit exceeded') {
                isRateLimited = true;
                rateLimitEndTime = Date.now() + CONFIG.cooldownTime;
                console.warn(`API频率限制触发，将在${CONFIG.cooldownTime / 1000}秒后重试`);
                setTimeout(() => {
                    isRateLimited = false;
                    console.log("API频率限制已解除，恢复翻译服务");
                }, CONFIG.cooldownTime);
                return texts.map(text => `[翻译频率限制，已自动冷却${CONFIG.cooldownTime / 1000}秒] ${text}`);
            }

            if (!response.ok || !data?.target) {
                throw new Error(`API错误: ${response.status} ${data?.message || '无有效返回'}`);
            }
            return Array.isArray(data.target) ? data.target : texts.map(text => `[翻译异常] ${text}`);
        } catch (error) {
            lastErrorTime = Date.now();
            console.error("翻译API调用失败:", error);
            return texts.map(text => `[翻译失败] ${text}`);
        }
    }


    async function translateChatInput(targetLang) {
        const chatInput = document.querySelector('textarea[aria-label="Chat message"]');
        if (!chatInput || !chatInput.value.trim()) return;

        const cursorPos = chatInput.selectionStart;

        try {
            const originalValue = chatInput.value;
            chatInput.value = "翻译中...";

            const direction = `auto2${targetLang}`;
            const translations = await caiyunTranslate([originalValue], direction);

            if (translations && translations.length > 0 && !translations[0].startsWith("[")) {
                chatInput.value = translations[0];
                chatInput.focus();
                chatInput.selectionEnd = chatInput.value.length;
                console.log(`聊天框内容已翻译为${targetLang}`);
            } else {
                chatInput.value = originalValue;
                chatInput.focus();
                chatInput.selectionStart = chatInput.selectionEnd = cursorPos;
            }
        } catch (error) {
            console.error("翻译聊天框内容时出错:", error);
            chatInput.focus();
            chatInput.selectionStart = chatInput.selectionEnd = cursorPos;
        }
    }

    select.addEventListener('change',async function() {
        const targetLang = select.value;
        const hiddenData = document.getElementById('translation-data');
        hiddenData.dataset.targetLanguage = targetLang;
        console.log('翻译状态更新为:', targetLang);
        //CONFIG.direction = `auto2${targetLang}`;
    });

    translateBtn.addEventListener('click', async function() {
        const targetLang = select.value;
        const hiddenData = document.getElementById('translation-data');
        hiddenData.dataset.translationStatus = 'pending';
        await translateChatInput(targetLang);
    });

    function addControlsToUI() {
        let sendButton = document.querySelector('ui-button[aria-label="Send message"]');
        if (sendButton && sendButton.parentNode) {
            const controlsWrapper = document.createElement('div');
            controlsWrapper.style.display = 'flex';
            controlsWrapper.style.alignItems = 'center';

            controlsWrapper.appendChild(container);
            sendButton.parentNode.insertBefore(controlsWrapper, sendButton.nextSibling);
            return true;
        }
    }

    function adjustInputWidth() {
        const selectedText = select.options[select.selectedIndex].textContent;
        const textareaWrap = document.querySelector('.chat-textarea-wrap');
        if (!textareaWrap) return;
        textareaWrap.classList.remove('translation-controls-added', 'translation-controls-added-long');
        if (selectedText === "Portuguese" || selectedText === "Indonesian") {
            textareaWrap.classList.add('translation-controls-added-long');
        } else {
            textareaWrap.classList.add('translation-controls-added');
        }
    }

    function tryAddControls() {
        const textareaWrap = document.querySelector('.chat-textarea-wrap');
        if (textareaWrap) {
            adjustInputWidth();
            select.addEventListener('change', adjustInputWidth);
            return true;
        }
        return false;
    }

    function waitForGameLoad() {
        const isGameLoaded =
            document.body.className.includes('playing') ||
            document.querySelector('.chat-container') ||
            document.querySelector('.game-container') ||
            document.querySelector('.chat-textarea-wrap');

        if (isGameLoaded) {
            if (addControlsToUI() && tryAddControls()) {
                console.log("翻译按钮已成功添加");
                return true;
            }
        }
        return false;
    }

    let attempt = 0;
    const maxAttempts = 60;
    const intervalId = setInterval(() => {
        if (waitForGameLoad()) {
            clearInterval(intervalId);
        }
        attempt++;
    }, 1000); // 每1秒尝试一次

    container.appendChild(translateBtn);
    container.appendChild(select);

    const translationQueue = [];
    const processedMessages = new Set();
    const retryCounters = new Map();
    let lastErrorTime = 0;
    let batchTimer = null;

    async function processBatch() {
        const batch = [];
        const batchItems = [];
        const takeCount = Math.min(CONFIG.batchSize, translationQueue.length);

        for (let i = 0; i < takeCount; i++) {
            const item = translationQueue.shift();
            const msgId = `${item.timestamp}-${item.text}`;
            if (processedMessages.has(msgId)) continue;

            batch.push(item.text);
            batchItems.push({ ...item, msgId });
            processedMessages.add(msgId);
        }

        if (batch.length === 0) return;
        const translations = await caiyunTranslate(batch);
        for (let i = 0; i < batchItems.length; i++) {
            const { element, text, msgId } = batchItems[i];
            const translation = translations[i];
            if (translation === text || translation.startsWith("[")) {
                console.warn(`翻译无效被跳过: ${text}`);
                continue;
            }
            element.innerHTML += " | [翻译]: " + translation;
        }
        batchItems.forEach((item, index) => {
            if (translations[index].startsWith("[翻译失败]")) {
                const retryCount = retryCounters.get(item.msgId) || 0;
                if (retryCount < CONFIG.retryTimes) {
                    retryCounters.set(item.msgId, retryCount + 1);
                    translationQueue.unshift(item);
                    processedMessages.delete(item.msgId);
                }
            }
        });
        if (translationQueue.length > CONFIG.maxQueueLength) {
            translationQueue.splice(0, translationQueue.length - CONFIG.maxQueueLength);
        }
    }

    function checkMessages() {
        try {
            const chatLog = document.querySelector(".chat-log-scroll-inner");
            if (!chatLog) return;

            const messages = Array.from(chatLog.querySelectorAll(".chat-line.chat-line")).slice(-3);
            if (messages.length === 0) return;

            for (const message of messages) {
                try {
                    if (!message.classList.contains("translated")
                        && !message.classList.contains("chat-line-meta-line")
                        && !message.classList.contains("chat-line-system")
                        && !message.classList.contains("chat-line-announcement")
                        && !message.classList.contains("chat-line-whisper-announcement")
                        && !message.classList.contains("chat-line-party-announcement")){
                        const timestampElement = message.querySelector(".chat-line-timestamp");
                        const nameElement = message.querySelector(".chat-line-name-content");
                        const messageElement = message.querySelector(".chat-line-message");

                        if (!timestampElement || !messageElement) continue;

                        const timestamp = timestampElement.textContent.trim();
                        const name = nameElement?.isConnected ? nameElement.textContent.trim() : "匿名";
                        const text = messageElement.textContent.trim();
                        const msgId = `${timestamp}-${text}`;
                        if (text && !translationQueue.some(item => `${item.timestamp}-${item.text}` === msgId) && !processedMessages.has(msgId)) {
                            message.classList.add("translated");

                            const hasMeaningfulContent = /[a-zA-Z\u4e00-\u9fa5]/.test(text);
                            if (!text || !hasMeaningfulContent) {
                                console.debug(`忽略无意义文本: ${text}`);
                                continue;
                            }

                            translationQueue.push({
                                element: messageElement,
                                text,
                                timestamp,
                                name
                            });
                        }
                    }
                } catch (innerError) {
                    console.warn("单条消息处理错误:", innerError);
                }
            }
        } catch (error) {
            console.error("消息检查出错:", error);
        }
    }

    function startBatchProcessor() {
        if (batchTimer) clearInterval(batchTimer);
        batchTimer = setInterval(() => {
            processBatch().catch(err => console.error("批量处理异常:", err));
        }, CONFIG.batchInterval);
    }

    startBatchProcessor();
    const checkTimer = setInterval(checkMessages, CONFIG.checkInterval);

    window.addEventListener("beforeunload", () => {
        clearInterval(checkTimer);
        if (batchTimer) clearInterval(batchTimer);
    });
})();
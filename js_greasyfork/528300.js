// ==UserScript==
// @name             AI助手選擇器
// @name:en          AI Assistant Selector
// @namespace        http://tampermonkey.net/
// @version          3.2
// @description      一個 Tampermonkey 腳本，提供浮動介面整合多款 AI 助手，支援右鍵呼叫、清空歷史訊息、可調整尺寸，並記錄 AI 選擇狀態與位置，從Tampermonkey 選單呼叫。
// @description:en   A Tampermonkey script that provides a floating interface integrating multiple AI assistants, supporting right-click invocation, clearing history messages, adjustable size, recording AI selection status and position, and callable from the Tampermonkey menu.
// @author           請替換成您的名字或暱稱 / Replace with your name or nickname
// @match            *://*/*
// @match            *://grok.com/*
// @match            *://chatgpt.com/*
// @match            *://chat.deepseek.com/*
// @icon             data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license          MIT
// @grant            GM_addStyle
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_xmlhttpRequest
// @grant            GM_openInTab
// @grant            GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528300/AI%E5%8A%A9%E6%89%8B%E9%81%B8%E6%93%87%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528300/AI%E5%8A%A9%E6%89%8B%E9%81%B8%E6%93%87%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 樣式定義（移除氣泡相關樣式）
    const styles = `
        .ai-selector-container {
            position: fixed;
            background: #2c2c2c;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            min-width: 200px;
            min-height: 200px;
            top: ${GM_getValue('containerTop', '50px')};
            left: ${GM_getValue('containerLeft', '50px')};
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            color: white;
            font-family: Arial, sans-serif;
            resize: both;
            overflow: auto;
        }
        .ai-selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
            background: #3a3a3a;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .ai-selector-title {
            font-size: 16px;
            font-weight: bold;
        }
        .ai-selector-minimize {
            cursor: pointer;
            padding: 5px;
        }
        .ai-selector-content {
            display: none;
            flex-direction: column;
            gap: 10px;
        }
        .ai-option {
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .ai-option:hover {
            background: rgba(255,255,255,0.1);
        }
        .ai-option.selected {
            background: #4285f4;
        }
        .ai-name {
            margin-left: 10px;
        }
        .question-input {
            width: 100%;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #444;
            background: #1c1c1c;
            color: white;
            margin-top: 10px;
            box-sizing: border-box;
        }
        .send-button {
            width: 100%;
            padding: 8px;
            border-radius: 5px;
            border: none;
            background: #4285f4;
            color: white;
            cursor: pointer;
            margin-top: 10px;
        }
        .send-button:hover {
            background: #5294ff;
        }
        .send-button:disabled {
            background: #666;
            cursor: not-allowed;
        }
        .clear-button {
            width: 100%;
            padding: 8px;
            border-radius: 5px;
            border: none;
            background: #e74c3c;
            color: white;
            cursor: pointer;
            margin-bottom: 10px;
        }
        .clear-button:hover {
            background: #ff6655;
        }
        .grok-response-container, .chatgpt-response-container, .deepseek-response-container {
            position: fixed;
            background: #2c2c2c;
            padding: 15px;
            border-radius: 10px;
            z-index: 9998;
            min-width: 200px;
            min-height: 200px;
            top: ${GM_getValue('grokResponseTop', '100px')};
            left: ${GM_getValue('grokResponseLeft', '100px')};
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            color: white;
            font-family: Arial, sans-serif;
            resize: both;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .grok-response-header, .chatgpt-response-header, .deepseek-response-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #3a3a3a;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: move;
            flex-shrink: 0;
            margin-bottom: 0;
        }
        .grok-response-title, .chatgpt-response-title, .deepseek-response-title {
            font-size: 16px;
            font-weight: bold;
        }
        .grok-response-close, .chatgpt-response-close, .deepseek-response-close {
            cursor: pointer;
            padding: 5px;
        }
        .grok-response, .chatgpt-response, .deepseek-response {
            padding: 10px;
            background: #1c1c1c;
            border-radius: 5px;
            border: 1px solid #444;
            color: white;
            white-space: pre-wrap;
            flex-grow: 1;
        }
        .grok-response p, .chatgpt-response p, .deepseek-response p {
            margin: 5px 0;
            padding: 5px;
            background: #333;
            border-radius: 3px;
        }
    `;

    // AI助手配置
    const AIs = [
        { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', inputSelector: 'rich-textarea.text-input-field_textarea', color: '#8e44ad' },
        { id: 'grok', name: 'Grok', url: 'https://grok.com/', color: '#e74c3c' },
        { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', color: '#27ae60' },
        { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/', color: '#3498db' },
        { id: 'deepseek', name: 'DeepSeek', url: 'https://chat.deepseek.com/', color: '#f1c40f' }
    ];

    // 添加樣式
    GM_addStyle(styles);

    // 拖動功能
    function makeDraggable(element, handle, saveKeyPrefix) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        let moved = false;

        const dragHandle = handle || element;

        dragHandle.addEventListener('mousedown', dragStart);

        function dragStart(e) {
            const rect = element.getBoundingClientRect();
            const isBottomRight = e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20;
            if (isBottomRight && element.style.resize === 'both') {
                return;
            }

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            isDragging = true;
            moved = false;

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        }

        function dragMove(e) {
            if (!isDragging) return;

            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));

            element.style.top = `${newTop}px`;
            element.style.left = `${newLeft}px`;

            moved = true;
        }

        function dragEnd(e) {
            if (!isDragging) return;

            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);

            isDragging = false;

            if (saveKeyPrefix && moved) {
                GM_setValue(`${saveKeyPrefix}Top`, element.style.top || `${element.offsetTop}px`);
                GM_setValue(`${saveKeyPrefix}Left`, element.style.left || `${element.offsetLeft}px`);
            }
        }
    }

    // 創建UI（移除氣泡）
    function createUI() {
        const container = document.createElement('div');
        container.className = 'ai-selector-container';
        container.style.display = 'none';

        const savedWidth = GM_getValue('containerWidth', 300);
        const savedHeight = GM_getValue('containerHeight', 300);
        const savedTop = GM_getValue('containerTop', '50px');
        const savedLeft = GM_getValue('containerLeft', '50px');

        container.style.width = `${Math.max(savedWidth, 200)}px`;
        container.style.height = `${Math.max(savedHeight, 200)}px`;
        container.style.top = savedTop;
        container.style.left = savedLeft;

        const header = document.createElement('div');
        header.className = 'ai-selector-header';
        const title = document.createElement('div');
        title.className = 'ai-selector-title';
        title.textContent = 'AI助手選擇器 / AI Assistant Selector';
        const minimize = document.createElement('div');
        minimize.className = 'ai-selector-minimize';
        minimize.textContent = '×';
        header.appendChild(title);
        header.appendChild(minimize);

        const content = document.createElement('div');
        content.className = 'ai-selector-content';

        const selectedAIs = GM_getValue('selectedAIs', AIs.map(ai => ai.id));
        AIs.forEach(ai => {
            const option = document.createElement('div');
            option.className = 'ai-option';
            option.dataset.aiId = ai.id;
            option.style.border = `2px solid ${ai.color}`;
            if (selectedAIs.includes(ai.id)) {
                option.classList.add('selected');
            }
            const name = document.createElement('span');
            name.className = 'ai-name';
            name.textContent = ai.name;
            option.appendChild(name);
            content.appendChild(option);
        });

        const questionInput = document.createElement('textarea');
        questionInput.className = 'question-input';
        questionInput.placeholder = '輸入您的問題 / Enter your question';

        const sendButton = document.createElement('button');
        sendButton.className = 'send-button';
        sendButton.textContent = '發送到選中的AI / Send to Selected AI';

        content.appendChild(questionInput);
        content.appendChild(sendButton);

        container.appendChild(header);
        container.appendChild(content);

        // Grok 回應 UI
        const grokResponseContainer = document.createElement('div');
        grokResponseContainer.className = 'grok-response-container';
        grokResponseContainer.style.display = 'none';

        let grokWidth = GM_getValue('grokResponseWidth', 300);
        let grokHeight = GM_getValue('grokResponseHeight', 200);
        const grokTop = GM_getValue('grokResponseTop', '100px');
        const grokLeft = GM_getValue('grokResponseLeft', '100px');

        grokWidth = Math.max(grokWidth, 200);
        grokHeight = Math.max(grokHeight, 200);

        grokResponseContainer.style.top = grokTop;
        grokResponseContainer.style.left = grokLeft;
        grokResponseContainer.style.width = `${grokWidth}px`;
        grokResponseContainer.style.height = `${grokHeight}px`;

        const grokHeader = document.createElement('div');
        grokHeader.className = 'grok-response-header';
        const grokTitle = document.createElement('div');
        grokTitle.className = 'grok-response-title';
        grokTitle.textContent = 'Grok 回應 / Grok Response';
        const grokClose = document.createElement('div');
        grokClose.className = 'grok-response-close';
        grokClose.textContent = '×';
        grokHeader.appendChild(grokTitle);
        grokHeader.appendChild(grokClose);

        const grokResponseDiv = document.createElement('div');
        grokResponseDiv.className = 'grok-response';
        const grokInitialP = document.createElement('p');
        grokInitialP.textContent = '等待 Grok 回應... / Waiting for Grok response...';
        grokResponseDiv.appendChild(grokInitialP);

        const grokClearButton = document.createElement('button');
        grokClearButton.className = 'clear-button';
        grokClearButton.textContent = '清空歷史訊息 / Clear History';

        grokResponseContainer.appendChild(grokHeader);
        grokResponseContainer.appendChild(grokClearButton);
        grokResponseContainer.appendChild(grokResponseDiv);

        // ChatGPT 回應 UI
        const chatgptResponseContainer = document.createElement('div');
        chatgptResponseContainer.className = 'chatgpt-response-container';
        chatgptResponseContainer.style.display = 'none';

        let chatgptWidth = GM_getValue('chatgptResponseWidth', 300);
        let chatgptHeight = GM_getValue('chatgptResponseHeight', 200);
        const chatgptTop = GM_getValue('chatgptResponseTop', '150px');
        const chatgptLeft = GM_getValue('chatgptResponseLeft', '150px');

        chatgptWidth = Math.max(chatgptWidth, 200);
        chatgptHeight = Math.max(chatgptHeight, 200);

        chatgptResponseContainer.style.top = chatgptTop;
        chatgptResponseContainer.style.left = chatgptLeft;
        chatgptResponseContainer.style.width = `${chatgptWidth}px`;
        chatgptResponseContainer.style.height = `${chatgptHeight}px`;

        const chatgptHeader = document.createElement('div');
        chatgptHeader.className = 'chatgpt-response-header';
        const chatgptTitle = document.createElement('div');
        chatgptTitle.className = 'chatgpt-response-title';
        chatgptTitle.textContent = 'ChatGPT 回應 / ChatGPT Response';
        const chatgptClose = document.createElement('div');
        chatgptClose.className = 'chatgpt-response-close';
        chatgptClose.textContent = '×';
        chatgptHeader.appendChild(chatgptTitle);
        chatgptHeader.appendChild(chatgptClose);

        const chatgptResponseDiv = document.createElement('div');
        chatgptResponseDiv.className = 'chatgpt-response';
        const chatgptInitialP = document.createElement('p');
        chatgptInitialP.textContent = '等待 ChatGPT 回應... / Waiting for ChatGPT response...';
        chatgptResponseDiv.appendChild(chatgptInitialP);

        const chatgptClearButton = document.createElement('button');
        chatgptClearButton.className = 'clear-button';
        chatgptClearButton.textContent = '清空歷史訊息 / Clear History';

        chatgptResponseContainer.appendChild(chatgptHeader);
        chatgptResponseContainer.appendChild(chatgptClearButton);
        chatgptResponseContainer.appendChild(chatgptResponseDiv);

        // DeepSeek 回應 UI
        const deepseekResponseContainer = document.createElement('div');
        deepseekResponseContainer.className = 'deepseek-response-container';
        deepseekResponseContainer.style.display = 'none';

        let deepseekWidth = GM_getValue('deepseekResponseWidth', 300);
        let deepseekHeight = GM_getValue('deepseekResponseHeight', 200);
        const deepseekTop = GM_getValue('deepseekResponseTop', '200px');
        const deepseekLeft = GM_getValue('deepseekResponseLeft', '200px');

        deepseekWidth = Math.max(deepseekWidth, 200);
        deepseekHeight = Math.max(deepseekHeight, 200);

        deepseekResponseContainer.style.top = deepseekTop;
        deepseekResponseContainer.style.left = deepseekLeft;
        deepseekResponseContainer.style.width = `${deepseekWidth}px`;
        deepseekResponseContainer.style.height = `${deepseekHeight}px`;

        const deepseekHeader = document.createElement('div');
        deepseekHeader.className = 'deepseek-response-header';
        const deepseekTitle = document.createElement('div');
        deepseekTitle.className = 'deepseek-response-title';
        deepseekTitle.textContent = 'DeepSeek 回應 / DeepSeek Response';
        const deepseekClose = document.createElement('div');
        deepseekClose.className = 'deepseek-response-close';
        deepseekClose.textContent = '×';
        deepseekHeader.appendChild(deepseekTitle);
        deepseekHeader.appendChild(deepseekClose);

        const deepseekResponseDiv = document.createElement('div');
        deepseekResponseDiv.className = 'deepseek-response';
        const deepseekInitialP = document.createElement('p');
        deepseekInitialP.textContent = '等待 DeepSeek 回應... / Waiting for DeepSeek response...';
        deepseekResponseDiv.appendChild(deepseekInitialP);

        const deepseekClearButton = document.createElement('button');
        deepseekClearButton.className = 'clear-button';
        deepseekClearButton.textContent = '清空歷史訊息 / Clear History';

        deepseekResponseContainer.appendChild(deepseekHeader);
        deepseekResponseContainer.appendChild(deepseekClearButton);
        deepseekResponseContainer.appendChild(deepseekResponseDiv);

        document.body.appendChild(container);
        document.body.appendChild(grokResponseContainer);
        document.body.appendChild(chatgptResponseContainer);
        document.body.appendChild(deepseekResponseContainer);

        return { container, grokResponseContainer, grokResponseDiv, chatgptResponseContainer, chatgptResponseDiv, deepseekResponseContainer, deepseekResponseDiv, header, grokHeader, chatgptHeader, deepseekHeader, grokClearButton, chatgptClearButton, deepseekClearButton };
    }

    // 初始化事件監聽（移除氣泡相關事件，新增選單按鈕）
    function initializeEvents(container, grokResponseContainer, grokResponseDiv, chatgptResponseContainer, chatgptResponseDiv, deepseekResponseContainer, deepseekResponseDiv, header, grokHeader, chatgptHeader, deepseekHeader, grokClearButton, chatgptClearButton, deepseekClearButton) {
        const aiOptions = container.querySelectorAll('.ai-option');
        const questionInput = container.querySelector('.question-input');
        const sendButton = container.querySelector('.send-button');
        const minimizeButton = container.querySelector('.ai-selector-minimize');
        const content = container.querySelector('.ai-selector-content');
        const grokCloseButton = grokResponseContainer.querySelector('.grok-response-close');
        const chatgptCloseButton = chatgptResponseContainer.querySelector('.chatgpt-response-close');
        const deepseekCloseButton = deepseekResponseContainer.querySelector('.deepseek-response-close');

        aiOptions.forEach(option => {
            option.addEventListener('click', () => {
                option.classList.toggle('selected');
                const selectedAIs = Array.from(aiOptions)
                    .filter(opt => opt.classList.contains('selected'))
                    .map(opt => opt.dataset.aiId);
                GM_setValue('selectedAIs', selectedAIs);
            });
        });

        minimizeButton.addEventListener('click', () => {
            container.style.display = 'none';
        });

        sendButton.addEventListener('click', () => {
            const selectedAIs = Array.from(aiOptions).filter(option => option.classList.contains('selected'));
            const question = questionInput.value.trim();
            if (selectedAIs.length > 0 && question) {
                selectedAIs.forEach(aiOption => {
                    const aiId = aiOption.dataset.aiId;
                    const ai = AIs.find(a => a.id === aiId);
                    if (ai) {
                        openAIInNewTab(ai, question);

                    }
                });
                questionInput.value = '';
            }
        });

        grokClearButton.addEventListener('click', () => {
            while (grokResponseDiv.firstChild) {
                grokResponseDiv.removeChild(grokResponseDiv.firstChild);
            }
            const p = document.createElement('p');
            p.textContent = '等待 Grok 回應... / Waiting for Grok response...';
            grokResponseDiv.appendChild(p);
        });

        chatgptClearButton.addEventListener('click', () => {
            while (chatgptResponseDiv.firstChild) {
                chatgptResponseDiv.removeChild(chatgptResponseDiv.firstChild);
            }
            const p = document.createElement('p');
            p.textContent = '等待 ChatGPT 回應... / Waiting for ChatGPT response...';
            chatgptResponseDiv.appendChild(p);
        });

        deepseekClearButton.addEventListener('click', () => {
            while (deepseekResponseDiv.firstChild) {
                deepseekResponseDiv.removeChild(deepseekResponseDiv.firstChild);
            }
            const p = document.createElement('p');
            p.textContent = '等待 DeepSeek 回應... / Waiting for DeepSeek response...';
            deepseekResponseDiv.appendChild(p);
        });

        grokCloseButton.addEventListener('click', () => {
            grokResponseContainer.style.display = 'none';
        });

        chatgptCloseButton.addEventListener('click', () => {
            chatgptResponseContainer.style.display = 'none';
        });

        deepseekCloseButton.addEventListener('click', () => {
            deepseekResponseContainer.style.display = 'none';
        });

        makeDraggable(container, header, 'container');
        makeDraggable(grokResponseContainer, grokHeader, 'grokResponse');
        makeDraggable(chatgptResponseContainer, chatgptHeader, 'chatgptResponse');
        makeDraggable(deepseekResponseContainer, deepseekHeader, 'deepseekResponse');

        window.addEventListener('resize', () => {
            if (container.style.display !== 'none') {
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                let containerTop = parseInt(container.style.top || GM_getValue('containerTop', '50px'));
                let containerLeft = parseInt(container.style.left || GM_getValue('containerLeft', '50px'));
                containerTop = Math.max(0, Math.min(containerTop, window.innerHeight - containerHeight));
                containerLeft = Math.max(0, Math.min(containerLeft, window.innerWidth - containerWidth));
                container.style.top = `${containerTop}px`;
                container.style.left = `${containerLeft}px`;
                GM_setValue('containerTop', `${containerTop}px`);
                GM_setValue('containerLeft', `${containerLeft}px`);
            }
            if (grokResponseContainer.style.display !== 'none') {
                const grokWidth = grokResponseContainer.offsetWidth;
                const grokHeight = grokResponseContainer.offsetHeight;
                let grokTop = parseInt(grokResponseContainer.style.top);
                let grokLeft = parseInt(grokResponseContainer.style.left);
                grokTop = Math.max(0, Math.min(grokTop, window.innerHeight - grokHeight));
                grokLeft = Math.max(0, Math.min(grokLeft, window.innerWidth - grokWidth));
                grokResponseContainer.style.top = `${grokTop}px`;
                grokResponseContainer.style.left = `${grokLeft}px`;
            }
            if (chatgptResponseContainer.style.display !== 'none') {
                const chatgptWidth = chatgptResponseContainer.offsetWidth;
                const chatgptHeight = chatgptResponseContainer.offsetHeight;
                let chatgptTop = parseInt(chatgptResponseContainer.style.top);
                let chatgptLeft = parseInt(chatgptResponseContainer.style.left);
                chatgptTop = Math.max(0, Math.min(chatgptTop, window.innerHeight - chatgptHeight));
                chatgptLeft = Math.max(0, Math.min(chatgptLeft, window.innerWidth - chatgptWidth));
                chatgptResponseContainer.style.top = `${chatgptTop}px`;
                chatgptResponseContainer.style.left = `${chatgptLeft}px`;
            }
            if (deepseekResponseContainer.style.display !== 'none') {
                const deepseekWidth = deepseekResponseContainer.offsetWidth;
                const deepseekHeight = deepseekResponseContainer.offsetHeight;
                let deepseekTop = parseInt(deepseekResponseContainer.style.top);
                let deepseekLeft = parseInt(deepseekResponseContainer.style.left);
                deepseekTop = Math.max(0, Math.min(deepseekTop, window.innerHeight - deepseekHeight));
                deepseekLeft = Math.max(0, Math.min(deepseekLeft, window.innerWidth - deepseekWidth));
                deepseekResponseContainer.style.top = `${deepseekTop}px`;
                deepseekResponseContainer.style.left = `${deepseekLeft}px`;
            }
        });

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const target = entry.target;
                if (target.style.display !== 'none') {
                    if (target === container) {
                        GM_setValue('containerWidth', target.offsetWidth);
                        GM_setValue('containerHeight', target.offsetHeight);
                    } else if (target === grokResponseContainer) {
                        GM_setValue('grokResponseWidth', target.offsetWidth);
                        GM_setValue('grokResponseHeight', target.offsetHeight);
                    } else if (target === chatgptResponseContainer) {
                        GM_setValue('chatgptResponseWidth', target.offsetWidth);
                        GM_setValue('chatgptResponseHeight', target.offsetHeight);
                    } else if (target === deepseekResponseContainer) {
                        GM_setValue('deepseekResponseWidth', target.offsetWidth);
                        GM_setValue('deepseekResponseHeight', target.offsetHeight);
                    }
                }
            }
        });

        resizeObserver.observe(container);
        resizeObserver.observe(grokResponseContainer);
        resizeObserver.observe(chatgptResponseContainer);
        resizeObserver.observe(deepseekResponseContainer);

        // 顯示容器函數
        function showContainer() {
            container.style.display = 'block';
            content.style.display = 'flex';

            const savedWidth = GM_getValue('containerWidth', 300);
            const savedHeight = GM_getValue('containerHeight', 300);
            const savedTop = GM_getValue('containerTop', '50px');
            const savedLeft = GM_getValue('containerLeft', '50px');

            container.style.width = `${Math.max(savedWidth, 200)}px`;
            container.style.height = `${Math.max(savedHeight, 200)}px`;
            container.style.top = savedTop;
            container.style.left = savedLeft;

            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            let containerTop = parseInt(savedTop);
            let containerLeft = parseInt(savedLeft);
            containerTop = Math.max(0, Math.min(containerTop, window.innerHeight - containerHeight));
            containerLeft = Math.max(0, Math.min(containerLeft, window.innerWidth - containerWidth));
            container.style.top = `${containerTop}px`;
            container.style.left = `${containerLeft}px`;
        }

        // 註冊 Tampermonkey 選單按鈕
        GM_registerMenuCommand('開啟 AI 助手選擇器 / Open AI Assistant Selector', showContainer);
    }

    // 在新標籤頁中打開AI
    function openAIInNewTab(ai, question) {
        const url = `${ai.url}${ai.id === 'gemini' ? '?q=' : '?q='}${encodeURIComponent(question)}`;
        GM_openInTab(url, {
            active: false,
            insert: true,
            setParent: true
        });
    }

    // 處理 Gemini 頁面
    function handleGeminiPage() {
        if (window.location.hostname === 'gemini.google.com' && window.location.search.includes('q=')) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                function setTextAndSendAfterDelay(string) {
                    const richTextarea = document.querySelector('rich-textarea.text-input-field_textarea');
                    if (!richTextarea) return false;
                    const firstDiv = richTextarea.querySelector('div');
                    if (!firstDiv) return false;
                    firstDiv.innerText = string;
                    const event = new Event('input', { bubbles: true });
                    firstDiv.dispatchEvent(event);
                    setTimeout(() => {
                        const sendButton = document.querySelector('.send-button');
                        if (sendButton) sendButton.click();
                    }, 1000);
                    return true;
                }

                const waitForElement = (selector, maxAttempts = 30) => {
                    return new Promise((resolve) => {
                        let attempts = 0;
                        const interval = setInterval(() => {
                            const element = document.querySelector(selector);
                            attempts++;
                            if (element || attempts >= maxAttempts) {
                                clearInterval(interval);
                                resolve(element);
                            }
                        }, 500);
                    });
                };

                const trySetQuestion = async () => {
                    await waitForElement('rich-textarea.text-input-field_textarea');
                    setTextAndSendAfterDelay(decodeURIComponent(query));
                };

                trySetQuestion();
                window.history.replaceState({}, document.title, '/app');
            }
        }
    }

    // 處理 Grok 頁面
    function handleGrokPage() {
        if (window.location.hostname === 'grok.com') {
            let lastContent = '';

            setInterval(() => {
                const messageBubbles = document.querySelectorAll('div.message-bubble:not(.processed)');
                let currentContent = '';

                messageBubbles.forEach(div => {
                    const content = div.innerHTML.trim();
                    if (content) {
                        const nextSibling = div.nextElementSibling;
                        let buttonCount = 0;
                        if (nextSibling) {
                            buttonCount = nextSibling.querySelectorAll('button').length;
                        }
                        if (buttonCount > 2) {
                            currentContent += content + '\n';
                            div.classList.add('processed');
                        }
                    }
                });

                if (currentContent && currentContent !== lastContent) {
                    lastContent = currentContent.trim();
                    setTimeout(() => {
                        const finalCheck = document.querySelectorAll('div.message-bubble.processed');
                        let finalContent = '';
                        finalCheck.forEach(div => {
                            finalContent += div.innerHTML.trim() + '\n';
                        });
                        finalContent = finalContent.trim();

                        if (finalContent === lastContent) {
                            GM_setValue('grokResponse', lastContent);
                        }
                    }, 1000);
                }
            }, 500);
        }
    }

    // 處理 ChatGPT 頁面
    function handleChatGPTPage() {
        if (window.location.hostname === 'chatgpt.com') {
            let lastContent = '';

            setInterval(() => {
                const stopButton = document.querySelector('[data-testid="stop-button"]');
                if (stopButton) {
                    return;
                }
                const messageBubbles = document.querySelectorAll('div[data-message-author-role="assistant"]:not(.processed)');
                let currentContent = '';

                messageBubbles.forEach(div => {
                    const content = div.innerHTML.trim();
                    if (content) {
                        const grandParent = div.parentElement.parentElement;
                        if (grandParent.children.length === 3) {
                            currentContent += content + '\n';
                            div.classList.add('processed');
                        }
                    }
                });

                if (currentContent && currentContent !== lastContent) {
                    lastContent = currentContent.trim();
                    setTimeout(() => {
                        GM_setValue('chatgptResponse', lastContent);
                    }, 1000);
                }
            }, 500);
        }
    }

    // 處理 DeepSeek 頁面
    function handleDeepSeekPage() {
        if (window.location.hostname === 'chat.deepseek.com' && window.location.search.includes('q=')) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                const waitForElement = (selector, maxAttempts = 30) => {
                    return new Promise((resolve) => {
                        let attempts = 0;
                        const interval = setInterval(() => {
                            const element = document.querySelector(selector);
                            attempts++;
                            if (element || attempts >= maxAttempts) {
                                clearInterval(interval);
                                resolve(element);
                            }
                        }, 500);
                    });
                };

                const trySetQuestion = async () => {
                    const chatInput = await waitForElement('#chat-input');
                    if (chatInput) {
                        chatInput.value = decodeURIComponent(query);
                        const inputEvent = new Event('input', { bubbles: true });
                        chatInput.dispatchEvent(inputEvent);
                        setTimeout(() => {
                            const enterEvent = new KeyboardEvent('keydown', {
                                bubbles: true,
                                cancelable: true,
                                keyCode: 13
                            });
                            chatInput.dispatchEvent(enterEvent);
                        }, 1000);
                    }
                };

                trySetQuestion();
                window.history.replaceState({}, document.title, '/');
            }
        }

        let lastContent = '';
        setInterval(() => {
            const responseElements = document.querySelectorAll('.chat-message[data-from="assistant"]:not(.processed)');
            let currentContent = '';

            responseElements.forEach(element => {
                const content = element.innerHTML.trim();
                if (content) {
                    currentContent += content + '\n';
                    element.classList.add('processed');
                }
            });

            if (currentContent && currentContent !== lastContent) {
                lastContent = currentContent.trim();
                setTimeout(() => {
                    GM_setValue('deepseekResponse', lastContent);
                }, 1000);
            }
        }, 500);
    }

    // 檢查並顯示 Grok 回應
    function checkGrokResponse(grokResponseContainer, grokResponseDiv) {
        if (!grokResponseDiv) return;

        setInterval(() => {
            const response = GM_getValue('grokResponse', '');
            if (response && grokResponseContainer.style.display === 'block') {
                const newResponse = document.createElement('p');
                newResponse.innerHTML = response;
                while (grokResponseDiv.firstChild) {
                    grokResponseDiv.removeChild(grokResponseDiv.firstChild);
                }
                grokResponseDiv.appendChild(newResponse);
                GM_setValue('grokResponse', '');
            }
        }, 1000);
    }

    // 檢查並顯示 ChatGPT 回應
    function checkChatGPTResponse(chatgptResponseContainer, chatgptResponseDiv) {
        if (!chatgptResponseDiv) return;

        setInterval(() => {
            const response = GM_getValue('chatgptResponse', '');
            if (response && chatgptResponseContainer.style.display === 'block') {
                const newResponse = document.createElement('p');
                newResponse.innerHTML = response;
                while (chatgptResponseDiv.firstChild) {
                    chatgptResponseDiv.removeChild(chatgptResponseDiv.firstChild);
                }
                chatgptResponseDiv.appendChild(newResponse);
                GM_setValue('chatgptResponse', '');
            }
        }, 1000);
    }

    // 檢查並顯示 DeepSeek 回應
    function checkDeepSeekResponse(deepseekResponseContainer, deepseekResponseDiv) {
        if (!deepseekResponseDiv) return;

        setInterval(() => {
            const response = GM_getValue('deepseekResponse', '');
            if (response && deepseekResponseContainer.style.display === 'block') {
                const newResponse = document.createElement('p');
                newResponse.innerHTML = response;
                while (deepseekResponseDiv.firstChild) {
                    deepseekResponseDiv.removeChild(deepseekResponseDiv.firstChild);
                }
                deepseekResponseDiv.appendChild(newResponse);
                GM_setValue('deepseekResponse', '');
            }
        }, 1000);
    }

    // 啟動腳本
    function initialize() {
        const { container, grokResponseContainer, grokResponseDiv, chatgptResponseContainer, chatgptResponseDiv, deepseekResponseContainer, deepseekResponseDiv, header, grokHeader, chatgptHeader, deepseekHeader, grokClearButton, chatgptClearButton, deepseekClearButton } = createUI();
        initializeEvents(container, grokResponseContainer, grokResponseDiv, chatgptResponseContainer, chatgptResponseDiv, deepseekResponseContainer, deepseekResponseDiv, header, grokHeader, chatgptHeader, deepseekHeader, grokClearButton, chatgptClearButton, deepseekClearButton);
        handleGeminiPage();
        handleGrokPage();
        handleChatGPTPage();
        handleDeepSeekPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
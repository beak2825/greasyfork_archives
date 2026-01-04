// ==UserScript==
// @name         DeepSeek API聊天
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在任意网站上添加 DeepSeek 聊天窗口，CTRL+ALT+D显示/隐藏界面。支持官方、硅基流动与火山引擎三个平台的API配置；内置API key输入、平台选择、记忆上次平台、聊天、历史记录管理、新对话、模型切换与记忆功能。API 输出支持 Markdown 渲染。
// @author       AMT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530558/DeepSeek%20API%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/530558/DeepSeek%20API%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 检查跨域请求权限
    if (typeof GM_xmlhttpRequest === 'undefined') {
        alert('请启用Tampermonkey的"允许访问跨域URL"权限');
        return;
    }

    // 定义颜色常量
    const inactiveColor = "#444";
    const activeColor = "#4169E1"; // 专属于模型切换和记忆按钮点击后保持的颜色
    const sendDisabledColor = "#888";
    const sendEnabledColor = "#fff";

    // 为普通按钮添加视觉反馈（也适用于历史记录项）
    function addButtonFeedback(el) {
        el.addEventListener('mouseover', () => {
            el.style.opacity = '0.6';
        });
        el.addEventListener('mouseout', () => {
            el.style.opacity = '1';
        });
        el.addEventListener('mousedown', () => {
            el.style.backgroundColor = "#666";
        });
        el.addEventListener('mouseup', () => {
            el.style.backgroundColor = inactiveColor;
        });
    }

    /***************** 创建Shadow DOM容器，确保UI样式隔离 *****************/
    const host = document.createElement('div');
    host.id = 'deepseek-chat-host';
    host.style.all = 'initial'; // 重置所有样式
    host.style.position = 'fixed';
    host.style.right = '0';
    host.style.top = '50%';
    host.style.transform = 'translateY(-50%)';
    host.style.zIndex = '9999';
    // 默认隐藏整个界面
    host.style.display = 'none';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // 添加全局样式到 shadow root（仅影响本UI内）
    const style = document.createElement('style');
    style.textContent = `
    /* 全局字体重置为系统默认 */
    * {
        font-family: inherit !important;
        font-size: 18px;
        line-height: 1.5;
    }
    /* 全局按钮字体设置 */
    button {
        font-size: 0.8em !important;
        font-family: inherit !important;
        font-weight: normal !important;
        line-height: normal !important;
        transition: background-color 0.3s;
    }
    /* 统一滚动条样式 */
    ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }
    /* 输出框滚动条 */
    .conversation-div-style::-webkit-scrollbar-track {
        background: transparent;
        margin: 10px 0;
    }
    /* 输入框滚动条 */
    textarea::-webkit-scrollbar-track {
        background: transparent !important;
        margin: 10px 0;
    }
    textarea {
        font-size: 1em !important;
        font-family: inherit !important;
        line-height: normal !important;
    }
    ::-webkit-scrollbar-corner {
        background: #333;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
    textarea:focus, input:focus {
        outline: none !important;
        border: 1px solid #4682B4 !important;
    }
    p {
        margin: 0em !important;
    }
    pre {
        white-space: pre !important;
        background-color: #222 !important;
        color: #eee !important;
        padding: 0.8em !important;
        border-radius: 8px !important;
        overflow-x: auto !important;
        font-size: 0.9em !important;
        margin: 0.5em 0 !important;
    }
    code {
        background-color: transparent !important;
        padding: 0 !important;
        font-family: monospace !important;
    }
    .code-block-wrapper:hover button {
        opacity: 1 !important;
    }
    .code-block-wrapper button:hover {
        background-color: #666 !important;
    }
    `;
    shadow.appendChild(style);

    /***************** 全局变量与存储 *****************/
    // 使用字典存储各平台配置
    const platforms = {
        official: {
            name: "官方",
            base_url: "https://api.deepseek.com",
            chat_model_id: "deepseek-chat",
            reasoner_model_id: "deepseek-reasoner",
            keyStorageName: "deepseek_api_official"
        },
        siliconflow: {
            name: "硅基流动",
            base_url: "https://api.siliconflow.cn/v1",
            chat_model_id: "deepseek-ai/DeepSeek-V3",
            reasoner_model_id: "deepseek-ai/DeepSeek-R1",
            keyStorageName: "deepseek_api_siliconflow"
        },
        volcengine: {
            name: "火山引擎",
            base_url: "https://ark.cn-beijing.volces.com/api/v3/",
            chat_model_id: "deepseek-v3-241226",
            reasoner_model_id: "deepseek-r1-250120",
            keyStorageName: "deepseek_api_volcengine"
        }
    };

    // 加载各平台已存储的API key
    const storedKeys = {
        official: GM_getValue(platforms.official.keyStorageName, ""),
        siliconflow: GM_getValue(platforms.siliconflow.keyStorageName, ""),
        volcengine: GM_getValue(platforms.volcengine.keyStorageName, "")
    };

    // 记忆上次使用的平台，默认选官方平台
    let currentPlatform = GM_getValue('last_platform', 'official');
    // 若当前平台没有存储api，则进入编辑模式
    let editingAPI = !storedKeys[currentPlatform];

    let currentModel = GM_getValue('currentModel', 'deepseek-chat'); // 读取保存的模型（此处仍为深度聊天/思考切换，仅标识模型类型）
    let memoryEnabled = GM_getValue('memoryEnabled', false); // 读取记忆状态
    let isStreaming = false;
    let autoScrollEnabled = true;
    let chatHistory = JSON.parse(GM_getValue('deepseek_history', '[]'));
    let currentSession = [];
    let currentSessionId = Date.now();
    let isSending = false;
    // 全局存储流控制器，便于中途停止
    let streamAbortController = null;

    /***************** 工具函数 *****************/
    function safeCopyToClipboard(text, button) {
        console.log("Attempting to copy text:", text);
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
            } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(text).then(() => {
                    console.log("Clipboard write success");
                }).catch(err => {
                    console.error("Clipboard write failed:", err);
                });
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            console.log("Copy successful, updating button");
            if (button) {
                button.textContent = '✅';
                button.style.backgroundColor = activeColor;
                setTimeout(() => {
                    button.textContent = '📋';
                    button.style.backgroundColor = inactiveColor;
                }, 1000);
            }
        } catch (e) {
            alert('复制失败，请手动复制');
            console.error('复制失败:', e);
        }
    }
    // 修改后的 renderMarkdown 函数（移除按钮事件绑定，由事件委托处理）
    function renderMarkdown(text) {
        const parsed = marked.parse(text.trim());
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsed;
        const codeBlocks = tempDiv.querySelectorAll('pre code');
        codeBlocks.forEach(code => {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            wrapper.style.position = 'relative';

            const pre = code.parentElement;
            if (pre && pre.tagName === 'PRE') {
                const chatWidth = chatContainer.offsetWidth;
                const fixedWidth = chatWidth * 0.85;
                // 固定预格式化区域的宽度
                pre.style.width = `${fixedWidth}px`;
                pre.style.maxWidth = `${fixedWidth}px`;
                pre.style.margin = '0';
                // 同时让包裹容器固定宽度
                wrapper.style.width = `${fixedWidth}px`;
                pre.parentElement.replaceChild(wrapper, pre);
                wrapper.appendChild(pre);
                // 设置 pre 为相对定位
                pre.style.position = 'relative';
                const copyBtn = document.createElement('button');
                copyBtn.textContent = '📋';
                copyBtn.title = '复制代码';
                copyBtn.style.cssText = `
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    font-size: 0.8em;
                    background: ${inactiveColor};
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 2px 6px;
                    cursor: pointer;
                    opacity: 0.7;
                    z-index: 10;
                    transition: background 0.3s, opacity 0.3s;
                    pointer-events: all;
                `;
                pre.appendChild(copyBtn);
            }
        });

        return tempDiv;
    }

    function saveCurrentSession() {
        if (currentSession.length > 0) {
            let idx = chatHistory.findIndex(s => s.id === currentSessionId);
            const sessionRecord = {
                id: currentSessionId,
                messages: currentSession,
                timestamp: new Date().toLocaleString()
            };
            if (idx === -1) {
                chatHistory.unshift(sessionRecord);
            } else {
                chatHistory[idx] = sessionRecord;
            }
            GM_setValue('deepseek_history', JSON.stringify(chatHistory));
        }
    }

    function loadSession(sessionRecord) {
        currentSession = sessionRecord.messages;
        currentSessionId = sessionRecord.id;
        renderConversation();
    }

    /***************** 主窗口与UI *****************/
    const chatContainer = document.createElement('div');
    chatContainer.id = 'deepseek-chat-ui';
    chatContainer.style.all = 'initial';
    chatContainer.style.fontFamily = 'Arial, sans-serif';
    chatContainer.style.fontSize = '14px';
    chatContainer.style.isolation = 'isolate';
    chatContainer.style.position = 'fixed';
    chatContainer.style.right = '0';
    chatContainer.style.top = '50%';
    chatContainer.style.transform = 'translateY(-50%)';
    // 若未配置API则显示较小窗口，否则显示聊天界面
    chatContainer.style.width = (editingAPI ? '15vw' : '35vw');
    chatContainer.style.height = (editingAPI ? '20vh' : '75vh');
    chatContainer.style.backgroundColor = '#333';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    chatContainer.style.transition = 'opacity 0.3s, transform 0.3s';
    shadow.appendChild(chatContainer);

    // 阻止内部点击影响外部，同时若点击不在历史记录面板内，则关闭面板
    chatContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        if(historyPanel && !historyPanel.contains(e.target)) { hideHistoryPanel(); }
    });

    const contentDiv = document.createElement('div');
    contentDiv.style.width = '100%';
    contentDiv.style.height = '100%';
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.boxSizing = 'border-box';
    contentDiv.style.color = 'white';
    contentDiv.style.padding = '1em';
    chatContainer.appendChild(contentDiv);

    /***************** 历史记录面板 *****************/
    let historyPanel;
    function showHistoryPanel() {
        if(historyPanel) return;
        historyPanel = document.createElement('div');
        historyPanel.id = 'history-panel';
        historyPanel.style.zIndex = '10000';
        historyPanel.style.position = 'absolute';
        historyPanel.style.left = '0';
        historyPanel.style.top = '0';
        historyPanel.style.height = '100%';
        historyPanel.style.width = '40%';
        historyPanel.style.backgroundColor = '#444';
        historyPanel.style.borderTopLeftRadius = '10px';
        historyPanel.style.borderBottomLeftRadius = '10px';
        historyPanel.style.overflowY = 'auto';
        historyPanel.style.padding = '0.5em';
        historyPanel.style.boxSizing = 'border-box';
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '0.5em';
        const backBtn = document.createElement('button');
        backBtn.innerText = '返回';
        backBtn.style.fontSize = '1em';
        backBtn.style.padding = '0.2em 0.5em';
        backBtn.style.border = '1px solid white';
        backBtn.style.borderRadius = '10px';
        backBtn.style.backgroundColor = inactiveColor;
        backBtn.style.color = 'white';
        backBtn.style.cursor = 'pointer';
        backBtn.addEventListener('click', () => { hideHistoryPanel(); });
        addButtonFeedback(backBtn);
        header.appendChild(backBtn);
        const title = document.createElement('span');
        title.style.color = 'white';
        title.innerText = '聊天历史';
        header.appendChild(title);
        const clearBtn = document.createElement('button');
        clearBtn.innerText = '清空所有';
        clearBtn.style.fontSize = '1em';
        clearBtn.style.padding = '0.2em 0.5em';
        clearBtn.style.border = '1px solid white';
        clearBtn.style.borderRadius = '10px';
        clearBtn.style.backgroundColor = inactiveColor;
        clearBtn.style.color = 'white';
        clearBtn.style.cursor = 'pointer';
        clearBtn.addEventListener('click', () => {
            if(confirm("确定清空所有聊天记录吗？")) {
                chatHistory = [];
                GM_setValue('deepseek_history', JSON.stringify(chatHistory));
                renderHistoryPanel();
                currentSession = [];
                currentSessionId = Date.now();
                if(conversationDiv) { conversationDiv.innerHTML = ''; }
            }
        });
        addButtonFeedback(clearBtn);
        header.appendChild(clearBtn);
        historyPanel.appendChild(header);
        renderHistoryPanel();
        chatContainer.appendChild(historyPanel);
    }
    function hideHistoryPanel() {
        if(historyPanel && historyPanel.parentNode) {
            chatContainer.removeChild(historyPanel);
            historyPanel = null;
        }
    }
    function renderHistoryPanel() {
        if(!historyPanel) return;
        while(historyPanel.childNodes.length > 1) {
            historyPanel.removeChild(historyPanel.lastChild);
        }
        chatHistory.forEach(session => {
            const item = document.createElement('div');
            let summary = session.timestamp;
            if(session.messages.length > 0) {
                const firstMsg = session.messages.find(m => m.role === 'user');
                if(firstMsg) {
                    summary += " - " + firstMsg.content.substring(0, 20) + "...";
                }
            }
            item.innerText = summary;
            item.style.color = 'white';
            item.style.padding = '0.3em';
            item.style.borderBottom = '1px solid #666';
            item.style.cursor = 'pointer';
            item.style.backgroundColor = inactiveColor;
            addButtonFeedback(item);
            item.addEventListener('click', () => {
                loadSession(session);
                renderConversation();
                hideHistoryPanel();
            });
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if(confirm("删除该聊天记录？")) {
                    if(session.id === currentSessionId) {
                        currentSession = [];
                        currentSessionId = Date.now();
                        if(conversationDiv) { conversationDiv.innerHTML = ''; }
                    }
                    chatHistory = chatHistory.filter(s => s.id !== session.id);
                    GM_setValue('deepseek_history', JSON.stringify(chatHistory));
                    renderHistoryPanel();
                }
            });
            historyPanel.appendChild(item);
        });
    }

    /***************** 对话区与输入区 *****************/
    let conversationDiv;
    let messageInput;
    let sendBtn; // 全局声明

    // 自动滚动监听：当滚动接近底部时自动恢复
    function setupAutoScroll() {
        conversationDiv.addEventListener('scroll', () => {
            if (conversationDiv.scrollTop + conversationDiv.clientHeight >= conversationDiv.scrollHeight - 10) {
                autoScrollEnabled = true;
            } else {
                autoScrollEnabled = false;
            }
        });
    }

    // 渲染对话记录
    function renderConversation() {
        if(!conversationDiv) return;
        conversationDiv.innerHTML = '';
        currentSession.forEach(msgObj => {
            if(msgObj.role === 'user') {
                const bubble = document.createElement('div');
                bubble.style.cssText = `
                    padding: 0.5em;
                    margin: 0.5em 0;
                    border-radius: 12px;
                    max-width: 80%;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                    background-color: #6699CC;
                    color: white;
                    align-self: flex-end;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
                bubble.textContent = msgObj.content;
                conversationDiv.appendChild(bubble);
            } else {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignSelf = 'flex-start';
                if (msgObj.chain !== undefined) {
                    const headerBubble = document.createElement('div');
                    headerBubble.style.cssText = "padding: 0.5em; margin: 0.5em 0; border-radius: 12px; background-color: #444; color: #EEE; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: nowrap; display: inline-flex; align-items: center;";

                    const headerTextSpan = document.createElement('span');
                    headerTextSpan.innerText = msgObj.headerText || "已深度思考";
                    headerTextSpan.style.display = "inline-block";
                    headerBubble.appendChild(headerTextSpan);

                    const collapseBtn = document.createElement('button');
                    collapseBtn.style.cssText = "font-size: 0.8em; cursor: pointer; background-color: " + inactiveColor + "; color: #EEE; border: none; padding: 0; margin-left: 4px;";
                    let chainCollapsed = GM_getValue('chainCollapsed', false);
                    collapseBtn.textContent = chainCollapsed ? "∨" : "∧";
                    collapseBtn.addEventListener('click', () => {
                        chainCollapsed = !chainCollapsed;
                        GM_setValue('chainCollapsed', chainCollapsed);
                        if (chainDiv) {
                            chainDiv.style.display = chainCollapsed ? "none" : "";
                        }
                        collapseBtn.textContent = chainCollapsed ? "∨" : "∧";
                        setTimeout(() => {
                            const totalWidth = headerTextSpan.offsetWidth + collapseBtn.offsetWidth + 4;
                            headerBubble.style.width = totalWidth + "px";
                        }, 0);
                    });
                    headerBubble.appendChild(collapseBtn);

                    setTimeout(() => {
                        const totalWidth = headerTextSpan.offsetWidth + collapseBtn.offsetWidth + 4;
                        headerBubble.style.width = totalWidth + "px";
                    }, 0);
                    container.appendChild(headerBubble);

                    const chainDiv = document.createElement('div');
                    chainDiv.style.fontSize = "0.9em";
                    chainDiv.style.fontStyle = "italic";
                    chainDiv.style.color = "#aaa";
                    chainDiv.style.whiteSpace = "pre-wrap";
                    chainDiv.innerHTML = renderMarkdown(msgObj.chain).innerHTML;
                    chainDiv.style.display = chainCollapsed ? "none" : "";
                    container.appendChild(chainDiv);
                }
                const finalDiv = document.createElement('div');
                finalDiv.style.whiteSpace = "pre-wrap";
                finalDiv.innerHTML = renderMarkdown(msgObj.content).innerHTML;
                container.appendChild(finalDiv);
                conversationDiv.appendChild(container);
            }
        });
    }

    // 流式输出结束后调用，恢复发送按钮状态
    function finishStreaming() {
        isStreaming = false;
        streamAbortController = null;
        sendBtn.textContent = '发送';
        autoResize();
    }

    /***************** 自动调整输入框及发送按钮状态 *****************/
    function autoResize() {
        const initialHeight = window.innerHeight * 0.10;
        messageInput.style.height = 'auto';
        let newHeight = messageInput.scrollHeight;
        if (newHeight < initialHeight) newHeight = initialHeight;
        const maxHeight = window.innerHeight * 0.25;
        if (newHeight > maxHeight) {
            messageInput.style.height = maxHeight + 'px';
            messageInput.style.overflowY = 'auto';
        } else {
            messageInput.style.height = newHeight + 'px';
            messageInput.style.overflowY = 'hidden';
        }
        if (isStreaming) {
            sendBtn.disabled = false;
            sendBtn.textContent = '停止';
            sendBtn.style.backgroundColor = sendEnabledColor;
            sendBtn.style.color = "#000";
            sendBtn.style.cursor = 'pointer';
        } else {
            sendBtn.disabled = (messageInput.value.trim() === '');
            if (sendBtn.disabled) {
                sendBtn.style.backgroundColor = sendDisabledColor;
                sendBtn.style.color = "#666";
                sendBtn.style.cursor = 'not-allowed';
            } else {
                sendBtn.style.backgroundColor = sendEnabledColor;
                sendBtn.style.color = "#000";
                sendBtn.style.cursor = 'pointer';
            }
            sendBtn.textContent = '发送';
        }
    }

    /***************** 渲染整个界面 *****************/
    function renderUI() {
        contentDiv.innerHTML = '';
        // 若处于API编辑模式或当前平台尚未配置API，则显示API输入界面
        if (editingAPI || !storedKeys[currentPlatform]) {
            // 先清空并把 contentDiv 设置为相对定位
            contentDiv.innerHTML = '';
            contentDiv.style.position = 'relative';
            contentDiv.style.width = '100%';
            contentDiv.style.height = '100%';

            // 1) 标题“DeepSeek”
            const headerText = document.createElement('div');
            headerText.innerText = 'DeepSeek';
            // 绝对定位，使用百分比控制位置与大小
            headerText.style.position = 'absolute';
            headerText.style.top = '5%';
            headerText.style.left = '5%';
            headerText.style.width = '90%';
            headerText.style.fontSize = '1.5em';
            headerText.style.textAlign = 'center';
            headerText.style.color = 'white';
            contentDiv.appendChild(headerText);

            // 2) 平台切换按钮容器
            const platformContainer = document.createElement('div');
            // 绝对定位
            platformContainer.style.position = 'absolute';
            platformContainer.style.top = '30%';       // 相对 contentDiv 顶部 20%
            platformContainer.style.left = '5%';       // 相对 contentDiv 左侧 5%
            platformContainer.style.width = '90%';     // 宽度占 contentDiv 90%
            platformContainer.style.height = '15%';    // 高度可根据需要调整
            // 内部用 flex 排列，让 3 个按钮等宽并占满容器宽度
            platformContainer.style.display = 'flex';
            platformContainer.style.justifyContent = 'space-between';
            platformContainer.style.alignItems = 'center';

            for (const key in platforms) {
                const btn = document.createElement('button');
                btn.innerText = platforms[key].name;
                btn.style.width = '32%';                // 3 个按钮 + 缝隙，大约 32%
                btn.style.height = '100%';             // 填满父容器高度
                btn.style.fontSize = '1em';
                btn.style.borderRadius = '8px';
                btn.style.border = '1px solid white';
                btn.style.backgroundColor = (key === currentPlatform) ? activeColor : inactiveColor;
                btn.style.color = 'white';
                btn.style.cursor = 'pointer';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentPlatform = key;
                    GM_setValue('last_platform', currentPlatform);
                    renderUI();
                });
                addButtonFeedback(btn);
                platformContainer.appendChild(btn);
            }
            contentDiv.appendChild(platformContainer);

            // 3) API 输入框
            const apiInput = document.createElement('input');
            apiInput.type = 'password';
            apiInput.placeholder = '请输入 API key';
            // 绝对定位
            apiInput.style.position = 'absolute';
            apiInput.style.top = '50%';
            apiInput.style.left = '5%';
            apiInput.style.width = '90%';
            apiInput.style.height = '15%';
            apiInput.style.fontSize = '1em';
            apiInput.style.boxSizing = 'border-box';
            apiInput.style.borderRadius = '8px';
            apiInput.style.border = '1px solid white';
            apiInput.style.backgroundColor = inactiveColor;
            apiInput.style.color = 'white';
            apiInput.style.padding = '0.3em';
            if (storedKeys[currentPlatform]) {
                apiInput.value = storedKeys[currentPlatform];
            }
            contentDiv.appendChild(apiInput);

            // 4) “显示api”+“确认”
            const optionsContainer = document.createElement('div');
            optionsContainer.style.position = 'absolute';
            optionsContainer.style.top = '70%';
            optionsContainer.style.left = '5%';
            optionsContainer.style.width = '90%';
            optionsContainer.style.height = '15%';
            optionsContainer.style.display = 'flex';
            optionsContainer.style.justifyContent = 'space-between';
            optionsContainer.style.alignItems = 'center';
            contentDiv.appendChild(optionsContainer);

            // 左侧“显示api”复选框
            const showApiContainer = document.createElement('div');
            showApiContainer.style.display = 'flex';
            showApiContainer.style.alignItems = 'center';
            const showApiLabel = document.createElement('label');
            showApiLabel.innerText = '显示api';
            showApiLabel.style.marginRight = '0.5em';
            const showApiCheckbox = document.createElement('input');
            showApiCheckbox.type = 'checkbox';
            showApiCheckbox.id = 'show-api-checkbox';
            showApiContainer.appendChild(showApiLabel);
            showApiContainer.appendChild(showApiCheckbox);
            optionsContainer.appendChild(showApiContainer);

            // 根据复选框状态切换 API 输入框明/暗文
            showApiCheckbox.addEventListener('change', () => {
                apiInput.type = showApiCheckbox.checked ? 'text' : 'password';
            });

            // 在显示api复选框后，创建一个右侧按钮分组容器
            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '0.5em';
            buttonGroup.style.width = '45%';
            buttonGroup.style.height = '100%';
            buttonGroup.style.justifyContent = 'flex-end';
            buttonGroup.style.alignItems = 'center';

            // 1) 新增“删除”按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = '删除';
            // 与确认按钮保持同样大小
            deleteBtn.style.width = '50%';
            deleteBtn.style.height = '100%';
            deleteBtn.style.fontSize = '1em';
            deleteBtn.style.borderRadius = '8px';
            deleteBtn.style.border = '1px solid white';
            deleteBtn.style.backgroundColor = inactiveColor;
            deleteBtn.style.color = 'white';
            deleteBtn.style.cursor = 'pointer';
            addButtonFeedback(deleteBtn);
            buttonGroup.appendChild(deleteBtn);

            // 删除按钮逻辑：清空当前平台的 API 存储并清空输入框
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 1) 清空存储的 key
                GM_setValue(platforms[currentPlatform].keyStorageName, "");
                storedKeys[currentPlatform] = "";
                // 2) 清空输入框
                apiInput.value = "";
            });

            // 2) 确认按钮
            const confirmBtn = document.createElement('button');
            confirmBtn.innerText = '确认';
            // 与删除按钮保持同样大小
            confirmBtn.style.width = '50%';
            confirmBtn.style.height = '100%';
            confirmBtn.style.fontSize = '1em';
            confirmBtn.style.borderRadius = '8px';
            confirmBtn.style.border = '1px solid white';
            confirmBtn.style.backgroundColor = inactiveColor;
            confirmBtn.style.color = 'white';
            confirmBtn.style.cursor = 'pointer';
            addButtonFeedback(confirmBtn);
            buttonGroup.appendChild(confirmBtn);

            // 回车触发确认
            apiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    confirmBtn.click();
                }
            });

            // 确认按钮逻辑
            confirmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = apiInput.value.trim();
                if (value) {
                    storedKeys[currentPlatform] = value;
                    GM_setValue(platforms[currentPlatform].keyStorageName, value);
                    GM_setValue('last_platform', currentPlatform);
                    editingAPI = false;
                    chatContainer.style.height = '75vh';
                    chatContainer.style.width = '35vw';
                    currentSession = [];
                    currentSessionId = Date.now();
                    renderUI();
                }
            });
            // 添加到 optionsContainer 的右侧
            optionsContainer.appendChild(buttonGroup);
        } else {
            // 聊天界面
            const headerDiv = document.createElement('div');
            headerDiv.style.display = 'flex';
            headerDiv.style.justifyContent = 'space-between';
            headerDiv.style.alignItems = 'center';
            headerDiv.style.marginBottom = '0.5em';
            contentDiv.appendChild(headerDiv);

            const leftHeader = document.createElement('div');
            leftHeader.style.display = 'flex';
            leftHeader.style.gap = '0.5em';
            headerDiv.appendChild(leftHeader);

            const historyBtn = document.createElement('button');
            historyBtn.innerText = '历史记录';
            historyBtn.style.fontSize = '1em';
            historyBtn.style.padding = '0.3em';
            historyBtn.style.borderRadius = '10px';
            historyBtn.style.border = '1px solid white';
            historyBtn.style.cursor = 'pointer';
            historyBtn.style.backgroundColor = inactiveColor;
            historyBtn.style.color = 'white';
            historyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(historyPanel) {
                    hideHistoryPanel();
                } else {
                    showHistoryPanel();
                }
            });
            addButtonFeedback(historyBtn);
            leftHeader.appendChild(historyBtn);

            const newConvBtn = document.createElement('button');
            newConvBtn.innerText = '开启新对话';
            newConvBtn.style.fontSize = '1em';
            newConvBtn.style.padding = '0.3em';
            newConvBtn.style.borderRadius = '10px';
            newConvBtn.style.border = '1px solid white';
            newConvBtn.style.cursor = 'pointer';
            newConvBtn.style.backgroundColor = inactiveColor;
            newConvBtn.style.color = 'white';
            newConvBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                saveCurrentSession();
                currentSession = [];
                currentSessionId = Date.now();
                if(conversationDiv) { conversationDiv.innerHTML = ''; }
            });
            addButtonFeedback(newConvBtn);
            leftHeader.appendChild(newConvBtn);

            const reenterBtn = document.createElement('button');
            reenterBtn.innerText = '重新输入api';
            reenterBtn.style.fontSize = '1em';
            reenterBtn.style.padding = '0.3em';
            reenterBtn.style.borderRadius = '10px';
            reenterBtn.style.border = '1px solid white';
            reenterBtn.style.cursor = 'pointer';
            reenterBtn.style.backgroundColor = inactiveColor;
            reenterBtn.style.color = 'white';
            reenterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideHistoryPanel();
                saveCurrentSession();
                // 切换到API输入模式，但不清空已存储的key
                editingAPI = true;
                chatContainer.style.height = '16.67vh';
                chatContainer.style.width = '15vw';
                renderUI();
            });
            addButtonFeedback(reenterBtn);
            headerDiv.appendChild(reenterBtn);

            conversationDiv = document.createElement('div');
            conversationDiv.style.flex = '1';
            conversationDiv.style.overflowY = 'auto';
            conversationDiv.style.marginBottom = '0.5em';
            conversationDiv.style.padding = '0.5em';
            conversationDiv.style.boxSizing = 'border-box';
            conversationDiv.style.backgroundColor = '#333';
            conversationDiv.style.display = 'flex';
            conversationDiv.style.flexDirection = 'column';
            conversationDiv.style.gap = '0.5em';
            contentDiv.appendChild(conversationDiv);
            setupAutoScroll();
            renderConversation();

            // 事件委托处理代码块复制按钮
            conversationDiv.addEventListener('click', function(e) {
                const button = e.target.closest('.code-block-wrapper button');
                if (button) {
                    e.stopPropagation();
                    const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
                    if (codeBlock) {
                        const text = codeBlock.textContent;
                        safeCopyToClipboard(text, button);
                    }
                }
            });

            const inputContainer = document.createElement('div');
            inputContainer.style.position = 'relative';
            inputContainer.style.width = '100%';
            inputContainer.style.boxSizing = 'border-box';
            inputContainer.style.height = '10vh';
            contentDiv.appendChild(inputContainer);

            messageInput = document.createElement('textarea');
            messageInput.placeholder = '给deepseek发送消息';
            messageInput.style.position = 'absolute';
            messageInput.style.left = '0';
            messageInput.style.right = '0';
            messageInput.style.bottom = '0';
            messageInput.style.height = '10vh';
            messageInput.style.padding = '0.5em 0.5em 3em 0.5em';
            messageInput.style.fontSize = '1.2em';
            messageInput.style.boxSizing = 'border-box';
            messageInput.style.borderRadius = '10px';
            messageInput.style.border = '1px solid white';
            messageInput.style.backgroundColor = inactiveColor;
            messageInput.style.color = 'white';
            messageInput.style.overflowY = 'hidden';
            messageInput.style.resize = 'none';
            inputContainer.appendChild(messageInput);

            const inputOverlay = document.createElement('div');
            inputOverlay.style.position = 'absolute';
            inputOverlay.style.left = '0.5em';
            inputOverlay.style.right = '0.8em';
            inputOverlay.style.bottom = '0.07em';
            inputOverlay.style.height = '2.5em';
            inputOverlay.style.backgroundColor = inactiveColor;
            inputOverlay.style.pointerEvents = 'none';
            inputContainer.appendChild(inputOverlay);

            // 创建模型、记忆和发送按钮
            const modelBtn = document.createElement('button');
            modelBtn.innerText = "深度思考R1";
            modelBtn.style.position = 'absolute';
            modelBtn.style.left = '0.5em';
            modelBtn.style.bottom = '0.5em';
            modelBtn.style.width = '8em';
            modelBtn.style.height = '2em';
            modelBtn.style.fontSize = '1em';
            modelBtn.style.lineHeight = '2em';
            modelBtn.style.textAlign = 'center';
            modelBtn.style.borderRadius = '10px';
            modelBtn.style.border = '1px solid white';
            modelBtn.style.cursor = 'pointer';
            modelBtn.classList.add('persistent');
            modelBtn.addEventListener('click', () => {
                currentModel = (currentModel === 'deepseek-chat' ? 'deepseek-reasoner' : 'deepseek-chat');
                GM_setValue('currentModel', currentModel);
                modelBtn.style.backgroundColor = currentModel === 'deepseek-reasoner' ? activeColor : inactiveColor;
            });
            modelBtn.style.backgroundColor = currentModel === 'deepseek-reasoner' ? activeColor : inactiveColor;
            modelBtn.style.color = 'white';
            inputContainer.appendChild(modelBtn);

            const memoryBtn = document.createElement('button');
            memoryBtn.innerText = '记忆';
            memoryBtn.style.position = 'absolute';
            memoryBtn.style.left = '9em';
            memoryBtn.style.bottom = '0.5em';
            memoryBtn.style.width = '3em';
            memoryBtn.style.height = '2em';
            memoryBtn.style.fontSize = '1em';
            memoryBtn.style.lineHeight = '2em';
            memoryBtn.style.textAlign = 'center';
            memoryBtn.style.borderRadius = '10px';
            memoryBtn.style.border = '1px solid white';
            memoryBtn.style.cursor = 'pointer';
            memoryBtn.classList.add('persistent');
            memoryBtn.addEventListener('click', () => {
                memoryEnabled = !memoryEnabled;
                GM_setValue('memoryEnabled', memoryEnabled);
                memoryBtn.style.backgroundColor = memoryEnabled ? activeColor : inactiveColor;
            });
            memoryBtn.style.backgroundColor = memoryEnabled ? activeColor : inactiveColor;
            memoryBtn.style.color = 'white';
            inputContainer.appendChild(memoryBtn);

            sendBtn = document.createElement('button');
            sendBtn.innerText = '发送';
            sendBtn.style.position = 'absolute';
            sendBtn.style.right = '1.2em';
            sendBtn.style.bottom = '0.5em';
            sendBtn.style.width = '3em';
            sendBtn.style.height = '2em';
            sendBtn.style.fontSize = '1em';
            sendBtn.style.lineHeight = '2em';
            sendBtn.style.textAlign = 'center';
            sendBtn.style.borderRadius = '10px';
            sendBtn.style.border = '1px solid white';
            sendBtn.style.cursor = 'pointer';
            sendBtn.style.zIndex = '10';
            sendBtn.disabled = (messageInput.value.trim() === '');
            sendBtn.style.backgroundColor = sendBtn.disabled ? sendDisabledColor : sendEnabledColor;
            sendBtn.style.color = sendBtn.disabled ? "#666" : "#000";
            sendBtn.addEventListener('click', () => {
                if(sendBtn.textContent === '停止' && streamAbortController) {
                    streamAbortController.abort();
                } else {
                    sendMessage();
                }
            });
            inputContainer.appendChild(sendBtn);

            messageInput.addEventListener('input', autoResize);
            autoResize();

            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(isStreaming) {
                        if(streamAbortController) {
                            streamAbortController.abort();
                        }
                    } else {
                        if(messageInput.value.trim() === '') return;
                        sendMessage();
                    }
                }
            });

            // 发送消息函数（流式处理返回数据）
            async function sendMessage() {
                if (isStreaming) {
                    if (streamAbortController) {
                        streamAbortController.abort();
                    }
                    return;
                }
                const msg = messageInput.value.trim();
                if (!msg) return;
                {
                    const bubble = document.createElement('div');
                    bubble.style.cssText = `
                        padding: 0.5em;
                        margin: 0.5em 0;
                        border-radius: 12px;
                        max-width: 80%;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                        background-color: #6699CC;
                        color: white;
                        align-self: flex-end;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    `;
                    bubble.textContent = msg;
                    conversationDiv.appendChild(bubble);
                }
                currentSession.push({ role: "user", content: msg });
                saveCurrentSession();
                messageInput.value = '';
                isSending = true;
                isStreaming = true;
                sendBtn.textContent = '停止';
                sendBtn.disabled = false;
                autoResize();

                // 构造 assistant 消息显示容器，根据当前模型类型分支
                let finalDiv, headerTextSpan, collapseBtn, chainDiv;
                let assistantContainer;
                if (currentModel === 'deepseek-reasoner') {
                    assistantContainer = document.createElement("div");
                    assistantContainer.style.display = "flex";
                    assistantContainer.style.flexDirection = "column";
                    assistantContainer.style.alignSelf = "flex-start";

                    const headerBubble = document.createElement("div");
                    headerBubble.style.cssText = "padding: 0.5em; margin: 0.5em 0; border-radius: 12px; background-color: #444; color: #EEE; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: nowrap; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;";
                    headerTextSpan = document.createElement("span");
                    headerTextSpan.innerText = "思考中…";
                    headerBubble.appendChild(headerTextSpan);
                    collapseBtn = document.createElement("button");
                    collapseBtn.style.fontSize = "0.8em";
                    collapseBtn.style.cursor = "pointer";
                    collapseBtn.style.backgroundColor = inactiveColor;
                    collapseBtn.style.color = "#EEE";
                    collapseBtn.style.border = "none";
                    let chainCollapsed = GM_getValue('chainCollapsed', false);
                    collapseBtn.textContent = chainCollapsed ? "∨" : "∧";
                    collapseBtn.addEventListener('click', () => {
                        chainCollapsed = !chainCollapsed;
                        GM_setValue('chainCollapsed', chainCollapsed);
                        if(chainDiv) {
                            chainDiv.style.display = chainCollapsed ? "none" : "";
                        }
                        collapseBtn.textContent = chainCollapsed ? "∨" : "∧";
                        setTimeout(() => {
                            const totalWidth = headerTextSpan.scrollWidth + collapseBtn.offsetWidth;
                            headerTextSpan.parentElement.style.width = totalWidth + "px";
                        }, 0);
                    });
                    headerBubble.appendChild(collapseBtn);
                    setTimeout(() => {
                        const totalWidth = headerTextSpan.scrollWidth + collapseBtn.offsetWidth;
                        headerBubble.style.width = totalWidth + "px";
                    }, 0);
                    assistantContainer.appendChild(headerBubble);

                    const contentContainer = document.createElement("div");
                    contentContainer.style.padding = "0.5em";
                    chainDiv = document.createElement("div");
                    chainDiv.style.fontSize = "0.9em";
                    chainDiv.style.fontStyle = "italic";
                    chainDiv.style.color = "#aaa";
                    chainDiv.style.whiteSpace = "pre-wrap";
                    chainDiv.style.display = GM_getValue('chainCollapsed', false) ? 'none' : '';
                    contentContainer.appendChild(chainDiv);
                    finalDiv = document.createElement("div");
                    finalDiv.style.whiteSpace = "pre-wrap";
                    contentContainer.appendChild(finalDiv);
                    assistantContainer.appendChild(contentContainer);
                    conversationDiv.appendChild(assistantContainer);
                } else {
                    assistantContainer = document.createElement("div");
                    assistantContainer.style.display = "flex";
                    assistantContainer.style.flexDirection = "column";
                    assistantContainer.style.alignSelf = "flex-start";
                    // 添加“…”提示
                    const thinkingPlaceholder = document.createElement("div");
                    thinkingPlaceholder.innerText = "…";
                    thinkingPlaceholder.style.color = "#888";
                    thinkingPlaceholder.style.fontStyle = "italic";
                    thinkingPlaceholder.style.marginBottom = "0.5em";
                    assistantContainer.appendChild(thinkingPlaceholder);

                    finalDiv = document.createElement("div");
                    finalDiv.style.whiteSpace = "pre-wrap";
                    assistantContainer.appendChild(finalDiv);
                    conversationDiv.appendChild(assistantContainer);

                    // 设置 removeThinkingPlaceholder 函数，确保只删一次
                    var hasRemovedPlaceholder = false;
                    var removeThinkingPlaceholder = () => {
                        if (!hasRemovedPlaceholder && thinkingPlaceholder.parentElement) {
                            thinkingPlaceholder.remove();
                            hasRemovedPlaceholder = true;
                        }
                    };
                }
                conversationDiv.scrollTop = conversationDiv.scrollHeight;
                const startTime = Date.now();
                let headerUpdated = false;
                let chainOfThought = "";
                let finalContent = "";

                // 构造请求上下文
                let messagesPayload = [{ role: "system", content: "You are a helpful assistant." }];
                if (memoryEnabled && currentSession.length > 1) {
                    let memoryText = currentSession.map(m => m.content).join("\n");
                    messagesPayload.push({ role: "user", content: memoryText });
                } else {
                    messagesPayload.push({ role: "user", content: msg });
                }

                // 使用当前平台的API key和base_url（注意处理尾部斜杠）
                const apiKey = storedKeys[currentPlatform];
                const base_url = platforms[currentPlatform].base_url.replace(/\/$/, '');
                // 根据当前模型类型使用对应平台模型id
                const modelId = (currentModel === 'deepseek-chat' ? platforms[currentPlatform].chat_model_id : platforms[currentPlatform].reasoner_model_id);

                streamAbortController = new AbortController();
                try {
                    const response = await unsafeWindow.fetch(base_url + '/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + apiKey
                        },
                        body: JSON.stringify({
                            messages: messagesPayload,
                            model: modelId,
                            stream: true
                        }),
                        signal: streamAbortController.signal
                    });
                    if (!response.body) {
                        throw new Error("当前环境不支持流式读取");
                    }
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = "";
                    let done = false;
                    while (!done) {
                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop();
                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed) continue;
                            if (trimmed.startsWith("data: ")) {
                                const jsonStr = trimmed.slice(6).trim();
                                if (jsonStr === "[DONE]") {
                                    done = true;
                                    break;
                                }
                                try {
                                    const data = JSON.parse(jsonStr);
                                    const delta = data.choices?.[0]?.delta;
                                    if (delta) {
                                        if (currentModel === 'deepseek-reasoner') {
                                            if (delta.reasoning_content) {
                                                chainOfThought += delta.reasoning_content;
                                            }
                                            if (delta.content) {
                                                if (!headerUpdated && delta.content.trim() !== "") {
                                                    const elapsed = Math.round((Date.now() - startTime) / 1000);
                                                    headerTextSpan.innerText = `已深度思考（用时${elapsed}秒）`;
                                                    setTimeout(() => {
                                                        const totalWidth = headerTextSpan.scrollWidth + collapseBtn.offsetWidth;
                                                        headerTextSpan.parentElement.style.width = totalWidth + "px";
                                                    }, 0);
                                                    headerUpdated = true;
                                                }
                                                finalContent += delta.content;
                                            }
                                            chainDiv.innerHTML = renderMarkdown(chainOfThought).innerHTML;
                                            finalDiv.innerHTML = renderMarkdown(finalContent).innerHTML;
                                        } else {
                                            if (delta.content) {
                                                removeThinkingPlaceholder();
                                                finalContent += delta.content;
                                                finalDiv.innerHTML = renderMarkdown(finalContent).innerHTML;
                                            }
                                        }
                                        if (autoScrollEnabled) {
                                            conversationDiv.scrollTop = conversationDiv.scrollHeight;
                                        }
                                    }
                                } catch (err) {
                                    console.error("解析流式数据失败:", err);
                                }
                            }
                        }
                    }
                } catch (err) {
                    if (err.name === "AbortError") {
                        finalDiv.innerHTML += `<div style="color:#faa;">（流式输出已停止）</div>`;
                    } else {
                        finalDiv.innerHTML += `<div style="color:#faa;">请求失败: ${err.message}</div>`;
                    }
                } finally {
                    if (currentModel === 'deepseek-reasoner') {
                        chainDiv.innerHTML = renderMarkdown(chainOfThought).innerHTML;
                        finalDiv.innerHTML = renderMarkdown(finalContent).innerHTML;
                    } else {
                        finalDiv.innerHTML = renderMarkdown(finalContent).innerHTML;
                    }
                    if (currentModel === 'deepseek-reasoner') {
                        const fixedWidth = headerTextSpan.parentElement.offsetWidth;
                        currentSession.push({
                            role: "assistant",
                            content: finalContent,
                            chain: chainOfThought,
                            headerWidth: fixedWidth + "px",
                            headerText: headerTextSpan.innerText
                        });
                    } else {
                        currentSession.push({ role: "assistant", content: finalContent });
                    }
                    saveCurrentSession();
                    isSending = false;
                    finishStreaming();
                    conversationDiv.scrollTop = conversationDiv.scrollHeight;
                }
            }
        }
    }

    renderUI();

    /***************** 显示与隐藏窗口 *****************/
    let visible = false;
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
            visible = !visible;
            host.style.display = visible ? 'block' : 'none';
            if (visible) {
                // 显示时让文本区域获得焦点
                setTimeout(() => {
                    const input = shadow.querySelector('textarea');
                    input?.focus();
                }, 100);
            } else {
                // 隐藏时调用隐藏历史记录面板的函数
                hideHistoryPanel();
            }
            e.preventDefault();
            e.stopPropagation();
        }
    });
})();
// ==UserScript==
// @name         Grok 3 Conversation Helper
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @license      MIT
// @description  Enhance Grok 3 conversations with check codes, summaries, and message tracking, with stable strategy selection
// @author       xAI
// @match        https://x.com/i/grok?conversation=*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/12345-qrcode-generator/code/QRCode%20Generator.js
// @downloadURL https://update.greasyfork.org/scripts/529840/Grok%203%20Conversation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/529840/Grok%203%20Conversation%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量
    const MAX_CHARS = 300000;
    const INITIAL_DELAY = 2000;

    // 全局變量
    let cachedMessages = [];
    let lastUpdateTime = Date.now();
    let selectedStrategy = null;
    let currentVersion = localStorage.getItem('scriptVersion') || '1.7.2';
    const conversationId = window.location.href.match(/conversation=(\d+)/)?.[1] || "unknown";

    // 版本切換功能
    function setupVersionSwitch() {
        const versionDiv = document.createElement('div');
        versionDiv.id = 'version-switch-container';
        versionDiv.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 10001; background: #f0f0f0; padding: 5px; border: 1px solid #ccc;';
        versionDiv.innerHTML = `
            <select id="version-switch">
                <option value="1.7.2" ${currentVersion === '1.7.2' ? 'selected' : ''}>新版 1.7.2</option>
                <option value="1.24" ${currentVersion === '1.24' ? 'selected' : ''}>舊版 1.24</option>
            </select>
            <button id="switch-version-btn">切換</button>
        `;
        document.body.appendChild(versionDiv);

        document.getElementById('switch-version-btn').addEventListener('click', () => {
            const newVersion = document.getElementById('version-switch').value;
            if (newVersion !== currentVersion) {
                localStorage.setItem('scriptVersion', newVersion);
                location.reload();
            }
        });
    }

    // 等待頁面穩定
    function waitForStablePage() {
        return new Promise((resolve) => {
            const checkPage = () => {
                if (document.readyState === 'complete' && document.body) {
                    console.log('頁面完全載入，開始執行');
                    resolve();
                } else {
                    setTimeout(checkPage, 500);
                }
            };
            checkPage();
        });
    }

    // 顯示策略選單
    function showStrategySelection() {
        if (!document.body) {
            console.error('document.body 未準備好');
            return;
        }
        const selectionDiv = document.createElement("div");
        selectionDiv.id = "strategy-selection";
        selectionDiv.style.cssText = "position: fixed; top: 20px; left: 20px; background: #fff; padding: 10px; border: 1px solid #000; z-index: 10000;";
        selectionDiv.innerHTML = `
            <p>選擇修復策略：</p>
            <button onclick="selectedStrategy='strategy1';applyStrategy();this.parentElement.style.display='none'">策略1: 優化載入</button>
            <button onclick="selectedStrategy='strategy2';applyStrategy();this.parentElement.style.display='none'">策略2: 強制 DOM</button>
            <button onclick="selectedStrategy='strategy3';applyStrategy();this.parentElement.style.display='none'">策略3: 減少頻率</button>
            <button onclick="selectedStrategy='strategy4';applyStrategy();this.parentElement.style.display='none'">策略4: 跳過問題</button>
        `;
        document.body.appendChild(selectionDiv);
        console.log("選單已顯示");
    }

    // 應用選擇的策略
    function applyStrategy() {
        switch (selectedStrategy) {
            case "strategy1":
                console.log("執行策略：優化 DOM 載入");
                initAfterSelection();
                break;
            case "strategy2":
                ensureMessageContainer();
                console.log("執行策略：強制創建 DOM 元素");
                initAfterSelection();
                break;
            case "strategy3":
                clearInterval(window.monitorInterval);
                window.monitorInterval = setInterval(monitorConversation, 30000);
                console.log("執行策略：減少執行頻率");
                initAfterSelection();
                break;
            case "strategy4":
                window.skipProblematicFeatures = true;
                console.log("執行策略：跳過問題區域");
                initAfterSelection();
                break;
            default:
                console.log("未選擇有效策略，啟動默認初始化");
                initAfterSelection();
        }
    }

    // 動態樣式
    function setDynamicStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .message-container { max-height: 500px; overflow-y: auto; }
            #debug-window { position: fixed; top: 10px; right: 10px; width: 300px; max-height: 200px; overflow-y: auto; background: #ffe6e6; border: 1px solid #ff0000; padding: 10px; z-index: 1000; }
        `;
        document.head.appendChild(style);
    }

    // 控制按鈕
    function addControlButtons() {
        const container = document.createElement("div");
        container.innerHTML = `
            <button id="display-summary-btn">顯示總結與完整對話</button>
            <button id="clear-cache-btn">清除快取</button>
        `;
        document.body.appendChild(container);

        document.getElementById("display-summary-btn").addEventListener("click", displaySummaryAndFullChat);
        document.getElementById("clear-cache-btn").addEventListener("click", clearCache);
    }

    // 字數統計
    function countChars() {
        return cachedMessages.reduce((sum, msg) => sum + (msg ? msg.length : 0), 0);
    }

    // 生成總結
    function generateSummary(messages, totalChars, attachmentCount, conversationId, checkCode) {
        const lastMessage = messages[messages.length - 1] || "無對話";
        return `主題總結：${lastMessage.slice(0, 20)} | 字數：${totalChars} | 附件數：${attachmentCount} | 編碼：${checkCode}`;
    }

    // 動態消息選擇器
    function getDynamicMessageSelector() {
        const sampleSpan = document.querySelector("span[class*='css-'][class*='r-bcqeeo'][class*='r-1ttztb7']");
        return sampleSpan ? `span.${sampleSpan.className.split(" ").join(".")}` : "span";
    }

    // 嘗試抓取消息
    function tryFetchMessages() {
        try {
            const selector = getDynamicMessageSelector();
            const messageElements = Array.from(document.querySelectorAll(selector))
                .filter(el => el.textContent.trim().length > 0 && !el.closest("aside") && !el.closest("header") && !el.closest("footer"));
            if (messageElements.length > 0) {
                cachedMessages = messageElements.map(el => el.textContent.trim());
                if (typeof GM_setValue === "function") {
                    GM_setValue(`cachedMessages_${conversationId}`, JSON.stringify(cachedMessages));
                }
                updateStorage();
            }
        } catch (e) {
            logDebug(`抓取訊息失敗: ${e.message}`);
        }
    }

    // 更新儲存
    function updateStorage() {
        const messageArray = cachedMessages.filter(Boolean).filter((item, index, self) => self.indexOf(item) === index);
        const totalChars = countChars();
        const attachmentCount = document.querySelectorAll("img, video, audio").length;
        const timestamp = new Date().toLocaleString('zh-TW').replace(/[:\s]/g, "").slice(0, 12);
        const topic = messageArray.length > 0 ? messageArray[0].slice(0, 20).replace(/\s/g, "") : "NoTopic";
        const checkCode = `G3-CHK-${conversationId}-${timestamp}-${topic}`;

        const newSummary = generateSummary(messageArray, totalChars, attachmentCount, conversationId, checkCode);
        localStorage.setItem("grok_summary", newSummary);
        localStorage.setItem(`full_chat_${conversationId}`, messageArray.join("\n"));
        if (typeof GM_setValue === "function") {
            GM_setValue(`cachedMessages_${conversationId}`, JSON.stringify(cachedMessages));
            GM_setValue(`checkCode_${conversationId}`, checkCode);
        }
        displaySummaryAndFullChat();
    }

    // 顯示總結和完整對話
    function displaySummaryAndFullChat() {
        const container = ensureMessageContainer();
        if (!container) return;
        const summary = localStorage.getItem("grok_summary") || "無總結";
        const fullChat = localStorage.getItem(`full_chat_${conversationId}`) || "無對話";
        container.textContent = `總結：${summary}\n完整對話：\n${fullChat}`;
    }

    // 創建調試窗口
    function createDebugWindow() {
        let debugWindow = document.getElementById("debug-window");
        if (!debugWindow) {
            debugWindow = document.createElement("div");
            debugWindow.id = "debug-window";
            debugWindow.innerHTML = `<div id="debug-content"></div><button id="close-debug-btn">關閉</button>`;
            document.body.appendChild(debugWindow);
            document.getElementById("close-debug-btn").addEventListener("click", () => debugWindow.style.display = "none");
        }
    }

    function logDebug(message) {
        const debugContent = document.getElementById("debug-content");
        if (debugContent) {
            debugContent.innerHTML += `<p>${message}</p>`;
            document.getElementById("debug-window").style.display = "block";
        }
    }

    // 監控對話
    function monitorConversation() {
        try {
            const messageElements = document.querySelectorAll("span.css-1jf68r4.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-a8ghwy");
            if (messageElements.length > cachedMessages.length) {
                lastUpdateTime = Date.now();
                cachedMessages = Array.from(messageElements).map(el => el.textContent.trim());
                if (typeof GM_setValue === "function") {
                    GM_setValue(`cachedMessages_${conversationId}`, JSON.stringify(cachedMessages));
                }
                updateStorage();
            }
        } catch (e) {
            logDebug(`監控對話失敗: ${e.message}`);
        }
    }

    // 確保消息容器
    function ensureMessageContainer() {
        let messageContainer = document.querySelector(".message-container");
        if (!messageContainer) {
            messageContainer = document.createElement("div");
            messageContainer.className = "message-container";
            messageContainer.style.cssText = "max-height: 500px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;";
            document.body.appendChild(messageContainer);
        }
        return messageContainer;
    }

    // 清除快取
    function clearCache() {
        localStorage.removeItem("grok_summary");
        localStorage.removeItem(`full_chat_${conversationId}`);
        if (typeof GM_setValue === "function") {
            GM_setValue(`cachedMessages_${conversationId}`, JSON.stringify([]));
            GM_setValue(`checkCode_${conversationId}`, "");
        }
        cachedMessages = [];
        logDebug("快取已清除");
    }

    // 初始化後續邏輯
    function initAfterSelection() {
        setDynamicStyles();
        addControlButtons();
        createDebugWindow();
        window.monitorInterval = setInterval(monitorConversation, 10000);
        setTimeout(tryFetchMessages, INITIAL_DELAY);
    }

    // 啟動腳本
    (function() {
        'use strict';
        setupVersionSwitch();
        waitForStablePage().then(showStrategySelection).catch(err => {
            console.error('啟動失敗:', err);
            showStrategySelection();
        });
    })();
})();
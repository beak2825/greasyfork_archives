// ==UserScript==
// @note         loop正常，不過不夠模擬真人行為
// @name         Threads V1.0
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動瀏覽 Threads 文章，模擬真實使用行為。工具欄新增【開始🚀】與【暫停⏹】按鈕，並在工作狀態欄顯示倒計時與循環次數（完整迴圈次數）。用來刷文章觀看使用。
// @author       ChatGPT
// @match        https://www.threads.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532954/Threads%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/532954/Threads%20V10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --------------------
    // 讀取或設定目標文章與首頁 URL（若 localStorage 中無則採用預設值）
    // --------------------
    let targetUrl = localStorage.getItem("THREADS_TARGET_URL") || "https://www.threads.net/posts/xxxxxx"; // 請替換成預設目標文章 URL
    let homeUrl = localStorage.getItem("HOME_URL") || "https://www.threads.net"; // 預設首頁 URL
    localStorage.setItem("THREADS_TARGET_URL", targetUrl);
    localStorage.setItem("HOME_URL", homeUrl);

    // --------------------
    // 狀態標識與記錄（存於 localStorage）
// AUTO_FLAG：當值為 "true" 時表示自動化運行；
// LOOP_COUNT_KEY：記錄已完成循環次數
    // --------------------
    const AUTO_FLAG = "THREADS_AUTOMATION_RUNNING";
    const LOOP_COUNT_KEY = "LOOP_COUNT";

    // --------------------
    // 時間參數設定
// 目標文章頁停留時間：30～60秒
// 首頁瀏覽時間：3～5分鐘
// 滾動間隔：2～5秒
    // --------------------
    const STAY_TIME = [30000, 60000];       // 在目標文章頁停留 30～60秒
    const SCROLL_INTERVAL = [2000, 5000];     // 滾動間隔 2～5秒
    const BROWSE_TIME = [180000, 300000];     // 首頁瀏覽 3～5分鐘

    // --------------------
    // 工具函式：隨機延遲與等待
    // --------------------
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --------------------
    // 倒計時等待函式（每秒更新倒計時顯示，description：當前階段描述）
    // --------------------
    async function countdown(ms, description) {
        let seconds = Math.ceil(ms / 1000);
        while (seconds > 0 && localStorage.getItem(AUTO_FLAG) === "true") {
            countdownDisplay.textContent = `${description} 倒數：${seconds}秒`;
            await wait(1000);
            seconds--;
        }
    }

    // --------------------
    // 更新狀態顯示函式
    // --------------------
    function updateStatus(text) {
        statusDisplay.textContent = "狀態：" + text;
    }

    // --------------------
    // Log 紀錄（輸出到日誌區域）
    // --------------------
    function logMessage(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // --------------------
    // 模擬滾動：增加隨機上下滾動效果（模擬真實使用者）
    // --------------------
    async function scrollPage() {
        logMessage("👉 開始滾動頁面...");
        const scrollStep = window.innerHeight * (Math.random() * 0.5 + 0.5);
        // 70% 機率向下滾，30% 向上滾
        const direction = Math.random() < 0.7 ? 1 : -1;
        window.scrollBy({ top: scrollStep * direction, behavior: 'smooth' });
        await wait(randomDelay(...SCROLL_INTERVAL));
        logMessage("✅ 完成滾動");
    }

    // --------------------
    // 模擬目標文章頁瀏覽（完整一輪迴圈之一：目標頁）
    // --------------------
    async function simulateTargetPage() {
        if (!window.location.href.includes("/posts/")) return; // 確保在目標文章頁
        // 增加循環計數：每進入目標文章頁視為開始新一輪循環
        let count = parseInt(localStorage.getItem(LOOP_COUNT_KEY) || "0") + 1;
        localStorage.setItem(LOOP_COUNT_KEY, count.toString());
        cycleCountDisplay.textContent = "已循環：" + count + " 次";
        updateStatus("瀏覽目標文章中");
        logMessage("🔔 開始在目標文章頁模擬瀏覽...");
        let duration = randomDelay(...STAY_TIME);
        let startTime = Date.now();
        while (Date.now() - startTime < duration && localStorage.getItem(AUTO_FLAG) === "true") {
            await scrollPage();
            let remaining = Math.ceil((duration - (Date.now() - startTime)) / 1000);
            countdownDisplay.textContent = "目標頁倒數：" + remaining + "秒";
        }
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            updateStatus("結束目標文章瀏覽，準備返回首頁");
            let waitTime = randomDelay(10000, 20000);
            await countdown(waitTime, "返回首頁等待");
            window.location.href = homeUrl;
        }
    }

    // --------------------
    // 模擬首頁瀏覽（完整一輪迴圈之一：首頁）
    // --------------------
    async function simulateHomePage() {
        if (window.location.href.includes("/posts/")) return; // 確保不在目標文章頁
        updateStatus("瀏覽首頁中");
        logMessage("🔔 開始在首頁模擬瀏覽...");
        let duration = randomDelay(...BROWSE_TIME);
        let startTime = Date.now();
        while (Date.now() - startTime < duration && localStorage.getItem(AUTO_FLAG) === "true") {
            await scrollPage();
            let remaining = Math.ceil((duration - (Date.now() - startTime)) / 1000);
            countdownDisplay.textContent = "首頁倒數：" + remaining + "秒";
        }
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            updateStatus("結束首頁瀏覽，準備返回目標文章");
            let waitTime = randomDelay(10000, 20000);
            await countdown(waitTime, "返回目標等待");
            window.location.href = targetUrl;
        }
    }

    // --------------------
    // 自動恢復：根據當前 URL 判斷執行哪個模擬過程
    // --------------------
    function autoContinue() {
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            if (window.location.href.includes("/posts/")) {
                simulateTargetPage();
            } else {
                simulateHomePage();
            }
        } else {
            updateStatus("待命");
        }
    }

    // --------------------
    // 建立控制面板界面（增加 Emoji，使界面更活潑）
    // --------------------
    const controlPanelDiv = document.createElement('div');
    controlPanelDiv.style.position = 'fixed';
    controlPanelDiv.style.top = '10px';
    controlPanelDiv.style.right = '10px';
    controlPanelDiv.style.backgroundColor = '#f1f1f1';
    controlPanelDiv.style.padding = '10px';
    controlPanelDiv.style.border = '1px solid #ccc';
    controlPanelDiv.style.zIndex = '9999';
    controlPanelDiv.style.fontSize = '14px';
    controlPanelDiv.style.maxWidth = '300px';

    // 目標文章 URL 更新按鈕（帶 Emoji）
    const updateTargetBtn = document.createElement('button');
    updateTargetBtn.textContent = "更新目標文章 ✏️";
    updateTargetBtn.style.display = 'block';
    updateTargetBtn.style.marginBottom = '5px';
    updateTargetBtn.onclick = function() {
        const newPostUrl = prompt("請輸入新的目標文章 URL:");
        if (newPostUrl) {
            targetUrl = newPostUrl;
            localStorage.setItem("THREADS_TARGET_URL", targetUrl);
            logMessage("🔄 目標文章鏈接已更新: " + targetUrl);
            updateStatus("目標文章更新完畢");
        }
    };

    // 首頁 URL 更新按鈕（帶 Emoji）
    const updateHomeBtn = document.createElement('button');
    updateHomeBtn.textContent = "更新首頁 URL 🌐";
    updateHomeBtn.style.display = 'block';
    updateHomeBtn.style.marginBottom = '5px';
    updateHomeBtn.onclick = function() {
        const newHomeUrl = prompt("請輸入新的首頁 URL:");
        if (newHomeUrl) {
            homeUrl = newHomeUrl;
            localStorage.setItem("HOME_URL", homeUrl);
            logMessage("🔄 首頁鏈接已更新: " + homeUrl);
            updateStatus("首頁更新完畢");
        }
    };

    // 開始按鈕（帶 Emoji）
    const startBtn = document.createElement('button');
    startBtn.textContent = "開始 🚀";
    startBtn.style.marginRight = '10px';

    // 暫停按鈕（帶 Emoji）
    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = "暫停 ⏹";

    // 狀態顯示區域
    const statusDisplay = document.createElement('div');
    statusDisplay.style.backgroundColor = '#fff';
    statusDisplay.style.border = '1px solid #ccc';
    statusDisplay.style.padding = '4px';
    statusDisplay.style.margin = '4px 0';
    statusDisplay.textContent = "狀態：待命";

    // 倒計時顯示區域
    const countdownDisplay = document.createElement('div');
    countdownDisplay.style.backgroundColor = '#fff';
    countdownDisplay.style.border = '1px solid #ccc';
    countdownDisplay.style.padding = '4px';
    countdownDisplay.style.margin = '4px 0';
    countdownDisplay.textContent = "倒計時：";

    // 循環次數顯示區域
    const cycleCountDisplay = document.createElement('div');
    cycleCountDisplay.style.backgroundColor = '#fff';
    cycleCountDisplay.style.border = '1px solid #ccc';
    cycleCountDisplay.style.padding = '4px';
    cycleCountDisplay.style.margin = '4px 0';
    cycleCountDisplay.textContent = "已循環：0 次";

    // 日誌顯示區域
    const logArea = document.createElement('div');
    logArea.style.height = '200px';
    logArea.style.overflowY = 'auto';
    logArea.style.backgroundColor = '#fff';
    logArea.style.border = '1px solid #ccc';
    logArea.style.padding = '5px';

    // 組裝控制面板
    controlPanelDiv.appendChild(updateTargetBtn);
    controlPanelDiv.appendChild(updateHomeBtn);
    const btnContainer = document.createElement('div');
    btnContainer.appendChild(startBtn);
    btnContainer.appendChild(pauseBtn);
    controlPanelDiv.appendChild(btnContainer);
    controlPanelDiv.appendChild(statusDisplay);
    controlPanelDiv.appendChild(countdownDisplay);
    controlPanelDiv.appendChild(cycleCountDisplay);
    controlPanelDiv.appendChild(logArea);
    document.body.appendChild(controlPanelDiv);

    // 更新狀態函數（此函數已在上方定義，重複定義則採用後者）
    function updateStatus(text) {
        statusDisplay.textContent = "狀態：" + text;
    }

    // 更新日誌函數
    function logMessage(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // --------------------
    // 開始按鈕事件：設置 AUTO_FLAG 為 "true"，重置循環計數，然後開始流程
    // --------------------
    startBtn.addEventListener('click', function() {
        localStorage.setItem(AUTO_FLAG, "true");
        localStorage.setItem(LOOP_COUNT_KEY, "0");
        cycleCountDisplay.textContent = "已循環：0 次";
        logMessage("🚀 開始模擬...");
        updateStatus("開始模擬");
        // 如果當前頁面不在目標文章頁，則跳轉；否則從目標文章開始
        if (!window.location.href.includes("/posts/")) {
            window.location.href = targetUrl;
        } else {
            simulateTargetPage();
        }
    });

    // 暫停按鈕事件：將 AUTO_FLAG 設為 "false"，重置循環次數
    pauseBtn.addEventListener('click', function() {
        localStorage.setItem(AUTO_FLAG, "false");
        logMessage("⛔ 模擬已暫停");
        updateStatus("已暫停");
        cycleCountDisplay.textContent = "已循環：0 次";
    });

    // --------------------
    // 當頁面載入時，根據 AUTO_FLAG 判斷是否繼續流程
    // --------------------
    window.addEventListener('load', function() {
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            logMessage("🔄 自動啟動檢測：恢復模擬");
            let cnt = localStorage.getItem(LOOP_COUNT_KEY) || "0";
            cycleCountDisplay.textContent = "已循環：" + cnt + " 次";
            if (window.location.href.includes("/posts/")) {
                simulateTargetPage();
            } else {
                simulateHomePage();
            }
        } else {
            updateStatus("待命");
            logMessage("頁面載入完成，請更新目標文章與首頁 URL，再點【開始】按鈕");
        }
    });

    // --------------------
    // 自動恢復：根據當前 URL 執行對應模擬流程
    // --------------------
    function autoContinue() {
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            if (window.location.href.includes("/posts/")) {
                simulateTargetPage();
            } else {
                simulateHomePage();
            }
        } else {
            updateStatus("待命");
        }
    }

    // 當頁面載入時，延遲執行 autoContinue（若頁面因跳轉而重載）
    setTimeout(autoContinue, 3000);

})();

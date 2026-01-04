// ==UserScript==
// @name         Threads V1.21 (支援 .net/.com)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  自動瀏覽 Threads 文章（支援 threads.net 與 threads.com）模擬真實使用行為，自動循環目標頁與首頁，含控制面板與倒計時。
// @author       ChatGPT
// @match        *://*.threads.net/*
// @match        *://*.threads.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533055/Threads%20V121%20%28%E6%94%AF%E6%8F%B4%20netcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533055/Threads%20V121%20%28%E6%94%AF%E6%8F%B4%20netcom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========= 初始設定 =========
    const DOMAIN = location.origin; // 自動抓取當前網址（https://www.threads.net 或 .com）

    let targetUrl = localStorage.getItem("THREADS_TARGET_URL") || `${DOMAIN}/posts/xxxxxx`;
    let homeUrl = localStorage.getItem("HOME_URL") || DOMAIN;

    localStorage.setItem("THREADS_TARGET_URL", targetUrl);
    localStorage.setItem("HOME_URL", homeUrl);

    const AUTO_FLAG = "THREADS_AUTOMATION_RUNNING";
    const LOOP_COUNT_KEY = "LOOP_COUNT";

    const STAY_TIME = [30000, 60000];
    const BROWSE_TIME = [120000, 180000];
    const SCROLL_INTERVAL = [2000, 5000];

    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function countdown(ms, description) {
        let seconds = Math.ceil(ms / 1000);
        while (seconds > 0 && localStorage.getItem(AUTO_FLAG) === "true") {
            countdownDisplay.textContent = `${description} 倒數：${seconds}秒`;
            await wait(1000);
            seconds--;
        }
    }
    function updateStatus(text) {
        statusDisplay.textContent = "狀態：" + text;
    }
    function logMessage(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    }
    async function scrollPage() {
        logMessage("👉 開始滾動頁面...");
        const scrollStep = window.innerHeight * (Math.random() * 0.5 + 0.5);
        const direction = Math.random() < 0.7 ? 1 : -1;
        window.scrollBy({ top: scrollStep * direction, behavior: 'smooth' });
        await wait(randomDelay(...SCROLL_INTERVAL));
        logMessage("✅ 完成滾動");
    }

    async function simulateTargetPage() {
        if (!(window.location.href.includes("/post/") || window.location.href.includes("/posts/"))) return;
        let count = parseInt(localStorage.getItem(LOOP_COUNT_KEY) || "0") + 1;
        localStorage.setItem(LOOP_COUNT_KEY, count.toString());
        cycleCountDisplay.textContent = "已循環：" + count + " 次";
        updateStatus("瀏覽目標文章中 📄");
        logMessage("🔔 開始在目標文章頁模擬瀏覽...");
        let duration = randomDelay(...STAY_TIME);
        let startTime = Date.now();
        while (Date.now() - startTime < duration && localStorage.getItem(AUTO_FLAG) === "true") {
            await scrollPage();
            let remaining = Math.ceil((duration - (Date.now() - startTime)) / 1000);
            countdownDisplay.textContent = "目標頁倒數：" + remaining + "秒";
        }
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            updateStatus("結束目標文章瀏覽，準備返回首頁 🏠");
            let waitTime = randomDelay(5000, 10000);
            await countdown(waitTime, "返回首頁等待");
            window.location.href = homeUrl;
        }
    }

    async function simulateHomePage() {
        if (window.location.href.includes("/post/") || window.location.href.includes("/posts/")) return;
        updateStatus("瀏覽首頁中 🌐");
        logMessage("🔔 開始在首頁模擬瀏覽...");
        const startTime = Date.now();
        const browseDuration = randomDelay(...BROWSE_TIME);
        let clickCount = 0;
        while (Date.now() - startTime < browseDuration && localStorage.getItem(AUTO_FLAG) === "true") {
            await scrollPage();
            let remaining = Math.ceil((browseDuration - (Date.now() - startTime)) / 1000);
            countdownDisplay.textContent = "首頁倒數：" + remaining + "秒";
            if (Math.random() < 0.3 && clickCount < 2) {
                logMessage("隨機點擊一篇文章...");
                let posts = document.querySelectorAll('.x1xdureb.xkbb5z.x13vxnyz');
                if (posts.length > 0) {
                    const randomPost = posts[Math.floor(Math.random() * posts.length)];
                    randomPost.click();
                    logMessage("點擊了文章，等待模擬瀏覽...");
                    let articleDuration = randomDelay(5000, 15000);
                    let articleStart = Date.now();
                    while (Date.now() - articleStart < articleDuration && localStorage.getItem(AUTO_FLAG) === "true") {
                        await scrollPage();
                    }
                    window.history.back();
                    logMessage("返回首頁...");
                    await wait(randomDelay(2000, 5000));
                    clickCount++;
                }
            }
        }
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            updateStatus("結束首頁瀏覽，準備返回目標文章 📄");
            let waitTime = randomDelay(5000, 10000);
            await countdown(waitTime, "返回目標等待");
            window.location.href = targetUrl;
        }
    }

    function autoContinue() {
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            if (window.location.href.includes("/post/") || window.location.href.includes("/posts/")) {
                simulateTargetPage();
            } else {
                simulateHomePage();
            }
        } else {
            updateStatus("待命");
        }
    }

    // ========= UI 控制面板 =========
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

    const updateTargetBtn = document.createElement('button');
    updateTargetBtn.textContent = "更新目標文章 ✏️";
    updateTargetBtn.style.display = 'block';
    updateTargetBtn.style.marginBottom = '5px';
    updateTargetBtn.onclick = function() {
        const newPostUrl = prompt("請輸入新的目標文章 URL:");
        if (newPostUrl) {
            targetUrl = newPostUrl;
            localStorage.setItem("THREADS_TARGET_URL", targetUrl);
            logMessage("🔄 目標文章連結已更新：" + targetUrl);
            updateStatus("目標文章更新完畢");
        }
    };

    const updateHomeBtn = document.createElement('button');
    updateHomeBtn.textContent = "更新首頁 URL 🌐";
    updateHomeBtn.style.display = 'block';
    updateHomeBtn.style.marginBottom = '5px';
    updateHomeBtn.onclick = function() {
        const newHomeUrl = prompt("請輸入新的首頁 URL:");
        if (newHomeUrl) {
            homeUrl = newHomeUrl;
            localStorage.setItem("HOME_URL", homeUrl);
            logMessage("🔄 首頁連結已更新：" + homeUrl);
            updateStatus("首頁更新完畢");
        }
    };

    const startBtn = document.createElement('button');
    startBtn.textContent = "開始 🚀";
    startBtn.style.marginRight = '10px';

    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = "暫停 ⛔";

    const btnContainer = document.createElement('div');
    btnContainer.appendChild(startBtn);
    btnContainer.appendChild(pauseBtn);

    const statusDisplay = document.createElement('div');
    const countdownDisplay = document.createElement('div');
    const cycleCountDisplay = document.createElement('div');
    const logArea = document.createElement('div');

    [statusDisplay, countdownDisplay, cycleCountDisplay].forEach(el => {
        el.style.backgroundColor = '#fff';
        el.style.border = '1px solid #ccc';
        el.style.padding = '4px';
        el.style.margin = '4px 0';
    });
    statusDisplay.textContent = "狀態：待命";
    countdownDisplay.textContent = "倒計時：";
    cycleCountDisplay.textContent = "已循環：0 次";

    logArea.style.height = '200px';
    logArea.style.overflowY = 'auto';
    logArea.style.backgroundColor = '#fff';
    logArea.style.border = '1px solid #ccc';
    logArea.style.padding = '5px';

    controlPanelDiv.appendChild(updateTargetBtn);
    controlPanelDiv.appendChild(updateHomeBtn);
    controlPanelDiv.appendChild(btnContainer);
    controlPanelDiv.appendChild(statusDisplay);
    controlPanelDiv.appendChild(countdownDisplay);
    controlPanelDiv.appendChild(cycleCountDisplay);
    controlPanelDiv.appendChild(logArea);
    document.body.appendChild(controlPanelDiv);

    startBtn.addEventListener('click', function() {
        localStorage.setItem(AUTO_FLAG, "true");
        localStorage.setItem(LOOP_COUNT_KEY, "0");
        cycleCountDisplay.textContent = "已循環：0 次";
        logMessage("🚀 開始模擬...");
        updateStatus("開始模擬");
        if (!(window.location.href.includes("/post/") || window.location.href.includes("/posts/"))) {
            window.location.href = targetUrl;
        } else {
            simulateTargetPage();
        }
    });

    pauseBtn.addEventListener('click', function() {
        localStorage.setItem(AUTO_FLAG, "false");
        logMessage("⛔ 模擬已暫停");
        updateStatus("已暫停");
        cycleCountDisplay.textContent = "已循環：0 次";
    });

    window.addEventListener('load', function() {
        if (localStorage.getItem(AUTO_FLAG) === "true") {
            logMessage("🔄 自動啟動檢測：恢復模擬");
            let cnt = localStorage.getItem(LOOP_COUNT_KEY) || "0";
            cycleCountDisplay.textContent = "已循環：" + cnt + " 次";
            autoContinue();
        } else {
            updateStatus("待命");
            logMessage("頁面載入完成，請更新目標文章與首頁 URL，再點【開始 🚀】按鈕");
        }
    });

    setTimeout(autoContinue, 3000);
})();

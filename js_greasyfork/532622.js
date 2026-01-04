// ==UserScript==
// @name         Facebook 優化版自動戳回
// @namespace    https://github.com/poterpan/tampermonkey-scripts/facebook-autopoke
// @version      3.5.2
// @description  自動在Facebook上戳回朋友，帶有控制面板和統計功能
// @author       PoterPan
// @match      https://www.facebook.com/pokes
// @match      https://www.facebook.com/pokes/*
// @homepageURL  https://github.com/poterpan/tampermonkey-scripts
// @supportURL   https://github.com/poterpan/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/532622/Facebook%20%E5%84%AA%E5%8C%96%E7%89%88%E8%87%AA%E5%8B%95%E6%88%B3%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/532622/Facebook%20%E5%84%AA%E5%8C%96%E7%89%88%E8%87%AA%E5%8B%95%E6%88%B3%E5%9B%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局設置和計數變數
    const settings = {
        enabled: true,           // 是否啟用自動戳回
        minDelay: 3,             // 最小延遲（秒）
        maxDelay: 30,            // 最大延遲（秒）
        idleMinDelay: 30,        // 閒置狀態最小延遲（秒）
        idleMaxDelay: 90,        // 閒置狀態最大延遲（秒）
        idleThreshold: 10        // 多少次無活動後進入閒置狀態
    };

    // 統計數據
    const stats = {
        totalPokes: 0,           // 總戳回次數
        personalStats: {},       // 每個人的戳回次數
        lastPokeTime: null,      // 上次戳回時間
        nextPokeTime: null,      // 下次預計戳回時間
        noActivityCount: 0,      // 無活動計數
        isIdle: false            // 是否處於閒置狀態
    };

    // 追蹤已處理的按鈕
    const processedButtons = new Set();
    let controlPanel = null;     // 控制面板引用
    let timerInterval = null;    // 倒計時計時器

    // 儲存設定到 localStorage
    function saveSettings() {
        localStorage.setItem('fb_autopoke_settings', JSON.stringify(settings));
        console.log('設定已儲存', settings);
    }

    // 儲存統計到 localStorage
    function saveStats() {
        localStorage.setItem('fb_autopoke_stats', JSON.stringify(stats));
    }

    // 創建控制面板
    function createControlPanel() {
        if (document.getElementById("fb_autopoke_panel")) return;

        // 主控制面板
        const panel = document.createElement("div");
        panel.id = "fb_autopoke_panel";
        panel.style.position = "fixed";
        panel.style.zIndex = "10000";
        panel.style.right = "20px";
        panel.style.top = "60px";
        panel.style.width = "280px";
        panel.style.backgroundColor = "#fff";
        panel.style.border = "1px solid #dddfe2";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        panel.style.fontFamily = "Arial, sans-serif";
        panel.style.fontSize = "13px";
        panel.style.color = "#1c1e21";

        // 面板標題
        const header = document.createElement("div");
        header.style.padding = "10px";
        header.style.borderBottom = "1px solid #dddfe2";
        header.style.fontWeight = "bold";
        header.style.backgroundColor = "#4267b2";
        header.style.color = "#fff";
        header.style.borderRadius = "8px 8px 0 0";
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.innerHTML = "Facebook 自動戳回控制面板";

        // 最小化按鈕
        const minButton = document.createElement("button");
        minButton.textContent = "−";
        minButton.style.background = "none";
        minButton.style.border = "none";
        minButton.style.color = "#fff";
        minButton.style.fontWeight = "bold";
        minButton.style.fontSize = "16px";
        minButton.style.cursor = "pointer";
        minButton.title = "最小化";
        minButton.onclick = function() {
            const content = document.getElementById("fb_autopoke_content");
            if (content.style.display === "none") {
                content.style.display = "block";
                this.textContent = "−";
                this.title = "最小化";
            } else {
                content.style.display = "none";
                this.textContent = "+";
                this.title = "展開";
            }
        };
        header.appendChild(minButton);

        // 內容區域
        const content = document.createElement("div");
        content.id = "fb_autopoke_content";
        content.style.padding = "10px";

        // 操作區域
        const controls = document.createElement("div");
        controls.style.marginBottom = "10px";

        // 開關按鈕
        const toggleBtn = document.createElement("button");
        toggleBtn.id = "fb_autopoke_toggle";
        toggleBtn.textContent = settings.enabled ? "已啟用" : "已停用";
        toggleBtn.style.padding = "5px 10px";
        toggleBtn.style.marginRight = "10px";
        toggleBtn.style.border = "none";
        toggleBtn.style.borderRadius = "4px";
        toggleBtn.style.backgroundColor = settings.enabled ? "#42b72a" : "#f5f6f7";
        toggleBtn.style.color = settings.enabled ? "#fff" : "#4b4f56";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.onclick = function() {
            settings.enabled = !settings.enabled;
            this.textContent = settings.enabled ? "已啟用" : "已停用";
            this.style.backgroundColor = settings.enabled ? "#42b72a" : "#f5f6f7";
            this.style.color = settings.enabled ? "#fff" : "#4b4f56";

            if (settings.enabled) {
                scheduleNextPoke(3); // 啟用後3秒開始
            }
            saveSettings();
        };
        controls.appendChild(toggleBtn);

        // 立即運行按鈕
        const runNowBtn = document.createElement("button");
        runNowBtn.textContent = "立即戳回";
        runNowBtn.style.padding = "5px 10px";
        runNowBtn.style.border = "none";
        runNowBtn.style.borderRadius = "4px";
        runNowBtn.style.backgroundColor = "#42b72a";
        runNowBtn.style.color = "#fff";
        runNowBtn.style.cursor = "pointer";
        runNowBtn.onclick = function() {
            if (!settings.enabled) return;
            clearTimeout(window.pokeTimeout);
            runAutoPoke();
        };
        controls.appendChild(runNowBtn);

        // 狀態訊息
        const statusDiv = document.createElement("div");
        statusDiv.id = "fb_autopoke_status";
        statusDiv.style.marginTop = "10px";
        statusDiv.style.marginBottom = "10px";
        statusDiv.style.padding = "8px";
        statusDiv.style.backgroundColor = "#f5f6f7";
        statusDiv.style.borderRadius = "4px";
        statusDiv.style.fontSize = "12px";

        // 設置區域
        const settingsDiv = document.createElement("div");
        settingsDiv.style.marginTop = "10px";
        settingsDiv.style.marginBottom = "10px";

        // 函數來創建設置項
        function createSettingItem(label, id, value, min, max) {
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";
            item.style.marginBottom = "5px";

            const labelEl = document.createElement("label");
            labelEl.htmlFor = id;
            labelEl.textContent = label;

            const input = document.createElement("input");
            input.id = id;
            input.type = "number";
            input.value = value;
            input.min = min;
            input.max = max;
            input.style.width = "60px";
            input.style.padding = "3px";
            input.onchange = function() {
                const val = parseInt(this.value);
                if (isNaN(val) || val < min) this.value = min;
                if (val > max) this.value = max;

                // 更新設置
                const settingKey = id.replace('fb_autopoke_', '');
                settings[settingKey] = parseInt(this.value);
                saveSettings();
                
                // 記錄變更
                addLog(`已設定 ${label} 為 ${this.value}`);
            };

            item.appendChild(labelEl);
            item.appendChild(input);
            return item;
        }

        // 添加各種設置項
        settingsDiv.appendChild(createSettingItem("正常最小延遲 (秒):", "fb_autopoke_minDelay", settings.minDelay, 1, 60));
        settingsDiv.appendChild(createSettingItem("正常最大延遲 (秒):", "fb_autopoke_maxDelay", settings.maxDelay, 5, 300));
        settingsDiv.appendChild(createSettingItem("閒置最小延遲 (秒):", "fb_autopoke_idleMinDelay", settings.idleMinDelay, 10, 300));
        settingsDiv.appendChild(createSettingItem("閒置最大延遲 (秒):", "fb_autopoke_idleMaxDelay", settings.idleMaxDelay, 30, 600));
        settingsDiv.appendChild(createSettingItem("閒置閾值 (無活動次數):", "fb_autopoke_idleThreshold", settings.idleThreshold, 3, 50));

        // 日誌區域
        const logDiv = document.createElement("div");
        logDiv.id = "fb_autopoke_log";
        logDiv.style.marginTop = "10px";
        logDiv.style.padding = "8px";
        logDiv.style.backgroundColor = "#f8f8f8";
        logDiv.style.borderRadius = "4px";
        logDiv.style.fontSize = "12px";
        logDiv.style.maxHeight = "100px";
        logDiv.style.overflowY = "auto";
        logDiv.innerHTML = "<div>自動戳回日誌將顯示在這裡</div>";

        // 統計區域
        const statsDiv = document.createElement("div");
        statsDiv.id = "fb_autopoke_stats";
        statsDiv.style.marginTop = "10px";
        statsDiv.style.fontSize = "12px";
        statsDiv.innerHTML = "<div style='font-weight:bold;margin-bottom:5px;'>個人戳回統計:</div>";

        // 個人統計列表
        const statsList = document.createElement("div");
        statsList.id = "fb_autopoke_stats_list";
        statsList.style.maxHeight = "150px";
        statsList.style.overflowY = "auto";
        statsList.style.padding = "5px";
        statsList.style.backgroundColor = "#f5f6f7";
        statsList.style.borderRadius = "4px";
        statsDiv.appendChild(statsList);

        // 清除統計按鈕
        const clearStatsBtn = document.createElement("button");
        clearStatsBtn.textContent = "清除統計";
        clearStatsBtn.style.padding = "3px 8px";
        clearStatsBtn.style.marginTop = "5px";
        clearStatsBtn.style.border = "1px solid #dddfe2";
        clearStatsBtn.style.borderRadius = "4px";
        clearStatsBtn.style.backgroundColor = "#f5f6f7";
        clearStatsBtn.style.cursor = "pointer";
        clearStatsBtn.onclick = function() {
            stats.totalPokes = 0;
            stats.personalStats = {};
            updateStatsList();
            saveStats();
            addLog("已清除所有統計資料");
        };
        statsDiv.appendChild(clearStatsBtn);

        // 組裝面板
        content.appendChild(controls);
        content.appendChild(statusDiv);
        content.appendChild(settingsDiv);
        content.appendChild(logDiv);
        content.appendChild(statsDiv);

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 保存面板引用
        controlPanel = panel;

        // 更新面板上各項設定的值
        updateSettingsDisplay();
        
        // 更新顯示
        updateStatus();
        updateStatsList();

        // 開始計時器
        setInterval(updateStatus, 1000);

        return panel;
    }

    // 更新設定顯示
    function updateSettingsDisplay() {
        document.getElementById("fb_autopoke_minDelay").value = settings.minDelay;
        document.getElementById("fb_autopoke_maxDelay").value = settings.maxDelay;
        document.getElementById("fb_autopoke_idleMinDelay").value = settings.idleMinDelay;
        document.getElementById("fb_autopoke_idleMaxDelay").value = settings.idleMaxDelay;
        document.getElementById("fb_autopoke_idleThreshold").value = settings.idleThreshold;
        
        // 更新啟用/停用按鈕狀態
        const toggleBtn = document.getElementById("fb_autopoke_toggle");
        if (toggleBtn) {
            toggleBtn.textContent = settings.enabled ? "已啟用" : "已停用";
            toggleBtn.style.backgroundColor = settings.enabled ? "#42b72a" : "#f5f6f7";
            toggleBtn.style.color = settings.enabled ? "#fff" : "#4b4f56";
        }
    }

    // 添加日誌
    function addLog(message) {
        const logDiv = document.getElementById("fb_autopoke_log");
        if (!logDiv) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timestamp = `${hours}:${minutes}:${seconds}`;

        const logEntry = document.createElement("div");
        logEntry.innerHTML = `<span style="color:#777;">[${timestamp}]</span> ${message}`;
        logDiv.appendChild(logEntry);

        // 滾動到底部
        logDiv.scrollTop = logDiv.scrollHeight;

        // 限制日誌數量
        while (logDiv.childNodes.length > 50) {
            logDiv.removeChild(logDiv.firstChild);
        }
    }

    // 更新狀態顯示
    function updateStatus() {
        const statusDiv = document.getElementById("fb_autopoke_status");
        if (!statusDiv) return;

        const now = new Date();
        let status = "";

        status += `<div>總計戳回: <b>${stats.totalPokes}</b> 次</div>`;

        if (stats.lastPokeTime) {
            const lastTime = new Date(stats.lastPokeTime);
            const timeDiff = Math.round((now - lastTime) / 1000);

            const lastTimeStr = formatTime(lastTime);
            status += `<div>上次戳回: <b>${lastTimeStr}</b> (${timeDiff}秒前)</div>`;
        } else {
            status += `<div>上次戳回: <b>無</b></div>`;
        }

        if (stats.nextPokeTime && settings.enabled) {
            const nextTime = new Date(stats.nextPokeTime);
            let timeLeft = Math.round((nextTime - now) / 1000);
            if (timeLeft < 0) timeLeft = 0;

            const nextTimeStr = formatTime(nextTime);
            status += `<div>下次檢查: <b>${nextTimeStr}</b> (<span id="fb_countdown">${timeLeft}</span>秒後)</div>`;
            status += `<div>狀態: <b>${stats.isIdle ? "閒置模式" : "活躍模式"}</b> (連續${stats.noActivityCount}次無活動)</div>`;
        } else {
            status += `<div>下次檢查: <b>已停用</b></div>`;
        }

        statusDiv.innerHTML = status;

        // 更新倒計時
        const countdownEl = document.getElementById("fb_countdown");
        if (countdownEl && stats.nextPokeTime) {
            let timeLeft = Math.round((new Date(stats.nextPokeTime) - now) / 1000);
            if (timeLeft < 0) timeLeft = 0;
            countdownEl.textContent = timeLeft;
        }
    }

    // 更新個人統計列表
    function updateStatsList() {
        const statsList = document.getElementById("fb_autopoke_stats_list");
        if (!statsList) return;

        // 將個人統計轉為陣列並按次數排序
        const sortedStats = Object.entries(stats.personalStats)
            .sort((a, b) => b[1] - a[1]);

        if (sortedStats.length === 0) {
            statsList.innerHTML = "<div style='color:#777;font-style:italic;'>尚無數據</div>";
            return;
        }

        let html = "";
        sortedStats.forEach(([name, count]) => {
            html += `<div style='display:flex;justify-content:space-between;margin-bottom:3px;'>
                      <span>${name}</span>
                      <span><b>${count}</b> 次</span>
                    </div>`;
        });

        statsList.innerHTML = html;
    }

    // 格式化時間為 HH:MM:SS
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // 嘗試從元素附近找到用戶名稱
    function findUserName(element) {
        // 最基本的方法，查找附近的鏈接
        let container = element;
        let maxDepth = 5;
        let depth = 0;

        // 向上查找容器
        while (container && depth < maxDepth) {
            // 查找附近的用戶鏈接
            const userLinks = container.querySelectorAll('a[href*="facebook.com/"]');
            for (const link of userLinks) {
                const text = link.textContent.trim();
                if (text && text !== "Facebook" && text !== "戳回去" && !text.includes("http")) {
                    return text;
                }
            }

            // 從父元素的文本中尋找匹配「某人連續戳你 X 次」的模式
            const contentText = container.textContent || "";
            const pokeMatch = contentText.match(/([^\s,.!?]+)連續戳你\s*\d+\s*次/);
            if (pokeMatch && pokeMatch[1]) {
                return pokeMatch[1];
            }

            // 從父元素的文本中尋找匹配「某人戳了你」的模式
            const pokeMatch2 = contentText.match(/([^\s,.!?]+)戳了你/);
            if (pokeMatch2 && pokeMatch2[1]) {
                return pokeMatch2[1];
            }

            container = container.parentElement;
            depth++;
        }

        return "未知用戶";
    }

    // 安排下次戳回檢查
    function scheduleNextPoke(seconds) {
        if (!settings.enabled) return;

        clearTimeout(window.pokeTimeout);

        if (!seconds) {
            // 根據當前狀態決定延遲時間
            let minDelay, maxDelay;

            if (stats.isIdle) {
                minDelay = settings.idleMinDelay;
                maxDelay = settings.idleMaxDelay;
            } else {
                minDelay = settings.minDelay;
                maxDelay = settings.maxDelay;
            }

            seconds = minDelay + Math.round(Math.random() * (maxDelay - minDelay));
        }

        addLog(`將在 ${seconds} 秒後進行下次戳回檢查`);

        // 更新下次戳回時間
        stats.nextPokeTime = new Date(Date.now() + seconds * 1000).getTime();
        saveStats();

        // 更新顯示
        updateStatus();

        // 設置定時器
        window.pokeTimeout = setTimeout(runAutoPoke, seconds * 1000);
    }

    // 主要戳回功能
    function runAutoPoke() {
        if (!settings.enabled) return;

        addLog("執行自動戳回檢查...");
        console.log("執行自動戳回檢查...");

        // 確保控制面板存在
        if (!controlPanel) {
            createControlPanel();
        }

        // 找到所有具有戳回按鈕特徵的元素
        let pokeButtons = [];

        // 方法1: 使用aria-label找戳回按鈕
        const ariaButtons = document.querySelectorAll('[aria-label="戳回去"]');
        pokeButtons = [...ariaButtons];

        // 方法2: 查找包含 "戳回去" 文本的按鈕元素
        if (pokeButtons.length === 0) {
            const allElements = document.querySelectorAll('div[role="button"]');
            for (const el of allElements) {
                if (el.textContent && el.textContent.includes("戳回去")) {
                    pokeButtons.push(el);
                }
            }
        }

        // 記錄找到的元素數量
        addLog(`找到 ${pokeButtons.length} 個戳回按鈕`);

        // 已處理的用戶集，避免一次處理同一用戶多次
        let processedUsers = new Set();

        // 計數
        let newPokes = 0;
        let pokedUsers = [];

        // 處理每個戳回按鈕
        for (const button of pokeButtons) {
            // 嘗試找到用戶名稱
            const userName = findUserName(button);

            // 如果這個用戶已經處理過，跳過
            if (processedUsers.has(userName)) {
                continue;
            }

            try {
                // 標記為已處理
                processedUsers.add(userName);

                // 更新統計
                stats.totalPokes++;
                if (!stats.personalStats[userName]) {
                    stats.personalStats[userName] = 0;
                }
                stats.personalStats[userName]++;

                // 點擊按鈕
                button.click();
                newPokes++;
                pokedUsers.push(userName);

                addLog(`已點擊「${userName}」的戳回按鈕`);
                console.log(`已點擊「${userName}」的戳回按鈕`);
            } catch (e) {
                addLog(`點擊出錯: ${e.message}`);
                console.error("點擊出錯:", e);
            }
        }

        // 更新統計信息
        if (newPokes > 0) {
            stats.lastPokeTime = Date.now();
            stats.noActivityCount = 0;
            stats.isIdle = false;
            addLog(`成功戳回 ${newPokes} 人: ${pokedUsers.join(', ')}`);
        } else {
            stats.noActivityCount++;
            if (stats.noActivityCount >= settings.idleThreshold) {
                stats.isIdle = true;
            }
            addLog(`沒有找到可戳回的用戶，無活動次數: ${stats.noActivityCount}`);
        }

        // 保存統計
        saveStats();

        // 更新顯示
        updateStatus();
        updateStatsList();

        // 安排下次檢查
        scheduleNextPoke();
    }

    // 初始化
    function initialize() {
        console.log("初始化 Facebook 自動戳回腳本...");

        // 載入保存的設置
        const savedSettings = localStorage.getItem('fb_autopoke_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                Object.assign(settings, parsed);
                console.log("已載入儲存的設定:", settings);
            } catch (e) {
                console.error("載入設置失敗:", e);
            }
        }

        // 載入保存的統計
        const savedStats = localStorage.getItem('fb_autopoke_stats');
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                Object.assign(stats, parsed);
                console.log("已載入儲存的統計:", stats);
            } catch (e) {
                console.error("載入統計失敗:", e);
            }
        }

        // 創建控制面板
        createControlPanel();
        
        // 加入初次載入的日誌
        addLog("腳本已初始化" + (settings.enabled ? "，自動戳回已啟用" : "，自動戳回目前停用"));

        // 如果設置為啟用，則開始自動戳回
        if (settings.enabled) {
            // 初始延遲3秒，避免腳本重載時立即運行
            scheduleNextPoke(3);
        }
    }

    // 在頁面載入完成後初始化
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
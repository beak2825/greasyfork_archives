// ==UserScript==
// @name         Zed汉化 & ZedTools
// @namespace    http://tampermonkey.net/
// @version      14.5
// @description  网页游戏Zed City的汉化和工具插件。Chinese translation and tools for the web game Zed City.
// @author       bot7420
// @license      CC-BY-NC-SA-4.0
// @match        https://www.zed.city/*
// @match        https://wiki.zed.city/*
// @icon         https://www.zed.city/icons/favicon.svg
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      api.zed.city
// @downloadURL https://update.greasyfork.org/scripts/522425/Zed%E6%B1%89%E5%8C%96%20%20ZedTools.user.js
// @updateURL https://update.greasyfork.org/scripts/522425/Zed%E6%B1%89%E5%8C%96%20%20ZedTools.meta.js
// ==/UserScript==

//工具目錄
/* 帮派日志相关 */
/* 状态栏弹出显示XP增量 */
/* 状态栏等级图标旁显示人物具体经验值 */
/* 状态栏显示能量和辐射溢出倒计时 */
/* 状态栏显示商店重置倒计时 */
/* 状态栏显示熔炉工作 */
/* 状态栏显示无线电塔交易刷新 */
/* 状态栏显示帮派突袭冷却计时 */
/* 状态栏显示总BS */
/* 倒计时弹窗 */
/* 废品场屏蔽物品收售 */
/* 设置里添加功能开关 */
/* 工具方法 */
//------------ getOriTextFromElement(elem) { //获取元素的 “原始文本”（翻译前内容）
//------------ numberFormatter(num, digits = 1) { // digits 是默认参数，默认保留1位小数
/* 健身房添加勾选锁和Max按钮 */
/* 生产和NPC商店买卖添加Max按钮 */
/* 拾荒统计 */
/* 狩猎统计 */
/* 锻炼细节显示 */
/* Zed 熔炉内嵌废品店小窗口 */
/* 遠征 ZONE2 需求圖 */
/* 显示车重 */
/* 显示物价 */
/* 车辆中物品总价值 */
/* 远征图1油泵交易倒计时 */
/* 远征图5炸药残骸开箱倒计时 */
/* 远征图6宝箱开箱倒计时 (新增代码) */


//字典
//1.1 通用頁面
//----------------/ 登入首頁
//----------------/ 個人
//----------------/ 戰鬥日誌
//----------------/ 會員
//----------------/ 城市
//----------------/ 市場狀態(購買,上架)
//----------------/ 物品狀態(重量,類型)
//----------------/ 戰鬥狀態
//1.2 幫派
//----------------/ 權限
//----------------/ 傳承跟日誌(待補充)
//1.3 專家
//----------------/ 車輛專家
//----------------/ 装备专家
//----------------/ 盔甲专家
//----------------/ 武器专家
//1.4 地點
//----1.4-1 天氣
//1.5 庫存
//----1.5-1 武器
//----1.5-2 護甲
//----------------/ 頭
//----------------/ 身體
//----------------/ 腿
//----------------/ 腳
//----------------/ 黃裝
//----1.5-3 交通工具
//----1.5-4 資源
//----------------/ 材料
//----------------/ 魚
//----1.5-5 子彈
//----1.5-6 醫療
//----1.5-7 增強
//----------------/ 食物
//----------------/ 能量
//----------------/ 飲料
//----1.5-8 道具裝備
//----1.5-9 雜項
//----1.5-10 汽車零件
//----1.5-11 掛車
//----1.5-12 獎盃
//1.6 技能狀態
//----------------/ 活動(Spa)
//----------------/ 活動(輻射)
//1.7 遠征
//----1.7-1 前哨站
//1.8 貨幣
//2.0 怪物
//2.1 任務
//----------------/ NPC名稱
//----------------/ Myena
//----------------/ Garbo
//----------------/ Buddy
//----------------/ Meat
//----------------/ Gray
//----------------/ Market Trader
//----------------/ Metals Miner
//----------------/ Wood Carpenter
//----------------/ Fuel Baron
//----------------/ Animal Huntress
//----------------/ Clothes Seamstress
//----------------/ 觸發特別任務
//2.2 規則
//2.3 論壇
//3.0 其他 (尚未整理的翻譯)
//3.1 版本更新
//3.2 詞典：待處理
// 排除不需要的翻譯

(() => {
    /* ZedTools START */

    const userLanguage = navigator.language || navigator.userLanguage;
    const isZH = userLanguage.startsWith("zh");

    // XMLHttpRequest hook
    const open_prototype = XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
            // readyState 有 5 种可能的值，分别对应请求的不同阶段
            // === 4 : 完成（DONE）—— 请求已完成，响应数据完全接收（无论成功或失败）
            // 简单说，readyState === 4 是判断 “网络请求已经彻底结束，可以处理结果了” 的标志。
            if (this.readyState === 4) {
                if (this.responseURL.includes("api.zed.city/getStats")) {
                    handleGetStats(this.response);
                } else if (this.responseURL.includes("api.zed.city/skills")) {
                    handleSkills(this.response);
                } else if (this.responseURL.includes("api.zed.city/getStore?store_id=junk")) {
                    handleGetStoreJunkLimit(this.response);
                } else if (this.responseURL.includes("api.zed.city/startJob")) {
                    handleStartJob(this.response);
                } else if (this.responseURL.includes("api.zed.city/completeJob")) {
                    handleCompleteJob(this.response);
                } else if (this.responseURL.includes("api.zed.city/getStronghold")) {
                    handleGetStronghold(this.response);
                } else if (this.responseURL.includes("api.zed.city/getRadioTower")) {
                    handleGetRadioTower(this.response);
                } else if (this.responseURL.includes("api.zed.city/getFactionNotifications")) {
                    handleGetFactionNotifications(this.response);
                } else if (this.responseURL.includes("api.zed.city/getFight") && !this.responseURL.includes("api.zed.city/getFightLog")) {
                    handleGetFight(this.response);
                } else if (this.responseURL.includes("api.zed.city/doFight")) {
                    handleDoFight(this.response);
                } else if (this.responseURL === "https://api.zed.city/getFaction") {
                    handleGetFaction(this.response);
                } else if (this.responseURL === "https://api.zed.city/loadItems") {
                    handleLoadItems(this.response);
                }
                } else if (this.responseURL === "https://api.zed.city/getMarket") { //修復市場價格顯示161~179
                try {
                    const raw = JSON.parse(this.response);
                    const items = raw.items || [];
                    const itemWorths = {};

                    items.forEach(item => {
                        if (item.name && typeof item.market_price === "number") {
                            itemWorths[item.name] = { price: item.market_price };
                        }
                    });

                    localStorage.setItem("script_itemWorths", JSON.stringify(itemWorths));
                    localStorage.setItem("script_itemWorths_timestamp", Date.now());

                    console.log("✅ 已从 getMarket 响应更新物价表");
                } catch (err) {
                    console.error("❌ getMarket 响应解析失败", err);
                }
            }
        });
        /* apply是 JavaScript 函数的方法，用于调用函数并指定this上下文和参数
           this指向当前的XMLHttpRequest实例（保证原生方法内部的this指向正确）
           arguments是传给重写后open方法的所有参数（保证原始调用的参数完整传递）
           js裡的位數必須從0開始算 0 為第1位
        */
        return open_prototype.apply(this, arguments);
    };

    if (!localStorage.getItem("script_itemWorths")) {
        localStorage.setItem("script_itemWorths", JSON.stringify({}));
    }
    getItemWorthsFromServer();

    function getItemWorth(itemName) {
        const json = JSON.parse(localStorage.getItem("script_itemWorths"));
        if (json && json.hasOwnProperty(itemName)) {
            return Number(json[itemName].price);
        }
        return 0;
    }

    /* 帮派日志相关 */
    if (!localStorage.getItem("script_faction_raid_logs")) {
        localStorage.setItem("script_faction_raid_logs", JSON.stringify({}));
    }
    if (!localStorage.getItem("script_faction_log_records")) {
        localStorage.setItem("script_faction_log_records", JSON.stringify({}));
    }
    if (!localStorage.getItem("script_faction_log_records_server")) {
        localStorage.setItem("script_faction_log_records_server", JSON.stringify({}));
    }

    function handleGetFactionNotifications(r) {
        const response = JSON.parse(r);
        if (!response?.notify) {
            return;
        }
        const raidLogs = JSON.parse(localStorage.getItem("script_faction_raid_logs"));
        const logsToUpload = []; // Upload to ZedToolsServer

        for (const log of response.notify) {
            if (log.type === "faction_take_item" || log.type === "faction_add_item") {
                logsToUpload.push({
                    logType: log.type,
                    timestamp: log.date,
                    userId: log.data.user_id,
                    userName: log.data.username,
                    itemQty: log.data.qty,
                    itemName: log.data.name,
                    factionName: localStorage.getItem("script_faction_id"),
                    uploaderName: localStorage.getItem("script_playerName"),
                });
            } else if (log.type === "faction_raid" && log.data?.users) {
                raidLogs[log.date] = log;

                if (log.date >= 1738810321) {
                    // Server ignore raid logs before 20250206
                    for (const user of log.data.users) {
                        logsToUpload.push({
                            logType: "faction_add_item",
                            timestamp: log.date,
                            userId: user.id,
                            userName: user.username,
                            itemQty: (Number(log.data.respect) / Number(log.data.users.length)).toFixed(1),
                            itemName: "声望",
                            factionName: localStorage.getItem("script_faction_id"),
                            uploaderName: localStorage.getItem("script_playerName"),
                        });
                    }
                }
            }
        }
        localStorage.setItem("script_faction_raid_logs", JSON.stringify(raidLogs));
        console.log(`raidLogs: ${Object.keys(raidLogs).length}`);

        uploadToServer(logsToUpload);
        updateFactionLogRecord();
    }

    function getRecordsFromServer() {
        const textArea = document.getElementById("script_textArea");
        if (textArea) {
            textArea.value = "开始尝试从服务器获取帮派物品记录";
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://43.129.194.214:7000/faction-item-records`,
                headers: {
                    "Content-Type": "application/json",
                },
                onload: function (response) {
                    if (!response || !response.response) {
                        console.error("网络错误onload");
                        const textArea = document.getElementById("script_textArea");
                        if (textArea) {
                            textArea.value = "网络错误onload";
                        }
                        resolve("网络错误onload");
                    }
                    const json = JSON.parse(response.response);
                    console.log(json);
                    const textArea = document.getElementById("script_textArea");
                    if (textArea) {
                        textArea.value = "从服务器获取帮派物品记录成功，总记录数：" + json.estimatedDocumentCount;
                    }
                    localStorage.setItem("script_faction_log_records_server", JSON.stringify(json.recordBook));
                    resolve(json);
                },
                onerror: function (error) {
                    console.log("网络错误onerror");
                    console.log(error);
                    const textArea = document.getElementById("script_textArea");
                    if (textArea) {
                        textArea.value = "网络错误onerror";
                    }
                    resolve("网络错误onerror");
                },
            });
        });
    }

    function getItemWorthsFromServer() {
        const isInventoryPage = location.pathname === "/inventory";
        const lastUpdate = localStorage.getItem("script_itemWorths_timestamp");
        if (!isInventoryPage && lastUpdate && Date.now() - lastUpdate < 36000000) {
            console.log("✅ 已有物价缓存，跳过更新");
            return;
        }

        console.log("📦 正在从 Zed 官方 API 获取物价数据");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.zed.city/getMarket",
                headers: {
                    "Content-Type": "application/json",
                },
                onload: function (response) {
                    if (!response || !response.responseText) {
                        console.error("❌ 网络错误：无响应内容");
                        resolve("网络错误onload");
                        return;
                    }

                    try {
                        const raw = JSON.parse(response.responseText);
                        const items = raw.items || [];
                        const itemWorths = {};

                        items.forEach(item => {
                            if (item.name && typeof item.market_price === "number") {
                                itemWorths[item.name] = { price: item.market_price };
                            }
                        });

                        localStorage.setItem("script_itemWorths", JSON.stringify(itemWorths));
                        localStorage.setItem("script_itemWorths_timestamp", Date.now());

                        console.log("✅ 已成功更新物价表");
                        resolve(itemWorths);
                    } catch (err) {
                        console.error("❌ JSON解析失败", err);
                        resolve("JSON解析失败");
                    }
                },
                onerror: function (error) {
                    console.error("❌ 网络错误onerror", error);
                    resolve("网络错误onerror");
                }
            });
        });
    }

    function uploadToServer(logList) {
        if (!logList || logList.length <= 0) {
            return;
        }
        console.log("Start upload to ZedToolsServer: " + logList.length);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `http://43.129.194.214:7000/upload-faction-logs/`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(logList),
                onload: function (response) {
                    if (!response || !response.response) {
                        console.error("网络错误onload");
                        const textArea = document.getElementById("script_textArea");
                        if (textArea) {
                            textArea.value = "网络错误onload";
                        }
                        resolve("网络错误onload");
                    }
                    const json = JSON.parse(response.response);
                    console.log(json);
                    const textArea = document.getElementById("script_textArea");
                    if (textArea) {
                        //textArea.value = "服务器端总log条数：" + json.estimatedDocumentCount;
                    }
                    resolve(json);
                },
                onerror: function (error) {
                    console.log("网络错误onerror");
                    console.log(error);
                    const textArea = document.getElementById("script_textArea");
                    if (textArea) {
                        textArea.value = "网络错误onerror";
                    }
                    resolve("网络错误onerror");
                },
            });
        });
    }

    function handleGetFaction(r) {
        const response = JSON.parse(r);
        localStorage.setItem("script_faction_id", JSON.stringify(response.faction_name));
    }

    function updateFactionLogRecord() {
        const raidLogs = JSON.parse(localStorage.getItem("script_faction_raid_logs"));
        const result = {};

        for (const key in raidLogs) {
            if (raidLogs[key].type === "faction_raid" && raidLogs[key].data?.users) {
                for (const user of raidLogs[key].data.users) {
                    const userIdInLog = user.id;
                    if (userIdInLog && !result[userIdInLog]) {
                        result[userIdInLog] = {
                            playerId: userIdInLog,
                            playerNames: [user.username],
                            respectFromRaids: 0,
                            lastRaid: null,
                        };
                    }
                    result[userIdInLog].respectFromRaids += Number(raidLogs[key].data.respect) / Number(raidLogs[key].data.users.length);
                    if (!result[userIdInLog].lastRaid || result[userIdInLog].lastRaid.timestamp < Number(raidLogs[key].date)) {
                        result[userIdInLog].lastRaid = { timestamp: Number(raidLogs[key].date), raidName: raidLogs[key].data.name };
                    }
                }
            }
        }

        localStorage.setItem("script_faction_log_records", JSON.stringify(result));
    }

    function searchPlayer(playerName) {
        const records = JSON.parse(localStorage.getItem("script_faction_log_records_server"));
        let text = "";

        for (const key in records) {
            const record = records[key];
            if (playerName.toLowerCase() !== record.playerNames[0].toLowerCase() && Number(playerName) !== record.playerId) {
                continue;
            }
            text += `当前余额 ${numberFormatter(record.balance)}\n\n`;
            for (const key in record.items) {
                if (record.items[key] !== 0) {
                    text += `${record.items[key]}x ${dict(key)}\n`;
                }
            }
        }

        return text;
    }

    function rankByItems() {
        const records = JSON.parse(localStorage.getItem("script_faction_log_records_server"));
        const result = [];

        for (const key in records) {
            const record = records[key];
            const playerName = record.playerNames[0];
            result.push({ playerName: playerName, itemsWorth: record.balance, latestLogTimestamp: record.latestLogTimestamp });
        }

        function compareByWorth(a, b) {
            const isAAFK = !a.latestLogTimestamp || Math.floor(Date.now() / 1000) - a.latestLogTimestamp > 259200;
            const isBAFK = !b.latestLogTimestamp || Math.floor(Date.now() / 1000) - b.latestLogTimestamp > 259200;
            if (isAAFK && !isBAFK) {
                return 1;
            } else if (!isAAFK && isBAFK) {
                return -1;
            }
            return b.itemsWorth - a.itemsWorth;
        }
        result.sort(compareByWorth);

        let text = "";
        for (const r of result) {
            text += `${r.playerName} 物品余额 ${numberFormatter(Number(r.itemsWorth).toFixed(0))}\n`;
        }
        return text;
    }

    function rankByRespect() {
        const records = JSON.parse(localStorage.getItem("script_faction_log_records"));
        const result = [];

        for (const key in records) {
            const record = records[key];
            const playerName = record.playerNames[0];
            const respectFromRaids = record.respectFromRaids;
            result.push({ playerName: playerName, respectFromRaids: respectFromRaids });
        }

        function compareByRes(a, b) {
            return b.respectFromRaids - a.respectFromRaids;
        }
        result.sort(compareByRes);

        let text = "";
        for (const r of result) {
            text += `${r.playerName} 总突袭声望 ${Number(r.respectFromRaids).toFixed(1)}\n`;
        }
        return text;
    }

    function raidTimings() {
        const records = JSON.parse(localStorage.getItem("script_faction_log_records"));
        const result = [];

        for (const key in records) {
            const record = records[key];
            const playerName = record.playerNames[0];
            if (record.lastRaid) {
                let nextRaidInSec = null;
                if (record.lastRaid.raidName === "Raid a Farm") {
                    nextRaidInSec = Math.floor(record.lastRaid.timestamp + 1 * 60 * 60 - Date.now() / 1000);
                } else if (record.lastRaid.raidName === "Raid a Hospital") {
                    nextRaidInSec = Math.floor(record.lastRaid.timestamp + 5 * 60 * 60 - Date.now() / 1000);
                } else if (record.lastRaid.raidName === "Raid a Store") {
                    nextRaidInSec = Math.floor(record.lastRaid.timestamp + 20 * 60 * 60 - Date.now() / 1000);
                }
                if (nextRaidInSec > -172800) {
                    // 排除超过2天的人，可能是已经退帮了
                    result.push({ playerName: playerName, nextRaidInSec: nextRaidInSec });
                }
            }
        }

        function compareBySec(a, b) {
            return a.nextRaidInSec - b.nextRaidInSec;
        }
        result.sort(compareBySec);

        let text = "";
        for (const r of result) {
            text += `${r.playerName} ${r.nextRaidInSec <= 0 ? "突袭已冷却" : "下次突袭 " + timeReadable(r.nextRaidInSec)}\n`;
        }
        return text;
    }

    function addFactionLogSearch() {
        if (!window.location.href.includes("zed.city/faction/activity") || !document.body.querySelector("div.q-infinite-scroll")) {
            return;
        }

        const insertToElem = document.body.querySelector("div.q-infinite-scroll");
        const searchElem = document.body.querySelector(".script_search_log");
        if (!searchElem) {
            const container = document.createElement("div");
            container.classList.add("script_search_log");
            container.style.margin = "30px";

            const input = document.createElement("input");
            input.type = "text";
            input.id = "script_search_input";
            input.placeholder = "输入玩家名或数字ID";
            input.value = localStorage.getItem("script_playerName") ? localStorage.getItem("script_playerName") : "";
            container.appendChild(input);

            const fetchButton = document.createElement("button");
            fetchButton.innerText = "从服务器获取物品记录";
            fetchButton.onclick = function () {
                getRecordsFromServer();
            };
            container.appendChild(fetchButton);

            const searchButton = document.createElement("button");
            searchButton.innerText = "查询玩家（服务器）";
            searchButton.onclick = function () {
                const inputValue = document.getElementById("script_search_input").value;
                document.getElementById("script_textArea").value = searchPlayer(inputValue);
            };
            container.appendChild(searchButton);

            const rankItemsButton = document.createElement("button");
            rankItemsButton.innerText = "物品余额排名（服务器）";
            rankItemsButton.onclick = function () {
                document.getElementById("script_textArea").value = rankByItems();
            };
            container.appendChild(rankItemsButton);

            const rankRespectButton = document.createElement("button");
            rankRespectButton.innerText = "突袭声望排名（本地）";
            rankRespectButton.onclick = function () {
                document.getElementById("script_textArea").value = rankByRespect();
            };
            container.appendChild(rankRespectButton);

            const raidButton = document.createElement("button");
            raidButton.innerText = "突袭冷却查询（本地）";
            raidButton.onclick = function () {
                document.getElementById("script_textArea").value = raidTimings();
            };
            container.appendChild(raidButton);

            const clearButton = document.createElement("button");
            clearButton.innerText = "清空本地历史记录";
            clearButton.onclick = function () {
                console.log("Faction log cleared.");
                document.getElementById("script_textArea").value = "历史记录已清空";
                localStorage.setItem("script_faction_raid_logs", JSON.stringify({}));
                localStorage.setItem("script_faction_log_records", JSON.stringify({}));
                localStorage.setItem("script_faction_log_records_server", JSON.stringify({}));
            };
            container.appendChild(clearButton);

            const textArea = document.createElement("textarea");
            textArea.id = "script_textArea";
            textArea.placeholder =
                "手动滚动帮派日志，日志会自动记录到插件本地并上传到服务器。\n服务器的记录包含所有帮派。\n查询物品记录前，先按从服务器获取物品记录按钮。";
            textArea.rows = 10;
            textArea.cols = 60;
            textArea.style.overflowY = "auto";
            container.appendChild(textArea);

            insertToElem.parentNode.insertBefore(container, insertToElem);
        }
    }
    setInterval(addFactionLogSearch, 500);

    /* 状态栏弹出显示XP增量 */
    if (!localStorage.getItem("script_getStats")) {
        localStorage.setItem("script_getStats", "{}");
    }
    if (!localStorage.getItem("script_playerXp_previous")) {
        localStorage.setItem("script_playerXp_previous", 0);
    }
    if (!localStorage.getItem("script_playerXp_current")) {
        localStorage.setItem("script_playerXp_current", 0);
    }
    if (!localStorage.getItem("script_playerXp_max")) {
        localStorage.setItem("script_playerXp_max", 0);
    }
    if (!localStorage.getItem("script_energyFullAtTimestamp")) {
        localStorage.setItem("script_energyFullAtTimestamp", 0);
    }
    if (!localStorage.getItem("script_radFullAtTimestamp")) {
        localStorage.setItem("script_radFullAtTimestamp", 0);
    }
    if (!localStorage.getItem("script_energy")) {
        localStorage.setItem("script_energy", 0);
    }
    if (!localStorage.getItem("script_vehicle_max_weight")) {
        localStorage.setItem("script_vehicle_max_weight", 0);
    }
    if (!localStorage.getItem("script_vehicle_weight")) {
        localStorage.setItem("script_vehicle_weight", 0);
    }

    function handleGetStats(r) {
        localStorage.setItem("script_getStats", r);
        const response = JSON.parse(r);

        // Player XP
        localStorage.setItem("script_playerXp_current", response.experience);
        localStorage.setItem("script_playerXp_max", response.xp_end);
        showPlayerXpChangePopup(response.experience);

        // Player name
        localStorage.setItem("script_playerName", response.username);

        // Total BS
        const totalBS =
            Number(response.base_stats.strength) +
            Number(response.base_stats.speed) +
            Number(response.base_stats.defense) +
            Number(response.base_stats.agility);
        localStorage.setItem("script_totalBS", totalBS);

        // Raid
        const expire = response?.raid_cooldown;
        if (expire) {
            const previousTimestamp = Number(localStorage.getItem("script_raidTimestamp"));
            const timestamp = Date.now() + expire * 1000;
            localStorage.setItem("script_raidTimestamp", timestamp);
            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_raidIsAlreadyNotified", false);
            }
        }

        // Vehicle
        if (response?.vehicle_items?.vars) {
            localStorage.setItem("script_vehicle_max_weight", response.vehicle_items.vars.max_weight);
            localStorage.setItem("script_vehicle_weight", response.vehicle_items.vars.weight);
        }

        // Bars
        const currentEnergy = response.energy;
        const currentRad = response.rad;
        const energyRegenIntervalMinute = response.membership ? 10 : 15;
        const maxEnergy = response.stats.max_energy + (response.membership ? 50 : 0);
        const maxRad = response.stats.max_rad + (response.membership ? 20 : 0);;
        const energyRegen = response.energy_regen ? response.energy_regen : 0;
        const radRegen = response.rad_regen ? response.rad_regen : 0;

        localStorage.setItem("script_energy", currentEnergy);

        if (maxEnergy - currentEnergy > 0) {
            const timeLeftSec = ((maxEnergy - currentEnergy - 5) / 5) * energyRegenIntervalMinute * 60 + energyRegen;
            const previousTimestamp = Number(localStorage.getItem("script_energyFullAtTimestamp"));
            const timestamp = Date.now() + timeLeftSec * 1000;
            localStorage.setItem("script_energyFullAtTimestamp", timestamp);
            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_energyFullAlreadyNotified", false);
            }
        }

        if (maxRad - currentRad > 0) {
            const timeLeftSec = ((maxRad - currentRad - 1) / 1) * 5 * 60 + radRegen;
            const previousTimestamp = Number(localStorage.getItem("script_radFullAtTimestamp"));
            const timestamp = Date.now() + timeLeftSec * 1000;
            localStorage.setItem("script_radFullAtTimestamp", timestamp);
            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_radFullAlreadyNotified", false);
            }
        }
    }

    function handleSkills(r) {
        const response = JSON.parse(r);
        showSkillsXpChangePopup(response.player_skills);
    }

    function showSkillsXpChangePopup(skillsXp) {
        const insertElem = document.body.querySelector("#script_player_level");
        if (!insertElem) {
            return;
        }
        const skillsXp_previous = JSON.parse(localStorage.getItem("script_skillsXp_previous"));

        if (skillsXp_previous && skillsXp) {
            for (const s of skillsXp) {
                for (const i of skillsXp_previous) {
                    if (i.name === s.name && s.xp !== i.xp) {
                        const increase = Number(s.xp) - Number(i.xp);
                        let name = i.name;
                        const translation = {
                            refining: "精炼",
                            fishing: "钓鱼",
                            crafting: "制作",
                            hunting: "狩猎",
                            scavenge: "拾荒",
                            distilling: "蒸馏",
                            forging: "锻造",
                            farming: "耕作",
                            Woodcutting: "伐木",
                            Mining: "挖矿",
                        };
                        if (translation[name.toLowerCase()]) {
                            name = translation[name.toLowerCase()];
                        }
                        const div = document.createElement("span");
                        div.style.backgroundColor = "#0A748F";
                        div.style.marginLeft = "10px";
                        div.textContent = `${name}+${increase}`;
                        insertElem.appendChild(div);
                        setTimeout(() => {
                            div.remove();
                        }, 6000);
                        break;
                    }
                }
            }
        }

        localStorage.setItem("script_skillsXp_previous", JSON.stringify(skillsXp));
    }

    function showPlayerXpChangePopup(playerXp) {
        const insertElem = document.body.querySelector("#script_player_level");
        if (!insertElem) {
            return;
        }
        const playerXp_previous = Number(localStorage.getItem("script_playerXp_previous"));

        if (playerXp_previous !== 0 && playerXp_previous !== playerXp) {
            const increase = playerXp - playerXp_previous;
            const div = document.createElement("span");
            div.style.backgroundColor = "#2e7d32";
            div.style.marginLeft = "10px";
            div.textContent = `XP+${increase}`;
            insertElem.appendChild(div);
            setTimeout(() => {
                div.remove();
            }, 6000);
        }

        localStorage.setItem("script_playerXp_previous", JSON.stringify(playerXp));
    }

    /* 状态栏等级图标旁显示人物具体经验值 */
    if (!localStorage.getItem("script_estimate_levelup_time_switch")) {
        localStorage.setItem("script_estimate_levelup_time_switch", "enabled");
    }

    function updatePlayerXpDisplay() {
        const playerXp = Number(localStorage.getItem("script_playerXp_current"));
        const currentLevelMaxXP = Number(localStorage.getItem("script_playerXp_max"));

        // 预估角色升级时间，每h经验获取大概是12*5+12=72
        let levelUpInText = "";
        if (localStorage.getItem("script_estimate_levelup_time_switch") === "enabled") {
            const levelUpInSec = Math.floor(((currentLevelMaxXP - playerXp) / 72) * 60 * 60);
            levelUpInText = `${timeReadableNoSec(levelUpInSec)}后升级`;
        }

        const levelElem = document.body.querySelectorAll(".level-up-cont")[1];
        let insertElem = document.body.querySelector("#script_player_level");
        if (levelElem && !insertElem) {
            levelElem.insertAdjacentHTML(
                "beforeend",
                `<div id="script_player_level" class="script_do_not_translate"><span id="script_player_level_inner" class="script_do_not_translate"><strong class="script_do_not_translate">${Math.floor(
                    playerXp
                )} / ${Math.floor(currentLevelMaxXP)}</strong> ${levelUpInText}</span></div>`
            );
        } else if (levelElem && insertElem) {
            insertElem.querySelector("#script_player_level_inner").innerHTML = `<strong class="script_do_not_translate">${Math.floor(
                playerXp
            )} / ${Math.floor(currentLevelMaxXP)}</strong> ${levelUpInText}`;
        }

        // 插入用于显示倒计时的div
        insertElem = document.body.querySelector("#script_countdowns_container");
        if (levelElem?.parentElement?.parentElement?.parentElement && !insertElem) {
            levelElem?.parentElement?.parentElement?.parentElement.insertAdjacentHTML(
                "beforeend",
                `<div id="script_countdowns_container" class="script_do_not_translate" style="display: flex; align-items: center; justify-content: center; gap: 15px;"></div>
                <div id="script_countdowns_container_2" class="script_do_not_translate" style="display: flex; align-items: center; justify-content: center; gap: 15px;"></div>`
            );
        }
    }
    setInterval(updatePlayerXpDisplay, 500);

    /* 状态栏显示能量和辐射溢出倒计时 */
    function updateBarsDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container");
        if (!insertToElem) {
            return;
        }
        const energyFullAtTimestamp = Number(localStorage.getItem("script_energyFullAtTimestamp"));
        const radFullAtTimestamp = Number(localStorage.getItem("script_radFullAtTimestamp"));
        if (energyFullAtTimestamp === "0" || radFullAtTimestamp === "0") {
            return;
        }

        let timeLeftSec = Math.floor((localStorage.getItem("script_energyFullAtTimestamp") - Date.now()) / 1000);
        let logoElem = document.body.querySelector("#script_energyBar_logo");
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_energyBar_logo" style="order: 1; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">能量 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_energyBar_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_energyBar_logo" style="order: 1; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">能量已满</span></div>`
                );
                insertToElem.querySelector("#script_energyBar_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">能量 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">能量已满</span>`;
            }
        }

        timeLeftSec = Math.floor((localStorage.getItem("script_radFullAtTimestamp") - Date.now()) / 1000);
        logoElem = document.body.querySelector("#script_radBar_logo");
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_radBar_logo" style="order: 2; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">辐射 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_radBar_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/scavenge");
                    history.pushState(null, null, "https://www.zed.city/scavenge");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_radBar_logo" style="order: 2; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">辐射已满</span></div>`
                );
                insertToElem.querySelector("#script_radBar_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/scavenge");
                    history.pushState(null, null, "https://www.zed.city/scavenge");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">辐射 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">辐射已满</span>`;
            }
        }
    }
    setInterval(updateBarsDisplay, 500);

    /* 状态栏显示商店重置倒计时 */
    if (!localStorage.getItem("script_junkStoreResetTimestamp")) {
        localStorage.setItem("script_junkStoreResetTimestamp", 0);
    }
    if (!localStorage.getItem("script_junkStore_ironBarStock")) {
        localStorage.setItem("script_junkStore_ironBarStock", 0);
    }
    if (!localStorage.getItem("script_junkStore_limit_left")) {
        localStorage.setItem("script_junkStore_limit_left", 0);
    }

    function handleGetStoreJunkLimit(r) {
        const response = JSON.parse(r);
        const secLeft = response?.limits?.reset_time;
        if (secLeft) {
            const previousTimestamp = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
            const timestamp = Date.now() + secLeft * 1000;
            localStorage.setItem("script_junkStoreResetTimestamp", timestamp);
            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_junkStoreIsAlreadyNotified", false);
            }
        }

        // 铁锭出售库存
        if (response?.storeItems) {
            for (const item of response?.storeItems) {
                if (item.codename === "iron_bar") {
                    localStorage.setItem("script_junkStore_ironBarStock", item.quantity);
                }
            }
        }

        // 当前购买限额
        let limitLeft = response?.limits?.limit_left;
        if (limitLeft) {
            limitLeft += 240;
            localStorage.setItem("script_junkStore_limit_left", limitLeft);
        } else {
            localStorage.setItem("script_junkStore_limit_left", 360);
        }
    }

    function updateStoreResetDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container");
        if (!insertToElem) {
            return;
        }
        if (localStorage.getItem("script_junkStoreResetTimestamp") === "0") {
            return;
        }

        const logoElem = document.body.querySelector("#script_junk_store_limit_logo");
        const timeLeftSec = Math.floor((localStorage.getItem("script_junkStoreResetTimestamp") - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_junk_store_limit_logo" style="order: 4; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">商店 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_junk_store_limit_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/store/junk");
                    history.pushState(null, null, "https://www.zed.city/store/junk");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_junk_store_limit_logo" style="order: 4; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">商店已刷新</span></div>`
                );
                insertToElem.querySelector("#script_junk_store_limit_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/store/junk");
                    history.pushState(null, null, "https://www.zed.city/store/junk");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">商店 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">商店已刷新</span>`;
            }
        }
    }
    setInterval(updateStoreResetDisplay, 500);

    /* 状态栏显示熔炉工作 */
    if (!localStorage.getItem("script_forgeTimestamp")) {
        localStorage.setItem("script_forgeTimestamp", 0);
    }
    if (!localStorage.getItem("script_scavenge_records")) {
        localStorage.setItem("script_scavenge_records", "{}");
    }
    if (!localStorage.getItem("script_hunting_records")) {
        localStorage.setItem("script_hunting_records", "{}");
    }
    if (!localStorage.getItem("script_stronghold_id_gym")) {
        localStorage.setItem("script_stronghold_id_gym", "");
    }
    if (!localStorage.getItem("script_stronghold_id_radio_tower")) {
        localStorage.setItem("script_stronghold_id_radio_tower", "");
    }
    if (!localStorage.getItem("script_stronghold_id_furnace")) {
        localStorage.setItem("script_stronghold_id_furnace", "");
    }

    function handleStartJob(r) {
        const response = JSON.parse(r);
        const jobName = response?.job?.codename;

        // 熔炉
        const perActionTime = response?.job?.items?.["item_requirement-bp"]?.vars?.wait_time;
        const perActionConsumeItemNumber = response?.job?.items?.["item_requirement-bp"]?.vars?.items?.["item_requirement-1"]?.qty;
        const consumeItemNumber = response?.job?.items?.["item_requirement-1"]?.quantity;
        if (jobName === "furnace" && perActionTime && perActionConsumeItemNumber && consumeItemNumber) {
            const secLeft = perActionTime * (consumeItemNumber / perActionConsumeItemNumber);
            localStorage.setItem("script_forgeTimestamp", Date.now() + secLeft * 1000);
            localStorage.setItem("script_forgeIsAlreadyNotified", false);
            return;
        }

        // 拾荒统计
        if (jobName?.startsWith("job_scavenge_") || response?.job?.layout === "room_scavenge" || response?.job?.layout === "scavenge") {
            const records = JSON.parse(localStorage.getItem("script_scavenge_records"));
            const mapName = response?.job?.name;
            if (!records.hasOwnProperty(mapName)) {
                records[mapName] = {
                    mapName: mapName,
                    doneTimes: 0,
                    itemRewards: {},
                };
            }

            records[mapName].doneTimes += 1;
            if (response?.outcome?.rewards) {
                for (const reward of response?.outcome?.rewards) {
                    if (!records[mapName].itemRewards.hasOwnProperty(reward.name)) {
                        records[mapName].itemRewards[reward.name] = 0;
                    }
                    records[mapName].itemRewards[reward.name] += Number(reward.posted_qty);
                }
            }
            localStorage.setItem("script_scavenge_records", JSON.stringify(records));
        }

        // 狩猎统计
        handleHuntingStartJob(response);

        // 锻炼统计
        handleGymStartJob(response);

        // 远征图1油泵交易倒计时
        if (jobName?.startsWith("job_fuel_depot_fuel_trader_1")) {
            const timestamp = Date.now() + 10800 * 1000; // 3 hours
            localStorage.setItem("script_exploration_fuelTrade_cooldown_at_ms", timestamp);
        }

        // 远征图5炸药残骸开箱倒计时
        if (jobName?.startsWith("job_demolition_site_explosive_cache")) {
            const timestamp = Date.now() + 43200 * 4 * 1000; // 12 hours 改為 48 hours
            localStorage.setItem("script_exploration_map5_cooldown_at_ms", timestamp);
        }

        // 远征图6宝箱开箱倒计时 (新增代码)
        // 注意：'job_map6_chest_name' 是一个占位符，需要用浏览器的开发者工具(F12)查看网络请求，找到开启图6宝箱时对应的真实 jobName 并替换它。
        if (jobName?.startsWith("data_center-Ccchns_F")) {
            const timestamp = Date.now() + 21600 * 1000; // 6 hours (6 * 60 * 60)
            localStorage.setItem("script_exploration_map6_cooldown_at_ms", timestamp);
        }

    }

    /* 锻炼细节显示 */
    function handleGymStartJob(response) {
        const jobName = response?.job?.codename;
        if (jobName !== "gym") {
            return;
        }
        // 打印奖励数据结构（重点看属性类型和增益值的字段名）
        console.log("奖励数据详情：", response?.outcome?.rewards);
        // 打印数组中的第1个元素（重点！）
        console.log("第1个奖励项：", response?.outcome?.rewards?.[0]);
        // ... 其他代码
        // 从rewards数组中找到属性增加的奖励项
        const statReward = response?.outcome?.rewards?.find
           (item => item?.type === "stat_increase"); // 根据实际类型字段判断

        const playerName = localStorage.getItem("script_playerName");
        const getStats = JSON.parse(localStorage.getItem("script_getStats"));

        const gymLevel = response?.job?.vars?.level;
        const gain = response?.outcome?.gym_rewards?.gain;
        const stat = response?.outcome?.gym_rewards?.skill;
        const energy = response?.outcome?.iterations * 5;
        const statBefore = Number(getStats.stats[stat]);
        const moralBefore = Number(getStats.morale);
        let moralAfter = 0;
        for (const item of response?.reactive_items_qty) {
            if (item.codename === "morale") {
                moralAfter = Number(item.quantity);
            }
        }

        const text = `${playerName}在${gymLevel}星健身房用${energy}能量锻炼，士气从${moralBefore}减少了${moralBefore - moralAfter}，${dict(
            stat
        )}从${statBefore}增加了${gain}`;
        console.log(text);
        console.log(
            `${playerName} trained in the ${gymLevel} stars gym with ${energy} energy, morale decreased from ${moralBefore} by ${
                moralBefore - moralAfter
            }, ${stat} increased from ${statBefore} by ${gain}`
        );

        const insertToElem = document.body.querySelector(".q-page.q-layout-padding div");
        if (insertToElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div id=""><div class="script_do_not_translate" style="font-size: 12px; ">${text}</div></div>`
            );
        }
    }

    function handleCompleteJob(r) {
        const response = JSON.parse(r);
        const jobName = response?.job?.codename;
        if (jobName !== "furnace") {
            return;
        }
        localStorage.setItem("script_forgeTimestamp", Date.now());
        localStorage.setItem("script_forgeIsAlreadyNotified", true);
    }

    function handleGetStronghold(r) {
        const response = JSON.parse(r);
        // 据点房间ID
        for (const key in response.stronghold) {
            const area = response.stronghold[key].codename;
            if (area === "gym") {
                localStorage.setItem("script_stronghold_id_gym", String(key));
            }
            if (area === "radio_tower") {
                localStorage.setItem("script_stronghold_id_radio_tower", String(key));
            }
            if (area === "furnace") {
                localStorage.setItem("script_stronghold_id_furnace", String(key));
            }
        }

        if (!response.stronghold) {
            return;
        }
        for (const key in response.stronghold) {
            const area = response.stronghold[key];
            const jobName = area.codename;
            if (jobName !== "furnace") {
                continue;
            }
            const perActionTime = area?.items?.["item_requirement-bp"]?.vars?.wait_time;
            const perActionConsumeItemNumber = area?.items?.["item_requirement-bp"]?.vars?.items?.["item_requirement-1"]?.qty;
            const consumeItemNumber = area?.items?.["item_requirement-1"]?.quantity;
            const iterationsPassed = area?.iterationsPassed;
            const timeLeft = area?.timeLeft;
            if (perActionTime && perActionConsumeItemNumber && consumeItemNumber && iterationsPassed && timeLeft) {
                const secLeft = perActionTime * (consumeItemNumber / perActionConsumeItemNumber - iterationsPassed) - (perActionTime - timeLeft);
                const previousTimestamp = Number(localStorage.getItem("script_forgeTimestamp"));
                const timestamp = Date.now() + secLeft * 1000;
                localStorage.setItem("script_forgeTimestamp", timestamp);
                if (timestamp - previousTimestamp > 30000) {
                    localStorage.setItem("script_forgeIsAlreadyNotified", false);
                }
                break;
            }
        }
    }

    function updateForgeDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container");
        if (!insertToElem) {
            return;
        }
        if (localStorage.getItem("script_forgeTimestamp") === "0") {
            return;
        }
        const logoElem = document.body.querySelector("#script_forge_logo");
        const timeLeftSec = Math.floor((localStorage.getItem("script_forgeTimestamp") - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_forge_logo" style="order: 3; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">熔炉 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_forge_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_furnace"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_furnace"));
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_forge_logo" style="order: 3; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">熔炉未工作</span></div>`
                );
                insertToElem.querySelector("#script_forge_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_furnace"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_furnace"));
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">熔炉 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">熔炉未工作</span>`;
            }
        }
    }
    setInterval(updateForgeDisplay, 500);

    /* 状态栏显示无线电塔交易刷新 */
    if (!localStorage.getItem("script_radioTowerTradeTimestamp")) {
        localStorage.setItem("script_radioTowerTradeTimestamp", 0);
    }

    function handleGetRadioTower(r) {
        const response = JSON.parse(r);
        const expire = response?.expire;
        if (expire) {
            const previousTimestamp = Number(localStorage.getItem("script_radioTowerTradeTimestamp"));
            const timestamp = Date.now() + expire * 1000;
            localStorage.setItem("script_radioTowerTradeTimestamp", timestamp);
            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_radioTowerIsAlreadyNotified", false);
            }
        }
    }

    function updateRadioTowerDisplay() {
        if (localStorage.getItem("script_radioTowerTradeTimestamp") === "0") {
            return;
        }
        const insertToElem = document.body.querySelector("#script_countdowns_container");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_radio_tower_logo");
        const timeLeftSec = Math.floor((localStorage.getItem("script_radioTowerTradeTimestamp") - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_radio_tower_logo" style="order: 5; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">电塔 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_radio_tower_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_radio_tower"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_radio_tower"));
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_radio_tower_logo" style="order: 5; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">电塔已刷新</span></div>`
                );
                insertToElem.querySelector("#script_radio_tower_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_radio_tower"));
                    history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_radio_tower"));
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">电塔 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">电塔已刷新</span>`;
            }
        }
    }
    setInterval(updateRadioTowerDisplay, 500);

    /* 状态栏显示帮派突袭冷却计时 */
    if (!localStorage.getItem("script_raidTimestamp")) {
        localStorage.setItem("script_raidTimestamp", 0);
    }

    function updateRaidDisplay() {
        if (localStorage.getItem("script_raidTimestamp") === "0") {
            return;
        }
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_raidCooldown_logo");
        const timeLeftSec = Math.floor((localStorage.getItem("script_raidTimestamp") - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_raidCooldown_logo" style="order: 1; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">突袭 ${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_raidCooldown_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/raids");
                    history.pushState(null, null, "https://www.zed.city/raids");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_raidCooldown_logo" style="order: 1; cursor: pointer; " class="script_do_not_translate"><span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">突袭已冷却</span></div>`
                );
                insertToElem.querySelector("#script_raidCooldown_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/raids");
                    history.pushState(null, null, "https://www.zed.city/raids");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">突袭 ${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="background-color: #ef5350; font-size: 12px;">突袭OK</span>`;
            }
        }
    }
    setInterval(updateRaidDisplay, 500);

    /* 状态栏显示总BS */
    function updateBSDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_bs_logo");
        const totalBS = localStorage.getItem("script_totalBS") ? localStorage.getItem("script_totalBS") : 0;
        if (!logoElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div id="script_bs_logo" style="order: 99; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px; color: green;">战力：${numberFormatter(
                    totalBS
                )}</span></div>`
            );
            insertToElem.querySelector("#script_bs_logo").addEventListener("click", () => {
                history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                history.pushState(null, null, "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"));
                history.go(-1);
            });
        } else {
            logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px; color: green;">战力：${numberFormatter(
                totalBS
            )}</span>`;
        }
    }
    setInterval(updateBSDisplay, 500);

    /* 远征图1油泵交易倒计时 */
    function updateFuelTradeDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_fuelTrade_logo");
        const cooldownTimestamp = localStorage.getItem("script_exploration_fuelTrade_cooldown_at_ms")
            ? localStorage.getItem("script_exploration_fuelTrade_cooldown_at_ms")
            : 0;
        const timeLeftSec = Math.floor((cooldownTimestamp - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_fuelTrade_logo" style="order: 2; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">油泵：${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_fuelTrade_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_fuelTrade_logo" style="order: 2; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">油泵已冷却</span></div>`
                );
                insertToElem.querySelector("#script_fuelTrade_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">油泵：${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">油泵OK</span>`;
            }
        }
    }
    setInterval(updateFuelTradeDisplay, 500);

    /* 远征图5炸药残骸开箱倒计时 */
    function updateMap5Display() {
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_map5_logo");
        const cooldownTimestamp = localStorage.getItem("script_exploration_map5_cooldown_at_ms")
            ? localStorage.getItem("script_exploration_map5_cooldown_at_ms")
            : 0;
        const timeLeftSec = Math.floor((cooldownTimestamp - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_map5_logo" style="order: 3; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">图5：${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_map5_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_map5_logo" style="order: 3; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">图5已冷却</span></div>`
                );
                insertToElem.querySelector("#script_map5_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">拆除：${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">拆除OK</span>`;
            }
        }
    }
    setInterval(updateMap5Display, 500);

    /* 远征图6宝箱开箱倒计时 (新增代码) */
    function updateMap6Display() {
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }
        const logoElem = document.body.querySelector("#script_map6_logo");
        const cooldownTimestamp = localStorage.getItem("script_exploration_map6_cooldown_at_ms")
        ? localStorage.getItem("script_exploration_map6_cooldown_at_ms")
        : 0;
        const timeLeftSec = Math.floor((cooldownTimestamp - Date.now()) / 1000);
        if (!logoElem) {
            if (timeLeftSec > 0) {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_map6_logo" style="order: 4; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">图6：${timeReadable(
                        timeLeftSec
                    )}</span></div>`
                );
                insertToElem.querySelector("#script_map6_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            } else {
                insertToElem.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_map6_logo" style="order: 4; cursor: pointer;" class="script_do_not_translate"><span class="script_do_not_translate" style="font-size: 12px;">图6已冷却</span></div>`
                );
                insertToElem.querySelector("#script_map6_logo").addEventListener("click", () => {
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.pushState(null, null, "https://www.zed.city/explore");
                    history.go(-1);
                });
            }
        } else {
            if (timeLeftSec > 0) {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">工地：${timeReadable(timeLeftSec)}</span>`;
            } else {
                logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">工地OK</span>`;
            }
        }
    }
    setInterval(updateMap6Display, 500);

    /* Zed 熔炉内嵌废品店小窗口 */ //（支持设置开关控制）
    // -------------------------- 1. 新增：开关状态工具函数（读取localStorage中的开关状态） --------------------------
    // 开关在localStorage中的存储键（需与设置页开关的key保持一致：script_furnace_junk_store）
    const FURNACE_SWITCH_KEY = "script_furnace_junk_store";

    /**
     * 判断熔炉内嵌废品店开关是否开启
     * @returns {boolean} 开关开启返回true，关闭/未设置返回false
     */
    function isFurnaceSwitchEnabled() {
        // 从localStorage读取状态，默认关闭
        return localStorage.getItem(FURNACE_SWITCH_KEY) === "enabled";
    }

    /**
     * 移除所有已创建的自定义盒子（开关关闭时清理DOM）
     */
    function removeAllCustomBoxes() {
        const customBoxes = document.querySelectorAll('.custom-box');
        customBoxes.forEach(box => box.remove());
    }

    // -------------------------- 2. 修正：仅在开关开启时执行DOM监听 --------------------------
    // 存储Observer实例，方便后续控制（如开关关闭时断开监听）
    let furnaceMutationObserver = null;

    // 初始化监听：仅在开关开启时创建Observer
    function initFurnaceObserver() {
        // 先断开已有监听，避免重复
        if (furnaceMutationObserver) {
            furnaceMutationObserver.disconnect();
        }

        // 开关开启：启动监听并执行初始检查
        if (isFurnaceSwitchEnabled()) {
            furnaceMutationObserver = new MutationObserver(checkRows);
            furnaceMutationObserver.observe(document.body, { childList: true, subtree: true });
            checkRows(); // 初始执行一次，确保已加载的熔炉区域能触发功能
        } else {
            // 开关关闭：清理已创建的盒子
            removeAllCustomBoxes();
        }
    }

    // 页面加载时初始化监听（首次进入页面触发）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFurnaceObserver);
    } else {
        initFurnaceObserver();
    }

    // （可选）监听开关状态变化（如从设置页切换开关后实时生效）
    // 注：若页面是SPA（无刷新切换），需添加此监听确保状态同步
    window.addEventListener('storage', (e) => {
        if (e.key === FURNACE_SWITCH_KEY) {
            initFurnaceObserver(); // 开关状态变化时重新初始化监听
        }
    });

    // -------------------------- 3. 修正：checkRows（仅开关开启时创建盒子） --------------------------
    function checkRows() {
        // 开关关闭：直接返回，不执行任何创建逻辑
        if (!isFurnaceSwitchEnabled()) {
            removeAllCustomBoxes(); // 额外保险：清理可能残留的盒子
            return;
        }

        const rows = document.querySelectorAll('.row.q-col-gutter-sm.q-mb-sm');
        rows.forEach(row => {
            if (row.textContent.includes('Hot enough to melt things')) {
                let nextElement = row.nextElementSibling;
                // 仅在开关开启且无重复盒子时创建
                if (!nextElement || !nextElement.classList.contains('custom-box')) {
                    const box1 = createCustomBox();
                    const button1 = createButton('废品店', () => showBox2('', box1, 'https://www.zed.city/store/junk'));
                    box1.appendChild(button1);

                    const box2 = createCustomBox();
                    box2.style.display = 'none';
                    box2.textContent = '2盒子';
                    row.parentNode.insertBefore(box1, row.nextSibling);
                    row.parentNode.insertBefore(box2, box1.nextSibling);
                }
            }
        });
    }


    // -------------------------- 4. 修正：showBox2（仅开关开启时加载iframe） --------------------------
    function showBox2(message, box1, url) {
        // 开关关闭：不执行iframe创建逻辑
        if (!isFurnaceSwitchEnabled()) return;

        const box2 = document.querySelector('.custom-box + .custom-box');
        if (box2) {
            box2.textContent = message;
            box2.style.display = 'block';
            box1.style.marginBottom = '0';

            // 避免重复创建iframe（开关反复切换时防止多iframe）
            if (!box2.querySelector('iframe')) {
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = '100%';
                iframe.style.height = '250px';
                iframe.style.border = 'none';
                box2.appendChild(iframe);
                setupIframeIntervals(iframe);
            }
        }
    }


    // -------------------------- 5. 以下函数逻辑不变（仅保留） --------------------------
    function createCustomBox() {
        const box = document.createElement('div');
        box.className = 'custom-box';
        box.style.backgroundColor = '#202327';
        box.style.border = '1px solid black';
        box.style.padding = '10px';
        box.style.marginTop = '0';
        box.style.marginBottom = '10px';
        return box;
    }

    function createButton(text, onclick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onclick;
        return button;
    }

    function setupIframeIntervals(iframe) {
        const intervals = [
            { selector: 'header', style: { display: 'none' } },
            { selector: '.q-footer.q-layout__section--marginal.fixed-bottom', style: { display: 'none' } },
            { selector: '.row.items-center.q-mb-lg', style: { display: 'none' } },
            { selector: '.title', style: { display: 'none' } },
            { selector: '.row.justify-center.q-mb-xs', style: { display: 'none' } },
            { selector: '.row.justify-center.q-mb-sm', style: { display: 'none' } }
        ];

        intervals.forEach(interval => {
            setInterval(() => {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const elements = iframeDocument.querySelectorAll(interval.selector);
                elements.forEach(element => {
                    Object.assign(element.style, interval.style);
                });
            }, 100);
        });

        const keywordsToHide = ['Logs', 'Cloth', 'Gun Powder', 'Scrap', 'Iron Ore', 'Coal', 'Fuel'];
        setInterval(() => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const itemRows = iframeDocument.querySelectorAll('.item-row');
            itemRows.forEach(itemRow => {
                const itemRowText = itemRow.innerHTML;
                if (keywordsToHide.some(keyword => itemRowText.includes(keyword))) {
                    itemRow.style.display = 'none';
                }

                const containsNails1 = itemRowText.includes('Iron Bar');
                const containsSell1 = itemRowText.includes('<span class="block" script_translated_from="Sell">出售</span>');
                if (containsNails1 && containsSell1) {
                    itemRow.style.display = 'none';
                }

                const containsNails2 = itemRowText.includes('Nails');
                const containsSell2 = itemRowText.includes('<span class="block" script_translated_from="Buy">购买</span>');
                if (containsNails2 && containsSell2) {
                    itemRow.style.display = 'none';
                }
            });
        }, 100);
    }

    /* 遠征 ZONE2 需求圖 */
    /* 遠征 ZONE2 需求圖 - 统一格式重构版 */
     const ICON_STYLES = {
        container: `
        position: relative;
        display: inline-block;
        margin-left: 8px;
        vertical-align: middle;
    `,
        image: `
        width: 35px;
        height: 35px;
    `,
        count: `
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 10px;
        background-color: red;
        color: white;
        border-radius: 50%;
        padding: 1px 4px;
    `
    };

    // 通用函数：创建工具图标容器
    function createToolIcon(imageSrc, altText, count) {
        // 创建容器
        const container = document.createElement('div');
        container.className = 'tool-icon-container';
        container.style.cssText = ICON_STYLES.container;

        // 创建图片
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = altText;
        img.style.cssText = ICON_STYLES.image;

        // 创建数量标记
        const countSpan = document.createElement('span');
        countSpan.textContent = `x${count}`;
        countSpan.style.cssText = ICON_STYLES.count;

        // 组合元素
        container.appendChild(img);
        container.appendChild(countSpan);

        return container;
    }

    // 1. 重构图标添加函数，增加场景强制验证
    function addIconsToJob(targetSelector, icons, isTranslationEnabled) {
        let targetJob;
        const isSelectorString = typeof targetSelector === 'string';
        const isSelectorObject = typeof targetSelector === 'object' && targetSelector.text;

        // 强制验证场景与选择器类型是否匹配
        const isSceneMismatch = (isTranslationEnabled && !isSelectorString) ||
              (!isTranslationEnabled && !isSelectorObject);
        /*
        if (isSceneMismatch) {
            console.error(`ZONE2严重错误：场景与选择器类型不匹配！`, {
                实际汉化状态: isTranslationEnabled ? "是（应使用字符串选择器）" : "否（应使用对象选择器）",
                接收到的选择器类型: isSelectorString ? "字符串（适合汉化场景）" : "对象（适合非汉化场景）",
                选择器内容: targetSelector
            });
            return;
        }
        */

        if (isTranslationEnabled) {
            // 汉化场景：使用字符串选择器匹配属性
            targetJob = document.querySelector(targetSelector);

            // 额外检查：如果选择器正确但未找到元素，验证DOM中是否存在该属性
            if (!targetJob) {
                const attrValue = targetSelector.match(/script_translated_from="(.*?)"/)[1];
                const elementsWithAttr = document.querySelectorAll(`[script_translated_from="${attrValue}"]`);
                //console.log(`汉化场景下未找到元素，当前DOM中具有script_translated_from="${attrValue}"的元素数量:`, elementsWithAttr.length);
            }
        } else {
            // 非汉化场景：使用对象选择器匹配文本
            const jobNameElements = document.querySelectorAll('.col-12 .job-name, .job-name');
            const targetText = targetSelector.text.trim();

            // 改进匹配逻辑：只匹配开头部分，忽略后续添加的图标文本
            targetJob = Array.from(jobNameElements).find(el => {
                // 提取元素的直接文本节点内容（忽略子元素）
                const directText = Array.from(el.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE) // 只保留文本节点
                .map(node => node.textContent.trim())
                .join('') // 拼接所有直接文本（若有多个）
                .trim();
                // 匹配逻辑：直接文本以目标文本开头或完全相等
                return directText.startsWith(targetText) || directText === targetText;
            });
            /*
            // 额外检查：如果未找到元素，打印所有文本供对比
            if (!targetJob) {
                console.log(`非汉化场景下未找到文本为"${targetSelector.text}"的元素，当前存在的文本:`,
                            Array.from(jobNameElements).map(el => el.textContent.trim()));
            }
            */
        }

        if (targetJob) {
            // 检查是否已经添加了图标，避免重复添加
            const existingIcons = targetJob.querySelectorAll('.tool-icon-container');
            if (existingIcons.length === 0) {
                icons.forEach(icon => {
                    const iconElement = createToolIcon(icon.src, icon.alt, icon.count);
                    targetJob.appendChild(iconElement);
                });
                return true;
            }
            return true; // 已经添加过图标
        } else {
            // console.log(`ZONE2图标：未找到目标元素`, targetSelector);
            return false; // 未找到元素
        }
    }


    // 2. 重构汉化状态判断，增加双重验证
    function addPicturesIfNeeded() {
        // 基础开关检查
        const isZone2Enabled = localStorage.getItem("script_expedition_zone2_icon") === "enabled";
        if (!isZone2Enabled || !window.location.href.includes('www.zed.city/explore')) {
            const existingIcons = document.querySelectorAll('.tool-icon-container');
            existingIcons.forEach(icon => icon.remove());
            return;
        }

        // 关键修复：双重验证汉化状态
        const storedValue = localStorage.getItem("script_translate");
        const isTranslated = document.querySelector('[script_translated_from]') !== null; // 检查页面是否有翻译属性
        let isTranslationEnabled;

        // 根据存储值和页面实际状态双重判断
        if (storedValue === "enabled" || (storedValue !== "disabled" && isTranslated)) {
            isTranslationEnabled = true;
        } else {
            isTranslationEnabled = false;
        }
        /*
        // 打印关键调试信息
        console.log(`汉化状态判断：`, {
            localStorage存储值: storedValue,
            页面是否有翻译属性: isTranslated,
            最终判断结果: isTranslationEnabled ? "汉化场景（应使用字符串选择器）" : "非汉化场景（应使用对象选择器）"
        });
        */

        // 检查是否在目标页面
        if (!window.location.href.includes('www.zed.city/explore')) {
            return;
        }

        // 定义所有需要添加的图标配置 - 后续新增只需在这里添加配置
        const iconConfigurations = [
            {
                targetSelector:isTranslationEnabled
                ? '.col-12 .job-name[script_translated_from="Open Meadow"]'
                : { text: "Open Meadow" },
                icons: [
                    {
                        src: 'https://www.zed.city/assets/hatchet-BXZwNmbn.png',
                        alt: 'Hatchet tool icon',
                        count: 1
                    },
                    {
                        src: 'https://www.zed.city/assets/craft_log-BcEmhczv.png',
                        alt: 'Craft log icon',
                        count: 125
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ?'.col-12 .job-name[script_translated_from="Fuel Depot"]'
                : { text: "Fuel Depot" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/misc_security_card.png',
                        alt: 'Security card icon',
                        count: 1
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ? '.col-12 .job-name[script_translated_from="Demolition Site"]'
                : { text: "Demolition Site" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/misc_lockpick.png',
                        alt: 'Lockpick icon',
                        count: 2
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ? '.col-12 .job-name[script_translated_from="Construction Yard"]'
                : { text: "Construction Yard" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/explosives.png',
                        alt: 'Explosives icon',
                        count: 1
                    },
                    {
                        src: 'https://www.zed.city/items/misc_lockpick.png',
                        alt: 'Lockpick icon',
                        count: 1
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ? '.col-12 .job-name[script_translated_from="Data Center"]'
                : { text: "Data Center" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/explosives.png',
                        alt: 'Explosives icon',
                        count: 1
                    },
                    {
                        src: 'https://www.zed.city/items/misc_lockpick.png',
                        alt: 'Lockpick icon',
                        count: 1
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ? '.col-12 .job-name[script_translated_from="Military Base"]'
                : { text: "Military Base" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/barracks_key.png',
                        alt: 'barracks key icon',
                        count: 1
                    },
                    {
                        src: 'https://www.zed.city/items/generals_rfid.png',
                        alt: 'generals rfid icon',
                        count: 1
                    }
                ]
            },
            {
                targetSelector:isTranslationEnabled
                ?'.col-12 .job-name[script_translated_from="Research Facility"]'
                : { text: "Research Facility" },
                icons: [
                    {
                        src: 'https://www.zed.city/items/splicer.png',
                        alt: 'Splicer icon',
                        count: 1
                    }
                ]
            }
        ];

        // 1. 先计算总图标数（关键：在判断前定义）
        /*
        1.
        reduce 的基础逻辑：把数组「压缩」成一个值
        reduce 的工作流程可以理解为「拿着一个「累加器」，逐个遍历数组元素，每次都用元素更新累加器，最后返回累加器的最终值」。
        它的基本语法是：
        数组.reduce((累加器, 当前元素) => {
          // 用当前元素更新累加器的逻辑
          return 更新后的累加器;
        }, 初始值); // 累加器的初始状态（可选，但建议必传，避免异常）
        2.total 跟 config 為臨時變量名稱
        3.或採用
        let total = 0;
        // 遍历每个 config，在回调中更新累加器
        iconConfigurations.forEach(config => {
          total += config.icons.length; // 累加逻辑写在回调里
        });
        */
        const totalIconsNeeded = iconConfigurations.reduce((total, config) => {
            return total + config.icons.length;
        }, 0);

        // 检查是否已存在相关容器，避免重复添加
        const existingContainers = document.querySelectorAll('.tool-icon-container');
        // 若已添加的图标数等于需要的总数，说明已完成，直接返回
        if (existingContainers.length === totalIconsNeeded) {
            return;
        }

        // 清除已存在的容器，确保显示正确
        existingContainers.forEach(container => container.remove());

        // 批量添加所有图标
        iconConfigurations.forEach(config => {
            addIconsToJob(config.targetSelector, config.icons, isTranslationEnabled);
        });

        // console.log('已完成所有图标添加检查');
    }

    // 初始化观察者
    function setupMutationObserver() {
        const observerOptions = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        };

        // 添加检测间隔控制（500ms内只检测一次）
        let lastCheckTime = 0;
        const checkInterval = 500;

        const observer = new MutationObserver((mutations) => {
            const now = Date.now();
            if (now - lastCheckTime < checkInterval) {
                return; // 间隔过短则跳过
            }

            if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
                addPicturesIfNeeded();
                lastCheckTime = now;
            }
        });

        observer.observe(document.body, observerOptions);
        addPicturesIfNeeded();
        return observer;
    }

    // 页面加载完成后设置观察者
    window.addEventListener('load', () => {
        // 给页面一些初始加载时间
        setTimeout(setupMutationObserver, 1000);
    });


    /* 显示车重 */
    function updateVehicleWeightDisplay() {
        const insertToElem = document.body.querySelector("#script_countdowns_container_2");
        if (!insertToElem) {
            return;
        }

        // 从本地存储获取script_getStats并解析
        let max_weight = 0;
        const statsStr = localStorage.getItem("script_getStats");
        if (statsStr) {
            try {
                const statsData = JSON.parse(statsStr);
                // 提取vehicle_capacity的值
                if (statsData.stats && statsData.stats.vehicle_capacity) {
                    max_weight = Number(statsData.stats.vehicle_capacity);
                    // 将vehicle_capacity的值赋给script_vehicle_max_weight
                    localStorage.setItem("script_vehicle_max_weight", max_weight.toString());
                }
            } catch (e) {
                console.error("解析script_getStats数据失败：", e);
                return;
            }
        }

        // 如果没有获取到max_weight，尝试从本地存储的script_vehicle_max_weight读取
        if (max_weight <= 0) {
            max_weight = Number(localStorage.getItem("script_vehicle_max_weight")) || 0;
        }

        // 处理最大载重无效的情况
        if (max_weight <= 0) {
            return;
        }

        // 获取当前重量
        const weight = Number(localStorage.getItem("script_vehicle_weight")) || 0;

        // 格式化显示值
        const maxWeightFormatted = max_weight.toFixed(1);
        const weightFormatted = weight.toFixed(2);

        // 计算比例（使用当前重量除以最大重量）
        const percentage = Math.max(0, Math.min(1, weight / max_weight));

        // 获取渐变颜色（绿->白->红）
        const color = getGradientColor(percentage);

        // 更新或创建显示元素
        const logoElem = document.body.querySelector("#script_vehicleWeight_logo");
        if (!logoElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div id="script_vehicleWeight_logo" style="order: 98; cursor: pointer;" class="script_do_not_translate">
                    <span class="script_do_not_translate" style="font-size: 12px; color: ${color};">
                        车重：${weightFormatted}/${maxWeightFormatted}
                    </span>
                </div>`
            );
            insertToElem.querySelector("#script_vehicleWeight_logo").addEventListener("click", () => {
                history.pushState(null, null, "https://www.zed.city/inventory");
                history.pushState(null, null, "https://www.zed.city/inventory");
                history.go(-1);
            });
        } else {
            logoElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px; color: ${color};">
                车重：${weightFormatted}/${maxWeightFormatted}
            </span>`;
        }
    }
    setInterval(updateVehicleWeightDisplay, 500);

    /**
    * 使用HSV色彩空间实现更平滑的绿→白→红过渡
    * @param {number} percentage 0-1之间的比例值
    * @returns {string} 十六进制颜色值
    */
    function getGradientColor(percentage) {
        percentage = Math.max(0, Math.min(1, percentage));
        let hue, saturation, value;

        if (percentage <= 0.33) {
            // 第一阶段：绿色 → 白色（0% - 33%）
            // 色相从120（绿色）保持不变，饱和度逐渐降低到0（白色）
            hue = 120; // 绿色的色相值
            saturation = 1 - (percentage / 0.33); // 0.33时饱和度为0（白色）
            value = 1; // 明度保持最高
        } else if (percentage <= 0.66) {
            // 第二阶段：白色 → 浅红色（33% - 66%）
            // 色相从0（红色）保持不变，饱和度从0逐渐增加到0.5
            hue = 0; // 红色的色相值
            saturation = (percentage - 0.33) / 0.33 * 0.5; // 0.66时饱和度为0.5
            value = 1; // 明度保持最高
        } else {
            // 第三阶段：浅红色 → 深红色（66% - 100%）
            // 色相保持0（红色），饱和度从0.5增加到1，明度略微降低增强红色浓度
            hue = 0;
            saturation = 0.5 + (percentage - 0.66) / 0.34 * 0.5; // 100%时饱和度为1
            value = 1 - (percentage - 0.66) / 0.34 * 0.1; // 略微降低明度，让红色更深
        }

        // 将HSV转换为RGB
        const rgb = hsvToRgb(hue, saturation, value);
        return `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`;
    }

    /**
    * HSV转RGB工具函数
    * @param {number} h 色相（0-360）
    * @param {number} s 饱和度（0-1）
    * @param {number} v 明度（0-1）
    * @returns {Object} {r, g, b} 0-255的RGB值
    */
    function hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h / 60);
        const f = h / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }


    /* 显示物价 */
    function onElementAdded(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "characterData" && mutation.target.parentNode.matches(".q-item__label")) {
                    callback(mutation.target.parentNode);
                }

                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches(selector)) {
                            callback(node);
                        }
                        node.querySelectorAll(selector).forEach((child) => callback(child));
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: true });
    }

    onElementAdded(".q-item__label", (element) => {
        showItemWorths(element);
    });

    // 补充：处理页面初始就存在的元素
    document.querySelectorAll(".q-item__label").forEach(showItemWorths);


    /* 车辆中物品总价值 */
    function showItemWorths(element) {
        const itemName = getOriTextFromElement(element); //获取元素的 “原始文本”（翻译前内容）
        const price = getItemWorth(itemName); // 本地獲取 item 的 price
        const text = price > 0 ? ` [$${numberFormatter(price)}]` : "";

        const added = element.querySelector(".script_addedPrice");
        if (added && added.textContent !== text) {
            added.textContent = text;
        } else if (!added) {
            element.insertAdjacentHTML("beforeend", `<span class="script_do_not_translate script_addedPrice" style="color: green;">${text}</span>`);
        }
    }

    function handleLoadItems(r) {
        const response = JSON.parse(r);
        if (!response?.vehicle_items) {
            return;
        }

        let totalWorth = 0;
        let totalWeight = 0;
        const itemPerformance = []; // <--- 新增：用于存储物品性价比的数组

        for (const item of response.vehicle_items) {
            const perPrice = getItemWorth(item.name);
            const quantity = item.quantity;
            const weight = Number(item.vars.weight);
            totalWorth += perPrice * quantity;
            totalWeight += weight * quantity;

            // --- 新增：计算并存储性价比 ---
            if (weight > 0) { // 避免除以零
                const performance = perPrice / weight;
                itemPerformance.push({
                    name: item.name,
                    price: perPrice,
                    weight: weight,
                    performance: performance,
                    quantity: quantity
                });
            }
            // --- 新增结束 ---
        }

        localStorage.setItem("script_vehicle_weight", totalWeight);

        // --- 新增：排序并打印性价比到控制台 ---
        if (window.location.href.includes("zed.city/inventory")) {
            // 按性价比(performance)从高到低排序
            itemPerformance.sort((a, b) => b.performance - a.performance);

            console.clear(); // 清空控制台，让信息更清晰
            console.log("%c--- 车辆物品性价比排名 (价值/重量) ---", "color: #4CAF50; font-size: 16px; font-weight: bold;");

            // 使用 console.table 格式化输出，更美观
            const tableData = itemPerformance.map(item => ({
                "物品名称 (Name)": dict(item.name), // 使用汉化函数
                "性价比 (Perf.)": item.performance.toFixed(2),
                "单价 (Price)": `$${numberFormatter(item.price)}`,
                "单重 (Weight)": `${item.weight.toFixed(2)}kg`,
                "数量 (Qty)": item.quantity
            }));
            console.table(tableData);
        }
        // --- 新增结束 ---

        const text = "【车辆中物品总价值：$" + numberFormatter(totalWorth) + "】";

        // 在页面下方显示车辆中物品总价值
        const insertToElem = document.body.querySelector(".q-page.q-layout-padding div");
        if (!insertToElem) {
            return;
        }
        const textElem = document.body.querySelector("#script_vehicle_worth");
        if (!textElem) {
            insertToElem.insertAdjacentHTML(
                "beforeBegin",
                `<div id="script_vehicle_worth" class="script_do_not_translate"><div class="script_do_not_translate" style="font-size: 14px;">${text}</div></div>`
            );
        } else {
            textElem.innerHTML = `<div class="script_do_not_translate" style="font-size: 14px;">${text}</div>`;
        }
    }

    /* 倒计时弹窗 */
    function pushSystemNotifications() {
        const savedState = localStorage.getItem("script_settings_notifications") === "enabled";
        if (!savedState) {
            return;
        }

        const forgeTimestamp = Number(localStorage.getItem("script_forgeTimestamp"));
        const forgeIsAlreadyNotified = localStorage.getItem("script_forgeIsAlreadyNotified");
        if (forgeTimestamp && forgeTimestamp > 0 && forgeIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((forgeTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification forge");
                localStorage.setItem("script_forgeIsAlreadyNotified", true);
                GM_notification({
                    text: "熔炉已完成工作",
                    title: "ZedTools",
                    url: "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_furnace"),
                });
            }
        }

        const radioTowerTimestamp = Number(localStorage.getItem("script_radioTowerTradeTimestamp"));
        const radioTowerIsAlreadyNotified = localStorage.getItem("script_radioTowerIsAlreadyNotified");
        if (radioTowerTimestamp && radioTowerTimestamp > 0 && radioTowerIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((radioTowerTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification radioTower");
                localStorage.setItem("script_radioTowerIsAlreadyNotified", true);
                GM_notification({
                    text: "无线电塔交易已刷新",
                    title: "ZedTools",
                    url: "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_radio_tower"),
                });
            }
        }

        const raidTimestamp = Number(localStorage.getItem("script_raidTimestamp"));
        const raidIsAlreadyNotified = localStorage.getItem("script_raidIsAlreadyNotified");
        if (raidTimestamp && raidTimestamp > 0 && raidIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((raidTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification raid");
                localStorage.setItem("script_raidIsAlreadyNotified", true);
                GM_notification({
                    text: "帮派突袭已冷却",
                    title: "ZedTools",
                    url: "https://www.zed.city/raids",
                });
            }
        }

        const junkStoreTimestamp = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
        const junkStoreIsAlreadyNotified = localStorage.getItem("script_junkStoreIsAlreadyNotified");
        if (junkStoreTimestamp && junkStoreTimestamp > 0 && junkStoreIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((junkStoreTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification junkStore");
                localStorage.setItem("script_junkStoreIsAlreadyNotified", true);
                GM_notification({
                    text: "废品店商店已刷新",
                    title: "ZedTools",
                    url: "https://www.zed.city/store/junk",
                });
            }
        }

        const energyTimestamp = Number(localStorage.getItem("script_energyFullAtTimestamp"));
        const energyIsAlreadyNotified = localStorage.getItem("script_energyFullAlreadyNotified");
        if (energyTimestamp && energyTimestamp > 0 && energyIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((energyTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification energy bar");
                localStorage.setItem("script_energyFullAlreadyNotified", true);
                GM_notification({
                    text: "能量条已满",
                    title: "ZedTools",
                    url: "https://www.zed.city/stronghold/" + localStorage.getItem("script_stronghold_id_gym"),
                });
            }
        }

        const radTimestamp = Number(localStorage.getItem("script_radFullAtTimestamp"));
        const radIsAlreadyNotified = localStorage.getItem("script_radFullAlreadyNotified");
        if (radTimestamp && radTimestamp > 0 && radIsAlreadyNotified !== "true") {
            const timeLeftSec = Math.floor((radTimestamp - Date.now()) / 1000);
            if (timeLeftSec > -60 && timeLeftSec < 0) {
                console.log("pushSystemNotification rad bar");
                localStorage.setItem("script_radFullAlreadyNotified", true);
                GM_notification({
                    text: "辐射免疫力条已满",
                    title: "ZedTools",
                    url: "https://www.zed.city/scavenge",
                });
            }
        }
    }
    setInterval(pushSystemNotifications, 1000);

    /* 废品场屏蔽物品收售 */
    if (!localStorage.getItem("script_settings_junk")) {
        localStorage.setItem("script_settings_junk", "enabled");
    }

    function hideItems() {
        if (window.location.href.includes("zed.city/store/junk") && localStorage.getItem("script_settings_junk") === "enabled") {
            document.querySelectorAll(".q-item").forEach((item) => {
                let label = item.querySelector(".q-item__label");
                let buySpan = item.querySelector("span.block");
                if (label && buySpan && getOriTextFromElement(label).startsWith("Nails") && getOriTextFromElement(buySpan) === "Buy") {
                    item.style.display = "none";
                } else if (label && buySpan && getOriTextFromElement(buySpan) === "Sell" &&
                           !getOriTextFromElement(label).startsWith("Nails") &&
                           !getOriTextFromElement(label).startsWith("Unrefined Plastic")){
                    item.style.display = "none";
                }
            });
        }
    }
    setInterval(hideItems, 500);

    /* 设置里添加功能开关 */
    function addSettingSwitches() {
        // 检查是否在设置页面
        if (!window.location.href.includes("zed.city/settings")) {
            return;
        }

        // 如果已经存在设置容器，不再重复添加
        if (document.querySelector(".script-settings-container")) {
            return;
        }

        // 查找目标容器 - 根据您提供的HTML结构
        const targetContainer = document.querySelector('.q-tabs.row.no-wrap.items-center.q-tabs--not-scrollable.q-tabs--horizontal.q-tabs__arrows--inside.q-tabs--mobile-without-arrows.q-mb-md.submenu');
        if (!targetContainer) {
            console.log("未找到目标容器");
            return;
        }

        // 创建统一的设置容器
        const settingsContainer = document.createElement("div");
        settingsContainer.classList.add("script-settings-container");
        settingsContainer.style.margin = "15px 0";
        settingsContainer.style.border = "1px solid #444";
        settingsContainer.style.borderRadius = "6px";
        settingsContainer.style.maxWidth = "460px";
        settingsContainer.style.color = "#fff"; // 整体文字颜色
        settingsContainer.style.display = "flex";
        settingsContainer.style.flexDirection = "column";

        // 创建标题容器（黑底白字）
        const titleContainer = document.createElement("div");
        titleContainer.style.backgroundColor = "black";
        titleContainer.style.padding = "10px 15px";
        titleContainer.style.borderTopLeftRadius = "5px";
        titleContainer.style.borderTopRightRadius = "5px";
        titleContainer.style.maxHeight = "25px";

        const settingsTitle = document.createElement("h2");
        settingsTitle.textContent = "脚本功能设置 Script Settings";
        settingsTitle.style.marginTop = "-27px";
        settingsTitle.style.fontSize = "12px";
        settingsTitle.style.color = "#fffc";
        titleContainer.appendChild(settingsTitle);
        settingsContainer.appendChild(titleContainer);

        // 创建选项容器（灰色背景）
        const optionsContainer = document.createElement("div");
        optionsContainer.style.backgroundColor = "rgb(32, 35, 39)"; // 灰色背景
        optionsContainer.style.padding = "15px";
        optionsContainer.style.borderBottomLeftRadius = "5px";
        optionsContainer.style.borderBottomRightRadius = "5px";

        const isTranslationEnabled = localStorage.getItem("script_translate") === "enabled";

        // 创建开关的函数
        function createSwitch(settingKey, defaultLabel, enabledLabel, disabledLabel, onChange) {
            const switchContainer = document.createElement("div");
            switchContainer.style.margin = "10px 0";
            switchContainer.style.display = "flex";
            switchContainer.style.alignItems = "center";
            switchContainer.style.padding = "5px";
            switchContainer.style.backgroundColor = "rgb(45, 48, 52)"; // 稍亮的黑灰色
            switchContainer.style.borderRadius = "6px";
            switchContainer.style.border = "1px solid #555";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `script_${settingKey}_switch`;
            checkbox.style.marginRight = "15px";
            checkbox.style.width = "20px";
            checkbox.style.height = "20px";
            checkbox.style.cursor = "pointer";
            checkbox.style.accentColor = "#4CAF50"; // 复选框选中颜色

            const savedState = localStorage.getItem(`script_${settingKey}`) === "enabled";
            // checkbox 是 DOM 元素对象，checkbox.checked 是其状态属性
            checkbox.checked = savedState;

            const label = document.createElement("label");
            label.htmlFor = `script_${settingKey}_switch`;
            label.style.fontSize = "15px";
            label.style.cursor = "pointer";
            label.style.flex = "1";
            label.style.color = "#fff"; // 白色文字
            label.textContent = isTranslationEnabled ? enabledLabel : disabledLabel;

            checkbox.addEventListener("change", function() {
                const isChecked = this.checked;
                localStorage.setItem(`script_${settingKey}`, isChecked ? "enabled" : "disabled");
                if (onChange) onChange(isChecked);
            });

            switchContainer.appendChild(checkbox);
            switchContainer.appendChild(label);
            return switchContainer;
        }

        // 翻译开关
        optionsContainer.appendChild(createSwitch(
            "translate",
            "translation",
            "启用汉化 Enable Chinese translation",
            "Enable Chinese translation",
            function(isChecked) {
                localStorage.setItem("script_translate", isChecked ? "enabled" : "disabled");
                setTimeout(() => location.reload(), 500);
            }
        ));

        // 通知开关
        optionsContainer.appendChild(createSwitch(
            "settings_notifications",
            "notifications",
            "启用通知弹窗",
            "Enable system notification popups"
        ));

        // 废品商店开关
        optionsContainer.appendChild(createSwitch(
            "settings_junk",
            "junk",
            "【废品店】屏蔽 \" 钉子\" && \" 粗塑料\"以外的物品买卖",
            "Hide uncommon item trades in Junk Store"
        ));

        // 升级时间估算开关
        optionsContainer.appendChild(createSwitch(
            "estimate_levelup_time_switch",
            "levelup_time",
            "状态栏显示预计下次人物升级时间（每小时72XP）",
            "Show estimated player upgrade time in status bar (72XP per hour)"
        ));

        // 遠征 ZONE2 需求圖
        // 新增：远征ZONE2需求图开关（核心修改点1：专属开关配置）
        optionsContainer.appendChild(createSwitch(
            "expedition_zone2_icon",
            "zone2_demand", // 补充默认标签参数（原createSwitch函数需要5个参数）
            "【远征ZONE2】显示开启 \" ZONE2 \" 需求图标",
            "【Explored ZONE2】Show ZONE2 item required pics",
            (isChecked, event) => { // 新增event参数，用于判断是否为手动触发
                // 关键修复：只有用户手动点击（而非页面刷新导致的状态恢复）才执行操作
                if (event && event.isTrusted) {
                    if (isChecked) {
                        addPicturesIfNeeded();
                        console.log("ZONE2开关：已启用（手动操作）");
                    } else {
                        const existingIcons = document.querySelectorAll('.tool-icon-container');
                        existingIcons.forEach(icon => icon.remove());
                        window.zone2Observer?.disconnect();
                        console.log("ZONE2开关：已禁用（手动操作）");
                    }
                }
            }
        ));

        // 【新增】Zed 熔炉内嵌废品店小窗口开关
        optionsContainer.appendChild(createSwitch(
            "furnace_junk_store", // 1. 开关唯一标识（存localStorage的键：script_furnace_junk_store）
            "junk_store", // 2. 默认标签（createSwitch函数必填参数，无实际显示作用）
            "【熔炉功能】启用内嵌废品店小窗口", // 3. 中文标签（开启汉化时显示）
            "【Furnace Feature】Enable embedded Junk Store window", // 4. 英文标签（未开启汉化时显示）
        ));

        settingsContainer.appendChild(optionsContainer);

        // 插入到目标容器的下方
        targetContainer.parentNode.insertBefore(settingsContainer, targetContainer.nextSibling);
    }

    // 使用更精确的页面检测
    function initSettingsObserver() {
        if (!window.location.href.includes("zed.city/settings")) {
            return;
        }

        // 等待目标容器加载完成
        const checkContainerLoaded = () => {
            // 使用与 targetContainer 相同的选择器
            return document.querySelector('.q-tabs.row.no-wrap.items-center.q-tabs--not-scrollable.q-tabs--horizontal.q-tabs__arrows--inside.q-tabs--mobile-without-arrows.q-mb-md.submenu');
        };

        if (checkContainerLoaded()) {
            addSettingSwitches();
        } else {
            // 如果容器还没加载完成，等待一下再尝试
            const interval = setInterval(() => {
                if (checkContainerLoaded() && !document.querySelector(".script-settings-container")) {
                    clearInterval(interval);
                    addSettingSwitches();
                }
            }, 500);

            // 10秒后超时
            setTimeout(() => clearInterval(interval), 10000);
        }
    }

    // 监听页面变化
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (location.href.includes("zed.city/settings")) {
                setTimeout(initSettingsObserver, 500);
            }
        }
    });

    urlObserver.observe(document, { subtree: true, childList: true });

    // 页面加载时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSettingsObserver);
    } else {
        initSettingsObserver();
    }

    // 监听SPA路由变化
    const observeUrlChanges = () => {
        let oldHref = document.location.href;
        const body = document.querySelector('body');
        const observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                if (document.location.href.includes("zed.city/settings")) {
                    setTimeout(initSettingsObserver, 300);
                }
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    observeUrlChanges();

    /* 工具方法 */
    function getOriTextFromElement(elem) { //获取元素的 “原始文本”（翻译前内容）
        if (!elem) {
            console.error("getOriTextFromElement: null elem");
            return "";
        }
        const translatedfrom = elem.getAttribute("script_translated_from");
        if (translatedfrom) {
            return translatedfrom.trim();
        }
        return elem.textContent.trim();
    }

    function numberFormatter(num, digits = 1) { // digits 是默认参数，默认保留1位小数
        if (num === null || num === undefined) {
            return null;
        }
        if (num < 0) {
            return "-" + numberFormatter(-num);
        }
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "B" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup
            .slice()
            .reverse()
            .find(function (item) {
                return num >= item.value;
            });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    function timeReadable(sec) {
        if (sec >= 86400) {
            return Number(sec / 86400).toFixed(1) + "天";
        }
        const d = new Date(Math.round(sec * 1000));
        function pad(i) {
            return ("0" + i).slice(-2);
        }
        let hours = d.getUTCHours() ? d.getUTCHours() + ":" : "";
        let str = hours + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
        return str;
    }

    function timeReadableNoSec(sec) {
        if (sec >= 86400) {
            return Number(sec / 86400).toFixed(1) + "天";
        }
        return Number(sec / 3600).toFixed(1) + "h";
    }

    /* 健身房添加勾选锁和Max按钮 */
    const processedElements = new Set();

    const lockElement = (element, isLocked) => {
        element.style.pointerEvents = isLocked ? "none" : "";
        element.style.opacity = isLocked ? "0.5" : "";
    };

    const getCheckboxStates = () => {
        const states = localStorage.getItem("script_gymCheckboxs");
        return states ? JSON.parse(states) : {};
    };

    const saveCheckboxStates = (states) => {
        localStorage.setItem("script_gymCheckboxs", JSON.stringify(states));
    };

    function addGymLocks() {
        const elements = document.querySelectorAll(".grid-cont.text-center.gym-cont");
        const states = getCheckboxStates();

        elements.forEach((element, index) => {
            if (!processedElements.has(element)) {
                // Checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "lock-checkbox";
                checkbox.style.cssText = "position: absolute; bottom: 10px; left: 10px; z-index: 1000; pointer-events: auto;";

                const key = `checkbox-${element.dataset.id || index}`;
                checkbox.checked = states[key] || false;
                lockElement(element, checkbox.checked);

                checkbox.addEventListener("change", () => {
                    const checked = checkbox.checked;
                    lockElement(element, checked);
                    states[key] = checked;
                    saveCheckboxStates(states);
                });

                // Max button
                const maxbtn = document.createElement("button");
                maxbtn.textContent = "Max";
                maxbtn.style.cssText = "position: absolute; bottom: 10px; right: 10px; z-index: 1000; pointer-events: auto;";

                maxbtn.addEventListener("click", () => {
                    const input = element.querySelector("input");
                    let timesOfTraining = Number(localStorage.getItem("script_energy")) / 5;
                    if (timesOfTraining < 1) {
                        timesOfTraining = 1;
                    }
                    // react hack
                    let lastValue = input.value;
                    input.value = timesOfTraining;
                    let event = new Event("input", { bubbles: true });
                    event.simulated = true;
                    let tracker = input._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    input.dispatchEvent(event);
                });

                element.style.position = "relative";
                element.appendChild(checkbox);
                element.appendChild(maxbtn);
                processedElements.add(element);
            }
        });
    }
    setInterval(addGymLocks, 500);

    /* 生产和NPC商店买卖添加Max按钮 */
    function addMaxBuySellButton() {
        const modal = document.querySelector(`.small-modal`);
        if (!modal) {
            return;
        }
        if (modal.querySelector(`.script-store-max-btn`)) {
            return;
        }
        if (!modal.querySelector(`input`)) {
            return;
        }
        const itemStr = modal.querySelector(`.zed-item-img__content img`)?.src;
        if (!itemStr) {
            return;
        }
        const isIronBar = itemStr.includes("/iron_bar");

        modal.style.position = "relative";

        // Max button
        const maxbtn = document.createElement("button");
        maxbtn.className = "script-store-max-btn";
        maxbtn.textContent = "Max";
        maxbtn.style.cssText = "position: absolute; bottom: 10px; right: 10px; z-index: 1000; pointer-events: auto;";
        maxbtn.addEventListener("click", () => {
            const input = modal.querySelector("input");
            // react hack
            let lastValue = input.value;
            input.value = 999999;
            let event = new Event("input", { bubbles: true });
            event.simulated = true;
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
        });
        modal.appendChild(maxbtn);

        // 360 button
        if (window.location.href.includes("/store/junk") && isIronBar) {
            let ironBarStock = Number(localStorage.getItem("script_junkStore_ironBarStock"));
            if (ironBarStock > 360) {
                ironBarStock = 360;
            }
            let limitLeft = Number(localStorage.getItem("script_junkStore_limit_left"));
            let buyNum = ironBarStock > limitLeft ? limitLeft : ironBarStock;

            const btn360 = document.createElement("button");
            btn360.className = "script-store-max-btn";
            btn360.textContent = buyNum;
            btn360.style.cssText = "position: absolute; bottom: 10px; left: 10px; z-index: 1000; pointer-events: auto;";
            btn360.addEventListener("click", () => {
                const input = modal.querySelector("input");
                // react hack
                let lastValue = input.value;
                input.value = buyNum;
                let event = new Event("input", { bubbles: true });
                event.simulated = true;
                let tracker = input._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                input.dispatchEvent(event);
            });
            modal.appendChild(btn360);

            btn360.click();
        }
    }
    setInterval(addMaxBuySellButton, 500);

    /* 拾荒统计 */
    function addScavengeRecords() {
        if (
            !window.location.href.includes("zed.city/scavenge") &&
            !window.location.href.includes("zed.city/exploring") &&
            !window.location.href.includes("zed.city/outposts")
        ) {
            return;
        }
        const insertToElem = document.body.querySelector(".q-page.q-layout-padding");
        if (!insertToElem) {
            return;
        }
        let textElem = document.body.querySelector("#script_scavenge_records");
        if (textElem && textElem.nextSibling) {
            textElem.remove();
            textElem = null;
        }

        const records = JSON.parse(localStorage.getItem("script_scavenge_records"));
        let text = "<br/>【拾荒统计】";
        for (const mapKey in records) {
            text += "<br/>";
            const map = records[mapKey];
            text += dict(map.mapName) + "共" + map.doneTimes + "次：<br/>";
            for (const itemKey in map.itemRewards) {
                text += dict(itemKey) + " x " + map.itemRewards[itemKey] + "<br/>";
            }
        }

        if (!textElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div id="script_scavenge_records" class="script_do_not_translate"><div class="script_do_not_translate" style="font-size: 12px; ">${text}</div></div>`
            );
        } else {
            textElem.innerHTML = `<div class="script_do_not_translate" style="font-size: 12px; ">${text}</div>`;
        }
    }
    setInterval(addScavengeRecords, 500);

    /* 狩猎统计 */
    // 战斗状态：
    // 0. 没有战斗
    // 1. 已 startJob 获取地图
    // 2. 已 getFight 获取怪物
    // 3. 已 doFight 获取掉落
    const pendingFight = { status: 0, mapName1: "", mapName2: "", monsterName: "", winner: "", lootItems: {} };

    function handleHuntingStartJob(response) {
        const jobName = response?.job?.codename;
        if (jobName?.startsWith("job_hunting_")) {
            let mapName1 = jobName.replace("job_hunting_", "");
            mapName1 = mapName1.substring(0, mapName1.length - 2);
            if (mapName1 === "mall") {
                mapName1 = "shopping mall";
            }
            const mapName2 = response?.job?.name;

            if (pendingFight.status !== 0) {
                console.error("handleHuntingStartJob previous status !== 0");
                // console.error(pendingFight);
            }
            pendingFight.status = 1;
            pendingFight.mapName1 = mapName1;
            pendingFight.mapName2 = mapName2;
            pendingFight.monsterName = "";
            pendingFight.winner = "";
            pendingFight.lootItems = {};
            console.log(pendingFight);
        }
    }

    function handleGetFight(r) {
        const response = JSON.parse(r);
        const monsterName = response?.victim?.user?.username;

        if (pendingFight.status !== 1) {
            console.error("handleGetFight previous status !== 1");
            console.error(pendingFight);
            return;
        }
        pendingFight.status = 2;
        pendingFight.monsterName = monsterName;
        console.log(pendingFight);
    }

    function handleDoFight(r) {
        const response = JSON.parse(r);
        if (pendingFight.status !== 2) {
            console.error("handleDoFight previous status !== 2");
            console.error(pendingFight);
            return;
        }
        if (!response?.winner) {
            return;
        }
        pendingFight.status = 3;
        pendingFight.winner = String(response.winner);
        if (response?.loot) {
            for (const item of response.loot) {
                pendingFight.lootItems[item.name] = item.quantity;
            }
        }
        console.log(pendingFight);
        saveFight();
    }

    function saveFight() {
        const records = JSON.parse(localStorage.getItem("script_hunting_records"));
        if (!records.hasOwnProperty(pendingFight.mapName1)) {
            records[pendingFight.mapName1] = {};
        }
        if (!records[pendingFight.mapName1].hasOwnProperty(pendingFight.mapName2)) {
            records[pendingFight.mapName1][pendingFight.mapName2] = { wonTimes: 0, lostTimes: 0, monsters: {} };
        }
        if (!pendingFight.winner.startsWith("npc_")) {
            records[pendingFight.mapName1][pendingFight.mapName2].wonTimes += 1;
        } else {
            records[pendingFight.mapName1][pendingFight.mapName2].lostTimes += 1;
        }

        if (!records[pendingFight.mapName1][pendingFight.mapName2].monsters.hasOwnProperty(pendingFight.monsterName)) {
            records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName] = { wonTimes: 0, lostTimes: 0, itemLoots: {} };
        }
        if (!pendingFight.winner.startsWith("npc_")) {
            records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].wonTimes += 1;
        } else {
            records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].lostTimes += 1;
        }

        for (const item in pendingFight.lootItems) {
            if (!records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].itemLoots.hasOwnProperty(item)) {
                records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].itemLoots[item] = 0;
            }
            records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].itemLoots[item] += Number(
                pendingFight.lootItems[item]
            );
        }

        localStorage.setItem("script_hunting_records", JSON.stringify(records));
        console.log(records);

        if (pendingFight.status !== 3) {
            console.error("saveFight previous status !== 3");
            console.error(pendingFight);
        }
        pendingFight.status = 0;
        pendingFight.mapName1 = "";
        pendingFight.mapName2 = "";
        pendingFight.monsterName = "";
        pendingFight.lootItems = {};
    }

    function addHuntingRecordsToPage() {
        if (!window.location.href.includes("zed.city/hunting")) {
            return;
        }
        const insertToElem = document.body.querySelector(".q-page.q-layout-padding div");
        if (!insertToElem) {
            return;
        }
        const textElem = document.body.querySelector("#script_hunting_records");

        const records = JSON.parse(localStorage.getItem("script_hunting_records"));
        let text = "【狩猎统计】<br/>";
        for (const map1Key in records) {
            text += "<br/>";
            text += dict(map1Key) + "<br/>";
            for (const map2Key in records[map1Key]) {
                const map = records[map1Key][map2Key];
                text += "---- [" + dict(map2Key) + "]<br/>";
                for (const monsterKey in map.monsters) {
                    text +=
                        "-------- " +
                        dict(monsterKey) +
                        "（" +
                        map.monsters[monsterKey].wonTimes +
                        "/" +
                        map.monsters[monsterKey].lostTimes +
                        "）<br/>";
                    for (const itemKey in map.monsters[monsterKey].itemLoots) {
                        text += "++++++++ " + dict(itemKey) + " x " + map.monsters[monsterKey].itemLoots[itemKey] + "<br/>";
                    }
                }
            }
        }

        if (!textElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div id="script_hunting_records" class="script_do_not_translate"><div class="script_do_not_translate" style="font-size: 12px; ">${text}</div></div>`
            );
        } else {
            textElem.innerHTML = `<div class="script_do_not_translate" style="font-size: 12px; ">${text}</div>`;
        }
    }
    setInterval(addHuntingRecordsToPage, 500);

    /* ZedTools END */

    const unmatchedTexts = [];

    const excludes = ["K", "M", "B", "D", "H", "S", "Lv", "MAX", "wiki", "discord", "XP", "N/A", "x"];

    const excludeRegs = [
        // 一个字母都不包含
        /^[^a-zA-Z]*$/,
        // 版本号
        /^v\d+\.\d+\.\d+$/,
        /^Alpha V\d+\.\d+\.\d+$/,
        // 含中文
        /[\u4e00-\u9fff]/,

    ];

    /* 词典开始 感谢七包茶整理 */

    //1.1 通用頁面
    const dictCommon = {
        "free refills from your inactivity": "次免费补充能量,因不活跃而获得的",
        "Offline for maintenance": "离线维护中",
        "You gained": "你获得了",
        purge: "大清洗",
        stronghold: "据点",
        Faction: "帮派",
        Factions: "帮派",
        City: "城市",
        Inventory: "背包",
        Quests: "任务",
        Hunt: "狩猎",
        Hunting: "狩猎",
        Scavenge: "拾荒",
        Explore: "远征",
        Skills: "技能",
        Help: "帮助",
        Build: "建造",
        "Unlock at level": "解锁等级",
        Version: "版本",
        "Release Notes": "更新日志",
        Forums: "论坛",
        "Report Bug": "报告错误",
        Mission: "任务",
        "Upcoming Server Reset and Open Release": "即将到来的服务器重置与公开发布",
        "load more": "加载更多",
        "Final Reset": "最终重置",
        train: "训练",
        "Go Back": "返回",
        ATTEMPTS: "尝试",
        SUCCESS: "成功",
        FAILS: "失败",
        "Loot Discovered": "发现战利品",
        "Unknown Loot": "未知战利品",
        "Loot Found Recently": "最近找到的战利品",
        "Total Loot Discovered": "发现的战利品总数",
        Discoverable: "可发现物品",
        "Min Level": "最低等级",
        Take: "拿取",
        "Take Item": "拿取物品",
        "Add Items": "添加物品",
        Upgrade: "升级",
        Regen: "回复",
        "Per 15 Min": "每15分钟",
        Recovery: "恢复",
        Upgrading: "升级中",
        "YOU LEVELED UP": "你升级了",
        "You need to be level": "你需要达到等级",
        LVL: "等级",
        Menu: "菜单",
        Submit: "提交",
        energy: "能量",
        Quantity: "数量",
        Cancel: "取消",
        remove: "移除",
        "Social Logins": "社交帐号登录",
        "An unknown error occurred": "发生未知错误",
        "Help Guide": "帮助",
        Equip: "装备",
        "Equip Item": "装备物品",
        "No Items": "没有物品",
        "Are you sure you want to equip this": "你确定要装备这个吗",
        "Item has been equipped": "物品已装备",
        Unequip: "卸下",
        Drink: "饮用",
        "Unequip Item": "卸下物品",
        "Are you sure you want to unequip this": "你确定要卸下这个吗",
        "Item has been unequipped": "物品已卸下",
        "Are you sure you want to cancel": "你确定要取消吗",
        "Are you sure you want to drink this": "你确定要喝这个吗",
        "Booster Cooldown": "增强剂冷却时间",
        Use: "使用",
        "Consume Item": "消耗物品",
        "Are you sure you want to use this": "你确定要使用这个吗",
        "Medical Cooldown": "医疗冷却时间",
        Eat: "吃",
        "Are you sure you want to eat this": "你确定要吃这个吗？",
        "Your booster cooldown is too high": "你的强化剂冷却时间太高了",
        "Canvas is not supported in your browser": "你的浏览器不支持Canvas",
        "Zed City | The Survival MMORPG": "Zed City | 生存MMORPG",
        "Switch Chat Room": "切换聊天室",
        Global: "全球",
        "Global discussion": "全球讨论",
        "Discuss trading strategies and tips": "讨论交易策略与技巧",
        Beginners: "新手",
        "Get help and support": "获取协助和支持",

        //----------------/ 登入首頁
        "Zed City": "Zed City",
        "Create Account": "创建账户",
        News: "新闻",
        "Can You Survive": "你能生存吗",
        "Play Now": "立即游戏",
        "Learn More": "了解更多",
        "Deep Exploration": "深度探索",
        "Explore dark and infested locations around the map, working through each challenge and unlocking the next rooms until you find the supplies you're in need of to survive":
            "探索地图上黑暗且感染的地点，完成每个挑战并解锁下一间房间，直到找到你需要的生存物资。",
        "Your Stronghold": "你的据点",
        "Develop your stronghold into a fully equipped base, with crafting stations, resources, and everything you need to thrive":
            "将你的据点发展成一个设施齐全的基地，配备制作站、资源和一切你需要的物资。",
        Alliances: "联盟",
        "Join forces with factions, building alliances and growing alongside other survivors": "与帮派联手，建立联盟，与其他幸存者共同成长。",
        "PvP Dominance": "PvP主宰",
        "Face off against other players in high-stakes PvP encounters to prove your dominance":
            "在高风险的PvP对战中与其他玩家对决，证明你的主宰地位。",
        "Trade and Prosper": "交易与繁荣",
        "Trade goods and rare items with others to grow your influence and wealth": "与他人交易商品和稀有物品，扩大你的影响力和财富。",
        "Blueprint Mastery": "蓝图精通",
        "Discover and craft blueprints to expand your abilities and customize your approach": "发现并制作蓝图，拓展你的能力，定制你的策略。",
        "Skillful Survival": "熟练的生存",
        "Shape your path by mastering skills like fishing, hunting, and many others essential for survival":
            "通过掌握钓鱼、狩猎等多种生存技能，塑造你的生存之路。",
        "We have a growing community on discord and would love for you to join us in creating the best Multiplayer Zombie Survival Simulator":
            "我们在Discord上有一个不断壮大的社区，欢迎你加入我们，共同打造最好的多人丧尸生存模拟器。",
        "This website uses cookies": "本网站使用 Cookie",
        "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services":
            "我们使用 Cookie 来个性化内容和广告，提供社交媒体功能并分析我们的流量。我们还会与社交媒体、广告和分析合作伙伴分享您对我们网站的使用信息，这些信息可能与您提供给他们的信息或他们从您使用其服务中收集的信息相结合。",
        "Allow All": "全部允许",
        Deny: "拒绝",
        "Privacy Policy": "隐私政策",
        "Terms of Service": "服务条款",
        "Green Lab Games Ltd": "Green Lab Games有限公司",

        //----------------/ 個人
        "Logging Out": "登出",
        "Alpha in progress": "Alpha 测试进行中",
        "Join the discussion": "加入讨论",
        "We are currently in a closed alpha stage, you can get an access code from our discord server. We have a growing community on discord and would love for you to join us in creating the best Multiplayer Zombie Survival Simulator":
            "我们目前处于封闭的 Alpha 测试阶段，您可以通过我们的 Discord 服务器获取访问代码。我们在 Discord 上有一个不断壮大的社区，非常希望您加入我们，一起打造最好的多人丧尸生存模拟游戏",
        Register: "注册",
        Password: "密码",
        "Access Code": "访问代码",
        "You can request an access code on our discord server": "您可以在我们的 Discord 服务器上请求访问代码",
        "Sign in with Discord": "通过Discord登录",
        "Create a Survivor": "创建幸存者",
        "I agree to the Terms of Service": "我同意服务条款",
        "You must only register one account per person": "每人只能注册一个账户。",
        "Survivor Name": "幸存者名称",
        "Continue Playing": "继续游戏",
        "Display Name": "显示名称",
        "This field is required": "此字段为必填项",
        "Forgot password": "忘记密码",
        "Recover Password": "找回密码",
        Recover: "找回",
        "Remember Me": "记住我",
        "Player Profiles": "玩家资料",
        "Role Name": "角色名称",
        "Your avatar has been updated": "您的头像已更新",
        "Role Updated": "角色已更新",
        "Membership Expires": "会员到期",
        Notifications: "通知",
        Messages: "信件",
        "No activity found": "无活动日志",
        am: "上午",
        pm: "下午",
        "View Profile": "查看个人资料",
        "Activity Logs": "行动日志",
        "No activity logs found": "当前无行动日志",
        Settings: "设置",
        Logout: "登出",
        Online: "在线",
        Level: "等级",
        "Days Survived": "生存天数",
        Location: "位置",
        "Update Avatar": "更新头像",
        Update: "更新",
        Inbox: "邮箱",
        "Update Email": "更新电子邮件",
        Email: "电子邮件",
        mail: "信件",
        "Update Password": "更新密码",
        "Current Password": "当前密码",
        "New Password": "新密码",
        "Repeat Password": "重复密码",
        "Blocked Users": "已屏蔽用户",
        "No blocked users found": "无屏蔽用户",

        //----------------/ 戰鬥日誌
        "Opponent": "对手",
        "Outcome": "结果",
        "DATE": "日期",
        "ACTION": "行动",

        //----------------/ 會員
        "Membership Perks": "会员特权",
        "Recieve a special item drop every month": "每月获得一个特殊物品掉落",
        "Monthly Membership": "月度会员",
        "Yearly Membership": "年度会员",
        "Months Free": "免费月份",
        "Zed Pack": "丧尸包",
        "Donator Pack": "捐赠者礼包",
        "Effect: Contains 31 days membership, 75 Zed Coin and a random loot drop": "效果：包含31天会员资格、75丧尸币和一个随机掉落物",
        "All payments are secured with SSL encryption": "所有支付均通过 SSL 加密保障安全",
        Discount: "折扣",
        GBP: "英镑",
        USD: "美元",
        EUR: "欧元",
        "C$ CAD": "加元",
        "Each Zed Pack contains": "每个丧尸包包含",
        "Your membership will expire in": "您的会员将在",
        "a month": "一个月后到期",
        "You already have an active membership": "你已经拥有会员资格",
        "Unlock with membership": "会员解锁",
        "Days Membership": "天会员",
        Tradable: "可交易",
        "You gained 31 days membership and 75 points": "你获得了 31 天会员资格和 75 积分",
        "Refill Energy": "补充能量",
        "Refill Rad Immunity": "补充辐射免疫力",
        "Your rad is already full": "你的辐射值已经满了",
        "Your energy has been refilled": "你的能量已经重新填充",
        "RESET SKILL PERKS": "重置技能",
        "Radio Tower Slot": "无线电塔槽位",
        "Market Listing Slot": "市场挂单槽位",
        "Starter Pack": "新手礼包",
        "Receive 4 random equipable Ranger items with XP traits": "获得 4 种随机可装备的游侠物品，这些物品带有经验值（XP）特质。",
        "Vehicle Rigs": "挂车",
        "Unlock Rigs for your vehicle": "车辆解锁挂车",

        Refill: "补充",
        PURCHASE: "购买",
        Membership: "会员",
        "You can only buy 1 skill point per level": "每1个等级只能购买1个技能点",
        "Skill point added successfully": "已成功增加技能点",
        Deals: "优惠",
        Back: "返回",
        FREE: "免费",
        "Market Deals": "市场优惠",
        "Membership lasts 31 days and is free during alpha": "会员将持续31天，并且在Alpha测试中是免费的",
        "Max Energy": "最大能量",
        "Energy Regeneration Rate": "能量恢复速度",
        "Receive Special Items Monthly": "每月获取特殊物品",
        "Support Us": "支持我们",
        "Everything is free during alpha": "在Alpha测试中，一切都是免费的",
        "If you'd like to support us and help with server and development costs, you can use the button below":
            "如果您愿意支持我们，帮助支付一些托管和开发费用，您可以使用下面的按钮",
        "Membership will last 31 days and is": "会员有效期为31天，并且是",
        "FREE in Alpha": "在Alpha阶段免费",
        "Energy Regeneration Speed": "能量恢复速度",
        "Recieve a special items every month": "每月接收一个特殊物品",
        "During alpha everything will be": "在Alpha阶段，一切都将是",
        "If you wish to support us by helping to cover some hosting & development costs, you can use the button below":
            "如果你希望通过帮助覆盖一些主机和开发费用来支持我们，可以使用下面的按钮。",

        //----------------/ 城市
        Trading: "交易",
        "Donator House": "捐赠者之家",
        Market: "市场",
        "Your Items": "你的物品",
        Trades: "交易",
        "View Trade": "查看交易",
        "View Activity": "查看活动",
        "Write your message": "输入讯息",
        "Write your message...": "输入讯息",
        Finalizing: "最终确定",
        "Player Trades": "玩家交易",
        "Active Trades": "当前交易",
        "Find survivor": "搜寻生存者",
        "No active trades found": "当前无交易",
        "Start Trade": "开始交易",
        "Trade History": "交易历史",
        "Are you sure you want to accept this trade": "您确定要接受这笔交易吗",
        "ACCEPT TRADE": "接受交易",
        "Trade not found": "未找到交易",
        "Finished Trading": "交易完成",
        "Finalize Trade": "最终确定交易",
        Expired: "已过期",
        Cancelled: "已取消",
        "Are you sure you want to finalize this trade": "您确定要完成这笔交易吗",
        "Warning: Double-check the trade to avoid scams": "警告：请再次检查交易以避免诈骗",
        "Trades are final and cannot be reversed": "交易一旦完成不可撤销",
        Info: "信息",
        "Hall Of Fame": "名人堂",
        "Top Crafter": "顶级工匠",
        "Top Forger": "顶级锻造者",
        "Top Hunter": "顶级猎人",
        "Top Scavenger": "顶级拾荒者",
        "City Stats": "城市统计",
        Survivors: "幸存者",
        Survivor: "幸存者",
        Retail: "零售",
        Glockbuster: "Glock杀手",
        "Junk Store": "废品店",
        "Clothes Weaver": "服裝店",
        Toolsmith: "工具店",
        "Zed Mart": "丧尸商场",
        "Rig Stop": "挂车店",
        "Premium Store": "会员商场",
        Premium: "会员",
        Store: "商店",
        Incinerator: "焚烧炉",
        Search: "搜索",
        ID: "ID",
        "No survivors found": "未找到幸存者",
        Referrals: "推荐",
        "Referral Points": "推荐积分",
        "Referral Store": "推荐商店",
        "Referral Rewards": "推荐奖励",
        Registered: "已注册",
        "Earn rewards when your referred players reach these gym level milestones": "当您推荐的玩家达到这些健身房等级里程碑时，您将获得奖励",
        "Rewards are paid out each day at midnight": "奖励发放於午夜时的",
        "Share your referral link with friends": "与朋友分享您的推荐链接",
        "Refer a Friend": "邀请好友",
        "Copy to clipboard": "复制到剪贴板",
        "copied": "已复制",

        //----------------/ 市場狀態(購買,上架)
        Buy: "购买",
        Sell: "出售",
        "Not enough items in stock": "库存不足",
        "Limit Reset": "限购重置",
        "You have reached your hourly buy limit": "您已达到每小时购买限制。",
        "Trades expire in": "交易刷新于",
        "Trade Completed": "交易完成",
        Trade: "交易",
        "Something went wrong": "出错了",
        "Market Offers": "市场报价",
        "Market Listings": "市场上架",
        "Create Listing": "创建上架",
        Select: "选择",
        Price: "价格",
        Offers: "在售订单",
        "fee will be deducted from the sale price": "费用将从销售价格中扣除",
        "Create Offer": "创建报价",
        "Your market offer has been created": "你的市场报价已创建",
        "Are you sure you want to remove this market listing": "你确定要移除这个市场上架吗",
        "Remove Listing": "移除上架",
        "You cannot buy your own item": "你不能购买自己的物品",
        "Item not found": "未找到物品",
        "Invalid price": "价格无效",
        "Offer not found": "未找到在售订单",
        "You have reached your buy limit": "已达购买上限",

        //----------------/ 物品狀態(重量,類型)
        Weight: "重量",
        kg: "千克",
        Weapons: "武器",
        Armour: "护甲",
        Resources: "资源",
        Ammo: "弹药",
        Medical: "医疗",
        Boosters: "增强剂",
        Equipment: "装备",
        Misc: "杂项",
        Login: "登录",
        "Weapon (Ranged)": "武器（远程）",
        "Weapon (Ranged": "武器（远程）",
        Durability: "耐久度",
        Condition: "状况",
        Attack: "攻击",
        Accuracy: "精度",
        Type: "类型",
        "Fire Rate": "射速",
        Weapon: "武器",
        Piercing: "穿刺",
        "Ammo Type": "弹药类型",

        //----------------/ 戰鬥狀態
        Fight: "战斗",
        "Auto Attack": "自动攻击",
        "Run Away": "逃跑",
        "Fight Log": "战斗日志",
        "started an attack on": "开始攻击",
        Fists: "拳头",
        missed: "未击中",
        "with their": "用",
        "tried to bite": "试图咬",
        "but missed": "但未击中",
        hit: "击中",
        "and took": "并造成",
        "used its teeth to bite": "用牙齿咬",
        "Stop Auto": "停止自动攻击",
        "was defeated by": "被击败于",
        INJURED: "受伤",
        "Fight Outcome": "战斗结果",
        "You are injured for": "你受伤",
        "You are injured": "你受伤了",
        DEFEATED: "击败",
        VS: "VS",
        WINNER: "胜利",
    };

    //1.2 幫派
    const dictFaction = {
        "Create Faction": "创建帮派",
        "No factions found": "未找到帮派",
        "Faction Name": "帮派名称",
        "Total Factions": "全部帮派",
        Create: "创建",
        "Please enter a faction name": "请输入帮派名称",
        "Faction Roles": "派系角色",
        "Daily Rations": "每日配给",
        "Join Faction": "加入帮派",
        Apply: "申请",
        "You have a pending application": "你有一个待处理的申请",
        "You need to wait before joining a raid": "你需要等待一段时间才能加入突袭",
        "You can raid again in": "下次突袭时间",
        "You do not have access": "你没有权限",
        "You need to wait before starting a raid": "你需要等待一段时间才能开始突袭",
        Ready: "就绪",
        "Start Raid": "开始突袭",
        Camp: "营地",
        Storage: "仓库",
        Farm: "农场",
        Quarry: "采石场",
        "Brick Factory": "砖厂",
        temple: "寺庙",
        "A patch of slightly fertile soil": "一块稍微肥沃的土壤",
        Distillery: "酒厂",
        Refinery: "精炼厂",
        "Large Furnace": "大型熔炉",
        "Rusty machine that smells of fish oil and burnt plastic": "一台生锈的机器，散发着鱼油和烧焦塑料的味道",
        "Faction Base": "帮派基地",
        Base: "基地",
        Raid: "袭击",
        Raids: "突袭",
        View: "查看",
        Setup: "筹备",
        Activity: "活动日志",
        Rank: "排名",
        Members: "成员",
        Respect: "声望",
        "Camp Upgrade": "营地升级",

        "Active Raids": "活跃袭击",
        "Awaiting Team": "等待团队",
        "Team Size": "团队大小",
        "Raid a Farm": "袭击农场",
        "Raid a Hospital": "袭击医院",
        "Raid a Store": "袭击商店",

        Farmers: "农民",
        "Farm Items": "耕作物品",
        "Team Efficiency": "团队效率",
        "Farming Barley": "种植大麦",
        "Total Time Left": "剩余总时间",
        "Items Farmed": "耕种的物品",
        "Items Distilled": "蒸馏的物品",
        "Distilling Beer": "蒸馏啤酒",
        Distillers: "蒸馏器",
        "Distill Items": "蒸馏物品",
        refiners: "精炼器",
        "Complete upgrade to access workers": "完成升级以解锁工人",
        "Extract Materials": "提取材料",
        "Refine Oil": "精炼油",
        Craft: "制作",
        "Extract Oils": "提取油料",
        "Refine Plastic": "精炼塑料",

        "Faction Activity": "帮派活动",
        "Setup Raid a Farm": "筹备突袭农场",
        "Set up Raid on Farm": "筹备袭击农场",
        "Are you sure you want to set up raid on farm?": "你确定要筹备袭击农场吗",
        "Are you sure you want to setup Raid a Farm": "你确定要筹备突袭农场吗",
        Team: "团队",
        Empty: "空",
        Join: "加入",
        "Are you sure you want to cancel this raid": "你确定要取消这次突袭吗",
        Abort: "中止",

        "Setup Raid a Hospital": "筹备突袭医院",
        "Are you sure you want to setup Raid a Hospital": "你确定要筹备突袭医院吗",
        "You are already in a raid": "你已经在一次突袭中",
        "Setup Raid a Store": "筹备突袭商店",
        "Are you sure you want to setup Raid a Store": "你确定要筹备突袭商店吗",
        "Are you sure you want to join this raid": "你确定要加入这次突袭吗",
        "You are already assigned to another activity": "你已经分配到另一个活动中",
        "Join Raid": "加入突袭",
        "Cancel Raid": "取消袭击",
        "Raids Completed": "已完成的突袭",
        "Complete Raid": "完成袭击",
        "Add Role": "添加角色",
        "Create Role": "创建角色",
        Roles: "角色",
        Edit: "编辑",
        "Item added to your inventory": "物品已添加到你的库存",

        //----------------/ 權限
        "Manage Member": "管理成员",
        Kick: "踢出",
        Permissions: "权限",
        Management: "管理",
        Applications: "申请",
        ACCEPT: "接受",
        DECLINE: "拒絕",
        "Accept Application": "接受申請",
        "Manage Roles": "管理角色",
        "Update Role": "更新角色",
        Status: "状态",
        Role: "角色",
        Leader: "领导者",
        Manage: "管理",
        Rations: "配给",
        "Add Rations": "添加配给",
        "Add Item": "添加物品",
        "Allows the player to oversee and manage the agricultural activities within the community. They can start new crops and manage workers":
            "允许玩家监督和管理社区内的农业活动。他们可以种植新作物并管理工人",
        "Distillery Management": "酿酒厂管理",
        "Gives the player the authority to oversee and manage the distillery operations. They can produce beverages and manage workers":
            "赋予玩家监督和管理酿酒厂运作的权限。他们可以生产饮品并管理工人",
        "Refinery Management": "精炼厂管理",
        "Allows the player to oversee and manage the refinery activities within the community. They can start new refining processes and manage workers":
            "允许玩家监督和管理社区内的精炼活动。他们可以启动新的精炼流程并管理工人",
        "Storage Management": "仓库管理",
        "Allows the player to take items from the faction storage": "允许玩家从派系仓库取物品",
        "Manage Raids": "管理突袭",
        "Gives the player the authority to cancel raids and remove players from pending raids": "赋予玩家取消突袭和移除待处理突袭中玩家的权限",
        "Manage Applications": "管理申请",
        "Grants the ability to accept or decline applications": "授予接受或拒绝申请的能力",
        "Manage Buildings": "管理建筑",
        "Allows the player to initiate upgrades on any building with resources allocated from the faction storage":
            "允许玩家使用派系仓库分配的资源启动任何建筑的升级",
        Member: "成员",
        "Grants the ability to kick members from the faction. The leader can not be kicked": "授予踢出派系成员的权限。领导者不能被踢出",
        Administrator: "管理员",
        "Gives the player full access to all permissions": "赋予玩家对所有权限的完全访问权限",
        "TRANSFER OWNERSHIP": "转让所有权",
        "This action cannot be undone": "此操作无法撤销",
        "You do not have permission to manage roles": "您没有管理角色的权限",
        TRANSFER: "转让",
        "Faction Profile": "帮派资料",
        Gameplay: "游戏玩法",

        //----------------/ 傳承跟日誌(待補充)
        "Active Effects": "当前效果",
        Legacy: "传承",
        Survivalists: "生存者",
        Influence: "影响力",
        "Active a day ago": "一天前活跃",
        "Faction Legacy": "派系传承",
        Requirements: "要求",
        Hunters: "猎人",
        "Hunting Energy Cost": "狩猎能量消耗",
        "Switch Legacy": "切换传承",
        cost: "成本",
        Industrialists: "工业家",
        "Worker Efficiency": "工人效率",
        Active: "活跃",
        Warlords: "军阀",
        Traders: "商人",
        "Market Tax": "市场税率",
        Filter: "筛选",
        "Select faction member": "选择派系成员",
        "Filter activity type": "筛选活动类型",
        "Are you sure you want to choose this legacy": "您确定要选择此传承吗",
        CONFIRM: "确认",

    };

    //1.3 專家
    const dictExperts = {

        experts: "专家",

        //----------------/ 車輛專家
        "vehicle expert": "车辆专家",
        "This zone is locked": "此区域已锁定",
        "Restore the workshop": "修复车间",
        "Repair Mechanics Bench": "修理机械工作台",
        "Repair Jacks": "修理千斤顶",
        "Refill Supplies": "补充物资",
        "Repair": "修理",
        Finish: "完成",
        "Provide Power to the Generator": "为发电机供电",
        "Refill Backup Generator": "给备用发电机加注燃料",
        "Experts Services": "专家服务",
        "Purchase Turbo": "购买涡轮增压器",
        "Purchase Tires": "购买轮胎",
        "Manufacture Racing Tire": "制造赛车轮胎",
        "Manufacture Robust Tire": "制造坚固轮胎",
        "Start": "启动",
        "Manufacture Bulky Turbo": "制造大型涡轮增压器",
        "Manufacture Inline Turbo": "制造直列涡轮增压器",
        "Construct an unloading bay": "建造卸货区",
        "Build Unloading Bay": "建造卸货区",
        "Construct Empty Fuel Container": "建造空燃料容器",
        "Process Fuel Container": "处理燃料容器",

        //----------------/ 装备专家
        "Equipment Expert": "装备专家",
        "Repair Tooling Table": "维修工具台",
        "Repair Power Tools": "维修电动工具",
        "Stronghold Defense Kits": "据点防御套件",
        "Fabricate Defense Kit": "制造防御套件",
        "Fabricate": "制造",
        "Provide Equipment for Analysis": "提供分析用的设备",
        "Low cost tool analysis": "低成本工具分析",
        "Mid cost tool analysis": "中成本工具分析",
        "High cost tool analysis": "高成本工具分析",
        "Transform": "转换",
        "Max Mods": "最大模组数",
        "Durability Upgrades": "耐用性升级",
        "Harden Tool": "硬化工具",
        "Reinforce Tool": "加固工具",
        "Temper Tool": "调质处理工具",

        //----------------/ 盔甲专家
        "Armour Expert": "盔甲专家",
        "Repair Loom": "修理织布机",
        "working area": "工作区",
        "Provide armour for analysis": "提供盔甲分析",
        "Repair Tooling Table": "维修工具台",
        "Low cost armour analysis": "低成本盔甲分析",
        "Mid cost armour analysis": "中成本盔甲分析",
        "High cost armour analysis": "高成本盔甲分析",
        "Extra Lining": "额外内衬",
        "Extra Padding": "额外填充物",
        "Hardened Padding": "硬化填充物",
        "Durability Upgrades": "耐用性升级",
        "Speed Upgrades": "速度升级",
        "Weak Light Lining": "初级光内衬",
        "Lesser Light Lining": "中级光内衬",
        "Greater Light Lining": "高级光内衬",
        "Agility Upgrades": "敏捷性升级",
        "Weak Nimble Lining": "初级灵活内衬",
        "Lesser Nimble Lining": "中级灵活内衬",
        "Greater Nimble Lining": "高级灵活内衬",
        "Defense Upgrades": "防御性升级",
        "Weak Reinforcement": "初级加固",
        "Lesser Reinforcement": "中级加固",
        "Greater Reinforcement": "高级加固",
        "Strength Upgrades": "力量性升級",
        "Weak Double Lining": "初级双层内衬",
        "Lesser Double Lining": "中级双层内衬",
        "Greater Double Lining": "高级双层内衬",

        //----------------/ 武器专家
        "Weapons Expert": "武器专家",
        "Repair Drill Press": "维修钻床",
        "Repair Reloading Bench": "维修装弹工作台",
        "Provide weapons for analysis": "提供武器以供分析",
        "Low cost weapon analysis": "低成本武器分析",
        "Mid cost weapon analysis": "中成本武器分析",
        "High cost weapon analysis": "高成本武器分析",
        "Harden Weapons": "强化武器",
        "Reinforce Weapon": "加固武器",
        "Temper Weapon": "淬炼武器",
        "Attack Upgrades": "攻击力升级",
        "Basic Attack": "基础攻击力",
        "Intermediate Attack": "中级攻击力",
        "Advanced Attack": "高级攻击力",
        "Accuracy Upgrades": "精准度升级",
        "Agility Upgrades": "敏捷度升级",
        "Basic Accuracy": "基础精准度",
        "Intermediate Accuracy": "中级精准度",
        "Advanced Accuracy": "高级精准度"


        };

    //1.4 地點
    const dictPlace = {
        gym: "健身房",
        "Medical Bay": "医疗间",
        "Crafting Bench": "制作台",
        Furnace: "熔炉",
        Kitchen: "厨房",
        "Grill": "烤架",
        "Radio Tower": "无线电塔",
        "Weapon Bench": "武器台",
        "Ammo Bench": "弹药台",
        "Armour Bench": "盔甲台",
        "Materials Bench": "材料工作台",
        "Tech Lab": "科技实验室",
        "Chem Bench": "化学工作台",
        "Coal Auto Mine": "煤炭自动矿机",
        "Iron Auto Mine": "铁矿自动矿机",
        Garage: "车库",

        Arcade: "游戏厅",
        "Darkened Restrooms": "昏暗洗手间",
        "Concession Stand": "小吃摊",
        "Arcade Office": "游戏厅办公室",
        "Hall of Mirrors": "镜厅",

        Cinema: "电影院",
        "Maintenance Room": "维修室",
        "Projection Room": "放映室",
        "Ticket Booths": "售票亭",
        "Main Theater Room": "主剧院室",

        "Shopping Mall": "购物中心",
        "Parking Lot": "停车场",
        "Central Atrium": "中央中庭",
        "Food Court": "美食广场",
        "Sports Store": "体育用品店",

        Warehouse: "仓库",
        "Loading Bay": "装载区",
        "Storage Area": "储藏区",
        "Chemical Storage": "化学品储存",
        "Boiler Room": "锅炉房",

        Restaurant: "餐馆",
        "Dining Area": "餐饮区",
        Restrooms: "洗手间",
        "Wine Cellar": "酒窖",
        "Kitchen Area": "厨房区",

        Wasteland: "荒原",
        "Toxic Dump Site": "有毒垃圾场",
        "Sewage Plant": "污水处理厂",
        Overpass: "天桥",
        "Sector-Z": "Z区",

        "Buddys Compound": "Buddy的营地",
        "Main Wall": "主墙",
        "Courtyard": "庭院",

        "Abandoned Cabin": "废弃小屋",
        "Coal Mine": "煤矿",
        Scrapyard: "废料场",
        "Iron Mine": "铁矿场",
        Forest: "森林",
        "Hunters Shack": "猎人小屋",
        Marshlands: "沼泽地",
        Lake: "湖泊",
        "Gas Station": "加油站",
        "Abandoned House": "废弃小屋",
        "Car Factory": "汽车工厂",

        "Police HQ": "警察总部",
        Armory: "军械库",
        Foyer: "大堂",

        // 說明
        "Gym upgrade": "健身房升级",
        "Medical Bay Upgrade": "医疗间升级",
        "Upgrade Radio Tower": "升级无线电塔",
        "Train your stats to become more effective in combat": "训练你的属性，以在战斗中更有效",
        "Heal to attack more crawlers": "治疗以攻击更多爬行者",
        "A crafting bench is a sturdy table where manual work is done": "制作工作台是一个坚固的桌子，用来进行手工制作",
        "Unlock Stronghold Slot": "解锁据点槽位",
        "Hot enough to melt things": "热度足以融化物品",
        "View All Recipes": "查看所有菜单",
        "Hot enough to cook things": "热度足以烹饪食物",
        "Fabricate firearms": "制造枪械",
        "For packin heat": "装填火药",
        "Designer and craft designer outfits": "设计并制作设计师服装",
        "Complete building to access": "完成建筑以访问",
        "Unlock more slots": "解锁更多槽位",
        "You should proceed when properly supplied": "建议筹备充足后再进行建造",
        "You already have": "你已擁有",
        "Craft and refine raw materials into more advanced components": "将原材料制作并提炼成更高级的部件",
        "Recycle and manufacture technical gadgets": "回收并制造科技小装置",
        "Combine ingredient to produce powerful boosters": "融合原料以制作强效增强剂",
        "Effect Duration": "效果持续时间",
        "Mines Coal automatically": "自动开采煤炭",
        "Mines Iron Ore automatically": "自动开采铁矿石",

        "Blueprint": "蓝图",
        "Create Bandage": "制作绷带",
        "Create Small Med Kit": "制作小型医疗包",
        "Create Med Kit": "制作医疗包",
        "Forge Nails": "锻造钉子",
        "Smelt Scrap": "熔炼废铁",
        "Smelt Iron Ore": "熔炼铁矿",
        "Smelt Steel": "熔炼钢铁",
        "Burn Coal": "烧煤",
        "Craft Cloth Pants": "制作布裤",
        "Craft Cloth Jacket": "制作布夹克",

        // 熔炉
        "Deploy Defense Kit": "部署防御套件",

        // 烹飪
        "Cooking Cooked Fish": "烹饪熟鱼",
        "Hardened Skin":"硬化皮肤",
        "Bolstered": "增强",
        "Hard Working": "勤奋",

        // 科技实验室
        "Recycle Splicer": "回收熔接机",
        "Bulk Recycle Tech": "批量回收科技产品",
        "Combine Boards": "合并主板",
        "Salvage Screen": "回收屏幕",
        "Salvage Radio": "回收收音机",
        "Salvage Remote": "回收遥控器",

        // 化学工作台
        "Boosted Immunity": "免疫力增强",
        "Boosted Working": "工作效率提升",
        "Boosted Weight": "负重增加",
        "Boosted XP": "经验值提升",

        "You fished the Lake and caugh": "你在湖泊里钓了鱼并且钓到了",
        "You fished the Lake but didn't manage to find anything": "你在湖泊里钓了鱼，但什么也没钓到。",
    };

    //----1.4.1 天氣
    const dictWeather = {

        "Toxic Fallout" : "毒性沉降",
        "Chemical Bliss": "化学愉悅",
        "Clean Air": "纯净空气",
        "Lurcher Gases": "腐坏气体",
        "Electric Sky": "导电天候",
        "Acid Rain": "酸雨",
        "Adrenaline Gases": "肾上腺素气体",
        "Chlorine Air": "氯气",
        "Soothing Aroma": "舒缓的香气",
        "Smog Cloud": "雾霾",
        "Lurcher Stench": "猎犬恶臭",
    };

    //1.5 庫存
    const dictInventory = {
        Miscellaneous: "杂项",
        Rig: "挂车",
        Rigs: "挂车",
        parts: "零件",
    };

    //----1.5-1 武器
    const dictWeapon = {
        "Weapons (melee": "武器（近战）",
        "Weapons (ranged": "武器（远程）",
        "Baseball Bat": "棒球棒",
        Spear: "长矛",
        Bow: "弓",

        // 槍類
        Handmade: "手工手枪",
        Handgun: "手枪",
        Pistol: "手枪",
        "Desert Eagle": "沙漠之鹰",
        "Scuff Shotgun": "钝口霰弹枪",
        Shotgun: "霰弹枪",
        "AK-74u": "AK-74u",
        AK: "AK",
        MP: "MP",
        Rifle: "步枪",
        "Chain Shotgun": "链式霰弹枪",
        Revolver: "左轮手枪",
        SMG: "冲锋枪",
        Sawnoff: "锯口霰弹枪",
        Bullpop: "无托步枪",
        "Evo Assault": "Evo突击步枪",
        Famas: "Famas突击步枪",
        Minigun: "加特林",
        "Magnum Revolver": "马格南左轮",
        "Smart Pistol": "智能手枪",
        "Riot Prod": "电击棒",

        Blunt: "钝器",
        Chainsaw: "电锯",
        Drill: "钻机",
        "Fire Axe": "消防斧",
        Machete: "砍刀",
        "Meat Cleaver": "剁肉刀",
        "Magazine Size": "弹匣容量",

        Baton: "警棍",
        Bladed: "带刃",
        Switchblade: "弹簧刀",
        Wrench: "扳手",
    };

    //----1.5-2 護甲
    const dictsEquip = {
        "Armour (Head": "护甲（头部）",
        "Armour (body": "护甲（身体）",
        "Armour (Legs": "护甲（腿部）",
        "Armour (feet": "护甲（脚）",

        //----------------/ 頭
        "Army Helmet": "军用头盔",
        "Camo Hat": "迷彩帽",
        "Cowboy Hat": "牛仔帽",
        "Gas Mask": "防毒面具",
        "Ranger Hat": "游侠帽",
        "Riot Helmet": "防暴头盔",
        Sunglasses: "太阳镜",
        "Hockey Mask": "冰球面罩",
        "Nano Helmet": "纳米头盔",

        //----------------/ 身體
        "Barrel Vest": "桶形背心",
        "Body Vest": "防护背心",
        "Camo Vest": "迷彩背心",
        "Hazmat Jacket": "防护服夹克",
        "Cloth Jacket": "布质夹克",
        "Ranger Jacket": "游侠夹克",
        "Leather Jacket": "皮夹克",
        "Padded Vest": "衬垫背心",
        "Nano Armour": "纳米装甲",

        //----------------/ 腿
        "Armoured Pants": "装甲裤",
        "Army Pants": "军裤",
        "Camo Pants": "迷彩裤",
        "Cargo Pants": "工装裤",
        "Cargo Shorts": "工装短裤",
        "Cloth Pants": "布裤",
        "Heavily Armoured Pants": "重装甲裤",
        Jeans: "牛仔裤",
        "Ranger Jeans": "游侠牛仔裤",
        "Jogging Bottoms": "跑步裤",
        "Knee Pads": "护膝",
        "Padded Pants": "衬垫裤",
        "Sweat Pants": "运动裤",
        "Swim Shorts": "游泳短裤",

        //----------------/ 腳
        "Army Boots": "军靴",
        "Camo Boots": "迷彩靴",
        "Hazmat Boots": "防护靴",
        "Ranger Boots": "游侠靴",
        Sandals: "凉鞋",
        "Soldier Boots": "士兵靴",
        "Trekking Boots": "徒步靴",
        "Work Boots": "工作靴",

        //----------------/ 黃裝
        "Lesser Deep Pockets": "次级扩容槽",
        "Lesser Lead Lining": "次级铅内衬",
        "Lesser Inspired Refining": "次级精炼启发",
        "Lesser Inspired Scavenging": "次级拾荒启发",
        "Lesser Inspired Crafting": "次级制作启发",
        "Lesser Inspired Farming": "次级耕作启发",
        "Weak Deep Pockets": "低级扩容槽",
        "Weak Inspired Refining": "低级精炼",
        "Weak Lead Lining": "低级铅内衬",
        "Weak Inspired Distilling": "低级蒸馏启发",
        "Weak Inspired Hunting": "低级狩猎启发",
        "Weak Inspired Scavenging": "低级拾荒启发",
        Modified: "改装过的",

    };

    //----1.5-3 交通工具
    const dictVehicle = {

        Vehicle: "车辆",
        "vehicle_parts_tires": "车辆部件 - 轮胎",
        "vehicle_parts_turbo": "车辆部件 - 涡轮增压器",
        "vehicle_parts_battery": "车辆部件 - 电池",
        "No Vehicle": "没有车辆",
        "SELECT RIG": "选择挂车",
        "Vehicle rigs are locked": "挂车尚未解锁",
        "You need a vehicle to explore": "你需要一辆车来远征",
        "You cannot add this item to your vehicle": "无法将此物品添加进车辆里",
        Stinger: "毒刺",
        Efficiency: "效率",
        Capacity: "容量",
        "Vehicle Capacity": "车辆容量",
        "Vehicle Speed": "车辆速度",
        "Vehicle Efficiency": "车辆效率",
        "Vehicle Fuel Cost": "车辆燃料消耗",
        "Fuel Cost": "燃料成本",
        "Pickup Truck": "皮卡车",
        "Sports Car": "跑车",
        "Compatible Items": "兼容物品",
        "Your vehicle is too heavy to travel": "您的车辆太重导致无法行驶",

    };

    //----1.5-4 資源
    const dictItemResources = {
        Resource: "资源",

        //----------------/ 材料
        "Advanced Tools": "高级工具",
        Barley: "大麦",
        "Barley Seeds": "大麦种子",
        Barricade: "路障",
        Brick: "砖块",
        Cement: "水泥",
        Cloth: "布料",
        Coal: "煤炭",
        "Dirty Water": "脏水",
        Explosives: "炸药",
        "Fishing Reel": "鱼线轮",
        Flux: "助焊剂",
        Fuel: "燃料",
        Gears: "齿轮",
        "Gun Powder": "火药",
        "Iron Bar": "铁锭",
        "Iron Ore": "铁矿石",
        Logs: "原木",
        Nails: "钉子",
        Oil: "油",
        Plastic: "塑料",
        Rock: "岩石",
        Rope: "绳子",
        Scrap: "废铁",
        Steel: "钢铁",
        Tarp: "防水布",
        Thread: "线",
        "Unrefined Plastic": "粗塑料",
        Water: "水",
        Wire: "铁丝",
        "Zed Juice": "丧尸汁",
        Oilcloth: "油布",
        Ash: "灰烬",
        "Purify Water": "净化水",
        Tape: "胶带",
        Planks: "木板",
        Hide: "兽皮",
        "Empty Fuel Container": "空燃料容器",
        "Salvaged Tech": "硬盘",
        "Broken Remote": "损坏的遥控器",
        "Electrical Components": "电子元件",
        "Broken Radio": "损坏的收音机",
        "Broken Screen": "损坏的屏幕",
        "Computer Board": "电脑主板",
        "Automation Arm": "机械手臂",
        "Nanites Cache": "纳米机器人储存舱",
        "Serum": "血清",
        "Fuel Container": "燃料容器",
        "Bolts": "螺栓",
        "Bone Offering": "骸骨祭品",
        "Quartz": "石英",
        "Accuracy Kit": "精准套件",
        "Reclaimed Components": "回收组件",
        "Silicon": "硅",
        "Double Lining": "双层衬里",
        "Reinforced Lining": "加强衬里",
        "Amber": "琥珀",
        "Nimble Lining": "灵活衬里",
        "Tin Plate": "锡板",
        "Light Lining": "轻型内衬",
        "Damage Kit": "损坏套件",
        "Defense Kit": "防御套件",

        //----------------/ 魚
        Angelfish: "天使鱼",
        Barnaclefish: "藤壶鱼",
        Bass: "黑鲈",
        Carp: "鲤鱼",
        Perch: "河鲈",
        Rockfish: "石鱼",
        Sandfish: "沙鱼",

        "Raw Fish": "生鱼",
        "Cooked Angelfish": "熟天使鱼",
        "Cooked Barnaclefish": "熟藤壶鱼",
        "Cooked Bass": "熟黑鲈", // Bass 对应黑鲈（如大嘴黑鲈，属鲈科下的黑鲈属）
        "Cooked Carp": "熟鲤鱼",
        "Cooked Perch": "熟河鲈", // Perch 对应河鲈（属鲈科鲈属，典型淡水鲈）
        "Cooked Sandfish": "熟沙鱼",

        "Zen Egg": "禅蛋",
        "Dino Egg": "恐龙蛋",
        "ZedBull Egg": "丧尸红牛蛋",
        "Survivor Egg": "幸存者蛋",
        "Moon Egg": "月蛋",
        "Corrupted Egg": "腐化之蛋",
        "Luxury Egg": "奢华之蛋",
        "Alien Egg": "外星蛋",
        Tincture: "酊剂",

        // 說明
        // 線
        "A long, thin strand of cotton used in sewing": "一条用于缝纫的长而细的棉线",
        // 丧尸汁
        "Made by carefully crushing the head of Zeds between two rocks": "通过小心地将丧尸的头部夹在两块岩石之间来制作",
    };

    //----1.5-5 子彈
    const dictItemAmmo = {
        Arrows: "箭",
        "Simple Ammo": "简单弹药",
        "Shotgun Slug": "霰弹枪弹丸",
        "Rifle Ammo": "步枪弹药",
        "Pistol Ammo": "手枪子弹",
    };

    //----1.5-6 醫療
    const dictItemMedical = {
        "Med Booster": "医疗增强剂",
        Bandage: "绷带",
        "Effect: Reduce recovery time by 10 minutes, increases life by 10 and medical cooldown by 5 minutes":
            "效果：减少10分钟的恢复时间，增加10点生命值，医疗冷却时间5分钟",
        Morphine: "吗啡",
        "Effect: Reduce recovery time by 20 minutes, increases life by 50 and medical cooldown by 15 minutes":
            "效果：减少20分钟恢复时间，增加50点生命值，医疗冷却时间15分钟",
        "Small Med Kit": "小型医疗包",
        "Effect: Reduce recovery time by 30 minutes, increases life by 30 and medical cooldown by 10 minutes":
            "效果：减少30分钟恢复时间，增加30点生命值，医疗冷却时间10分钟",
        "Med Kit": "医疗包",
        "Effect: Reduce recovery time by 1 hour, increases life by 150 and medical cooldown by 30 minutes":
            "效果：减少1小时恢复时间，增加150点生命值，医疗冷却时间30分钟",
        "Energy Vial": "能量瓶",
        "Effect: Reduce recovery time by 10 minutes and increases life by": "效果：冷却时间10分钟并增加生命值",
        "Health Vial": "生命瓶",
        "Detox Vial": "解毒瓶",
        "Effect: Resets cooldown booster by 12 hours": "效果：重置增强剂冷却时间12小时",
    };

    //----1.5-7 增強
    const dictEnhance = {
        "Chem Boosters": "化学增强剂",
        "Energy Booster": "能量增强剂",
        "Rad Booster": "辐射增强剂",
        "Weight Booster": "负重增强剂",
        "Worker Booster": "劳动增强剂",
        "XP Booster": "经验值增强剂",

        "Booster (Medical)": "增强剂（医疗）",
        "Booster (Medical": "增强剂（医疗）",
        "Boosters (Medical": "增强剂（医疗）",
        "Booster (Energy Drink": "增强剂（能量饮料）",
        "Boosters (Energy Drink)": "增强剂（能量饮料）",
        "Boosters (energy": "增强剂（能量饮料）",
        "Booster (Special": "增强剂（特殊）",
        "Booster (Easter": "增强剂（复活节）",
        "Booster (Food": "增强剂（食物）",
        "Booster (Food)": "增强剂（食物）",
        "Booster (Alcohol": "增强剂（酒精）",
        "Boosters (Alcohol)": "增强剂（酒精）",
        "Boosters (Alcohol": "增强剂（酒精）",
        "Booster (Fish": "增强剂（鱼类）",

        //----------------/ 食物
        "Animal Meat": "动物肉",
        Chocolate: "巧克力",
        "Canned Food": "罐装食物",
        "Cooked Fish": "熟鱼",
        "Cooked Meat": "熟肉",
        "Fish Kebab": "鱼肉串",
        Kwizine: "美食",
        "Mixed Vegetables": "混合蔬菜",
        "Pumpkin Pie": "南瓜派",
        Sandwich: "三明治",
        "Morale Vial": "士气瓶",

        "Effect: Increases morale by 10 and booster cooldown by 30 minutes": "效果：增加10点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 20 and booster cooldown by 30 minutes": "效果：增加20点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 50 and booster cooldown by 30 minutes": "效果：增加50点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 50 and booster cooldown by 1 hour": "效果：增加50点士气，增强剂冷却时间1小时",
        "Effect: Increases morale by 65 and booster cooldown by 30 minutes": "效果：增加65点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 75 and booster cooldown by 30 minutes": "效果：增加75点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 100 and booster cooldown by 30 minutes": "效果：增加100点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 125 and booster cooldown by 30 minutes": "效果：增加125点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 300 and booster cooldown by 30 minutes": "效果：增加300点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by 500 and booster cooldown by 30 minutes": "效果：增加500点士气，增强剂冷却时间30分钟",
        "Effect: Increases morale by": "效果：增加士气",

        //----------------/ 能量
        Coffee: "咖啡",
        "e-Cola": "原子可乐",
        Eyebellini: "眼球鸡尾酒",
        "Witch's Brew": "巫师饮品",
        ZedBull: "丧尸红牛",
        "Free ZedBull":"免费丧尸红牛",
        "Adrenaline Booster": "肾上腺素增强剂",

        "Effect: Increases energy by 100 and booster cooldown by 30 minutes": "效果：增加100点能量，增强剂冷却时间半小时",
        "Effect: Increases energy by 25 and booster cooldown by 2 hours": "效果：增加25点能量，增强剂冷却时间2小时",
        "Effect: Increases energy by 250 and booster cooldown by 2 hours": "效果：增加250点能量，增强剂冷却时间2小时",
        "Effect: Increases energy by": "效果：增加能量",

        //----------------/ 飲料
        "Free Beer":"免费啤酒",
        Beer: "啤酒",
        Vodka: "伏特加",
        Whiskey: "威士忌",
        "Radiation Vial": "辐射瓶",

        "Effect: Increases rad immunity by 5 and booster cooldown by 30 minutes": "效果：增加5点辐射免疫力，增强剂冷却时间半小时",
        "Effect: Increases rad immunity by 10 and booster cooldown by 30 minutes": "效果：增加10点辐射免疫力，增强剂冷却时间半小时",
        "Effect: Increases rad immunity by 15 and booster cooldown by 10 minutes": "效果：增加15点辐射免疫力，增强剂冷却时间10分钟",
        "Effect: Increases rad immunity by 15 and booster cooldown by 1 hour": "效果：增加15点辐射免疫力，增强剂冷却时间1小时",
        "Effect: Increases rad immunity by": "效果：增加辐射免疫力",
        "Effect: Increases morale by 50, energy by 10, rad immunity by 5 and booster cooldown by 30 minutes":
            "效果：增加50点士气、10点能量、5点辐射免疫力，增强剂冷却时间30分钟",
        "Effect: Increases morale by 100, rad immunity by 10 and booster cooldown by 30 minutes":
            "效果：增加100点士气，10点辐射免疫力，增强剂冷却时间30分钟",
        "Effect: Increases morale by 100, energy by 25 and booster cooldown by 30 minutes": "效果：增加100点士气、25点能量，增强剂冷却时间30分钟",
    };

    //----1.5-8 道具裝備
    const dictItemEquipment = {
        "Arrow Quiver": "箭袋",
        Battery: "电池",
        Hatchet: "斧头",
        "Mechanics Wrench": "扳手",
        Pickaxe: "镐",
        Shovel: "铲子",
        "Wooden Fishing Rod": "木质钓鱼竿",
        "Steel Fishing Rod": "钢制钓鱼竿",
        "Pro Fishing Rod": "专业钓鱼竿",
        "Steel Hatchet": "钢制斧头",
        "Steel Pickaxe": "钢制镐",

        // 箭袋
        "A quiver is required when doing advanced hunting": "进行高阶狩猎时，需要配备箭袋",

    };

    //----1.5-9 雜項
    const dictItemOther = {
        "Barracks key": "军营钥匙",
        "Buddys Pass": "伙伴通行证",
        "Fuel Injector": "燃料喷射器",
        "Generals RFID": "将军的射频ID",
        Lighter: "打火机",
        Lockpick: "开锁器",
        "Lucky coin": "幸运硬币",
        "Security Card": "安保卡",
        "Bronze Key": "青铜钥匙",
        "Silver key": "银钥匙",
        "Police RFID": "警察射频ID",
        Compass: "指南针",
        Crowbar: "撬棍",
        Flashlight: "手电筒",
        Transceiver: "无线电收发器",
        Binoculars: "双筒望远镜",
        "Helps you see": "帮助你看得更清楚",
        Splicer: "熔接机",
    };

    //----1.5-10 汽車零件
    const dictParts = {
        "Car Parts": "汽车零件",
        "Tire": "轮胎",
        "Bulky Turbo": "大型涡轮",
        "Eco Tire": "环保轮胎",
        "Robust Tire": "耐用轮胎",
        "Racing Tire": "赛车轮胎",
        "Inline Turbo": "直列涡轮",
        "Turbo": "涡轮",
        "High Capacity Turbo": "高容量涡轮",
        "Small Car Battery": "小型汽车电池",
        "Experimental Car Battery": "实验性汽车电池",
        "Heavy Duty Car Battery": "重型汽车电池"

    };

    //----1.5-11 掛車
    const dictrRigs = {
        "Basic Cargo Rig": "基础货运挂车",
        "Economy Cargo Rig": "经济型货运挂车",
        "Lightweight Cargo Rig": "轻型货运挂车",
        "Heavy Cargo Rig": "重型货运挂车",
        "Tanker Rig": "油罐车挂车",
        "Lightweight Rig": "轻型挂车",
        "Streamline Rig": "流线型挂车",

    };


    //----1.5-12 獎盃
    const dictItemTrophy = {
        Trophy: "奖杯",
        "We thank you for taking part in alpha, your account has been reset and you have been awarded a special trophy for your help":
            "感谢你参与Alpha测试，你的账号已被重置，并为你的帮助颁发了一座特殊奖杯。",
        "Alpha Survivor": "Alpha测试幸存者",
        "Antique Watch": "古董手表",
        "Everburning Lighter": "永燃打火机",
        "Forever Lollipop": "永恒棒棒糖",
        "Giant Pufferfish": "巨型河豚",
        "Golden Egg": "金蛋",
        "Golden Skull": "金色头骨",
        "Handy Pliers": "便捷钳子",
        "Hip Flask": "随身酒壶",
        "Huge Pine Cone": "巨大松果",
        "Lumberjack Gloves": "伐木工手套",
        "Miners Gloves": "矿工手套",
        "Miners Lamp": "矿工灯",
        "Monster Catfish": "怪物鲶鱼",
        "Old Gas Mask": "旧防毒面具",
        "Pocket Watch": "怀表",
        "Preserved Coffee": "罐装咖啡",
        "Silver Spoon": "银勺子",
        "Stale Donut": "不新鲜的甜甜圈",
        "Strange Gas Can": "奇怪的汽油罐",
        "Strong Carabiner": "结实的登山扣",
        "Viper Barnaclefish": "毒蛇藤壶鱼",

        // 說明
        "Scavenging Rad Immunity": "拾荒辐射免疫力",
        "Fishing Rad Immunity": "钓鱼辐射免疫力",
        "Woodcutting Rad Immunity" : "伐木辐射免疫力",
        "Mining Rad Immunity": "挖矿辐射免疫力",

    };


    //1.6 技能狀態
    const dictSkill = {
        Stats: "统计",
        Total: "总计",
        "Fight Stats": "战斗统计",
        "Items Crafted": "制作的物品",
        "Items Forged": "锻造的物品",
        "Hunting Attempts": "狩猎尝试",
        "Scavenge Attempts": "拾荒尝试",
        Forge: "锻造",
        Forging: "锻造",
        Farming: "耕作",
        Brew: "酿造",
        Fish: "钓鱼",
        Mine: "挖矿",
        Mining: "挖矿",
        cooking: "烹饪",
        Distilling: "蒸馏",
        Scavenging: "拾荒",
        Crafting: "制作",
        Fishing: "钓鱼",
        Refining: "精炼",
        Woodcutting: "伐木",
        Perks: "特技",
        "Active Perks": "当前特技",
        "Skill Point": "技能点",
        "Skill Points": "技能点",
        Immunity: "免疫",
        "The damage you make on impact": "你命中时造成的伤害",
        "Your ability to resist damage": "你抵抗伤害的能力",
        "The chance of hitting your target": "击中目标的概率",
        "Your ability to dodge an attack": "你的闪避能力",
        "Increase Max Rad Immunity by": "增加最大辐射免疫力",
        "Receive a special item drop every month": "每月可获得一次特殊物品掉落",
        "life regen every 15 min": "每15分钟的生命回复值",
        Morale: "士气",
        "Increase Max Morale by": "增加最大士气",
        Life: "生命",
        "Increase Max Life by": "增加最大生命值",
        Luck: "幸运",
        "Increase chance of finding better items": "增加找到更好物品的机会",
        Strength: "力量",
        "Increase strength by": "增加力量",
        Defense: "防御",
        "Increase defense by": "增加防御",
        Speed: "速度",
        "Increase speed by": "增加速度",
        Agility: "敏捷",
        "Increase agility by": "增加敏捷",
        "Morale Perk": "士气特技",
        "Life Perk": "生命特技",
        "Max Life": "最大生命",
        "Upgrade Life": "升级生命",
        "Max Morale": "最大士气",
        "Your morale will reset in": "士气将重置于",
        "Upgrade Immunity": "升级免疫力",
        "Immunity Perk": "免疫力特技",
        "Max Rad Immunity": "最大辐射免疫力",
        "Rad Immunity": "辐射免疫力",
        "Luck Perk": "幸运特技",
        "Life Regen": "生命回復",
        "Skill Bonus": "技能奖励",
        "Recently Rested": "近期已休息",

        //----------------/ 活動(Spa)
        Activities: "活动",
        "Leave Activity": "离开活动",
        "Relax in Spa": "Spa 放松",
        Pending: "待办",
        Target: "目标",
        Organiser: "组织者",
        Invitee: "受邀人",
        Invite: "邀请",
        Invited: "受邀",
        "Invite Invitee": "发送邀请",
        "Not all roles are filled": "未填满所有角色",
        "Abandon Activity": "放弃活动",
        "Are you sure you want to abandon this activity": "您确定要放弃此活动吗",
        "Activity abandoned successfully": "活动放弃成功",
        "Leave Role": "离开角色",
        "Are you sure you want to leave this activity": "您确定要离开此活动吗",
        "Not Ready": "未就绪",
        "Start Activity": "开始活动",
        "Enter Activity": "进入活动",
        "Relax": "放松",
        "Relax in the Spa": "在Spa放松",
        "Time Left": "剩余时间",
        "You must wait": "你必须等待",
        "before starting this activity again": "才能再次开始该活动",
        "Relax in Spa ran out of time": "Spa已超時",
        "Relax in Spa was successful": "Spa已完成",
        "Relax in Spa has started": "Spa已开始",
        "Finish Activity": "完成活动",
        "In Process": "处理中",

        //----------------/ 活動(輻射)
        "Visit Sleeping Quarters": "参观宿舍区",
        "Rest in Faction camp": "在阵营营地休息",
        "Rest": "休息",
        "In progress": "进行中",
        "Visit Sleeping Quarters was successful": "参观宿舍区成功",
        "Visit Sleeping Quarters has started": "参观宿舍区已开始",

    };

    //1.7 遠征
    const dictExplore = {
        // ----- 簡單
        "Easy": "简单",
        "Open Meadow": "开阔草地",
        "Reclaim Zone": "回收区",
        "Fishing Reserve": "渔业保护区",

        // ----- 中等
        Medium: "中等",
        "Logging Camp": "伐木营地",
        "Fuel Depot": "燃料库",
        "Demolition Site": "拆除现场",
        "Oil Refinery": "炼油厂",
        "Construction Yard": "建筑工地",
        "Research Facility": "研发设施",
        "Abandoned Quarry": "废弃采石场",

        // ----- 困難
        "Hard": "困难",
        "Data Center": "资料中心",
        "The Reserve": "保护区",
        "Military Base": "军事基地",
        "Industrial Foundry": "工业铸造厂",
        Junkyard: "垃圾场",

        "Rations resupply": "配给补给",
        "Claim Rations": "领取配给",
        "Unload Items": "卸载物品",
        "Are you sure you want to unload all your items": "你确定要卸载所有物品",
        "There are no items to unload": "没有可卸载的物品",
        Unload: "卸载",
        "Unload Item": "卸载物品",
        Travel: "旅行",
        "You are traveling": "你正在旅行",
        "Return To City": "返回城市",
        "Population: NaN": "人口：NaN",
        Population: "人口",
        Zone: "区域",
        "Defeat all NPCs to gain access": "击败所有NPC以获得进入权限",
        "Fuel Pumps": "加油泵",
        "Secure Panel": "安全面板",
        Unlock: "解锁",
        "Not Available": "不可用",
        "Respawning in": "复活倒计时",
        "Your vehicle is overweight, travel is restricted": "你的车辆超重，旅行受限",
        Destroy: "摧毁",
        "Destroy Item": "摧毁物品",
        "This will destroy the item permanently": "这将永久销毁该物品",
        "Zone 2 is locked": "区域2已锁定",
        "Zone 3 is locked": "区域3已锁定",
        "Are you sure you want to return to the city": "确定要返回城市吗",
        "Items have been unloaded": "物品已卸载",
        Open: "打开",
        "Fuel Trade": "燃料交易",
        "REFILL FUEL CONTAINER": "填充燃料容器",
        "REFILL FUEL CONTAINER FROM RESERVES": "用储备填充燃料容器",
        "Bulk Goods Lockup": "大货仓",
        "Scrap Pile": "废铁堆",
        "Warm Springs": "温泉",
        "Red River": "红河",
        "Grand Lake": "大湖",
        "No raids found": "未找到突袭",
        "Secure Gate": "安全门",
        "Explosive Debris Cache": "炸药残骸箱",
         Barracks: "军营",
        "Travel to Construction Yard to access advanced refinery": "前往施工场可访问高级精炼厂",
        "Travel to Construction Yard to access abandoned scrapyard": "前往施工场可访问废弃废料场",
        "Scout": "侦察",
        "Exit Scout": "退出侦察",
        "Scout Location": "侦察位置",
        "Discovered": "已发现",
        "Time Here": "在此停留时间",
        "Area Size": "区域大小",
        "A You must be level 20 or higher to scout for survivors": "你必须达到 20 级或以上才能搜索幸存者",


    };

    //----1.7-1 前哨站
    const dictOutpost = {
        // ↓↓↓ Locations ↓↓↓
        // 開闊草地
        "Setup Trap": "设置陷阱",
        "Setup Quick Trap": "设置快速陷阱",
        "Trap armed! Return in": "陷阱已安裝! 返回時間",

        // 回收中心
        "Mould Plastics": "模具塑料",
        "Recycle Tarp": "回收防水布",
        "Recycle Wire": "回收电线",
        "Actions": "动作",
        "Extract Plastics": "提取塑料",
        "Coffee Machine": "咖啡机",

        // 伐木营地
        "Chop Hard Wood": "砍伐硬木",
        "Chop Wood": "劈柴",
        "Construct Log Lifter": "制作原木起吊装置",

        // 研发设施
        "Secure Chemical Storage": "安全化学品储存处",
        "Serum Lockbox": "血清保险箱",
        "Serum Storage": "血清储存处",

        // ↓↓↓ 前哨站 ↓↓↓
        "Create Clearing": "开辟空地",
        "Recycle canned food": "回收罐头食品",
        "mine iron ore": "开采铁矿石",
        "Check traps": "检查陷阱",
        "Extract fuel": "提取燃料",

        "Hunt Large Game": "狩猎大型猎物",
        "Hunt Small Game": "狩猎小型猎物",
        "Hack Security Door": "破解安全门",
        "Power Backup Generator": "备用发电机",
        "Dumpsters": "垃圾桶",
        "Pile of Old Tech": "旧科技堆",
        "Vehicle Reclamation": "车辆回收",
        "White Goods": "大型家用电器",
        "Salvage Servers": "回收服务器",
        "Search Recycling Bin": "搜索回收站",
        "Control Room": "控制室",
        "Security Room": "安保室",

        "Fuel Pump": "加油泵",
        "Recycling Center": "回收中心",
        "EXPLOSIVES FACTORY": "炸药工厂",
        "ADVANCED REFINERY": "高级精炼厂",
        "ABANDONED SCRAPYARD": "废弃废料场",
        "ABANDONED FORGE": "废弃锻造厂",
        "Abandoned Iron Mine": "废弃铁矿场",
        "BUILDING WORKS": "建筑工程",
        "Hunting Shack": "狩猎小屋",

        Loot: "拾取",
        Owner: "所有者",
        Takeover: "抢占",
        "Takeover Outpost": "抢占前哨站",
        Activate: "启动",
        "Processing Plant": "加工厂",
        "Search Scrap Pile": "搜索废料堆",
        "Search Workshop": "搜索作坊",
        "Vending Machine": "自动售货机",
        "Foundation Pit": "地基坑",
        "Secure Lockup Door": "安全门",
        "Security Vault": "保险库",
        Lockbox: "保险箱",
        Abandoned: "废弃的",
        "You do not have any Explosives": "你没有任何炸药",
        "You tookover the outpost": "你占领了前哨站",
        Abandon: "放弃",
        "Abandon Outpost": "放弃前哨站",
        "Are you sure you want to abandon this outpost": "你确定要放弃这个前哨站吗",
        "Protected Cooldown": "保护冷却时间",
        "You activated the Vending Machine and gained": "你启动了自动售货机并获得了",
        "Owner is defending": "拥有者防御中",
        "Owner is inactive": "拥有者不活跃",
        "Main Compound": "主基地",
        "Generals Lockbox": "将军储物箱",
        "Secure Gatehouse": "警卫室",
        "Vehicle Lockup": "车辆封存区",
        "Enter Barracks": "进入营房",
        "Enter Generals Quarters": "进入将军宿舍",
        "Generals Quarters": "将军宿舍",

    };

    //1.8 貨幣
    const dictItemCurrencies = {
        "Zed Coin": "丧尸币",
    };

    //2.0 怪物
    const dictMonster = {
        Zombie: "丧尸",
        "Raging Zombie": "狂怒丧尸",
        "Frenzied Zombie": "狂暴丧尸",
        "Weakness: Pistol": "弱点：手枪",
        Crawler: "爬行者",
        "Frenzied Crawler": "狂暴爬行者",
        "Raging Crawler": "狂怒爬行者",
        "Weakness: Blunt": "弱点：钝器",
        Bloater: "鼓胀者",
        "Frenzied Bloater": "狂暴鼓胀者",
        "Raging Bloater": "狂怒鼓胀者",
        "Weakness: Rifle": "弱点：步枪",
        Spitter: "喷吐者",
        "Raging Spitter": "狂怒喷吐者",
        "Frenzied Spitter": "狂暴喷吐者",
        "Weakness: Piercing": "弱点：穿刺",
        "Undead Workman": "不死工人",
        "Undead Supervisor": "不死主管",
        "Weakness: Bladed": "弱点: 刀刃",
        "Raging Zombie": "狂怒丧尸",
        "X-Bloater": "X - 膨胀者",
        "X-Spitter": "X - 喷吐者",
        "Horde Leader": "尸群首领",
        "Huge Bloater": "巨型鼓胀者",
        "Huge Legendary Bloater": "巨型传奇鼓胀者",
        "Huge Mutated Bloater": "巨型变异鼓胀者",
        "Undead Chicken": "不死鸡",
        "Undead Corporal": "不死下士",
        "Undead General": "不死将军",
        "Undead Soldier": "不死士兵",
        Lurcher: "勒车犬",
        "RUGGED LOOKING MAN": "面容粗犷的男人",
        "SLIM WOMAN": "苗条的女人",
        "Creature In The Shadows": "暗影生物",
    };

    //2.1 任務
    const dictMission = {
        quest: "任务",
        "Quest Progress": "任务进度",
        Progress: "进度",
        Completed: "已完成",
        Complete: "完成",
        "Objective Completed": "目标完成",
        "Select a quest to continue": "选择一个任务继续",
        "Items Gained": "获得物品",
        "Level Experience": "等级经验",

        //----------------/ NPC名稱
        Myena: "Myena",
        Garbo: "Garbo",
        Buddy: "Buddy",
        Meat: "Meat",
        Gray: "Gray",

        "The Purge is Upon Us": "大清洗即将来临",
        "A massive incinerator stands in the middle of the city, billowing out smoke as the fire within burns hot enough to turn anything into ash":
            "一个巨大的焚烧炉屹立在城市的中央，浓烟四起，炉内的火焰足以将任何物品烧成灰烬",
        "As Ash blankets the city, a raspy chuckle attracts your notice": "当灰烬覆盖城市时，一阵沙哑的笑声引起了你的注意。",
        "Select a location to continue": "选择一个地点继续",
        "Tell you what, I know who you should go and see. Buddy... yeah... Maddest guy I know but sure knows how to handle any situation thrown at him. Heck he'd already barricaded up half his neighbourhood before the first zed his his part of town. Just look out for the search lights at light. You won't be able to miss it":
            "我告诉你，我知道你应该去找谁。Buddy……对，就是他……我认识的最疯狂的家伙，但他确实知道如何应对任何情况。他在第一只丧尸袭击他的社区之前，就已经在半个街区设置了路障。晚上留意探照灯，你绝对不会错过。", // 错别字light
        "Welcome to the End": "欢迎来到末日",
        "Getting started at the end of the world": "在世界末日时开始你的冒险",
        "A stranger appears": "一个陌生人出现",
        "Who is this dark figure, quiet and still, under the moonlight": "月光下，这个安静的黑暗身影是谁。",
        "Garbo's Junkyard": "Garbo 的垃圾场",
        "Shady part of the City where we might find a blacksmith": "城市里一个阴暗的角落，我们可能会在那里找到一个铁匠。",
        "The Butchers Shed": "屠夫棚",
        "A large butchers warehouse with metallic interior": "一个内部金属结构的大型屠夫仓库。",
        "Good ol' Buddy": "好伙伴 Buddy",
        "A fortress against zombies heavily guarded": "一座对抗丧尸的严密防御堡垒。",
        "Market Trader": "市集商贩",
        "Take a tour around the cities markets": "逛一逛城市里的市集",
        "Metals Miner": "金属矿工",
        "Learn to mine for Iron Ore": "学习开采铁矿石",
        "Wood Carpenter": "木工",
        "Learn to gather wood and craft planks": "学习收集木材并制作木板",
        "Fuel Baron": "石油大亨",
        "Learn how to gather fuel": "学习如何收集石油",
        "Animal Huntress": "女猎手",
        "Learn to hunt Animals for Hide and Animal Meat": "学习猎杀动物以获取兽皮和兽肉",
        "Chocolate Chuck": "巧克力 Chuck",
        "Learn how to find and train with chocolate": "学习如何找到并借助巧克力训练",
        "Clothes Seamstress": "服装裁缝",
        "Learn to craft armours": "学习制作盔甲",

        //任務1
        "Welcome to the end, survivor. If you're still breathing, then you've got a chance—slim as it may be. But out here, everyone starts somewhere. Your first task? Head down to the old arcade. The place is crawling with zeds, mostly slow-moving crawlers, but don't get too comfortable. Even the weakest can tear you apart if you’re not careful":
            "欢迎来到末日，幸存者。如果你还活着，那么你还有机会——尽管微乎其微。但在这里，每个人都有一个起点。你的第一个任务？去旧的街机厅。那地方挤满了丧尸，大部分是缓慢爬行的怪物，但别太放松。即便是最弱的丧尸，如果你不小心，也能将你撕裂。",
        "Consider this your initiation. Clear out a few of those walkers, get a feel for how things are now. Survive this, and we’ll see if you’ve got what it takes to go further. Good luck—you’re gonna need it":
            "把这当作你的入门任务。清理掉一些那些行尸走肉，感受一下现在的局势。坚持下来，我们再看看你是否有能力走得更远。祝你好运——你会需要它的。",
        "Objective: Hunt a zed in the Arcade (Darkened Restrooms": "目标：在游戏厅（昏暗的洗手间）狩猎一只丧尸",
        //任務2
        "So, you made it out in one piece. Not bad—for a beginner. But don’t get cocky; that was just a Crawler, the easiest of the lot. Out here, there are things way nastier waiting to tear into you. If you want to survive, you’re going to need a lot more than luck":
            "所以，你全身而退了。不算太差——对于一个新手来说。但别得意忘形；那只是爬行者，最简单的一个。在这里，有更可怕的东西等着撕碎你。如果你想生存下来，你需要的不只是运气",
        "I’d suggest you start training, get those instincts sharp. Strength alone won’t keep you alive in this wasteland. Prove to me you’re serious, and maybe, just maybe, you’ll stand a chance":
            "我建议你开始训练，磨砺你的本能。仅靠力量无法让你在这片荒原中存活。向我证明你是认真的，也许，仅仅是也许，你会有一线生机",
        "Objective: Train your skills in the Stronghold (Gym": "目标：在据点（健身房）训练你的技能",
        //任務3
        "So, you’re starting to find your strength, huh? Good. But strength alone won’t keep you fed, warm, or armed out here. If you want a real chance at survival, you’ll need to gather resources—learn to live off this wasteland, bit by bit":
            "所以，你开始发现自己的力量了，是吗？很好。但仅靠力量无法让你在这里吃饱、保暖或武装起来。如果你想真正活下去，你需要收集资源——一点一点地学会依赖这片荒原生存",
        "Head into the Forest and keep an eye out for some logs. They’re scattered around, if you know where to look. Bring back a decent haul, and you’ll be one step closer to surviving another day":
            "进入森林，寻找一些原木。它们散落在四处，如果你知道该去哪里找。带回足够的收获，你就离再多活一天更近了一步",
        "Objective: Scavenge the Forest": "目标：搜寻森林",
        //任務4
        "You’ve been out there—you know the risks of scavenging. Every time you step into the wasteland, you’re gambling with the radiation, the elements, and who knows what else. So while you’re taking a breather, let’s make sure you’re better prepared for the next run":
            "你已经在外面——你知道搜寻的风险。每次踏入荒原，你都在与辐射、自然环境以及未知事物赌博。所以在你喘口气的时候，让我们确保你为下一次行动做好更充分的准备",
        "Head back to your stronghold and set up a crafting bench. With that, you’ll be able to make use of whatever scraps and resources you bring back. It’s a small step, but trust me, it’ll make a big difference in keeping you alive out there":
            "回到你的据点，建立一个制作台。有了它，你就可以利用你带回的任何碎片和资源。这是一个小步骤，但相信我，它会对你在外面生存有很大的帮助",
        "Objective: Build crafting bench": "目标：建造制作台",
        //任務5
        "You’ve seen what you can create on the crafting bench, right? Those weapons and survival tools? Well, to keep making them, you need resources—and that means more scavenging":
            "你已经看到可以在制作台上制作什么了，对吧？那些武器和生存工具？不过，要继续制作它们，你需要资源——这意味着更多的搜寻",
        "Head into the Forest and gather some more logs. You’ll need plenty to keep your supplies stocked and your gear in top shape. Stay sharp, and don’t take any chances while you're out there":
            "进入森林，再收集一些原木。你需要大量的原木来保持物资充足和装备完好。保持警觉，不要冒险",
        //任務6
        "Great! You’ve got the logs. Now, it’s time to turn them into something useful. Head to your crafting bench and craft yourself a baseball bat. It’s simple, but it’ll be a solid tool when you’re out there facing whatever comes your way":
            "很好！你已经拿到了原木。现在，是时候把它们变成有用的东西了。前往你的制作台，制作一根棒球棒。这很简单，但在面对外面的危险时，它会是一个可靠的工具",
        "Gear up, and get ready. You’ll be glad you have it": "装备起来，准备好。你会很庆幸拥有它",
        "Objective: Craft a baseball bat": "目标：制作棒球棒",
        //任務7
        "Now that you’ve crafted yourself a baseball bat, it’s time to put it to good use. Head back into the Arcade and take out more zeds. They’re still crawling around, but with your new weapon, you’ll have a much better shot at clearing them out":
            "现在你已经制作了一根棒球棒，是时候好好利用它了。回到游戏厅，清除更多的丧尸。它们仍然四处爬行，但有了你的新武器，你清除它们的机会会大得多",
        "Just remember: Always go equipped. The more prepared you are, the better your chances of making it out in one piece. Good luck":
            "记住：永远要做好装备准备。你准备得越充分，全身而退的机会就越大。祝你好运",
        "Objective: Kill 2 zeds in the Arcade (Darkened Restrooms": "目标：在游戏厅（昏暗的洗手间）杀死2个丧尸",
        //任務8
        "Yeah, it's a lot easier to take down zeds with a weapon, but don’t get too caught up in the fighting. I need you to take a break from the hunt and head over to the Scrapyard. There’s scrap scattered around in there—metal, parts, whatever you can find":
            "是的，用武器击倒丧尸容易多了，但不要太沉迷于战斗。我需要你暂停狩猎，前往废料场。那里散落着废料——金属、零件，以及任何你能找到的东西",
        "Search the area and bring back any scrap you can collect. It’s all useful, and you’re gonna need it for what’s coming next":
            "搜索该区域，带回任何你能收集到的废料。这些都很有用，你将需要它们来应对接下来的挑战",
        "Objective: Scavenge the scrapyard 3x": "目标：在废料场搜寻3次",
        //任務9
        "Every piece of scrap metal you find can be more than just useful—it can be your ticket to survival and even a way to make a living. Melt it down into nails for building, forge it into weapons, or trade it for cash to get what you need":
            "你找到的每一块废金属不仅仅是有用——它可以是你生存的关键，甚至是谋生的方式。将它熔炼成建筑用的钉子，锻造成武器，或者用来交易换取你需要的东西",
        "Head back to your Stronghold and build a Furnace. With it, you’ll be able to refine all that scrap into something valuable, whether you're crafting or trading to keep yourself going":
            "回到你的据点，建造一个熔炉。有了它，你可以将所有废料精炼成有价值的东西，无论是用于制作还是交易，帮助你继续生存",
        "Objective: Build the Furnace": "目标：建造熔炉",
        //任務10
        "Now that you've gathered some scrap, it’s time to smelt it down into nails. These little things are essential for building and crafting, but don’t waste them—resources aren’t exactly easy to come by in this world. What you choose to do with them is up to you":
            "现在你已经收集了一些废料，是时候将它们熔炼成钉子了。这些小东西对建筑和制作至关重要，但不要浪费它们——在这个世界上资源并不容易获得。你决定如何使用它们",
        "You’ve learned the basics of survival, but there’s much more ahead. Build, hunt, explore—there’s a whole world out there still waiting to be discovered. Good luck... you're going to need it":
            "你已经学会了生存的基础知识，但前方还有更多挑战。建造、狩猎、远征——外面还有一个等待被发现的广阔世界。祝你好运……你会需要的",
        "Objective: Craft Nails": "目标：制作钉子",

        //---------------/ Myena-1
        "You walk into a dark alley surrounded by street lamps on either side, hanging down from the street lamps is a spaghetti mess of entangled wires attached to powered bug zappers providing little light to the alley along with the faint buzzing noise of the power circulating around. The intrigue of other humans possibly surviving here draws you in, until you notice the hidden shadow of a slender woman sat against the walls of the alleyway. The shadowy figure begins to become clear as she lifts to her to look you up and down":
            "你走进一条黑暗的巷子，街灯两旁被杂乱的电线缠绕着，电击器发出的微弱光线照亮着巷道，同时伴随着电力流动时的嗡嗡声。你开始对这里可能还有其他幸存者产生兴趣，直到你注意到巷子墙角隐藏的身影，一位瘦削的女人坐在那里。她抬头看你，逐渐显现出她的模样。",
        "Another survivor eh? … It’s been a while since I’ve seen someone new around here. You must have got into the city just recently, I’m Myena - a ‘nightwalker’ of sorts, trading in information, scouting different locations and just generally surviving this forsaken wasteland":
            "另一个幸存者，嗯？……我很久没见到新面孔了。你应该是最近才进城的，我是Myena——某种意义上的‘夜行者’，交易信息、侦察不同的地点，反正就是在这个被遗弃的废土上生存。",
        "You stare for a moment waiting to see if you can offer anything in exchange for something of value":
            "你凝视着她，等待着看看自己是否能用什么交换一些有价值的东西。",
        "So, wanna make yourself useful? I need some fuel to help start fixing up my bike. Just a little will do. If you can go find some for me, I'll let you in on some valuable information. So what'ya say":
            "那么，想让自己变得有用吗？我需要一些燃料来修理我的摩托车，稍微一点就行。如果你能帮我找到一些，我就会告诉你一些有价值的信息。怎么样？",
        "Objective: Find fuel at Scrapyard": "目标：在（拾荒）废料场中找到燃料",
        //---------------/ Myena-2
        "Wow you already got that fuel huh! You're a real useful type huh. Alright well look let me tell you a bit more about the city and the who's who around these parts":
            "哇，你已经拿到那些燃料了？你真是个有用的人啊。好吧，让我跟你多讲讲这座城市和这里的那些人。",
        "You sit down while watching Myena refilling her bikes petrol tank": "你坐下来，看着Myena为她的摩托车加满油箱。",
        "So, I guess the first person you should go and see is Garbo. He's a real piece of work but if you got the parts then he's got the time":
            "所以，我想你应该先去见见Garbo。他是个古怪的人，但如果你有零件，他就有时间。",
        "Myena gives the bike a once over and tries the ignition": "Myena检查了一遍摩托车并尝试启动引擎。",
        "Things still not working, guess I'll be looking at the sparkies next then. Alright listen, Garbo is just around the corner from here. Has a workshop setup on top of the bridge. And hey, when you get back here, maybe could you bring me a water? I'm melting from all this work on the bike and that sure would wet my lips, if you know what I mean":
            "东西还是不能用，看来我接下来要检查火花塞了。好了听着，Garbo就在这附近。他在桥顶上建了一个作坊。对了，当你回来时，能不能给我带瓶水？修这辆摩托车让我快热化了，喝点水就能解渴了，你懂我的意思吧。",
        "Objective: Visit Garbo and Get Water": "目标：拜访Garbo并提交水",
        //---------------/ Myena-3
        "Myena takes your water and drinks it quickly, followed by wiping away her sweaty brow with her oily hands":
            "Myena接过你的水，快速喝完，然后用沾满油污的手擦去了额头上的汗水。",
        "Oof thanks a lot. Life saver. ... I swear this Bike just doesn't want to live again. I've tried pretty much everything. Re-seated the pistons, replaced the sparkies. No matter what I try it just don't go. I know where I can get some new parts but it's just too dangerous, even for the both of us":
            "哎呀，非常感谢。真是救命恩人。我发誓这辆摩托车就是不想重新动起来。我几乎什么都试过了，重新安装了活塞，更换了火花塞。不管怎么试，它就是不行。我知道哪里能找到一些新零件，但那地方太危险了，即使是我们俩也难以应付。",
        "Myena paces around for a moment thinking to herself as if hatching a plan": "Myena在原地踱步，似乎在思索着某个计划。",
        "Well it'll never work, likely you get caught up on the fence or I get stuck in the fire exit, it's just too risky":
            "嗯，这根本行不通，你可能会被卡在围栏上，或者我被困在紧急出口，这风险太大了。",
        "She looks at you with calculating eyes, weighing up the odds on your survival in the wrong situation":
            "她用带有评估意味的眼神看着你，似乎在衡量你在糟糕情况下的生存几率。",
        "You go to walk out the door": "你正准备走出门。",
        "And hey, if you can get a snack while you're out there, I sure would see that as a friendly gesture worth more information":
            "对了，如果你能带些零食回来，我会把这看作一个友好的姿态，再告诉你更多信息。",
        "Objective: Visit Buddy and Bring Snacks": "目标：拜访Buddy并提交零食",
        //---------------/ Myena-4
        "Oh you brought a snack": "哦，你带了零食。",
        "Myena springs up from working on the bike": "Myena从修理自行车的工作中跳了起来。",
        "Oh it looks fresh too! Wow thanks a lot... Jeez, I almost feel bad for sending you to see Buddy now, heh surprised you even made it back. Well jokes aside I appreciate the food... It looks delicious":
            "哦，它看起来也很新鲜！哇，非常感谢……天哪，我几乎对让你去见Buddy感到抱歉，呵呵，惊讶你居然回来了。好吧，玩笑归玩笑，我很感激这份食物……它看起来很美味。",
        "Myena takes a bite into the snack and begins savouring the taste while swaying her head side to side in thought":
            "Myena咬了一口零食，开始品味其味道，同时一边思考一边摇头晃脑。",
        "Meat... Hmmmmm": "肉……嗯嗯。",
        "Myena continues to bite into the snack, chewing and swaying": "Myena继续咬着零食，咀嚼着并摇晃着。",
        "Yeah sure, Meat... You'll like Meat, he's a really likeable guy\" *Myena chuckles* \"Yup. Meat, he's an expert in all things Zed related. If you go meet with him in the butchers shed at the market you will likely learn a thing or two. I'm hoping he might still have that Police RFID he found a while back, if you do a few hunts for him - I'm sure he'll hand it over no problems. Meat is a nice guy, don't forget that":
            '是啊，肉……你会喜欢他的，他是个非常讨人喜欢的人" *Myena笑着说* "没错。Meat是个关于丧尸的一切的专家。如果你去市场的屠夫棚见他，你可能会学到一些东西。我希望他还保留着前段时间找到的那个警察射频ID，如果你为他猎杀一些东西——我确信他会毫无问题地交给你。Meat是个好人，别忘了。',
        "Objective: Get Police RFID from Meat": "目标：从Meat那里获得警察射频ID。",
        //---------------/ Myena-5
        "Meat actually gave your the Police RFID huh? I knew he'd be just the most helpful. Alright that's step one I guess":
            "Meat真的把警用射频ID给你了？我就知道他最乐于助人。好吧，这算是第一步了。",
        "Myena uses her wrench to tighten a bolt on her bike then stands up to face you": "Myena用扳手拧紧了她摩托车上的一个螺栓，然后站起来面对你。",
        "So this is what I'm thinking... The armoury in the Police HQ has all sorts of high value goods, if you can get me in there, I'm sure there'll be something I can use to get this bike started. All I need is the key to open the armoury door":
            "所以我的想法是……警察总部的军械库里有各种高价值物品，如果你能带我进去，我肯定能找到点东西让这辆摩托车重新启动。我需要的只是打开军械库门的钥匙。",
        "Myena holds her chin and begins to think a bit": "Myena托着下巴，开始思考。",
        "There has to be a key in the building somewhere right? I mean every other office bound police officer probably carried one right? Maybe we could go hunting in the Foyer of the Police HQ to find a silver key":
            "大楼里应该有一把钥匙，对吧？我是说，每个坐办公室的警察可能都会带一把，对吧？也许我们可以去警察总部的大堂找一把银色钥匙。",
        "Objective: Find silver key in Police Foyer": "目标：在（警察总部）大堂，找到银色钥匙",
        //---------------/ Myena-6
        "You walk in seeing a battered and bruised Myena weeping quiet tears next to her bike with her head in her crossed arms, she throws her wrench to the floor and elbows her precious project in anger":
            "你走进房间，看见满身伤痕的Myena趴在她的自行车旁，轻声抽泣着，把头埋在交叉的手臂间，她愤怒地将扳手扔到地上，还用肘部撞了撞她心爱的项目。",
        "Stupid fucking thing! I fucked it all up": "该死的东西！我把一切都搞砸了。",
        "Meyna sulks her head deeper into her crossed arms": "Myena将头更深地埋进交叉的手臂中。",
        "I lost the key, I couldn't even get in the armoury. I was completely swamped in the foyer and never even managed to see the armoury door. I've no idea how you survived it":
            "我把钥匙弄丢了，我连军械库都没进去。在大厅我被完全压制，甚至连军械库的门都没看到。我真不知道你是怎么活下来的。",
        "Myena wipes away her tears with her wrist and looks up to you": "Myena用手腕擦了擦眼泪，抬头看着你。",
        "Augh.. I dunno, I thought I could handle it but maybe I was still under prepared": "唉……我不知道，我以为我能应付，但可能我还是准备不足。",
        "Myena stands up and begins to dust herself off and fix her hair": "Myena站起来，开始拍去身上的灰尘，并整理头发。",
        "Maybe you could check it out for me? Just go in and tell me what you find. Maybe it's just a bust after all":
            "或许你可以替我去看看？进去之后告诉我你发现了什么。或许那根本没什么价值。",
        "Objective: Investigate armoury": "目标：在（警察总部）调查军械库",

        //---------------/ Chocolate Chuck-1
        "Training is hard, but with more Morale it becomes easier and faster to get those gains": "训练很难，但士气越高，练出成果就越轻松、越快。",
        "A good way to get Morale is with Food that provides it, such as Chocolate and different Canned Foods or Cooked Fish": "提升士气的好办法是吃些能增加士气的食物，比如巧克力、各种罐头食品，或是煮熟的鱼。",
        "Chocolate can be found on all Bloater Zeds. We can normally find some in the Cinema": "所有鼓胀的僵尸身上都能找到巧克力。我们通常能在电影院里找到一些。",
        "Objective: Kill 5 Zeds in the Maintenance Room (Cinema": "任务目标：在（电影院）维修室杀死 5 只僵尸",
        //---------------/ Chocolate Chuck-2
        "Now you have some chocolate, head to your Inventory and eat as much as you can. This will raise your morale, and therefore your Gym Gains":
            "现在你有一些巧克力，前往你的 背包（增强剂）并尽可能多吃。这会提升你的士气，进而提升你的健身房收益。",
        "Now head to the gym and put that Morale and Energy to use": "现在前往健身房，好好利用那份士气和能量。",
        "Objective: Train in the gym after eating Chocolate": "目标：吃完巧克力后在（据点）健身房训练",
        //---------------/ Chocolate Chuck-3
        "When you run out of Boosters such as Chocolate, it's a good idea to restock": "当你用完像巧克力这样的增益物品时，补充一些库存是个好主意。",
        "And where do we get Chocolate from? That's right, Bloaters": "那我们从哪里获取巧克力呢？没错，是丧尸\"膨胀者\"。",
        "Head on down to the Cinema again, and let's find some Chocolate": "再次前往电影院，我们去找些巧克力吧。",
        "Objective: Kill 10 Zeds in the Maintenance Room (Cinema": "目标：在（电影院）维修室杀死 10 只僵尸",
        //---------------/ Chocolate Chuck-4
        "Each time we eat Chocolate, our Booster cooldown increases. This occurs for all consumables, including Beer, Canned Food and Cooked Fish":
            "每次我们吃巧克力，增益冷却时间就会增加。所有消耗品都是如此，包括啤酒、罐头食品和煮熟的鱼。",
        "All consumables increase your Booster Cooldown": "所有消耗品都会增加你的增益冷却时间。",
        "Eat some Chocolate and check your Booster Cooldown. Then head to the Gym and train": "吃一些巧克力，查看你的增益冷却时间。然后前往健身房训练。",
        //---------------/ Chocolate Chuck-5
        "Now that you understand how Morale and Gym work together. It's a good idea to go stock up again":
            "既然你已经了解了士气和健身房是如何协同作用的，那么再次去储备物资是个不错的主意。",
        "Head to the Cinema for more Chocolate": "前往电影院获取更多巧克力。",
        "Objective: Kill 15 Zeds in the Maintenance Room (Cinema": "任务目标：在（电影院）维修室杀死 15 只僵尸。",
        //---------------/ Chocolate Chuck-6
        "Now you've got a steady supply of Chocolate and training, keep it up": "现在你已经有了稳定的巧克力供应和训练，继续保持下去。",
        "Train like this every day and you'll be strong in no time": "每天都这样训练，你很快就会变得强壮！",
        //---------------/ Chocolate Chuck-7
        "Keep on training, do a massive push, I know you can": "继续训练，加把劲，我知道你可以的。",
        "After this final push you should be much stronger": "在这最后一搏之后，你应该会强壮很多。",
        "Objective: Train 50x in the gym after eating Chocolate": "任务目标：吃完巧克力后在（据点）健身房训练 50 次",

        //----------------/ Garbo-1
        "A large man stands by a hand made metal forge and an anvil. He looks over his tools and equipment, handling different objects, picking them up inspecting quickly and then placing them back down again, fiddling with a random assort of items while speaking to himself in confused muddled sentences":
            "一个大块头男人站在手工打造的金属炉和铁砧旁。他查看着自己的工具和设备，拿起不同的物品快速检查后再放回原位，一边摆弄着各种乱七八糟的物件，一边自言自语着一些混乱不清的句子。",
        "Scrap? Metals? Titanium!!! Ohhhh titanium, I love titanium. Ohhhhh what I’d do to rub my fingers across some titanium. Oh. Huh. Oh, I see you. Come here, what have you got in your pockets":
            "废料？金属？钛！！！哦，钛，我爱钛。哦，我多想摸摸钛。哦。嗯？哦，我看到你了。过来，你口袋里有什么？",
        "He pulls you in and rifles through your pockets": "他把你拉过去，翻找你的口袋。",
        "Oh no no no, all pretty useless. You’re not a very good hoarder are you": "哦，不不不，都是些没用的东西。你可不是个合格的囤货者，对吧。",
        "He pushes you away in disinterest": "他失去兴趣地把你推开。",
        "Come back when you've got something of value to me": "等你有对我有价值的东西再回来吧。",
        "Objective: Provide iron bars": "目标：提供铁锭",
        //----------------/ Garbo-2
        "Those iron bars sure came in handy kid. Crafted this pickaxe to go get me a nice supply of coal from the nearby mines":
            "那些铁锭真是派上了大用场，小子。我用它们打造了这把镐子，准备去附近的矿井采一批煤。",
        "You look around the workshop": "你环顾了一下车间。",
        "Hey y'know what maybe you could get me some coal, call it a favour for a favour. Just head over there and look out for the dark veins on the cave walls. Hammer away and bring back what you find":
            "嘿，你知道吗，也许你可以帮我挖点煤，算是人情换人情。去那边看看洞壁上的黑色矿脉，挥动锤子，带回你找到的东西。",
        "Objective: Mine coal and give it to Garbo": "目标：在（拾荒）开采煤矿并交给Garbo",
        //----------------/ Garbo-3
        "Yeah! This is some quick quality coal you know how to extract the perfect gems. Tell you what I'll give you the iron bars I had left from making the Pickaxe":
            "是啊！这是些优质煤，你真知道如何提取完美的宝石。这样吧，我把做镐子剩下的铁条给你。",
        "Have you seen those 'handmades' everyones using to take out zeds? It's like a makeshift gun thats easy to fabricate, if you can give me 1000 cash I'll give you some bullets for training practice":
            "你见过大家用来对付丧尸的那些“手工枪”吗？那是一种易于制作的简易枪，如果你能给我1000现金，我就给你一些子弹用来练习。",
        "Objective: Give cash": "目标：提供现金",
        //----------------/ Garbo-4
        "Yeaaa kid! I hope you tried out some of those simple bullets on some deserving zeds":
            "太棒了，小子！我希望你已经用那些简易子弹对付过一些该死的丧尸了。",
        "You give him a reassuring look with a smirk": "你带着一丝微笑，给了他一个让人安心的眼神。",
        "Now those are okay for getting rid of the smaller zeds and the easier to kill things, but to get the job done in harder areas you'll need a bit more fire power":
            "那些子弹对付小型丧尸和容易杀死的目标还可以，但在更困难的区域完成任务，你需要更强大的火力。",
        "You nod in understanding": "你点头表示理解。",
        "Bring me some gunpowder and I'll show you how we go about crafting more complex bullet types": "带点火药来，我会教你如何制作更复杂的子弹。",
        "Objective: Bring gunpowder": "目标：带来火药",
        //----------------/ Garbo-5
        "Now I've shown you how to make your own pistol ammo, prove your adept and fashion me some high quality bullets. Go back to your ammo bench and craft enough for me to go do some target practice":
            "现在我已经教你如何制作自己的手枪弹药，证明你的熟练程度，给我打造一些高质量的子弹。回到你的弹药台，为我制作足够的子弹用于练习射击。",
        "Objective: Craft pistol ammo": "目标：制作手枪弹药。",
        //----------------/ Garbo-6
        "Garbo can be seen sitting quietly in thought staring into the embers of a coldly lit fire": "Garbo 坐在那里静静地沉思，盯着一堆冷火的余烬。",
        "Aw what's the use": "唉，这又有什么用呢。",
        "You walk over and place a hand on his shoulder": "你走过去，把手放在他的肩膀上。",
        "You wouldn't believe it... My kitten Geoffrey went missing, heading towards the old Police HQ":
            "你不会相信的……我的小猫 Geoffrey 失踪了，跑向了旧警察总部。",
        "His eyes start to tear up": "他的眼中开始噙满泪水。",
        "I know it's suicide I know, I know it's stupid... But listen, kid... If you can do this for me, I'll be in your debt":
            "我知道这无异于自杀，我知道，这很愚蠢……但是听着，孩子……如果你能为我做到这一点，我会感激不尽。",
        "Garbo drops to his knees": "Garbo 跪了下来。",
        "Please survivor, find my poor Geoffrey": "请，幸存者，找到我可怜的 Geoffrey。",
        "Objective: Scout the police foyer": "目标：侦查警察总部的大堂",
        //----------------/ Garbo-7
        "So you saw Geoffrey? Meowing from the Armoury? Jesus how'd he get in there that little shit":
            "你看到了Geoffrey？从军械库里喵喵叫？天啊，那小家伙是怎么进去的。",
        "Garbo fumbles his glasses while wiping them down before placing them back onto his noise":
            "Garbo一边擦拭眼镜一边笨手笨脚地把它们重新戴回鼻梁上。",
        "Well I guess there's nothing else for it then. You survived the foyer maybe you can survive the Armoury. After all you could just open the door and run away, that'd do the trick":
            "好吧，那看来别无选择了。你活着从大厅出来了，或许你也能从军械库活着出来。毕竟，你可以开门然后立刻跑掉，这也能解决问题。",
        "Objective: Open Armoury door": "目标：打开军械库的门",
        //----------------/ Garbo-8
        "You did it! You did it!, Geoffrey is back! He was terrified and ran straight up into my arms":
            "你成功了！你成功了！Geoffrey回来了！他吓坏了，直接跑到我怀里。",
        "Garbo coughs and collects himself": "Garbo咳嗽了一下，整理了下情绪。",
        "Well... Ooph. Now that everything is back to normal maybe I can get back to some good old smithin":
            "嗯……呼。一切都恢复正常了，也许我可以重新开始做一些老本行的打铁活了。",
        "Garbo pets his cat and walks up to a draw opening it while staring deeply into it's contents":
            "Garbo抚摸着他的猫，走到一个抽屉旁打开它，深深地凝视着里面的东西。",
        "So, what else could I give you for opening the armoury door? Money and resources mean nothing. I've had this coin since before even the zeds were around. My lucky coin. Trust me, one day... You'll find yourself in a dead end, or in some dark situation... And this coin, well it'll help you find a way out. Just give me one coin to replace it":
            "那么，为了你打开军械库的门我还能给你什么？金钱和资源都没有意义。这枚硬币我在丧尸出现之前就有了。这是我的幸运币。相信我，总有一天……你会陷入绝境，或者某个黑暗的情况……这枚硬币，它会帮你找到出路。只需要给我一枚硬币来替换它。",
        "Thanks again survivor": "再次感谢你，幸存者。",
        "Objective: Give a coin": "目标：交出一枚硬币",
        //----------------Garbo-9
        "Hey kid, wanna see what I've been working on": "嘿，孩子，想看看我在搞什么吗？",
        "You walk over as Garbo lifts a sheet off a glorious looking classic motor": "你走过去时，Garbo掀开了一块布，露出了一辆华丽的经典摩托车。",
        "She's a beauty ain't she": "她真漂亮，不是吗？",
        "You stare for a while with a little bit of envy": "你盯着看了一会儿，有点嫉妒。",
        "Yep, found her while searching through the scrapheap. Maybe we could get her runnin' wha'dya think? Just need a bit fuel is all":
            "是啊，我在翻废品堆时找到的。也许我们可以让她重新跑起来，你觉得呢？只需要一点燃料。",
        "Objective: Bring fuel": "目标：带来燃料",
        //----------------/ Garbo-10
        "Hey you actually found some fuel!? Fantastic": "嘿，你真的找到了一些燃料！？太棒了。",
        "Garbo looks around at his workshop, piles of junk up to the ceiling every place he looks":
            "Garbo环顾他的工作间，每个角落都堆满了堆到天花板的垃圾。",
        "Sigh... Maybe it was just a pipe dream I've no idea where I could start working on this thing":
            "唉……也许这只是个幻想，我不知道从哪里开始修理这东西。",
        "Garbo places a hand on the car leaning in with a big sigh": "Garbo把手放在车上，深深地叹了口气。",
        "Wait, y'know what... If you've got the room maybe you could start working on it? Only thing is you'll need a big enough garage to work on it":
            "等等，你知道吗……要是你有地方的话，或许可以开始着手弄这个了？只不过你需要一个足够大的车库来做这件事。",
        "Objective: Build garage": "目标：建造车库",
        //----------------/ Garbo-11
        "So she's purring over now is she? All working": "那么她现在运转正常了吗？一切都正常吗？",
        "You give Garbo a cheeky smirk and a nod": "你对着加尔博调皮地笑了笑并点了点头",
        "Well! Theres nothing else for it then! I always wanted to go check out the military base not too far from here, but making it on foot would be far too dangerous. How about we take that ride of yours over there and check out what glorious loot the generals quarters has for us":
            "好吧！没有别的办法了！我一直想去看看离这儿不远的军事基地，但步行去那里太危险了。我们开着你的车去那里，看看将军的住所里有什么好东西怎么样？",
        "You reach into your pocket to grab the keys to your new ride": "你把手伸进口袋去拿你新车的钥匙",
        "I guess we'll have to scavenge for a long time or hunt some soldiers to find the key. Let's go":
            "我想我们得花很长时间去搜寻或者猎杀一些士兵来找到钥匙。我们走吧！",
        "Objective: Find Generals RFID by Exploring the Military Base": "目标：在（远征）军事基地里找到将军的射频ID",

        //----------------/ BUDDY-1
        "You hop over a tall fence in a large courtyard surrounded by an old library building. You begin walking inwards, the area is completely concealed with the fence being the only exit. You begin to feel uneasy and the area almost feels like a deathtrap. At that moment two doors open on either side of the courtyard as floods of zombies begin to pour out. With no option but forward or back, you begin to run forward until you crash through the front door of the library and up the stairs. At the top of the stairs a young well muscled man beckons you behind a large door while excitedly laughing, jumping and egging you on":
            "你跳过一座高高的围栏，进入了一个被旧图书馆建筑包围的大庭院。你开始往里走，这片区域完全被封闭，围栏是唯一的出口。你开始感到不安，这地方几乎像个死亡陷阱。就在这时，庭院两侧的两扇门打开，大批丧尸开始涌出。无路可退，你只能往前跑，直到撞开图书馆的前门并冲上楼梯。在楼梯顶端，一个年轻的肌肉发达的男人站在一扇大门后，兴奋地笑着跳跃，鼓励你继续前进。",
        "Woooooh! You made it! Unbelievable! You won’t believe how many people don’t": "哇哦！你成功了！难以置信！你不会相信有多少人没能做到。",
        "You take a moment and look at the man as if he’s crazed": "你稍作停顿，盯着这个男人，仿佛他是个疯子。",
        "What? Can you blame me? You’d have to be crazy to try to raid my place so I already know you’re not here to steal from me, there’s much easier pickings out there. So.. it can only be that Myena told you I was hiding out here… Well, looks like you made it. I’m here and I guess you want to know all my secrets to survival. Well listen here newbie, through hard sweat, blood and tears - we’ll get you to being a top fit survivor. Hell, might even make you like some sort of super hero or something. All it takes is just super focus. Hard training everyday and you can forget about joy and relaxation, we’re gonna be super heroes baby!. Yea super heroes. I can feel it already":
            "什么？你能怪我吗？只有疯子才会试图突袭我的地方，所以我已经知道你不是来偷东西的，外面有更容易的目标。所以……这只能说明Myena告诉你我躲在这里……好吧，看起来你成功了。我在这儿，我猜你是想知道我所有的生存秘密。听好了，新手，通过艰苦的汗水、鲜血和泪水——我们会让你成为顶尖的幸存者。天啊，甚至可能让你变成某种超级英雄或其他什么。只需要超级专注。每天艰苦训练，忘掉快乐和放松，我们要成为超级英雄，宝贝！对，超级英雄。我已经能感觉到了。",
        "Buddy’s tirade about becoming super heroes continues for around 30 minutes until he eventually calms down":
            "Buddy关于成为超级英雄的长篇大论持续了大约30分钟，直到他最终平静下来。",
        "Man all this excitements got me hungry! Can't train on an empty stomach now can we? Try and find me some protein before we get stuck in":
            "伙计，这一切的兴奋让我饿了！空着肚子我们可不能训练，对吧？去帮我找点蛋白质来再开始吧。",
        "Objective: Train hard in the gym": "目标：在健身房刻苦训练",
        //----------------/ BUDDY-2
        "Woah you ripped that gym, but thats a weak start. To get real high gains, you need to increase your morale": "哇哦，你在健身房练得挺猛啊，但这只是个薄弱的开始。要想真正练出好身材，你得提高自己的士气。",
        "I gave you 5 chocolate to help get you started. Take the chocolate before working out this time, then come back to me": "我给了你 5 块巧克力帮你开个头。这次锻炼前把巧克力吃了，然后再回来找我。",
        "Objective: Train hard in gym after eating Chocolate": "目标：吃完巧克力后在健身房刻苦训练",
        //----------------/ BUDDY-3
        "Woooooah you're lookin' ripped as high hell" : "哇哦，你看起来壮得离谱啊",
        "Buddy flexes himself to reassure himself of his own strength" :
            "Buddy绷紧肌肉，以此确认自己的力量",
        "Alright that's some good work there but I can see some of the regimen you're missing, and I don't think your crappy little gyms gonna help with that" :
            "行啊，这训练效果不错，但我能看出你还缺了些训练项目，而且我觉得你那破健身房可帮不了你。",
        "Buddy smirks as he mocks your tiny little gym while he glances around his sparkly glorious warrior training centre" :
            "Buddy瞥了眼自己那闪闪发光、超棒的勇士训练中心，一边嘲笑你那小破健身房，一边得意地笑了笑",
        "So I think you know what's gotta be done huh? Go find yourself all the parts you need to make a more substantial gym, get some more of the equipment you need. Then you'll really be flyin" :
            "所以我觉得你该知道该怎么做了吧？去找到所有需要的零件，打造一个更像样的健身房，添置更多你需要的器材。到时候你才能真正的突飞猛进。",
        "Objective: Upgrade your gym" : "目标：升级你的健身房",
        //----------------/ BUDDY-4
        "Buddy stops you as your walk in, holding you back on your shoulder looking you up and down, taking in the changes as if weighing up his next car at the showroom": "Buddy 在你走进来时拦住了你，按住你的肩膀上下打量着你，留意着你的变化，仿佛在展厅里掂量他下一辆车似的",
        "Lookin' good eh, really been hitting the gym a lot? It's what I like to see":
            "看起来不错嘛，最近常去健身？这正是我想看到的",
        "Buddy backs off a sits to begin repping his dumbbells before looking you in the eye":
            "Buddy 退后一步坐下，开始举哑铃，然后直视着你的眼睛",
        "Think you got what it takes to handle the Concession Stand at the Arcade? I hear a few weaker zeds hang out there, it could be a good training grounds for you":
            "你觉得自己有能力搞定游戏厅的小吃摊吗？我听说有几只较弱的僵尸在那晃悠，对你来说或许是个不错的训练场",
        "Objective: Hunt Concession Stands": "目标：狩猎小吃摊",
        //----------------/ BUDDY-5
        "Buddy looks you up and down as you walk in covered in blood and exhausted from fighting zeds":
            "Buddy上下打量着你 —— 你走进来的时候浑身是血，跟僵尸打完一架后累得不行",
        "Haha! You actually survived! Now that's what I like to see. You sure got spirit. Could probably handle hunting in my own compound one day. Here, I'll give you my pass, this means my traps won't trigger for you and you can hunt in the compound":
            "哈哈！你居然活下来了！这才是我想看到的。你小子确实有种。说不定哪天就能在我这院子里打猎了。来，我把我的通行证给你，有了这个，我的陷阱就不会对你触发，你就能在院子里打猎了。",
        "Buddy looks around for a bit, weighing up what survival items he might need": "Buddy四处看了看，琢磨着自己可能需要哪些生存物资",
        "Y'know I've been looking for some tarp recently to extend my gym with an outdoor area maybe you could help me out? Theres tons of tarp lying around in the compound, just gotta watch out for the zed":
            "对了，我最近一直在找些防水布，想把健身房扩建一下，弄个户外区域。或许你能帮我这个忙？院子里到处都是防水布，就是得小心那些僵尸。",
        "Objective: Collect tarp from Buddys Compound": "目标：从Buddy的院子里收集防水布",
        //----------------/ BUDDY-6
        "Cho! Sweet you got the tarp! I can't wait to finish up the gym now": "瞧！看看是谁来了，你拿到防水布了！我现在迫不及待想把健身房完工了",
        "Buddy takes the tarp and sets its aside": "Buddy拿起防水布，把它放到一边",
        "I'm hyped as sally, I can't wait to see this place all built out": "我真是太兴奋了，已经迫不及待地想看到这个地方完全建好的样子了！",
        "Buddy takes a look at you with a friendlier smirk that normal": "Buddy看了你一眼，笑容比平时更友好一些",
        "You really oughta think about doin' the same upgrades in your gym. Match mine and I'll give you a reward I've been looking for the right person to pass it on to":
            "你真该考虑在你的健身房也做同样的升级。要是跟我的（健身房）一样，我就把我一直在找合适的人传下去的一件奖励给你。",

        //----------------/ MEAT-1
        "Using the back alley of the market you walk towards the area marked with wooden signs saying “Meat”. You begin to follow the smell of rotting flesh and blood until you happen upon a white door covered in bloody handprints. You go inside the darkly lit warehouse, chains can be heard rustling around and within the room all sorts of different zed types can be seen hanging from any form of implement that would support the body. Some bodies strewn in half left laying where the detachment occurred. You hear the noise of a knife being sharpened as you enter further in, eventually gaining sight of a large figure chiselled adorning advanced military uniform beginning to cut away the jaw of his captured zed. He finishes his cut, drops it onto the table then turns to you as if you’d interrupted some important work":
            "沿着市场的后巷，你走向标有“Meat”木牌的区域。你开始追踪腐肉和血液的气味，直到你来到一扇满是血手印的白色门前。你走进这间灯光昏暗的仓库，能听到铁链的沙沙声，房间里各种不同的类型的丧尸悬挂在任何可以支撑尸体的器具上。有些身体被拦腰截断，躺在分离的地方。随着你深入，听到刀子磨砺的声音，最终看见一个穿着高级军装的巨大身影开始切割他抓获的丧尸的下巴。他完成切割，把它扔到桌子上，然后转向你，仿佛你打断了什么重要的工作。",
        "What? You gonna fuckin’ stare all day? Come here and hold it’s legs that always makes this next bit easier":
            "什么？你打算整天就这么盯着？过来抓住它的腿，这总会让接下来的部分更容易。",
        "You go over and hold both the zeds legs as the man begins cutting across the creature's torso for tearing into its rotting flesh":
            "你走过去抓住了丧尸的双腿，这个男人开始横切生物的躯干，剥开其腐烂的肉体。",
        "So another of Myenas lost puppy dogs huh, well… I guess you do seem a bit different, you haven’t vomited from the smell yet":
            "所以又是一个Myena的小跟班，对吧？嗯……不过我觉得你有点不同，你还没因为这味道呕吐。",
        "You continue cutting up the zed until nothing remains in the original place of the creature, each part of the zed now laid out on the table in front of you":
            "你继续切割丧尸，直到生物的原貌不复存在，丧尸的每一部分现在都被整齐地放在你面前的桌子上。",
        "I guess that's it then. Thanks for the help. Listen, I always need a little help clearing a few of these guys out of nearby areas, to keep it safe for me to collect samples and the like. If you could start clearing out the Concession Stand at the Arcade I could head there next":
            "我想就这样吧，谢谢你的帮助。听着，我总是需要一点帮助来清理附近区域的这些家伙，以便我可以安全地收集样本之类的东西。如果你能开始清理街机的特许摊位，我就可以接着去那里。",
        "Objective: Clear Concession Stand": "目标：在（游戏厅）清理小吃摊。",
        //----------------/ MEAT-2
        "Hey! It's you! You cleared the concession stands recently, I really appreciate it now I can go collect all the chopped up bodies and bring them back for dissection! Perfectly safe":
            "嘿！是你！你最近清理了小吃摊，真是太感谢了，现在我可以去收集所有被切碎的尸体带回来解剖了！完全安全。",
        "Meat hums a nice song while continuing cutting away at his cadavers": "Meat 一边哼着轻快的曲子，一边继续切割他的尸体。",
        "Y'know, I was thinking recently about the Hall of Mirrors in the Arcade, I've seen some real freaky things in there and heck I'd love to go check 'em out. Whadya say? Wanna go clear it for me":
            "你知道吗，我最近在想游乐场的镜子大厅，我在那里看到了一些非常怪异的东西，天哪，我真想去看看。你觉得怎么样？愿意帮我清理一下吗？",
        "Objective: Clear Hall of Mirrors": "目标：在（游戏厅）清理镜厅",
        //----------------/ MEAT-3
        "Chop chop chop, strip strip strip": "咔嚓咔嚓咔嚓，剥剥剥",
        "Meat chops happily away at a large collection of body parts assorted into groups on the table laid out before him":
            "丧尸屠夫开心地切割着桌上按类别分组的大量尸体部件",
        "Business is gooood my chum! You really do clear out the zones with extra special care. Bravo! I'm gonna keep chopping and hacking away enjoying my merry little self":
            "生意兴隆啊，我的朋友！你清理区域真的非常细致。好样的！我会继续高高兴兴地切切砍砍。",
        "Meat continues chopping away while you stand awaiting more information about the Police RFID you came for":
            "丧尸屠夫继续切割着，你站在那里等待关于你来找的警察射频ID的更多信息。",
        "Mhm *grumble*, did you ever see 'Day of the Zed' back in the day? That's my favourite film... Sure was a good movie":
            "嗯哼，*嘟囔*，你以前看过《丧尸之日》吗？那是我最喜欢的电影……真是一部好电影。",
        "Meat chuckles to himself": "丧尸屠夫自顾自地轻笑起来。",
        "Sure would be nice if the Maintenance Room in the Cinema were clear. Then someone could go secure a copy of that movie... For historical purposes obviously":
            "如果能清理一下电影院的维修室就太好了。然后就能找到那部电影的拷贝……当然是为了历史研究用途。",
        "Objective: Clear Maintenance Room": "目标：在（电影院）清理维修室",
        //----------------/ MEAT-4
        "Ahhh good ol' 'Day of the Zed' I sure get a kick out of that movie": "啊，经典的《丧尸之日》，我真的很喜欢那部电影。",
        "Meat sits back in his chair with 'Day of the Zed' paused on the TV in the background":
            "丧尸屠夫靠在椅子上，背景的电视上暂停着《丧尸之日》。",
        "You know what'd be funny right? We have the same situation here if you look around. We even have a mall not too far from here, just like in the film. I sure would love to see what that feels like walking around a mall full of zeds":
            "你知道什么有趣吗？看看周围，我们这里的情况跟电影里一模一样。我们甚至有一个离这里不远的购物中心，就像电影里那样。我真想感受一下在满是丧尸的购物中心里走来走去的感觉。",
        "Meat takes his eyes away from the film for the first time since you arrived to look over at you with an expecting smirk":
            "自你到来后，丧尸屠夫第一次将目光从电影中移开，带着期待的微笑看向你。",
        "You think to yourself... What have you gotten yourself into this time": "你心里想……这次自己又惹上了什么麻烦。",
        "Objective: Clear Food Court": "目标：在（购物中心）清理美食广场",
        //----------------/ MEAT-5
        "Haha heck yes! I enjoyed the the mall so much it was fantastic! Just like in the films, I even shot a zed or two myself":
            "哈哈，当然！我太喜欢逛那个商场了，太棒了！就像电影里一样，我甚至亲手射杀了一个丧尸。",
        "Meat excitedly fidgets in his chair licking his lips and rubbing his hands as if to eat seconds at an all you can eat buffet":
            "Meat兴奋地在椅子上坐立不安，舔了舔嘴唇，搓着双手，仿佛在自助餐厅准备吃第二轮。",
        "You knooow, there was also a scene in the film where they visited a police station. I'll leave you with my Police RFID I found, maybe you can make some use of it and be just like the heroes in the film... Just don't end up dead like they did":
            "你知道吗，电影里还有一段是他们去了警察局。我把我找到的警用射频识别卡留给你，也许你能用上，像电影里的英雄一样……但千万别像他们那样死掉了。",
        "You squint and wait for the next ridiculous request": "你眯起眼睛，等待他接下来的荒唐请求。",
        "Y'know I just don't got it in me this time to get up and go. Maybe you could just collect some zed juice for me to work on my latest pieces? I'll give you a good reward. Promise this time":
            "你知道吗，这次我实在提不起劲去做了。也许你可以帮我收集一些丧尸汁，我好继续研究我的最新作品？这次我保证会给你个好报酬。",
        "Objective: Collect Zed Juice": "目标：收集丧尸汁",

        //---------------Gray未整理的任務
        "Making your way through the city, a stray shadow catches your eye": "你穿行在城市中，一道漂浮的阴影吸引了你的注意。",
        "There, in an alley, stands a very tall man. Clad in all gray, from toe to wide-brimmed hat, he  looks very at home in the ash-covered surroundings. Even the sunglasses he's wearing are a slate gray that show no hint of the eyes behind them":
            "在那里，在一条巷子里，站着一个非常高大的男人。全身灰色打扮，从脚到宽边帽，看起来非常适应这片灰烬覆盖的环境。即便是他戴的太阳镜也是石板灰色，完全遮掩了眼睛。",
        "A raspy chuckle escapes him as he notices your attention, followed by the worst smoker's voice you have ever heard":
            "他注意到你的目光，发出沙哑的笑声，接着是你听过的最糟糕的烟民声音。",
        "Nice weather we're having, eh": "我们现在的天气真不错，嗯？",
        "The stranger puts a cigarette in his mouth and shields it as he goes to light it, taking a long drag from it right after":
            "那陌生人把烟塞进嘴里，遮住它点燃，随即深吸了一口。",
        "You know what, I like you, I can tell there is a strong fire burning inside you, or at least a stronger one than most of the yellowbellies around here... Call me Gray, Gray Gary. I think we will be good friends":
            "你知道吗，我喜欢你，我能看出你内心有着强烈的火焰，或者至少比这里大多数胆小鬼要强烈……叫我灰袍Gary吧。我觉得我们会是好朋友。",
        "A shiver runs down your spine but Gray continues right away": "一阵寒意袭过你的脊背，但Gray立刻继续说道。",
        "I have a special little reward that I think you will like. Bring me some Ash and I'll tell you more about it, hmm":
            "我有一个特别的奖励，我想你会喜欢。带些灰烬给我，我会告诉你更多，嗯。",
        "You look around you at all the ash falling from the sky and raise an eyebrow at him": "你四下环顾，看到满天的灰烬落下，不禁扬起一眉。",
        "Gray gives out another raspy chuckle and then speaks": "Gray再次发出沙哑的笑声，然后说道",
        "Not this regular, useless stuff, no. I need something a bit more special, fresh, in a sense. You'll know it when you see it, I assure you":
            "不是这种普通、没用的东西，不。我要的是一些更特别、更新鲜的东西。你看到时会知道的，我敢保证。",
        "Gray takes another long drag of his cigarette, nearly done with it already, and nods his head towards a direction behind you":
            "Gray再次深吸了一口烟，几乎快抽完了，他朝你身后点了点头。",
        "In fact, there is a nice new place in the city that should help you out": "实际上，城市里有个新地方，应该能帮到你。",
        "You instinctively glance behind you in the direction he nodded, and when you glance back he's already gone":
            "你本能地回头看向他点头的方向，转身时发现他已经不见了。",
        "Objective: Find enough ash to satisfy Gray Gary": "目标：找到足够的灰烬满足灰袍Gary",

        "Loaded with a good amount of the weird ash, you walk back to the alleyway you saw Gray": "带着大量奇怪的灰烬，你走回了你见到Gray的巷子",
        "Not even a few moments into your journey you hear the familiar raspy chuckle coming from a completely different alleyway. Turning your head, you see Gary standing there, staring at you with a grin on his face and lit cigarette in his lips":
            "刚开始几步，你就听到从完全不同的巷子里传来熟悉的沙哑笑声。你转过头，看到Gary站在那里，脸上带着笑容，嘴里叼着点燃的香烟",
        "Well look at that, seems you have some ash. Were you going to look for me? Well, then it's a happy coincidence I was in the area, eh":
            "哟，看起来你有些灰烬。你是来找我的吗？那真是巧了，我正好在附近",
        "Waving you towards the alley you cautiously follow him in, only going in far enough to be out of the view of the main street":
            "他向你挥手示意走进巷子，你小心地跟随他进去，只走到足够远以便不被主街看到",
        "Gary turns around and makes a 'gimme' gesture with a smirk on his face": "Gary转过身，露出一丝得意的笑容，做出“给我”手势",
        "You give him the ash and watch as he pokes it a bit with his finger before nodding in satisfaction":
            "你把灰烬递给他，看到他用手指戳了戳，然后满意地点点头",
        "Not bad, not bad at all. Now, about that reward of yours": "不错，不错。现在，关于你的奖励",
        "Humming, he takes a small drag of his cigarette before continuing": "他哼着歌，吸了一小口香烟，然后继续说道",
        "Now, there's a beautiful lil' memorabilia I have to give you, but I'll need you to do a bit more for me to part with it. The old guy in the new place has been working on some fancy new things and I can't get them from him myself. Be a dear and grab me one each of his vials so I can take a looksie at them, hmm":
            "现在，我有个漂亮的小纪念品要给你，但你得为我做点事才能得到它。那个新地方的老家伙在做一些花哨的新东西，而我自己拿不到。帮我拿一瓶他的新瓶子来，我好看看，怎么样",
        "Gary punctuates the request with a very long drag of his cigarette, enough to finish all that was left of it, and he blows out a massive cloud of smoke in your face":
            "Gary在说完请求后长时间吸了一口香烟，足够把它吸完，然后他朝你脸上吐出一大团烟雾",
        "By the time you wave it away, he's gone": "当你挥手把烟雾赶走时，他已经不见了",
        "Objective: Find the vials to satisfy Gray Gary": "目标：找到瓶子满足灰袍Gary",
        "Passing one more alleyway, you are ready to deliver the vials to Gray, and as soon as you have the thought the familiar raspy chuckle rings out from the empty alleyway you just passed. You turn back and there Gray is, leaning on the wall with a lit cigarette in his fingers":
            "经过另一条巷子，你准备把瓶子交给Gray，就在你有这个念头时，熟悉的沙哑笑声从你刚刚经过的空巷传来。你回头一看，Gray正靠在墙上，手指间夹着点燃的香烟",
        "Fancy seeing you here, eh? Now about them vials": "真巧在这儿见到你，怎么样，瓶子呢",
        "You hand them over one by one and watch the interest in his expression grow": "你一瓶一瓶地交给他，看着他脸上兴趣愈发浓厚",
        "Gray holds one up in the air and looks at it. Some trick in the light made it seem like there is a red glow behind his shades for a moment, but aside from just watching the vial he seems to do nothing":
            "Gray举起一瓶看着它。光线的某种折射让它看起来像是他的墨镜后面闪烁着红光，但除了看着瓶子，他似乎什么也没做",
        "Well, Mr Wrinkly-With-An-Attitude has outdone himself this time, this is good stuff":
            "好吧，这次那个态度十足的皱皮老头真是出乎意料，这可是好东西",
        "Satisfied with his inspection, Gray pockets all the vials and turns to you with a odd smile and a raised eyebrow":
            "Gray对他的检查很满意，把所有瓶子收进口袋，然后转身看着你，带着一丝奇怪的微笑和挑起的眉毛",
        "Now, I know exactly what you can do to earn yourself that nice reward. Get me two dozen of each different vial and a lot more of that ash from before and you'll we well rewarded, hmm":
            "现在，我知道你可以做什么来获得那份奖励。给我每种瓶子各拿两打，再加上更多的灰烬，你会得到很丰厚的奖励，怎么样",
        "Gray flicks the spent cigarette past you and walks away casually into the alleyway, his footsteps oddly loud":
            "Gray把用完的香烟弹过你，随意地走进巷子里，他的脚步声奇怪地响亮",
        "Don't worry about finding me, just get the stuff and you'll get your reward": "不用担心怎么找到我，只要拿到东西，你就能得到奖励",
        "You watch him walk away until he turns a corner and finally go back yourself as well, the empty alleyway still echoing with Gray's footsteps":
            "你看着他走到拐角处，直到他消失，你自己也回去了，空旷的巷子里依然回响着Gray的脚步声",
        "Objective: Procure a large number of vials and ash for Gray": "目标：为Gray获取大量瓶子和灰烬",

        //----------------/ Market Trader-1
        "Welcome to the city, survivor. Money making can be tough in this city so it's important to know where you can buy and sell supplies to keep up your stocks":
            "欢迎来到这座城市，幸存者。在这座城市里赚钱并不容易，所以知道在哪里买卖物资来维持库存很重要",
        "Let's get started, head over to the Zed Mart and pick up some Canned Food": "我们开始吧，前往丧尸商场，拿一些罐头食品",
        "Objective: Provide Canned Food from the Zed Mart (Visit the City": "目标：从（城市）丧尸商场获取罐头食品",
        //----------------/ Market Trader-2
        "So you found the shops? Great. Now, to make sure you always have a weapon available, you could always head over to Glockbuster for a weapon":
            "你找到那些商店了？太好了。要确保自己随时有武器可用，你可以找 Glock杀手 买",
        "Why don't you head over to Glockbuster and get me a Baton": "不如你去找 Glock杀手 在那给我买一把警棍来吧",
        "Objective: Provide 1x Baton from Glockbuster (Visit the City": "目标：从（城市）Glock杀手 那获取 1 把警棍",
        //----------------/ Market Trader-3
        "Sometimes weapons aren't enough to get you what you need. Sometimes a little finesse is what's required":
            "有时候，光有武器并不足以让你得到想要的东西。有时候，你需要的是一点技巧",
        "Go to the Toolsmith and grab a Lockpick. These can be used when breaking into places":
            "去工具店买一把开锁器。这些东西可以在闯入地方时使用",
        "Objective: Provide 1x Lockpick from the Toolsmith (Visit the City": "目标：从（城市）工具店获取 1 把开锁器",
        //----------------/ Market Trader-4
        "Now when you're exploring, you might take a little damage from time to time. It's a good idea to wear some armour to dampen the blow":
            "如今在探索时，你时不时可能会受到一些伤害。穿上一些盔甲来减轻打击是个不错的主意",
        "Go to the Clothes Weaver and pick up a Cloth Jacket": "去服裝店那里拿一件布夹克",
        "Objective: Provide Cloth Jacket from the Clothes Weaver (Visit the City": "目标：从（城市）服裝店那里获取布夹克",
        //----------------/ Market Trader-5
        "After exploring, it's good to get back to base and refine the materials you've found before selling them":
            "探索之后，回到基地将找到的材料提炼加工后再出售是个好办法",
        "Iron is a great resource for crafting and can be bought in the city or on the player market":
            "铁是一种优质的锻造资源，可在城市或玩家市场购买",
        "Pick up some Iron Bars from the Junk Store and bring them here": "从废品店购买一些铁锭带到这里来",
        "Objective: Provide 40x Iron Bars from the Junk Store (Visit the City": "目标：从（城市）废品店获取 40 块铁锭",
        //----------------/ Market Trader-6
        "You can even get Nails from the store, although it is actually better advice to Buy Iron Bars from the store and Sell Nails":
            "你甚至能从商店买到钉子，不过实际上更好的建议是从商店买铁锭，然后卖掉钉子",
        "Objective: Provide 10x Nails from the Junk Store (Visit the City": "目标：从（城市）废品店获取 10 枚钉子",
        //----------------/ Market Trader-7
        "Some resources are harder to find or require a faction. One such item is the Barley Seed, which is used in the Beer brewing process":
            "有些资源更难找到，或者需要加入帮派才能获得。大麦种子就是这样一种物品，它用于啤酒酿造过程",
        "I challenge you to find a Barley Seed and bring it back here": "我倒要看看你能不能找到一粒大麦种子并带回来",
        "Objective: Provide 1x Barley Seeds from the Player Market or a Faction (Visit the City":
            "目标：从（城市）玩家市场或帮派中获取 1 粒大麦种子",

        //----------------/ Metals Miner-1
        "Before gettin' to Mining. You'll first need a Pickaxe": "开始采矿前，你首先需要一把镐",
        "You can get one from crafting in the Crafting Bench or buy one from the Player market": "你可以在锻造台制作一把，或者从玩家市场购买",
        "Objective: Craft 1x Pickaxe (Craft in Crafting Bench of Buy from Player Market": "目标：制作 1 把镐子，在（据点）锻造台中制作或从玩家市场购买",
        //----------------/ Metals Miner-2
        "Now you have a Pickaxe you can head to the mines to work hard": "现在你有了镐子，可以去矿场努力干活了。",
        "Give it a whack, see what you get": "挥镐试试，看看能挖到什么。",
        "Objective: Mine at the Iron Mine 5 times (Scavenge": "目标：在（拾荒）铁矿场开采5次",
        //----------------/ Metals Miner-3
        "That's it, you can get Iron Ore from the Iron Mine": "就是这样，你可以从铁矿场中获得铁矿石。",
        "The more you Mine, the more efficient you'll become": "你开采得越多，效率就会越高。",
        "Provide some Iron Ore so we can smelt it into Iron Bar": "提供一些铁矿，这样我们就能把它冶炼成铁锭了。",
        "Objective: Provide x10 Iron Ore": "目标：提供10块铁矿石",
        //----------------/ Metals Miner-4
        "Iron Ore can be smelted into Iron Bar in the furnace. This an important process which should be kept up to ensure you have a steady supply of resources":
            "铁矿石可以在熔炉中冶炼成铁锭。这是一个重要的过程，应该持续进行以确保你有稳定的资源供应。",
        "Craft your Iron Ore into Iron Bar": "将铁矿石冶炼成铁锭",
        "Objective: Provide x5 Iron Bar (Craft Iron Bar in the Furnace": "目标：提供5个铁锭，在（据点）熔炉中制作",
        //----------------/ Metals Miner-5
        "Now we'll need some more Iron Bar before looking at the next resource Steel": "在研究下一种资源钢铁之前，我们还需要更多的铁锭。",
        "Head to the mines again": "再次前往铁矿场。",
        "Objective: Mine at the Iron Mine 10 times (Scavenge": "目标：在（拾荒）铁矿场开采 10 次",
        //----------------/ Metals Miner-6
        "Thats the trick. Although just a few Iron Bars won't get you very far": "这就是诀窍。不过仅仅只是几个铁锭可帮不了你太多。",
        "Make a fresh batch of Iron Bar which we'll turn into Nails": "新制作一批铁锭，我们要把它们做成钉子。",
        "Objective: Provide 20x Iron Bar": "目标：提供 20 个铁锭",
        //----------------/ Metals Miner-7
        "Iron Bar can easily be changed into Nails in the Furnace. Iron Bar can also be purchased in the City or from other Players, giving you a method of making money":
            "铁锭在熔炉里可以很容易地变成钉子。铁锭也可以在城市里或从其他玩家那里购买，这为你提供了一种赚钱的方法。",
        "You can always buy Iron Bars and sell Nails to the Junk Store": "你随时可以购买铁锭，然后把钉子卖给废品店。",
        "Objective: Provide 20x Nails": "目标：提供 20 个钉子",
        //----------------/ Metals Miner-8
        "Some other metals, such as Steel require a little more than just Iron Ore to create": "其他一些金属，比如钢铁，在制造时需要的不仅仅是铁矿石。",
        "To get Steel you'll need Coal from the Coal mine": "要得到钢铁，你需要从煤矿获取煤。",
        "Head to the Coal mine now and try it": "现在前往煤矿试试吧。",
        "Coal is much harder to get than Iron Ore": "煤可比铁矿石难获取得多了",
        "Objective: Mine in the Coal Mine 10 times (Scavenge": "目标：在（拾荒）煤矿开采 10 次",
        //----------------/ Metals Miner-9
        "Let's see now, get me some Coal and Iron bar and I'll show you how to turn it into Steel":
            "现在看看，给我一些煤和铁锭，我会让你看看怎么把它们变成钢铁。",
        "Objective: Provide 5x Coal and 2x Iron Bar": "目标：提供 5 份煤和 2 份铁锭",
        //----------------/ Metals Miner-10
        "Now you understand the Recipe, you should upgrade your Furnace to get the recipe for Steel":
            "现在你了解配方了，你应该升级你的熔炉来获取钢铁的配方。",
        "Once you have it, craft 10 Steel for me and I'll provide a reward": "一旦你获得了配方，为我制作 10 个钢铁，我会给你奖励。",
        "Objective: Provide 25x Steel (Craft in Furnace": "目标：提供 25 个钢铁，在（据点）熔炉中制作铁锭",

        //----------------/ Wood Carpenter-1
        "So you want to learn to get in the woodworking trade, huh? Well, any good plank of wood first comes from some good solid lumber":
            "这么说你想学习木工手艺，是吧？要知道，任何一块好木板都源自优质的实心木材",
        "To get logs from the Forest you'll need a Hatchet": "要从森林里获取原木，你需要一把斧头",
        "Objective: Craft 1x Hatchet in the Crafting Bench": "目标：在（据点）制作台制作 1 把斧头",
        //----------------/ Wood Carpenter-2
        "Now that you have a Hatchet, you can gather Logs efficiently from the Forest": "现在你拥有了斧头，可以在森林中高效收集原木。",
        "Go try it out and bring back some Logs here": "快去尝试一下，并带些原木回来。",
        "Objective: Bring 10x Logs from the Forest": "目标：在（拾荒）森林带回10根原木",
        //----------------/ Wood Carpenter-3
        "That's it. Now I'm sure you can carry a lot more logs than that. Go fetch some more logs so I can show you some carpeting":
            "就是这样。现在我肯定你能扛的木材远不止这些。再去砍些木材来，我好教你如何铺地毯。",
        "Get enough Logs for us to start learning": "收集足够的木材，我们就可以开始学习了。",
        "Objective: Bring 100x Logs from the Forest": "目标：在（拾荒）森林带回100根原木",
        //----------------/ Wood Carpenter-4
        "With logs you can make Planks, which are a necessary resource in upgrading your Stronghold. They're also useful for trading with players and other crafting recipes":
            "用木材可以制作木板，木板是升级要塞的必要资源，也可用于与其他玩家交易，还能用于其他制作配方。",
        "Try it out, go turn some Logs into Planks": "试试看，把一些木材制成木板吧",
        "Objective: Provide 10x Planks by crafting them in the Materials Bench": "目标：在（据点）材料工作台制作10块木板并提交",
        //----------------/ Wood Carpenter-5
        "You learn quick. These planks look smooth and solid, good enough for a survivor's stronghold":
            "你学得真快。这些木板看起来光滑又结实，足够用来搭建幸存者的堡垒了。",
        "Bring me 100 more planks, I'll make it worth your time": "再给我拿 100 块木板来，我不会让你白忙活的。",
        "Objective: Provide 100x Planks by crafting them in the Materials Bench": "目标：通过（据点）材料工作台制作并提供 100 块木板",

        //----------------/ Fuel Baron-1
        "Fuel makes the world go round even in the apocalypse. You'll need a steady supply to make sure you can get around in your vehicle":
            "即便是在末世，燃料也是驱动世界运转的关键。你需要稳定的燃料供应，以确保能驾驶车辆出行",
        "There is a small chance of finding Fuel in the Scrapyard. Try find some there": "在废料场有小概率能找到燃料，去那里试试吧",
        "Objective: Scavenge in the Scrapyard 5 times": "目标：从（拾荒）废料场搜寻 5 次",
        //----------------/ Fuel Baron-2
        "Keep going until you have some Fuel that I can buy. I'll need it to run my Iron Automine":
            "继续找，直到你弄到一些我想要买的燃料。我需要它来运转我的铁矿自动矿场",
        "Head back and get some fuel": "回去弄些燃料来",
        "Objective: Provide 2x Fuel": "目标：提供 2 份燃料",
        //----------------/ Fuel Baron-3
        "That's it. But my Iron Automine will run out quickly with just 2 Fuel": "就是这样。但是仅靠 2 份燃料，我的铁矿自动矿场很难继续维持下去",
        "Head back and Scavenge as much Fuel as you can": "回去尽可能地搜寻更多的燃料",
        "Objective: Scavenge in the Scrapyard 10 times": "目标：在（拾荒）废料场搜寻 10 次",
        //----------------/ Fuel Baron-4
        "A few more gallons should do": "再要几加仑应该就够了",
        "Get more Fuel for me would you": "再帮我弄些燃料来，好吗？",
        "Objective: Provide 5x Fuel": "目标：提供 5 份燃料",
        //----------------/ Fuel Baron-5
        "Before we head out to the Fuel pumps, let's get some more supplies ready": "在我们出发去加油泵那里之前，先多准备些补给品吧",
        "Go Scavenge every bit of Fuel you can from the Scrapyard": "去废料场尽可能搜寻所有能找到的燃料",
        "Objective: Scavenge in the Scrapyard 15 times": "任务目标：在（拾荒）废料场搜寻 15 次",
        //----------------/ Fuel Baron-6
        "That's the ticket, if you ever run out of Fuel you can always get it in the scrapyard": "这就对了，要是你燃料耗尽了，总能在废料场弄到",
        "Go get some more Fuel and I'll provide the rest for our trip": "再去弄些燃料来，旅途所需的其余部分我来准备",
        "Objective: Provide 10x Fuel": "目标：提供 10 份燃料",
        //----------------/ Fuel Baron-7
        "Now we have enough Fuel to travel, we should head to the Fuel Depot and Scavenge what fuel we can": "现在我们有足够的燃料，可以上路远征燃料库了，尽可能地搜寻那里的燃料",
        "Head over to the Fuel Depot and Scavenge everything you can": "去燃料库，把能找到的东西都搜出来",
        "Objective: Explore the Fuel Depot and Scavenge the Fuel Pumps (Explore Page": "目标：在（远征）燃料库并搜寻加油泵",
        //----------------/ Fuel Baron-8
        "Now you know how to get a steady supply of Fuel, how about you repay the favor":
            "现在你知道如何获得稳定的燃料供应了，不如顺带帮我个忙？",
        "I just need 15 Fuel, I'll give you a big payday for it": "帮我带15份燃料过来,我会给你一笔丰厚的报酬。",
        "Objective: Provide 15x Fuel": "目标：提供 15 份燃料",

        //----------------/ Animal Huntress-1
        "To begin hunting animals, you'll need equipment such as a Bow and Arrows": "首先要开始猎杀动物，你需要像弓和箭这样的装备",
        "Get hold a Bow so we can get started": "取得一把弓，这样我们才能开始",
        "Objective: Provide 1x Bow (Craft in Crafting Bench or Buy in Player Market": "目标：提供 1 把弓（在制作台制作或在玩家市场购买）",
        //----------------/ Animal Huntress-2
        "A Bow isn't the most useful tool on it's own. To Hunt animals you'll also need a way to use your Bow from range":
            "弓单独使用时并不是最有用的工具。要猎杀动物，你还需要能远程使用弓的方法。",
        "Get hold of some Arrows for your Bow": "为你的弓准备一些箭",
        "Objective: Provide 5x Arrows (Craft in Crafting Bench or Buy on Player Market": "目标：提供5支箭（在制作台制作或在玩家市场购买）",
        //----------------/ Animal Huntress-3
        "Now you have the equipment needed, you can start to hunt for Hide": "现在你拥有了所需要的装备，可以开始猎杀获取兽皮了。",
        "Head over to the Marshlands to test out your new Bow": "前往沼泽地试试你的新弓。",
        "Objective: Hunt in the Marshlands 5 times (Scavenge": "目标：在（拾荒）沼泽地狩猎5次",
        //----------------/ Animal Huntress-4
        "When hunting animals you should gain plenty of Hide. Hide is useful for crafting armours and upgrading buildings":
            "打猎时，你应该会收集到大量的兽皮，这些兽皮对于制作盔甲和升级建筑很有用。",
        "Show me the Hide you've gathered": "给我看看你收集到的兽皮。",
        "Objective: Provide 5x Hide": "目标：提供 5 张兽皮",
        //----------------/ Animal Huntress-5
        "It's a good idea to hunt the Marshlands as much as you can before progressing to harder areas":
            "在进入更难的区域之前，尽可能多地在沼泽地狩猎是个好主意。",
        "Head over to the Marshlands to gather more Hide": "前往沼泽地收集更多兽皮。",
        "Objective: Hunt in the Marshlands 10 times (Scavenge": "目标：在（拾荒）沼泽地狩猎 10 次",
        //----------------/ Animal Huntress-6
        "Nice work, you're able to gather lot's of Hide quickly now. Before hunting larger animals you'll need to make a Quiver which let's you stay quick and nimble":
            "干得好，你现在能很快收集到很多兽皮了。在猎杀更大的动物之前，你需要制作一个箭袋，它能让你保持敏捷灵活。",
        "Head over to the Crafting Bench and make a Quiver": "去制作台制作一个箭袋吧",
        "Objective: Provide 1x Quiver (Crafted in Crafting Bench or Buy from Player Market": "目标：提供 1 个箭袋（可在制作台制作或从玩家市场购买）",
        //----------------/ Animal Huntress-7
        "Now you have a Quiver you can begin to hunt in wider areas": "现在你有了箭袋，可以开始在更广阔的区域狩猎了。",
        "Head over to the Open Meadow and hunt the small game roaming around there": "前往开阔草地，猎杀在那里游荡的小型猎物。",
        "Objective: Hunt Small Game in the Open Meadow (Explore": "目标：在（远征）开阔草地猎杀小型猎物",
        //----------------/ Animal Huntress-8
        "You're becoming quite the adept hunter now": "你现在已经成了一名相当熟练的猎手了。",
        "The best hunters are always bringing home stacks of Hide, prove yourself to me by providing 50 Hide":
            "最优秀的猎手总能带回大批的兽皮，给我 50 张兽皮来证明你自己吧。",
        "Objective: Provide 50x Hide": "目标：提供 50 张兽皮",
        //----------------/ Animal Huntress-9
        "In the Open Meadow we can often see larger animals passing through. You can attempt to hunt them for their Animal Meat, but it can be hard to always get a kill":
            "在开阔草地上，我们经常能看到大型动物活动。你可以尝试猎杀它们获取兽肉，但要做到百发百中可不是一件简单的事。",
        "Head to the Open Meadow and attempt to kill some Large Game": "前往开阔草地，尝试猎杀一些大型猎物。",
        "Objective: Hunt Large Game in the Open Meadow (Explore": "目标：在（远征）开阔草地猎杀大型猎物",
        //----------------/ Animal Huntress-10
        "If you hunt enough in the Open Meadow you will come across Animal Meat, a prized possession for most hunters":
            "如果你在开阔草地猎杀得多了，有机会能获得兽肉，这可是绝大多数猎手珍视的东西。",
        "It is high value, provides lots of nutrients and is used in many cooking recipes":
            "兽肉价值很高，富含多种营养，还能用于许多烹饪食谱中。",
        "Your final challenge is to provide 5 Animal Meat to me": "你的最终挑战是给我提供 5 份兽肉。",
        "Objective: Provide 5x Animal Meat (Hunt Large Game in the Open Meadow": "目标：提供 5 份兽肉（在开阔草地猎杀大型猎物）",

        //----------------/ Clothes Seamstress-1
        "If you want to start crafting Cloth and Armour, you'll need to learn a bit about the materials involved":
            "如果你想开始制作布料和盔甲，你需要先了解一些相关的材料。",
        "First, grab me some Hide, we can use that to make Cloth": "首先，给我弄些兽皮来，我们可以用它来制作布料。",
        "Objective: Provide 10x Hide": "目标：提供 10 张兽皮",
        //----------------/ Clothes Seamstress-2
        "Hide is just a basic resource that needs refining before it can be used in more complex armour":
            "兽皮只是一种基础资源，需要经过提炼才能用于制作更复杂的盔甲。",
        "To have access to Cloth and more, you should craft an Armour Bench": "要想制作布料及更多物品，你需要制作一个盔甲台。",
        "Objective: Construct and upgrade an Armour Bench to Level": "任务目标：建造盔甲台并将其升级至 Lv.",
        //----------------/ Clothes Seamstress-3
        "Now that you have an Armour Bench you can craft recipes for Armour, try it out now":
            "既然你已经有了盔甲台，就可以按照配方制作盔甲了，现在就来试试看吧。",
        "Craft some Sandals in the Armour Bench": "在盔甲台制作一些凉鞋。",
        "Objective: Provide 1x Sandals (Can be crafted in Armour Bench": "目标：提供 1 双凉鞋（可在盔甲台制作）",
        //----------------/ Clothes Seamstress-4
        "To craft your own Cloth and become self-sufficient, you should upgrade your Armour Bench to learn the Blueprint for Cloth":
            "要自己制作布料并实现自给自足的话，你需要升级盔甲台以学习布料的制作蓝图。",
        "Objective: Upgrade Armour Bench to level": "目标：将盔甲台升级至 Lv.",
        //----------------/ Clothes Seamstress-5
        "Great, now you can refine Hide into Cloth directly in your base. This means you'll be self-sufficient":
            "太好了，现在你可以在自己的基地里直接将兽皮提炼成布料了。这意味着你将实现自给自足。",
        "Go produce some Cloth for us to work with": "去制作一些布料，好让我们用它来干活。",
        "Objective: Provide 10x Cloth (Craft in Armour Bench": "目标：提供 10 块布料（在盔甲台制作）",
        //----------------/ Clothes Seamstress-6
        "Now you get the idea. To craft your own Armour, head over to your Armour Bench and put that cloth to use":
            "现在你明白了吧。要自己制作盔甲，就去你的盔甲台，把那些布料用起来。",
        "Craft the Cloth Jacket": "制作布质夹克。",
        "Objective: Provide 1x Cloth Jacket (Craft in Armour Bench": "目标：提供 1 件布质夹克（在盔甲台制作）",
        //----------------/ Clothes Seamstress-7
        "With Cloth you can begin to make basic Armour": "有了布料，你就可以开始制作基础盔甲了。",
        "Head over the the Armour Bench and craft a Cloth Pants": "前往盔甲台，制作一条布裤。",
        "Objective: Provide 1x Cloth Pants": "目标：提供 1 条布裤",
        //----------------/ Clothes Seamstress-8
        "More challenging crafting requires Thread, which is made from Cloth": "更具挑战性的制作需要线，线是由布料制成的。",
        "You'll need to Upgrade your Armour Bench before you can craft thread": "在你能制作线之前，升级需要你的盔甲台。",
        //----------------/ Clothes Seamstress-9
        "Now that you can craft Thread, give it a go": "既然你已经能制作线了，试试看吧",
        "Head over to the Armour Bench and turn some Cloth into Thread": "前往盔甲台，将一些布料制成线",
        "Objective: Provide 5x Thread": "目标：提供 5 根线",
        //----------------/ Clothes Seamstress-10
        "Now you know everything you need to know": "现在你已经掌握了所有需要知道的东西",
        "Time to finish off upgrading your Armour Bench and start taking orders for Armour": "是时候完成盔甲台的升级，并开始承接护具订单了",

        //----------------/ 觸發特別任務
        "CORNERED WHILE LEAVING": "离开时陷入绝境",
        "Weeeilll hood on there just a moment!": "等一下！！！！！！！",
        "A spike of fear shoots up your spine and you turn sharply to address their voice.": "一阵恐惧涌上你的脊梁，你猛地转过身去回应他们的声音。",
        "They are -not- alone.": "他们 —— 不是 —— 单独一人。",
        "In front of you stands a tall and rugged looking man, filthy from the wastelands, he gazes at you while straightening his razery moustache.":
            "在你面前站着一个高大、面容粗犷的男人，浑身沾满荒原的污垢，他一边捋直自己稀疏的胡子，一边盯着你看。",
        "Along with them, another slim woman donning a cowboy hat, facing down at the ground not revealing their face, eyes - or intentions.":
            "和他一起的，还有一个身形苗条、戴着牛仔帽的女人，低头看着地面，没有露出脸、眼睛 —— 也看不出意图。",
        "The man raises his right hand, revealing a rusty gun. He begins to wave it around in circles, gesturing for you to hand over your supplies.":
            "那个男人举起右手，露出一把生锈的枪。他开始把枪绕圈挥舞，示意你交出物资。",
        "FIGHT RUGGED LOOKING MAN": "对抗面容粗犷的男人",
        "FIGHT SLIM WOMAN": "对抗苗条女人"

    };

    //2.2 規則
    const dictRules = {
        "Real-World Transactions: ACCOUNT TERMINATION": "现实交易：账号封禁",
        "Exchanging in-game currency or assets for real money or external services, including items from other games, is strictly forbidden. Any accounts involved in such transactions will be permanently banned from the game":
            "严禁将游戏内货币或资产兑换为真实货币或外部服务，包括来自其他游戏的物品。任何涉及此类交易的账号将被永久封禁",
        "Account Buying & Selling: ACCOUNT TERMINATION": "账号买卖：账号封禁",
        "Ownership of an account is non-transferable. Any accounts that are bought, sold, or traded will be permanently banned from the game":
            "账号所有权不可转让。任何被买卖或交易的账号都将被永久封禁",
        "Bug Abuse: ACCOUNT TERMINATION": "利用漏洞：账号封禁",
        "Even though we do our best to ensure that the game is free of bugs, they can still occur. If you find a bug, please report it to us immediately. Any players who continue to exploit a bug will be permanently banned from the game":
            "尽管我们尽力确保游戏没有漏洞，但漏洞仍可能存在。如果你发现漏洞，请立即报告。任何继续利用漏洞的玩家将被永久封禁",
        "Multiple Accounts: Game Ban": "多账号：游戏封禁",
        "You must not create more than one account! Using more than one account can give you an unfair advantage over other players and is strictly forbidden. Any players found to be using multiple accounts will be banned from the game":
            "不得创建多个账号！使用多个账号会给你带来不公平的优势，这是严格禁止的。任何发现使用多个账号的玩家将被封禁",
        "Account Sharing: Game Ban": "账号共享：游戏封禁",
        "You must not share your account with anyone else. Sharing your account can lead to your account being compromised, and you will be held responsible for any actions taken on your account. Any players found to be sharing their account will be banned from the game":
            "不得与他人共享账号。共享账号可能会导致账号被盗，并且你需对账号上的所有行为负责。任何发现共享账号的玩家将被封禁",
        "Automated Bots / Scripts: Game Ban": "自动化脚本/机器人：游戏封禁",
        "You must not use any automated bots or scripts to play the game, this includes any software, browser extensions, or hardware that automates gameplay. Any players found to be using automated bots or scripts will be banned from the game":
            "不得使用任何自动化脚本或机器人进行游戏，包括任何软件、浏览器扩展或硬件设备。任何发现使用自动化脚本的玩家将被封禁",

    };

    //2.3 論壇
    const dictForum = {
        Guide: "指南",
        FAQ: "常见问题",
        Forum: "论坛",
        "Visit Wiki": "访问wiki",
        Support: "支持",
        "Welcome to Zed City, a thrilling zombie apocalypse survival game. Navigate through the city to gather resources, fend off zombies, and fortify your stronghold. Your initial goal is to enhance your character and strengthen your base":
            "欢迎来到Zed City，一款刺激的末日求生游戏。穿越城市，收集资源，抵御丧尸，并加固你的据点。你的初步目标是提升角色并强化基地",
        "Scavenging and hunting will be the best way for you to thrive in the wasteland, gathering all the scraps and valuables you can lay your hands on. With some work you can turn them into valuable resources and epic weapons to take down even the biggest of zeds":
            "拾荒和狩猎将是你在荒原中生存下去的最佳方法，收集所有你能找到的垃圾和宝贵物品。通过一些努力，你可以将这些转化为宝贵的资源和史诗级武器，打倒最大的丧尸",
        "Start your journey by diving into the": "开始你的旅程，进入",
        "For a more detailed guide, check out the wiki": "欲了解更详细的指南，请查看wiki",

        "For more help, reach out to the community in discord": "如需更多帮助，请加入Discord社区",
        "Join Discord": "加入Discord",
        "How do i heal": "我如何恢复生命值",
        "Life points are regenerated over time, you can see the statistics in your Medical Bay. You can use medical items to heal instantly":
            "生命点数会随着时间恢复，你可以在医疗间查看统计数据。你可以使用医疗物品进行即时治疗",
        "How do I earn money": "我如何赚取金钱",
        "Scavenging or hunting for items to sell to the stores is the main way to earn money early in the game. After some time you will discover other ways to transform items into more valuable ones":
            "拾荒或狩猎物品并卖给商店是游戏初期赚取金钱的主要方式。过一段时间，你将发现其他方法将物品转化为更有价值的物品",
        "How do i gain Experience": "我如何获得经验",
        "Experience is gained through commiting scavenge actions, completing quest objectives & winning battles. The more Experience gained you will level up":
            "通过执行拾荒行动、完成任务目标和赢得战斗来获得经验。获得的经验越多，你的等级就越高",
        "How can i fulfill Energy & Rad Immunity  bars": "我如何填充能量和辐射免疫条",
        "Energy regenerates +5 every 15 minutes, Rad Immunity regenerates +1 every 5 minutes. You can take consumables found in-game that will help regain these besides waiting on timers":
            "能量每15分钟恢复+5，辐射免疫力每5分钟恢复+1。你可以使用游戏中找到的消耗品来帮助恢复这些，而不仅仅是等待时间",
        "What happens if i lose fight": "如果我输掉战斗会怎样",
        "You dont die. You become temporarily injured for a moment then your health will restart from low":
            "你不会死。你会暂时受伤片刻，然后你的健康值会从低值恢复",
        "How do i get stronger in fights": "我如何在战斗中变得更强",
        "Using energy to train in the gym is the best way to be more effective in combat and making sure you have the best weapon available. Some mutations and consumables are available which may temporily boost your gym stats":
            "使用能量在健身房训练是提高战斗效率的最佳方法，确保你拥有最好的武器。一些突变和消耗品可以临时提升你的健身数据",

        General: "综合",
        "A place for general discussions": "一个进行综合讨论的地方",
        Ideas: "创意",
        "Ideas & Suggestions": "创意与建议",

        Name: "名字",
        Topics: "话题",
        Replies: "回复",
        Author: "作者",
        "Last Post": "最后发布",
        "No topics were found": "无话题",
        "click here to create one": "点击此处创建一个话题",
        "Add Topic": "添加话题",
        of: "共",
        "Create Topic": "创建话题",
        "No title provided": "未提供标题",
        Title: "标题",
        Write: "编写",
        More: "更多",
        Preview: "预览",
        Markdown: "Markdown",
        WYSIWYG: "所见即所得",
        Blockquote: "引用",
        Strike: "删除线",
        "Inline code": "内联代码",
        "Insert image": "插入图片",
        Italic: "斜体",
        Bold: "粗体",
        "Add Reply": "添加回复",
        Post: "发布",
        "an hour ago": "1小时前",
        "Faction recruitment and information": "派系招募与信息",
        "days ago": "天前",
        "months ago": "个月前",
        "a month ago": "1 个月前",
        "a day ago": "1 天前",
        "a minutes ago": "1 分钟前",

    };

    //3.0 其他 (尚未整理的翻譯)
    const dictOther = {
        "A bag of Cement mix": "一袋水泥混合料",
        Miscellaneous: "杂项",
        leave: "离开",
        visit: "查看",
        None: "无",
        Continue: "继续",
        "Your scavenging skill level needs to be": "你的拾荒技能等级需要达到",
        "gained every": "每",
        minutes: "分钟",
        Building: "建造中",
        Burn: "燃烧",
        Collect: "收集",
        "will show a total time if you are crafting more than 1x": "如果你制作超过1个，将显示总时间",
        "Medical Bay Level": "医疗间等级",
        "Bench Level": "制作台等级",
        "An essential item to make your rod work": "使鱼竿运作的必需品",
        V: "V",
        High: "高",
        Low: "低",
        Map: "地图",
        Close: "关闭",
        Points: "点数",
        money: "金钱",
        Offline: "离线",
        Retry: "重试",
        Lockpicks: "撬锁工具",
        "Coming Soon": "即将推出",
        "Donator House is coming soon": "捐赠者之家即将推出",
        min: "最低",
        "hours ago": "小时前",
        "Active an hour ago": "1小时前在线",
    };

    //3.1 版本更新
    const dictVersion = {
        Rules: "规则",

        //v1.0.7
        "Bandages and other medical items have been reduced in weight, both Med Kits have been made more effective":
            "绷带和其他医疗物品的重量已减少，两个医疗包的效果已提升",
        "A bug with faction max members since the last release has been fixed": "上次更新以来派系最大成员数的错误已修复",
        "Armour items will now show the % boost they give": "护甲物品现在会显示其提供的百分比加成",
        "Fixed bug with speed perk not applying correctly": "修复了速度加成未正确应用的错误",

        //v1.0.6
        "Bandages and other medical items have been reduced in weight, both Med Kits have been made more effective":
            "绷带和其他医疗物品的重量已减少，两个医疗包的效果已提升",
        "A bug with faction max members since the last release has been fixed": "上次更新以来派系最大成员数的错误已修复",
        "Armour items will now show the % boost they give": "护甲物品现在会显示其提供的百分比加成",
        "Fixed bug with speed perk not applying correctly": "修复了速度加成未正确应用的错误",
        "Choose between 5 unique faction legacies, each legacy will give unique perks to enhance gameplay for all faction members":
            "可在五种独特的派系传承中选择，每种传承都能为所有派系成员提供独特加成，增强游戏体验",
        "Filters have been added to faction activity to give a more detailed overview of member actions":
            "派系活动已添加筛选器，以提供更详细的成员行动概览",
        "A new stat has been added for worker efficiency, efficiency boosts will be reduced if faction members become inactive":
            "新增了工人效率属性，如果派系成员变得不活跃，效率加成将会减少",
        "Gym Stats": "健身房数据",
        "You can now view a breakdown of your stats and effects in the gym for each stat": "你现在可以在健身房查看每项属性的详细数据和效果",
        Balancing: "平衡调整",
        "Vending Machines & Coffee Machines will now cost 2 Zed Coin to operate": "自动售货机和咖啡机现在需要 2 枚丧尸币才能运行",
        "Armour items have been adjusted to give a % boost to your defense, which will make them more useful in combat":
            "护甲物品已调整为提供防御百分比加成，使其在战斗中更有用",
        "Fight Logs": "战斗日志",
        "You can now access your fight logs by clicking on your avatar in the top right": "你现在可以通过点击右上角的头像来访问你的战斗日志",
        "Skill Points Reset": "技能点重置",
        "This has now been fixed, if you previously reset your skill points then your skills will have been reset again and your skill points will be correct":
            "此问题已修复，如果你之前重置了技能点，则你的技能将再次被重置，并且技能点数将恢复正确",
        "City -> Survivors will now order by online and a total online count has been added":
            "城市 -> 幸存者列表现在按在线状态排序，并新增了在线总数显示",
        "Added new forum section for faction discussions & recruitment": "新增了一个用于派系讨论和招募的论坛版块",
        "Fixed visual bug when unequipping weapons / armour": "修复了卸下武器/护甲时的视觉错误",
        "A bug causing morale to reset, if you upgraded your skill while over the limit has been fixed":
            "修复了在超过上限时升级技能会导致士气重置的错误",
        "Visual fixes have been made for iPhone & other mac devices": "针对 iPhone 和其他 Mac 设备进行了视觉修复",
        "Zed City time will now show correctly in the left menu when exploring": "在探索时，左侧菜单现在会正确显示 Zed City 时间",
        "Issues with some items not having a default weight has been fixed": "修复了一些物品没有默认重量的问题",

        //v1.0.5
        "It has been an incredible first month in Zed City! Over 1,350 of you have joined the fight, with more than 900 new survivors":
            "在Zed City的第一个月真是不可思议！超过 1350 名玩家加入了战斗，还有 900 多名新的幸存者",
        "Together, you've forged 5,049,777 items, attempted 1,006,579 scavenges, and embarked on 57,453 hunts. We want to thank each and every one of you for your incredible support. We're committed to continuously improving and expanding the experience, and we can’t wait to share what’s coming next":
            "你们一起锻造了 5049777 件物品，尝试了 1006579 次拾荒，并开始了 57453 次狩猎。我们要感谢你们每一位的大力支持。我们致力于不断改进和扩展游戏体验，因此迫不及待地想分享接下来的内容",
        "Server Migration": "服务器迁移",
        "While we're not experiencing any slowdown yet, we've been preparing to upgrade our infrastructure to support future growth and additional services, such as in-game chat and real-time updates":
            "虽然我们还没有遇到任何放缓的情况，但我们一直在准备升级我们的基础设施，以支持未来的增长和额外的服务，比如游戏内聊天和实时更新",
        "Economy Balancing": "经济平衡",
        "Iron Bar supply in the Junk Store has been increased due to high demand": "由于需求量大，废品店的铁锭供应量有所增加",
        "Fuel Depot trades have been reduced to": "燃料库交易已降至",
        "Store buy limit error message has been fixed": "修复了商店购买限制错误消息",
        "Active perks won't display until some perks are active": "在一些特效处于激活状态之前，不会显示激活的特效",
        "Added loading animation to crafting lists": "为合成列表添加了加载动画",
        "Scope for discord login has been reduced to only what is required": "Discord 登录的范围已缩小到仅需的范围",

        //v1.0.4
        "Points will now be known as Zed Coin, we have added the ability to list these on the market":
            "点数现在将被称为丧尸币，我们已添加将其列入市场的功能",
        'Once you hit level 5, the "Help" link will switch to "Forums", you can still access both anytime from the top-left menu. We’ve also fixed a bug that was causing issues when creating new topics':
            "当你达到5级时，“帮助”链接将切换为“论坛”，你仍然可以随时通过左上角菜单访问两者。我们还修复了一个在创建新主题时引发问题的错误",
        "Browser Icon": "浏览器图标",
        "We’ve updated the ZC browser icon to make it clearer, and now it’ll change to alert you whenever you get a new notification":
            "我们更新了丧尸城市浏览器图标，使其更加清晰，现在每当你收到新通知时，它会发生变化以提醒你",
        "Fixed a bug that caused display issues during Discord registration": "修复了在Discord注册过程中导致显示问题的错误",
        "Reduced the number of items shown in the item selection list": "减少了物品选择列表中显示的物品数量",
        "Fixed some caching issues, which means faster load times and less data usage going forward":
            "修复了一些缓存问题，这意味着未来加载时间更快，数据使用量更少",

        //v1.0.3
        "Zed Packs & Membership": "丧尸包和会员",
        "Zed Packs will now give you a random loot drop when opened, everyone who has already opened Zed Pack(s) will receive 2x free refills for each pack opened. When subscribing to a new membership, you will receive the special item for that month instantly. Everyone who has already subscribed will have received this item now":
            "现在打开 “丧尸包”（Zed Packs）时，将会随机掉落物品。凡是已经打开过 “丧尸包” 的玩家，每打开一个包，都将免费获得两次补充机会。新订阅会员，将立即获得当月的特殊物品。凡是已经订阅的玩家，现在也都已收到该物品。",
        "Added skill points to the store and introduced the ability to reset skill perks": "在商店中添加了技能点，并引入了重置技能特权的功能",
        Scavenges: "拾荒",
        "More XP will be given for both normal rank & skills when attempting scavenges that cost higher Rad Immunity":
            "在尝试需要更高辐射免疫的拾荒时，将获得更多普通等级和技能经验值",
        "Added the ability to transfer ownership of a faction to a new leader, you can do this by visiting your camp. When attempting to leave the faction, if you are the leader, a warning will be displayed about the faction being destroyed":
            "新增了将派系所有权转移给新领导者的功能，可以通过访问您的营地来完成。如果尝试离开派系，且您是领导者，将显示有关派系被摧毁的警告",
        "Zed Bot (Discord Bot": "丧尸机器人（Discord机器人）",
        "Reduced time the bot will take between checking for new verified survivors": "减少了机器人检查新认证幸存者之间的时间",
        'Added a new role "ZC Supporter", awarded to survivors with an active membership': '新增角色"丧尸支持者"，授予具有有效会员资格的幸存者',
        'Added a new role "ZC Faction Leader': '新增角色"丧尸派系领导者"',
        "Fixed delay in updating notifications after viewing": "修复了查看后更新通知的延迟问题",
        "Fixed bug where non-existent factions showed a loading animation": "修复了不存在的派系显示加载动画的问题",
        "Fixed issue where consuming an item showed 'out of quantity' with 1 remaining": "修复了消耗物品时显示“数量不足”但实际剩余1个的问题",
        "Added server time display to the top-left menu": "在左上角菜单中新增了服务器时间显示",
        "Removed certain refinery blueprints, to be reintroduced later": "移除了某些精炼厂的蓝图，将在稍后重新引入",
        "Fixed some issues in the password reset process that may have caused confusion": "修复了密码重置过程中的一些可能引起混淆的问题",
        "Resolved issue with market listings disappearing when setting the price too high": "解决了市场列表在设置价格过高时消失的问题",
        "Free refills can be used without waiting": "免费填充可以不用等待即可使用",

        //v1.0.2
        "The Donator House has been released, you can buy membership perks & Zed Packs to trade with other survivors. Membership will give you a boost to your max energy and energy regain times and some other perks. While the donator store is fairly basic right now, we will be adding more things to this in future updates. We thank you for your continued support":
            "捐赠者之家已发布，您可以购买会员特权和丧尸包与其他幸存者交易。会员资格将提升您的最大能量和能量恢复时间，以及其他一些特权。目前捐赠商店功能较为基础，但我们将在未来更新中添加更多内容。感谢您的持续支持。",
        "Avatar upload has been fixed": "头像上传问题已修复",
        "The purchase limit from stores has been increased 3x, the new limit is 360 per 3 hours": "商店的购买限制已提高3倍，新限制为每3小时360个",
        "More stock of iron bars has been added to the stores": "商店增加了更多铁锭库存",
        "Added a fix to make sure weapons/armour break when they reach": "确保武器/护甲达到耐久度极限时会损坏",
        "Upgrade requirements for the kitchen have been fixed to match the unlock level": "厨房的升级要求已修复，与解锁等级相匹配",
        'Baton weapon type has been fixed to be "Blunt': "警棍武器类型已修复为“钝器”",
        "Garbo quests will now take some quest items when completing": "完成Garbo任务时现在会消耗一些任务物品",

        //v1.0.1
        "There is now an hourly buying limit of 120 items at the city stores": "城市商店现在每小时购买限制为120件商品。",
        "Log, scrap and iron bar junkstore restocks adjusted": "调整了原木、废料和铁锭的废品店补货。",
        "Log and scrap drops increased when scavenging": "拾荒时木材和废料掉落量增加。",
        "Some item price adjustments": "一些物品价格调整。",
        "More stronghold building upgrade price adjustments": "更多要据点筑升级价格调整。",
        "Fixed search bar typo": "修复了搜索栏拼写错误。",
        "Focus error bug fixed": "修复了焦点错误的bug。",
        "Fixed bug causing homepage not to display correctly": "修复了导致主页无法正确显示的bug。",
        "Fixed homepage not redirecting to game when already logged in": "修复了已登录情况下主页未跳转到游戏的问题。",

        //v1.0.0
        "Open Release is now live": "公开发布现已上线",
        "We've been saying thank you left and right, so all that's left is this": "我们已经四处致谢，现在只剩下这一件事了",
        "Welcome to Zed City, everyone, and we hope you enjoy the full release as much as we enjoyed bringing it to you":
            "欢迎来到Zed City，我们希望你能像我们享受带来这款游戏一样，享受完整的发布内容。",
        "This is the final reset, any progress you make from here will be persistent": "这是最终的重置，从现在开始，你的所有进度都会被保存。",
        "Best of luck, Survivors": "祝你好运，幸存者们",
        "Economy Changes": "经济变动",
        "Value of most items changed by a factor of x": "大多数物品的价值变动了倍数 x",
        "Most stronghold building upgrades now require cash": "大多数据点建筑升级现在需要现金。",
        "Gym upgrade material costs changed": "健身房升级材料成本已更改。",
        "Scrap restock in junk store adjusted": "废品店的补货已调整。",
        "Faction creation now costs": "创建帮派现在需要花费",
        "Character level required to create faction increased from 5 to": "创建派系所需的角色等级从5提升到",
        Homepage: "主页",
        "New homepage look": "全新的主页界面",
        "Access codes no longer required": "不再需要邀请码。",
        "Login with discord account now possible": "现在可以通过Discord账号登录。",
        "Donator house temporarily offline": "捐赠者之家暂时下线。",

        //清洗活动
        "Purge Event": "清洗活动",
        "Seemingly out of nowhere, ash plumes cover the sky as a constant ashfall covers the surroundings in a bleak gray color":
            "似乎是突然之间，灰烬云覆盖了天空，持续的灰尘落下，把周围的环境染成了一片灰色。",
        "Fires in the wilderness spread as the few remaining signs of life in the world are snuffed out":
            "荒野中的火灾蔓延，世界上为数不多的生命迹象被扑灭。",
        "The Purge is upon you Survivor; do all you can because there is not much time left":
            "大清洗行动即将到来，幸存者们；尽你所能，因为时间所剩无几。",
        "You will find Gray Gary in the alleyways, or rather, he will find you. He will be your quest giver this event, leading you to discover all the unique items introduced for this event only, culminating in the special trophy for this event":
            "你将会在小巷里找到灰袍Gary，或者说，他会找到你。他将是这次活动的任务发布者，带领你发现本次活动专属的独特物品，最终将带来这次活动的特别奖杯。",
        "Event Time (UTC) : 20th December 2024 18:00:00 - 1st January": "活动时间（UTC）：2024年12月20日18:00:00 - 2025年1月1日",

        //v0.3.4
        "Weapons and armour will be destroyed when it reaches 0% condition": "当武器和护甲的耐久度降至0%时，它们将被销毁。",
        "Trophy items have been made not tradable": "奖杯物品已被设置为不可交易。",
        "Messages icon has been removed from top menu until the feature is added": "顶部菜单中的消息图标已移除，直到该功能加入。",

        //v0.3.3
        "Changes have been made to balance your fight stats growth, they will now improve more slowly at first but will accelerate as time goes on":
            "已对战斗数据增长做出平衡性调整，现在初期的战斗数据提升会较慢，但随着时间的推移将加速增长。",
        "The building level will now have less immediate impact but will offer more significant benefits in the long run":
            "建筑等级的影响现在不会那么直接，但长期来看将带来更为显著的益处。",
        "Requirements for each level upgrade have been adjusted": "每个等级升级的要求已做出调整。",
        "NPC Balancing": "NPC平衡性调整",
        "We have adjusted the stats of each zed to match the changes made to the fight stats growth":
            "我们已调整每个丧尸的属性，以适应战斗数据增长的变化。",
        "Difficulty Rating": "难度等级",
        "Each NPC will now have a difficulty rating so you can make a better decision on your ability to defeat them":
            "每个NPC现在都有一个难度等级，帮助你更好地评估自己是否能够击败它们。",
        Weakness: "弱点",
        "Choose your weapon wisely, zeds will now have a weakness to specific types of weapons":
            "选择武器时要谨慎，丧尸现在会对特定类型的武器有弱点。",
        "A detailed list of all the items in the game can be found in the wiki": "游戏中所有物品的详细列表可以在wiki中找到。",
        "Crafting will show a total time if you are crafting more than 1x": "如果你制作多个物品，制作时间将会显示总时长。",
        "Explore list has been ordered by travel time & difficulty rating": "远征列表将按照旅行时间和难度等级排序。",
        "The help page has been updated to include links to wiki + discord": "帮助页面已更新，包含了指向wiki和Discord的链接。",

        //v0.3.2
        "Balancing changes have been made to xp payouts, gym training has been reduced slightly and more xp is given for hunting. Winning fights will give extra xp. Every quest objective will give at least 25xp":
            "XP奖励的平衡性调整已经做出，健身训练的XP稍微减少，而狩猎获得的XP更多。赢得战斗会额外获得XP。每个任务目标至少会奖励25XP。",
        'Tutorial Quest "Welcome to the end" has been re-written': "教程任务《欢迎来到末日》已重新编写。",
        "Difficulty has been reduced for new players in the Forest & Lake": "森林和湖泊地区的难度已减少，以帮助新玩家。",
        "Changed order of stronghold buildings (will only apply to new players": "强盗据点建筑的顺序已更改（仅对新玩家有效）。",
        "Adjusted the unlock level of Kitchen, Ammo Bench & Armour Bench": "厨房、弹药台和护甲台的解锁等级已调整。",
        "Fixed a bug where the explore landing page would show in the city": "修复了探索登陆页面在城市中显示的问题。",
        "Fixed a display bug on the locked message when you dont have a vehicle (inventory": "修复了当你没有车辆时，锁定信息显示的错误(仓库",
        "Added tooltip on locked blueprints to make it more obvious that you need to upgrade the building":
            "为锁定的蓝图添加了提示，以更明显地提醒你需要升级建筑。",

        //v0.3.1
        "Fuel Depot (Explore Location": "燃料库（探索地点）",
        "Discover a new area packed with massive, abandoned fuel tankers, offering a prime opportunity to replenish your fuel reserves":
            "发现一个全新的区域，里面堆满了废弃的巨大油罐车，为补充你的燃料储备提供了绝佳的机会。",
        "Fuel weight has been reduced to 0.75kg": "燃料重量已减少至0.75kg。",
        "Bug causing tools to be taken with 1 use has been fixed": "修复了工具只可使用一次的问题。",
        "Foundation Pit will now cost rad immunity": "基础坑现在需要辐射免疫力。",

        //万圣节活动
        "Halloween Event": "万圣节活动",
        "Happy Halloween": "万圣节快乐",
        "To celebrate the seasonal event, we have added a range of special items for you to find across zed city":
            "为了庆祝季节性活动，我们在Zed城添加了一系列特别物品供你寻找",
        "You can also check in with quest giver called Crazy Hari, who will reward you for finding them all with a special trophy item":
            "你还可以去找名为Crazy Hari的任务发布者，她会奖励你特别的奖杯物品，作为你找到所有物品的奖励",
        "Event Time (GMT): 30th October 2024 22:00:00 - 6th November": "活动时间（GMT）：2024年10月30日22:00:00 - 11月6日",

        //v0.3.0
        Outposts: "前哨站",
        PvP: "玩家对战",
        "Fight other players to gain control of key outposts scattered throughout Zed City. Outposts can be found in the Military Base, Demolition Site and Construction Yard. You can control up to 3 outposts, with each offering unique actions and new crafting recipes":
            "与其他玩家战斗，争夺分布在Zed城的关键前哨站。前哨站可以在军事基地、拆除场和建筑工地找到。你可以控制最多3个前哨站，每个前哨站提供独特的行动和新的制作配方",
        "Take over outposts and battle for dominance over the best land": "占领前哨站，争夺最佳土地的统治权",
        "Take position in your outpost to defend it and defeat anyone attacking": "在你的前哨站占据位置，防守并击败任何攻击者",
        "Be a contributor to war by manufacturing explosives or a defender of the peace by constructing defences":
            "通过制造炸药成为战争的贡献者，或者通过建造防御设施成为和平的捍卫者",
        "Explore Zones": "探索区域",
        "Visit the Demolition Site and Construction Yard to clear hoards of zombies and use new craftable picklocks to open locked gates. Explore through multiple zones to access increasingly rare loot drops":
            "前往拆除场和建筑工地，清除成群的丧尸，使用新的可制作开锁器打开锁住的门。通过多个区域探索，获取越来越稀有的战利品掉落",
        "New multi-zone environments, get lost and explore new lands": "新的多区域环境，迷失其中，探索新土地",
        "Key mechanics and respawning zeds in unique locations": "关键机制和在独特位置重生的丧尸",
        "Some blueprints will now require a minimum skill level": "一些蓝图现在需要最低技能等级",
        "Layout improvement has been made to fill in empty spaces on some pages": "已对一些页面进行了布局改进，以填补空白区域",
        "The order of permissions has been fixed when creating a faction role": "创建派系角色时，权限顺序已修复",
        "Faction profiles can now be visited while exploring": "在探索时可以查看派系档案",

        //v0.2.7
        'Added a "remember me" feature to ensure you stay logged in': "添加了“记住我”功能，以确保你保持登录状态",
        "Reduced amount of Advanced Tools required to craft a level 1 vehicle from 10 to": "减少了制作1级车辆所需的高级工具数量，从10个减少到",
        "When you attempt to craft a blueprint you don't have enough quantity for, it will now show how many items you have":
            "当你尝试制作一个蓝图而数量不足时，现在会显示你有多少物品",

        //v0.2.6
        "Fishing has been expanded, train your new skill by catching a range of new fish, which can be found in various spots across the game. Three fishing rods have been added and they can be obtained in the crafting bench":
            "钓鱼系统已扩展，通过捕捉新的鱼类来训练你的新技能，鱼类可以在游戏中的不同地点找到。添加了三种钓鱼竿，可以在制作台获得",
        "A new building has been added to factions. Team up with faction members to produce new materials and train up your refinery skills":
            "派系中添加了一座新建筑。与派系成员组队，生产新材料并训练你的精炼技能",
        "Explore the reserve and try to catch some fish at the new spots, you may need to defeat some zeds before you are safe to explore":
            "探索保护区，并尝试在新地点捕捉一些鱼，在你安全探索之前，可能需要击败一些丧尸",
        "A new location to explore, gain access to new materials after you defeat the zeds lingering around the place":
            "一个新的探索地点，击败周围徘徊的丧尸后，你将能够获得新材料",
        "Various new trades have been made available in the radio tower": "无线电塔提供了各种新的交易",
        "Removed extra message when destroying / unloading items to reduce clicks": "删除了销毁/卸载物品时的额外信息，减少点击次数",
        "Health will no longer regenerate while you are in a fight": "在战斗中，健康将不再恢复",
        "Vehicle weight will now show to 2 decimal places": "车辆重量现在显示到小数点后两位",
        "Vehicle weight with easter eggs has been fixed": "复活节彩蛋的车辆重量已修复",
        "Fixed bug with radiation immunity not regenerating": "修复了辐射免疫无法恢复的漏洞",

        //v0.2.5
        "Fixed issue showing incorrect quantity in scavenge": "修复了搜索中显示数量不正确的问题",
        "Fixed layout issue on market": "修复了市场布局问题",

        //v0.2.4
        "Quest UI": "任务界面",
        "The quest layout has been updated, you can now see the progress on your objectives from the main quest list. You can click on completed objectives to view more information about them":
            "任务布局已更新，你现在可以从主任务列表查看目标进度。你可以点击已完成的任务来查看更多信息",
        "Travel time to Military Base has been increased to 1 hour": "前往军事基地的旅行时间已增加至1小时",
        "Flux has been added to some loot drops": "某些战利品掉落中已加入Flux",
        "Fixed a bug stopping you from adding the maximum items you have to the market": "修复了一个漏洞，导致你无法将所有物品添加到市场",
        "A bug causing radiation immunity to show 1 when you have none left has been resolved": "修复了一个漏洞，导致在辐射免疫耗尽时显示为1",
        "The page you are on will no longer be lost when you view an item in the market": "在市场查看物品时，当前页面将不会丢失",
        "An issue causing some old weapons to be lost has been fixed": "修复了导致一些旧武器丢失的问题",
        "Fixed a bug which allowed items to be repaired by loading them into a vehicle": "修复了允许通过将物品加载到车辆中来修复物品的漏洞",
        "Resolved a bug where some items bought from market / store would not be stacked": "解决了从市场/商店购买的一些物品无法堆叠的漏洞",

        //v0.2.3
        "Item Market": "物品市场",
        "You can now trade with other survivors using the Market, browse through 100s of offers from other survivors and create up to 6 listings to sell your unwanted items":
            "你现在可以通过市场与其他幸存者交易，浏览来自其他幸存者的100多个报价，并创建最多6个列表来出售你不需要的物品",
        "Fixed layout issues with radio tower trades on mobile": "修复了在移动设备上无线电塔交易的布局问题",
        "Fixed bug which was selling the wrong items in stores": "修复了商店出售错误物品的漏洞",
        "Weapons for sale in store will now stack again": "商店出售的武器现在将再次堆叠",
        "A bug causing weapons to use durability with no ammo has been fixed": "修复了一个漏洞，导致武器在没有弹药的情况下消耗耐久度",
        "Fixed an issue where faction crafting was not showing items from faction storage": "修复了派系制作未显示来自派系储存物品的问题",
        "Inventory will now handle multiple pages without taking up a lot of space": "库存现在可以处理多页数据，而不会占用大量空间",

        //v0.2.2
        "Item Durability": "物品耐久度",
        "Weapons, armour and equipment will now break after their condition reaches 0%. Weapons and armour will remain in your inventory, in a future update we will add ways for these to be dismantled / repaired":
            "武器、护甲和设备在其耐久度达到0%后将会损坏。武器和护甲将保留在你的库存中，在未来的更新中，我们将添加这些物品被拆解/修复的方法",
        "Scavenge Loot": "搜寻战利品",
        "Loot scavenged will no longer dispaly notifications, a new section has been added to show loot recently gained":
            "搜寻到的战利品将不再显示通知，已添加新部分来显示最近获得的战利品",
        "Fixed layout issues with item filters on inventory": "修复了库存中物品过滤器的布局问题",
        "Zed Bot has been updated to handle the full discord sign up process": "Zed Bot已更新，能够处理完整的Discord注册流程",
        'You can now use "Auto-Attack" in fights to automate the battle': "你现在可以在战斗中使用“自动攻击”来自动化战斗",

        //复活节活动
        "Easter Event": "复活节活动",
        "To all our dear players": "致所有亲爱的玩家",
        "As part of our ongoing improvements and features being rolled out during alpha, we have decided this Easter would be a great first candidate for a special holiday event. So with that said may we introduce to you the Great Easter Egg Hunt of 2024 in Zed City":
            "作为我们在alpha阶段推出的持续改进和新功能的一部分，我们决定这次复活节将是第一个特殊节日活动的绝佳候选者。我们很高兴向您介绍2024年Zed城的大复活节彩蛋狩猎",
        "Collect all these yummy eggs to receive special buffs and bonuses": "收集所有这些美味的彩蛋，获得特殊的增益效果和奖励",
        "You can also check in with a new holiday quest giver called Crazy Hari, who can find nothing better to do in the apocalypse but collect all the eggs for her collection":
            "你还可以去找一个新的节日任务发布者，名叫Crazy Hari，她在末日中找不到更好的事情做，只能为她的收藏收集所有彩蛋",
        "Throughout the event you can expect to find lots of common eggs in different scavenges and hunts. These can then be traded using the radio tower to get more rare eggs":
            "在活动过程中，你可以期待在不同的搜寻和狩猎中找到很多普通彩蛋。然后，你可以通过无线电塔交易这些彩蛋，获取更多稀有彩蛋",
        "If you collect an entire set, you can even trade it for the much prized and precious golden egg":
            "如果你收集了整套彩蛋，你甚至可以将其交易为珍贵的金蛋",
        "Event Time (GMT): 27th March 2024 22:00:00 - 2nd April": "活动时间（GMT）：2024年3月27日22:00:00 - 4月2日",

        //v0.2.1
        "Crafting arrows and advanced tools can now be queued": "现在可以排队制作箭矢和高级工具",
        "Crafting time for advanced tools has been reduced to 15 mins": "高级工具的制作时间已减少至15分钟",
        "A bug causing new quests to show as completed has been resolved": "修复了一个漏洞，导致新任务显示为已完成",
        "Time formatting on farm & distillery for team efficiency have been fixed": "农场和酒厂的时间格式已修复，以提高团队效率",
        "A bug has been resolved which was stopping a full stack of items being loaded into a vehicle":
            "已解决一个漏洞，阻止了将完整堆叠的物品加载到车辆中",
        "Travel times will now be displayed on the explore locations": "旅行时间现在将在探索位置上显示",
        "You are no longer able to load ammo into your vehicle (all ammo can be fired without loading it into your vehicle":
            "你现在无法将弹药加载到你的车辆中（所有弹药可以在没有加载到车辆中的情况下开火）",
        "Population counter has been added to explore locations": "已在探索位置添加人口计数器",
        "Quantity inputs will now use the numpad on mobile and tablet devices": "数量输入现在将在移动设备和平板设备上使用数字小键盘",
        "Quantity selector on all crafting benches has been replaced and now allows you to input a number":
            "所有制作台上的数量选择器已被替换，现在允许你输入数字",
        "Alpha introduction will be hidden if you are above level": "alpha介绍将被隐藏如果你的等级超过",

        //v0.2.1
        "You can now explore remote locations in the pursuit of better resources and loot. Once your garage is built and the vehicle repaired, you will be able to travel to the military base. Your vehicle will have a weight capacity, so you will need to decide what valuable loot to transport back":
            "你现在可以探索偏远的地点，寻找更好的资源和战利品。一旦你的车库建好并修理好车辆，你就可以前往军事基地。你的车辆将有一个重量限制，因此你需要决定哪些有价值的战利品需要带回",
        "Garbo Quests": "Garbo任务",
        "To get started with explore and your new vehicle, head over to Garbo and finish up all his quests":
            "要开始探索和使用新车辆，请前往Garbo并完成他的所有任务",
        "Armour Crafting": "盔甲制作",
        "Craft your very own garb to defend yourself in the wasteland. Explore the military base and discover new blueprints to expand your fashionable collection":
            "制作你自己的盔甲，保卫自己在荒原中的安全。探索军事基地并发现新的蓝图，扩展你的时尚收藏",
        "Mini Boss NPC": "迷你Boss NPC",
        "Find a mini boss in the form of the Undead General, a small challenge for newer players to overcome while exploring the new military base":
            "找到一个迷你Boss，形态为不死将军，对于新手玩家来说，这是一个小挑战，在探索新的军事基地时，你将克服它",
        "Morale Boost": "士气提升",
        "Fixes have been made to morale boosting, when your player is over the morale limit you will now see a red timer indicating when your morale will reset":
            "已修复士气提升的问题，当你的玩家超过士气限制时，你将看到一个红色计时器，指示士气将何时重置",
        "Layout when consuming boosters has been updated": "消费增益时的布局已更新",
        "Fixed pagination on stores": "修复了商店中的分页问题",
        "Fixed issue causing page to reload when consuming items": "修复了消费物品时导致页面重新加载的问题",
        "Updated the quantity input to make the + and - buttons easier to click": "更新了数量输入，使+和-按钮更容易点击",

        //v0.1.8
        "Response message will display when adding rations to a role": "添加配给到角色时将显示响应消息",
        "An issue stopping members being assigned to roles has been resolved": "已解决阻止成员分配角色的问题",
        "Fixed a bug where faction leaders were showing as members": "修复了派系领导显示为成员的漏洞",
        Food: "食物",
        "Morale gained from fish and other cooked items has been balanced": "从鱼和其他烹饪食物中获得的士气已平衡",
        "Restock times and max stock have been adjusted for Carp": "已调整鲤鱼的补货时间和最大库存",
        "Skills page has been split into a seperate page for Stats": "技能页面已拆分为单独的属性页面",
        "Fixed ammo not working on Handgun & Desert Eagle": "修复了手枪和沙漠之鹰无法使用弹药的问题",
        "Added level checks when building Kitchen, Ammo Bench & Weapon Bench": "在建造厨房、弹药台和武器台时已添加等级检查",
        "A bug where the menu would disappear in a fight has been resolved": "已解决在战斗中菜单消失的漏洞",

        //v0.1.7
        "Embark on thrilling new adventures with the introduction of carefully crafted quests, each accompanied by specialized NPCs that promise a richer and more immersive storyline":
            "踏上激动人心的新冒险，介绍精心设计的任务，每个任务都伴随着专门的NPC，承诺提供更丰富和更沉浸的故事情节",
        "NPC Scaling": "NPC等级缩放",
        "Prepare for a heightened challenge as NPCs now boast levels ranging from 1 to 100. Witness their stats evolve in tandem with their levels, and reap the rewards of superior loot at higher tiers":
            "准备迎接更高的挑战，因为NPC现在拥有从1到100的等级。见证他们的属性随着等级的提升而变化，并在更高层次获得更好的战利品",
        "Ranged Weapons": "远程武器",
        "Expand your arsenal with the inclusion of weapons featuring ammo. Engage in the art of archery by crafting bows and arrows at your dedicated crafting bench":
            "通过加入具有弹药的武器来扩展你的武器库。在专用的制作工作台上制作弓箭，参与射箭艺术。",
        "Delve into the culinary arts by gathering ingredients in the kitchen to concoct delectable recipes. Savor the fruits of your labor as food items provide substantial morale boosts":
            "通过在厨房收集食材，制作美味的食谱，深入烹饪艺术。品尝你努力的成果，食物可以显著提升士气。",
        "A dedicated weapon bench has been established for the creation of firearms, offering survivors a new dimension in their arsenal":
            "已建立专用的武器台，用于制作火器，为幸存者的武器库增添了新的维度。",
        "Explore the intricacies of combat by crafting various ammo types at the specialized Ammo Bench. Each gun now demands specific ammunition, adding strategic depth to your battles":
            "在专门的弹药工作台上制作各种类型的弹药，深入探索战斗的细节。每把枪现在都需要特定的弹药，增加了战斗的战略深度。",
        Blueprints: "蓝图",
        "Unlock the secrets of the game with not all blueprints automatically revealed. Some must be discovered or purchased, adding an element of mystery and excitement to your journey":
            "解锁游戏的秘密，部分蓝图并非自动揭示，某些蓝图必须通过发现或购买，给你的旅程增添神秘和刺激的元素。",
        "Venture into revamped hunting locations, now featuring distinct rooms and an array of challenging NPCs with escalating difficulty levels":
            "探索重新设计的狩猎地点，现有独特的房间和一系列难度逐渐增加的挑战NPC。",
        "A donator store has been added where you can spend points on energy + rad immunity refills. A refill will be added to your account for every 1 week of inactivity":
            "新增了一个捐赠商店，你可以用积分购买能量和辐射免疫重置。每一周的不活跃都会为你的账户添加一次重置。",
        "Immerse yourself in the community with enhanced forums boasting improved post formatting and user-friendly layouts, ensuring a seamless and enjoyable interaction with fellow survivors":
            "沉浸在社区中，体验改进后的论坛，拥有更好的帖子格式和用户友好的布局，确保与其他幸存者的互动更加流畅愉快。",
        "The issue preventing workers from gaining farming/distillery XP has been successfully resolved": "解决了阻止工人获得农耕/酿酒经验的问题。",
        "Action names in farm, distillery & furnace have been fixed": "已修复农场、酿酒厂和熔炉中的动作名称。",
        "Number formatting has been fixed on team efficiency boost": "已修复团队效率提升中的数字格式。",
        "Create faction will not show if you are already in one": "如果你已经在一个派系中，将不会显示创建派系选项。",

        //v0.1.6
        "Roles have been added to factions, allowing leaders to delegate and assign permissions to members. Custom names can be used which will be visible on the faction profile":
            "已为派系添加角色，允许领导者委派和分配权限给成员。可以使用自定义名称，这些名称将在派系资料页中显示。",
        "Factions now have the ability to allocate rations to members with roles, any member with rations assigned will be able to claim their allowance once per day":
            "派系现在可以分配配给给具有角色的成员，任何分配了配给的成员每天可以领取一次。",
        "Farm & Distillery": "农场与酿酒厂",
        "The farm and distillery are now upgradable allowing for a maximum of 5 workers to join when fully upgraded":
            "农场和酿酒厂现在可以升级，最大允许5名工人加入，升级完成后。",
        "Basic profiles have been created, you can click on any display name in-game to see the players stats":
            "已创建基本的玩家资料，你可以点击游戏中的任何显示名称查看该玩家的统计数据。",
        "Resource bars will refill when activating membership": "激活会员后，资源条将自动填充。",
        "Fixed some layout issues on public homepage": "修复了公共主页上的一些布局问题。",
        "Radio tower bugs have been resolved": "已解决无线电塔的错误。",

        //v0.1.5
        "Accepting / declining faction applications has been fixed": "接受/拒绝派系申请的功能已修复。",
        "Scavenges will not fail now if your morale is": "拾荒将不会失败，当士气为",
        "Players will be automatically logged in after creating an account": "创建账户后，玩家将自动登录。",
        "Improved number formatting on factions": "已改进派系中的数字格式。",
        "Active page on the menu has been fixed and should now work in most sub-pages": "菜单中的活动页面已修复，现在应在大多数子页面中正常工作。",
        "Clicking train in gym too fast would cause an error - this has been fixed": "在健身房点击训练过快会导致错误，这个问题已修复。",
        "Some pages have added caching so once it has been loaded it will not need to load again":
            "一些页面已添加缓存，加载完成后将不再需要重新加载。",
        "Added a link in donator house to help support us with development / hosting costs":
            "在捐赠者之家添加了一个链接，帮助我们支持开发/托管费用。",

        //v0.1.4
        "Chance of success is now based on your scavenge level": "成功的几率现在基于你的垃圾捡拾技能等级。",
        "Morale will have a small boost to the chance of success": "士气将对成功几率产生小幅提升。",
        "A min level has been added to scrapyard": "废料场已添加最低等级要求。",
        'Scavenges will show a list of "Discovered Loot", the list of items will unlock as you find them':
            "垃圾捡拾将显示“已发现的战利品”列表，物品列表将在你找到它们时解锁。",
        "Luck skill maths have been changed to apply to all types of loot": "幸运技能的计算方式已更改，适用于所有类型的战利品。",
        "When a hunt is completed, you will be returned back to the same area": "完成狩猎后，你将返回同一地点。",
        "Bug has been fixed when ordering faction members by level or last active": "修复了按等级或最后活跃时间排序派系成员时出现的错误。",
        "Fixed a bug where leveling up would give the wrong energy if you have membership": "修复了拥有会员时升级给出错误能量的bug。",

        //v0.1.3
        "Zed Wiki": "Zed 维基",
        "A community led wiki has been created to give a more detailed guide to the games features. You can access this by using the menu in the top left and going to Wiki. We would like to thank LadyGuenevere for her help on this":
            "已创建由社区主导的维基，提供更详细的游戏功能指南。你可以通过左上角的菜单访问维基。我们要感谢LadyGuenevere的帮助。",
        "The quest system has been refactored to meet the requirements of the upcoming explore feature, this will mean that your quest progress has been reset":
            "任务系统已重构，以适应即将发布的探索功能，这将意味着你的任务进度已被重置。",
        "Some other bug fixes and improvements for quests are": "一些其他关于任务的bug修复和改进：",
        "Fixed a bug when completing a quest without any rewards": "修复了完成任务时没有任何奖励的bug。",
        "Progress will now show on quest objectives": "任务目标的进度现在会显示出来。",
        "Membership will give you some points, increased max energy and regeneration times with more benefits to be added":
            "会员将给予你一些积分、增加最大能量和恢复次数，未来将增加更多福利。",
        "Survivors list & faction members will now show how long ago a player was last active": "幸存者列表和派系成员现在会显示玩家上次活跃的时间。",
        "Radio tower error on first load has been fixed": "首次加载时无线电塔的错误已修复。",
        "Radio tower & collecting from furnace / crafting bench will no longer add to notifications log":
            "无线电塔和从炉子/制作台收集物品将不再添加到通知日志中。",
        "Notifications will now work as expected when in a fight / injured": "在战斗中或受伤时，通知将按预期工作。",
        "Fixed a bug with limits on leaderboard counters": "修复了排行榜计数器的限制bug。",
        "Discord bot fixed a bug causing roles to be set incorrectly if the player had DM blocked":
            "Discord机器人修复了一个bug，解决了当玩家阻止私信时角色设置不正确的问题。",
        "A server migration has been completed to more efficient hardware and various security patches have been applied":
            "服务器迁移已完成，迁移到了更高效的硬件，并应用了各种安全补丁。",
        "Fixed broken error messages when trying to craft / smelt with not enough resources": "修复了在资源不足时尝试制作/熔炼时出现的错误信息。",
        "Fixed typo on notification sent when being kicked from a faction": "修复了被踢出派系时发送的通知中的拼写错误。",

        //v0.1.2
        "Added direct link for easier sign up with access code": "新增了直接链接，以便通过访问码更轻松地注册。",
        "Discord bot has been created to give out access codes": "已创建Discord机器人，发放访问码。",
        "Nicknames on discord will be set to your in-game username after you sign up using the code given to you":
            "在Discord上的昵称将在你使用给定的访问码注册后设置为你在游戏中的用户名。",

        //v0.1.1
        "Added water as a requirement for brewing beer": "增加了水作为酿造啤酒的必要材料。",
        "Added city stats": "新增了城市统计数据。",
        "Fixed member leaving faction activity log": "修复了成员离开派系时活动日志的问题。",
        "Faction members will display in order of level with the leader first": "派系成员将按等级顺序显示，领导者排在最前面。",
        "Fixed avatar upload": "修复了头像上传的问题。",
        "Fixed mobile layout issue with faction stats": "修复了移动设备上派系统计数据的布局问题。",
        "Changed hover information for morale": "更改了士气的悬停信息。",
        "Fixed a bug where timers would disappear from the stats bar": "修复了计时器从统计条中消失的bug。",
        "Fixed a bug with pages on the survivors list": "修复了幸存者列表页面的bug。",
        "Added number formatting to hall of fame": "为名人堂添加了数字格式。",
        "Added detection of a new version with a notice to reload (this will be visible from the next update":
            "添加了新版本的检测和重新加载通知（将从下一个更新开始可见）。",

        //v0.1.0
        "You can now create or join a faction to with other survivors, this will enable you to grow and brew new resources with the addition of Farm and Distillery. Teamwork will be required to produce resources more efficiently, new player skills have been added (Farming & Distilling), completing these actions will help you level up and give bigger efficiency boosts":
            "你现在可以创建或加入派系，与其他幸存者一起成长，并利用农场和酿酒厂生产新资源。团队合作将是提高资源生产效率的关键，新增了玩家技能（农耕和酿酒），完成这些行动将帮助你升级，并提供更大的效率提升。",
        "Complete raids with your faction to gain loot & faction respect": "与派系一起完成突袭，获得战利品和派系尊敬。",
        "Added notification system": "新增了通知系统。",
        "Gym pays out xp when training": "在健身房训练时，会发放经验值。",
        "A list of players can be found in City -> Survivors": "玩家列表可以在城市 -> 幸存者中找到。",
        "Quantity amounts now display correctly on Crafting & Furnace": "制作和炉子中的物品数量现在正确显示。",
        "Crawlers are easier to defeat": "爬行者更容易被击败。",
        "Resource bars will refill when leveling up": "升级时，资源条将自动填充。",
        "Page title (tab name) will change on different pages": "不同页面上的标签名将发生变化。",

        //v0.0.10
        "Skills have been added to actions Scavenging, Hunting, Crafting & Forging. You will gain skill XP everytime you complete an action":
            "技能已添加到垃圾捡拾、狩猎、制作和锻造行动中。每次完成行动时，你将获得技能经验。",
        "Upgrade & progress bars should run smoothly now": "升级和进度条现在应该运行顺畅。",

        //v0.0.9
        "Perks will allow you to upgrade your max rad immunity, max morale, max life, luck and all fight stats. Skill Points are gained for each level up, there will be more ways to gain them in the future. Your game stats will be available with your current hall of fame rank and a list of your active perks":
            "特技将允许你提升最大辐射免疫、最大士气、最大生命、幸运以及所有战斗统计数据。每次升级都会获得技能点，未来将有更多获得技能点的方法。你的游戏统计数据将与当前名人堂排名和活跃特权列表一起显示。",
        "News is available on the homepage": "新闻将在首页上显示。",

        //v0.0.8
        "Updated homepage layout": "更新了首页布局。",
        "Added discord invite link to homepage": "在首页添加了Discord邀请链接。",

        //v0.0.7
        "Hall of fame has been added to the city": "名人堂已添加到城市。",
        "Formatting has been added to stats bar": "已为统计条添加了格式。",

        //v0.0.6
        "Added fix with recovering HP after being injured": "修复了受伤后恢复生命值的问题。",

        //v0.0.5
        "On the login page, if you have an active session then you will be able to continue without logging in again":
            "在登录页面，如果你有一个活跃的会话，你将能够继续而不需要重新登录。",

        //v0.0.4
        "Cleaned up old code": "清理了旧代码。",

        //v0.0.3
        "Fixed bug stopping all apple devices working": "修复了阻止所有Apple设备正常工作的bug。",

        //v0.0.2
        "Added report a bug to sub menu": "在子菜单中添加了报告bug功能。",
    };

    //3.2 詞典：待處理 (bot7420新增的会添加到这里，七包茶可以从这里移除整理到其它位置)
    const dictPending = {
        // "You have been awarded 8x Whiskey for your membership this month" // 需要用正则形式翻译
        // 前哨站悬浮用户名需要用规则排除


    };

    /* 词典结束 感谢七包茶整理 */

    const dictAll = {
        ...dictCommon,
        ...dictMission,
        ...dictFaction,
        ...dictSkill,
        ...dictExplore,
        ...dictItemCurrencies,
        ...dictMonster,
        ...dictWeather,
        ...dictOutpost,
        ...dictInventory,
        ...dictOther,
        ...dictExperts,
        ...dictPlace,
        ...dictsEquip,
        ...dictWeapon,
        ...dictItemResources,
        ...dictItemAmmo,
        ...dictItemMedical,
        ...dictEnhance,
        ...dictItemEquipment,
        ...dictItemOther,
        ...dictParts,
        ...dictrRigs,
        ...dictItemTrophy,
        ...dictRules,
        ...dictVehicle,
        ...dictVersion,
        ...dictPending,
        ...dictForum,
    };
    const dictAllLowerCase = {};
    for (const key in dictAll) {
        dictAllLowerCase[key.toLowerCase()] = dictAll[key];
    }

    // 翻译网页标题
    // document.querySelector("title").textContent
    if (!localStorage.getItem("script_translate")) {
        localStorage.setItem("script_translate", isZH ? "enabled" : "disabled");
    }
    if (!localStorage.getItem("script_settings_notifications")) {
        localStorage.setItem("script_settings_notifications", "enabled");
    }

    if (localStorage.getItem("script_translate") === "enabled") {
        startTranslatePage();
    }

    function startTranslatePage() {
        translateNode(document.body);

        const observerConfig = {
            attributes: false,
            characterData: true,
            childList: true,
            subtree: true,
        };

        const observer = new MutationObserver(function (e) {
            observer.disconnect();
            for (const mutation of e) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        translateNode(node);
                    }
                } else {
                    if (mutation.target) {
                        translateNode(mutation.target);
                    }
                }
            }
            observer.observe(document.body, observerConfig);
        });

        observer.observe(document.body, observerConfig);
    }

    function translateNode(node) {
        if (node.nodeName === "SCRIPT" && node.nodeName === "STYLE" && node.nodeName === "TEXTAREA") {
            return;
        }

        if (node.classList?.contains("script_do_not_translate")) {
            return;
        }

        if (node.placeholder) {
            translatePlaceholder(node);
        }


        if ((!node.childNodes || node.childNodes.length === 0) && node.textContent) {
            translateTextNode(node);
        }

        if (node.childNodes) {
            for (const subnode of node.childNodes) {
                translateNode(subnode);
            }
        }
    }

    // 翻譯Placeholder
    function translatePlaceholder(node) {
        node.placeholder = dict(node.placeholder);
    }

    // 排除不需要的翻譯
    function translateTextNode(node) {
        if (!node.parentNode) {
            return;
        }

        if (node.parentNode.classList.contains("script_do_not_translate")) {
            return;
        }

        if (node.parentNode.classList.contains("countdown-timer")) {
            return;
        }

        // 排除个人资料页中帮派名
        if (node.parentNode.classList.contains("username")) {
            return;
        }

        // 排除帮派管理顯示的稱謂
        if (node.parentNode.classList.contains("col-shrink") && node.parentNode.classList.contains("leader-text")) {
            return;
        }

        // 排除帮派管理的稱謂
        // 排除带有 ellipsis 类且包含特定单词的内容
        if (node.parentNode.classList.contains("ellipsis") || node.parentNode.closest(".q-virtual-scroll__content")) {
            // 定义需要排除的关键词列表
            const keywords = ['Solider', 'Captian', 'Cook', 'Leader', 'Citizen', 'General'];
            // 检查文本节点内容是否包含任何关键词
            const containsKeyword = keywords.some(keyword =>
                                                  node.textContent.includes(keyword)
                                                 );
            // 如果包含关键词则不翻译
            if (containsKeyword) {
                return;
            }
        }

        // 排除帮派/全球chat容器内的元素，但放行ProseMirror的占位文本元素
        if (node.parentNode.closest(".ProseMirror, .markdown-text")) {
            // 检查当前文本节点的父元素是否是目标占位span（class包含placeholder和ProseMirror-widget）
            const parentIsPlaceholder = node.parentNode?.classList.contains("placeholder") &&
                                        node.parentNode?.classList.contains("ProseMirror-widget");

            /*
            // 新增日志，查看实际判断情况
            console.log("是否在ProseMirror容器内:", true);
            console.log("文本节点内容:", node.textContent);
            console.log("父节点class:", node.parentNode?.className);
            console.log("parentIsPlaceholder结果:", parentIsPlaceholder);
            */

            // 只有「父元素是目标占位span」时才不排除；其他情况继续排除
            if (!parentIsPlaceholder) {
                return;
            }
        }

        // 在 translateTextNode 函数中添加
        if (node.textContent.includes("Write your message")) { // 定位目标文本
           //console.log("待翻译文本:", node.textContent);
           //console.log("dict返回结果:", dict(node.textContent, false, node));
        }

        // 排除右上角菜单中人物ID
        if (node.parentNode.classList.contains("text-subtitle1") && node.parentNode.parentNode.querySelector(".zed-avatar.non-selectable")) {
            return;
        }

        if (
            window.location.href.includes("www.zed.city/factions/") ||
            (window.location.href.includes("www.zed.city/faction/") && !window.location.href.includes("/activity"))
        ) {
            // 排除帮派成员页面中帮派名
            if (node.parentNode.matches("div.text-center.text-h4.text-uppercase.text-no-bg")) {
                return;
            }
            // 排除帮派成员页面中帮派职位
            if (node.parentNode.classList.contains("col-shrink") &&
               (node.parentNode.closest("tr")?.querySelector(".status-online") || node.parentNode.closest("tr")?.querySelector(".status-offline"))
            ) {
                return;
            }
        } else if (window.location.href === "https://www.zed.city/factions") {
            if (node.parentNode.parentNode.matches("td.q-td.text-left")) {
                return;
            }
        } else if (window.location.href.includes("www.zed.city/forum/")) {
            // 排除论坛
            if (node.parentNode.closest(".q-tr.topic-row")) {
                return;
            }
            if (node.parentNode.closest(".title") && node.parentNode.closest(".title").parentNode.querySelector(".forum-text")) {
                return;
            }
            if ((node.parentNode.closest(".markdown-text") && node.parentNode.closest(".forum-text")) || node.parentNode.closest(".forum-username")) {
                return;
            }
            if (node.parentNode.closest(".toastui-editor-main-container")) {
                return;
            }
        } else if (window.location.href.includes("www.zed.city/profile/")) {
            // 排除个人资料页中人物ID
            if (
                node.parentNode.classList.contains("text-h4") &&
                (node.parentNode.parentNode.querySelector(".status-online") || node.parentNode.parentNode.querySelector(".status-offline"))
            ) {
                return;
            }
        }

        let dictResult = null;
        // 战斗日志中，可能有人物ID
        if (node.parentNode.matches(".log-name") || node.parentNode.matches(".player-name")) {
            dictResult = dict(node.textContent, true, node);
        } else {
            dictResult = dict(node.textContent, false, node);
        }

        if (dictResult !== node.textContent) {
            node.parentNode.setAttribute("script_translated_from", node.textContent);
            node.textContent = dictResult;
        }
    }

    function dict(oriText, ignoreUnmatchDueToBeingPossiblePlayerID = false,node) {
        if (!oriText) {
            return;
        }

        let text = oriText;

        // 翻譯特例 Log "日志|原木"
        if (text.trim() === "Logs" && node) {
            // 场景1：幫派区域的 Logs → "日志"
            if (node.parentNode.closest('.q-tab__label') || node.parentNode.closest('.q-col-gutter-xs')) {
                return "日志";
            }
        }

        // 排除规则
        for (const exclude of excludes) {
            if (exclude.toLowerCase() === text.toLocaleLowerCase()) {
                return text;
            }
        }
        for (const excludeReg of excludeRegs) {
            if (excludeReg.test(text)) {
                return text;
            }
        }

        if (/^Zed Packs$/.test(text)) {
            let res = /^Zed Packs$/.exec(text);
            return "丧尸包";
        }

        // XX时间前在线
        if (/^Active (\d+) (minutes|hours|days|months|years) ago$/.test(text)) {
            let res = /^Active (\d+) (minutes|hours|days|months|years) ago$/.exec(text);
            // 时间单位映射表
            const unitMap = {
                'minutes': '分钟',
                'hours': '小时',
                'days': '天',
                'months': '月',
                'years': '年'
            };
            return `${res[1]} ${unitMap[res[2]]}前在线`;
        }

        // 帮派日志
        if (/^([\w\s]+) has joined the faction$/.test(text)) {
            let res = /^([\w\s]+) has joined the faction$/.exec(text);
            return res[1] + " 加入了帮派";
        }
        if (/^([\w\s]+) has left the faction$/.test(text)) {
            let res = /^([\w\s]+) has left the faction$/.exec(text);
            return res[1] + " 退出了帮派";
        }
        if (/^([\w\s]+) has been kicked from the faction$/.test(text)) {
            let res = /^([\w\s]+) has been kicked from the faction$/.exec(text);
            return res[1] + " 被踢出了帮派";
        }
        if (/^([\w\s]+) claimed (\d+)x ([\w\s-']+) rations$/.test(text)) {
            let res = /^([\w\s]+) claimed (\d+)x ([\w\s-']+) rations$/.exec(text);
            return res[1] + " 领取了" + res[2] + "x " + dict(res[3]) + " 配给";
        }
        if (/^([\w\s]+) upgraded ([\w\s]+) to level (\d+)$/.test(text)) {
            let res = /^([\w\s]+) upgraded ([\w\s]+) to level (\d+)$/.exec(text);
            return res[1] + " 将" + dict(res[2]) + " 升级至 " + res[3] + " 级";
        }
        if (/^([\w\s]+) deposited (\d+)x ([\w\s-']+)$/.test(text)) {
            let res = /^([\w\s]+) deposited (\d+)x ([\w\s-']+)$/.exec(text);
            return res[1] + " 存入了 " + res[2] + "x " + dict(res[3]);
        }
        if (/^([\w\s]+) took (\d+)x ([\w\s-']+)$/.test(text)) {
            let res = /^([\w\s]+) took (\d+)x ([\w\s-']+)$/.exec(text);
            return res[1] + " 取出了 " + res[2] + "x " + dict(res[3]);
        }
        if (/^(\d+)x ([\w\s-']+) added to faction storage$/.test(text)) {
            let res = /^(\d+)x ([\w\s-']+) added to faction storage$/.exec(text);
            return res[1] + "x " + dict(res[2]) + " 存入了帮派仓库";
        }
        if (/^([\w\s,-]+) completed ([\w\s-]+) gaining (\d+) respect, (.+)$/.test(text)) {
            let res = /^([\w\s,-]+) completed ([\w\s-]+) gaining (\d+) respect, (.+)$/.exec(text);
            return res[1].replaceAll(" and", ", ") + " 完成了 " + dict(res[2]) + " 获得了 " + res[3] + " 声望, " + parseReceiveItemsLog(res[4]);
        }
        if (/^You completed ([\w\s-]+) and found (.+)$/.test(text)) {
            let res = /^You completed ([\w\s-]+) and found (.+)$/.exec(text);
            return "你完成了 " + dict(res[1]) + " 获得了 " + parseReceiveItemsLog(res[2]);
        }
        function parseReceiveItemsLog(text) {
            let input = text;
            let result = "";
            if (input.endsWith("!")) {
                input = input.substring(0, input.length - 1);
            }
            for (const s of input.replaceAll(", ", " & ").split(" & ")) {
                if (/^(\d+)x ([\w\s-']+)$/.test(s)) {
                    let res = /^(\d+)x ([\w\s-']+)$/.exec(s);
                    result += res[1] + "x " + dict(res[2]) + " & ";
                } else {
                    result += s;
                }
            }
            if (result.endsWith(" & ")) {
                result = result.substring(0, result.length - 3);
            }
            return result + "!";
        }

        // 通知
        if (/^Your application for ([\w\s]+) has been accepted$/.test(text)) {
            let res = /^Your application for ([\w\s]+) has been accepted$/.exec(text);
            return "您的申请 " + res[1] + " 已通过";
        }
        if (/^([\w]+) bought (\d+)x ([\w\s-']+) and you gained \$(\d{1,3}(?:,\d{3})*), your market listing has sold (out)?$/.test(text)) {
            let res = /^([\w]+) bought (\d+)x ([\w\s-']+) and you gained \$(\d{1,3}(?:,\d{3})*), your market listing has sold (out)?$/.exec(text);
            // 根据是否有"out"来决定返回文本
            const soldText = res[5] ? "已售空" : "已售出";
            return `${res[1]} 购买了 ${res[2]}x ${dict(res[3])}，你获得了 $${res[4]}，你的市场上架${soldText}`;
        }
        if (/^([\w\s]+) skill level increased$/.test(text)) {
            let res = /^([\w\s]+) skill level increased$/.exec(text);
            return dict(res[1]) + "技能等级提升";
        }
        if (/^Thank you for subscribing to Zed City! You have been awarded (\d+) Zed Coin and (\d+) days of membership$/.test(text)) {
            let res = /^Thank you for subscribing to Zed City! You have been awarded (\d+) Zed Coin and (\d+) days of membership$/.exec(text);
            return `感谢您订阅 Zed City！您以获得 ${res[1]}丧尸币 和 ${res[2]}天会员`;
        }

        // 你没有足够的XX
        if (/^You do not have enough ([\w\s-']+)$/.test(text)) {
            let res = /^You do not have enough ([\w\s-']+)$/.exec(text);
            return "你没有足够的" + dict(res[1]);
        }

        // 制作XX
        if (
            !text.toLowerCase().startsWith("craft your") &&
            !text.toLowerCase().startsWith("craft some") &&
            !text.toLowerCase().startsWith("craft and") &&
            !text.toLowerCase().startsWith("craft the") &&
            /^Craft ([\w\s-']+)$/.test(text)) {
            let res = /^Craft ([\w\s-']+)$/.exec(text);
            return "制作" + dict(res[1]);
        }
        // !text.toLowerCase().startsWith 無法匹配 XP 轉小寫
        if (
            !text.toLowerCase().startsWith("crafting bench") &&
            !text.toLowerCase().startsWith("crafting bench upgrade") &&
            /^Crafting (?!XP Gain)([\w\s-']+)$/.test(text)) {// 添加了(?!XP Gain)否定前瞻
            let res = /^Crafting (?!XP Gain)([\w\s-']+)$/.exec(text);// 同样添加否定前瞻
            return "正在制作" + dict(res[1]);
        }

        // "Crafting XP Gain"
        if (/^([\w\s-']+) XP Gain$/.test(text)) {
            let res = /^([\w\s-']+) XP Gain$/.exec(text);
            return dict(res[1]) + "XP 获取";
        }
        // 製作類
        if (/^Forge ([\w\s-']+)$/.test(text)) {
            let res = /^Forge ([\w\s-']+)$/.exec(text);
            return "锻造" + dict(res[1]);
        }
        if (/^Forging (?!XP Gain)([\w\s-']+)$/.test(text)) {
            let res = /^Forging (?!XP Gain)([\w\s-']+)$/.exec(text);
            return "正在锻造" + dict(res[1]);
        }
        if (/^Farm ([\w\s-']+)$/.test(text)) {
            let res = /^Farm ([\w\s-']+)$/.exec(text);
            return "种植" + dict(res[1]);
        }

        // 黃色裝備
        if (/^Minor Inspired ([\w\s-']+)$/.test(text)) {
            let res = /^Minor Inspired ([\w\s-']+)$/.exec(text);
            return dict(res[1]) + "启发";
        }

        // 拾荒
        if (/^You scavenged the ([\w\s-']+) but didn't manage to find anything$/.test(text)) {
            let res = /^You scavenged the ([\w\s-']+) but didn't manage to find anything$/.exec(text);
            return "你在" + dict(res[1]) + "中搜寻但没有找到任何东西";
        }
        if (/^You scavenged the ([\w\s-']+) and found$/.test(text)) {
            let res = /^You scavenged the ([\w\s-']+) and found$/.exec(text);
            return "你在" + dict(res[1]) + "中搜寻并发现了";
        }
        if (/^x ([\w\s-']+)$/.test(text)) {
            let res = /^x ([\w\s-']+)$/.exec(text);
            return "x " + dict(res[1]);
        }
        if (/^You do not have a[n]? ([\w\s-']+)$/.test(text)) {
            let res = /^You do not have a[n]? ([\w\s-']+)$/.exec(text);
            return "你没有" + dict(res[1]);
        }
        if (/^You gained ([\d+])([\w\s-']+)$/.test(text)) {
            let res = /^You gained ([\d+])([\w\s-']+)$/.exec(text);
            return "你获得了 " + res[1] + dict(res[2]);
        }

        // 釣魚
        // You fished the Warm Springs but didn't manage to catch anything
        if (/^You fished the ([\w\s-']+) but didn't manage to catch anything$/.test(text)) {
            let res = /^You fished the ([\w\s-']+) but didn't manage to catch anything$/.exec(text);
            return "你在" + dict(res[1]) + "钓鱼,但并没有获得任何东西";
        }

        // 战斗
        if (/^You defeated the ([\w\s-']+) and gained$/.test(text)) {
            let res = /^You defeated the ([\w\s-']+) and gained$/.exec(text);
            return "你击败了 " + dict(res[1]) + "并获得";
        }
        if (/^You defeated the ([\w\s-']+)$/.test(text)) {
            let res = /^You defeated the ([\w\s-']+)$/.exec(text);
            return "你击败了 " + dict(res[1]);
        }
        if (/^and gained$/.test(text)) {
            let res = /^and gained$/.exec(text);
            return "并获得";
        }
        if (/^([\w\s-']+) defeated you and decided to (Leave|Steal From Vehicle)$/.test(text)) {
            let res = /^([\w\s-']+) defeated you and decided to (Leave|Steal From Vehicle)$/.exec(text);
            return res[1] + "击败了你并决定" + (res[2] === "Leave" ? "离开" : "从车辆中偷窃");
        }
        // txwl stole 56x Quartz and 1x Stell Pickaxe from Dagon77!
        if (/^([\w\s-']+) stole (\d+)x ([\w\s-']+) and (\d+)x ([\w\s-']+) from ([\w\s-']+)$/.test(text)) {
            let res = /^([\w\s-']+) stole (\d+)x ([\w\s-']+) and (\d+)x ([\w\s-']+) from ([\w\s-']+)$/.exec(text);
            return res[1] + "偷取了" + res[2] + "x" + dict(res[3]) + "&" + res[4] + "x" + dict(res[5]) + "自" + res[6];
        }


        // 掛車 Remove Basic Cargo Rig
        // Are you sure you want to remove
        if (/^(Are you sure you want to )?(remove|Remove) ([\w\s-']+)$/.test(text)) {
            let res = /^(Are you sure you want to )?(remove|Remove) ([\w\s-']+)$/.exec(text);
            // 提取关键信息
            const hasConfirmPrefix = !!res[1]; // 是否有"Are you sure you want to "前缀
            const target = dict(res[3]); // 要移除的目标

            // 根据是否有确认前缀返回不同结果
            return hasConfirmPrefix ? `确定是否要移除${target}` : `移除${target}`;
        }

        // 未分类
        if (
            !text.startsWith("Build Unloading Bay") &&
            /^(Build|Building) (?!Works)([\w\s-']+)$/.test(text)) {
            let res = /^(Build|Building) (?!Works)([\w\s-']+)$/.exec(text);
            return "建造" + dict(res[2]);
        }
        if (/^You have ran out of ([\w\s-']+)!$/.test(text)) {
            let res = /^You have ran out of ([\w\s-']+)!$/.exec(text);
            return "你已经用完了" + res[1] + "！";
        }

        if (/^([\w\s-']+) Upgrade$/.test(text)) {
            let res = /^([\w\s-']+) Upgrade$/.exec(text);
            return dict(res[1]) + "升级";
        }
        if (/^([\w\s-']+) Level$/.test(text)) {
            let res = /^([\w\s-']+) Level$/.exec(text);
            return dict(res[1]) + "等级";
        }

        if (/^([\w\s-']+) Blueprint$/.test(text)) {
            let res = /^([\w\s-']+) Blueprint$/.exec(text);
            return dict(res[1]) + "蓝图";
        }
        if (/^Your ([\w\s-']+) broke$/.test(text)) {
            let res = /^Your ([\w\s-']+) broke$/.exec(text);
            return "你的" + dict(res[1]) + "损坏了";
        }
        if (/^Thank you for supporting Zed City, (\d+)x Zed Packs have been added to your inventory$/.test(text)) {
            let res = /^Thank you for supporting Zed City, (\d+)x Zed Packs have been added to your inventory$/.exec(text);
            return "感谢您支持Zed City，" + res[1] + "个丧尸包已添加到您的库存中";
        }
        if (/^You fished the ([\w\s-']+) and caught$/.test(text)) {
            let res = /^You fished the ([\w\s-']+) and caught$/.exec(text);
            return "你在" + dict(res[1]) + "钓鱼获得了";
        }

        // 據點
        // Each Crafting Bench cost will be increased up to 10x per Crafting Bench
        // Each Furnace cost will be increased up to 10x per Furnace
        // Each Radio Tower cost will be increased up to 10x per Radio Tower
        if (/^Each ([\w\s-']+) cost will be increased up to 10x per ([\w\s-']+)$/.test(text)) {
            let res = /^Each ([\w\s-']+) cost will be increased up to 10x per ([\w\s-']+)$/.exec(text);
            return "每新增一座" + dict(res[1]) + "建造成本将提升至原成本的10倍";
        }
        // Your cooking skill is not high enough
        if (/^Your ([\w\s-']+) skill is not high enough$/.test(text)) {
            let res = /^Your ([\w\s-']+) skill is not high enough$/.exec(text);
            return "你的" + dict(res[1]) + "，等級不夠";
        }
        // Complete building to access kitchen
        if (/^Complete building to access ([\w\s-']+)$/.test(text)) {
            let res = /^Complete building to access ([\w\s-']+)$/.exec(text);
            return "完成建筑以访问" + dict(res[1]);
        }

        // 前哨站
        // Takeover outpost to access hunting shack
        // Takeover outpost to access fuel pump
        if (/^Takeover outpost to access ([\w\s-']+)$/.test(text)) {
            let res = /^Takeover outpost to access ([\w\s-']+)$/.exec(text);
            return "抢占前哨站以进入【" + dict(res[1]) + "】";
        }

        // 交易 "cosing's Items"
        if (/^([\w\s-']+)'s Items$/.test(text)) {
            let res = /^([\w\s-']+)'s Items$/.exec(text);
            return res[1] + "的物品";
        }
        // Waiting for x's decision
        if (/^Waiting for ([\w\s-']+)'s decision$/.test(text)) {
            let res = /^Waiting for ([\w\s-']+)'s decision$/.exec(text);
            return "等待 " + res[1] + " 的決定";
        }
        if (/^You can only buy\s+(\d+)\s+more\s+items this hour$/.test(text)) {
            let res = /^You can only buy\s+(\d+)\s+more\s+items this hour$/.exec(text);
            return "当前小时内只能买 " + res[1] + " 件物品";
        }
        if (/^([\w\s-']+) invited you to (trade|an activity)$/.test(text)) {
            let res = /^([\w\s-']+) invited you to (trade|an activity)$/.exec(text);
            return res[1] + "邀请你加入" + (res[2] === "trade" ? "交易" : "活动");
        }
        if (/^You bought ([\d+])([\w\s-']+)$/.test(text)) {
            let res = /^You bought ([\d+])([\w\s-']+)$/.exec(text);
            return "你购买了 " + res[1] + dict(res[2]);
        }

        // 帮派
        if (/^Kick ([\w]+)$/.test(text)) {
            let res = /^Kick ([\w]+)$/.exec(text);
            return "踢除" + res[1];
        }
        if (/^Are you sure you want to kick ([\w]+)$/.test(text)) {
            let res = /^Are you sure you want to kick ([\w]+)$/.exec(text);
            return "是否确定踢除" + res[1];
        }
        // Are you sure you want to accept Likayvi?
        if (/^Are you sure you want to accept this trade?$/.test(text)) {
            return "是否接受此項交易"; // 精准对应需求
        }
        // 2. 再匹配通用名称（如 Likayvi、Mike 等，含单个名称或带空格的名称）
        else if (/^Are you sure you want to accept ([\w\s]+)?$/.test(text)) {
            let res = /^Are you sure you want to accept ([\w\s]+)?$/.exec(text);
            return "是否接受『 " + res[1] + " 』的请求"; // 原通用翻译
        }
        if (/^Are you sure you want to join this raid$/.test(text)) {
            let res = /^Are you sure you want to join this raid$/.exec(text);
            return "是否确定加入此突袭";
        }
        if (/^Are you sure you want to join ([\w\s-']+)$/.test(text)) {
            let res = /^Are you sure you want to join ([\w\s-']+)$/.exec(text);
            return "是否确定加入" + dict(res[1]);
        }
        if (/^Brew ([\w\s-']+)$/.test(text)) {
            let res = /^Brew ([\w\s-']+)$/.exec(text);
            return "酿造" + dict(res[1]);
        }
        if (/^Cost:\s[\d,]+\sInfluence$/.test(text)) {
            let res = /^Cost:\s([\d,]+)\sInfluence$/.exec(text);
            return "消耗：" + res[1] + "影响力";
        }
        if (/^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+)!$/.test(text)) {
            let res = /^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+)!$/.exec(text);
            return res[1] + " 完成了袭击" + dict(res[2]) + "并获得了 " + res[3] + " 影响力 & " + res[4] + "x" + dict(res[5]);
        }
        if (/^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+) & (\d+)x ([\w\s-']+)!$/.test(text)) {
            let res = /^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+) & (\d+)x ([\w\s-']+)!$/.exec(text);
            return res[1] + " 完成了袭击" + dict(res[2]) + "并获得了 " + res[3] + " 影响力 & " + res[4] + "x" + dict(res[5]) + " & " + res[6] + "x" + dict(res[7]);
        }
        // Zooooom completed Raid a Farm gaining 35 influence, 1x Scrap, 1x Water & 1x Barley Seeds!
        if (/^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+), (\d+)x ([\w\s-']+) & (\d+)x ([\w\s-']+)!$/.test(text)) {
            let res = /^([\w\s-']+) completed Raid a (Farm|Store|Hospital) gaining (\d+) influence, (\d+)x ([\w\s-']+), (\d+)x ([\w\s-']+) & (\d+)x ([\w\s-']+)!$/.exec(text);
            return res[1] + " 完成了袭击" + dict(res[2]) + "并获得了 " + res[3] + " 影响力 & " + res[4] + "x" + dict(res[5]) + " & " + res[6] + "x" + dict(res[7]) + " & " + res[8] + "x" + dict(res[9]);
        }

        // 技能 => 特技
        if (/^You have (\d+) skill points available$/.test(text)) {
            let res = /^You have (\d+) skill points available$/.exec(text);
            return "你有 " + res[1] + " 点技能点可用";
        }

        // Active XX 分鐘前
        if (/^(\d+) minutes ago$/.test(text)) {
            let res = /^(\d+) minutes ago$/.exec(text);
            return res[1] + " 分钟前";
        }

        // 消除后面空格
        if (/^(.+?)(\s+)$/.test(text)) {
            let res = /^(.+?)(\s+)$/.exec(text);
            return dict(res[1]) + res[2];
        }

        // 消除前面空格
        if (/^(\s+)(.+)$/.test(text)) {
            let res = /^(\s+)(.+)$/.exec(text);
            return res[1] + dict(res[2]);
        }

        // 消除后面的非字母
        if (/^(.+?)([^a-zA-Z]+)$/.test(text)) {
            let res = /^(.+?)([^a-zA-Z]+)$/.exec(text);
            const dict1 = dict(res[1], ignoreUnmatchDueToBeingPossiblePlayerID);
            if (res[2] === "." && dict1.endsWith("。")) {
                return dict1;
            } else if (dict1.endsWith("。") && !res[2].endsWith(".")) {
                return dict1;
            } else if (!dict1.endsWith("。") && res[2].endsWith(".")) {
                return dict1 + res[2].replaceAll(".", "。");
            } else if (!dict1.endsWith("。") && res[2].endsWith(")")) {
                return dict1;
            } else if (res[2] === '."' && dict1.endsWith("。")) {
                return dict1 + res[2].charAt(1);
            } else if (res[2] === '?"' && dict1.endsWith("？")) {
                return dict1 + res[2].charAt(1);
            } else if (res[2] === ")" && (dict1.endsWith("）") || dict1.endsWith("）。"))) {
                return dict1;
            } else if (res[2] === ")." && dict1.endsWith("）。")) {
                return dict1;
            } else if (res[2] === "!" && dict1.endsWith("。")) {
                return dict1.substring(0, dict1.length - 1) + res[2];
            } else if (res[2] === ":" && dict1.endsWith("：")) {
                return dict1;
            } else {
                return dict1 + res[2];
            }
        }

        // 消除前面的非字母
        if (/^([^a-zA-Z]+)(.+)$/.test(text)) {
            let res = /^([^a-zA-Z]+)(.+)$/.exec(text);
            return res[1] + dict(res[2], ignoreUnmatchDueToBeingPossiblePlayerID);
        }

        // 结尾复数
        if (text.toLowerCase().endsWith("es") && dict[text.toLowerCase().slice(0, -2)]) {
            return dict[text.toLowerCase().slice(0, -2)];
        }
        if (text.toLowerCase().endsWith("s") && dict[text.toLowerCase().slice(0, -1)]) {
            return dict[text.toLowerCase().slice(0, -1)];
        }

        if (dictAllLowerCase[text.toLowerCase()]) {
            return dictAllLowerCase[text.toLowerCase()];
        } else {
            if (window.location.href.includes("www.zed.city") && !ignoreUnmatchDueToBeingPossiblePlayerID) {
                if (!unmatchedTexts.includes(text)) {
                    unmatchedTexts.push(text);
                }
                console.log(unmatchedTexts);
            }
            return oriText;
        }
    }
})();



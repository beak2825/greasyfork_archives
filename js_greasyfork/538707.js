// ==UserScript==
// @name         MilkyWayIdle Consumable Stock Alert (Team Channel Only)
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  Alert clan chat when consumables stock is low in MilkyWayIdle
// @author       roastrabbit
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @license      CC-BY-NC-SA-4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538707/MilkyWayIdle%20Consumable%20Stock%20Alert%20%28Team%20Channel%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538707/MilkyWayIdle%20Consumable%20Stock%20Alert%20%28Team%20Channel%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONSUMABLE_THRESHOLD = 100;
    const CHECK_INTERVAL_MS = 30000;
    const warnedItems = new Set();

    // --- Hook init_character_data via MessageEvent patch ---
    const origDesc = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data');
    const isAlreadyHooked = origDesc?.get?.name === 'MWI_hookedGet';

    if (!isAlreadyHooked) {
        const originalGetter = origDesc?.get;
        Object.defineProperty(MessageEvent.prototype, 'data', {
            get: function MWI_hookedGet() {
                const value = originalGetter?.call(this);
                const socket = this.currentTarget;

                if (socket instanceof WebSocket && socket.url.includes("milkywayidle.com/ws")) {
                    try {
                        const parsed = JSON.parse(value);
                        if (parsed?.type === 'init_character_data') {
                            // console.log('[MCSAlert] Hooked init_character_data:', parsed);
                            const names = Object.values(parsed.partyInfo?.sharableCharacterMap || {})
                            .map(player => player.name).filter(Boolean);
                            localStorage.setItem('MCSAlert_activeCombatPlayers', JSON.stringify(names));
                        }
                    } catch (_) {}
                }

                Object.defineProperty(this, 'data', { value }); // prevent re-entry
                return value;
            },
            configurable: true,
            enumerable: true
        });
    }

    const init_Client_Data = localStorage.getItem('initClientData');
    const init_Client_Data_ = JSON.parse(init_Client_Data);
    const item_hrid_to_name = {};
    const item_name_to_hrid = {};

    for (const [hrid, item] of Object.entries(init_Client_Data_.itemDetailMap || {})) {
        if (item && typeof item === 'object' && item.name) {
            item_hrid_to_name[hrid] = item.name;
            item_name_to_hrid[item.name] = hrid;
        }
    }

    const e2c = {
        "Donut": "甜甜圈",
        "Blueberry Donut": "蓝莓甜甜圈",
        "Blackberry Donut": "黑莓甜甜圈",
        "Strawberry Donut": "草莓甜甜圈",
        "Mooberry Donut": "哞莓甜甜圈",
        "Marsberry Donut": "火星莓甜甜圈",
        "Spaceberry Donut": "太空莓甜甜圈",
        "Cupcake": "纸杯蛋糕",
        "Blueberry Cake": "蓝莓蛋糕",
        "Blackberry Cake": "黑莓蛋糕",
        "Strawberry Cake": "草莓蛋糕",
        "Mooberry Cake": "哞莓蛋糕",
        "Marsberry Cake": "火星莓蛋糕",
        "Spaceberry Cake": "太空莓蛋糕",
        "Gummy": "软糖",
        "Apple Gummy": "苹果软糖",
        "Orange Gummy": "橙子软糖",
        "Plum Gummy": "李子软糖",
        "Peach Gummy": "桃子软糖",
        "Dragon Fruit Gummy": "火龙果软糖",
        "Star Fruit Gummy": "杨桃软糖",
        "Yogurt": "酸奶",
        "Apple Yogurt": "苹果酸奶",
        "Orange Yogurt": "橙子酸奶",
        "Plum Yogurt": "李子酸奶",
        "Peach Yogurt": "桃子酸奶",
        "Dragon Fruit Yogurt": "火龙果酸奶",
        "Star Fruit Yogurt": "杨桃酸奶",
        "Stamina Coffee": "耐力咖啡",
        "Intelligence Coffee": "智力咖啡",
        "Defense Coffee": "防御咖啡",
        "Attack Coffee": "攻击咖啡",
        "Power Coffee": "力量咖啡",
        "Ranged Coffee": "远程咖啡",
        "Magic Coffee": "魔法咖啡",
        "Super Stamina Coffee": "超级耐力咖啡",
        "Super Intelligence Coffee": "超级智力咖啡",
        "Super Defense Coffee": "超级防御咖啡",
        "Super Attack Coffee": "超级攻击咖啡",
        "Super Power Coffee": "超级力量咖啡",
        "Super Ranged Coffee": "超级远程咖啡",
        "Super Magic Coffee": "超级魔法咖啡",
        "Ultra Stamina Coffee": "究极耐力咖啡",
        "Ultra Intelligence Coffee": "究极智力咖啡",
        "Ultra Defense Coffee": "究极防御咖啡",
        "Ultra Attack Coffee": "究极攻击咖啡",
        "Ultra Power Coffee": "究极力量咖啡",
        "Ultra Ranged Coffee": "究极远程咖啡",
        "Ultra Magic Coffee": "究极魔法咖啡",
        "Wisdom Coffee": "经验咖啡",
        "Lucky Coffee": "幸运咖啡",
        "Swiftness Coffee": "迅捷咖啡",
        "Channeling Coffee": "吟唱咖啡",
        "Critical Coffee": "暴击咖啡"
    };

    function activateClanChannel() {
        const chatContainer = document.querySelector('div.Chat_chat__3DQkj');
        if (!chatContainer) {
            console.warn("[MCSAlert] Chat container not found.");
            return false;
        }

        const tabButtons = chatContainer.querySelectorAll('button.MuiTab-root');

        for (const btn of tabButtons) {
            const badge = btn.querySelector('span.TabsComponent_badge__1Du26');
            const labelText = badge?.childNodes?.[0]?.textContent?.trim();

            if (labelText === '队伍') {
                btn.click();
                console.log("[MCSAlert] Team channel tab activated.");
                return true;
            }
        }

        console.warn("[MCSAlert] Team tab not found in chat area.");
        return false;
    }


    function getCombatPlayerAlerts() {
        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        const activeCombatPlayers = localStorage.getItem('MCSAlert_activeCombatPlayers');
        const combatPlayers = edibleTools?.Combat_Data?.Combat_Player_Data || {};
        const alertList = [];

        for (const [playerName, playerData] of Object.entries(combatPlayers)) {
            if (activeCombatPlayers.includes(playerName)) {
                // console.log(`Checking active combat player ${playerName}`);
                const inventory = playerData?.Food_Data?.End?.Food || {};
                for (const [itemID, quantity] of Object.entries(inventory)) {
                    if (quantity <= CONSUMABLE_THRESHOLD) {
                        const itemName = item_hrid_to_name[itemID] || itemID;
                        const localizedName = e2c[itemName] || itemName;
                        alertList.push(`[${playerName}] ${localizedName} (${quantity})`);
                    }
                }
            }
        }
        console.log(alertList);
        return alertList;
    }

    async function sendClanMessage(msg) {
        if (!activateClanChannel()) return;

        await new Promise(r => setTimeout(r, 600));
        const input = document.querySelector('.Chat_chatInputContainer__2euR8 form input.Chat_chatInput__16dhX[placeholder="输入消息..."]');
        const button = document.querySelector('.Chat_chatInputContainer__2euR8 form button.Button_button__1Fe9z');
        if (!input || !button) return;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, msg);
        const ev = new Event("input", { bubbles: true });
        input.dispatchEvent(ev);

        button.click(); // Uncomment to send messages automatically
        console.log("[MCSAlert] Prepared message:", msg);
    }

    async function checkAndNotify() {
        console.log("[MCSAlert] Checking consumables...");
        const lowItems = getCombatPlayerAlerts();

        const newlyLow = lowItems.filter(item => !warnedItems.has(item));
        newlyLow.forEach(item => warnedItems.add(item));

        for (const item of Array.from(warnedItems)) {
            if (!lowItems.includes(item)) warnedItems.delete(item);
        }

        if (newlyLow.length > 0) {
            const msg = `[⚠️消耗品警報⚠️] ${newlyLow.join(', ')}`;
            await sendClanMessage(msg);
        } else {
            console.log("[MCSAlert] No new consumables below threshold.");
        }
    }

    function waitForPageReady(callback) {
        const checkInterval = setInterval(() => {
            if (document.querySelector('.Chat_chatInputContainer__2euR8 form input.Chat_chatInput__16dhX[placeholder="输入消息..."]')) {
                clearInterval(checkInterval);
                callback();
            }
        }, 1000);
        setTimeout(() => clearInterval(checkInterval), 20000);
    }

    function setupMonitor() {
        console.log("[MCSAlert] Started monitoring consumables.");
        checkAndNotify();
        setInterval(() => checkAndNotify(), CHECK_INTERVAL_MS);
    }

    if (window.top === window.self) {
        waitForPageReady(setupMonitor);
    }
})();

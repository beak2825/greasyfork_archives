// ==UserScript==
// @name         CALL OF WAR CHEAT! Nexus auto snipe cheapest food market controller teaser free
// @namespace    http://tampermonkey.net/
// @version      0
// @description  dm skymzzz to buy full paid version with ai tools and tons of bots
// @author       Skymzzz
// @match        https://*.callofwar.com/*
// @grant        @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524090/CALL%20OF%20WAR%20CHEAT%21%20Nexus%20auto%20snipe%20cheapest%20food%20market%20controller%20teaser%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/524090/CALL%20OF%20WAR%20CHEAT%21%20Nexus%20auto%20snipe%20cheapest%20food%20market%20controller%20teaser%20free.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__NexusMarketOverlayInjected__) return;
    window.__NexusMarketOverlayInjected__ = true;

    const defaultScanDelay = 5000;
    const defaultThreshold = 15.0;
    const LS_KEYS = {
        buyThreshold: "tm_buy_threshold",
        scanDelay: "tm_scan_delay",
        discordWebhookCritical: "tm_discord_webhook_critical",
        webhookMode: "tm_webhook_mode"
    };

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
        /* Base Reset & Global Styles */
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body, h1, h2, h5, p, input, button, select, label, div {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
        }
        /* Nexus Overlay Container */
        #tm_market_overlay {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: #e8f4fc;
            border: 1px solid #0077cc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 5px;
            z-index: 10000;
            padding: 15px;
            color: #0d47a1;
            display: none;
        }
        #tm_market_overlay h1 {
            font-size: 1.8rem;
            font-weight: 500;
            margin-bottom: 10px;
            cursor: move;
            color: #0d47a1;
        }
        /* Tab Menu */
        .tm_tab_menu {
            display: flex;
            margin-bottom: 10px;
        }
        .tm_tab_menu button {
            flex: 1;
            background: #bbdefb;
            border: none;
            padding: 8px;
            font-size: 1rem;
            color: #0d47a1;
            cursor: pointer;
            transition: background 0.2s;
            border-radius: 5px;
            margin-right: 5px;
            outline: none;
        }
        .tm_tab_menu button:last-child {
            margin-right: 0;
        }
        .tm_tab_menu button.active {
            background: #64b5f6;
            color: #ffffff;
        }
        /* Panels */
        .tm_panel {
            display: none;
        }
        .tm_panel.active {
            display: block;
        }
        /* Uniform Label Style */
        label {
            display: block;
            margin: 8px 0 4px;
            font-size: 0.9rem;
        }
        /* Uniform Input Style */
        input[type="number"],
        input[type="text"],
        select {
            width: 100%;
            padding: 8px;
            font-size: 1rem;
            border: 1px solid #90caf9;
            background: #ffffff;
            color: #0d47a1;
            border-radius: 5px;
            outline: none;
            margin-bottom: 10px;
        }
        /* Button Style */
        button {
            background: #64b5f6;
            border: none;
            color: #ffffff;
            padding: 10px;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
            outline: none;
        }
        /* Action Log */
        #tm_log {
            background: #ffffff;
            border: 1px solid #90caf9;
            padding: 10px;
            height: 150px;
            overflow-y: auto;
            font-family: Consolas, monospace;
            font-size: 0.85rem;
            margin-top: 10px;
            color: #0d47a1;
            border-radius: 5px;
        }
        /* Notification */
        .tm_notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2e7d32;
            color: #fff;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            border: none;
            font-family: 'Roboto', sans-serif;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'tm_market_overlay';
    overlay.innerHTML = `
        <h1 id="tm_drag_handle">Nexus</h1>
        <div class="tm_tab_menu">
            <button id="tm_tab_buy" class="active">Buy Food</button>
            <button id="tm_tab_webhook">Webhooks</button>
        </div>
        <div id="tm_buy_panel" class="tm_panel active">
            <label>Per Unit Buy Threshold:</label>
            <input type="number" id="tm_buy_threshold" step="0.01">
            <label>Scanning Delay (ms):</label>
            <input type="number" id="tm_scan_delay">
            <label>
                <input type="checkbox" id="tm_auto_trade">
                Activate Auto‑Trade
            </label>
        </div>
        <div id="tm_webhook_panel" class="tm_panel">
            <label>Discord Webhook URL:</label>
            <input type="text" id="tm_discord_webhook_critical" placeholder="https://discord.com/api/webhooks/...">
            <label>Webhook Log Mode:</label>
            <select id="tm_webhook_mode">
                <option value="all" selected>All</option>
                <option value="critical">Critical Only</option>
                <option value="errors">Errors Only</option>
            </select>
        </div>
        <h2 style="font-size: 1.1rem; margin-top:10px;">Action Log</h2>
        <div id="tm_log"></div>
    `;
    document.body.appendChild(overlay);

    function loadValue(id, defaultVal) {
        return localStorage.getItem(id) || defaultVal;
    }
    function saveValue(id, value) {
        localStorage.setItem(id, value);
    }
    const inputBuyThreshold = document.getElementById("tm_buy_threshold");
    const inputScanDelay = document.getElementById("tm_scan_delay");
    const inputWebhookCritical = document.getElementById("tm_discord_webhook_critical");
    const inputWebhookMode = document.getElementById("tm_webhook_mode");

    inputBuyThreshold.value = loadValue(LS_KEYS.buyThreshold, defaultThreshold);
    inputScanDelay.value = loadValue(LS_KEYS.scanDelay, defaultScanDelay);
    inputWebhookCritical.value = loadValue(LS_KEYS.discordWebhookCritical, "");
    inputWebhookMode.value = loadValue(LS_KEYS.webhookMode, "all");

    [inputBuyThreshold, inputScanDelay, inputWebhookCritical, inputWebhookMode].forEach(input => {
        input.addEventListener("change", () => {
            saveValue(input.id, input.value);
        });
    });

    function makeDraggable(el, handle) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        handle.style.cursor = 'move';
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            el.style.top = (el.offsetTop - posY) + "px";
            el.style.left = (el.offsetLeft - posX) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    makeDraggable(overlay, document.getElementById("tm_drag_handle"));

    const tabBuy = document.getElementById("tm_tab_buy");
    const tabWebhook = document.getElementById("tm_tab_webhook");
    const panelBuy = document.getElementById("tm_buy_panel");
    const panelWebhook = document.getElementById("tm_webhook_panel");
    function switchTab(activeBtn, activePanel) {
        [tabBuy, tabWebhook].forEach(btn => btn.classList.remove("active"));
        [panelBuy, panelWebhook].forEach(panel => panel.classList.remove("active"));
        activeBtn.classList.add("active");
        activePanel.classList.add("active");
    }
    tabBuy.addEventListener("click", () => switchTab(tabBuy, panelBuy));
    tabWebhook.addEventListener("click", () => switchTab(tabWebhook, panelWebhook));

    function sendDiscordWebhook(message, logType = "all") {
        const mode = inputWebhookMode.value;
        if (mode === "critical" && logType !== "critical") return;
        if (mode === "errors" && logType !== "errors") return;
        const webhookUrl = inputWebhookCritical.value.trim();
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: message })
            }).catch(err => console.error("Discord webhook error:", err));
        }
    }
    function logMessage(msg, logType = "all") {
        const logDiv = document.getElementById("tm_log");
        const entry = document.createElement("div");
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;
        console.log(msg);
        sendDiscordWebhook(msg, logType);
    }

    function confirmBuyDialog() {
        let attempts = 0;
        const interval = setInterval(() => {
            const btn = document.querySelector("#acceptOrderContainer > div.dialog_container.open_animation.func_dialog_container > div.dialog_content.compact > div > div > div.bottom.padding_box_double.layout_row.justify_center > button");
            if (btn) {
                clearInterval(interval);
                btn.click();
                logMessage("Simulated BUY confirmation click using custom selector.", "critical");
            } else {
                attempts++;
                if (attempts >= 10) {
                    clearInterval(interval);
                    logMessage("Buy confirmation button not found after retries.", "critical");
                }
            }
        }, 300);
    }


    function findOffersContainer() {
        return document.querySelector("#stockmarketContainer .all_offers .overview") ||
               document.querySelector("#stockmarketContainer .overview");
    }
    function processBuyOffers() {
        const threshold = parseFloat(inputBuyThreshold.value);
        const container = findOffersContainer();
        if (!container) {
            logMessage("Offers container not found! Attempting to open marketplace...", "critical");
            setTimeout(processBuyOffers, 1000);
            return;
        }
        let chosenRow = null;
        let chosenPrice = Infinity;
        container.querySelectorAll(".layout_row").forEach(row => {
            if (row.classList.contains("order_table_embargo")) return;
            const icon = row.querySelector(".hup_resource_icon[data-simple-tooltip-text]");
            if (!icon || icon.getAttribute("data-simple-tooltip-text").toLowerCase() !== "food") return;
            if (row.querySelector("div.button_premium_increase")) return;
            const limitCell = row.querySelector(".cell_limit");
            if (!limitCell) return;
            const offerPrice = parseFloat(limitCell.textContent.trim());
            if (!isNaN(offerPrice) && offerPrice <= threshold && offerPrice < chosenPrice) {
                chosenPrice = offerPrice;
                chosenRow = row;
            }
        });
        if (!chosenRow) {
            logMessage(`No Food offer found at or below threshold ${threshold}.`, "critical");
            return;
        }
        logMessage(`Chosen Food offer at ${chosenPrice} per unit (threshold: ${threshold}).`, "critical");
        const buyBtn = chosenRow.querySelector("div.button_buy:not(.button_premium_increase), div.func_order_table_buy_button:not(.button_premium_increase)");
        if (!buyBtn) {
            logMessage("Buy button not found in the chosen row.", "critical");
            return;
        }
        buyBtn.click();
        logMessage(`Simulated BUY click for Food at ${chosenPrice} per unit.`, "critical");
        confirmBuyDialog();
    }

    let autoTradeInterval = null;
    function startAutoTrade() {
        if (autoTradeInterval) clearInterval(autoTradeInterval);
        const scanDelay = parseInt(inputScanDelay.value, 10) || defaultScanDelay;
        autoTradeInterval = setInterval(() => {
            if (document.getElementById("tm_auto_trade").checked) {
                processBuyOffers();
            } else {
                stopAutoTrade();
            }
        }, scanDelay);
        logMessage("Auto‑Trade activated.", "critical");
    }
    function stopAutoTrade() {
        if (autoTradeInterval) {
            clearInterval(autoTradeInterval);
            autoTradeInterval = null;
            logMessage("Auto‑Trade deactivated.", "critical");
        }
    }
    document.getElementById("tm_auto_trade").addEventListener("change", function () {
        if (this.checked) startAutoTrade();
        else stopAutoTrade();
    });

    function waitForMarketplace(callback) {
        let marketReadyAttempts = 0;
        const marketInterval = setInterval(() => {
            if (document.querySelector("#stockmarketContainer")) {
                clearInterval(marketInterval);
                callback();
            } else {
                marketReadyAttempts++;
                if (marketReadyAttempts >= 20) {
                    clearInterval(marketInterval);
                    logMessage("Marketplace did not load after waiting.", "critical");
                }
            }
        }, 250);
    }
    function toggleOverlay() {
        waitForMarketplace(() => {
            const marketBtn = document.querySelector("#func_btn_stockmarket");
            if (marketBtn) {
                marketBtn.click();
                logMessage("Marketplace toggled via #func_btn_stockmarket.", "critical");
            } else {
                logMessage("Marketplace button (#func_btn_stockmarket) not found.", "critical");
            }
            overlay.style.display = (overlay.style.display === "block") ? "none" : "block";
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "x") {
            toggleOverlay();
        }
    });
    const marketIcon = document.querySelector(".menu_icon.game_menu-stockmarket");
    if (marketIcon) {
        marketIcon.addEventListener("click", toggleOverlay);
    }

    const initNotice = document.createElement("div");
    initNotice.className = "tm_notification";
    initNotice.textContent = "Nexus free food controller Loaded – Press 'x' to open the marketplace and Nexus btw add skymzzz on Discord for help";
    document.body.appendChild(initNotice);
    setTimeout(() => initNotice.remove(), 5000);


    logMessage("Nexus free food controller Loaded – Press 'x' to open the marketplace and Nexus btw add skymzzz on Discord for help", "critical");
})();

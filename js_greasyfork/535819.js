// ==UserScript==
// @name         Ghost Trade Helper
// @namespace    GreasyDiddy
// @version      1.1
// @description  Adds subtraction buttons for quick money adjustments within trades on Torn.
// @license      MIT
// @author       GreasyDiddy[3455236]
// @match        https://www.torn.com/trade.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535819/Ghost%20Trade%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535819/Ghost%20Trade%20Helper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const normalizeInput = (str) => {
        let cleaned = str.toLowerCase().replace(/,/g, '').trim();
        const units = { k: 1e3, m: 1e6, b: 1e9 };
        const unit = cleaned.slice(-1);
        const multiplier = units[unit] || 1;
        if (units[unit]) cleaned = cleaned.slice(0, -1);
        const num = parseFloat(cleaned);
        return isNaN(num) || num <= 0 ? null : Math.floor(num * multiplier);
    };

    const locateMoneyFields = () => {
        const inputs = document.querySelectorAll(".user-id.input-money");
        return inputs.length === 2 ? [...inputs] : [null, null];
    };

    const updateMoney = (diff, isSet = false) => {
        const [visible, hidden] = locateMoneyFields();
        if (!visible || !hidden) return;
        const current = parseInt(hidden.value) || 0;
        const result = Math.max(0, isSet ? diff : current + diff);
        visible.value = result;
        visible.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const fabricateButton = (label, action) => {
        const btn = document.createElement("input");
        btn.type = "button";
        btn.value = label;
        btn.className = "torn-btn";
        btn.addEventListener("click", action);
        return btn;
    };

    const buildPresetButtons = (container) => {
        container.appendChild(fabricateButton("-1m", () => updateMoney(-1000000)));
        container.appendChild(fabricateButton("-5m", () => updateMoney(-5000000)));
        container.appendChild(fabricateButton("-10m", () => updateMoney(-10000000)));
    };

    const buildCustomButton = (container) => {
        const customBtn = fabricateButton("Custom", () => {
            const userVal = prompt("Enter amount to subtract:");
            const parsed = normalizeInput(userVal || "");
            parsed !== null ? updateMoney(-parsed) : alert("Invalid amount.");
        });
        container.appendChild(customBtn);
    };

    const buildPasteButton = (container) => {
        const pasteBtn = fabricateButton("Paste", async () => {
            try {
                const raw = await navigator.clipboard.readText();
                const clean = raw.replace(/[, $]/g, "");
                const parsed = normalizeInput(clean);
                parsed !== null
                    ? updateMoney(-parsed)
                    : alert("Clipboard doesn't contain a valid amount.");
            } catch (e) {
                console.error("Clipboard error:", e);
                alert("Clipboard access failed. Paste manually.");
            }
        });
        container.appendChild(pasteBtn);
    };

    const injectControls = () => {
        const inputGroup = document.querySelector("div.input-money-group");
        if (!inputGroup) return;

        const refButton = document.querySelector("span.btn-wrap.silver");
        if (!refButton) return;

        const btnWrapper = document.createElement("div");
        const clonedSpacer = refButton.previousElementSibling?.cloneNode();
        if (clonedSpacer) btnWrapper.appendChild(clonedSpacer);

        buildPresetButtons(btnWrapper);
        buildCustomButton(btnWrapper);
        buildPasteButton(btnWrapper);

        inputGroup.parentNode.insertBefore(btnWrapper, inputGroup.nextSibling);
    };

    const watchTradePage = () => {
        if (!window.location.href.includes("trade.php#step=addmoney")) return;

        clearInterval(window.GhostTradeWatch);
        window.GhostTradeWatch = setInterval(() => {
            const moneyFieldExists = document.querySelector(".user-id.input-money");
            const tooFewInputs = document.querySelectorAll("ul.inputs > li > div").length < 3;

            if (moneyFieldExists && tooFewInputs) {
                clearInterval(window.GhostTradeWatch);
                injectControls();
            }
        }, 100);
    };

    window.addEventListener("hashchange", watchTradePage);
    watchTradePage();
})();

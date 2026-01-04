// ==UserScript==
// @name         Torn Vault Deposit Tracker
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Track vault deposits by you and your spouse, displayed under vault-wrap
// @author       AngelofDev [3689828]
// @match        https://www.torn.com/properties.php*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/539822/Torn%20Vault%20Deposit%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/539822/Torn%20Vault%20Deposit%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isVaultPage = location.hash.includes("step=your");
    if (!isVaultPage) return;

    const observer = new MutationObserver(() => {
        const vaultWrap = document.querySelector(".vault-wrap");
        if (vaultWrap && !document.getElementById("vault-tracker-box")) {
            insertTrackerBox(vaultWrap);
        }

        const vaultHistory = document.querySelector(".vault-history-wrap");
        if (vaultHistory) {
            parseVaultHistory(vaultHistory);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function insertTrackerBox(vaultWrap) {
        const box = document.createElement("div");
        box.id = "vault-tracker-box";
        box.style = `
            background: #111;
            color: #fff;
            padding: 10px;
            margin-top: 15px;
            border: 1px solid #444;
            border-radius: 6px;
        `;
        box.innerHTML = `<b>Loading vault deposit tracker...</b>`;

        vaultWrap.insertAdjacentElement("afterend", box);

        // Try showing totals if data exists
        const data = JSON.parse(localStorage.getItem("vaultDepositTracker") || "{}");
        showTotals(data);
    }

    function parseVaultHistory(container) {
        const entries = container.querySelectorAll(".vault-history__item");
        if (!entries.length) return;

        let data = JSON.parse(localStorage.getItem("vaultDepositTracker") || "{}");

        entries.forEach(entry => {
            const text = entry.innerText;
            const timestamp = entry.querySelector(".vault-history__date")?.innerText;
            const id = text + timestamp;

            if (data.processed?.includes(id)) return;

            if (!data.processed) data.processed = [];

            let match;
            if ((match = text.match(/^You deposited \$([\d,]+)/))) {
                const amount = parseInt(match[1].replace(/,/g, ""));
                data.you = (data.you || 0) + amount;
                data.processed.push(id);
            } else if ((match = text.match(/^Your spouse deposited \$([\d,]+)/))) {
                const amount = parseInt(match[1].replace(/,/g, ""));
                data.spouse = (data.spouse || 0) + amount;
                data.processed.push(id);
            }
        });

        localStorage.setItem("vaultDepositTracker", JSON.stringify(data));
        showTotals(data);
    }

    function showTotals(data) {
        const box = document.getElementById("vault-tracker-box");
        if (!box) return;

        box.innerHTML = `
            <b>Vault Deposit Tracker:</b><br>
            You: $${(data.you || 0).toLocaleString()}<br>
            Spouse: $${(data.spouse || 0).toLocaleString()}<br>
            <button id="resetVaultTracker" style="margin-top:5px;">Reset Tracker</button>
        `;

        document.getElementById("resetVaultTracker").addEventListener("click", () => {
            if (confirm("Reset vault deposit tracker?")) {
                localStorage.removeItem("vaultDepositTracker");
                box.innerHTML = `<b>Tracker reset. Reload page to start fresh.</b>`;
            }
        });
    }
})();

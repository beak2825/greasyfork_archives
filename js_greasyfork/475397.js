// ==UserScript==
// @name         Money + Faction Balance Display V2
// @namespace    Madwolf
// @version      5.8.4
// @description  Shows Vault, Cayman, Company, and PERSONAL faction balance in a perfectly positioned box
// @author       MadWolf
// @license      MadWolf [376657]
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @include      https://www.torn.com/*
// @noframes
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/475397/Money%20%2B%20Faction%20Balance%20Display%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/475397/Money%20%2B%20Faction%20Balance%20Display%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        let apiKey = localStorage.getItem('tornApiKey');

        const format = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        //////////////////////////////////////////////////////
        // MODAL PROMPT FOR FIRST-TIME API KEY
        //////////////////////////////////////////////////////
        function showApiModal() {
            if ($("#mw-api-modal").length) return;
            const modalHtml = `
                <div id="mw-api-modal">
                    <div class="mw-modal-content">
                        <h2>Enter Torn API Key</h2>
                        <p style="font-size:12px;margin:10px 0;">
                            <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">Generate limited key here</a>
                        </p>
                        <input type="text" id="mw-api-input-modal" placeholder="Your API Key" autocomplete="off">
                        <button id="mw-save-api-modal">Save & Load</button>
                    </div>
                </div>
            `;
            $("body").append(modalHtml);
            $("#mw-api-input-modal").focus();

            $("#mw-save-api-modal").on("click", () => {
                const key = $("#mw-api-input-modal").val().trim();
                if (!key) return alert("API key cannot be empty.");
                localStorage.setItem("tornApiKey", key);
                apiKey = key;
                $("#mw-api-modal").remove();
                alert("API Key saved! Balances loading...");
                fetchBalances();
            });
        }

        //////////////////////////////////////////////////////
        // SETTINGS PANEL
        //////////////////////////////////////////////////////
        GM_registerMenuCommand("Money Display Settings", openSettingsPanel);

        function openSettingsPanel() {
            $("#mw-settings-panel").remove();
            const html = `
                <div id="mw-settings-panel">
                    <div class="mw-settings-header">Money + Faction Balance Settings</div>
                    <div class="mw-settings-block">
                        <label>API Key (Limited Access Required)</label>
                        <input id="mw-api-input" type="text" value="${apiKey || ''}" placeholder="Enter your key">
                        <button id="mw-save-api">Save Key</button>
                        <button id="mw-test-api">Test Key</button>
                        <button id="mw-delete-api" class="danger">Delete Key</button>
                    </div>
                    <button id="mw-close-settings" class="close-btn">Close</button>
                </div>
            `;
            $("body").append(html);

            $("#mw-close-settings, #mw-settings-panel").on("click", (e) => {
                if (e.target.id === "mw-settings-panel") $("#mw-settings-panel").remove();
            });
            $("#mw-close-settings").on("click", () => $("#mw-settings-panel").remove());

            $("#mw-save-api").on("click", () => {
                const key = $("#mw-api-input").val().trim();
                if (!key) return alert("API key cannot be empty.");
                localStorage.setItem("tornApiKey", key);
                apiKey = key;
                alert("Saved!");
                fetchBalances();
            });

            $("#mw-delete-api").on("click", () => {
                if (confirm("Delete API key?")) {
                    localStorage.removeItem("tornApiKey");
                    apiKey = null;
                    $("#mw-api-input").val("");
                    $("#tm-money-info").remove();
                    alert("API key deleted.");
                }
            });

            $("#mw-test-api").on("click", () => {
                const key = $("#mw-api-input").val().trim();
                if (!key) return alert("Enter a key first.");
                $.ajax({
                    url: "https://api.torn.com/v2/user/money?selections=money",
                    headers: { "Authorization": "ApiKey " + key },
                    success: (data) => data.error ? alert("Error: " + data.error.error) : alert("API Key Works!"),
                    error: () => alert("Network error.")
                });
            });
        }

        //////////////////////////////////////////////////////
        // FETCH BALANCES
        //////////////////////////////////////////////////////
        function fetchBalances() {
            if (!apiKey) return;

            $.ajax({
                url: "https://api.torn.com/v2/user/money",
                headers: { "Authorization": "ApiKey " + apiKey, "accept": "application/json" },
                success: function(data) {
                    if (data?.error) {
                        console.error("API Error:", data.error);
                        return;
                    }

                    const money = data.money || {};
                    let display = "";

                    if (money.vault > 0) display += block("Vault", money.vault);
                    if (money.cayman_bank > 0) display += block("Cayman", money.cayman_bank);
                    if (money.company > 0) display += block("Company", money.company);
                    if (money.faction?.money > 0) display += block("Faction", money.faction.money);

                    if (display) inject(display);
                }
            });
        }

        //////////////////////////////////////////////////////
        // HTML & INJECTION
        //////////////////////////////////////////////////////
        function block(label, amount) {
            return `
                <div class="money-block">
                    <span class="label">${label}:</span>
                    <span class="value">${format.format(amount)}</span>
                </div>
            `;
        }

        function inject(html) {
            $("#tm-money-info").remove();

            const container = $(`
                <div id="tm-money-info" class="tmJsonMashupResults">
                    ${html}
                </div>
            `);

            // Robust targeting: try aria-label first, then class fallback
            let pointsLink = $('a[aria-label="Use Points"]').first();
            if (!pointsLink.length) {
                pointsLink = $(".use___wM1PI").first();
            }

            if (pointsLink.length) {
                pointsLink.after(container);
            } else {
                // Fallback: append to points block like your old perfect version
                const pointsBlock = $("div[class^=points]");
                if (pointsBlock.length) {
                    pointsBlock.append(container);
                }
            }
        }

        //////////////////////////////////////////////////////
        // CSS – Perfect box from your old version + bold labels
        //////////////////////////////////////////////////////
        GM_addStyle(`
            /* Settings Panel & Modal */
            #mw-settings-panel, #mw-api-modal {
                position: fixed;
                z-index: 99999;
                font-family: Arial, sans-serif;
            }
            #mw-settings-panel {
                top: 60px; left: 50%; transform: translateX(-50%);
                width: 450px; padding: 20px; background: #1d1f21; color: white;
                border: 2px solid #444; border-radius: 8px;
            }
            .mw-settings-header { font-size: 18px; font-weight: bold; margin-bottom: 15px; text-align: center; }
            .mw-settings-block label { display: block; margin-bottom: 5px; }
            #mw-api-input { width: 100%; padding: 8px; background: #2b2b2b; color: white; border: 1px solid #555; border-radius: 4px; }
            #mw-save-api, #mw-test-api { margin-right: 6px; padding: 6px 12px; background: #6cc644; color: white; border: none; border-radius: 4px; cursor: pointer; }
            .danger { background: #922 !important; }
            .close-btn { width: 100%; padding: 8px; background: #444; color: white; border: none; border-radius: 4px; margin-top: 10px; }

            #mw-api-modal {
                background: rgba(0,0,0,0.7); width: 100%; height: 100%; top: 0; left: 0;
                display: flex; align-items: center; justify-content: center;
            }
            .mw-modal-content {
                background: #1d1f21; padding: 25px; border: 2px solid #444; border-radius: 8px; text-align: center; width: 360px; max-width: 90%;
            }
            .mw-modal-content input { width: 85%; padding: 10px; background: #2b2b2b; color: white; border: 1px solid #555; border-radius: 4px; }
            .mw-modal-content button { margin-top: 12px; padding: 10px 20px; background: #6cc644; color: white; border: none; border-radius: 4px; font-weight: bold; }

            /* MONEY BOX – Your perfect positioning + improved style */
            #tm-money-info.tmJsonMashupResults {
                display: inline-block;
                vertical-align: left;
                margin-left: -6px;
                margin-top: 1.8px;
                padding: 2px 8px;
                background: rgba(0,0,0,0.35);
                border-radius: 1px;
                font-size: 8.6pt;
                line-height: 1.6;
                min-width: 148px;
            }
            .money-block {
                white-space: nowrap;
                margin: 1.20px 0;
            }
            .money-block .label {
                font-weight:bold;
                color: #cccccc;
                margin-right: 6px;
            }
            .money-block .value {
                color: #6cc644;
                font-weight: 500;
            }
        `);

        //////////////////////////////////////////////////////
        // START
        //////////////////////////////////////////////////////
        if (!apiKey) {
            showApiModal();
        } else {
            fetchBalances();
        }
    });
})();
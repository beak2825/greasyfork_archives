// ==UserScript==
// @name         Torn Stock Tracker
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @license      MIT
// @description  Displays stock profit/loss % on the Stock Market button in the menu.
// @author       Cypher-[2641265]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @connect      torn.com
// @downloadURL https://update.greasyfork.org/scripts/540874/Torn%20Stock%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/540874/Torn%20Stock%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- API Key logic ---
    function getApiKey() {
        return localStorage.getItem('stockTrackerAPIKey') || "";
    }
    function setApiKey(key) {
        localStorage.setItem('stockTrackerAPIKey', key);
    }
    function showApiKeyPopup(onSubmit) {
        // Remove any existing popup
        const oldPopup = document.getElementById('stock-popup');
        if (oldPopup) oldPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'stock-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '24px 18px 18px 18px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 16px #000a';
        popup.style.zIndex = 99999;
        popup.style.minWidth = '320px';
        popup.style.textAlign = 'center';

        popup.innerHTML = `
            <div style="font-size:1.1em;margin-bottom:10px;">Enter your Torn API Key</div>
            <input id="api-key-input" type="text" placeholder="API Key" style="width:90%;padding:6px;margin-bottom:10px;border-radius:4px;border:1px solid #444;background:#111;color:#fff;">
            <br>
            <button id="api-key-btn" style="padding:6px 18px;border-radius:4px;border:none;background:#4caf50;color:#fff;font-weight:bold;cursor:pointer;">Save</button>
        `;

        document.body.appendChild(popup);

        document.getElementById('api-key-btn').onclick = function() {
            const val = document.getElementById('api-key-input').value.trim();
            if (val) {
                onSubmit(val);
                popup.remove();
            }
        };
        document.getElementById('api-key-input').onkeydown = function(e) {
            if (e.key === 'Enter') {
                document.getElementById('api-key-btn').click();
            }
        };
        document.getElementById('api-key-input').focus();
    }

    // --- Main logic ---
    let apiKey = getApiKey();
    let lastSearch = localStorage.getItem('tornStockSearch') || "";
    let lastPriceData = JSON.parse(localStorage.getItem('tornStockLastPriceData')) || null;

    function startScript() {
        const tornStockAPI = `https://api.torn.com/torn/?selections=stocks&key=${apiKey}`;
        const userStockAPI = `https://api.torn.com/user/?selections=stocks&key=${apiKey}`;

        // Utility: Find the Stock Market button in the Areas menu
        function getStockMarketButton() {
            return document.querySelector('#nav-stock_market .desktopLink___SG2RU .linkName___FoKha');
        }

        // Render the % next to the Stock Market button
        function renderStockPercent(acronym, percent) {
            const btn = getStockMarketButton();
            if (!btn) return;

            // Remove ALL old percent spans in the row to prevent duplicates
            const row = btn.closest('.area-row___iBD8N') || btn.parentElement;
            if (row) {
                row.querySelectorAll('.stock-profit-percent').forEach(el => el.remove());
            }

            let span = document.createElement('span');
            span.className = 'stock-profit-percent';
            span.style.position = "absolute";
            span.style.right = "7px";
            span.style.top = "50%";
            span.style.transform = "translateY(-50%)";
            span.style.pointerEvents = "auto";
            span.style.cursor = "pointer";

            if (typeof percent === "number") {
                const sign = percent > 0 ? "+" : "";
                let color = "#ddd";
                if (percent < 0) {
                    color = "#e53935"; // red for negative
                } else if (percent > 0.5) {
                    color = "#4caf50"; // green for > 0.5%
                }
                span.style.color = color;
                span.textContent = `(${sign}${percent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%)`;
            } else {
                // First time use or no stock set
                span.style.color = "#aaa";
                span.textContent = "Setup";
            }

            // Popup on click
            span.onclick = function(e) {
                e.stopPropagation();
                if (!getApiKey()) {
                    showApiKeyPopup(function(key) {
                        setApiKey(key);
                        apiKey = key; // <-- update the main variable
                        // After setting API key, show the stock popup
                        showStockPopup(acronym, function(newSearch) {
                            localStorage.setItem('tornStockSearch', newSearch);
                            lastSearch = newSearch;
                            // update API URLs with new key
                            startScript();
                        });
                    });
                } else {
                    showStockPopup(acronym, function(newSearch) {
                        localStorage.setItem('tornStockSearch', newSearch);
                        lastSearch = newSearch;
                        fetchAndDisplayStockPercent(newSearch);
                    });
                }
            };

            // Ensure the parent is positioned relatively
            if (row.classList && row.classList.contains('area-row___iBD8N')) {
                row.style.position = "relative";
                row.appendChild(span);
            } else {
                btn.parentElement.appendChild(span);
            }
        }

        // Fetch and update the percent
        function fetchAndDisplayStockPercent(searchTerm) {
            if (!searchTerm) {
                renderStockPercent("", null);
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: tornStockAPI,
                onload: function(stockResponse) {
                    const stockData = JSON.parse(stockResponse.responseText);
                    const stocks = stockData.stocks || {};
                    let foundStock = null;
                    for (const id in stocks) {
                        const stock = stocks[id];
                        if (
                            stock.acronym.toLowerCase() === searchTerm.toLowerCase() ||
                            stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ) {
                            foundStock = { ...stock, id };
                            break;
                        }
                    }
                    if (!foundStock) {
                        renderStockPercent("", null);
                        return;
                    }

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: userStockAPI,
                        onload: function(userResponse) {
                            const userData = JSON.parse(userResponse.responseText);
                            const userStocks = userData.stocks || {};
                            const userStock = userStocks[foundStock.id];
                            const currentPrice = Number(foundStock.current_price);
                            let profitLossPercent = 0;
                            if (userStock && userStock.transactions) {
                                let totalShares = 0;
                                let totalCost = 0;
                                for (const txId in userStock.transactions) {
                                    const tx = userStock.transactions[txId];
                                    const shares = Number(tx.shares);
                                    const boughtPrice = Number(tx.bought_price);
                                    if (!isNaN(shares) && !isNaN(boughtPrice)) {
                                        totalShares += shares;
                                        totalCost += shares * boughtPrice;
                                    }
                                }
                                if (totalShares > 0) {
                                    const avgBoughtPrice = totalCost / totalShares;
                                    profitLossPercent = ((currentPrice - avgBoughtPrice) / avgBoughtPrice) * 100;
                                }
                            }
                            renderStockPercent(foundStock.acronym, profitLossPercent);
                            // Save latest data to localStorage
                            localStorage.setItem('tornStockLastPriceData', JSON.stringify({
                                acronym: foundStock.acronym,
                                price: currentPrice,
                                priceColor: profitLossPercent
                            }));
                        },
                        onerror: function() {
                            renderStockPercent(foundStock.acronym, 0);
                            localStorage.setItem('tornStockLastPriceData', JSON.stringify({
                                acronym: foundStock.acronym,
                                price: Number(foundStock.current_price),
                                priceColor: 0
                            }));
                        }
                    });
                },
                onerror: function() {
                    renderStockPercent("", null);
                }
            });
        }

        // Wait for the menu to load, then inject the percent
        function waitForMenuAndUpdate() {
            if (!getApiKey()) {
                renderStockPercent("", null);
                return;
            }
            const btn = getStockMarketButton();
            if (btn) {
                let search = lastSearch;
                if (!search && lastPriceData && lastPriceData.acronym) {
                    search = lastPriceData.acronym;
                }
                fetchAndDisplayStockPercent(search);
            } else {
                setTimeout(waitForMenuAndUpdate, 500);
            }
        }

        // Update on page load and every 5 minutes
        waitForMenuAndUpdate();
        setInterval(waitForMenuAndUpdate, 300000);

        // Optional: re-inject on SPA navigation (if Torn uses AJAX navigation)
        document.body.addEventListener('click', function(e) {
            setTimeout(waitForMenuAndUpdate, 1000);
        });

        // --- Popup logic ---
        function showStockPopup(currentValue, onSubmit) {
            // Remove any existing popup
            const oldPopup = document.getElementById('stock-popup');
            if (oldPopup) oldPopup.remove();

            const popup = document.createElement('div');
            popup.id = 'stock-popup';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.background = '#222';
            popup.style.color = '#fff';
            popup.style.padding = '24px 18px 18px 18px';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0 2px 16px #000a';
            popup.style.zIndex = 99999;
            popup.style.minWidth = '260px';
            popup.style.textAlign = 'center';

            popup.innerHTML = `
                <div style="font-size:1.1em;margin-bottom:10px;">Track a different stock</div>
                <input id="stock-popup-input" type="text" value="${currentValue || ''}" placeholder="Stock acronym or name" style="width:90%;padding:6px;margin-bottom:10px;border-radius:4px;border:1px solid #444;background:#111;color:#fff;">
                <br>
                <button id="stock-popup-btn" style="padding:6px 18px;border-radius:4px;border:none;background:#4caf50;color:#fff;font-weight:bold;cursor:pointer;">Track</button>
                <button id="stock-popup-cancel" style="padding:6px 12px;border-radius:4px;border:none;background:#888;color:#fff;margin-left:8px;cursor:pointer;">Cancel</button>
            `;

            document.body.appendChild(popup);

            document.getElementById('stock-popup-btn').onclick = function() {
                const val = document.getElementById('stock-popup-input').value.trim();
                if (val) {
                    onSubmit(val);
                    popup.remove();
                }
            };
            document.getElementById('stock-popup-cancel').onclick = function() {
                popup.remove();
            };
            document.getElementById('stock-popup-input').onkeydown = function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('stock-popup-btn').click();
                }
            };
            document.getElementById('stock-popup-input').focus();
        }
    }

    // --- Entry point: do NOT prompt for API key on load, just start script ---
    startScript();

})();
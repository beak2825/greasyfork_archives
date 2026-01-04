// ==UserScript==
// @name         ZedCity Radio Tower Values
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Shows trade values on the radio tower dynamically
// @author       You
// @license      MIT
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527073/ZedCity%20Radio%20Tower%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/527073/ZedCity%20Radio%20Tower%20Values.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("📢 ZedCity Radio Tower Script Loaded!");

    let marketData = {}; // Store market prices
    let radioTowerData = null; // Store intercepted API data
    let marketDataReady = false; // Track market data availability

    function formatNumber(num) {
        return num.toLocaleString();
    }

    async function fetchMarketData() {
        if (marketDataReady) return; // Skip if already fetched

        try {
            let response = await fetch("https://api.zed.city/getMarket", {
                method: "POST",
                credentials: "include"
            });
            let data = await response.json();
            if (data.error) {
                console.error("❌ Market API Error:", data.error);
                return;
            }
            console.log("📡 Market API Data Fetched:", data);

            if (data.items) {
                data.items.forEach(item => {
                    marketData[item.codename] = {
                        price: item.market_price,
                        quantity: item.quantity
                    };
                });
            }
            marketDataReady = true;
        } catch (error) {
            console.error("❌ Error Fetching Market Data:", error);
        }
    }

    async function processRadioTowerData() {
        if (!marketDataReady || !radioTowerData) {
            console.log("⌛ Market data or Radio Tower data not ready. Waiting...");
            setTimeout(processRadioTowerData, 500);
            return;
        }

        console.log("📦 Processing Radio Tower Trades...");

        let tradeContainers = await waitForElements(".col-xs-12.text-center");

        if (tradeContainers.length === 0) {
            console.warn("⚠️ No trade containers found, retrying...");
            setTimeout(processRadioTowerData, 500);
            return;
        }

        console.log(`✅ Found ${tradeContainers.length} unlocked trade containers.`);

        radioTowerData.items.forEach((trade, index) => {
            let inputItems = [];
            let outputItems = [];
            let inputTotal = 0;
            let outputTotal = 0;

            if (trade.vars.items) {
                Object.values(trade.vars.items).forEach(item => {
                    let marketPrice = marketData[item.codename]?.price || 0;
                    let totalPrice = marketPrice * item.req_qty;
                    inputTotal += totalPrice;
                    inputItems.push(`(${item.req_qty}) ${item.name} <span style='font-family: Arial, sans-serif;'>$</span>${formatNumber(marketPrice)}`);
                });
            }

            if (trade.vars.output) {
                Object.values(trade.vars.output).forEach(item => {
                    let marketPrice = marketData[item.codename]?.price || 0;
                    let totalPrice = marketPrice * item.quantity;
                    outputTotal += totalPrice;
                    outputItems.push(`(${item.quantity}) ${item.name} <span style='font-family: Arial, sans-serif;'>$</span>${formatNumber(marketPrice)}`);
                });
            }

            let tradeColor = outputTotal >= inputTotal ? "green" : "red";
            let tradeText = `<span style='font-family: Arial, sans-serif;'>$</span>${formatNumber(inputTotal)} for <span style='font-family: Arial, sans-serif;'>$</span>${formatNumber(outputTotal)}
<br><br>\n${inputItems.join(" and ")} for ${outputItems.join(" and ")}`;

            if (index < tradeContainers.length) {
                displayTradeInfo(tradeText, tradeContainers[index], tradeColor);
            }
        });
    }

    function displayTradeInfo(tradeText, container, color) {
        try {
            if (container) {
                let existingInfo = container.querySelector(".trade-info");
                if (existingInfo) {
                    existingInfo.innerHTML = tradeText;
                    existingInfo.style.color = color;
                    existingInfo.style.fontFamily = "Oswald, sans-serif";
                } else {
                    let infoTag = document.createElement("div");
                    infoTag.className = "trade-info";
                    infoTag.style.color = color;
                    infoTag.style.fontSize = "14px";
                    infoTag.style.marginTop = "10px";
                    infoTag.style.textAlign = "center";
                    infoTag.style.fontFamily = "Oswald, sans-serif";
                    infoTag.innerHTML = tradeText;
                    container.appendChild(infoTag);
                }
            }
        } catch (error) {
            console.error("❌ Error displaying trade info:", error);
        }
    }

    async function waitForElements(selector, timeout = 5000) {
        return new Promise((resolve) => {
            let checkInterval = setInterval(() => {
                let elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(checkInterval);
                    resolve(elements);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkInterval);
                resolve([]);
            }, timeout);
        });
    }

    // **Intercept API Calls & Load Data at the Right Time**
    (function () {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch(...args);
            if (args[0].includes("/getRadioTower")) {
                console.log("📡 Detected Radio Tower API Call! Storing data...");
                response.clone().json().then((data) => {
                    radioTowerData = data;
                    processRadioTowerData(); // Ensure data is inserted at the right time
                });
            }
            return response;
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._interceptedURL = url;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this._interceptedURL.includes("/getRadioTower")) {
                    console.log("📡 Detected Radio Tower API Call via XHR! Storing data...");
                    try {
                        radioTowerData = JSON.parse(this.responseText);
                        processRadioTowerData();
                    } catch (e) {
                        console.error("❌ Error processing intercepted response:", e);
                    }
                }
            });
            return originalSend.apply(this, arguments);
        };
    })();

    console.log("🕵️ Listening for Radio Tower API calls...");

    // **Ensure Market Data Loads First**
    window.addEventListener('load', async () => {
        console.log("🚀 Page loaded. Fetching market data...");
        await fetchMarketData();
    });

})();

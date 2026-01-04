// ==UserScript==
// @name         Stronghold Upgrade Cost Calculator
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.7.1
// @description  Fetch stronghold and market data and calculate upgrade costs when upgrade button is clicked for the correct building
// @author       YoYo
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527610/Stronghold%20Upgrade%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/527610/Stronghold%20Upgrade%20Cost%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const strongholdUrl = "https://api.zed.city/getStronghold";
    const marketUrl = "https://api.zed.city/getMarket";

    /**
     * Fetch JSON data from a given URL using GM_xmlhttpRequest.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<Object>} - A promise resolving to the parsed JSON response.
     */
    function fetchJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    try {
                        console.log(`Fetched data from ${url}`);
                        resolve(JSON.parse(response.responseText));
                    } catch (e) {
                        console.error(`Error parsing JSON from ${url}:`, e);
                        reject(e);
                    }
                },
                onerror: err => {
                    console.error(`Error fetching ${url}:`, err);
                    reject(err);
                }
            });
        });
    }

    /**
     * Calculate and display the upgrade costs when the upgrade button is clicked.
     */
    async function calculateUpgradeCosts() {
        try {
            console.log("Fetching stronghold and market data...");
            const strongholdData = await fetchJson(strongholdUrl);
            const marketData = await fetchJson(marketUrl);

            // Map market prices by codename
            const marketPrices = marketData.items.reduce((acc, item) => {
                acc[item.codename] = item.market_price || 0;
                return acc;
            }, {});

            console.log("Stronghold Upgrade Costs Calculation Initialized");

            document.addEventListener("click", (event) => {
                const button = event.target.closest("button[data-cy='upgrade-building-btn']");
                if (!button) return;

                console.log("Upgrade button clicked");
                setTimeout(() => {
                    let buildingElement = document.querySelector(".building-name.non-selectable");
                    if (!buildingElement) {
                        console.warn("Building name element not found");
                        return;
                    }

                    let buildingName = buildingElement.innerText.trim();
                    console.log(`Detected building: ${buildingName}`);

                    let building = Object.values(strongholdData.stronghold).find(b => b.name.toLowerCase() === buildingName.toLowerCase());
                    if (!building) {
                        console.warn(`No stronghold data found for: ${buildingName}`);
                        return;
                    }

                    if (!building.upgrade) {
                        console.warn(`No upgrade available for: ${buildingName}`);
                        return;
                    }

                    const upgrade = building.upgrade;
                    let totalCost = 0;
                    let costBreakdown = [];

                    Object.values(upgrade.items).forEach(item => {
                        if (item.codename === "money") {
                            costBreakdown.push(`Cash: $${item.req_qty.toLocaleString()}`);
                            totalCost += item.req_qty;
                        } else {
                            const itemPrice = marketPrices[item.codename] || 0;
                            const itemTotalCost = itemPrice * item.req_qty;
                            totalCost += itemTotalCost;
                            costBreakdown.push(`$${itemTotalCost.toLocaleString()} for ${item.req_qty} ${item.name} ($${itemPrice.toLocaleString()} each)`);
                        }
                    });

                    console.log(`${upgrade.name} total cost: $${totalCost.toLocaleString()}`);
                    costBreakdown.forEach(line => console.log(line));

                    let upgradeModal = document.querySelector(".small-modal .zed-grid.has-title.has-content .grid-cont.text-center");
                    if (!upgradeModal) {
                        console.warn("Upgrade modal not found");
                        return;
                    }

                    // Remove existing cost breakdown to avoid duplication
                    let existingCostDiv = upgradeModal.querySelector(".upgrade-cost-breakdown");
                    if (existingCostDiv) {
                        existingCostDiv.remove();
                    }

                    let costDiv = document.createElement("div");
                    costDiv.className = "upgrade-cost-breakdown q-mt-md";
                    costDiv.style.fontWeight = "bold";
                    costDiv.style.color = "#FFD700";
                    costDiv.innerHTML = `<p>${upgrade.name} total cost: $${totalCost.toLocaleString()}</p>` +
                                        costBreakdown.map(line => `<p>${line}</p>`).join("");
                    upgradeModal.appendChild(costDiv);
                    console.log("Upgrade cost breakdown successfully injected");
                }, 500);
            });
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }

    calculateUpgradeCosts();
})();

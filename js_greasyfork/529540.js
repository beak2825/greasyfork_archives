// ==UserScript==
// @name         Zed Market Quality Filter
// @namespace    http://tampermonkey.net/
// @version      2025-03-11
// @license      MIT
// @description  Hide low-quality items on Zed Market
// @author       YoYo
// @match        https://www.zed.city/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/529540/Zed%20Market%20Quality%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/529540/Zed%20Market%20Quality%20Filter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    console.log("Userscript Loaded: Zed Market Quality Filter");
    let hideLowQuality = true;
    let offersData = [];

    async function fetchOffers() {
        let item = new URLSearchParams(window.location.search).get('item');
        if (!item) {
            console.warn("No item found in URL parameters.");
            return;
        }

        console.log("Fetching offers for item:", item);
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.zed.city/getOffers?item=${item}`,
            onload: function(response) {
                console.log("API Response Status:", response.status);
                console.log("Raw Response:", response.responseText);

                try {
                    if (response.status === 200 && response.responseText) {
                        offersData = JSON.parse(response.responseText);
                        console.log("Parsed Offers Data:", offersData);
                        filterOffers();
                    } else {
                        console.warn("Invalid API response or empty data.");
                    }
                } catch (error) {
                    console.error("Error parsing API response:", error);
                    alert("Error processing market data! Check the console for details.");
                }
            },
            onerror: function(error) {
                console.error("Request failed:", error);
                alert("Failed to fetch market data! Check the console for details.");
            }
        });
    }

    function filterOffers() {
        console.log("Filtering offers...", hideLowQuality ? "Hiding low-quality items." : "Showing all items.");

        let allItems = document.querySelectorAll('tr.q-tr');
        console.log("All market items before filtering:", allItems);

        allItems.forEach(item => {
            let conditionElement = item.querySelector('.stat-condition div');
            if (conditionElement) {
                let conditionValue = parseFloat(conditionElement.innerText.replace('%', ''));
                console.log("Item condition:", conditionValue, "Item Element:", item);

                if (hideLowQuality && conditionValue < 50) {
                    item.style.setProperty("display", "none", "important");
                    console.log("Hiding item with condition:", conditionValue);
                } else {
                    item.style.setProperty("display", "table-row", "important");
                    console.log("Showing item with condition:", conditionValue);
                }
            } else {
                console.warn("Condition element not found for item:", item);
            }
        });
    }

    function ensureButtonExists() {
        if (!document.getElementById('toggleLowQualityButton')) {
            console.log("Re-adding toggle button...");
            addToggleButton();
        }
    }

    function addToggleButton() {
        let container = document.querySelector('.q-table__top.relative-position.row.items-center');
        if (!container) {
            console.warn("Could not find table container. Button will not be placed correctly.");
            return;
        }

        let button = document.createElement('button');
        button.id = 'toggleLowQualityButton';
        button.innerText = 'Toggle Low-Quality Items';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.background = 'blue';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            hideLowQuality = !hideLowQuality;
            console.log("Toggle button clicked. New state:", hideLowQuality);
            filterOffers();
        });

        container.appendChild(button);
    }

    // Monitor page updates to re-add the button if removed
    const observer = new MutationObserver(() => ensureButtonExists());
    observer.observe(document.body, { childList: true, subtree: true });

    addToggleButton();
    await fetchOffers();
})();



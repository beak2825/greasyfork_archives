// ==UserScript==
// @name         Torn Item Market Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.16
// @description  Highlight items in the item market/bazaars that are at or below Arson Warehouse Pricelist and Market Value
// @author       You
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513617/Torn%20Item%20Market%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/513617/Torn%20Item%20Market%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
         /* Existing styles */
         .price-indicators-row {
             display: inline-flex;
             gap: 4px;
             margin-left: 4px;
             font-size: 10px;
             vertical-align: middle;
         }

         .price-indicator {
             padding: 1px 3px;
             border-radius: 3px;
             font-weight: bold;
             white-space: nowrap;
             display: inline-flex;
             align-items: center;
             justify-content: center;
             gap: 2px;
             min-width: 44px;
             max-width: fit-content;
             text-align: center;
         }

         .diff-90-100 {
             background: #004d00;
             color: white;
         }
         .diff-60-90 {
             background: #006700;
             color: white;
         }
         .diff-30-60 {
             background: #008100;
             color: white;
         }
         .diff-0-30 {
             background: #009b00;
             color: white;
         }
         .diff0-30 {
             background: #cc0000;
             color: white;
             width: fit-content;
             padding: 1px 4px;
         }
         .diff30-60 {
             background: #b30000;
             color: white;
             width: fit-content;
             padding: 1px 4px;
         }
         .diff60-90 {
             background: #990000;
             color: white;
             width: fit-content;
             padding: 1px 4px;
         }
         .diff90-plus {
             background: #800000;
             color: white;
             width: fit-content;
             padding: 1px 4px;
         }
         .diff-equal {
             background: #666666;
             color: white;
             width: fit-content;
             padding: 1px 4px;
         }

         .icon-exchange {
             display: inline-block;
             width: 12px;
             height: 12px;
             background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='white' d='M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z'/%3E%3C/svg%3E");
         }

         .icon-store {
             display: inline-block;
             width: 12px;
             height: 12px;
             background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 616 512'%3E%3Cpath fill='white' d='M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5.6 9.1.9 13.7.9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1.8-12.1 1.2-18.2 1.2z'/%3E%3C/svg%3E");
         }

         .icon-exchange, .icon-store {
             display: inline-block;
             width: 10px;
             height: 10px;
             background-size: contain;
             background-repeat: no-repeat;
             background-position: center;
             vertical-align: middle;
             margin-right: 2px;
         }

         /* Desktop layout improvements */
         @media (min-width: 785px) {
             .sellerRow___AI0m6 {
                 padding: 4px 4px !important;
                 display: flex !important;
                 align-items: center !important;
                 gap: 2px !important;
                 width: 100% !important;
             }

             .thumbnail___M_h9v {
                 flex-shrink: 0;
                 width: 40px !important;
                 margin-right: 4px !important;
             }

             .userInfoWrapper___B2a2P {
                 flex-shrink: 0;
                 min-width: 110px;
                 margin-right: 4px !important;
             }

             /* Stack indicators only in seller rows */
             .sellerRow___AI0m6 .price-indicators-row {
                 display: inline-flex !important;
                 flex-direction: column !important;
                 gap: 2px !important;
                 margin-left: 2px !important;
                 margin-right: 0 !important;
             }

             .price___Uwiv2 {
                 display: flex !important;
                 align-items: center !important;
                 flex-shrink: 0;
                 min-width: 85px;
                 margin-right: 0 !important;
             }

             .available___xegv_ {
                 flex-shrink: 0;
                 min-width: 55px;
                 text-align: right;
                 margin-right: 2px !important;
             }

             .buyControlsInRow___GVAKp {
                 flex-shrink: 0;
             }

             .buyControls___MxiIN {
                 display: flex !important;
                 align-items: center !important;
                 gap: 2px !important;
             }

             .amountInputWrapper___a4BMt {
                 min-width: 55px !important;
                 width: 55px !important;
                 flex-shrink: 0;
             }

             .input-money {
                 min-width: 45px !important;
                 width: 100% !important;
                 padding: 0 2px !important;
             }

             .buyButton___Flkhg {
                 flex-shrink: 0;
                 min-width: 65px;
                 padding-left: 8px !important;
                 padding-right: 8px !important;
             }

             .price-indicator {
                 padding: 1px 4px !important;
                 min-width: 0 !important;
             }

             .space___qCLQp {
                 display: none !important;
             }
         }

         /* Mobile-specific styles */
         @media (max-width: 784px) {
             .sellerRow___Ca2pK {
                 display: grid !important;
                 grid-template-columns: minmax(80px, 1fr) auto auto auto !important;
                 align-items: center !important;
                 gap: 8px !important;
                 padding: 8px 12px !important;
             }

             .sellerRow___Ca2pK:first-child {
                 font-weight: bold;
                 background-color: rgba(0, 0, 0, 0.1);
             }

             .userInfoWrapper___B2a2P {
                 min-width: 80px;
                 max-width: 120px;
             }

             .price___v8rRx {
                 position: relative;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 gap: 2px;
                 min-width: 85px;
             }

             .price-indicators-row {
                 position: static !important;
                 display: flex !important;
                 flex-direction: column !important;
                 gap: 2px !important;
                 margin-top: 2px !important;
                 font-size: 9px !important;
                 align-items: center !important;
             }

             .price-indicator {
                 padding: 1px 4px !important;
                 white-space: nowrap !important;
                 text-align: center !important;
                 justify-content: center !important;
                 width: fit-content !important;
                 min-width: 0 !important;
                 margin: 0 auto !important;
                 display: inline-flex !important;
                 align-items: center !important;
             }

             .available___jtANf {
                 text-align: center;
                 min-width: 30px;
             }

             .showBuyControlsButton___K8f72 {
                 padding: 6px !important;
                 display: flex !important;
                 align-items: center !important;
                 justify-content: center !important;
             }

             .userInfoHead___LXxjB,
             .priceHead___Yo8ku,
             .availableHead___BkcpB,
             .showBuyControlsHead___SczEn {
                 text-align: center !important;
             }

             .icon-exchange,
             .icon-store {
                 width: 8px !important;
                 height: 8px !important;
                 margin: 0 2px 0 0 !important;
                 display: inline-flex !important;
                 align-items: center !important;
                 justify-content: center !important;
             }
         }

/* Styles for the floating container */
#floating-container {
    position: fixed;
    top: 100px;
    left: -200px; /* Adjust this value to the negative width of the container */
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    color: white;
    transition: left 0.3s ease;
}

#floating-container.expanded {
    left: 0;
}

#floating-container button {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    background-color: #333;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
}

#floating-container button:hover {
    background-color: #555;
}

/* Styles for the toggle button */
#toggle-button {
    position: fixed;
    top: 100px;
    left: 0;
    background-color: rgba(0,0,0,0.7);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    width: 25px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    z-index: 1001;
}

.toast {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0,0,0,0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999; /* Ensure it's above other elements */
    opacity: 0;
    transition: opacity 0.5s ease;
}

.toast.show {
    opacity: 1;
}

    `);

    let item_prices = {};
    let torn_market_values = {};

    try {
        item_prices = JSON.parse(GM_getValue("AWH_Prices", "{}"));
        torn_market_values = JSON.parse(GM_getValue("Torn_Market_Values", "{}"));
    } catch (e) {}

    function getTornIDFromPage() {
        const tornUserInput = document.getElementById('torn-user');
        if (tornUserInput) {
            try {
                const userData = JSON.parse(tornUserInput.value);
                return userData.id;
            } catch (e) {
                console.error('Error parsing torn-user data:', e);
                return null;
            }
        }
        return null;
    }

function createFloatingContainer() {
    const container = document.createElement('div');
    container.id = 'floating-container';
    // Start collapsed by default (left position is negative in CSS)

    const toggleButton = document.createElement('div');
    toggleButton.id = 'toggle-button';
    toggleButton.innerHTML = '&#9776;'; // Hamburger icon

    toggleButton.addEventListener('click', () => {
        if (container.classList.contains('expanded')) {
            container.classList.remove('expanded');
        } else {
            container.classList.add('expanded');
        }
    });

    const buttonsWrapper = document.createElement('div');

    const addAWHButton = document.createElement('button');
    addAWHButton.textContent = GM_getValue("AWH_Key", "") ? 'Edit AWH API key' : 'Add AWH API key';
    addAWHButton.addEventListener('click', () => {
        let AWH_Key = GM_getValue("AWH_Key", "");
        AWH_Key = prompt("Enter your AWH API key", AWH_Key);
        if (AWH_Key !== null) {  // Only proceed if user didn't press Cancel
            if (AWH_Key.trim() === "") {
                // If field was cleared, remove the key and clear AWH prices
                GM_setValue("AWH_Key", "");
                GM_setValue("AWH_Prices", "{}");
                item_prices = {};  // Clear the current prices in memory
                showToast("AWH API key and prices removed successfully!", 'success');
                addAWHButton.textContent = 'Add AWH API key';
            } else {
                // If new key provided, save it
                GM_setValue("AWH_Key", AWH_Key);
                showToast("AWH API key saved successfully!", 'success');
                addAWHButton.textContent = 'Edit AWH API key';
                checkAndUpdatePrices();
            }
            updateButtonsVisibility();
            processElements();  // Refresh the display
        }
    });

    const addTornButton = document.createElement('button');
    addTornButton.textContent = GM_getValue("Torn_API_Key", "") ? 'Edit Torn API key' : 'Add Torn API key';
    addTornButton.addEventListener('click', () => {
        let tornApiKey = GM_getValue("Torn_API_Key", "");
        tornApiKey = prompt("Enter your Torn API key", tornApiKey);
        if (tornApiKey !== null) {  // Only proceed if user didn't press Cancel
            if (tornApiKey.trim() === "") {
                // If field was cleared, remove the key and clear market values
                GM_setValue("Torn_API_Key", "");
                GM_setValue("Torn_Market_Values", "{}");
                torn_market_values = {};  // Clear the current values in memory
                showToast("Torn API key and market values removed successfully!", 'success');
                addTornButton.textContent = 'Add Torn API key';
            } else {
                // If new key provided, save it
                GM_setValue("Torn_API_Key", tornApiKey);
                showToast("Torn API key saved successfully!", 'success');
                addTornButton.textContent = 'Edit Torn API key';
                getTornMarketValues();
            }
            updateButtonsVisibility();
            processElements();  // Refresh the display
        }
    });


    const getAWHPricesButton = document.createElement('button');
    getAWHPricesButton.textContent = 'Get AWH Prices Now';
    getAWHPricesButton.addEventListener('click', getAWHPrices);

    const getMarketValuesButton = document.createElement('button');
    getMarketValuesButton.textContent = 'Get Market Values Now';
    getMarketValuesButton.addEventListener('click', getTornMarketValues);

    buttonsWrapper.appendChild(addAWHButton);
    buttonsWrapper.appendChild(addTornButton);
    buttonsWrapper.appendChild(getAWHPricesButton);
    buttonsWrapper.appendChild(getMarketValuesButton);

    container.appendChild(buttonsWrapper);

    document.body.appendChild(container);
    document.body.appendChild(toggleButton);

    // Function to update button visibility based on API keys
    function updateButtonsVisibility() {
        const AWH_Key = GM_getValue("AWH_Key", "");
        const tornApiKey = GM_getValue("Torn_API_Key", "");

        addAWHButton.textContent = AWH_Key ? 'Edit AWH API key' : 'Add AWH API key';
        addTornButton.textContent = tornApiKey ? 'Edit Torn API key' : 'Add Torn API key';

        if (!AWH_Key) {
            getAWHPricesButton.style.display = 'none';
            // Ensure AWH prices are cleared if key is removed
            if (Object.keys(item_prices).length > 0) {
                item_prices = {};
                GM_setValue("AWH_Prices", "{}");
            }
        } else {
            getAWHPricesButton.style.display = '';
        }

        if (!tornApiKey) {
            getMarketValuesButton.style.display = 'none';
            // Ensure market values are cleared if key is removed
            if (Object.keys(torn_market_values).length > 0) {
                torn_market_values = {};
                GM_setValue("Torn_Market_Values", "{}");
            }
        } else {
            getMarketValuesButton.style.display = '';
        }
    }


    updateButtonsVisibility(); // Set initial visibility
}



function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'success') {
        toast.style.backgroundColor = 'green';
    } else if (type === 'error') {
        toast.style.backgroundColor = 'red';
    } else {
        toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000); // Show for 3 seconds
}


    function checkAndUpdatePrices() {
        const stored_torn_id = GM_getValue("AWH_TornID", "");
        const page_torn_id = getTornIDFromPage();
        const AWH_Key = GM_getValue("AWH_Key", "");

        // Update stored Torn ID if we found one on the page
        if (page_torn_id && page_torn_id !== stored_torn_id) {
            GM_setValue("AWH_TornID", page_torn_id);
        }

        // Use page Torn ID if available, fall back to stored ID
        const torn_id = page_torn_id || stored_torn_id;

        if (AWH_Key) {
            getAWHPrices();
        }
    }

    function scheduleNextUpdate() {
        const now = new Date();
        const target = new Date(now);
        target.setUTCHours(20, 15, 0, 0); // 8:15 PM UTC

        if (now > target) {
            target.setDate(target.getDate() + 1);
        }

        const msUntilUpdate = target - now;
        setTimeout(() => {
            getAWHPrices();
            getTornMarketValues();
            scheduleNextUpdate();
        }, msUntilUpdate);
    }

function getTornMarketValues() {
    const tornApiKey = GM_getValue("Torn_API_Key", "");

    if (!tornApiKey) {
        // Torn API key not set, skipping
        return;
    }

    GM.xmlHttpRequest({
        method: "GET",
        url: `https://api.torn.com/torn/?key=${tornApiKey}&selections=items`,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                if (data.items) {
                    Object.entries(data.items).forEach(([itemId, item]) => {
                        torn_market_values[itemId] = item.market_value || 0;
                    });
                    GM_setValue("Torn_Market_Values", JSON.stringify(torn_market_values));
                    GM_setValue("lastMarketUpdate", Date.now());
                    showToast('Market values updated successfully!', 'success');
                    processElements();
                } else {
                    showToast('No market value data received. Please check your API key.', 'error');
                }
            } catch (e) {
                showToast('Error updating market values. Please check your API key.', 'error');
            }
        },
        onerror: function() {
            showToast('Failed to connect to Torn API. Please try again later.', 'error');
        }
    });
}


function getAWHPrices() {
    const AWH_Key = GM_getValue("AWH_Key", "");
    const torn_id = getTornIDFromPage() || GM_getValue("AWH_TornID", "");

    if (!AWH_Key) {
        // AWH API key not set, skipping
        return;
    }

    item_prices = {};
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://arsonwarehouse.com/api/v1/bids/${torn_id}`,
        headers: {
            "Authorization": "Basic " + btoa(AWH_Key + ':')
        },
        onload: function(response) {
            try {
                const items = JSON.parse(response.responseText);
                if (items.bids?.length > 0) {
                    items.bids.forEach(bid => {
                        if (bid.item_id && bid.bids?.length > 0) {
                            item_prices[bid.item_id] = bid.bids[0].price || 0;
                        }
                    });
                    GM_setValue("AWH_Prices", JSON.stringify(item_prices));
                    GM_setValue("lastUpdate", Date.now());
                    showToast('Prices updated successfully!', 'success');
                    processElements();
                } else {
                    showToast('No price data received. Please check your credentials.', 'error');
                }
            } catch (e) {
                showToast('Error updating prices. Please check your credentials.', 'error');
            }
        },
        onerror: function() {
            showToast('Failed to connect to AWH. Please try again later.', 'error');
        }
    });
}


    function addPriceIndicator(itemId, itemPrice, container) {
        // Remove any existing indicators row
        const existingRow = container.nextElementSibling;
        if (existingRow?.classList.contains('price-indicators-row')) {
            existingRow.remove();
        }

        // Create new indicators row
        const indicatorsRow = document.createElement('div');
        indicatorsRow.classList.add('price-indicators-row');

        // Get quantity if we're in a seller row
        let quantity = 1;
        if (container.closest('.sellerRow___AI0m6')) {
            const quantityElement = container.closest('.sellerRow___AI0m6').querySelector('.available___xegv_');
            if (quantityElement) {
                // Extract number from "X available" text
                const match = quantityElement.textContent.match(/(\d+)\s+available/);
                quantity = match ? parseInt(match[1]) : 1;
            }
        }

        // AWH Price comparison (using exchange icon)
        if (item_prices[itemId]) {
            const awhPrice = item_prices[itemId];
            const awhPriceDiff = Math.round(((awhPrice - itemPrice) / awhPrice) * 100 * 100) / 100;
            const potentialProfit = (awhPrice - itemPrice) * quantity;

            const awhIndicator = document.createElement('span');
            awhIndicator.classList.add('price-indicator');
            awhIndicator.title = `Potential profit: $${potentialProfit.toLocaleString()}` +
                                (quantity > 1 ? ` (${quantity}x)` : '');
            const icon = document.createElement('span');
            icon.classList.add('icon-exchange');
            awhIndicator.appendChild(icon);
            awhIndicator.appendChild(document.createTextNode(
                ` ${awhPriceDiff > 0 ? '-' : '+'}${Math.abs(Math.round(awhPriceDiff))}%`
            ));

            if (Math.abs(awhPriceDiff) < 0.5) {
                awhIndicator.classList.add('diff-equal');
            } else if (awhPriceDiff > 0) {
                if (awhPriceDiff >= 90) awhIndicator.classList.add('diff-90-100');
                else if (awhPriceDiff >= 60) awhIndicator.classList.add('diff-60-90');
                else if (awhPriceDiff >= 30) awhIndicator.classList.add('diff-30-60');
                else awhIndicator.classList.add('diff-0-30');
            } else {
                if (awhPriceDiff <= -90) awhIndicator.classList.add('diff90-plus');
                else if (awhPriceDiff <= -60) awhIndicator.classList.add('diff60-90');
                else if (awhPriceDiff <= -30) awhIndicator.classList.add('diff30-60');
                else awhIndicator.classList.add('diff0-30');
            }

            indicatorsRow.appendChild(awhIndicator);
        }

        // Market Value comparison (using store icon)
        if (torn_market_values[itemId]) {
            const marketValue = torn_market_values[itemId];
            const marketPriceDiff = Math.round(((marketValue - itemPrice) / marketValue) * 100 * 100) / 100;
            const potentialProfit = (marketValue - itemPrice) * quantity;

            const marketIndicator = document.createElement('span');
            marketIndicator.classList.add('price-indicator');
            marketIndicator.title = `Potential profit: $${potentialProfit.toLocaleString()}` +
                                   (quantity > 1 ? ` (${quantity}x)` : '');
            const icon = document.createElement('span');
            icon.classList.add('icon-store');
            marketIndicator.appendChild(icon);
            marketIndicator.appendChild(document.createTextNode(
                ` ${marketPriceDiff > 0 ? '-' : '+'}${Math.abs(Math.round(marketPriceDiff))}%`
            ));

            if (Math.abs(marketPriceDiff) < 0.5) {
                marketIndicator.classList.add('diff-equal');
            } else if (marketPriceDiff > 0) {
                if (marketPriceDiff >= 90) marketIndicator.classList.add('diff-90-100');
                else if (marketPriceDiff >= 60) marketIndicator.classList.add('diff-60-90');
                else if (marketPriceDiff >= 30) marketIndicator.classList.add('diff-30-60');
                else marketIndicator.classList.add('diff-0-30');
            } else {
                if (marketPriceDiff <= -90) marketIndicator.classList.add('diff90-plus');
                else if (marketPriceDiff <= -60) marketIndicator.classList.add('diff60-90');
                else if (marketPriceDiff <= -30) marketIndicator.classList.add('diff30-60');
                else marketIndicator.classList.add('diff0-30');
            }

            indicatorsRow.appendChild(marketIndicator);
        }

        // Only add the row if we have at least one indicator
        if (indicatorsRow.children.length > 0) {
            container.after(indicatorsRow);
        }
    }

    function updateSingleElement(element) {
        let itemId, priceElement;

        // Check if we're in mobile view
        const isMobileView = window.innerWidth < 785;

        if (isMobileView) {
            // Find item ID from info button's aria-controls
            const infoButton = document.querySelector('button[aria-controls^="wai-itemInfo-"]');
            if (infoButton) {
                const ariaControls = infoButton.getAttribute('aria-controls');
                const match = ariaControls.match(/wai-itemInfo-(\d+)/);
                if (match) itemId = match[1];
            }

            if (element.classList.contains('price___v8rRx')) {
                priceElement = element;
            }
        } else {
            let container = element;
            while (container && !itemId) {
                const img = container.querySelector('img[src*="/images/items/"]');
                if (img) {
                    const idMatch = img.src.match(/\/images\/items\/(\d+)\//);
                    if (idMatch) itemId = idMatch[1];
                }
                container = container.parentElement;
            }

            if (element.classList.contains('priceAndTotal___eEVS7') ||
                element.classList.contains('price___Uwiv2') ||
                element.className.includes('price_')) {
                priceElement = element;
            }
        }

        if (!itemId || !priceElement) return;

        const priceMatch = priceElement.textContent.match(/\$([0-9,]+)/);
        if (priceMatch) {
            const itemPrice = parseInt(priceMatch[1].replace(/,/g, ''));
            addPriceIndicator(itemId, itemPrice, priceElement);
        }
    }

    function processElements() {
        const isMobileView = window.innerWidth < 785;

        if (document.URL.includes('sid=ItemMarket')) {
            // Item tiles - keep original handling for both mobile and desktop
            document.querySelectorAll('.itemTile___cbw7w').forEach(tile => {
                const img = tile.querySelector('img.torn-item');
                if (!img) return;

                const idMatch = img.src.match(/\/images\/items\/(\d+)\//);
                if (!idMatch) return;

                const itemId = idMatch[1];
                const priceElement = tile.querySelector('.priceAndTotal___eEVS7');

                if (priceElement) {
                    const priceMatch = priceElement.textContent.match(/\$([0-9,]+)/);
                    if (priceMatch) {
                        const itemPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                        addPriceIndicator(itemId, itemPrice, priceElement);
                    }
                }
            });

            // Seller rows - handle differently for mobile vs desktop
            if (isMobileView) {
                const infoButton = document.querySelector('button[aria-controls^="wai-itemInfo-"]');
                if (infoButton) {
                    const ariaControls = infoButton.getAttribute('aria-controls');
                    const match = ariaControls.match(/wai-itemInfo-(\d+)/);
                    if (match) {
                        const itemId = match[1];
                        document.querySelectorAll('.sellerRow___Ca2pK').forEach(row => {
                            const priceElement = row.querySelector('.price___v8rRx');
                            if (priceElement) {
                                const priceMatch = priceElement.textContent.match(/\$([0-9,]+)/);
                                if (priceMatch) {
                                    const itemPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                                    addPriceIndicator(itemId, itemPrice, priceElement);
                                    // Restructure mobile layout
                                    if (!row.querySelector('.userInfoHead___LXxjB')) {  // Skip header row
                                        const indicatorsRow = row.querySelector('.price-indicators-row');
                                        if (indicatorsRow) {
                                            priceElement.appendChild(indicatorsRow);
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            } else {
                document.querySelectorAll('.sellerRow___AI0m6').forEach(row => {
                    const img = row.querySelector('.thumbnail___M_h9v img');
                    if (!img) return;

                    const idMatch = img.src.match(/\/images\/items\/(\d+)\//);
                    if (!idMatch) return;

                    const itemId = idMatch[1];
                    const priceElement = row.querySelector('.price___Uwiv2');

                    if (priceElement) {
                        const priceText = priceElement.textContent;
                        const priceMatch = priceText.match(/\$([0-9,]+)/);
                        if (priceMatch) {
                            const itemPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                            addPriceIndicator(itemId, itemPrice, priceElement);
                        }
                    }
                });
            }
        }
        else if (document.URL.includes('bazaar.php')) {
            document.querySelectorAll('img[src*="/images/items/"][src*="/large.png"]').forEach(img => {
                if (!img.parentElement?.parentElement?.parentElement) return;

                const idMatch = img.src.match(/\/images\/items\/(\d+)\//);
                if (!idMatch) return;

                const itemId = idMatch[1];
                const container = img.parentElement.parentElement.parentElement;
                const priceElement = container.querySelector('[class*="price_"]');

                if (priceElement) {
                    const priceMatch = priceElement.textContent.match(/\$([0-9,]+)/);
                    if (priceMatch) {
                        const itemPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                        addPriceIndicator(itemId, itemPrice, priceElement);
                    }
                }
            });
        }
    }

    function initialize() {
        const lastUpdate = GM_getValue("lastUpdate", 0);
        const lastMarketUpdate = GM_getValue("lastMarketUpdate", 0);
        const now = Date.now();

        if (now - lastUpdate > 24 * 60 * 60 * 1000) {
            getAWHPrices();
        }

        if (now - lastMarketUpdate > 24 * 60 * 60 * 1000) {
            getTornMarketValues();
        }

        try {
            torn_market_values = JSON.parse(GM_getValue("Torn_Market_Values", "{}"));
        } catch (e) {}

        scheduleNextUpdate();

        setTimeout(() => {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: true,
                attributeFilter: ['class']
            });
            processElements();
        }, 1000);

        createFloatingContainer();
    }

    const observer = new MutationObserver(mutations => {
        let affected = new Set();

        for (const mutation of mutations) {
            if (mutation.type === 'characterData') {
                let parentElement = mutation.target.parentElement;
                while (parentElement) {
                    if (parentElement.classList) {
                        if (parentElement.classList.contains('priceAndTotal___eEVS7') ||
                            parentElement.classList.contains('price___Uwiv2') ||
                            [...parentElement.classList].some(c => c.includes('price_'))) {
                            affected.add(parentElement);
                            break;
                        }
                    }
                    parentElement = parentElement.parentElement;
                }
            }
            else if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('itemTile___cbw7w') ||
                            node.classList?.contains('sellerRow___AI0m6') ||
                            node.querySelector?.('.itemTile___cbw7w, .sellerRow___AI0m6, [class*="price_"]')) {
                            processElements();
                            return;
                        }
                    }
                }
            }
        }

        affected.forEach(element => updateSingleElement(element));
    });

    // Start the script
    initialize();

})();

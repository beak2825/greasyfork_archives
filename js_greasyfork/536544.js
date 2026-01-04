// ==UserScript==
// @name        Torn Trade Pay Value
// @namespace   https://vaaaz.dev
// @version     1.20 (Initial Delay Added)
// @description Show the total value of items received in a Torn trade, using clean, consolidated formatting. Now with click-to-copy functionality and a 2-second startup delay.
// @author      Me
// @match       https://www.torn.com/trade.php*
// @grant       GM_xmlhttpRequest
// @connect     vaaaz.dev
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/536544/Torn%20Trade%20Pay%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/536544/Torn%20Trade%20Pay%20Value.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PRICE_URL = 'https://vaaaz.dev/scripts/prices.json';
    let prices = {};
    let isPricesLoaded = false;

    // Item Name to Item ID mapping
    const nameToId = {
        "Teddy Bear Plushie": 187, "Kitten Plushie": 215, "Sheep Plushie": 186,
        "Chamois Plushie": 273, "Wolverine Plushie": 261, "Stingray Plushie": 618,
        "Jaguar Plushie": 258, "Red Fox Plushie": 268, "Nessie Plushie": 266,
        "Monkey Plushie": 269, "Panda Plushie": 274, "Lion Plushie": 281,
        "Camel Plushie": 384, "Dahlia": 260, "Edelweiss": 272,
        "White Lily": 903, "Crocus": 263, "Banana Orchid": 617,
        "Orchid": 264, "Ceibo Flower": 271, "Heather": 267,
        "Cherry Blossom": 277, "Peony": 276, "African Violet": 282,
        "Tribulus Omanense": 385, "Xanax": 206
    };

    // Static prices for specific items (These override fetched prices)
    const fixedPrices = {
        206: 790000 // Xanax
    };

    // --- UI Setup ---
    const box = document.createElement('div');
    Object.assign(box.style, {
        position: 'fixed',
        top: '85px',
        right: '15px',
        width: 'auto',
        minWidth: '200px',
        backgroundColor: 'rgba(22, 22, 22, 0.98)',
        color: '#f5f5f5',
        padding: '7px 10px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
        fontFamily: 'Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.2',
        zIndex: 9999,
        userSelect: 'text',
        overflow: 'hidden',
        border: '1px solid #3a3a3a',
        transition: 'opacity 0.3s ease',
    });
    box.textContent = 'Loading prices...';
    document.body.appendChild(box);

    function setBoxError(message, details) {
        console.error(`❌ Torn Trade Pay Value Error: ${message}`, details);
        box.innerHTML = `
            <div style="color: #FF6B6B; font-weight: bold;">
                ❌ Error: ${message}
            </div>
            <div style="color: #B0B0B0; font-size: 0.8em; margin-top: 5px;">
                Price data unavailable. Check console (F12).
            </div>
        `;
    }

    // Custom function to safely copy text to clipboard
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            document.execCommand('copy');
            // Flash feedback to the user
            box.style.opacity = '0.4';
            setTimeout(() => { box.style.opacity = '1'; }, 100);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        } finally {
            document.body.removeChild(tempInput);
        }
    }

    // --- Core Logic Functions (Defined first to avoid ReferenceErrors) ---

    function getItemsFromList(ulEl) {
        const items = [];
        if (!ulEl) return items;

        const itemElements = ulEl.querySelectorAll('.color2 .name.left');

        itemElements.forEach(el => {
            const raw = el.textContent.trim();
            const match = raw.match(/^(.+?) x(\d+)/);
            if (!match) return;

            const name = match[1].trim();
            const qty = parseInt(match[2], 10);
            const id = nameToId[name];

            if (!id) return;

            let price = fixedPrices[id];

            if (!price) {
                price = prices[id];
            }

            if (price) {
                price = Number(price);
                items.push({ name, qty, price, total: price * qty });
            }
        });

        return items;
    }

    function updateBox() {
        if (!isPricesLoaded) {
             return;
        }

        try {
            const ulLists = document.querySelectorAll('.trade-cont ul.cont');

            // ulLists[1] is the Other user's side (what you receive)
            if (ulLists.length < 2) {
                box.textContent = 'Trade data not found.';
                return;
            }

            const receivingList = ulLists[1];
            const otherItems = getItemsFromList(receivingList);
            const finalTotal = otherItems.reduce((acc, i) => acc + i.total, 0);

            // Use raw total for copying, formatted total for display
            const rawTotal = finalTotal.toString();
            const formattedTotal = finalTotal.toLocaleString('en-US');

            // --- HTML Breakdown (for items YOU RECEIVE) ---
            let breakdownHtml = otherItems.map(i => {
                const itemValue = i.total.toLocaleString('en-US');
                const singlePrice = i.price.toLocaleString('en-US');
                return `
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                        <span style="white-space: nowrap; color: #b0b0b0; font-size: 0.85em; flex-shrink: 0; font-weight: bold;">
                            ${i.name} <span style="color:#999;">x${i.qty}</span>
                        </span>
                        <span style="flex-grow: 1; min-width: 15px; border-bottom: 1px dotted #333; margin: 0 5px;"></span>
                        <span style="white-space: nowrap; text-align: right; color: #4CAF50; font-family: 'Roboto Mono', monospace; font-weight: bold; font-size: 0.95em;">
                            ${itemValue} $
                        </span>
                    </div>
                    <div style="text-align: right; color: #777; font-size: 0.85em; margin-bottom: 4px;">
                        (Price per item: ${singlePrice} $)
                    </div>
                `;
            }).join('');

            box.innerHTML = `
                <div style="padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid #333;">
                    <div style="color: #f5f5f5; font-weight: bold; font-size: 1.1em; text-transform: uppercase; margin-bottom: 5px;">Total Item Value:</div>

                    <button id="totalValueButton" class="totalValueButton" aria-label="Click to copy total value" data-raw-value="${rawTotal}" style="
                        background: none;
                        border: none;
                        padding: 0;
                        margin: 0;
                        color: #FFD700;
                        font-size: 1.6em;
                        font-weight: bold;
                        letter-spacing: 0.5px;
                        white-space: nowrap;
                        font-family: 'Roboto Mono', monospace;
                        cursor: pointer;
                        text-align: left;
                    ">${formattedTotal} $</button>
                </div>

                ${otherItems.length > 0 ? `<div style="display: flex; flex-direction: column; gap: 2px;">${breakdownHtml}</div>` : '<div style="color: #b0b0b0; font-size: 0.9em;">No tracked items incoming.</div>'}
            `;

            // Attach event listener after element is created
            const totalButton = document.getElementById('totalValueButton');
            if (totalButton) {
                totalButton.addEventListener('click', () => {
                    const rawValue = totalButton.getAttribute('data-raw-value');
                    if (rawValue) {
                        copyToClipboard(rawValue);
                    }
                });
            }

        } catch (e) {
            setBoxError("Runtime error during calculation", e);
        }
    }

    // --- DOM Observer ---
    function initObserver() {
        const tradeContainer = document.getElementById('trade-container');
        if (!tradeContainer) {
            box.textContent = 'Trade container not found. This script requires the element with ID "trade-container" to exist.';
            return;
        }

        const observer = new MutationObserver(() => {
            // Debounce to ensure the page has settled after rapid DOM changes (like adding multiple items)
            clearTimeout(window._tradeValueUpdateTimer);
            window._tradeValueUpdateTimer = setTimeout(() => {
                updateBox();
            }, 500);
        });

        observer.observe(tradeContainer, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // Initial check runs via the observer's callback, after the 2000ms delay.
        updateBox();
    }

    // --- Price Fetching ---
    function fetchPrices() {
        if (typeof GM_xmlhttpRequest === 'undefined') {
            // Set error and stop execution if Greasemonkey function is missing
            return setBoxError("GM_xmlhttpRequest is not available. Please ensure the script manager is running.", null);
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: PRICE_URL,
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const json = JSON.parse(response.responseText);
                        prices = json.prices || {};
                        isPricesLoaded = true;

                        // SUCCESS: Wait 2 seconds before starting observation and initial check
                        box.textContent = 'Prices loaded successfully. Waiting 2 seconds for trade data to settle...';
                        setTimeout(initObserver, 2000);

                    } catch (err) {
                        isPricesLoaded = false;
                        setBoxError('Error parsing price data. Cannot continue.', err);
                    }
                } else {
                    isPricesLoaded = false;
                    setBoxError(`Failed to load prices (Status: ${response.status}). Cannot continue.`, response);
                }
            },
            onerror: function (err) {
                isPricesLoaded = false;
                setBoxError('Error loading price data (Network failure). Cannot continue.', err);
            }
        });
    }

    // Start execution
    fetchPrices();

})();
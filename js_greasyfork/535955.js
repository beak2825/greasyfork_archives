// ==UserScript==
// @name         Stock Management
// @namespace    http://www.factory51.co.uk
// @version      1.0.4
// @description  A helper script to calculate how many of a certain stock to buy/sell based on a cash money value
// @author       irdeadtoy [3205343]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/535955/Stock%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/535955/Stock%20Management.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const api_key = "INSERT_HERE_YOUR_LIMITED_API_KEY"; // to lazy to remove need for API - LIMIT KEY HERE for 'future' use
    const stock_url = `https://api.torn.com/torn/?selections=stocks&key=${api_key}`;
    let stock_data = null;
    let owned_stock = null;
    let balance = 0;

    const fetchStocks = () => { //get the stocks from torn API
        return fetch(stock_url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                return response.json();
            })
            .then(data => data.stocks);
    };

    const waitForStockMarket = () => { // waits for torns fk awful application to load some 1999 XHTML wannabe table structure
        return new Promise(resolve => {
            const existing = document.querySelector('[class^="stockMarket___"]');
            if (existing) return resolve(existing);
            const observer = new MutationObserver((_, obs) => {
                const element = document.querySelector('[class^="stockMarket___"]');
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    Promise.all([fetchStocks(), waitForStockMarket()]) // forces script to wait for stocks from and the page to be showing stocks
        .then(([stocks]) => {
            stock_data = stocks;
            run(); // Tell the gamblin' ramblin' backslider
        })
        .catch(error => console.error("Error during pre-loading promise:", error));

    function run() { // Tell them God Almighty gonna cut 'em down
        balance = getBalance(); //rip balance from page [TODO]
        owned_stock = getOwnedStock(); //rip what stocks you own from page [TODO]
        monitorStockClicks(); // list for clicks on the buy / sell part of a stock element
    }

    function getBalance() { // B A L A N C E Balance ya overgrown peacock
        const balanceEl = document.querySelector('#user-money');
        const moneyAttr = balanceEl?.getAttribute('data-money');
        return moneyAttr ? parseInt(moneyAttr, 10) : 0;
    }

    function getOwnedStock() { // to dull
        const stockElements = document.querySelectorAll('ul[class^="stock___"]');
        const stocks = [];

        stockElements.forEach(ul => {
            const stockId = ul.id;
            const name = ul.querySelector('li[data-name="nameTab"] .nameContainer___bxIrG')?.textContent.trim();
            const priceRaw = ul.querySelector('li[data-name="priceTab"]')?.getAttribute('aria-label');
            const price = priceRaw ? parseFloat(priceRaw.match(/\$([\d.,]+)/)?.[1].replace(/,/g, '')) : null;
            const sharesRaw = ul.querySelector('li[data-name="ownedTab"] p:nth-of-type(2)')?.textContent;
            const shares = sharesRaw ? parseInt(sharesRaw.replace(/,/g, '')) : 0;

            if (shares > 0 && name && stockId) {
                stocks.push({ stockId, name, price, shares });
            }
        });

        return stocks;
    }

    function monitorStockClicks() { // only listens for clicks on the buy/sell li when its open - yea an li not a td or a div. 1999 ffs
        document.addEventListener('click', (event) => {
            const li = event.target.closest('li#ownedTab');
            if (!li) return;

            const ul = li.closest('ul[class^="stock___"]');
            if (ul && ul.id) {
                setTimeout(() => {
                    const panel = document.querySelector("#panel-ownedTab");
                    if (panel) showCalculators(panel);
                }, 150);
            }
        });
    }

    function setNativeValue(element, value) { // used to force whatever monstrous React code is running the page to notice we've changed the value of the input field
        const lastValue = element.value;
        element.value = value;

        const tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // =========================
    // NEW: thousands formatting
    // =========================
    function formatThousandsInput(el) {
        if (!el) return;

        const raw = el.value ?? "";
        const caret = el.selectionStart ?? raw.length;

        // Remember how many digits were to the left of the caret
        const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

        // Keep digits only
        const digits = raw.replace(/\D/g, "");
        if (!digits) {
            el.value = "";
            return;
        }

        // Format with thousands separators (1,234,567)
        const formatted = BigInt(digits).toLocaleString("en-US");
        el.value = formatted;

        // Restore caret position based on digitsBeforeCaret
        let pos = 0, d = 0;
        while (pos < formatted.length && d < digitsBeforeCaret) {
            if (/\d/.test(formatted[pos])) d++;
            pos++;
        }
        el.setSelectionRange(pos, pos);
    }

    function attachThousandsFormatter(input) {
        if (!input || input.dataset.thousandsFormatter) return;

        input.dataset.thousandsFormatter = "1";
        input.setAttribute("inputmode", "numeric");
        input.addEventListener("input", () => formatThousandsInput(input));
        input.addEventListener("blur", () => formatThousandsInput(input));
    }
    // =========================

    function showCalculators(panel) { //draw our controls in the right place
        const buyBlock = panel.querySelector('.buyBlock___bIlBS .actions___PIYmF');
        const sellBlock = panel.querySelector('.sellBlock___A_yTW .actions___PIYmF');

        if (buyBlock && !panel.querySelector('#purchase_total')) {
            const buyCalc = document.createElement('div');
            buyCalc.className = 'actions___PIYmF withInput___ZVcue'; //this could be a problem later...
            buyCalc.style.marginTop = '10px';

            buyCalc.innerHTML = `
                <br>
                <div class="input-money-group success">
                    <span class="input-money-symbol">$</span><input type="text" id="purchase_total" class="input-money" placeholder="Invest $" autocomplete="off"></div>
                <div style="margin-left: 10px"><button type="button" class="torn-btn gray" id="calc_buy" style="margin-top: 4px;">Calc</button></div>
            `;
            buyBlock.parentElement.appendChild(buyCalc);
        }

        if (sellBlock && !panel.querySelector('#selling_total')) {
            const sellCalc = document.createElement('div');
            sellCalc.className = 'actions___PIYmF withInput___ZVcue'; //this could be a problem later...
            sellCalc.style.marginTop = '10px';

            sellCalc.innerHTML = `
                <br>
                <div class="input-money-group success">
                    <span class="input-money-symbol">$</span><input type="text" id="selling_total" class="input-money" placeholder="Cash Out $" autocomplete="off"></div>
                <div style="margin-left: 10px"><button type="button" class="torn-btn gray" id="calc_sell" style="margin-top: 4px;">Calc</button></div>
            `;
            sellBlock.parentElement.appendChild(sellCalc);
        }

        setTimeout(() => { //timeout to make sure everythings loaded
            // NEW: attach thousands formatter to our custom inputs
            attachThousandsFormatter(panel.querySelector('#purchase_total'));
            attachThousandsFormatter(panel.querySelector('#selling_total'));

            const buyBtn = panel.querySelector('#calc_buy');
            const sellBtn = panel.querySelector('#calc_sell');

            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    const inputVal = parseFloat(panel.querySelector('#purchase_total')?.value.replace(/[^\d.]/g, ''));
                    const priceElements = panel.querySelectorAll('li[class^="current___"]');
                    let stockPriceText = null;

                    priceElements.forEach(el => {
                        const text = el.textContent.trim();
                        if (text.startsWith('$')) stockPriceText = text;
                    });

                    const stockPrice = stockPriceText ? parseFloat(stockPriceText.replace(/[^\d.]/g, '')) : 0;
                    if (!isNaN(inputVal) && stockPrice > 0) {
                        const shares = Math.floor(inputVal / stockPrice);
                        const inputField = panel.querySelector('.buyBlock___bIlBS input.input-money');
                        if (inputField) setNativeValue(inputField, shares);
                    }
                });
            }

            if (sellBtn) {
                sellBtn.addEventListener('click', () => {
                    const inputVal = parseFloat(panel.querySelector('#selling_total')?.value.replace(/[^\d.]/g, ''));
                    const priceElements = panel.querySelectorAll('li[class^="current___"]');
                    let stockPriceText = null;

                    priceElements.forEach(el => {
                        const text = el.textContent.trim();
                        if (text.startsWith('$')) stockPriceText = text;
                    });

                    const stockPrice = stockPriceText ? parseFloat(stockPriceText.replace(/[^\d.]/g, '')) : 0;
                    if (!isNaN(inputVal) && stockPrice > 0) {
                        const shares = Math.floor(inputVal / stockPrice);
                        const inputField = panel.querySelector('.sellBlock___A_yTW input.input-money');
                        if (inputField) setNativeValue(inputField, shares);
                    }
                });
            }
        }, 50);
    }

})();

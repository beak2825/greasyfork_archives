// ==UserScript==
// @name         Shop Price Setter
// @namespace    http://tampermonkey.net/
// @license      gnu gp4
// @version      1.5
// @description  Adds button to insert average price into your shop listing form.
// @author       You
// @match        https://www.neopets.com/market.phtml?type=your*
// @match        https://www.neopets.com/market.phtml?order_by=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542367/Shop%20Price%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/542367/Shop%20Price%20Setter.meta.js
// ==/UserScript==

(function () {
    'use strict';

//=======
// Styles
//=======

    const addCustomStyles = () => {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'https://greasyfork.org/scripts/540710-neopets-2020/code/neopets_2020.user.css';
        document.head.appendChild(stylesheet);

        const style = document.createElement('style');
        style.textContent = `
            #neopets-auto-fill-btn {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                padding: 10px;
                font-size: x-large;
                color: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    };

//==========
// Constants
//==========

    const roundToNearest100 = num => Math.round(num / 100) * 100;

    const parsePrice = str => parseInt(str.replace(/[^0-9]/g, ''), 10);

    const getItemName = () => {
        const searchDiv = document.querySelector('#search_for');
        if (!searchDiv) {
            console.warn('[Neopets Auto Filler] #search_for div not found.');
            return null;
        }

        const match = searchDiv.textContent.match(/Searching for '(.+?)'/);
        if (!match) {
            console.warn('[Neopets Auto Filler] Could not extract item name.');
            return null;
        }

        const name = match[1].toLowerCase().trim();
        console.log(`[Neopets Auto Filler] Found item name: "${name}"`);
        return name;
    };

    const getShopWizardPrices = () => {
        const rows = Array.from(document.querySelectorAll('tr.darkbg'));
        const prices = rows.map(row => {
            const priceCell = row.cells[2];
            return priceCell ? parsePrice(priceCell.textContent) : null;
        }).filter(price => price !== null && !isNaN(price));

        console.log(`[Neopets Auto Filler] Found ${prices.length} valid prices.`);
        return prices;
    };

    const setItemPrice = (itemName, averagePrice) => {
        const itemRows = document.querySelectorAll('tr');
        for (let row of itemRows) {
            const itemNameCell = row.querySelector('td b');
            if (!itemNameCell) continue;

            if (itemNameCell.textContent.toLowerCase().trim() === itemName) {
                const input = row.querySelector('input[name^="cost_"]');
                if (input) {
                    input.value = averagePrice;
                    console.log(`[Neopets Auto Filler] Set value for "${itemName}" to ${averagePrice} NP.`);
                    return true;
                }
            }
        }
        console.warn(`[Neopets Auto Filler] Could not find matching item row for "${itemName}".`);
        return false;
    };

////////
// UX/UX
////////

    const runAutoPrice = () => {
        console.log('[Neopets Auto Filler] Button clicked. Starting price fill.');

        const itemName = getItemName();
        if (!itemName) return alert("Could not find searched item name.");

        const prices = getShopWizardPrices();
        if (prices.length === 0) return alert("No shop prices found.");

        const average = prices.reduce((a, b) => a + b, 0) / prices.length;
        const rounded = roundToNearest100(average);

        setItemPrice(itemName, rounded);
    };

    const addManualButton = () => {
        if (document.querySelector('#neopets-auto-fill-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'neopets-auto-fill-btn';
        btn.textContent = 'Set SSW Average';
        btn.classList.add('button-green__2020');
        btn.addEventListener('click', runAutoPrice);
        document.body.appendChild(btn);

        console.log('[Neopets Auto Filler] Button added.');
    };

//============
// Run Program
//============

    const init = () => {
        addCustomStyles();
        const waitForBody = () => {
            if (document.body) {
                addManualButton();
            } else {
                setTimeout(waitForBody, 50);
            }
        };
        waitForBody();
    };

    init();

})();

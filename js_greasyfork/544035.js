// ==UserScript==
// @name         Torn AH Logger
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Auction house logger to spreadsheet
// @author       aquagloop
// @match        https://www.torn.com/amarket.php*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544035/Torn%20AH%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/544035/Torn%20AH%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        console.log('Torn AH Logger (v2.2): DOM ready. Initializing script.');

        const GAS_URL = 'https://script.google.com/macros/s/AKfycbxoG4jjfLr6ZIoxpzZmhrHYhrRedBnNS-sew6QkpymQQPh7O8cZqEg5CpB7MQWN85Y/exec';
        if (GAS_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE' || GAS_URL === '') {
            alert('CRITICAL: Please edit the Torn AH userscript and set your Google Apps Script URL.');
            return;
        }

        let currentItemData = null;

        function createFloatPanel() {
            const panel = document.createElement('div');
            panel.id = 'log-panel';
            panel.style.cssText = `
                position: fixed; top: 100px; right: 20px; width: 280px; background-color: #F2F2F2;
                border: 1px solid #CCC; border-radius: 8px; z-index: 9999; font-family: Arial, Helvetica, sans-serif;
                display: none; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-size: 14px;
            `;
            panel.innerHTML = `
                <div style="padding: 10px; border-bottom: 1px solid #DDD; background-color: #E9E9E9; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <strong id="log-panel-name" style="color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">No Item Selected</strong>
                    <span id="log-panel-close" style="cursor: pointer; font-size: 20px; color: #777; line-height: 1;">&times;</span>
                </div>
                <div style="padding: 10px; line-height: 1.6;">
                    <div><strong>Quality:</strong> <span id="log-panel-quality">N/A</span></div>
                    <div><strong>Bonus:</strong> <span id="log-panel-bonus">N/A</span></div>
                    <div><strong>Price:</strong> <span id="log-panel-price">N/A</span></div>
                    <div><strong>Ends On:</strong> <span id="log-panel-ends-on">N/A</span></div>
                </div>
                <div style="padding: 10px; border-top: 1px solid #DDD;">
                    <button id="log-panel-add-button" style="width: 100%; padding: 8px; font-size: 15px; background: linear-gradient(to bottom, #4CAF50 0%, #45a049 100%); color: white; border: 1px solid #3e8e41; border-radius: 5px; cursor: pointer;">
                        Add to Sheet
                    </button>
                </div>
            `;
            document.body.appendChild(panel);

            const addButton = document.getElementById('log-panel-add-button');
            const closeButton = document.getElementById('log-panel-close');
            closeButton.onclick = () => { panel.style.display = 'none'; };
            addButton.onclick = () => {
                if (!currentItemData) return;
                addButton.textContent = 'Logging...';
                addButton.disabled = true;

                GM_xmlhttpRequest({
                    method: 'POST', url: GAS_URL, data: JSON.stringify(currentItemData),
                    headers: { 'Content-Type': 'application/json' },
                    onload: () => {
                        addButton.textContent = 'Logged!'; addButton.style.background = '#008000';
                        setTimeout(() => {
                            panel.style.display = 'none';
                            addButton.textContent = 'Add to Sheet';
                            addButton.style.background = 'linear-gradient(to bottom, #4CAF50 0%, #45a049 100%)';
                            addButton.disabled = false;
                        }, 1000);
                    },
                    onerror: () => {
                        addButton.textContent = 'Error!'; addButton.style.background = 'red';
                        setTimeout(() => {
                            addButton.textContent = 'Add to Sheet';
                            addButton.style.background = 'linear-gradient(to bottom, #4CAF50 0%, #45a049 100%)';
                            addButton.disabled = false;
                        }, 2000);
                    }
                });
            };
        }

        function findAllProperties(element, propName) {
            const foundValues = [];
            const properties = element.querySelectorAll('ul[class*="properties"] > li[class*="propertyWrapper"]');
            for (const prop of properties) {
                const titleElement = prop.querySelector('span[class*="title"]');
                if (titleElement && titleElement.textContent.trim() === propName) {
                    const valueElement = prop.querySelector('div[class*="valueWrapper"]');
                    if (valueElement) { foundValues.push(valueElement.textContent.trim()); }
                }
            }
            return foundValues.length > 0 ? foundValues.join(', ') : 'N/A';
        }

        function updatePanel(detailsView) {
            const parentListItem = detailsView.closest('li');
            if (!parentListItem) return;

            const itemName = parentListItem.querySelector('.item-name').textContent.trim();
            const itemPrice = parentListItem.querySelector('.c-bid-wrap').textContent.trim();
            // New: Find the span with the title attribute
            const timeSpan = parentListItem.querySelector('.time-wrap > span[title]');
            const itemEndsOn = timeSpan ? timeSpan.getAttribute('title') : 'N/A';

            document.getElementById('log-panel-name').textContent = itemName;
            document.getElementById('log-panel-price').textContent = itemPrice;
            document.getElementById('log-panel-ends-on').textContent = itemEndsOn;
            document.getElementById('log-panel-quality').textContent = 'Loading...';
            document.getElementById('log-panel-bonus').textContent = 'Loading...';
            document.getElementById('log-panel').style.display = 'block';

            setTimeout(() => {
                const itemInfoDiv = detailsView.querySelector('div[class*="item-info"]');
                let itemQuality = 'N/A'; let itemBonus = 'N/A';

                if (itemInfoDiv) {
                    itemQuality = findAllProperties(itemInfoDiv, 'Quality:');
                    itemBonus = findAllProperties(itemInfoDiv, 'Bonus:');
                }

                currentItemData = { name: itemName, quality: itemQuality, bonus: itemBonus, price: itemPrice, endsOn: itemEndsOn };

                document.getElementById('log-panel-quality').textContent = itemQuality;
                document.getElementById('log-panel-bonus').textContent = itemBonus;
            }, 200);
        }

        createFloatPanel();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.matches('.show-item-info') && target.style.display === 'block') {
                        updatePanel(target);
                    }
                }
            }
        });


        const interval = setInterval(() => {
            const targetNode = document.getElementById('auction-house-tabs');
            if (targetNode) {
                clearInterval(interval);

                observer.observe(targetNode, { subtree: true, attributes: true });
                console.log('Torn AH Logger (v2.2): Observer attached to main AH container.');
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
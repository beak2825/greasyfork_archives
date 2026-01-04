// ==UserScript==
// @name         Disable Stock Selling
// @namespace    heartflower.torn
// @version      1.0
// @description  No longer accidentally sell stocks
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542755/Disable%20Stock%20Selling.user.js
// @updateURL https://update.greasyfork.org/scripts/542755/Disable%20Stock%20Selling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findTitle(retries = 30) {
        let title = document.body.querySelector('.title___rhtB4');

        if (!title) {
            if (retries > 0) {
                setTimeout(() => findTitle(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for title after 30 retries.');
            }
            return;
        }

        let btn = document.createElement('button');
        btn.classList.add('torn-btn');
        btn.style.marginLeft = '20px';


        let setting = localStorage.getItem('hf-no-stock-selling');
        if (setting === 'false') {
            btn.textContent = 'DISABLE SELLING';
        } else {
            btn.textContent = 'ENABLE SELLING';
        }

        title.appendChild(btn);

        btn.addEventListener('click', function() {
            setting = localStorage.getItem('hf-no-stock-selling');
            if (setting === 'false') {
                localStorage.setItem('hf-no-stock-selling', 'true');
                alert('Stock selling disabled');
                btn.textContent = 'ENABLE SELLING';
            } else {
                localStorage.setItem('hf-no-stock-selling', 'false');
                alert('Stock selling enabled');
                btn.textContent = 'DISABLE SELLING';
            }
        });

    }

    findTitle();
    function findStockMarket(retries = 30) {
        let stockMarket = document.body.querySelector('.stockMarket___iB18v');

        if (!stockMarket) {
            if (retries > 0) {
                setTimeout(() => findStockMarket(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for stock market after 30 retries.');
            }
            return;
        }

        createObserver(stockMarket);
    }

    function deleteConfirmButton(retries = 30) {
        let confirmButton = document.body.querySelector('.sellBlock___A_yTW .sell___eyGeI');

        if (!confirmButton) {
            if (retries > 0) {
                setTimeout(() => deleteConfirmButton(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for sell button after 30 retries.');
            }
            return;
        }

        confirmButton.style.display = 'none';
    }

    // HELPER function to create a mutation observer
    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (node.classList.contains('manageBlock___PfiJh') || node.classList.contains('sell___eyGeI') || node.classList.contains('stockDropdown___Y2X_v'))) {
                            let setting = localStorage.getItem('hf-no-stock-selling');
                            if (setting === 'true') {
                                deleteConfirmButton();
                            }
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    findStockMarket();

})();
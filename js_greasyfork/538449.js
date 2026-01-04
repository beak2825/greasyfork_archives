// ==UserScript==
// @name         Torn Add All Plushies & Flowers
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Selects maximum quantity of all plushies and flowers.
// @author       aquagloop
// @match        https://www.torn.com/trade.php*
// @grant        none
// @license      license
// @downloadURL https://update.greasyfork.org/scripts/538449/Torn%20Add%20All%20Plushies%20%20Flowers.user.js
// @updateURL https://update.greasyfork.org/scripts/538449/Torn%20Add%20All%20Plushies%20%20Flowers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoMaxPlushiesAndFlowers() {
        let plushiesContainer = document.querySelector('ul.items-cont.plushies-items') ||
                               document.querySelector('[data-reactid*="Plushie"]') ||
                               document.querySelector('ul.items-cont[data-reactid*="Plushie"]');

        let flowersContainer = document.querySelector('ul.items-cont.flowers-items') ||
                              document.querySelector('[data-reactid*="Flower"]') ||
                              document.querySelector('ul.items-cont[data-reactid*="Flower"]');

        function processItemsInContainer(container) {
            if (!container) return;

            const items = container.querySelectorAll('li');
            items.forEach((item) => {
                const quantityInput = item.querySelector('input[name="amount"]') ||
                                    item.querySelector('input[placeholder="Qty"]') ||
                                    item.querySelector('input.clear-all[type="text"]');

                if (quantityInput) {
                    quantityInput.value = '999';
                    quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                    quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
                    quantityInput.dispatchEvent(new Event('blur', { bubbles: true }));
                    quantityInput.dispatchEvent(new Event('keyup', { bubbles: true }));
                }
            });
        }

        processItemsInContainer(plushiesContainer);
        processItemsInContainer(flowersContainer);

        const allQuantityInputs = document.querySelectorAll('input[name="amount"][placeholder="Qty"]');
        allQuantityInputs.forEach((input) => {
            const parentContainer = input.closest('ul.items-cont');
            if (parentContainer && (parentContainer.classList.contains('plushies-items') ||
                                   parentContainer.classList.contains('flowers-items') ||
                                   parentContainer.getAttribute('data-reactid')?.includes('Plushie') ||
                                   parentContainer.getAttribute('data-reactid')?.includes('Flower'))) {
                input.value = '999';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        });
    }

    function observeTradeInterface() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    const addedElements = Array.from(mutation.addedNodes).filter(node => node.nodeType === 1);
                    const hasPlushiesOrFlowers = addedElements.some(el =>
                        el.classList?.contains('plushies-items') ||
                        el.classList?.contains('flowers-items') ||
                        el.querySelector?.('.plushies-items, .flowers-items')
                    );

                    if (hasPlushiesOrFlowers) {
                        setTimeout(autoMaxPlushiesAndFlowers, 500);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addManualTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'Add all Plushies & Flowers';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            background: #2d5aa0;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;

        button.addEventListener('click', autoMaxPlushiesAndFlowers);
        document.body.appendChild(button);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                autoMaxPlushiesAndFlowers();
                observeTradeInterface();
                addManualTriggerButton();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            autoMaxPlushiesAndFlowers();
            observeTradeInterface();
            addManualTriggerButton();
        }, 1000);
    }

    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            if (currentUrl.includes('trade.php')) {
                setTimeout(autoMaxPlushiesAndFlowers, 1500);
            }
        }
    }, 1000);

})();
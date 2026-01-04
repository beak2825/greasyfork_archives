// ==UserScript==
// @name         Ocado + and - controlls into basket
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds reliable + / - buttons to Ocado basket product tiles (SPA-aware, robust binding to React buttons)
// @author       pepepepepe
// @match        https://www.ocado.com/orders/*/details
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541557/Ocado%20%2B%20and%20-%20controlls%20into%20basket.user.js
// @updateURL https://update.greasyfork.org/scripts/541557/Ocado%20%2B%20and%20-%20controlls%20into%20basket.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SPA_CHECK_INTERVAL = 500;
    const MAX_RETRIES = 10;
    let lastUrl = location.href;

    function waitForReactButtonReady(button, retries = 0) {
        return new Promise((resolve, reject) => {
            const tryClick = () => {
                const originalValue = button.getAttribute('aria-disabled');
                button.click();

                // After click, check if quantity changed (React responded)
                setTimeout(() => {
                    if (button.getAttribute('aria-disabled') !== originalValue || retries >= MAX_RETRIES) {
                        resolve();
                    } else {
                        requestIdleCallback
                            ? requestIdleCallback(() => waitForReactButtonReady(button, retries + 1).then(resolve))
                            : setTimeout(() => waitForReactButtonReady(button, retries + 1).then(resolve), 300);
                    }
                }, 200);
            };

            tryClick();
        });
    }

    function injectControls() {
        const productTiles = document.querySelectorAll('[data-test^="tile-fop-wrapper"]');

        productTiles.forEach(tile => {
            const productId = tile.getAttribute('data-test')?.split(':')[1];
            if (!productId || tile.querySelector('.tm-functional-controls')) return;

            const incBtn = document.querySelector(`div[data-synthetics*="${productId}"] button[data-test="counter:increment"]`);
            const decBtn = document.querySelector(`div[data-synthetics*="${productId}"] button[data-test="counter:decrement"]`);
            if (!incBtn || !decBtn) return;

            const container = document.createElement('div');
            container.className = 'tm-functional-controls';
            container.style.display = 'flex';
            container.style.gap = '6px';
            container.style.marginTop = '8px';

            const makeProxyButton = (label, realBtn) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.setAttribute('style', 'padding: 6px 10px; background: #eee; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; cursor: pointer;');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    waitForReactButtonReady(realBtn).then(() => realBtn.click());
                });
                return btn;
            };

            const minus = makeProxyButton('−', decBtn);
            const plus = makeProxyButton('+', incBtn);

            container.appendChild(minus);
            container.appendChild(plus);

            const imageArea = tile.querySelector('.sc-guJBdh') || tile;
            imageArea.parentElement.appendChild(container);
        });
    }

    function refreshControls() {
        setTimeout(() => injectControls(), 1000);
    }

    // Watch for SPA navigation
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (location.href.match(/^https:\/\/ww2\.ocado\.com\/orders\/.*\/details/)) {
                console.log('🔄 URL changed, refreshing injected controls...');
                refreshControls();
            }
        }
    }, SPA_CHECK_INTERVAL);

    // Watch for DOM changes (for lazy-loaded tiles)
    const observer = new MutationObserver(() => {
        if (location.href.match(/^https:\/\/ww2\.ocado\.com\/orders\/.*\/details/)) {
            injectControls();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // First run
    refreshControls();
})();

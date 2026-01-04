// ==UserScript==
// @name         Disable Sell Stock
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Stock sell button disable
// @license      MIT
// @author       Gravity
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543281/Disable%20Sell%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/543281/Disable%20Sell%20Stock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELL_BUTTON_CLASS = "sell___eyGeI";

    function disableSellButtons() {
        const buttons = document.querySelectorAll(`button.${SELL_BUTTON_CLASS}`);
        buttons.forEach(button => {
            if (!button.disabled) {
                button.disabled = true;
                button.style.pointerEvents = "none";
                button.style.opacity = "0.5";
                button.title = "Disabled by userscript";
            }
        });
    }

    // MutationObserver for AJAX/dynamic updates
    const observer = new MutationObserver(() => {
        disableSellButtons();
    });

    // Start observing as soon as DOM is ready
    window.addEventListener('load', () => {
        disableSellButtons();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
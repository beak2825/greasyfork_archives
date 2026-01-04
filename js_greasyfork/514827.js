// ==UserScript==
// @name         Hide Halloween Exchange Button
// @namespace    Apo
// @version      1.0
// @author       Apollyon [445323]
// @description  Hide the "Exchange all treats" button
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514827/Hide%20Halloween%20Exchange%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514827/Hide%20Halloween%20Exchange%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the button
    function hideExchangeButton() {
        const exchangeButton = document.querySelector('button[data-basket-action="exchangeTreats"]');
        if (exchangeButton) {
            exchangeButton.style.display = 'none';
        }
    }

    // Use MutationObserver to monitor for DOM changes and hide the button if it reappears
    const observer = new MutationObserver(hideExchangeButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to hide the button if it’s already loaded
    hideExchangeButton();
})();
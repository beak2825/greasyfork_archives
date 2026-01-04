// ==UserScript==
// @name         NoConfirm Torn Trades
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the confirmation dialog from the trade screen
// @author       Weav3r
// @match        https://www.torn.com/trade.php*
// @downloadURL https://update.greasyfork.org/scripts/496279/NoConfirm%20Torn%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/496279/NoConfirm%20Torn%20Trades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyTradeButtonLink() {
        const buttons = document.querySelectorAll('a.btn.accept.torn-btn.green');
        buttons.forEach(button => {
            let href = button.getAttribute('href');
            if (href.includes('accept&ID')) {
                href = href.replace('accept&ID', 'accept2&ID');
                button.setAttribute('href', href);
            }
        });
    }

    window.addEventListener('load', function() {
        modifyTradeButtonLink();
    });

    const observer = new MutationObserver(modifyTradeButtonLink);
    observer.observe(document.body, { childList: true, subtree: true });

})();
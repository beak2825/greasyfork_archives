// ==UserScript==
// @name         CE - Quick Deposit All Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to click the left arrow and then the up arrow to deposit all your money. Works with the megascript and without, allowing you to skip clicking the vault tab
// @author       Baccy
// @match        https://cartelempire.online/Property
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530413/CE%20-%20Quick%20Deposit%20All%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/530413/CE%20-%20Quick%20Deposit%20All%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (document.querySelector('#maxPropertyDepositBtn')) {
                setupListeners();
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function setupListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                const maxDepositBtn = document.querySelector('#maxPropertyDepositBtn');
                if (maxDepositBtn) {
                    maxDepositBtn.click();
                }
            } else if (event.key === 'ArrowUp') {
                const depositBtn = document.querySelector('#depositBtn');
                if (depositBtn) {
                    depositBtn.click();
                }
            }
        });
    }
})();

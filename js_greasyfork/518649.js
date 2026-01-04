// ==UserScript==
// @name        Skip Propinas Warning
// @namespace   Fenix
// @description Skips the pagamento de propinas warning. Made on 11/24/2024, 1:02:15 AM
// @author      afsc19
// @version     1.0
// @match       https://fenix.tecnico.ulisboa.pt/login.do
// @grant       none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518649/Skip%20Propinas%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/518649/Skip%20Propinas%20Warning.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the page to fully load, I think fenix doesn't need this tho.
    window.addEventListener('load', function () {
        // Prosseguir button has tabindex=1
        const button = document.querySelector('a.btn.btn-default[tabindex="1"]'); // Update the selector if needed
        if (button) {
            button.click(); // Simulate the button click
            console.log("Skipping message.");
        } else {
            console.log("'Prosseguir' button not found.");
        }
    });
})();
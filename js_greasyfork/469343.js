// ==UserScript==
// @name         ARTY.OOO Dashboard
// @namespace    https://greasyfork.org/
// @version      0.0.0
// @description  Better Dashboard Display For ARTY.OOO Escrow Website .
// @author       Flicker_i386
// @match        https://arty.ooo/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arty.ooo
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469343/ARTYOOO%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/469343/ARTYOOO%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dashboard Element
    (function() {
        // Create New Element
        let elem_money = document.createElement("h1");

        // Style It
        elem_money.style.setProperty("font-size", "6em");
        elem_money.style.setProperty("margin-left", "auto");

        // Set Default Inner Text
        elem_money.innerText = "$0.00";

        // Append The New Element
        // This Is A Complicated Locator To Put It In Specific ID - Less Element
        // Get All h2 Elements
        const elems_h2 = document.querySelectorAll("h2");

        // Loop
        for (let i = 0; i < elems_h2.length; i++) {
            const elem_h2 = elems_h2[i];

            // Check If inner HTML Starts With "Hey,"
            if (elem_h2.innerHTML.startsWith("Hey,")) {
                // Add Element
                elem_h2.insertAdjacentElement("afterend", elem_money);

                // Extra
                // Add Row Class
                elem_h2.parentNode.classList.add("row");
            }
        }

        // Get Value From Wise Withdraw Number
        // Recursive Function To Check Value
        function check_wise_value() {
            let money_stored = document.getElementById("for-value").innerText;

            if (money_stored.trim() !== "") {
                // Value Is Available
                elem_money.innerText = money_stored;
            } else {
                // Value Is Not Available Yet , Wait And Check Again
                setTimeout(check_wise_value, 200); // Adjust The Timeout As Needed
            }
        }

        // Call To Start Checking
        check_wise_value();
    })();

})();
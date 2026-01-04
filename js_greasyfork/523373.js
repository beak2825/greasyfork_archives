// ==UserScript==
// @name         Neopets: TP 1-Click Check 10
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to the page that, when clicked, toggles the first 10 items in the Trading Post item list between checked and unchecked.
// @author       Fuzzy
// @match        https://www.neopets.com/island/tradingpost.phtml
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/523373/Neopets%3A%20TP%201-Click%20Check%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/523373/Neopets%3A%20TP%201-Click%20Check%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.body.innerHTML.includes("Create a trade") || document.body.innerHTML.includes("Make an offer")) {
        const $textarea = $("b:contains('Wishlist:')").parent().find("textarea").eq(0);
        const $input = $("b:contains('Neopoints:')").parent().find("input[type='text']").eq(0);

        if ($textarea.length > 0) {
            $textarea.after(`
                <br>
                <button type="button" id="toggleButton" style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt; margin-top: 5px;">
                    1-Click Check 10
                </button>
                <br>
            `);
        } else if ($input.length > 0) {
            $input.after(`
                <br>
                <button type="button" id="toggleButton" style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt; margin-top: 5px;">
                    1-Click Check 10
                </button>
                <br>
            `);
        }

        let isChecked = false;

        $("#toggleButton").on("click", function() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            for (let i = 0; i < 10 && i < checkboxes.length; i++) {
                checkboxes[i].checked = !isChecked;
            }
            isChecked = !isChecked;
            $(this).text(isChecked ? "1-Click Uncheck 10" : "1-Click Check 10");
        });
    }
})();
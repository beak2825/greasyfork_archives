// ==UserScript==
// @name         Torn RR: Focus Yes Button with Enter
// @namespace    ASTA via ChatGPT
// @version      1.0
// @description  Press Enter to focus the "Yes" button so you can activate it with Enter/Space yourself (checked by Velthir)
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547129/Torn%20RR%3A%20Focus%20Yes%20Button%20with%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/547129/Torn%20RR%3A%20Focus%20Yes%20Button%20with%20Enter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findYesButton() {
        // Match Torn's Yes confirm button
        let yesBtn = document.querySelector("button[data-type='confirm']");
        if (yesBtn && yesBtn.offsetParent !== null) {
            return yesBtn;
        }
        // Fallback: any visible button with text "Yes"
        return Array.from(document.querySelectorAll("button"))
            .find(b => b.textContent.trim().toLowerCase() === "yes" && b.offsetParent !== null);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.repeat) {
            // Don’t interfere with typing in inputs
            if (["input", "textarea"].includes(e.target.tagName.toLowerCase()) || e.target.isContentEditable) {
                return;
            }

            let yesBtn = findYesButton();
            if (yesBtn) {
                e.preventDefault();
                yesBtn.focus(); // focus only, no automatic click
            }
        }
    });
})();

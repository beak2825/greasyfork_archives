// ==UserScript==
// @name         Codex Auto Verify
// @namespace    http://your.domain.com
// @version      0.1
// @description  Automatically verifies Codex entries on Greasy Fork.
// @author       Your Name
// @match        https://greasyfork.org/en/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494175/Codex%20Auto%20Verify.user.js
// @updateURL https://update.greasyfork.org/scripts/494175/Codex%20Auto%20Verify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to automatically verify Codex entries
    function autoVerifyCodex() {
        // Select all the Codex entries
        const codexEntries = document.querySelectorAll('.codex-item');

        // Loop through each Codex entry
        codexEntries.forEach(entry => {
            // Check if the entry is not already verified
            if (!entry.classList.contains('verified')) {
                // Click on the verify button
                const verifyButton = entry.querySelector('.verify-button');
                verifyButton.click();
            }
        });
    }

    // Call the autoVerifyCodex function when the page loads
    window.addEventListener('load', () => {
        autoVerifyCodex();
    });
})();
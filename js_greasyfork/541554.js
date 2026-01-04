// ==UserScript==
// @name         Ocado Price Sorter (2025 Update)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automatically set Ocado sort to "Price per Unit: Low to High"
// @author       pepepepepe
// @match        https://www.ocado.com/search?*
// @icon         https://www.google.com/s2/favicons?domain=ocado.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541554/Ocado%20Price%20Sorter%20%282025%20Update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541554/Ocado%20Price%20Sorter%20%282025%20Update%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setSortOption() {
        const maxAttempts = 20;
        let attempts = 0;

        const interval = setInterval(() => {
            attempts++;

            const sortButton = document.querySelector('button[data-test="sort-button"]');
            const sortOptions = document.querySelectorAll('[data-test="sort-option"] strong');

            if (sortButton && sortOptions.length > 0) {
                // Check if dropdown is open, if not, click it
                if (sortButton.getAttribute("aria-expanded") !== "true") {
                    sortButton.click();
                    return;
                }

                // Find the "Price per Unit: Low to High" option
                for (let option of sortOptions) {
                    if (option.textContent.trim() === "Price per Unit: Low to High") {
                        option.closest("li")?.click();
                        console.log("✅ Set sort to: Price per Unit: Low to High");
                        clearInterval(interval);
                        return;
                    }
                }
            }

            if (attempts >= maxAttempts) {
                console.warn("⚠️ Failed to set sort option after multiple attempts.");
                clearInterval(interval);
            }
        }, 500);
    }

    // Watch for SPA-style navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log("🔄 Detected URL change:", location.href);
            setTimeout(setSortOption, 1000); // delay for new page content to load
        }
    }, 500);

    // Initial trigger
    window.addEventListener("load", () => {
        setTimeout(setSortOption, 1000);
    });

})();
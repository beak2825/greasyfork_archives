// ==UserScript==
// @name         Torn - Select All Checkbox
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Move only the "Select All" checkbox and label next to the "Undo Changes" button - I let it work correctly. RIP to whoever reads script descriptions. Imma go and play a round lol.
// @author       Grance [3487987]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523974/Torn%20-%20Select%20All%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/523974/Torn%20-%20Select%20All%20Checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveSelectAllCheckbox() {
        const checkbox = document.querySelector('#itemMarket-selectAllCheckbox');
        const label = document.querySelector('label[for="itemMarket-selectAllCheckbox"]');
        const clearAllButton = document.querySelector('.controls___N9naF .btn-transparent');

        if (checkbox && label && clearAllButton && !document.querySelector('.select-all-wrapper')) {
            // Create a wrapper for the checkbox and label
            const wrapper = document.createElement('div');
            wrapper.className = 'select-all-wrapper';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginLeft = '10px';
            wrapper.style.cursor = 'pointer';

            // Adjust label styling to align properly
            label.style.marginLeft = '5px';
            label.style.fontSize = '12px';

            // Move checkbox and label into the wrapper
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            // Insert the wrapper directly next to the "Clear all" button
            clearAllButton.parentNode.insertBefore(wrapper, clearAllButton.nextSibling);
        }
    }

    // Observe dynamic content loading
    const observer = new MutationObserver(() => {
        moveSelectAllCheckbox();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Ensure the script runs after the page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(moveSelectAllCheckbox, 1000); // Added delay for dynamic content
    });
})();

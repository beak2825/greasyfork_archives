// ==UserScript==
// @name         Enable Text Selection and Copy Data on Grupo Andres
// @namespace    http://SrGeneroso/
// @version      1.0
// @license      MIT
// @description  Enable text selection and add a button to copy to clipboard the item data on https://online.grupoandres.com/
// @author       SrGeneroso
// @match        https://online.grupoandres.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486264/Enable%20Text%20Selection%20and%20Copy%20Data%20on%20Grupo%20Andres.user.js
// @updateURL https://update.greasyfork.org/scripts/486264/Enable%20Text%20Selection%20and%20Copy%20Data%20on%20Grupo%20Andres.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyPage() {
        // Add custom styles to enable text selection
        GM_addStyle('.search-by-two-measures { user-select: text !important; -webkit-user-select: text !important; }');

        // Function to extract and copy data
        function copyData(tableResult, button) {
            var clipboardData = '';

            var brand = tableResult.querySelector('.image-brand')?.querySelector('img')?.getAttribute('title');
            var model = tableResult.querySelector('.description')?.querySelector('p')?.textContent.trim();
            var properties = tableResult.querySelector('.properties')?.textContent.trim().replace(/\s*\|$/, '');
            var price = tableResult.querySelector('.base-price')?.innerText;
            var stock = tableResult.querySelector('.stock-item')?.textContent.trim();

            console.log(`${brand} ${model} | ${properties} | ${stock} | ${price}`.replace(/\s+/g, ' '))
            if (brand && model && price && stock) {
                clipboardData = `${brand} ${model} | ${properties} | ${stock} | ${price}`.replace(/\s+/g, ' ')
            }

            // Copy data to clipboard
            navigator.clipboard.writeText(clipboardData).then(function() {
                // Change button text after successful copy
                button.textContent = buttonMsgExecuted;
                setTimeout(function() {
                    // Reset button text after a brief delay
                    button.textContent = buttonMsgReady;
                }, 2000);
            }).catch(function(err) {
                console.error('Error copying to clipboard:', err);
                // Change button text after an error
                button.textContent = buttonMsgError;
                setTimeout(function() {
                    // Reset button text after a brief delay
                    button.textContent = buttonMsgReady;
                }, 2000);
            });
        }

        // Items
        var tableResults = document.querySelectorAll('.results-body .table-result');
        var buttonMsgReady = '📎 Copy to clipboard'
        var buttonMsgExecuted = '📋 Data copied to clipboard'
        var buttonMsgError = '💥 Copy failed'

        tableResults.forEach(function(tableResult) {
            var existingButton = tableResult.querySelector('.copy-button');
            if (!existingButton) {
                // Create and append the button element
                var button = document.createElement('button');
                button.className = 'copy-button';
                button.textContent = buttonMsgReady;

                // Add click event listener to the button
                button.addEventListener('click', function() {
                    copyData(tableResult, button);
                });

                tableResult.appendChild(button);
            }
        });
    }

    // Wait until the document is fully loaded
    setTimeout(function() {
        // Run the script
        modifyPage();
        // Monitor mutations on .results-body
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                modifyPage();

            });
        });
        var results = document.querySelector('.results-body');
        if (results) {
            // Start observing .results-body for childList changes
            observer.observe(results, { childList: true });
        } else {
            console.error('.results-body element not found.');
        }
    }, 1000);
})();

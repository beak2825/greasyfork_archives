// ==UserScript==
// @name         Recall?SKU Cleanup Helper
// @version      0.6
// @description  Helps in inputting text values into specified text fields using "Control+B" on pages with "Manhattan" in their title, with dynamic value count for ITEM_CBO.ITEM_NAME or LPN.TC_LPN_ID.
// @author       You
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1183167
// @downloadURL https://update.greasyfork.org/scripts/497834/RecallSKU%20Cleanup%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/497834/RecallSKU%20Cleanup%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log("Script loaded");

    if (!document.title.includes("Manhattan")) {
        console.log("Page title does not include 'Manhattan'. Exiting script.");
        return;
    }

    console.log("Page title includes 'Manhattan'. Script active without mode check and DOM observation.");

    function findSelectorsWithSpecificOption(value) {
        const allSelectElements = document.querySelectorAll('select[id*="ruleSelDtlDataTable"][id*="ruleSelDtlColumnList"]');
        return Array.from(allSelectElements).filter(select =>
            select.querySelector(`option[value="${value}"][selected="selected"]`)
        ).map(select => parseInt(select.id.match(/(\d+)/)[1], 10)).sort((a, b) => a - b);
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'b') {
            console.log("Detected 'Control+B' keypress.");
            const lpnIndices = findSelectorsWithSpecificOption('LPN.TC_LPN_ID');
            const itemCboIndices = findSelectorsWithSpecificOption('ITEM_CBO.ITEM_NAME');

            let targetIndices, valueLabel;
            if (lpnIndices.length > 0) {
                targetIndices = lpnIndices;
                valueLabel = 'LPN.TC_LPN_ID';
            } else if (itemCboIndices.length > 0) {
                targetIndices = itemCboIndices;
                valueLabel = 'ITEM_CBO.ITEM_NAME';
            } else {
                console.log("No matching selectors found for either value. Ignoring 'Control+B' keypress.");
                return;
            }

            const count = targetIndices.length;
            let inputString = prompt(`Enter up to ${count} value(s) separated by spaces for ${valueLabel}:`);
            if (inputString) {
                let values = inputString.split(/\s+/);
                if (values.length > count) {
                    alert(`You entered more values than the acceptable limit of ${count}. Please try again.`);
                    return; // Prevent execution if too many values are provided
                }
                applyValues(values, targetIndices); // Pass 'count' to ensure all fields are considered
            }
        }
    });

    function applyValues(values, matchingIndices) {
        matchingIndices.forEach((index, i) => {
            const selector = `#dataForm\\:ruleSelDtlDataTable\\:${index}\\:ruleSelDtlRuleCmparValue`;
            let inputField = document.querySelector(selector);
            if (inputField) {
                // Update with provided value or "UPDATE" if out of user-provided values
                inputField.value = i < values.length ? values[i] : "UPDATE";
                console.log(`Updated field ${selector} with value: ${inputField.value}`);
                inputField.dispatchEvent(new Event('change', { 'bubbles': true }));
            }
        });
    }
})();

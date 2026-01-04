// ==UserScript==
// @name         POD - Decimal to American
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Finds and logs cellRows elements using MutationObserver (for converting odds).
// @author       You
// @match        https://www.pinnacleoddsdropper.com/terminal
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474093/POD%20-%20Decimal%20to%20American.user.js
// @updateURL https://update.greasyfork.org/scripts/474093/POD%20-%20Decimal%20to%20American.meta.js
// ==/UserScript==


//console.log("[TAMPERMONKEY] Converting Odds: ", decimalOdds, americanOdds);


(function() {
    'use strict';

    const regexPattern = /^(?:\d{1,2}\.\d{1,3}|[0-9])$/;


    function convertOdds(decimalOdds) {
        if (decimalOdds >= 2.00) {
            return `+${Math.round((decimalOdds - 1) * 100)}`;
        } else {
            return `-${Math.round(100 / (decimalOdds - 1))}`;
        }
    }

    function processCellRows(cellRows) {
        //console.log('[TAMPERMONKEY] Converting odds for cellRows:', cellRows);
        cellRows.forEach(cellRow => {
            const nestedDivSpanOne = cellRow.querySelector('div.flex span');
            const nestedDivSpanTwo = cellRow.querySelector('div.flex span:nth-child(3)');
            // console.log("[TAMPERMONKEY] Nested Div Spans: ", nestedDivSpanOne, nestedDivSpanTwo);
            if (nestedDivSpanOne) {
                const content = nestedDivSpanOne.textContent;
                if (regexPattern.test(content)) {
                    const decimalOdds = parseFloat(content);
                    const americanOdds = convertOdds(decimalOdds);
                    // console.log("[TAMPERMONKEY] Converting Odds: ", decimalOdds, americanOdds);
                    nestedDivSpanOne.textContent = americanOdds;
                }
            }

            if (nestedDivSpanTwo) {
                const content = nestedDivSpanTwo.textContent;
                if (regexPattern.test(content)) {
                    const decimalOdds = parseFloat(content);
                    const americanOdds = convertOdds(decimalOdds);
                    // console.log("[TAMPERMONKEY] Converting Odds: ", decimalOdds, americanOdds);
                    nestedDivSpanTwo.textContent = americanOdds;
                }
            }

            const content = cellRow.textContent;
            if (regexPattern.test(content)) {
                const decimalOdds = parseFloat(content);
                const americanOdds = convertOdds(decimalOdds);
                // console.log("[TAMPERMONKEY] Converting Odds: ", decimalOdds, americanOdds);
                cellRow.textContent = americanOdds;
            }
        });
    }

    // Observe changes to the target elements
    //const targetSelector = 'div.cell-row-even-current-or-opener';
    const targetSelector = 'div.ag-cell-value';
    const observer = new MutationObserver(mutationsList => {
        const cellRows = document.querySelectorAll(targetSelector);
        if (cellRows.length > 0) {
            // observer.disconnect(); // Stop observing once elements are found
            processCellRows(cellRows);
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();

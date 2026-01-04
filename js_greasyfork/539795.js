// ==UserScript==
// @name         AlignedIncentiv Profit Filter
// @version      v1.3
// @description  Filter entry by profit percentage
// @author       You
// @match        https://portal.alignedincentiv.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alignedincentiv.es
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/864548
// @downloadURL https://update.greasyfork.org/scripts/539795/AlignedIncentiv%20Profit%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/539795/AlignedIncentiv%20Profit%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    var floatingButton = document.createElement('button');
    floatingButton.innerText = 'FilterProfit';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '1000';

    // Append the button to the body
    document.body.appendChild(floatingButton);

    // Function to simulate the click on the actual publish button
    floatingButton.addEventListener('click', function() {
        main()
    });
})();

function main() {
    'use strict';
    // Your code here...
    const elements = document.querySelectorAll('.profit-column')
    for (const el of elements) {
        const text = el.textContent;
        const match = text.match(/^(-?\d+(\.\d+)?)%$/); // allows negative numbers

        if (match) {
            const profit = parseFloat(match[1]);
            // Remove element if profit lower than choice
            if (profit <= -2) {
                const row = el.closest('tr');
                if (row) {
                    row.remove();
                }
            }
        }
    }

    const rmbulletelements = document.querySelectorAll('tr.spacer-row')
    for (const rmel of rmbulletelements) {
        const profitCell = rmel.querySelector('.profit-column');
        if (!profitCell) {
            rmel.remove();
        }
    }

    const rmelements = document.querySelectorAll('tr.expandable')
    for (const rmel of rmelements) {
        const profitCell = rmel.querySelector('.profit-column');
        if (!profitCell) {
            rmel.remove();
        }
    }
}

GM_registerMenuCommand('Run this now', function() {
    main()
}, 'r'); 

// ==UserScript==
// @name         Dexscreener Hide Rows in Screener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When in Dexscreener and you have are browsing coins that match your favorite set of filters, isn't it annoying to see the same coins you have deemed of no value? Use this extension to hide those away.
// @match        https://dexscreener.com/*
// @grant        none
// @author       @pseudo_echoo
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525129/Dexscreener%20Hide%20Rows%20in%20Screener.user.js
// @updateURL https://update.greasyfork.org/scripts/525129/Dexscreener%20Hide%20Rows%20in%20Screener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addXButtons() {
        const rows = document.querySelectorAll('.ds-dex-table-row.ds-dex-table-row-top');
        rows.forEach((row) => {
            if (!row.querySelector('.hide-row-button')) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.alignItems = 'center';
                buttonContainer.style.marginRight = '10px';
                buttonContainer.style.position = 'relative';
                buttonContainer.style.zIndex = '9999';

                const button = document.createElement('button');
                button.textContent = 'X';
                button.className = 'hide-row-button';
                button.style.cursor = 'pointer';
                button.style.padding = '2px 6px';
                button.style.backgroundColor = '#ff4444';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '3px';
                button.style.position = 'relative';
                button.style.zIndex = '9999';

                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    row.style.display = 'none';
                    const href = row.getAttribute('href');
                    localStorage.setItem(`hiddenRow_${href}`, 'true');
                };

                buttonContainer.appendChild(button);
                const firstCell = row.querySelector('div');
                if (firstCell) {
                    firstCell.style.display = 'flex';
                    firstCell.style.alignItems = 'center';
                    firstCell.insertBefore(buttonContainer, firstCell.firstChild);
                }
            }

            const href = row.getAttribute('href');
            if (localStorage.getItem(`hiddenRow_${href}`) === 'true') {
                row.style.display = 'none';
            }
        });
    }

    // Run the function initially
    setTimeout(addXButtons, 1000);

    // Use a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        setTimeout(addXButtons, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         DotDB PLUS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add links and icons to TLDs in DotDB search results
// @author       AtoZDomains@x.com
// @match        https://dotdb.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531954/DotDB%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/531954/DotDB%20PLUS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLinksAndIconsToTLDs() {
        const tableBody = document.querySelector('#result-table tbody');
        if (!tableBody) {
            return;
        }

        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const keywordCell = row.querySelectorAll('td')[0]; // Get keyword column (first td)
            if (!keywordCell) {
                return;
            }
            let sld = keywordCell.textContent.trim();

            const tldCell = row.querySelectorAll('td')[3];
            if (!tldCell) {
                return;
            }

            const tldDiv = tldCell.querySelector('.collapse-content .tw-w-\\[90\\%\\]');
            if (!tldDiv) {
                return;
            }

            let tldText = tldDiv.textContent.trim();
            if (!tldText) {
                return;
            }

            const tlds = tldText.split(',').map(tld => tld.trim());

            let newHTML = '';
            tlds.forEach(tld => {
                const domain = `${sld}${tld}`;
                const link = `https://${domain}`;
                const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;

                const tldLinkHTML = `
                    <a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; margin-right: 5px;">
                        <img src="${iconUrl}" style="width: 16px; height: 16px; margin-right: 3px; vertical-align: middle;">
                        ${tld}
                    </a>`;
                newHTML += tldLinkHTML;
            });

            tldDiv.innerHTML = newHTML;
        });
    }

    window.addEventListener('load', addLinksAndIconsToTLDs);

})();
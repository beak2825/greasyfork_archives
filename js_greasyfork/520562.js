// ==UserScript==
// @name         Bay Area Chess Number Linkifier with Rating Extraction
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Convert 8-digit numbers in <td> elements to links and extract USCF rating on bayareachess.com
// @author       Your Name
// @match        *://bayareachess.com/*
// @grant        none
// @license MIT
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/520562/Bay%20Area%20Chess%20Number%20Linkifier%20with%20Rating%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/520562/Bay%20Area%20Chess%20Number%20Linkifier%20with%20Rating%20Extraction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchUSCFRating(number) {
        const url = `http://localhost:3000/msa/MbrDtlMain.php?${number}`;
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const tables = doc.querySelectorAll('table');
            let rating = 'No rating found';

            for (const table of tables) {
                const rows = table.querySelectorAll('tr');
                for (const row of rows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 1) {
                        const label = cells[0].textContent.trim();
                        if (label === 'Regular Rating') {
                            rating = cells[1].textContent.trim();
                            break;
                        }
                    }
                }
                if (rating !== 'No rating found') break;
            }

            return rating;
        } catch (error) {
            console.error('Failed to fetch USCF rating:', error);
            return 'Error fetching rating';
        }
    }

    async function convertNumbersToLinks() {
        const tds = document.querySelectorAll('td');
        for (const td of tds) {
            const text = td.textContent.trim();
            const numberRegex = /\b\d{8}\b/;
            if (numberRegex.test(text)) {
                const number = text.match(numberRegex)[0];
                const link = `https://www.uschess.org/msa/MbrDtlMain.php?${number}`;
                const rating = await fetchUSCFRating(number);

                td.innerHTML = `<a href="${link}" target="_blank">${number}</a> (Rating: ${rating})`;
            }
        }
    }

    convertNumbersToLinks();
})();

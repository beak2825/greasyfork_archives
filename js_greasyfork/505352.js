// ==UserScript==
// @name         Junction copy table data
// @namespace    http://tampermonkey.net/
// @version      2024-08-27
// @description  copy table data on junction
// @author       LL-Floyd
// @match        https://junction.welocalize.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=welocalize.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505352/Junction%20copy%20table%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/505352/Junction%20copy%20table%20data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract table data
    function extractTableData() {
        const table = document.querySelector('.stat-box.padded.cat-breakdown-wrapper table');
        if (!table) return 'Table not found';

        let data = '';
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowData = Array.from(cells).map(cell => cell.textContent.trim()).join('\t');
            data += rowData + '\n';
        });

        return data;
    }

    // Create a button to trigger copying
    const button = document.createElement('button');
    button.textContent = 'Copy Table Data';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '100px';
    button.style.zIndex = '9999';

    // Add click event to copy data
    button.addEventListener('click', () => {
        const tableData = extractTableData();
        GM_setClipboard(tableData, 'text');
        alert('Table data copied to clipboard!');
    });

    // Add button to the page
    document.body.appendChild(button);
})();
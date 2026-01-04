// ==UserScript==
// @name         Disable haoetf Column
// @namespace    https://haoetf.com/
// @version      1.1
// @description  Disable specific column in the table
// @match        https://www.haoetf.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461741/Disable%20haoetf%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/461741/Disable%20haoetf%20Column.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the index of the column to check for the value (starting at 0 for the first column)
    const columnToCheck = 1;

    // Specify an array of values to match in the specified column
    //const valuesToMatch = [164824];
    const valuesToMatch = ["名称","印度基金", "华宝油气", "广发石油","国泰商品","美国消费","中国互联","南方原油","美国REIT","嘉实黄金"];
    setTimeout(function() {
        // Find all the tables in the page
        const tables = document.getElementsByTagName('table');

        // Loop through each table
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];

            // Loop through the rows in the table
            for (let j = 0; j < table.rows.length; j++) {
                const row = table.rows[j];

                // Check the value in the specified column
                const cell = row.cells[columnToCheck];
                if (cell && valuesToMatch.includes(cell.innerText.trim())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    },500);
})();
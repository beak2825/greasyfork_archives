// ==UserScript==
// @name         集思录QDII
// @namespace    https://www.jisilu.cn/
// @version      1.1
// @description  Disable specific column in the table
// @match        https://www.jisilu.cn/data/qdii/*
// @exclude       https://www.jisilu.cn/data/qdii/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461742/%E9%9B%86%E6%80%9D%E5%BD%95QDII.user.js
// @updateURL https://update.greasyfork.org/scripts/461742/%E9%9B%86%E6%80%9D%E5%BD%95QDII.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the index of the column to check for the value (starting at 0 for the first column)
    const columnToCheck = 0

    // Specify an array of values to match in the specified column
    const valuesToMatch = ["刷新","代码","164824","162415","164906","162411","162719","160216","501018","160719"];
    //const valuesToMatch = ["刷新","名称","印度基金", "华宝油气", "广发石油","国泰商品","美国消费","中国互联","南方原油"];
    setTimeout(function() {
        // Get all table rows
        const rows = document.querySelectorAll("table tr");

        // Loop through each row and check if it contains any of the values to match
        rows.forEach(row => {
            let rowContainsValue = false;
            valuesToMatch.forEach(value => {
                if (row.textContent.includes(value)) {
                    rowContainsValue = true;
                }
            });
            if (rowContainsValue) {
                row.style.display = "table-row"; // Display the row
            } else {
                row.style.display = "none"; // Hide the row
            }
        });
    },500);
})();
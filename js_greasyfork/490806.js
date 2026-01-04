// ==UserScript==
// @name        Transmission Web Export to Excel
// @namespace   Violentmonkey Scripts
// @match        http://your-transmission-web-url/*   // 替换成你的 Transmission Web URL
// @grant       none
// @version     1.1
// @author      -
// @description 2024/3/25 11:07:10
// @downloadURL https://update.greasyfork.org/scripts/490806/Transmission%20Web%20Export%20to%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/490806/Transmission%20Web%20Export%20to%20Excel.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var script = document.createElement('script');
    script.onload = function() {
        // 一旦 XLSX 库加载完成，执行主要逻辑
        main();
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js'; // CDN地址
    document.head.appendChild(script);
    // Function to parse data and export to Excel
   function main() {
    function exportToExcel() {
        // Array to store data
        var data = [];

        // Selecting all rows in the table
       var rows = document.querySelectorAll('tbody tr[id^="datagrid-row-r3-2-"]');


        // Loop through each row
        rows.forEach(function(row) {
            // Object to store data for each row
            var rowData = {};
            // Getting data from each cell in the row
            rowData.name = row.querySelector('.datagrid-cell-c3-name').textContent.trim();
            rowData.totalSize = row.querySelector('.datagrid-cell-c3-totalSize').textContent.trim();
            rowData.percentDone = row.querySelector('.datagrid-cell-c3-percentDone .torrent-progress-text').textContent.trim();
            rowData.uploadRatio = row.querySelector('.datagrid-cell-c3-uploadRatio').textContent.trim();
            rowData.status = row.querySelector('.datagrid-cell-c3-status').textContent.trim();

            // Adding row data to the array
            data.push(rowData);
        });

        // Creating a new Excel file
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(data);

        // Adding worksheet to the Excel file
        XLSX.utils.book_append_sheet(wb, ws, 'Transmission Data');

        // Saving Excel file
        XLSX.writeFile(wb, 'transmission_data.xlsx');
    }

    // Adding a button to the page to trigger export
    var button = document.createElement('button');
    button.textContent = '导出Excel';
    button.style.marginBottom = '10px';
    button.addEventListener('click', exportToExcel);

    // Getting reference to the "添加种子" button
    var addButton = document.getElementById('toolbar_add_torrents');

    // Inserting the export button before the "添加种子" button
    addButton.parentNode.insertBefore(button, addButton);
}
})();

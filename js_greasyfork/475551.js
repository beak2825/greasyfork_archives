// ==UserScript==
// @name         Save Proxy Data to Excel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save proxy check results to Excel
// @author       LEGADRO
// @license      MIT
// @match        https://checkerproxy.net/report/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/475551/Save%20Proxy%20Data%20to%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/475551/Save%20Proxy%20Data%20to%20Excel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the SAVE-TO-EXCELL button
    let button = document.createElement('button');
    button.innerText = 'SAVE-TO-EXCELL';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.fontWeight = 'bold';
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        // Extract proxy check results
        let data = [];
        let rows = document.querySelectorAll('table tr'); // Assuming the data is in a table. Adjust the selector if needed.
        rows.forEach(row => {
            let rowData = [];
            let cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.innerText.trim());
            });
            if (rowData.length) data.push(rowData);
        });

        // Convert data to Excel format
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ProxyData");

        // Save to Excel file
        let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
        let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
        let blobURL = window.URL.createObjectURL(blob);

        // Trigger download
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobURL;
        a.download = 'proxy_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

})();

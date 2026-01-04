// ==UserScript==
// @name         Wikipedia Table to CSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract tables from Wikipedia and save as CSV
// @author       Yofardev
// @match        *://*.wikipedia.org/wiki/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476326/Wikipedia%20Table%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/476326/Wikipedia%20Table%20to%20CSV.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    // Get all tables
    let tables = document.getElementsByTagName('table');

    // Get the current Wikipedia page title
    let pageTitle = document.getElementById('firstHeading').innerText.replace(/ /g, '_');

    // Iterate over tables
    for (let table of tables) {
        // Create download button
        let button = document.createElement('button');
        button.innerText = 'Download as CSV';
        button.onclick = function () {
            let csv = '';

            // Get the table title
            let tableTitle = 'table';
            let prevNode = table.previousElementSibling;
            while (prevNode) {
                if (prevNode.nodeName.toLowerCase() === 'h3') {
                    tableTitle = prevNode.querySelector('.mw-headline').innerText.replace(/ /g, '_');
                    break;
                }
                prevNode = prevNode.previousElementSibling;
            }

            // Iterate over rows
            for (let row of table.rows) {
                let cells = Array.from(row.cells);
                csv += cells.map(cell => {
                    // Check if cell contains an image
                    let img = cell.querySelector('img');
                    if (img) {
                        // If so, return the image URL
                        return '"' + img.src.replace(/"/g, '""') + '"';
                    } else {
                        // Otherwise, return the cell text
                        return '"' + cell.innerText.replace(/"/g, '""') + '"';
                    }
                }).join(',') + '\n';
            }

            // Download the data
            download(csv, tableTitle + ' - ' + pageTitle + '.csv', 'text/csv');
        };

        // Add download button to the page
        table.parentNode.insertBefore(button, table);
    }
})();
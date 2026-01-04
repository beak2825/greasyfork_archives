// ==UserScript==
// @name         Data Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download table data as CSV
// @author       Ahmed
// @match        https://cherdak.console3.com/global/review/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494128/Data%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/494128/Data%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the Download as CSV button
    var downloadButton = document.createElement("button");
    downloadButton.textContent = "Download as CSV";
    styleButton(downloadButton);
    downloadButton.onclick = downloadCSV;

    // Create the Copy Data button
    var copyButton = document.createElement("button");
    copyButton.textContent = "Copy Data";
    styleButton(copyButton);
    copyButton.onclick = copyData;

    // Set up button styles and positioning
    function styleButton(button) {
        button.style.position = "fixed";
        button.style.top = "50px"; // Lowered down from the top
        button.style.right = "20px"; // Right alignment
        button.style.zIndex = "10000";
        button.style.background = "#007BFF"; // Bright blue background
        button.style.color = "white"; // White text
        button.style.border = "none"; // No border
        button.style.padding = "10px 20px"; // Padding around the text
        button.style.borderRadius = "5px"; // Rounded corners
        button.style.cursor = "pointer"; // Pointer cursor on hover
        button.style.marginBottom = "10px"; // Space between buttons
    }

    // Append buttons to the body element
    document.body.appendChild(downloadButton);
    document.body.appendChild(copyButton);

  
    downloadButton.style.marginRight = "5px";

    function downloadCSV() {
        var csv = generateCSV(true); // Generate CSV formatted string
        var csvFile = new Blob([csv], {type: 'text/csv'});
        var downloadLink = document.createElement("a");
        downloadLink.download = "data.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function copyData() {
        var tsv = generateCSV(false); // Generate TSV formatted string for copying
        navigator.clipboard.writeText(tsv).then(function() {
            alert('Data copied to clipboard!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    function generateCSV(isCSV) {
        var delimiter = isCSV ? ',' : '\t'; // Use comma for CSV and tab for TSV
        var headers = Array.from(document.querySelectorAll('th[role="columnheader"]'));
        var formattedData = [headers.map(header => '"' + header.textContent.trim().split('\n')[0] + '"').join(delimiter)];

        var authorIndex = headers.findIndex(header => header.textContent.trim().includes('author'));
        var targetIndex = headers.findIndex(header => header.textContent.trim().includes('target')); // Find the index of the "target" column

        var rows = document.querySelectorAll('tr[data-testid="TableRow"]');
        rows.forEach(function(row) {
            var cells = Array.from(row.querySelectorAll('td[data-testid="TableCell"]')).map((cell, index) => {
                if ((index === authorIndex || index === targetIndex) && cell.textContent.trim() !== '') {
                    return '"' + cell.textContent.trim() + ',"'; // Append a comma if it's the author or target column
                }
                return '"' + cell.textContent.trim() + '"';
            });
            formattedData.push(cells.join(delimiter));
        });

        return formattedData.join('\n');
    }
})();
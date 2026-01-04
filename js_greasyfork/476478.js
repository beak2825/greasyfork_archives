// ==UserScript==
// @name        Óbuda Menza KSZKI oldalról kinyomtatja a kiválasztott menüt
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Export data from a table with class "table order" to a CSV file
// @author       Sütő László
// @match        https://kszki.eny.hu/index.php*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476478/%C3%93buda%20Menza%20KSZKI%20oldalr%C3%B3l%20kinyomtatja%20a%20kiv%C3%A1lasztott%20men%C3%BCt.user.js
// @updateURL https://update.greasyfork.org/scripts/476478/%C3%93buda%20Menza%20KSZKI%20oldalr%C3%B3l%20kinyomtatja%20a%20kiv%C3%A1lasztott%20men%C3%BCt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to convert a 2D array to a CSV string
    function arrayToCSV(arr) {
        return arr.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

        // Function to convert a 2D array to an HTML table
    function arrayToTable(arr) {
        const table = document.createElement('table');
        arr.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        return table;
    }


    $('#menu ul:first').append('<li id="CP"><a href="#/order">Menü nyomtatása</a></li>');

$('#CP').click(function(){
 downloadCSV();
});


function downloadCSV() {
    // Find the table with class "table order"
    const table = document.querySelector('table.table.order tbody');

    if (table) {
        // Initialize an empty 2D array to store the table data
        const data = [];

        // Loop through table rows
        table.querySelectorAll('tr:has(th)').forEach(row => {
            const rowData = [];
            // Loop through table cells in the current row

            var header = row.querySelector('th');
            if(row.textContent.includes("ebéd")) {
                rowData.push(header.textContent.replace(/Pais.*ebéd/g,"").replace(/\n/g,"").trim());

                if(header) {
                    var menuRows = [row, row.nextElementSibling]; // A menu es B menu row
                    menuRows.forEach(menuRow => {
//                        console.log($(menuRow).find("span:contains(1 adag)").size());
                        if($(menuRow).find("span:contains(1 adag)").size() > 0) {
                            //console.log(menuRow);
                            // megvan a választott menu row (TR)
                            let cell = menuRow.querySelectorAll('td')[0];
                            rowData.push(cell.textContent.replace(/Pais.*lakcím/g,"").replace(/\n/g,"").trim());

                        }
                    });

                    }

                    data.push(rowData);
                }

        });

        let nev = $('#sidebar li.active').text();
//                    console.log(nev);

        // Convert data array to an HTML table
        const htmlTable = arrayToTable(data);

        // Create a new window for printing
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Havi menü</title></head><body>');
        printWindow.document.write('<style>td, th { border-top: 1px solid #ddd; }</style>'); // Add this line for cell border in print
        printWindow.document.write('<h1>' + nev + '</h1>');
        printWindow.document.write(htmlTable.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Trigger the print dialog
        printWindow.print();
        printWindow.close();
    } else {
        console.log('Table with class "table order" not found.');
    }

/*     // CSV solution

        // Convert data array to CSV string
        const csvContent = arrayToCSV(data);

        // Create a Blob with the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link for the Blob
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'table_data.csv';
        a.style.display = 'none';
        document.body.appendChild(a);

        // Trigger a click event on the link to start the download
        a.click();

        // Clean up by removing the link
        document.body.removeChild(a);
    } else {
        console.log('Table with class "table order" not found.');
    } */
}
})();

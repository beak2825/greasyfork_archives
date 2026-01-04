// ==UserScript==
// @name         Download CSV
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Export csv file from the table tag.
// @author       Mr Dark
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481472/Download%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/481472/Download%20CSV.meta.js
// ==/UserScript==

(function() {
    const buttonText = 'Download CSV';
    const buttonType = 'button';


    const separator = ",";

    function download_table_as_csv(event) {
        const table = $(this).next("table")

        if (!table) {
            throw new Error('Click event not triggered on a table element');
        }
        var table_id = table.id || "NoName";

        // ... your existing code ...

        // Use the `table` variable for selector and other operations

        let csv = "";
        table.find('tr').each(function() {
            const cells = $(this).find('td, th');
            const data = [];

            // Extract and format data from each cell
            cells.each(function() {
                let cellData = $(this).text().trim().replace(/(\r\n|\n|\r)/gm, "").replace(/(\s\s)/gm, " ");
                cellData = cellData.replace(/"/g, `""`);
                data.push(`"${cellData}"`);
            });

            csv += data.join(",") + "\n";
        });


        // Download it
        var filename = "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
        var link = document.createElement("a");
        link.style.display = "none";
        link.setAttribute("target", "_blank");
        link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
 setTimeout(function(){
    const tables = document.querySelectorAll('table');
    for (const table of tables) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.type = buttonType;

        // Add styles to the button
        button.style.backgroundColor = 'green';
        button.style.color = 'white';

        // Add click event listener to the button
        button.addEventListener('click', download_table_as_csv);
        table.parentNode.insertBefore(button, table);
    }
},3000);
})();
// ==UserScript==
// @name         Place Browser Table Export
// @namespace    http://junyianl.net/
// @version      2019.10.05.01
// @description  Exports WME Place Browser's table output to CSV and download to local disk
// @author       junyianl
// @match        https://w-tools.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390760/Place%20Browser%20Table%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/390760/Place%20Browser%20Table%20Export.meta.js
// ==/UserScript==

/*
Changelogs:
2019.10.05.01
- Enhancement: Change pipe separator for validation rules to newline
2019.10.04.04
- Bugfix: Change separator for headers.
2019.10.04.03
- Bugfix: Separators were not changed.
2019.10.04.02
- Changed PL column to actual permalink.
- Using tab separator instead of comma, for easier copy-and-pasting into Google spreadsheet.
*/

(function() {
    'use strict';

    // Your code here...

    const validations = [
        "Missing Name", // High
        "Area not Point", // Medium
        "Point not Area",
        "Incorrect Primary Category",
        "Missing Street",
        "Invalid HN",
        "Not Updated Since Created", // Low
        "IGN Editor",
        "Phone Number Format",
        "Area Very Small",
        "Lower Case Name",
        "Lock Level (Completeness)", // Info
        "Parent Category",
        "Missing Google Place Link",
        "Last Edit By Automated Process", // Undocumented
        "Missing Google Place Link (6 Month Timer Active)",
        "Possible Nearby Duplicate"
    ];

    const tableSeparator = "\t";

    function downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], {type: "text/csv"});

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
//         downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    }

    function exportTableToCSV(filename) {
        var csv = [];
        var table = document.querySelectorAll("table.tablesorter");

        // Populate column headers
        var row = [], cols = table[0].querySelectorAll("th");
        for (var i = 0; i < cols.length; i++) {
            row.push('"' + cols[i].innerText + '"');
        }
        csv.push(row.join(tableSeparator));

        // Populate places
        var places = table[0].querySelectorAll("[class*=validate]");
        for (var j = 0; j < places.length; j++) {
            var placerow = [], placecol = places[j].querySelectorAll("td");
            for (var k = 0; k < placecol.length; k++) {
                switch (k) {
                    case 0:
                        var pl = placecol[k].querySelector("a");
                        placerow.push('"' + pl.href + '"');
                        break;
                    case 2:
                        var issue = [], issues = placecol[k].querySelectorAll("li");
                        for (var l = 0; l < issues.length; l++) {
                            issue.push(issues[l].innerText);
                        }
                        placerow.push('"' + issue.join("\n") + '"');
                        break;
                    default:
                        placerow.push('"' + placecol[k].innerText.trim() + '"');
                }
            }
            csv.push(placerow.join(tableSeparator));
        }

        // Download CSV file
        downloadCSV(csv.join("\r\n"), filename);
    }

    var group = document.querySelector('[id=MainContent_ddlAreaGroup]').selectedOptions[0].value;
    var area = document.querySelector('[id=MainContent_DropDownList1]').selectedOptions[0].innerText;
    var date = new Date();
    exportTableToCSV(group + '_' + area + '_' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '.csv');

})();
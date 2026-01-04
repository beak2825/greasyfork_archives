// ==UserScript==
// @name         Chain Report Exporter
// @namespace    https://www.torn.com
// @version      1.0
// @description  Download Chain Report as CSV
// @author       lonerider543
// @match        https://www.torn.com/war.php?step=chainreport*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425583/Chain%20Report%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/425583/Chain%20Report%20Exporter.meta.js
// ==/UserScript==

const wait = ms => new Promise((r, j) => setTimeout(r, ms))

async function waitForDOM(targetNode, callback) {
    while (true) {
        if ($(targetNode).length > 0) {
            callback();
            break;
        }
        await wait(50);
    }
}

function arrayToCSV(array) {
    let csvContent = "data:text/csv;charset=utf-8,";

    array.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    return csvContent;
}

function downloadCSV(csvContent) {
    var encodedUri = encodeURI(csvContent);
    // window.open(encodedUri);
    return encodedUri;
}

function addDownloadLink(encodedUri) {
    $("div.report-members-stats").parent().prepend(`<a download="chain_report.csv" href="${encodedUri}">Download as CSV</a>`);
}

function main() {
    let output = [];

    let headerNames = [];
    let headers = $("ul.report-stats-titles").children();
    headers.each(function() {
        let name = $(this)[0].innerText;
        headerNames.push(name);
    });

    output.push(headerNames);

    let memberNames = $("ul.members-names-rows").children();
    let memberStats = $("ul.members-stats-rows").children();
    let memberCount = 0;
    memberNames.each(function() {
        let nameRow = [];

        let name = $(this).find('a[class*="name"] > img').attr("alt");
        nameRow.push(name);

        let stats = $(memberStats[memberCount]).find("ul.members-stats-cols").children();
        stats.each(function() {
            let stat = $(this)[0].innerText;
            nameRow.push(stat);
        });

        output.push(nameRow);
        memberCount++;
    });

    let csvContent = arrayToCSV(output);
    let encodedUri = downloadCSV(csvContent);
    addDownloadLink(encodedUri);
}

waitForDOM("div.report-members-stats", main);
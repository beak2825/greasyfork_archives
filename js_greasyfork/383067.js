// ==UserScript==
// @name         SymLite users report
// @version      0.3
// @description  Adds button 'Download csv' on Users page in the SymLite app and enables to download a users report in the csv format.
// @author       You
// @match        https://symlite.moravia.com/User*
// @run-at       document-end
// @namespace https://greasyfork.org/users/302007
// @downloadURL https://update.greasyfork.org/scripts/383067/SymLite%20users%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/383067/SymLite%20users%20report.meta.js
// ==/UserScript==

var buttonPanel = document.getElementsByClassName("form-inline")[0];
var searchButton = buttonPanel.querySelector('button[id="search-users"]').parentElement;
var downloadButton = '<div class="form-group" style="margin-left: 4px;"><button type="button" class="btn btn-success btn-sm pull-right" id="download-csv-report">Download csv</button></div>';
$(downloadButton).insertAfter($(searchButton));
downloadButton = document.querySelector("#download-csv-report");
downloadButton.addEventListener('click', downloadCsv, false);

function getCsvContent() {
    var content = "";
    var table = $('#listOfUsers')[0];
    if(!table) {
        console.log("[SymLite users report] There aren't any data.");
        return false;
    }
    var headers = table.querySelector('thead');
    var firstRow = headers.querySelector('tr');
    var firstCells = firstRow.querySelectorAll('th');
    for (var i = 2; i < firstCells.length; i++) {
        var firstCell = firstCells[i];
        var firstCellText = firstCell.textContent;
        if (!firstCellText && i < (firstCells.length - 1)) firstCellText = ",";
        else if(firstCellText && i < (firstCells.length - 1)) firstCellText = firstCellText.replace(/\n/g,"").replace(/\s+/g," ").trim() + ",";
        else firstCellText = firstCellText.replace(/\n/g,"").trim();
        content += firstCellText;
    }
    content += "\n";
    var tableBody = table.querySelector('tbody');
    var rows = tableBody.querySelectorAll('tr');
    for (var j = 0; j < rows.length; j++) {
        var row = rows[j];
        var cells = row.querySelectorAll('td');
        for (var k = 2; k < cells.length; k++) {
            var cell = cells[k];
            var cellText = cell.textContent.toString();
            if(!cellText && k < (cells.length - 1)) cellText = ",";
            else if(cellText && k < (cells.length - 1)) cellText = cellText.replace(/\n/g,"").replace(/\s+/g," ").trim() + ",";
            else cellText = cellText.replace(/\n/g,"").trim();
            content+= cellText;
        }
        if(j < (rows.length - 1)) content += "\n";
    }
    return content;
}

function downloadCsv() {
    var content = getCsvContent();
    content = content;
    var filename = "Users" + ".csv";
    if(!content) return false;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function encodeXml(string) {
  string = string.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');
  return string;
}
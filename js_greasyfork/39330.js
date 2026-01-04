// ==UserScript==
// @name         UA Mean
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Compute marks mean
// @author       Tisila
// @match        https://paco.ua.pt/secvirtual/c_planocurr.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39330/UA%20Mean.user.js
// @updateURL https://update.greasyfork.org/scripts/39330/UA%20Mean.meta.js
// ==/UserScript==

var tables = document.getElementsByTagName("table");
var marksTable = tables[37];
var overallTable = tables[43];
var data = loadMarks(marksTable);
var average = mean(data[0], data[1]);
refresh(average);

function loadMarks(table) {
    var loadedTable = [];
    var marks = [];
    var ects = [];
    var rows = table.rows;
    for (row = 1; row < 41; row++) {
        var ect = rows[row].cells[6].innerHTML;
        var mark = rows[row].cells[7].innerHTML;
        if (mark.length > 3) {
            ects.push(parseInt(ect));
            marks.push(parseInt(mark));
        }
    }
    loadedTable.push(ects);
    loadedTable.push(marks);
    return loadedTable;
}

function mean(ects, marks) {
    var markSum = 0;
    var ectSum = 0;
    for (i = 0; i <= marks.length - 1; i++) {
        markSum += ects[i] * marks[i];
        ectSum += ects[i];
    }
    var totalMean = markSum / ectSum;
    return round(totalMean,2);
}

function refresh(mean) {
    var rows = overallTable.rows;
    var row = overallTable.insertRow(rows.length);
    row.className = 'table_cell_impar';
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.align = 'left';
    cell2.align = 'right';
    cell1.innerHTML = "Média ponderada do plano curricular";
    cell2.innerHTML = mean;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
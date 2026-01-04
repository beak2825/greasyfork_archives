// ==UserScript==
// @name         TornStats competition export
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Jox [1714547]
// @match        https://www.tornstats.com/factions.php?hq&action=competitions&step=view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370290/TornStats%20competition%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/370290/TornStats%20competition%20export.meta.js
// ==/UserScript==

addButton();

function addButton(){
    var competitionResults = document.getElementById('competitionResults');

    var parentDiv = document.getElementById("competitionResults").parentNode;

    var div = document.createElement('div');
    div.classList.add('col-md-2');
    var btn = document.createElement('button');
    btn.classList.add('btn','btn-default');
    btn.id = 'exportToCSV';
    btn.innerHTML = 'Export to CSV by Jox [1714547]';
    btn.onclick = ResultsToCSV;
    div.appendChild(btn);

    parentDiv.insertBefore(btn, competitionResults);
}

function ResultsToCSV(){

    var table = document.getElementById('members');

    var theadIndex = -1;
    var tbodyIndex = -1;

    for(var child in table.childNodes){
        if(table.childNodes[child].tagName == 'THEAD'){
            theadIndex = child;
        }

        if(table.childNodes[child].tagName == 'TBODY'){
            tbodyIndex = child;
        }
    }

    var exportTable = [];

    var headerCols = table.childNodes[theadIndex].getElementsByClassName('tablesorter-headerRow')[0];

    var headerRow = [];

    for(var i = 0; i < headerCols.childNodes.length; i++){

        var text = headerCols.childNodes[i].childNodes[0].childNodes[0].childNodes[0].nodeValue.toString();
        headerRow.push(text.trim());
        if(text.trim().includes("Ending")){
            headerRow.push(text.trim().replace("Ending", "Difference"));
        }
    }

    //exportTable.push(headerRow);

    var tableRows = table.childNodes[tbodyIndex].childNodes;

    for(var i = 0; i < tableRows.length; i++){

        var row = {};
        var colIndex = 0;

        for(var j = 0; j < tableRows[i].childNodes.length; j++){
            //console.log(tableRows[i].childNodes[j].innerHTML);
            var text = tableRows[i].childNodes[j].innerHTML;
            if(text.trim().includes('(')){
                //if i am here that menas that i am at ending column
                text = text.trim().replace('<span style="color: #109619">','').replace('</span>','').replace('+','').replace(',','');

                var ending = text.substr(text.indexOf('('),text.length-1).replace('(','').replace(')','').trim();
                var difference = text.substr(0,text.indexOf('(')).trim();

                //console.log(text, ending, difference);
                row[headerRow[colIndex]] = ending;
                colIndex++;
                row[headerRow[colIndex]] = difference;
                colIndex++;
            }
            else{
                row[headerRow[colIndex]] = text.replace(',','').trim();
                colIndex++;
            }
        }

        exportTable.push(row);
    }

    //console.log(headerCols.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeValue);
    exportToCSVFile(exportTable);
}

function exportToCSVFile(arrayToExport) {
    let dataStr = "";


    for(var i=0; i<arrayToExport.length; i++){

        if(i == 0){
            var j = 0;
            for(var dataheader in arrayToExport[i]){
                dataStr += (j==0 ? "" : ",") + dataheader;
                j++;
            }
            dataStr += "\n";
        }

        var x = 0;
        for(var data in arrayToExport[i]){
            dataStr += (x == 0 ? "" : ",") + (typeof arrayToExport[i][data] === 'string' ? "\"" : "") + arrayToExport[i][data] + (typeof arrayToExport[i][data] === 'string' ? "\"" : "");
            x++;
        }
        dataStr += "\n";

    }

    let dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
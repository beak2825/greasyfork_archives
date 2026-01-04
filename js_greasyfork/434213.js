// ==UserScript==
// @name         alliance rankings db export
// @namespace    http://tampermonkey.net/
// @version      1.25.1
// @description  adds button to export alliances rankings to db
// @author       Yan Koe
// @match        https://w25.crownofthegods.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/434213/alliance%20rankings%20db%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/434213/alliance%20rankings%20db%20export.meta.js
// ==/UserScript==

var world = "W25";
var todburl = "https://w23.yknet.com.br/monitor/_getcharts";
// var todburl = "http://127.0.0.1:5000/monitor/_getcharts";

(function () {
    // modify monitored alliance and continent lists. Alliance order here will be the exported data columns order and continents in rows - modified to export all conts (just use [Enter] and [down arrow] to fill)
    var al_list = ["Full Blown Crazy", "The XMen", "Pitchforkers", "Just For Fun"];
    var cont_list = ["W", "C00", "C01", "C02", "C03", "C04", "C05", "C10", "C11", "C12", "C13", "C14", "C15", "C20", "C21", "C22", "C23", "C24", "C25", "C30", "C31", "C32", "C33", "C34", "C35", "C40", "C41", "C42", "C43", "C44", "C45", "C50", "C51", "C52", "C53", "C54", "C55", "Rep"];
    var tschartsDone=0;
    var tschartProcess = false;
    var charts=[],chart={}
    // prepare interface
    $(document).ready(function() {
        // ranking export button - top menu
        // var chartExportBtn='<button id="chartexportbut" class="tabButton" style="width: 80px;">ChartsDB</button>';
        // $('#items').after(chartExportBtn);
        // add ui button in city panel (below top buttons Counc ON, Refine, Raid, Demo)
        var chartExportBtn = "<button id='chartexportbut' style='margin-left:4px;margin-top:10px;width:60px;font-size:10px !important;' class='regButton greenb'>ChartsDB</button>";
		$("#autodemo2").after(chartExportBtn);

        $('#chartexportbut').click(chexp);
    });
    function chexp () {
        tschartProcess = true;
        tschartsDone=0;
        charts=[];
        alert("Please Go to: \nRankings - Alliance - Alliance Military\nto export TS tracking charts data\n\nData will be saved in database");
    }
    // main
    (function(open) {
        var tsranking;
        var repranking;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.readyState==4) {
                    this.readyState=null;
                    var url=this.responseURL;
                    if (url.indexOf('gR')!=-1) {
                        if (tschartProcess) {
                            if(tschartsDone < cont_list.length) {
                                var data=JSON.parse(this.response);
                                tsranking=data["20"];
                                repranking=data["19"];
                                if(tsranking) {
                                    chart = {};
                                    chart.cont = cont_list[tschartsDone];
                                    console.log("Extracting " + cont_list[tschartsDone] + " TS Ranking");
                                    chart.ats = extract_data(tsranking, al_list);
                                    charts.push(chart);
                                    tschartsDone+=1;
                                    if(tschartsDone >= cont_list.length) {
                                        exportDataToDB(al_list, charts);
                                    } else {
                                        alert("Please select: " + cont_list[tschartsDone]);
                                    }
                                }
                                if(repranking) {
                                    chart = {};
                                    chart.cont = cont_list[tschartsDone];
                                    console.log("Extracting Alliances Rep");
                                    chart.ats = extract_data(repranking, al_list);
                                    charts.push(chart);
                                    tschartsDone+=1;
                                    if(tschartsDone >= cont_list.length) {
                                        exportDataToDB(al_list, charts);
                                    } else {
                                        alert("Please select: " + cont_list[tschartsDone]);
                                    }
                                }
                            }
                        }
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open)
})();

// read ts data from ranking
function extract_data(arrayFromServer, monitorlist){
    var contchart = [];
    for (var i=0;i<monitorlist.length;i++) {
        var pos = arrayFromServer.map(function(e) { return e['2'];}).indexOf(monitorlist[i]);
        if (pos != -1) {
            // console.log(arrayFromServer[pos][3]); // alliance[i] TS
            contchart.push(arrayFromServer[pos][3]);
        } else {
            // console.log("0"); // Alliance[i] not found on continent = 0 TS
            contchart.push(0);
        }
    }
    return contchart;
}

// function exportDataToCsv(filename, al_list, rows) {
//     // generic csv export function
//     // al_list = csv formatted line ending with newline
//     // rows = array with the data to be converted
//     // modify RowToCsvRow to format and return rows as csv lines
//     var RowToCsvRow = function (row) {
//         var csvline = '';
//         csvline += '"'+row.cont+'"';
//         row.ats.forEach(element => {
//             csvline+=',"'+element+'"';
//         });
//         csvline += '\n';
//         return csvline;
//     };

//     // prepare the file converting line by line
//     var csvFile = al_list;
//     for (var i = 0; i < rows.length; i++) {
//         csvFile += RowToCsvRow(rows[i]);
//     }

//     // copy to clipboard for quick use
//     var info = "text/csv;charset=utf-8;";
//     GM_setClipboard(csvFile, info);
//     // also write csv file to disk
//     var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
//     if (navigator.msSaveBlob) { // IE 10+
//         navigator.msSaveBlob(blob, filename);
//     } else {
//         var link = document.createElement("a");
//         if (link.download !== undefined) { // feature detection
//             // Browsers that support HTML5 download attribute
//             var url = URL.createObjectURL(blob);
//             link.setAttribute("href", url);
//             link.setAttribute("download", filename);
//             link.style.visibility = 'hidden';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         }
//     }
// }

function exportDataToDB(al_list, rows) {
    var output = {alliances: al_list, data: rows, world: world}
    $.post(todburl, {send: JSON.stringify(output)})
    .done(function(resp) {
        var r = resp["response"];
        if (r == '404') {alert('Wrong world data')};
        if (r == '400') {alert('Problem with the data')}
        else {alert('OK - data received')}
    })
    .fail(function() {
        var r = resp["response"];
        alert('Data or transfer failure')
    });
};

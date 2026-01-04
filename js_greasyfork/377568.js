// ==UserScript==
// @name         w23-exportworld-alliance
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  export world cities filtered by alliance
// @author       Yan Koe
// @match        https://w23.crownofthegods.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/377568/w23-exportworld-alliance.user.js
// @updateURL https://update.greasyfork.org/scripts/377568/w23-exportworld-alliance.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    'use strict';

    // filter
    var filtered_alliance = "The X Men".toUpperCase();
    console.log("Exporting: " + ennemy);

    // define table
    var yk_buttons = "<table id='tst_tablemenu' style='width:min-content'><tbody><tr>";
    // add buttons as cells
    yk_buttons += "<td style='padding: 10 0'><button id='yk_export' class='regbutton greenb' style='margin-left:2px; width:100px;'>ExportEnnemy</button></td>";
    // finish table
    yk_buttons += "</tr></tbody></table>";
    // place after food warnings
    $("#playerinfta").after(yk_buttons);

    var btnExport = $("#yk_export");
    var worldPlayersNames=[];
    var worldPlayers=[];
    // var worldCities=[];
    var worldCitiesCSV = '"Player","Alliance","Score","x","y","Continent","Castle","Water","Temple","CityName","CityID"\n';

    var RowToCsvRow = function (row) {
        var csvline = '';
        row.forEach(element => {
            csvline+='"'+element+'",';
        });
        csvline = csvline.substring(0,csvline.length-1);
        csvline += '\n';
        return csvline;
    };

    btnExport.on('click', () => {
        console.log("Exporting: " + filtered_alliance);
        $.post( "includes/gR.php", (data) => {
            // console.log(data);
            let tmp = JSON.parse(data)["0"];
            tmp.forEach(player => {
                // player = {1:name, 2:rank, 3:points, 4:alliance, 5:cities, 6:??}
                if (player[4].toUpperCase() == filtered_alliance) {
                    worldPlayersNames.push(player[1]);
                }
            });
            console.log(worldPlayersNames);
            // get cities for each player
            worldPlayersNames.forEach(player => {
                // console.log(player);
                $.post("includes/gPi.php", {a:player}, (data2) => {
                    let tmp2 = JSON.parse(data2);
                    worldPlayers.push(tmp2);
                    tmp2.h.forEach(city => {
                        // worldCities.push([tmp2.player, tmp2.a, city.a, city.b, city.c, city.d, city.e, city.f, city.g, city.h, city.i] );
                        worldCitiesCSV += RowToCsvRow([tmp2.player, tmp2.a, city.a, city.b, city.c, city.d, city.e, city.f, city.g, city.h, city.i]);
                    });
                    // test if last player and export if so (need to keep under post)
                    if (worldPlayers.length == worldPlayersNames.length) {
                        exportData("worldexport.csv", worldCitiesCSV);
                    }
                });
            });
        });
    });
})();

function exportData(filename, csvFile) {
    // copy to clipboard for quick use
    var info = "text/csv;charset=utf-8;";
    GM_setClipboard(csvFile, info);
    // also write csv file to disk
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

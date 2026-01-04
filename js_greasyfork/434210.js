// ==UserScript==
// @name         Donations
// @namespace    http://tampermonkey.net/
// @version      1.25.0
// @description  exports donation list
// @author       Yan Koe
// @match        https://*.crownofthegods.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/434210/Donations.user.js
// @updateURL https://update.greasyfork.org/scripts/434210/Donations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const world = "W25";
    const todburl = "https://w23.yknet.com.br/monitor/_getdonations";
    // const todburl = "http://127.0.0.1:5000/monitor/_getdonations";
    const Url='https://w25.crownofthegods.com/includes/gaDon.php';

    $(document).ready(function () {
        // add ui button in city panel
        var butDonations = "<button id='donations' style='margin-left:8px;margin-top:10px;width:74px;font-size:10px !important;' class='regButton greenb'>Donations</button>";
        // $("#plnammndv").after(butDonations);
        $("#autodemo2").after(butDonations);

        var btnExport = $("#donations");
        btnExport.on('click', () => {
            Donations();
        });
    });

    function Donations() {
            console.log('running Donations');
            $.get(Url)
                .done(function(result) {
                    // console.log(result);
                    var header = '"Rank", "Player", "Alliance", "Donation"';
                    exportToClipboard(header, result);
                    alert("CSV data copied to clipboard. Paste in google sheet using separated columns option");
                    exportDataToDB(result)
                })
                .fail(function(error){
                    console.log(`Error running Donations script: ${error}`);
                    alert("Error running Donations script. Error description logged to your console.");
                });
        };

    function exportToClipboard(header, adata) {
        var exportdata = ConvertToCSV(adata);
        var exporttable = header + '\n' + exportdata;
        var info = "text/csv;charset=utf-8;";
        GM_setClipboard(exporttable, info);
    }
    
    // JSON to CSV Converter
    function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        console.log(str)
        return str;
    };
    function exportDataToDB(data) {
        var output = {data: data, world: world}
        console.log(output);
        $.post(todburl, {send: JSON.stringify(output)})
        .done(function(resp) {
            var r = resp.response;
            console.log(r);
            if (r == '404') {alert('Wrong world data')};
            if (r == '400') {alert('ERROR in data')}
            else {alert('OK - data received')}
        })
        .fail(function() {
            var r = resp.response;
            console.log(r);
            alert('Data or transfer failure')
        });
    };

})()

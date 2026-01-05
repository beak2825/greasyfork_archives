// ==UserScript==
// @name         Export JIRA Timesheet Summary To CSV
// @namespace    undefined
// @version      0.5
// @license      MIT
// @description  Export Timesheet Summary to CSV.
// @author       Allen Zhang
// @match        http://jira.edudyn.com/secure/TempoUserBoard!timesheet.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26256/Export%20JIRA%20Timesheet%20Summary%20To%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/26256/Export%20JIRA%20Timesheet%20Summary%20To%20CSV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = jQuery;

    let worker = $('#tempo-report-header-div > h1').text().trim();
    let date = new Date($('#tempo-timeframe-bar > span').text().trim().split(' - ')[1].slice(0, -1));
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1),
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let period = formatDate(firstDay) + ' - ' + formatDate(lastDay);

    let exportbtn = '<div id="export2xlsBtn" class="add-buttons-container" style="margin-left: 30px;"><a name="tempo-add-button" class="open-dialog tempo-log-work-button aui-button aui-button-primary" href="#">Export to CSV</a></div>';
    $('#stalker > div > div.command-bar > div > div > div.tt-header-items-container.aui-group > div.tt-item-right.aui-item').append(exportbtn);

    $('#export2xlsBtn').on("click", () => {
        let work = [];
        $('table#issuetable:eq(0) tbody tr').each((index, dom) => {
            let obj = {};
            let hourTd = $(dom).find('td.hours');
            let firstTd = $(dom).find('td.issuekey');

            obj.Period = period;
            obj.Worker = worker;
            obj.Hours = parseFloat($(hourTd).text().trim());
            obj.Ticket = $(firstTd).find('a[title]').text().trim();
            work.push(obj);
        });
        console.table(work);
        dateToCSV(work);
    });

    function formatDate(d) {
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }

    // link: http://jsfiddle.net/hybrid13i/JXrwM/
    function dateToCSV(arrData) {
        let CSV = '';
        let csvHeader = {};
        //Set Report title in first row or line

        for (let prop in arrData[0]) {
            if (arrData[0].hasOwnProperty(prop)) {
                CSV += prop + ',';
            }
        }
        CSV += '\r';

        //1st loop is to extract each row
        for (let i = 0; i < arrData.length; i++) {
            let row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (let index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV === '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        let fileName = "MyReport_" + worker.split(' ').join('_');

        //Initialize file format you want csv or xls
        let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        let link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})();

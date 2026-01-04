// ==UserScript==
// @name         ZEIT+ Zeitrechner
// @namespace    merkur.at
// @version      1.6.0
// @description  Rechnet in Infoniqa in der Seite "Meine Buchungen" die heutige Arbeitszeit zusammen und zeigt dann Informationen über die verbleibende Arbeits- und Pausenzeit an.
// @author       Julian
// @license      MIT
// @match        https://mdc-as400-hr.merkur.net:8080/zeit_webp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452104/ZEIT%2B%20Zeitrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/452104/ZEIT%2B%20Zeitrechner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title = document.getElementById("dvtitle")?.textContent.trim().split(" ")[0].toLowerCase();

    if(title == null || title.trim() != "buchungen") return;
    if(document.getElementById("zpn0201r") == null) return;
    if(document.querySelectorAll("body .clsoben")?.length > 0) return;

    let workedTime = 0,
        timeTable = [],
        breakTime = 0;

    //GM_addStyle(".tagheute { background-color:green; }");
    GM_addStyle(".today { background-color:yellow; }");
    //GM_addStyle(".liveTimeTicker { background-color:inherit; padding:5px 0px 5px 0px; line-height:1.5; cursor:help; max-width:1000px; width:100%; margin:auto; border:1px #ebe8e8 solid;}");
    GM_addStyle(".liveTimeTicker { background-color:white; padding:5px 0px 5px 0px; line-height:1.5; cursor:help; max-width:300px; width:100%; max-height: 100px; margin:auto; border:1px #ebe8e8 solid; position:fixed; right:20px; bottom:10px; }");
    GM_addStyle(".liveTimeTicker { transition: width 1s, height 1s, border-radius 1s, color 0.5s, bottom 1s, right 1s, padding 1s; }");
    GM_addStyle(".liveTimeTicker.small { width:50px; height:50px; border-radius: 50%; color: transparent; padding: 0}");

    const liveTickerElement = document.createElement("div");
    liveTickerElement.classList.add("liveTimeTicker");
    document.getElementById("box").insertAdjacentElement("afterbegin", liveTickerElement);
    liveTickerElement.innerText = "Loading...";

    document.querySelector('.liveTimeTicker').addEventListener('click', function () {
        this.classList.toggle('small')
    })

    const times = [7.7, 10];

    const grid = document.getElementById("tbgrid");
    const todayRow = grid.querySelectorAll("tr.tagheute")[0];
    let todaysClass;

    addTitles();

    if(todayRow == null) {
        liveTickerElement.innerHTML = ":)";
    } else {
        todaysClass = removeItemAll([...todayRow.classList], "tagheute")[0];
        refreshData();
        updateLiveTicker();
    }

    function updateLiveTicker() {
        refreshData();
        let remainingBreakTime = Math.max(0, 30 - breakTime);

        //console.log({workedTime, remainingBreakTime});
        //console.log(timeTable);

        let text = "";
        if(workedTime < 6 * 60) {
            const time = 6;
            const timeToEnd = (time * 60) - workedTime;
            text += `Zeit bis ${time}h (ohne Pause): <strong title="${getTimeInXMinutes(timeToEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}">${minutesToReadable(timeToEnd)}</strong><br>`;
        }

        times.sort(function(a, b){return a-b}).forEach(time => {
            const timeToEnd = (time * 60) - workedTime + remainingBreakTime;
            text += `Zeit bis ${time}h: <strong title="${getTimeInXMinutes(timeToEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}">${minutesToReadable(timeToEnd)}</strong><br>`;
        });
        text += `${remainingBreakTime} Minuten Pause verbleiben`
        liveTickerElement.innerHTML = text;

        setTimeout(updateLiveTicker, 10000);
    };

    function refreshData() {
        workedTime = 0;
        timeTable = [];
        breakTime = 0;

        let finishedSiblingSearch = false;
        let nextSibling = todayRow;

        do {
            if(nextSibling.classList.contains(todaysClass)) {
                const rowStartTime = nextSibling.getElementsByTagName("td")[4].innerText;
                const rowEndTime = nextSibling.getElementsByTagName("td")[5].innerText;
                const workedTimeRow = calcTimeDiff(rowStartTime, rowEndTime);

                workedTime += workedTimeRow;
                timeTable.push([nextSibling.getElementsByTagName("td")[4].innerText, nextSibling.getElementsByTagName("td")[5].innerText]);
                nextSibling.classList.add("today");
                // nextSibling.title = minutesToReadable(workedTimeRow);
            }
            else {
                finishedSiblingSearch = true;
            }
            nextSibling = nextSibling.nextElementSibling;
        } while(!finishedSiblingSearch);
        breakTime = calcBreakTimeFromTable(timeTable);
    }

    function addTitles() {
        for(let row of grid.getElementsByTagName("tr")) {
            const rowStartTime = row.getElementsByTagName("td")[4]?.innerText;
            const rowEndTime = row.getElementsByTagName("td")[5]?.innerText;

            if(rowStartTime == "" || rowEndTime == "") continue;
            else if(rowStartTime == null || rowEndTime == null) continue;

            const workedTimeRow = calcTimeDiff(rowStartTime, rowEndTime);
            row.title = minutesToReadable(workedTimeRow);
        }
    }

    function calcTimeDiff(startTime, endTime = new Date()) {
        if(startTime == null || endTime == null) return 0;
        else if(endTime == "" || endTime == null) endTime = new Date();
        else if(!(endTime instanceof Date)) {
            const hours = endTime.split(":")[0];
            const minutes = endTime.split(":")[1];

            endTime = new Date();
            endTime.setHours(hours);
            endTime.setMinutes(minutes);
            endTime.setSeconds(0);
        }

        const hours = startTime.split(":")[0];
        const minutes = startTime.split(":")[1];

        startTime = new Date();
        startTime.setHours(Math.max(hours, 6));
        startTime.setMinutes(hours <= 6 ? (hours == 6 ? Math.max(30, minutes) : 0) : minutes);
        startTime.setSeconds(0);

        return Math.floor((Math.abs(endTime - startTime)/1000)/60);
    }

    function minutesToReadable(time) {
        const hours = time < 0 ? Math.ceil(time / 60) : Math.floor(time / 60);
        const minutes = time < 0 ? Math.ceil(time % 60) : Math.floor(time % 60);

        return `${hours} Stunden, ${minutes} Minuten`;
    }

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i] === value) {
                arr.splice(i, 1);
            } else {
                ++i;
            }
        }
        return arr;
    }

    function calcBreakTimeFromTable(table) {
        let time = 0, workTime = 0;

        for(let i = 0; i < table.length; i++) {
            // Pause wird nur in den ersten 6 Arbeitsstunden angerechnet
            if(i > 0 && workTime < 6*60) {
                time += calcTimeDiff(table[i][0], table[i-1][1]);
            }
            workTime += calcTimeDiff(table[i][0], table[i][1]);
        }
        return time;
    }

    function getTimeInXMinutes(minutes) {
        return new Date(new Date().getTime() + minutes*60000);
    }
})();
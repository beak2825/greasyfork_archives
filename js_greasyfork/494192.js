// ==UserScript==
// @name         Teachable Time Helper
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  Calculate and display amount of time spent watching lectures and how much time remains to be spent watching lectures for the course.
// @author       Daniel Hillis (https://github.com/dhillis)
// @match        https://learn.cantrill.io/courses/enrolled/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cantrill.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494192/Teachable%20Time%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/494192/Teachable%20Time%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Section {
        constructor(sectionName){
            this.name = sectionName;
            this.totalSeconds = 0;
            this.completedSeconds = 0;
        }
        get remainingSeconds(){
            return this.totalSeconds - this.completedSeconds;
        }
    }

    function getDurationString(timeInSeconds) {
        let hours = Math.trunc(timeInSeconds/3600);
        let hoursRemainder = timeInSeconds%3600;
        let minutes = Math.trunc(hoursRemainder/60);
        let seconds = hoursRemainder%60;
        if (hours > 0){
            return (hours.toString()
                    .concat(':')
                    .concat(String(minutes).padStart(2, '0'))
                    .concat(':')
                    .concat(String(seconds).padStart(2, '0')));
        }
        else {
            return (String(minutes)
                    .concat(':')
                    .concat(String(seconds).padStart(2, '0')));
        }
    }

    var sections = $('.course-mainbar div.row div.course-section');
    var sectionCount = sections.length;
    var sectionCourses = $('.course-mainbar div.row div.course-section ul.section-list');
    var lectureCount = $('span.lecture-name').length;

    const regexpCourseDurationMMSS = /([0-9]{1,2})(?=:):([0-9]{2})/;
    const sectionMap = new Map();

    let overallDurationSeconds = 0;
    let overallDurationCompletedSeconds = 0;

    for(let sec of document.querySelectorAll(".course-mainbar div.row div.course-section")) {
        let currentSection = sec.querySelector("div.section-title");
        let currentSectionTitle = currentSection.innerText;

        // store the map for this section
        let currentSectionCounts = new Section(currentSectionTitle);
        sectionMap.set(currentSectionTitle, currentSectionCounts);

        for(let c of sec.querySelectorAll("ul.section-list li.section-item")) {
            let courseName = c.querySelector("span.lecture-name").innerText;
            let completed = c.classList.contains("completed");

            // courseName sample:
            // [ASSOCIATESHARED] [DEMO] Automated EC2 Control using Lambda and Events - PART2 (18:49 )

            // get duration from the course title
            let duration = courseName.match(regexpCourseDurationMMSS);

            if (duration && duration.length === 3){
                let minutes = parseInt(duration[1]);
                let seconds = parseInt(duration[2]);
                let courseTotalSeconds = seconds + ( minutes * 60 );

                currentSectionCounts.totalSeconds+= courseTotalSeconds;
                overallDurationSeconds += courseTotalSeconds;
                if (completed){
                    currentSectionCounts.completedSeconds+= courseTotalSeconds;
                    overallDurationCompletedSeconds+= courseTotalSeconds;
                }
            }
        }

        currentSection.innerText += ` (${getDurationString(currentSectionCounts.remainingSeconds)} remaining)`;
    }

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    let playback_speeds = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00];

    const cellpadding = "10px";
    const headfootbgcolor = "#5a1d82";
    const headfootfontsize = "120%";
    const cellhighlightcolor = "#e0d7e6";
    const white = "#FFFFFF";
    const speed1fontsize = "115%";
    const speed1fontweight = "900";

    let table = document.createElement('TABLE');
    table.border = '1';
    table.style.fontSize = "50%";
    table.style.textAlign = "center";
    let tableHead = document.createElement('THEAD');
    tableHead.style.backgroundColor = headfootbgcolor;
    tableHead.style.color = white;

    let headrow1 = document.createElement('TR');

    let headrow1_th1 = document.createElement('TH');
    headrow1_th1.appendChild(document.createTextNode('Section'))
    headrow1_th1.style.textAlign = "center";
    headrow1_th1.style.paddingLeft = cellpadding;
    headrow1_th1.style.paddingRight = cellpadding;
    headrow1_th1.rowSpan = 2;
    headrow1.appendChild(headrow1_th1);

    let headrow1_th2 = document.createElement('TH');
    headrow1_th2.appendChild(document.createTextNode('Playback Speeds'))
    headrow1_th2.style.textAlign = "center";
    headrow1_th2.style.paddingLeft = cellpadding;
    headrow1_th2.style.paddingRight = cellpadding;
    headrow1_th2.colSpan = playback_speeds.length;
    headrow1.appendChild(headrow1_th2);

    tableHead.appendChild(headrow1);

    let headrow2 = document.createElement('TR');
    for(let speed of playback_speeds){
        let th = document.createElement('TH');
        th.appendChild(document.createTextNode(`${speed.toFixed(2)}X`));
        th.style.textAlign = "center";
        th.style.paddingLeft = cellpadding;
        th.style.paddingRight = cellpadding;
        if (speed == 1.0) {
            th.style.fontWeight = speed1fontweight;
            th.style.fontSize = speed1fontsize;
        }
        tableHead.style.fontSize = headfootfontsize;
        headrow2.appendChild(th);
    }
    tableHead.appendChild(headrow2);

    table.appendChild(tableHead);

    let tableBody = document.createElement('TBODY');
    for (const [key, value] of sectionMap) {
        var sectionTR = document.createElement('TR');
        let sectionNameTD = document.createElement('TD');
        sectionNameTD.appendChild(document.createTextNode(key));
        sectionNameTD.style.paddingLeft = cellpadding; sectionNameTD.style.paddingRight = cellpadding;
        sectionNameTD.style.textAlign = "center";
        sectionTR.appendChild(sectionNameTD);
        for (let speed of playback_speeds) {
            var td = document.createElement('TD');
            td.style.textAlign = "center";
            td.style.paddingLeft = cellpadding; td.style.paddingRight = cellpadding;
            if (speed == 1.0) {
                td.style.backgroundColor = cellhighlightcolor;
                td.style.fontWeight = speed1fontweight;
                td.style.fontSize = speed1fontsize;
            }
            td.appendChild(document.createTextNode(getDurationString(Math.round(value.remainingSeconds / speed))));
            sectionTR.appendChild(td);
        }
        tableBody.appendChild(sectionTR);
    }
    table.appendChild(tableBody);

    const overall_rt_secs = overallDurationSeconds - overallDurationCompletedSeconds;

    let tableFoot = document.createElement('TFOOT');
    tableFoot.style.backgroundColor = headfootbgcolor;
    tableFoot.style.color = white;
    let tfth1 = document.createElement('TH');
    tfth1.appendChild(document.createTextNode('Overall Remaining Time'));
    tfth1.style.textAlign = "center";
    tfth1.style.paddingLeft = cellpadding; tfth1.style.paddingRight = cellpadding;
    tableFoot.appendChild(tfth1);
    for(let speed of playback_speeds){
        let th = document.createElement('TH');
        th.appendChild(document.createTextNode(`${getDurationString(Math.round(overall_rt_secs / speed))}`));
        th.style.textAlign = "center";
        th.style.paddingLeft = cellpadding; th.style.paddingRight = cellpadding;
        if (speed == 1.0) {
            th.style.fontWeight = speed1fontweight;
        }
        tableFoot.style.fontSize = headfootfontsize;
        tableFoot.appendChild(th);
    }

    table.appendChild(tableFoot);

    $('.course-mainbar .section-title').first().append(table);

})();
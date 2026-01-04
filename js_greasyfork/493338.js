// ==UserScript==
// @name         Lute: Current Page Statuses Alert Button
// @version      20240509.2
// @description  Adds a button to alert the current page term statuses
// @author       jamesdeluk
// @match        http://localhost:500*/read/*
// @grant        none
// @homepageURL  https://greasyfork.org/en/scripts/493338-lute-current-page-statuses-alert-button
// @supportURL   https://greasyfork.org/en/scripts/493338-lute-current-page-statuses-alert-button/feedback
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/493338/Lute%3A%20Current%20Page%20Statuses%20Alert%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493338/Lute%3A%20Current%20Page%20Statuses%20Alert%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const btn_statuses = document.createElement('button');
        btn_statuses.textContent = "%";
        btn_statuses.style.position = "fixed";
        btn_statuses.style.left = "0";
        btn_statuses.style.top = "50%";
        btn_statuses.style.transform = "translateY(-50%)";
        btn_statuses.style.margin = "0.1em";
        btn_statuses.style.padding = "0.1em 0.1em";
        btn_statuses.style.zIndex = "1000";
        btn_statuses.onclick = function() {
            const statusNames = {
                'status0': '?',
                'status1': '1',
                'status2': '2',
                'status3': '3',
                'status4': '4',
                'status5': '5',
                'status99': '✓',
                'status98': 'X'
            };
            let totalStatusCount = 0;
            let statusCounts = Object.keys(statusNames).map(status => {
                let count = document.getElementsByClassName(status).length;
                totalStatusCount += count;
                return { status: statusNames[status], count };
            });
            let combinedStatusRange = ['status1', 'status2', 'status3', 'status4', 'status5'];
            let combinedStatusCount = combinedStatusRange.reduce((sum, status) => {
                return sum + document.getElementsByClassName(status).length;
            }, 0);
            let indexStatus5 = statusCounts.findIndex(item => item.status === '5');
            statusCounts.splice(indexStatus5 + 1, 0, { status: 'L', count: combinedStatusCount });
            let orderedAggregatedStatuses = ['?', 'L', '✓', 'X'];
            let detailedStatuses = ['1', '2', '3', '4', '5'];
            let total = `Total terms: ${totalStatusCount}\n`;
            let results = '';
            // let bars = '';
            orderedAggregatedStatuses.forEach(status => {
                let item = statusCounts.find(item => item.status === status);
                if (item) {
                    let percentage = (item.count / totalStatusCount) * 100;
                    // let barLength = Math.round(percentage / 5);
                    // let bar = new Array(barLength + 1).join('+');
                    results += `${status.padEnd(2)} : ${String(item.count).padEnd(3)} (${percentage.toFixed(0)}%)\n`;
                    // bars += `${status.padEnd(2)} : ${bar}\n`;
                }
            });
            results += '\n';
            detailedStatuses.forEach(status => {
                let item = statusCounts.find(item => item.status === status);
                if (item) {
                    let percentageOfCombined = (item.count / combinedStatusCount) * 100;
                    let barLength = Math.round(percentageOfCombined / 5);
                    let bar = new Array(barLength + 1).join('+');
                    results += `${status.padEnd(2)} : ${String(item.count).padEnd(3)} (${percentageOfCombined.toFixed(0)}%)\n`;
                    // bars += `${status.padEnd(2)} : ${bar}\n`;
                }
            });
            // alert(total + '\n' + results + '\n' + bars);
            alert(total + '\n' + results);
        };
        document.body.appendChild(btn_statuses);
    });

})();
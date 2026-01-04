// ==UserScript==
// @name         Lute: Current Page Statuses Display
// @version      20241019
// @description  Displays current page term statuses stacked vertically
// @author       jamesdeluk
// @match        http://localhost:500*/read/*
// @grant        none
// @namespace    https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/513385/Lute%3A%20Current%20Page%20Statuses%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/513385/Lute%3A%20Current%20Page%20Statuses%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
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

        const container = document.createElement('div');
        container.style.position = "fixed";
        container.style.left = "0";
        container.style.top = "50%";
        container.style.transform = "translateY(-50%)";
        container.style.padding = "0.5em";
        container.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        // container.style.border = "1px solid #ccc";
        container.style.zIndex = "1000";
        container.style.fontFamily = "monospace";
        container.style.fontSize = "12px";
        document.body.appendChild(container);

        function updateStatusCounts() {
            container.innerHTML = ''; // Clear previous counts
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

            let orderedAggregatedStatuses = ['?', 'L', 'O', 'X'];
            let detailedStatuses = ['1', '2', '3', '4', '5'];

            const totalDiv = document.createElement('div');
            totalDiv.textContent = `∑: ${totalStatusCount}`;
            totalDiv.style.fontWeight = "bold";
            container.appendChild(totalDiv);

            container.appendChild(document.createElement('hr'));

            orderedAggregatedStatuses.forEach(status => {
                let item = statusCounts.find(item => item.status === status);
                if (item) {
                    const div = document.createElement('div');
                    div.textContent = `${status}: ${item.count}`;
                    container.appendChild(div);
                }
            });

            container.appendChild(document.createElement('hr'));

            detailedStatuses.forEach(status => {
                let item = statusCounts.find(item => item.status === status);
                if (item) {
                    const div = document.createElement('div');
                    div.textContent = `${status}: ${item.count}`;
                    container.appendChild(div);
                }
            });
        }

        updateStatusCounts();
        setInterval(updateStatusCounts, 3000);
    });
})();

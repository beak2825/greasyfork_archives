// ==UserScript==
// @name         Playoff Weeks
// @namespace    https://underdogfantasy.com
// @version      2024-05-26-formatting
// @description  Playoff Weeks overlay
// @author       OVAWARE
// @match        https://underdogfantasy.com/*
// @icon         https://underdogfantasy.com/favicon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496177/Playoff%20Weeks.user.js
// @updateURL https://update.greasyfork.org/scripts/496177/Playoff%20Weeks.meta.js
// ==/UserScript==

(async function() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSspu_vNaCismLHMsDXr-wz47119pm6iNJRE3ygaREOSgMB2wX-Y-_dLW00sf9FsQSJMQlE18Eb3ThX/pub?gid=2109803309&single=true&output=csv';
    const teamDict = {};

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
            complete: function(results) {
                results.data.slice(2).forEach(row => {
                    if (row.length >= 3) {
                        teamDict[row[0]] = [row[1], row[2], row[3]];
                    }
                });
                console.log(teamDict);
            }
        });
    } catch (error) {
        console.error('Error fetching the CSV file:', error);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const outerContainer = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
    if (outerContainer) {
        const elements = document.querySelectorAll('.styles__playerPosition__ziprS');
        elements.forEach(element => {
            const match = element.innerHTML.match(/<strong>(.*?)<\/strong>/);
            if (match && teamDict[match[1]]) {
                const [val1, val2, val3] = teamDict[match[1]];
                element.innerHTML += ` <span style="color: #ff4545; margin-right: 10px;">${val1}</span><span style="color: #ffc229; margin-right: 10px;">${val2}</span><span style="color: #85fa7d;">${val3}</span>`;
            }
        });
    }
})();
// ==UserScript==
// @name         Torn Total race points
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows total race points accumulated from visible text logs
// @author       Silmaril [2665762]
// @license      MIT
// @match        https://*.torn.com/page.php?sid=log&log=8731*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/499655/Torn%20Total%20race%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/499655/Torn%20Total%20race%20points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        GM_registerMenuCommand('Get total race points', getTotalRacePoints);
    } catch (error) {
        console.log('[TotalRacePoints] Tampermonkey not detected!');
    }

    function getTotalRacePoints(){
        const logs = document.querySelectorAll('.log-text[class*=text___]');

        let totalPoints = 0;

        logs.forEach(log => {
            // Extract the racing points using a regular expression
            const match = log.textContent.match(/received (\d+) racing point(s?)/);
            if (match && match[1]) {
                // Convert the extracted points to an integer and add to the total
                totalPoints += parseInt(match[1], 10);
            }
        });

        // Output the total points
        alert('Total Racing Points: ' + totalPoints);
    }

})();
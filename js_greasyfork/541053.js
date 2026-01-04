// ==UserScript==
// @name         Steam Achievement Timestamp Duplicate Checker
// @version      1.0.1
// @description  Highlights and summarizes suspicious duplicate achievement unlock times of Steam achievements.
// @author       Kaapeli
// @match        https://steamcommunity.com/id/*/stats/*/achievements/*
// @match        https://steamcommunity.com/profiles/*/stats/*/achievements/*
// @match        https://steamcommunity.com/id/*/stats/*/?tab=achievements
// @match        https://steamcommunity.com/profiles/*/stats/*/?tab=achievements
// @grant        none
// @license	     GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1489671
// @downloadURL https://update.greasyfork.org/scripts/541053/Steam%20Achievement%20Timestamp%20Duplicate%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/541053/Steam%20Achievement%20Timestamp%20Duplicate%20Checker.meta.js
// ==/UserScript==

/*
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(function () {
  
  	// This value tells how many achievments need to be have been unlocked at the same time to be considered suspicious
  	// Setting this to 1 would make every achievement suspicious for example.
  	const suspiciousAmount = 6;
    
    'use strict';
    window.addEventListener('load', () => {
        const achievementContainer = document.querySelector('#personalAchieve');
        const summaryBox = document.querySelector('#topSummaryBoxContent');

      	// Error should not happen
        if (!achievementContainer || !summaryBox) {
            console.warn('Missing achievement container or summary box.');
            return;
        }

      	
        const rows = achievementContainer.querySelectorAll('.achieveRow');
        const timestampMap = new Map();

      	// Get all timestamps for unlocked achievements in a map
        rows.forEach(thisRow => {
            const timeDiv = thisRow.querySelector('.achieveUnlockTime');
            if (!timeDiv) return;

            const text = timeDiv.textContent.trim();

            if (!timestampMap.has(text)) {
                timestampMap.set(text, []);
            }
            timestampMap.get(text).push(thisRow);
        });

        let suspiciousTimestamps = [];
				
      	// Check for duplicates in the map
        timestampMap.forEach((rowList, timestamp) => {
            if (rowList.length >= suspiciousAmount) {
                suspiciousTimestamps.push({ timestamp, rows: rowList });
                rowList.forEach(row => {
                    row.style.border = '2px solid red';
                });
            }
        });

        // Create and insert the summary UI
        const summaryDiv = document.createElement('div');
        summaryDiv.style.padding = '10px';
        summaryDiv.style.marginTop = '10px';
        summaryDiv.style.border = '1px solid red';
        summaryDiv.style.backgroundColor = '#fff0f0';

        if (suspiciousTimestamps.length === 0) {
            summaryDiv.textContent = 'No suspicious achievement timestamps found.';
        } else {
            summaryDiv.innerHTML = `
                <strong> Detected ${suspiciousTimestamps.length} suspicious timestamps</strong><br><br>
                <ul style="margin-left: 20px;">
                    ${suspiciousTimestamps.map(t => `<li>${t.timestamp} - ${t.rows.length} achievements</li>`).join('')}
                </ul>
                <p style="margin-top: 5px;">These achievements have been highlighted below.</p>
            `;
        }

        summaryBox.appendChild(summaryDiv);
        console.log('Completed achievement timestamp checking');
    });
})();

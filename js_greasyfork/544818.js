// ==UserScript==
// @name         Jira Time Tracking Converter
// @version      1.1
// @description  Convert time tracking from "weeks days hours minutes" to "hours minutes" in Jira
// @author       Adam Zimny
// @match        *://jira/*
// @grant        none
// @namespace https://greasyfork.org/users/1430827
// @downloadURL https://update.greasyfork.org/scripts/544818/Jira%20Time%20Tracking%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/544818/Jira%20Time%20Tracking%20Converter.meta.js
// ==/UserScript==



(function () {
    'use strict';

    function convertTimeString(timeString) {
        console.log("Converting time string:", timeString);
        const timePattern = /(?:(\d+)w\s*)?(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?/;
        const match = timeString.match(timePattern);
        if (match) {
            const weeks = parseInt(match[1] || '0', 10);
            const days = parseInt(match[2] || '0', 10);
            const hours = parseInt(match[3] || '0', 10);
            const minutes = parseInt(match[4] || '0', 10);

            const totalHours = weeks * 5 * 8 + days * 8 + hours;
            const convertedString = `${totalHours}h ${minutes}m`;

            return convertedString;
        }
        return timeString;
    }

    function updateTimeTracking() {
        const timeElements = document.querySelectorAll('.tt_values');
        timeElements.forEach(element => {
            const convertedTime = convertTimeString(element.textContent.trim());
            element.textContent = convertedTime;
        });
    }

    window.onload = function () {
        setTimeout(() => {
            updateTimeTracking();
          	removePlannedTimeBars();
            updateCollaboratorBars();
        }, 1000);
    };


    function parseTimeToMinutes(timeStr) {
        const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?/;
        const match = timeStr.match(regex);
        if (!match) return 0;
        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        return hours * 60 + minutes;
    }
  
    function removePlannedTimeBars() {
      const container = document.querySelector('#collaboratorsmodule');
      if (!container) return;

      const rows = container.querySelectorAll('tr.tt_graph');

      rows.forEach(row => {
          const tds = row.querySelectorAll('td');
          if (tds.length > 1) {

              for (let i = 1; i < tds.length; i++) {
                  tds[i].remove();
              }
          }
      });
  }

    function updateCollaboratorBars() {
        const module = document.querySelector('#collaboratorsmodule');
        if (!module) return;

        const dls = module.querySelectorAll('dl');
        const userData = [];
        let totalMinutes = 0;

        dls.forEach(dl => {
            const name = dl.querySelector('dt')?.textContent.trim();
            const timeText = dl.querySelector('.tt_values')?.textContent.trim();
            const minutes = parseTimeToMinutes(timeText);
            const td = dl.querySelector('td[style*="background-color"]');

            if (name && timeText && td) {
                userData.push({ name, minutes, td });
                totalMinutes += minutes;
            }
        });

        if (totalMinutes === 0) return;

        userData.forEach(({ name, minutes, td }) => {
            const percent = (minutes / totalMinutes) * 100;
            console.log(`${name}: ${minutes} minutes => ${percent.toFixed(1)}% of total`);


            td.innerHTML = '';
            td.style.backgroundColor = '#cccccc';

            const minPercent = 1.5;
            const barWidthPercent = percent < minPercent ? minPercent : percent;

            const bar = document.createElement('div');
            bar.style.backgroundColor = '#51a825';
            bar.style.height = '10px';
            bar.style.width = `${barWidthPercent}%`;
            bar.title = `${name}: ${percent.toFixed(1)}% of total time`;

            td.appendChild(bar);

            td.style.width = 'auto';
        });

    }

})();
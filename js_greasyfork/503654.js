// ==UserScript==
// @name Torn Racing Data Extractor
// @namespace http://tampermonkey.net/
// @description Copies race details from Torn racing page
// @author Leofierus
// @version 1.0.3
// @license MIT
// @match https://www.torn.com/loader.php?sid=racing*
// @grant GM_setClipboard
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503654/Torn%20Racing%20Data%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/503654/Torn%20Racing%20Data%20Extractor.meta.js
// ==/UserScript==

(function() {
    "use strict";

    GM_addStyle(`
    .copy-data {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      padding: 10px 20px;
      background-color: grey;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }

    .copy-data:hover {
      background-color: darkgrey;
    }

    .copy-data:active {
      background-color: lightgrey;
    }

    .notification {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      background-color: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      font-size: 16px;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    .notification.show {
      opacity: 1;
    }
  `);

    function showNotification(message, duration) {
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Make it visible
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove the notification after the specified duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500); // Ensure it's removed after fade-out
        }, duration);
    }

    // Function to add the "Copy data" button
    function addCopyButton() {
        var $copyButton = $(`<button>`)
            .text("Copy data")
            .addClass("copy-data")
            .on("click", function() {
                var raceDetails = getRaceDetails();
                if (raceDetails) {
                    var formattedData = formatRaceDetails(raceDetails);
                    GM_setClipboard(formattedData);
                    showNotification("Race details copied to clipboard!", 3000);
                } else {
                    showNotification("No matching player ID found in race details.", 3000);
                }
            });

        $(".content-title.m-bottom10").after($copyButton);
    }

    // Function to get race details

    // const localUserName = "Leofierus";

    function getRaceDetails() {
        // Extract race details
        // var raceInfo = document.querySelector(
        //   `a[href^="/profiles.php?XID=${playerId}"]`
        // );

        // MAKE CHANGES HERE
        // REPLACE XID WITH YOUR OWN
        const targetHref = "/profiles.php?XID=2562509";

        function extractTextFromElementInDiv() {
            const parentDiv = document.querySelector('#drivers-scrollbar');
            let texts = [];

            if (parentDiv) {
                const elements = parentDiv.querySelectorAll(`a[href="${targetHref}"]`);

                elements.forEach(element => {
                    texts.push(element.textContent.trim());
                });
            } else {
                console.log('Parent div not found.');
            }

            /*
            if (texts[0].length < localUserName.length+2) {
                var data = texts[0];

            }
            */


            return texts[0];
        }

        function extractSkillData() {
            const skillDiv = document.querySelector('div.skill');

            if (skillDiv) {
                const mainSkillValue = skillDiv.childNodes[0].textContent.trim();

                const lastGainDiv = skillDiv.querySelector('div');
                const lastGainText = lastGainDiv ? lastGainDiv.textContent.trim() : '';

                console.log('Main Skill Value:', mainSkillValue);
                console.log('Last Gain:', lastGainText);

                return mainSkillValue
            } else {
                console.log('Skill div not found.');
                return null;
            }
        }

        function extractTotalLaps() {
            const lapsElement = document.querySelector('li.pd-val.pd-lap');
            if (lapsElement) {
                const lapsText = lapsElement.textContent.trim();
                const totalLaps = parseInt(lapsText.split('/')[0], 10);
                return totalLaps*1.000;
            } else {
                console.log('Total laps element not found.');
                return 100.000;
            }
        }

        function formatUTCDateTime(date) {
            const pad = (num) => num.toString().padStart(2, '0');
            const hours = pad(date.getUTCHours());
            const minutes = pad(date.getUTCMinutes());
            const seconds = pad(date.getUTCSeconds());
            const day = pad(date.getUTCDate());
            const month = pad(date.getUTCMonth() + 1);
            const year = date.getUTCFullYear().toString().slice(-2);

            return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
        }

        function convertToMilliseconds(time) {
            var parts = time.split(':');
            console.log(parts)
            if (parts.length == 3) {
                var hours = parseInt(parts[0], 10) || 0;
                var minutes = parseInt(parts[1], 10) || 0;
                var seconds = parseFloat(parts[2]) || 0;
            } else {
                var hours = 0
                var minutes = parseInt(parts[0], 10) || 0;
                var seconds = parseFloat(parts[1]) || 0;
            }
            return (hours * 3600 + minutes * 60 + seconds) * 1000;
        }

        function convertToTimeFormat(ms) {
            var totalSeconds = Math.floor(ms / 1000);
            var milliseconds = ms % 1000;
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            var formattedSeconds = (seconds + (milliseconds / 1000)).toFixed(3);

            // console.log(ms, minutes, seconds, milliseconds, totalSeconds, formattedSeconds);

            if (minutes != 0) {
                return `0${minutes}:${formattedSeconds.padStart(5, '0')}`;
            }
            // console.log(typeof(seconds))
            if (seconds < 10) {
                return `0${formattedSeconds.padStart(5, '0')}`;
            }

            return `${formattedSeconds.padStart(5, '0')}`;
        }

        var textContent = extractTextFromElementInDiv();
        var skillData = extractSkillData();
        var totalLaps = extractTotalLaps();
        var trackInfo = document.querySelector(".track-info").getAttribute("title");

        console.log(textContent)
        console.log(skillData)
        console.log(totalLaps)
        console.log(trackInfo)

        let raceInfo = textContent;
        console.log(raceInfo);

        // Parse race info
        var playerName = "N/A", totalLapTime = "N/A", bestLapTime = "N/A";
        var averageTime = "N/A", diff = "N/A";

        try {
            playerName = raceInfo.split(" ")[0];
            totalLapTime = raceInfo.split(" ")[2];
            bestLapTime = raceInfo.split("best: ")[1].replace(")", "");
        } catch (e) {
            console.error("Error parsing race info string:", e);
            // Variables will retain their "N/A" placeholder values
        }

        var totalLapMs = convertToMilliseconds(totalLapTime);
        var averageTimeMs = totalLapMs / totalLaps;
        var averageTime = convertToTimeFormat(averageTimeMs);
        var bestLapMs = convertToMilliseconds(bestLapTime);
        console.log(averageTimeMs, bestLapMs);
        var diffMs = averageTimeMs - bestLapMs;
        var diff = convertToTimeFormat(diffMs);

        // Get current time as race end time
        var raceEndTime = formatUTCDateTime(new Date());

        return {
            playerName: playerName,
            //position: position,
            totalLaps: totalLaps,
            totalLapTime: totalLapTime,
            bestLapTime: bestLapTime,
            averageTime: averageTime,
            diff: diff,
            track: trackInfo,
            raceEndTime: raceEndTime,
            racingSkill: skillData,
        };
    }

    // Function to format race details
    function formatRaceDetails(details) {
        // YOU CAN EDIT YOUR OWN SEPARATOR HERE
        const sep = ",";
        // EDIT THE WAY THE DATA IS COPIED HERE
        return `${details.totalLaps}${sep}${details.totalLapTime}${sep}${details.averageTime}${sep}${details.bestLapTime}${sep}${details.diff}${sep}${details.track}${sep}${details.raceEndTime}${sep}${details.racingSkill}`;
    }

    // Wait for the page to load and then add the button
    $(document).ready(function() {
        addCopyButton();
    });
})();
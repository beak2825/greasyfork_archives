// ==UserScript==
// @name         Snookerscores - Tabulka se zápasy knockout stage
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Vygeneruje tabulku se zápasy z pavouku
// @match        https://snookerscores.net/tournament-manager/*/knockout
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516882/Snookerscores%20-%20Tabulka%20se%20z%C3%A1pasy%20knockout%20stage.user.js
// @updateURL https://update.greasyfork.org/scripts/516882/Snookerscores%20-%20Tabulka%20se%20z%C3%A1pasy%20knockout%20stage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {

        // Create a new table with customized styles
        let table = document.createElement("table");
        table.style.border = "1px solid black";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "20px";
        table.style.width = "66%"; // Set table to 2/3 of the screen width
        table.style.borderRadius = "10px 10px 0 0";  // Rounded top corners
        table.style.margin = "0 auto"; // Center table on page

        // Table header with centered column titles
        table.innerHTML = `
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border-bottom: 1px solid black; text-align: center;">Phase</th>
                <th style="padding: 8px; width: 60%; border-bottom: 1px solid black; text-align: center;">Players</th>
                <th style="padding: 8px; border-bottom: 1px solid black; text-align: center;">Live URL</th>
            </tr>`;

        // Locate all match elements
        let matches = document.querySelectorAll(".match");
        let lastPhase = "";
        let phaseMatches = [];

        matches.forEach((match, index) => {
            // Find the phase for each match
            let phaseElement = match.previousElementSibling;
            while (phaseElement && !phaseElement.classList.contains("match") && !phaseElement.classList.contains("mt-3")) {
                phaseElement = phaseElement.previousElementSibling;
            }
            if (phaseElement && phaseElement.classList.contains("mt-3")) {
                // Add phase matches to the table when we reach a new phase
                if (phaseMatches.length > 0) {
                    appendPhaseMatches(table, phaseMatches);
                    phaseMatches = [];
                }
                lastPhase = phaseElement.textContent.trim();
            }

            // Extract player names in the original order
            let players = match.querySelectorAll(".brackets-player-name");
            if (players.length < 2) return;
            let player1Name = players[0].textContent.trim();
            let player2Name = players[1].textContent.trim();

            if (player1Name.toLowerCase() === "bye" || player2Name.toLowerCase() === "bye") return;

            // Combine player names and get live URL
            let playerNames = player1Name + " - " + player2Name;
            let liveLink = match.querySelector("a");
            let liveURL = liveLink ? liveLink.href : "";

            phaseMatches.push({ phase: lastPhase, players: playerNames, url: liveURL });

            if (index === matches.length - 1) {
                appendPhaseMatches(table, phaseMatches);
            }
        });

        // Insert the table at the top of the page
        document.body.insertBefore(table, document.body.firstChild);
    });

    // Helper function to append phase matches to the table with alternating row colors
    function appendPhaseMatches(table, matches) {
        matches.forEach((match, i) => {
            if (i === matches.length - 1 && match.players.trim() === " - ") return;

            let row = document.createElement("tr");
            row.style.backgroundColor = i % 2 === 0 ? "#f5f5dc" : "#e0ffff"; // Alternating colors: beige and light blue
            row.innerHTML = `
                <td style="padding: 8px; text-align: center;">${match.phase}</td>
                <td style="padding: 8px; text-align: center;">${match.players}</td>
                <td style="padding: 8px; text-align: center;"><a href="${match.url}" target="_blank">Link</a></td>`;
            table.appendChild(row);
        });
    }
})();
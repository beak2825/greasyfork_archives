// ==UserScript==
// @name         Nvplay - zdroják
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display cricket match score summary in a styled box
// @match        w-api.cdn.nvplay.net/*
// @grant        none
// @license      MIT
// @author       MK
// @downloadURL https://update.greasyfork.org/scripts/514671/Nvplay%20-%20zdroj%C3%A1k.user.js
// @updateURL https://update.greasyfork.org/scripts/514671/Nvplay%20-%20zdroj%C3%A1k.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Přidání stylů pro custom-table
    const style = document.createElement("style");
    style.textContent = `
        .custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border: 3px solid black;
            background-color: white;
            font-size: 20px;
            vertical-align: middle;
            z-index: 999999999;
        }
        .custom-table td {
            border: 1px solid black;
        }
        .custom-table td:first-child {
            width: 200px;
            text-align: right;
            padding-right: 10px;
        }
        .custom-table td:nth-child(n+2) {
            width: 50px;
            text-align: center;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    function extractJSON(text) {
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    }

    try {
        let matchData;
        try {
            matchData = JSON.parse(document.body.innerText);
        } catch (error) {
            console.warn("Direct JSON.parse failed, trying to extract JSON from text");
            matchData = extractJSON(document.body.innerText);
        }

        if (!matchData || !matchData.Innings) {
            console.error("Failed to retrieve match data.");
            return;
        }

        // Vytvoření tabulky
        const table = document.createElement('table');
        table.className = "custom-table";

        // Přidání skóre pro každý inning
        matchData.Innings.forEach((innings, index) => {
            const scoreText = `${innings.TotalRuns}/${innings.TotalWickets} (${innings.TotalOvers})`;

            const row = table.insertRow();
            row.id = `Score_${index + 1}`;

            const labelCell = row.insertCell();
            labelCell.textContent = `Score_${index + 1}`;

            const scoreCell = row.insertCell();
            scoreCell.textContent = scoreText;
        });

        // Přidání řádků pro MatchStatus, MatchSituation a TossWinnerText
        const matchDetails = [
            { id: "MatchStatus", label: "Match Status", value: matchData.Match.MatchStatus },
            { id: "MatchSituation", label: "Match Situation", value: matchData.Match.MatchSituation },
            { id: "TossWinnerText", label: "Toss Winner", value: matchData.Match.TossWinnerText }
        ];

        matchDetails.forEach(detail => {
            const row = table.insertRow();
            row.id = detail.id;

            const labelCell = row.insertCell();
            labelCell.textContent = detail.label;

            const valueCell = row.insertCell();
            valueCell.textContent = detail.value;
        });

        // Přidání tabulky do dokumentu
        document.body.appendChild(table);
    } catch (error) {
        console.error("Error processing JSON or creating table:", error);
    }
})();

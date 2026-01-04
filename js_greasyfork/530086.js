// ==UserScript==
// @name           My Match Analyzer (Standalone)
// @namespace      *trophymanager.com/matches*
// @include        *trophymanager.com/matches*
// @grant          none
// @version 1
// @license MIT 
// @description    Standalone Match Analyzer for TrophyManager
// @downloadURL https://update.greasyfork.org/scripts/530086/My%20Match%20Analyzer%20%28Standalone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530086/My%20Match%20Analyzer%20%28Standalone%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractMatchData() {
        let matchData = {};

        let homeTeam = document.querySelector(".abs.names.home_name .very_large")?.innerText || 'N/A';
        let awayTeam = document.querySelector(".abs.names.away_name .very_large")?.innerText || 'N/A';

        matchData.home_team = homeTeam;
        matchData.away_team = awayTeam;

        let statsList = document.querySelectorAll("ul.clean.tcenter.large_padding.underlined.stats.three_parts li");
        matchData.home_score = document.querySelector(".home")?.innerText || 'N/A';
        matchData.away_score = document.querySelector(".away")?.innerText || 'N/A';

        matchData.home_possession = statsList[0]?.querySelector(".home")?.innerText || 'N/A';
        matchData.away_possession = statsList[0]?.querySelector(".away")?.innerText || 'N/A';
        matchData.home_shots = statsList[1]?.querySelector(".home")?.innerText || 'N/A';
        matchData.away_shots = statsList[1]?.querySelector(".away")?.innerText || 'N/A';
        matchData.home_on_goal = statsList[2]?.querySelector(".home")?.innerText || 'N/A';
        matchData.away_on_goal = statsList[2]?.querySelector(".away")?.innerText || 'N/A';

        matchData.match_type = document.querySelector(".match_type_class")?.innerText || 'N/A';
        matchData.kickoff = document.querySelector(".kickoff_class")?.innerText || 'N/A';
        matchData.city = document.querySelector(".city_class")?.innerText || 'N/A';
        matchData.stadium = document.querySelector(".stadium_class")?.innerText || 'N/A';
        matchData.attendance = document.querySelector(".attendance_class")?.innerText || 'N/A';
        matchData.weather = document.querySelector(".weather_class")?.innerText || 'N/A';
        matchData.pitch_condition = document.querySelector(".pitch_class")?.innerText || 'N/A';

        matchData.home_color = document.querySelector(".home_color")?.style.backgroundColor || 'N/A';
        matchData.away_color = document.querySelector(".away_color")?.style.backgroundColor || 'N/A';

        let chances = document.querySelectorAll('ul.report_list.clean.underlined.text_left li');
        let homeChances = 0;
        let awayChances = 0;
        let ballGifCount = 0;
        let homeAssists = [];
        let awayAssists = [];
        let wordOccurrences = {
            "counter": 0,
            "freekick": 0,
            "through": 0,
            "wing": 0,
            "short": 0,
            "corner": 0,
            "long": 0
        };

        let homeWordOccurrences = {
            "counter": 0,
            "freekick": 0,
            "through": 0,
            "wing": 0,
            "short": 0,
            "corner": 0,
            "long": 0
        };

        let awayWordOccurrences = {
            "counter": 0,
            "freekick": 0,
            "through": 0,
            "wing": 0,
            "short": 0,
            "corner": 0,
            "long": 0
        };

        chances.forEach(chance => {
            let substitutionText = chance.querySelector("p")?.innerText || "";
            if (substitutionText.includes("looking to do a substitution after")) {
                return;
            }

            let managerOrderText = chance.querySelector("div.text.small p")?.innerText || "";
            if (managerOrderText.includes("calls out new orders to shake things up")) {
                return;
            }

            let positionChangeText = chance.querySelector("p")?.innerText || "";
            if (positionChangeText.includes(" calls out a position change for")) {
                return;
            }

            let chanceText = chance.querySelector("div.text.small")?.innerText.toLowerCase().trim();

            let paragraphs = chance.querySelectorAll("div.text.small p");
            let seenWords = new Set();

            paragraphs.forEach(p => {
                let pText = p.innerText.toLowerCase().trim();
                chanceText += " " + pText;
            });

            if (chance.querySelector('img[src="/pics/icons/ball.gif"]') && chanceText) {
                ballGifCount++;

                let uniqueChanceText = [...new Set(chanceText.split(" "))].join(" ");

                const wordsOrder = ["counter", "freekick", "corner", "short", "through", "wing", "long"];

                let foundWord = false;
                for (let word of wordsOrder) {
                    if (uniqueChanceText.includes(word) && !seenWords.has(word)) {
                        seenWords.add(word);
                        let minutes = chance.closest('li').getAttribute("report_id");
                        if (chance.style.backgroundColor === matchData.home_color) {
                            homeAssists.push({ word, minutes });
                        } else if (chance.style.backgroundColor === matchData.away_color) {
                            awayAssists.push({ word, minutes });
                        }
                        foundWord = true;
                        break;
                    }
                }
            }

            let chanceColor = chance.style.backgroundColor;
            let normalizedHomeColor = matchData.home_color.toLowerCase().trim();
            let normalizedAwayColor = matchData.away_color.toLowerCase().trim();

            if (chanceColor && chanceColor.toLowerCase().includes(normalizedHomeColor)) {
                homeChances++;
            } else if (chanceColor && chanceColor.toLowerCase().includes(normalizedAwayColor)) {
                awayChances++;
            }
        });

        // Adjust percentage formatting to show only one '%'
        if (matchData.home_possession !== 'N/A') {
            matchData.home_possession = parseFloat(matchData.home_possession).toFixed(1);
        }
        if (matchData.away_possession !== 'N/A') {
            matchData.away_possession = parseFloat(matchData.away_possession).toFixed(1);
        }

        matchData.home_chances = homeChances;
        matchData.away_chances = awayChances;
        matchData.ball_gif_count = ballGifCount;
        matchData.home_word_occurrences = homeWordOccurrences;
        matchData.away_word_occurrences = awayWordOccurrences;
        matchData.home_assists = homeAssists;
        matchData.away_assists = awayAssists;

        return matchData;
    }

    function clickAnalyze() {
        let matchData = extractMatchData();
        let homeWordStats = Object.entries(matchData.home_word_occurrences)
            .filter(([word, count]) => count > 0)
            .map(([word, count]) => `<tr><td style="background-color: ${matchData.home_color};">${word}</td><td>${count}</td></tr>`)
            .join('');

        let awayWordStats = Object.entries(matchData.away_word_occurrences)
            .filter(([word, count]) => count > 0)
            .map(([word, count]) => `<tr><td style="background-color: ${matchData.away_color};">${word}</td><td>${count}</td></tr>`)
            .join('');

        // Home assists with minutes
        let homeAssistsStats = matchData.home_assists
            .map(({ word, minutes }) => `<tr><td style="background-color: ${matchData.home_color};">${word}</td><td>${minutes}</td></tr>`)
            .join('');
        if (homeAssistsStats === '') homeAssistsStats = `<tr><td colspan="2">ZERO</td></tr>`;

        // Away assists with minutes
        let awayAssistsStats = matchData.away_assists
            .map(({ word, minutes }) => `<tr><td style="background-color: ${matchData.away_color};">${word}</td><td>${minutes}</td></tr>`)
            .join('');
        if (awayAssistsStats === '') awayAssistsStats = `<tr><td colspan="2">ZERO</td></tr>`;

        let analysisDiv = document.getElementById("mma_analysis");
        analysisDiv.innerHTML =
            `<div style="display: flex; gap: 20px; background: black; color: white; padding: 10px; font-family: Arial; border-radius: 5px;">
                <table border="1" style="border-collapse: collapse; width: 50%; text-align: center;">
                    <tr><th colspan="3">Match statistics</th></tr>
                    <tr>
                        <th></th>
                        <th style="background: ${matchData.home_color};">${matchData.home_team}</th>
                        <th style="background: ${matchData.away_color};">${matchData.away_team}</th>
                    </tr>
                    <tr><td>Score</td><td>${matchData.home_score}</td><td>${matchData.away_score}</td></tr>
                    <tr><td>Possession</td><td>${matchData.home_possession}%</td><td>${matchData.away_possession}%</td></tr>
                    <tr><td>Shots</td><td>${matchData.home_shots}</td><td>${matchData.away_shots}</td></tr>
                    <tr><td>On Goal</td><td>${matchData.home_on_goal}</td><td>${matchData.away_on_goal}</td></tr>
                    <tr><td>Chances</td><td>${matchData.home_chances}</td><td>${matchData.away_chances}</td></tr>
                </table>
                <table border="1" style="border-collapse: collapse; width: 50%; text-align: center;">
                    <tr><th colspan="2">Home Team Assists at the minute</th></tr>
                    ${homeAssistsStats}
                </table>
                <table border="1" style="border-collapse: collapse; width: 50%; text-align: center;">
                    <tr><th colspan="2">Away Team Assists at the minute</th></tr>
                    ${awayAssistsStats}
                </table>
            </div>`;
    }

    function createUI() {
        let container = document.createElement("div");
        container.setAttribute("id", "mma_container");
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.left = "10px";
        container.style.background = "#222";
        container.style.color = "white";
        container.style.padding = "10px";
        container.style.borderRadius = "5px";
        container.style.zIndex = "1000";

        let closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.backgroundColor = "red";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.width = "30px";
        closeButton.style.height = "30px";
        closeButton.style.fontSize = "16px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function() {
            container.style.display = "none";
        };

        let analyzeButton = document.createElement("button");
        analyzeButton.innerText = "Analyze Match";
        analyzeButton.style.padding = "10px 20px";
        analyzeButton.style.fontSize = "16px";
        analyzeButton.style.cursor = "pointer";
        analyzeButton.style.backgroundColor = "#333";  // Dark grey background
        analyzeButton.style.color = "white";  // White text color
        analyzeButton.style.border = "2px solid #444";  // Slightly lighter border
        analyzeButton.style.borderRadius = "5px";
        analyzeButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";  // Shadow for a floating effect
        analyzeButton.style.transition = "all 0.3s ease";  // Smooth transition effect on hover

        // Hover effect
        analyzeButton.onmouseover = function() {
            analyzeButton.style.backgroundColor = "#555";  // Lighter grey when hovered
            analyzeButton.style.borderColor = "#666";  // Lighter border on hover
        };

        analyzeButton.onmouseout = function() {
            analyzeButton.style.backgroundColor = "#333";  // Original background
            analyzeButton.style.borderColor = "#444";  // Original border
        };

        analyzeButton.onclick = clickAnalyze;

        let analysisDiv = document.createElement("div");
        analysisDiv.setAttribute("id", "mma_analysis");
        analysisDiv.style.marginTop = "10px";
        analysisDiv.style.maxHeight = "500px";
        analysisDiv.style.overflowY = "auto";
        analysisDiv.style.background = "#000";
        analysisDiv.style.padding = "10px";
        analysisDiv.style.borderRadius = "5px";

        container.appendChild(closeButton);
        container.appendChild(analyzeButton);
        container.appendChild(analysisDiv);
        document.body.appendChild(container);
    }

    window.addEventListener('load', createUI);
})();

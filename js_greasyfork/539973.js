// ==UserScript==
// @name         Detail utkání
// @namespace    http://tampermonkey.net/
// @version      2025-02-21
// @description  Blalba
// @author       You
// @match        https://www.psmf.cz/souteze/2016-hanspaulska-liga-podzim/8-m/tymy/tvoje-mama-fc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=psmf.cz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539973/Detail%20utk%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/539973/Detail%20utk%C3%A1n%C3%AD.meta.js
// ==/UserScript==

let matchDetails = [];

document.querySelectorAll('.table-responsive').forEach(container => {
    let matches = container.querySelectorAll('table.component__table');

    matches.forEach(matchTable => {
        let matchInfo = {}; // Initialize matchInfo at the start of each matchTable loop

        // Funkce pro vyčištění textu (odstranění tabulátorů, nových řádků a nadbytečných mezer)
        const cleanText = (text) => {
            if (text) {
                return text.replace(/\s+/g, ' ').trim();
            }
            return '';
        };

        // Extract basic match details from the first table
        let basicTable = matchTable.querySelector('tbody > tr > td > table');
        if (basicTable) {
            let basicColumns = basicTable.querySelectorAll('tr:nth-child(2) td');

            if (basicColumns.length > 1) {
                matchInfo.date = cleanText(basicColumns[0]?.textContent);
                matchInfo.time = cleanText(basicColumns[1]?.textContent);
                matchInfo.pitch = cleanText(basicColumns[2]?.textContent);
                let teams = basicColumns[3]?.querySelectorAll('a');
                matchInfo.homeTeam = cleanText(teams[0]?.textContent);
                matchInfo.awayTeam = cleanText(teams[1]?.textContent);
                matchInfo.round = cleanText(basicColumns[4]?.textContent);
                matchInfo.result = cleanText(basicColumns[5]?.textContent);
            }
        }

        // Extract match description and referee from the second table
        let descriptionTable = matchTable.querySelector('tbody > tr:nth-child(2) > td > table');
        if (descriptionTable) {
            let descriptionColumns = descriptionTable.querySelectorAll('tr:nth-child(2) td');
            if (descriptionColumns.length > 1) {
                matchInfo.description = cleanText(descriptionColumns[0]?.textContent);
                matchInfo.referee = cleanText(descriptionColumns[1]?.textContent);
            }
        }

        // Extract player and goal details from the third table
        let playerGoalTable = matchTable.querySelector('tbody > tr:nth-child(3) > td > table');
        if (playerGoalTable) {
            let playerGoalColumns = playerGoalTable.querySelectorAll('tr');
            matchInfo.homePlayers = cleanText(playerGoalColumns[1]?.querySelector('td:nth-child(1)').textContent);
            matchInfo.awayPlayers = cleanText(playerGoalColumns[1]?.querySelector('td:nth-child(3)').textContent);
        }

        // Extract goal and card details from the fourth table (goals and cards)
        let goalsCardsTable = matchTable.querySelector('tbody > tr:nth-child(4) > td > table');
        if (goalsCardsTable) {
            let goalsCardsColumns = goalsCardsTable.querySelectorAll('tr');

            console.log("Goals and Cards Columns:", goalsCardsColumns);

            // Extract goal details for home and away teams
            let homeGoalsText = cleanText(goalsCardsColumns[1]?.querySelector('td:nth-child(1)').textContent);
            let awayGoalsText = cleanText(goalsCardsColumns[1]?.querySelector('td:nth-child(4)').textContent);

            // Log the goal details
            console.log("Home Goals Text:", homeGoalsText);
            console.log("Away Goals Text:", awayGoalsText);

            // Extract goal scorers for home and away teams (only the names)
            if (homeGoalsText) {
                matchInfo.homeGoalScorers = homeGoalsText.split('\n').map(goal => {
                    let goalText = cleanText(goal);
                    console.log("Home Goal Scorer:", goalText);
                    return goalText.split('. ')[1] || goalText;
                });
            } else {
                matchInfo.homeGoalScorers = [];
            }

            if (awayGoalsText) {
                matchInfo.awayGoalScorers = awayGoalsText.split('\n').map(goal => {
                    let goalText = cleanText(goal);
                    console.log("Away Goal Scorer:", goalText);
                    return goalText.split('. ')[1] || goalText;
                });
            } else {
                matchInfo.awayGoalScorers = [];
            }

            // Extract card details for home and away teams
            let homeCardsText = cleanText(goalsCardsColumns[1]?.querySelector('span').textContent);
            let awayCardsText = cleanText(goalsCardsColumns[1]?.querySelector('span').textContent);

            matchInfo.homeCards = homeCardsText ? homeCardsText.split('\n').map(card => cleanText(card)) : [];
            matchInfo.awayCards = awayCardsText ? awayCardsText.split('\n').map(card => cleanText(card)) : [];
        }

        // Only add matchInfo to the collection if we have data
        if (Object.keys(matchInfo).length > 0) {
            console.log("Match Info:", matchInfo);  // Log the full match info
            matchDetails.push(matchInfo);
        }
    });
});

// Format the data as JSON for easy reading
let jsonMatchDetails = JSON.stringify(matchDetails, null, 2);
console.log("JSON Match Details:", jsonMatchDetails);  // Final log with the complete JSON to aby se zobrazovali jak střelci, tak karty

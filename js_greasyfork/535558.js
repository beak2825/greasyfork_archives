// ==UserScript==
// @name         Gladiabots team colors (fixed)
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  Mark player names with their team color
// @author       GFX47 (fixed by Claude and gtresd)
// @match        https://*.toornament.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535558/Gladiabots%20team%20colors%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535558/Gladiabots%20team%20colors%20%28fixed%29.meta.js
// ==/UserScript==

// Configuration
const API_KEY = "428rpM4Ryf7gL8kzZEPytYfj87LRJV7E";

let teamPlayerRanks = { 'Red': [], 'Green': [], 'Blue': [] };
let teamPlayerNames = { 'Red': [], 'Green': [], 'Blue': [] };
let processedRankings = false;

function GetTeamColor(playerName) {
    // Search for exact match first
    for (const color of ['Red', 'Green', 'Blue']) {
        if (teamPlayerNames[color].includes(playerName)) {
            return color;
        }
    }

    // If no exact match, try case-insensitive
    playerName = playerName.toLowerCase();
    for (const color of ['Red', 'Green', 'Blue']) {
        const lowerCaseNames = teamPlayerNames[color].map(name => name.toLowerCase());
        const index = lowerCaseNames.indexOf(playerName);
        if (index >= 0) {
            return color;
        }
    }

    return null;
}

function GetPlayerRank(playerName) {
    // Try exact match first
    for (const color of ['Red', 'Green', 'Blue']) {
        const index = teamPlayerNames[color].indexOf(playerName);
        if (index >= 0) {
            return teamPlayerRanks[color][index];
        }
    }

    // Try case-insensitive
    playerName = playerName.toLowerCase();
    for (const color of ['Red', 'Green', 'Blue']) {
        const lowerCaseNames = teamPlayerNames[color].map(name => name.toLowerCase());
        const index = lowerCaseNames.indexOf(playerName);
        if (index >= 0) {
            return teamPlayerRanks[color][index];
        }
    }

    return null;
}

function ParseTeamData(responseText, teamName) {
    const lines = responseText.split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;

        // Find the first digit
        const firstDigitMatch = line.match(/^\d+/);
        if (!firstDigitMatch) continue;

        const playerRank = firstDigitMatch[0];
        const playerName = line.substring(playerRank.length).trim();

        if (playerName) {
            teamPlayerRanks[teamName].push(playerRank);
            teamPlayerNames[teamName].push(playerName);
        }
    }

    console.log(`Parsed ${teamPlayerNames[teamName].length} players for ${teamName} team`);
}

function GetTeamPlayers(teamID, teamName) {
    console.log(`Fetching ${teamName} team data...`);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(`Got ${teamName} team data, parsing...`);
            ParseTeamData(this.responseText, teamName);
        }
    };

    xhttp.open("GET", `https://api.gladiabots.com/teams.php?apiKey=${API_KEY}&guild=${teamID}`, false);
    xhttp.send();
}

function processPage() {
    console.log("Gladiabots team colors script running...");

    // Empty previous data in case this is called multiple times
    teamPlayerRanks = { 'Red': [], 'Green': [], 'Blue': [] };
    teamPlayerNames = { 'Red': [], 'Green': [], 'Blue': [] };
    processedRankings = false; // Reset so we process rankings again

    GetTeamPlayers(1, 'Red');
    GetTeamPlayers(2, 'Green');
    GetTeamPlayers(3, 'Blue');

    console.log("Red team players:", teamPlayerNames.Red.length);
    console.log("Green team players:", teamPlayerNames.Green.length);
    console.log("Blue team players:", teamPlayerNames.Blue.length);

    processRankings();

    colorPlayerNames();
}

function processRankings() {
    if (processedRankings) {
        console.log("Rankings already processed, skipping");
        return;
    }

    let teamScores = { 'Red': 0, 'Green': 0, 'Blue': 0 };
    let teamPlayers = { 'Red': [], 'Green': [], 'Blue': [] };
    let maxTeamScore = 0;

    let rankingElements = document.querySelectorAll('.ranking-item');
    console.log("Found ranking items:", rankingElements.length);

    if (rankingElements.length === 0) {
        console.log("No ranking items found, will retry later");
        return; // Don't set processedRankings to true, we'll try again
    }

    for (let rankingIndex = 0; rankingIndex < rankingElements.length; rankingIndex++) {
        let rankingElement = rankingElements[rankingIndex];
        if (!rankingElement || !rankingElement.textContent) {
            continue;
        }

        let rankingPlayerNameElement = rankingElement.querySelector('.name');
        if (!rankingPlayerNameElement || !rankingPlayerNameElement.textContent) {
            continue;
        }

        let rankingPlayerName = rankingPlayerNameElement.textContent.trim();
        let rankingTeamColor = GetTeamColor(rankingPlayerName);

        if (!rankingTeamColor) {
            console.log(`No team color found for player: ${rankingPlayerName}`);
            continue;
        }

        console.log(`Found player ${rankingPlayerName} in team ${rankingTeamColor}`);
        teamPlayers[rankingTeamColor].push(rankingPlayerName);

        let scoreElement = rankingElement.querySelector('.points');
        if (!scoreElement || !scoreElement.textContent) {
            continue;
        }

        scoreElement.innerHTML = '<span style="color: ' + rankingTeamColor + ';">' + scoreElement.innerHTML + '</span>';

        let scoreStr = scoreElement.textContent.trim();
        if (!scoreStr || isNaN(scoreStr)) {
            continue;
        }

        let score = parseInt(scoreStr);
        teamScores[rankingTeamColor] += score;

        if (teamScores[rankingTeamColor] > maxTeamScore) {
            maxTeamScore = teamScores[rankingTeamColor];
        }
    }

    // Count active teams
    let teamCount = 0;
    for (let teamPlayersColor in teamPlayers) {
        let teamPlayerCount = teamPlayers[teamPlayersColor].length;
        if (teamPlayerCount > 0) {
            ++teamCount;
            console.log(`${teamPlayersColor} team: ${teamPlayerCount} players found, total score: ${teamScores[teamPlayersColor]}`);
        }
    }
    console.log("Active teams:", teamCount);

    // Add team bars
    if (teamCount > 0) {
        let rankingsElement = document.querySelector('.ranking');
        if (rankingsElement != null) {
            // Create a container for team summary
            let teamSummaryContainer = document.createElement('div');
            teamSummaryContainer.id = 'gladiabots-team-summary';

            for (let teamScoresColor in teamScores) {
                let teamScore = teamScores[teamScoresColor];
                let teamPlayerCount = teamPlayers[teamScoresColor].length;

                if (teamPlayerCount < 1) {
                    continue;
                }

                let barSize = maxTeamScore > 0 ? (100 * teamScore / maxTeamScore) : 0;

                let teamBar = document.createElement('div');
                teamBar.style.backgroundColor = teamScoresColor;
                teamBar.style.width = barSize + '%';
                teamBar.style.float = 'left';
                teamBar.style.height = '20px';
                teamSummaryContainer.appendChild(teamBar);

                let teamLabel = document.createElement('span');
                teamLabel.style.color = 'white';
                teamLabel.style.textShadow = 'black 2px 2px';
                teamLabel.style.float = 'left';
                teamLabel.style.marginLeft = '-' + barSize + '%';
                teamLabel.textContent = `${teamScoresColor} Team (${teamPlayerCount}): ${teamScore}`;
                teamSummaryContainer.appendChild(teamLabel);

                let clearDiv = document.createElement('div');
                clearDiv.style.clear = 'both';
                teamSummaryContainer.appendChild(clearDiv);
            }

            // Remove existing summary if present
            let existingSummary = document.getElementById('gladiabots-team-summary');
            if (existingSummary) {
                existingSummary.remove();
            }

            // Append new summary at the beginning of the rankings
            rankingsElement.insertBefore(teamSummaryContainer, rankingsElement.firstChild);

            processedRankings = true;
            console.log("Team summary added to page");
        } else {
            console.log("Rankings element not found");
        }
    } else {
        console.log("No active teams found");
    }
}

function colorPlayerNames() {
    let playerNameElements = document.querySelectorAll('.name');
    console.log("Found player name elements:", playerNameElements.length);

    for (let playerIndex = 0; playerIndex < playerNameElements.length; playerIndex++) {
        let playerNameElement = playerNameElements[playerIndex];
        if (!playerNameElement || !playerNameElement.textContent) {
            continue;
        }

        let playerName = playerNameElement.textContent.trim();
        if (!playerName) {
            continue;
        }

        let teamColor = GetTeamColor(playerName);
        if (teamColor != null) {
            // Only update if not already colored
            if (!playerNameElement.innerHTML.includes('style="color:')) {
                let playerRank = GetPlayerRank(playerName);
                console.log(`Coloring player ${playerName} as ${teamColor} with rank ${playerRank}`);

                playerNameElement.innerHTML =
                    '<span style="color: ' + teamColor + ';">' +
                    playerName +
                    (playerRank > 0 ? ' (#'+playerRank+')' : '') +
                    '</span>';
            }
        }
    }
}

function hasRankings() {
    return document.querySelectorAll('.ranking-item').length > 0;
}

window.addEventListener('load', function() {
    processPage();

    // If rankings weren't found, set up repeated checking
    if (!processedRankings) {
        console.log("Rankings not found, setting up interval checks");
        let checkInterval = setInterval(function() {
            if (hasRankings()) {
                console.log("Rankings found, processing page");
                processPage();
                clearInterval(checkInterval);
            }
        }, 1000);
    }

    // Set up a MutationObserver to detect when new content is loaded
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // Check if any rankings were added
                let newRankingsAdded = false;
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.classList?.contains('ranking-item') || node.querySelector?.('.ranking-item'))) {
                        newRankingsAdded = true;
                        break;
                    }
                }

                if (newRankingsAdded) {
                    console.log("New rankings detected, processing page");
                    processPage();
                } else {
                    colorPlayerNames();
                }
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

// Run immediately in case the page is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(processPage, 500);
}
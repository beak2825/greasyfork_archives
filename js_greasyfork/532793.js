// ==UserScript==
// @name         NitroType Tier Test and Duel Logger
// @namespace    http://tampermonkey.net/
// @version      1.15.1
// @description  Input exact player names. When logging is ON, the script waits until each tracked player's race row (exact match) shows a finish time ("secs") then logs a merged summary with sequential numbering. It computes cumulative averages (tiers from rounded averages) and updates a cumulative score (e.g., "1-0" if player A wins). The UI shows total races & current score, allows deletion, and exports formatted results. Data persists.
// @license      MIT
// @match        *://www.nitrotype.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532793/NitroType%20Tier%20Test%20and%20Duel%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/532793/NitroType%20Tier%20Test%20and%20Duel%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Variables ---
    let selectedPlayers = JSON.parse(localStorage.getItem("nitroSelectedPlayers") || "[]");
    const RESULTS_KEY = "nitroTierTests";
    const LOGGING_STATE_KEY = "nitroLoggingActive";
    const CUM_STATS_KEY = "nitroCumulativeStats";  // For cumulative stats (sums & counts)
    const SCORE_KEY = "nitroScore";                // For cumulative score
    let observer = null;
    let isLogging = false;

    // ========================
    // Tier Calculation Helper (with rounding)
    // ========================
    function getTier(avgWpm) {
        let rounded = Math.round(avgWpm);
        if (rounded >= 175) return "HT1";
        else if (rounded >= 160) return "LT1";
        else if (rounded >= 145) return "HT2";
        else if (rounded >= 130) return "LT2";
        else if (rounded >= 115) return "HT3";
        else if (rounded >= 100) return "LT3";
        else if (rounded >= 85)  return "HT4";
        else if (rounded >= 70)  return "LT4";
        else if (rounded >= 50)  return "HT5";
        else return "LT5";
    }

    // ========================
    // Cumulative Score & Stats Helpers
    // ========================
    function getCumulativeScore() {
        return JSON.parse(localStorage.getItem(SCORE_KEY) || '{"A":0,"B":0}');
    }
    function saveCumulativeScore(scoreObj) {
        localStorage.setItem(SCORE_KEY, JSON.stringify(scoreObj));
    }
    function getCumulativeStats() {
        return JSON.parse(localStorage.getItem(CUM_STATS_KEY) || "{}");
    }
    function saveCumulativeStats(stats) {
        localStorage.setItem(CUM_STATS_KEY, JSON.stringify(stats));
    }
    // Updates cumulative stats by adding the data from a new race's entries.
    function updateCumulativeStats(newRaceEntries) {
        let stats = getCumulativeStats();
        newRaceEntries.forEach(entry => {
            const name = entry.username;
            const wpm = parseFloat(entry.wpm);
            const acc = parseFloat(entry.accuracy);
            if (!stats[name]) {
                stats[name] = { sumWpm: 0, sumAcc: 0, count: 0 };
            }
            stats[name].sumWpm += isNaN(wpm) ? 0 : wpm;
            stats[name].sumAcc += isNaN(acc) ? 0 : acc;
            stats[name].count += 1;
        });
        saveCumulativeStats(stats);
    }
    function getCumulativeAverages() {
        let stats = getCumulativeStats();
        let averages = {};
        selectedPlayers.forEach(name => {
            if (stats[name] && stats[name].count > 0) {
                averages[name] = {
                    avgWpm: (stats[name].sumWpm / stats[name].count).toFixed(2),
                    avgAcc: (stats[name].sumAcc / stats[name].count).toFixed(2)
                };
            } else {
                averages[name] = { avgWpm: "N/A", avgAcc: "N/A" };
            }
        });
        return averages;
    }

    // ========================
    // Storage Helpers for Race Results
    // ========================
    function getStoredResults() {
        return JSON.parse(localStorage.getItem(RESULTS_KEY) || "[]");
    }
    function saveStoredResults(results) {
        localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    }

    // ========================
    // Helper: Extract Exact Player Name from a Row
    // ========================
    function getPlayerNameFromRow(row) {
        const container = row.querySelector('.raceResults-playerName .player-name--container');
        if (!container) return "";
        const span = container.querySelector('span.type-ellip');
        if (span) return span.textContent.trim();
        const anchor = container.querySelector('a');
        if (anchor) return anchor.textContent.replace(/[\[\]]/g, '').trim();
        return container.textContent.trim();
    }

    // ========================
    // UI Creation
    // ========================
    function createUI() {
        if (document.getElementById('nt-tier-test-logger-ui')) return;

        const container = document.createElement('div');
        container.id = 'nt-tier-test-logger-ui';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        container.style.maxWidth = '250px';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';

        // The header now includes race count and current score.
        container.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold;">Tier Test Logger</div>
            <!-- Player Management Section -->
            <div>
              <input type="text" id="playerNameInput" placeholder="Enter exact player name" style="width: 150px; padding: 5px;" />
              <button id="addPlayerButton" style="padding: 5px;">Add</button>
              <button id="clearPlayersBtn" style="padding: 5px;">Clear Players</button>
              <div id="playersList" style="margin-top: 8px; border: 1px solid #eee; padding: 5px; max-height: 100px; overflow-y: auto;"></div>
            </div>
            <hr style="margin: 8px 0;">
            <!-- Logging Controls Section -->
            <div>
              <button id="toggleLoggingBtn" style="padding: 5px;">Logging: OFF</button>
              <button id="saveResultsBtn" style="padding: 5px;">Save Results</button>
              <button id="clearResultsBtn" style="padding: 5px;">Clear Results</button>
            </div>
            <hr style="margin: 8px 0;">
            <!-- Race Results Header -->
            <div style="font-weight: bold; margin-bottom: 5px;">
              Race Results (<span id="raceCount">0</span> Total) | Current Score: <span id="currentScore">0-0</span>
            </div>
            <!-- Race Results Display Section -->
            <div id="raceResultsUI" style="border: 1px solid #eee; padding: 5px; max-height: 200px; overflow-y: auto;"></div>
        `;
        document.body.appendChild(container);

        document.getElementById('addPlayerButton').addEventListener('click', () => {
            const input = document.getElementById('playerNameInput');
            let player = input.value.trim();
            if (player && !selectedPlayers.includes(player)) {
                selectedPlayers.push(player);
                localStorage.setItem("nitroSelectedPlayers", JSON.stringify(selectedPlayers));
                updatePlayersList();
            }
            input.value = '';
        });
        document.getElementById('clearPlayersBtn').addEventListener('click', () => {
            selectedPlayers = [];
            localStorage.setItem("nitroSelectedPlayers", JSON.stringify(selectedPlayers));
            updatePlayersList();
        });
        document.getElementById('toggleLoggingBtn').addEventListener('click', toggleLogging);
        document.getElementById('saveResultsBtn').addEventListener('click', showResultsInNewTab);
        document.getElementById('clearResultsBtn').addEventListener('click', clearResults);

        updatePlayersList();
        updateRaceResultsUI();
    }

    function updatePlayersList() {
        const listDiv = document.getElementById('playersList');
        listDiv.innerHTML = '';
        if (selectedPlayers.length === 0) {
            listDiv.textContent = 'No players added.';
            return;
        }
        const ul = document.createElement('ul');
        selectedPlayers.forEach((player, index) => {
            const li = document.createElement('li');
            li.style.fontSize = '12px';
            li.textContent = player + " ";
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.fontSize = '10px';
            removeBtn.style.marginLeft = '5px';
            removeBtn.addEventListener('click', () => {
                selectedPlayers.splice(index, 1);
                localStorage.setItem("nitroSelectedPlayers", JSON.stringify(selectedPlayers));
                updatePlayersList();
            });
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
        listDiv.appendChild(ul);
    }

    function updateRaceResultsUI() {
        const container = document.getElementById('raceResultsUI');
        const storedResults = getStoredResults();
        container.innerHTML = '';
        // Update race count and current score in the header.
        document.getElementById('raceCount').textContent = storedResults.length;
        let cumulativeScore = getCumulativeScore();
        document.getElementById('currentScore').textContent = `${cumulativeScore.A || 0}-${cumulativeScore.B || 0}`;
        if (storedResults.length === 0) {
            container.textContent = 'No results yet.';
            return;
        }
        const ul = document.createElement('ul');
        storedResults.forEach((result, index) => {
            const li = document.createElement('li');
            li.style.fontSize = '12px';
            li.style.marginBottom = '3px';
            li.innerHTML = `Race ${result.raceNumber}: ${result.details}. Cumulative Averages: ${result.cumAverages}. Score: ${result.score} `;
            const delBtn = document.createElement('button');
            delBtn.textContent = "Delete";
            delBtn.style.fontSize = '10px';
            delBtn.style.marginLeft = '5px';
            delBtn.style.backgroundColor = "red";
            delBtn.style.color = "white";
            delBtn.style.border = "none";
            delBtn.style.padding = "2px 5px";
            delBtn.addEventListener('click', () => deleteRace(index));
            li.appendChild(delBtn);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    // ========================
    // Recalculate Cumulative Stats and Score
    // ========================
    function recalcCumulative() {
        let results = getStoredResults();
        let newStats = {};           // Rebuild cumulative stats from remaining races
        let newScore = { A: 0, B: 0 };  // Recalculate cumulative score

        results.forEach(race => {
            if (race.rawEntries && race.rawEntries.length > 0) {
                // Rebuild cumulative stats for each player in this race
                race.rawEntries.forEach(entry => {
                    const username = entry.username;
                    const wpm = parseFloat(entry.wpm);
                    const acc = parseFloat(entry.accuracy);
                    if (!newStats[username]) {
                        newStats[username] = { sumWpm: 0, sumAcc: 0, count: 0 };
                    }
                    newStats[username].sumWpm += isNaN(wpm) ? 0 : wpm;
                    newStats[username].sumAcc += isNaN(acc) ? 0 : acc;
                    newStats[username].count += 1;
                });
                // Update score by checking which player won this race
                let winningEntry = race.rawEntries.find(entry => entry.winnerIndicator);
                if (winningEntry) {
                    if (selectedPlayers[0] && winningEntry.username === selectedPlayers[0].trim()) {
                        newScore.A += 1;
                    } else if (selectedPlayers[1] && winningEntry.username === selectedPlayers[1].trim()) {
                        newScore.B += 1;
                    }
                }
            }
        });
        saveCumulativeStats(newStats);
        saveCumulativeScore(newScore);
    }

    // ========================
    // Delete Race Function (Updated)
    // ========================
    function deleteRace(index) {
        let results = getStoredResults();
        if (index < 0 || index >= results.length) return;
        results.splice(index, 1);
        // Reassign race numbers after deletion
        results.forEach((res, i) => { res.raceNumber = i + 1; });
        saveStoredResults(results);

        // Recalculate cumulative stats and score based on the remaining races
        recalcCumulative();

        updateRaceResultsUI();
        console.log(`Deleted race #${index + 1} and recalculated cumulative stats and score.`);
    }

    // ========================
    // Process Race Results
    // ========================
    function processRaceResults() {
        const raceContainer = document.querySelector('.gridTable.gridTable--raceResults');
        if (!raceContainer) return;
        if (raceContainer.dataset.processed === "true") return;
        const rows = Array.from(raceContainer.querySelectorAll('.gridTable-row'));
        let trackedRows = rows.filter(row => {
            const name = getPlayerNameFromRow(row);
            if (!selectedPlayers.includes(name)) return false;
            const statsContainer = row.querySelector('.split.split--flag.split--reverse .list.list--inline');
            if (!statsContainer) return false;
            const listItems = statsContainer.querySelectorAll('.list-item');
            return listItems.length >= 3 && listItems[2].textContent.includes("secs");
        });
        let expectedCount = rows.filter(row => selectedPlayers.includes(getPlayerNameFromRow(row))).length;
        if (expectedCount > 1 && trackedRows.length < expectedCount) return;
        raceContainer.dataset.processed = "true";
        let resultsArray = getStoredResults();
        let raceNumber = resultsArray.length > 0 ? (resultsArray[resultsArray.length - 1].raceNumber + 1) : 1;
        let newEntries = trackedRows.map(row => {
            const username = getPlayerNameFromRow(row);
            const statsContainer = row.querySelector('.split.split--flag.split--reverse .list.list--inline');
            const listItems = statsContainer.querySelectorAll('.list-item');
            const wpm = listItems[0].textContent.trim().split(" ")[0];
            const acc = listItems[1].textContent.trim().toLowerCase().includes("n/a") ? "N/A" : listItems[1].textContent.trim().split("%")[0];
            return {
                username: username,
                wpm: parseFloat(wpm),
                accuracy: parseFloat(acc),
                winnerIndicator: ""
            };
        });
        newEntries.sort((a, b) => selectedPlayers.indexOf(a.username) - selectedPlayers.indexOf(b.username));
        let winningEntry = null;
        if (newEntries.length >= 2) {
            let maxWpm = -Infinity;
            newEntries.forEach(entry => {
                if (entry.wpm > maxWpm) {
                    maxWpm = entry.wpm;
                    winningEntry = entry;
                }
            });
            if (winningEntry) {
                if (selectedPlayers[0] && winningEntry.username === selectedPlayers[0].trim()) {
                    winningEntry.winnerIndicator = "A";
                } else if (selectedPlayers[1] && winningEntry.username === selectedPlayers[1].trim()) {
                    winningEntry.winnerIndicator = "B";
                }
            }
        }
        updateCumulativeStats(newEntries);
        const cumAverages = getCumulativeAverages();
        let cumAvgStr = selectedPlayers.map(name => {
            if (cumAverages[name] && cumAverages[name].avgWpm !== "N/A") {
                let avgWpm = parseFloat(cumAverages[name].avgWpm);
                let tier = getTier(avgWpm);
                return `${name}: ${cumAverages[name].avgWpm} WPM, ${cumAverages[name].avgAcc}% Acc, Tier: ${tier}`;
            } else {
                return `${name}: N/A`;
            }
        }).join("; ");
        let cumulativeScore = getCumulativeScore();
        if (newEntries.length >= 2 && winningEntry) {
            if (winningEntry.username === selectedPlayers[0].trim()) {
                cumulativeScore.A = (cumulativeScore.A || 0) + 1;
            } else if (selectedPlayers[1] && winningEntry.username === selectedPlayers[1].trim()) {
                cumulativeScore.B = (cumulativeScore.B || 0) + 1;
            }
            saveCumulativeScore(cumulativeScore);
        }
        let scoreStr = `${cumulativeScore.A || 0}-${cumulativeScore.B || 0}`;
        let detailsStr = newEntries.map(entry => {
            let s = `${entry.username}: ${entry.wpm} WPM, ${entry.accuracy}%`;
            if (entry.winnerIndicator) {
                s += ` (Winner: ${entry.winnerIndicator})`;
            }
            return s;
        }).join("; ");
        let summary = {
            raceNumber: raceNumber,
            details: detailsStr,
            cumAverages: cumAvgStr,
            score: scoreStr,
            rawEntries: newEntries
        };
        resultsArray.push(summary);
        saveStoredResults(resultsArray);
        updateRaceResultsUI();
        console.log(`Processed Race #${raceNumber}:`, summary);
    }

    // ========================
    // Logging Control Functions
    // ========================
    function startLogging() {
        processRaceResults();
        observer = new MutationObserver(mutationsList => {
            processRaceResults();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        isLogging = true;
        document.getElementById('toggleLoggingBtn').textContent = "Logging: ON";
        localStorage.setItem(LOGGING_STATE_KEY, "true");
        console.log("Logging turned ON (results persist across pages).");
    }
    function stopLogging() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        isLogging = false;
        document.getElementById('toggleLoggingBtn').textContent = "Logging: OFF";
        localStorage.setItem(LOGGING_STATE_KEY, "false");
        console.log("Logging turned OFF (stored results are preserved).");
    }
    function toggleLogging() {
        if (isLogging) {
            stopLogging();
        } else {
            startLogging();
        }
    }

    // ========================
    // Save & Clear Functions
    // ========================
    function showResultsInNewTab() {
        let results = getStoredResults();
        if (results.length === 0) {
            alert("No results to show.");
            return;
        }
        let ntUsernames = selectedPlayers.join(" / ");
        let prevRanks = selectedPlayers.map(() => "N/A").join(" / ");
        let cumAvgs = getCumulativeAverages();
        let ranksAttained = selectedPlayers.map(name => {
            if (cumAvgs[name] && cumAvgs[name].avgWpm !== "N/A") {
                return getTier(parseFloat(cumAvgs[name].avgWpm));
            } else {
                return "N/A";
            }
        }).join(" / ");
        let avScores = selectedPlayers.map(name => {
            if (cumAvgs[name] && cumAvgs[name].avgWpm !== "N/A") {
                return cumAvgs[name].avgWpm;
            } else {
                return "N/A";
            }
        }).join(" vs ");
        let lastRace = results[results.length - 1];
        let winnerName = "N/A";
        if (lastRace.rawEntries) {
            for (let entry of lastRace.rawEntries) {
                if (entry.winnerIndicator) {
                    winnerName = entry.username;
                    break;
                }
            }
        }
        let resultLine = `${winnerName} wins ${lastRace.score}`;
        let scoresSection = results.map(race => {
            if (race.rawEntries && race.rawEntries.length >= 2) {
                let first = race.rawEntries[0];
                let second = race.rawEntries[1];
                let winIndicator = "";
                for (let entry of race.rawEntries) {
                    if (entry.winnerIndicator) {
                        winIndicator = entry.winnerIndicator;
                        break;
                    }
                }
                return `${first.wpm} (${first.accuracy}%) vs ${second.wpm} (${second.accuracy}%) — ${winIndicator}`;
            } else if (race.rawEntries && race.rawEntries.length === 1) {
                let only = race.rawEntries[0];
                return `${only.wpm} (${only.accuracy}%)`;
            } else {
                return race.details;
            }
        }).join('\n');
        let finalOutput = `NT usernames: ${ntUsernames}
Previous Ranks: ${prevRanks}
Ranks Attained: ${ranksAttained}
Av Scores: ${avScores}
Result: ${resultLine}

Scores:
${scoresSection}`;
        let newTab = window.open('', '_blank');
        if (!newTab) {
            alert("Could not open new tab. Please allow pop-ups for NitroType.");
            return;
        }
        newTab.document.write('<html><head><title>Race Results</title></head><body>');
        newTab.document.write('<pre style="white-space: pre-wrap;">' + finalOutput + '</pre>');
        newTab.document.write('</body></html>');
        newTab.document.close();
    }
    function clearResults() {
        saveStoredResults([]);
        updateRaceResultsUI();
        saveCumulativeStats({});
        saveCumulativeScore({A: 0, B: 0});
        console.log("Cleared stored race results, cumulative stats, and cumulative score.");
    }

    // ========================
    // Initialization
    // ========================
    window.addEventListener('load', () => {
        createUI();
        if (localStorage.getItem(LOGGING_STATE_KEY) === "true") {
            startLogging();
        }
    });
})();

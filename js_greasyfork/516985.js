// ==UserScript==
// @name         Bwin Live Match 2
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Fetch live data for sports matches from bwin and display it in a custom table
// @author       Michal
// @match        https://example.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516985/Bwin%20Live%20Match%202.user.js
// @updateURL https://update.greasyfork.org/scripts/516985/Bwin%20Live%20Match%202.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let previousHash = null;

    async function fetchData(matchId) {
        const apiURL = `https://sports.bwin.com/cds-api/bettingoffer/fixture-view?x-bwin-accessid=NTZiMjk3OGMtNjU5Mi00NjA5LWI2MWItZmU4MDRhN2QxZmEz&lang=en&country=CZ&userCountry=CZ&offerMapping=All&scoreboardMode=Full&fixtureIds=${matchId}&state=Latest&includePrecreatedBetBuilder=true&supportVirtual=true&isBettingInsightsEnabled=false&useRegionalisedConfiguration=true&includeRelatedFixtures=false&statisticsModes=None`;

        try {
            const response = await fetch(apiURL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    function generateTable() {
        let table = document.getElementById('custom-table');
        if (!table) {
            table = createTableStructure();
            document.body.appendChild(table);
        }
        return table;
    }

    function createTableStructure() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .custom-table {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-collapse: collapse;
                border: 3px solid black;
                background-color: white;
                font-size: 20px;
                color: black;
                z-index: 999;
            }
            .custom-table th,
            .custom-table td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
                color: black;
            }
            .custom-table th:first-child,
            .custom-table td:first-child {
                text-align: right;
                padding-right: 10px;
            }
        `;
        document.head.appendChild(style);

        const table = document.createElement('table');
        table.id = 'custom-table';
        table.className = 'custom-table';
        table.innerHTML = `
            <tr><th id="status-header">Status:</th><td id="status">N/A</td></tr>
            <tr><th id="score-header">Score:</th><td id="score">N/A</td></tr>
            <tr><th id="time-header">Time:</th><td id="time-indicator">N/A</td></tr>
            <tr><th id="home-team-header">Home Team:</th><td id="home-team">N/A</td></tr>
            <tr><th id="away-team-header">Away Team:</th><td id="away-team">N/A</td></tr>
            <tr><th id="stage-header">Stage:</th><td id="stage">N/A</td></tr>
            <tr><th>Set 1:</th><td id="set1">N/A</td></tr>
            <tr><th>Set 2:</th><td id="set2">N/A</td></tr>
            <tr><th>Set 3:</th><td id="set3">N/A</td></tr>
            <tr><th>Set 4:</th><td id="set4">N/A</td></tr>
            <tr><th>Set 5:</th><td id="set5">N/A</td></tr>
            <tr><th>Score Tenis:</th><td id="tennis-score">N/A</td></tr>
            <tr><th>Žluté karty (Domácí):</th><td id="yellow-cards-home">N/A</td></tr>
            <tr><th>Žluté karty (Hosté):</th><td id="yellow-cards-away">N/A</td></tr>
            <tr><th>Červené karty (Domácí):</th><td id="red-cards-home">N/A</td></tr>
            <tr><th>Červené karty (Hosté):</th><td id="red-cards-away">N/A</td></tr>
            <tr><th>Střídání (Domácí):</th><td id="substitutions-home">N/A</td></tr>
            <tr><th>Střídání (Hosté):</th><td id="substitutions-away">N/A</td></tr>
            <tr><td colspan="2" style="text-align:center; font-size:14px; color:gray;">Tento skript je majetkem Michala Hornoka, fanouška týmu AC Sparta Praha.</td></tr>
        `;
        return table;
    }

    function formatTime(time) {
        if (time && typeof time === 'string') {
            return time.replace('<', '').trim();
        }
        return time || 'N/A';
    }

    function updateTableContent(fixture) {
        const score = fixture?.scoreboard?.score || "N/A";
        const period = fixture?.scoreboard?.period || "N/A";
        const timeIndicator = formatTime(fixture?.scoreboard?.indicator) || "N/A";

        const teams = fixture?.name?.value?.split('-') || [];
        const homeTeam = teams[0]?.trim() || "N/A";
        const awayTeam = teams[1]?.trim() || "N/A";

        const stage = fixture?.stage || "N/A";

        document.getElementById('status').innerText = period;
        document.getElementById('score').innerText = score;
        document.getElementById('time-indicator').innerText = timeIndicator;
        document.getElementById('home-team').innerText = homeTeam;
        document.getElementById('away-team').innerText = awayTeam;
        document.getElementById('stage').innerText = stage;


        const sets = fixture?.scoreboard?.sets || [];
        for (let i = 0; i < 5; i++) {
            const homeSetScore = sets[0]?.[i] || "0";
            const awaySetScore = sets[1]?.[i] || "0";
            document.getElementById(`set${i+1}`).innerText = `${homeSetScore}:${awaySetScore}`;
        }

        const tennisScoreHome = fixture?.scoreboard?.points?.[0] || "0";
        const tennisScoreAway = fixture?.scoreboard?.points?.[1] || "0";
        document.getElementById('tennis-score').innerText = `${tennisScoreHome}:${tennisScoreAway}`;

        const yellowCardsHome = (fixture?.scoreboard?.yellowCards?.player1?.[1] || 0) + (fixture?.scoreboard?.yellowCards?.player1?.[3] || 0);
        const yellowCardsAway = (fixture?.scoreboard?.yellowCards?.player2?.[1] || 0) + (fixture?.scoreboard?.yellowCards?.player2?.[3] || 0);
        document.getElementById('yellow-cards-home').innerText = yellowCardsHome;
        document.getElementById('yellow-cards-away').innerText = yellowCardsAway;

        const redCardsHome = (fixture?.scoreboard?.redCards?.player1?.[1] || 0) + (fixture?.scoreboard?.redCards?.player1?.[3] || 0);
        const redCardsAway = (fixture?.scoreboard?.redCards?.player2?.[1] || 0) + (fixture?.scoreboard?.redCards?.player2?.[3] || 0);
        document.getElementById('red-cards-home').innerText = redCardsHome;
        document.getElementById('red-cards-away').innerText = redCardsAway;

        const substitutionsHome = (fixture?.scoreboard?.substitutions?.player1?.[1] || 0) + (fixture?.scoreboard?.substitutions?.player1?.[3] || 0);
        const substitutionsAway = (fixture?.scoreboard?.substitutions?.player2?.[1] || 0) + (fixture?.scoreboard?.substitutions?.player2?.[3] || 0);
        document.getElementById('substitutions-home').innerText = substitutionsHome;
        document.getElementById('substitutions-away').innerText = substitutionsAway;
    }

    function markMatchFinished() {
        const table = generateTable();
        document.getElementById('status').innerText = 'Match Finished';


        const timeCell = document.getElementById('time-indicator');
        if (timeCell) {
            timeCell.innerText = '0:00';
        }
    }

    async function checkDataAndUpdate() {
        const urlHash = window.location.hash;
        const matchURLPattern = /https:\/\/sports\.bwin\.com\/(\d+:?\d+)/;
        const match = urlHash.match(matchURLPattern);

        if (match) {
            const matchId = match[1];
            const data = await fetchData(matchId);

            if (data && data.fixture) {
                const newHash = JSON.stringify(data.fixture);
                if (newHash !== previousHash) {
                    generateTable();
                    updateTableContent(data.fixture);
                    previousHash = newHash;
                }
            } else if (data && data.splitFixtures?.length === 0) {
                markMatchFinished();
            }
        }
    }

    setInterval(checkDataAndUpdate, 3000);
})();
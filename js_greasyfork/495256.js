// ==UserScript==
// @name         ylStatsCollectorAdvNewGPT
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Mz stats collector
// @author       You
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495256/ylStatsCollectorAdvNewGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/495256/ylStatsCollectorAdvNewGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let Teams = [];
    let allPromises = [];
    let goalsSel, shotsSel, scSel, passSel, passprcntSel, tcklSel, tcklprcntSel, interSel, savesSel;

    updateStatsSelectors();

    $(".win_bg .win_title").dblclick(function() {
        let links = $('[aria-labelledby="league_tab_schedule"] div a:not(:contains("X")), #ui-tabs-3 table.hitlist a:not(:contains("X"))'); //gets all links
        console.log("liczymy");
        console.log(links.length);
        generateStats(links);
    });

    $(".icon-explanation-text").dblclick(function() {
        let links = $('#fixtures-results-list a.score-shown:not(:contains("X"))'); //gets all links
        console.log("liczymy");
        console.log(links.length);
        Teams = [];
        const chosen = $('#expander-menu .win_bg h1.win_title').text().length > 0 ? $('#expander-menu .win_bg h1.win_title').text() : "Yelonki"; //replace with your team name
        generateStats(links, chosen);
    });

    function generateStats(links, chosen) {
        if (chosen) {
            Teams.push(createTeam("away" + chosen));
            Teams.push(createTeam("home" + chosen));
        }

        links.each(function() {
            allPromises.push($.get($(this).attr("href"), {}, function(content) {
                let homeDiv = $(content).find(".hitlist_wrapper_background:first");
                let awayDiv = $(content).find(".hitlist_wrapper_background:last");
                let teamName = $(content).find(".hitlist_wrapper_background:first").prev().text().trim();
                let teamAwayName = $(content).find(".hitlist_wrapper_background:last").prev().text().trim();

                addTeamIfMissing(teamName);
                addTeamIfMissing(teamAwayName);
                addTeamIfMissing("away");
                addTeamIfMissing("home");

                updateTeamsStats(teamName, homeDiv, awayDiv);
                updateTeamsStats(teamAwayName, awayDiv, homeDiv);
                updateTeamsStats("home", homeDiv, awayDiv);
                updateTeamsStats("away", awayDiv, homeDiv);

                if (teamAwayName === chosen) updateTeamsStats("away" + chosen, awayDiv, homeDiv);
                if (teamName === chosen) updateTeamsStats("home" + chosen, homeDiv, awayDiv);
            }));
        });

        $.when.apply($, allPromises).always(function() {
            processTeamsData();
            createStatsDiv(); // Create the stats div after processing data
        });
    }

    function addTeamIfMissing(teamName) {
        if (Teams.filter(team => team.name === teamName).length === 0) {
            Teams.push(createTeam(teamName));
        }
    }

    function processTeamsData() {
        Teams.forEach(team => {
            team.eff = roundToTwoDecimals(team.sc / team.goals);
            team.off = roundToTwoDecimals(team.scOpp / team.goalsOpp);
            team.ffdif = roundToTwoDecimals(team.off - team.eff);
            team.tacklesOk = roundToTwoDecimals(team.tacklesOk / team.tackles);
            team.passPerShot = roundToTwoDecimals(team.passOk / team.sc);
            team.passOk = roundToTwoDecimals(team.passOk / team.pass);
            team.tcklsOppSucc = roundToTwoDecimals(team.tcklsOppSucc / team.tcklsOpp);
            team.tacklsSurvived = (1 - team.tcklsOppSucc).toFixed(2);
        });

        console.table(Teams);
    }

    function createTeam(name) {
        return {
            name,
            eff: 0,
            off: 0,
            ffdif: 0,
            goals: 0,
            shots: 0,
            sc: 0,
            goalsOpp: 0,
            scOpp: 0,
            pass: 0,
            passOk: 0,
            tackles: 0,
            tacklesOk: 0,
            interceptions: 0,
            tcklsOpp: 0,
            tcklsOppSucc: 0,
            tacklsSurvived: 0,
            played: 0
        };
    }

    function updateTeamStats(team, div) {
        team.played++;
        team.goals += getNumberFromCell(div, goalsSel);
        team.shots += getNumberFromCell(div, shotsSel);
        team.sc += getNumberFromCell(div, scSel);
        team.pass += getNumberFromCell(div, passSel);
        team.passOk += Math.round(getNumberFromCell(div, passSel) * getPercentageFromCell(div, passprcntSel));
        team.tackles += getNumberFromCell(div, tcklSel);
        team.tacklesOk += Math.round(getNumberFromCell(div, tcklSel) * getPercentageFromCell(div, tcklprcntSel));
        team.interceptions += getNumberFromCell(div, interSel);
    }

    function updateTeamsStats(teamName, teamDiv, opponentDiv) {
        const teamIndex = Teams.findIndex(team => team.name === teamName);
        if (teamIndex !== -1) {
            updateTeamStats(Teams[teamIndex], teamDiv);
            Teams[teamIndex].goalsOpp += getNumberFromCell(opponentDiv, goalsSel);
            Teams[teamIndex].scOpp += getNumberFromCell(opponentDiv, scSel);
            Teams[teamIndex].tcklsOpp += getNumberFromCell(opponentDiv, tcklSel);
            Teams[teamIndex].tcklsOppSucc += Math.round(getNumberFromCell(opponentDiv, tcklSel) * getPercentageFromCell(opponentDiv, tcklprcntSel));
        }
    }

    function updateStatsSelectors() {
        goalsSel = "tfoot tr:nth(1) td:nth(3)";
        shotsSel = "tfoot tr:nth(1) td:nth(4)";
        scSel = "tfoot tr:nth(1) td:nth(5)";
        passSel = "tfoot tr:nth(1) td:nth(6)";
        passprcntSel = "tfoot tr:nth(1) td:nth(7)";
        tcklSel = "tfoot tr:nth(1) td:nth(8)";
        tcklprcntSel = "tfoot tr:nth(1) td:nth(9)";
        interSel = "tfoot tr:nth(1) td:nth(11)";
    }

    function roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
    }

    function getNumberFromCell(div, selector) {
        return +div.find(selector).text().trim();
    }

    function getPercentageFromCell(div, selector) {
        return +(div.find(selector).text().trim().replace("%", "")) / 100;
    }

    function createStatsDiv() {
        const table = createStatsTable(Teams);

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.width = '100%';
        container.style.backgroundColor = 'white';
        container.style.zIndex = '1000';
        container.style.overflowX = 'auto';

        container.appendChild(table);
        document.body.appendChild(container);
    }

    function createStatsTable(data) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = table.createTHead();
        const headers = [
            'Name', 'Eff', 'Off', 'Ffdif', 'Goals', 'Shots', 'Sc',
            'GoalsOpp', 'ScOpp', 'Pass', 'PassOk', 'Tackles', 'TacklesOk',
            'Interceptions', 'TcklsOpp', 'TcklsOppSucc', 'TacklsSurvived', 'Played'
        ];
        const row = thead.insertRow();
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.appendChild(document.createTextNode(headerText));
            th.style.border = '1px solid black';
            th.style.padding = '5px';
            th.style.cursor = 'pointer';
            th.onclick = () => sortTableByColumn(table, headers.indexOf(headerText));
            row.appendChild(th);
        });

        const tbody = table.createTBody();
        data.forEach(team => {
            const row = tbody.insertRow();
            Object.values(team).forEach(val => {
                const cell = row.insertCell();
                cell.appendChild(document.createTextNode(val));
                cell.style.border = '1px solid black';
                cell.style.padding = '5px';
            });
        });

        return table;
    }

    function sortTableByColumn(table, column) {
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.rows);
        const ascending = !table.dataset.sortOrder || table.dataset.sortOrder === 'desc';

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[column].innerText;
            const cellB = rowB.cells[column].innerText;
            const valA = isNaN(cellA) ? cellA : +cellA;
            const valB = isNaN(cellB) ? cellB : +cellB;

            return ascending ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
        });

        rows.forEach(row => tbody.appendChild(row));
        table.dataset.sortOrder = ascending ? 'asc' : 'desc';
    }
})();

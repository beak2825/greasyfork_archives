// ==UserScript==
// @name         ylStatsCollectorAdvNewGPTo
// @namespace    http://tampermonkey.net/
// @version      0.851
// @description  Mz stats collector with colored cells excluding 'away' and 'home' rows, per match calculations
// @author       You
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495693/ylStatsCollectorAdvNewGPTo.user.js
// @updateURL https://update.greasyfork.org/scripts/495693/ylStatsCollectorAdvNewGPTo.meta.js
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
        const totalLinks = links.length;
        let processedLinks = 0;
        links.each(function() {
            allPromises.push($.get($(this).attr("href"), {}, function(content) {
                let homeDiv = $(content).find(".hitlist_wrapper_background:first");
                let awayDiv = $(content).find(".hitlist_wrapper_background:last");
                let teamName = $(content).find(".hitlist_wrapper_background:first").prev().text().trim();
                let teamAwayName = $(content).find(".hitlist_wrapper_background:last").prev().text().trim();

                processedLinks++;
                updateProgressBar(processedLinks, totalLinks);

                if(teamName != "")
                addTeamIfMissing(teamName);
                 if(teamAwayName != "")
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
            team.tcklsAndPassSucc = roundToTwoDecimals((team.passOk + team.tacklesOk));
             team.tcklsOppSucc = roundToTwoDecimals(team.tcklsOppSucc / team.tcklsOpp);
            team.tacklsSurvived = (1 - team.tcklsOppSucc).toFixed(2);
            team.spM = roundToTwoDecimals(team.shots / team.played);
            team.ppM = roundToTwoDecimals(team.pass / team.played);
            team.tpM = roundToTwoDecimals(team.tackles / team.played);
            team.ipM = roundToTwoDecimals(team.interceptions / team.played);
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
            tcklsAndPassSucc: 0,
            tcklsOppSucc: 0,
            tacklsSurvived: 0,
            played: 0,
            spM: 0,
            ppM: 0,
            tpM: 0,
            ipM: 0
        };
    }

    function lowercaseFirstLetter(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
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
        if((+getNumberFromCell(opponentDiv, scSel) + +getNumberFromCell(teamDiv, scSel) ) == 0)
            return;
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

    function roundToOneDecimal(num) {
        return Math.round(num * 10) / 10;
    }

    function getNumberFromCell(div, selector) {
        return +div.find(selector).text().trim();
    }

    function getPercentageFromCell(div, selector) {
        return +(div.find(selector).text().trim().replace("%", "")) / 100;
    }

    String.prototype.lowercaseFirstLetter = function() {
        return this.charAt(0).toLowerCase() + this.slice(1);
    };

    function createStatsDiv() {
        const table = createStatsTable(Teams);

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.width = '95%';
        container.style.backgroundColor = 'white';
        container.style.zIndex = '1000';
        container.style.overflowY = 'scroll';
        container.style.height = '400px'; // Adjust height as needed
        container.style.border = '1px solid black';

        container.appendChild(table);
        document.body.appendChild(container);
    }

    function updateProgressBar(processed, total) {
        let progressBar = document.getElementById('progress-bar');
        if (!progressBar) {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            container.style.color = 'white';
            container.style.padding = '10px';
            container.style.zIndex = '1000';

            const progress = document.createElement('div');
            progress.id = 'progress-bar';
            progress.style.width = '0%';
            progress.style.height = '20px';
            progress.style.backgroundColor = 'green';
            progress.style.textAlign = 'center';
            progress.style.lineHeight = '20px';

            container.appendChild(progress);
            document.body.appendChild(container);
        }
   progressBar = document.getElementById('progress-bar');
    const percentage = (processed / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${processed}/${total} matches processed`;

    }

    function createStatsTable(data) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = table.createTHead();
        const headers = [
            'Name', 'Eff', 'Off', 'Ffdif', 'Goals', 'SpM', 'Sc',
            'GoalsOpp', 'ScOpp', 'PpM', 'PassOk', 'TpM', 'TacklesOk',
            'IpM', 'TcklsOpp', 'TcklsAndPassSucc', 'TacklsSurvived', 'Played'
        ];
        const row = thead.insertRow();
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.innerText = headerText;
            th.style.border = '1px solid black';
            th.style.padding = '5px';
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => sortTableByColumn(table, headers.indexOf(headerText)));
            row.appendChild(th);
        });

        const tbody = table.createTBody();
        data.forEach(team => {
            const row = tbody.insertRow();
            headers.forEach(header => {
                const cell = row.insertCell();
                cell.style.border = '1px solid black';
                cell.style.padding = '5px';
                const value = team[header.lowercaseFirstLetter()] || 0;
                cell.innerText = value;
                cell.dataset.value = value;
            });
        });

        applyColumnColoring(table); // Initial coloring
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

            return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        rows.forEach(row => tbody.appendChild(row));
        table.dataset.sortOrder = ascending ? 'asc' : 'desc';

        applyColumnColoring(table); // Reapply coloring after sorting
    }

    function applyColumnColoring(table) {
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.rows).filter(row => !row.cells[0].innerText.includes('away') && !row.cells[0].innerText.includes('home'));
        const headers = Array.from(table.tHead.rows[0].cells).map(cell => cell.innerText);

        headers.forEach((header, columnIndex) => {
            const cells = rows.map(row => row.cells[columnIndex]);
            const values = cells.map(cell => parseFloat(cell.dataset.value)).filter(val => !isNaN(val));

            if (values.length === 0) return;

            const min = Math.min(...values);
            const max = Math.max(...values);

            cells.forEach(cell => {
                const value = parseFloat(cell.dataset.value);
                if (isNaN(value)) return;

                const isLowerBetter = ['Eff', 'GoalsOpp', 'ScOpp',  'TcklsOpp'].includes(header);
                const ratio = (value - min) / (max - min);
                const greenValue = isLowerBetter ? (1 - ratio) * 255 : ratio * 255;
                const redValue = isLowerBetter ? ratio * 255 : (1 - ratio) * 255;

                cell.style.backgroundColor = `rgb(${redValue},${greenValue},0)`;
            });
        });
    }
})();

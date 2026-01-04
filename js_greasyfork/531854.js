// ==UserScript==
// @name         FantasyLOI - OR column for league tables
// @description  Adds an Overall Ranking column to league pages on the fantasy league of ireland website.
// @namespace    Tampermonkey Scripts
// @match        https://fantasyloi.leagueofireland.ie/Leagues*
// @author       Chris Musson
// @license      MIT
// @version 0.0.1.20250404190906
// @downloadURL https://update.greasyfork.org/scripts/531854/FantasyLOI%20-%20OR%20column%20for%20league%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/531854/FantasyLOI%20-%20OR%20column%20for%20league%20tables.meta.js
// ==/UserScript==

async function fetchRankings() {
    var overallUrl = "https://fantasyloi.leagueofireland.ie/Leagues?leagueCode=Overall";
    try {
        var response = await fetch(overallUrl);
        var html = await response.text();

        var rankings = {};
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var table = doc.querySelectorAll("table")[2];
        var rows = Array.from(table.querySelectorAll("tr")).slice(1); // skip header row

        rows.forEach(row => {
            var tds = row.querySelectorAll("td");
            var ranking = parseInt(tds[0]?.textContent.trim());
            var link = tds[1]?.querySelector("a");
            var href = link?.getAttribute("href");
            var teamIdMatch = href?.match(/teamId=(\d+)/);
            var teamId = teamIdMatch ? teamIdMatch[1] : null;

            if (teamId && ranking) {
                rankings[teamId] = ranking;
            }
        });

        return rankings;
    } catch (err) {
        console.error(err);
    }
}


function write_ORs(rankings) {
    var table = document.querySelectorAll("table")[2];
    var rows = Array.from(table.querySelectorAll("tr"));
    var headerRow = rows[0];
    var dataRows = rows.slice(1);

    var newHeader = document.createElement("th");
    newHeader.textContent = "OR";
    headerRow.appendChild(newHeader);

    dataRows.forEach(row => {
        var tds = row.querySelectorAll("td");
        var link = tds[1]?.querySelector("a");
        var href = link?.getAttribute("href");
        var teamIdMatch = href?.match(/teamId=(\d+)/);
        var teamId = teamIdMatch ? teamIdMatch[1] : null;

        var newCell = document.createElement("td");
        newCell.classList.add("align-middle");

        if (teamId && rankings[teamId]) {
            newCell.textContent = rankings[parseInt(teamId)];
        } else {
            newCell.textContent = "-"; // fall back if not found
        }
        row.appendChild(newCell);
    });
}

fetchRankings().then(rankings => { write_ORs(rankings); })

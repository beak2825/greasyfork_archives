// ==UserScript==
// @name         LNP Italy Basket Serie A2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fetch LNP scoreboard data based on round number.
// @author       MK
// @match        https://lnpscoreboard.webpont.com/?nat=all
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/511343/LNP%20Italy%20Basket%20Serie%20A2.user.js
// @updateURL https://update.greasyfork.org/scripts/511343/LNP%20Italy%20Basket%20Serie%20A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

let button = document.createElement("button");
button.innerHTML = "Vygenerovat live urls";
button.style.position = "fixed";
button.style.top = "25px";
button.style.left = "25px";
button.style.zIndex = "999999";
button.style.padding = "15px 30px";
button.style.border = "none";
button.style.borderRadius = "12px";
button.style.fontSize = "18px";
button.style.fontWeight = "bold";
button.style.cursor = "pointer";
button.style.color = "#ffffff";
button.style.background = "linear-gradient(45deg, #009246 25%, #F1F2F1 50%, #CE2B37 75%)";
button.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.3)";
button.style.transition = "all 0.7s ease-in-out";

button.onmouseover = function() {
    button.style.background = "linear-gradient(90deg, #009246 25%, #F1F2F1 50%, #CE2B37 75%)";
    button.style.transform = "scale(1.1)";
    button.style.boxShadow = "0px 6px 20px rgba(0, 0, 0, 0.4)";
};
button.onmouseout = function() {
    button.style.background = "linear-gradient(45deg, #009246 25%, #F1F2F1 50%, #CE2B37 75%)";
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.3)";
};
button.onclick = function() {
    let round = prompt("Zadej číslo kola:");
    if (round) {
        fetchScheduleData(round);
    }
};
document.body.appendChild(button);

    function fetchScheduleData(round) {
        const url = `https://lnpstat.domino.it/getstatisticsfiles?task=schedule&year=x2526&league=ita2&round=${round}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                createTable(data);
            })
            .catch(error => {
                alert("Došlo k chybě při získávání dat: " + error);
            });
    }

    function createTable(data) {
        let oldTable = document.querySelector(".custom-table");
        if (oldTable) {
            oldTable.remove();
        }

        let table = document.createElement("table");
        table.className = "custom-table";
        document.body.appendChild(table);

        data.forEach(game => {
            let row = document.createElement("tr");

            let homeTeamCell = document.createElement("td");
            homeTeamCell.innerText = game.teamname_home;
            row.appendChild(homeTeamCell);

            let awayTeamCell = document.createElement("td");
            awayTeamCell.innerText = game.teamname_away;
            row.appendChild(awayTeamCell);

            let gameIdCell = document.createElement("td");
            let link = document.createElement("a");
            link.href = `https://netcasting.webpont.com/?${game.gameid}`;
            link.innerText = "LIVE URL";
            link.target = "_blank";
            gameIdCell.appendChild(link);
            row.appendChild(gameIdCell);

            let gameStatusCell = document.createElement("td");
            gameStatusCell.innerText = game.game_status || "N/A";
            row.appendChild(gameStatusCell);

            table.appendChild(row);
        });
    }

    const style = document.createElement("style");
    style.innerHTML = `
        .custom-table {
            position: fixed;
            top: 80px;
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
    `;
    document.head.appendChild(style);
})();
// ==UserScript==
// @name         NVPlay LiveUrls
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skript pro generování tabulky s URL na živé zápasy na NVPlay s dynamickým odkazem podle aktuální stránky
// @author       MK
// @license      None
// @match        https://live.nvplay.com/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515723/NVPlay%20LiveUrls.user.js
// @updateURL https://update.greasyfork.org/scripts/515723/NVPlay%20LiveUrls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro zjištění základní URL na základě aktuální URL
    function getBaseApiUrl() {
        const currentUrl = window.location.href;
        switch (true) {
            case currentUrl.includes('/ecb/'):
                return 'https://w-api.ecb.nvplay.net';
            case currentUrl.includes('/nzc/'):
                return 'https://w-api.nzc.nvplay.net';
            default:
                return 'https://w-api.cdn.nvplay.net';
        }
    }

    // Získání základní URL
    const baseApiUrl = getBaseApiUrl();

    // Přidání stylů
    const style = document.createElement("style");
    style.innerHTML = `
        .table-container {
            position: fixed;
            top: 60px;
            left: 30px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
            border: 3px solid black;
            background-color: white;
            z-index: 999999999;
        }
        .custom-table {
            width: 100%;
            font-size: 20px;
            vertical-align: middle;
        }
        .custom-table td, .custom-table th {
            border: 1px solid black;
            padding: 8px;
        }
        .custom-table th {
            background-color: #f2f2f2;
        }
        .custom-table td:first-child {
            width: 300px;
            text-align: left;
            padding-right: 10px;
        }
        .custom-table td:nth-child(2) {
            width: 400px;
            text-align: left;
            font-weight: bold;
        }
        .generate-button {
            position: fixed;
            top: 10px;
            left: 30px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            z-index: 1000000000;
        }
    `;
    document.head.appendChild(style);

    // Vytvoření tlačítka "GENERATE URLS"
    const generateButton = document.createElement("button");
    generateButton.textContent = "GENERATE URLS";
    generateButton.className = "generate-button";
    document.body.appendChild(generateButton);

    // Funkce pro generování tabulky
    function generateTable() {
        // Odstranění staré tabulky, pokud existuje
        const oldContainer = document.querySelector(".table-container");
        if (oldContainer) oldContainer.remove();

        // Vytvoření nové tabulky s kontejnerem
        const container = document.createElement("div");
        container.className = "table-container";
        document.body.appendChild(container);

        const table = document.createElement("table");
        table.className = "custom-table";
        container.appendChild(table);

        // Hlavička tabulky
        const headerRow = table.insertRow();
        const nameHeader = headerRow.insertCell();
        const urlHeader = headerRow.insertCell();
        nameHeader.textContent = "Název zápasu";
        urlHeader.textContent = "Live URL";

        // Výběr všech zápasů na stránce
        const matches = document.querySelectorAll("li.nvp-match__day div.nvp-match");

        matches.forEach(match => {
            const teamNames = match.querySelectorAll(".nvp-match__team-name");
            if (teamNames.length < 2) return;

            const firstTeamName = teamNames[0].textContent.trim();
            const secondTeamName = teamNames[1].textContent.trim();
            const matchId = match.getAttribute("data-id");

            // První sloupec s názvem zápasu
            const row = table.insertRow();
            const nameCell = row.insertCell();
            nameCell.textContent = `${firstTeamName} vs. ${secondTeamName}`;

            // Druhý sloupec s URL na živý zápas
            const urlCell = row.insertCell();
            const liveUrl = `${baseApiUrl}/api/scorecard/${matchId}`;
            const link = document.createElement("a");
            link.href = liveUrl;
            link.textContent = liveUrl;
            link.target = "_blank";
            urlCell.appendChild(link);
        });
    }

    // Přidání události kliknutí na tlačítko
    generateButton.addEventListener("click", generateTable);
})();

// ==UserScript==
// @name         Švýcarský hokej - tabulka s odkazy
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Generuje tabulku s odkazy na švýcarský hokej
// @author       Lukáš Malec
// @match        https://www.sihf.ch/de/game-center/sky-swiss-league/*
// @match        https://www.sihf.ch/de/game-center/myhockey-league/*
// @match        https://www.sihf.ch/de/game-center/national-league/*
// @match        https://www.sihf.ch/de/game-center/national-cup/*
// @match        https://www.sihf.ch/de/game-center/national-teams/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520518/%C5%A0v%C3%BDcarsk%C3%BD%20hokej%20-%20tabulka%20s%20odkazy.user.js
// @updateURL https://update.greasyfork.org/scripts/520518/%C5%A0v%C3%BDcarsk%C3%BD%20hokej%20-%20tabulka%20s%20odkazy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const generateButton = document.createElement('button');
    generateButton.textContent = 'Vygenerovat odkazy';
    generateButton.style.position = 'fixed';
    generateButton.style.top = '20px';
    generateButton.style.left = '30px';
    generateButton.style.zIndex = '1000';
    generateButton.style.padding = '30px';
    generateButton.style.fontSize = '30px';
    generateButton.style.backgroundColor = '#FFFF00';
    generateButton.style.color = '#000000';
    generateButton.style.border = 'solid';
    generateButton.style.borderRadius = '5px';
    generateButton.style.cursor = 'pointer';
    generateButton.style.fontWeight = "bold";

    document.body.appendChild(generateButton);

    generateButton.addEventListener('click', function () {
        console.clear();
        console.log('Generating table...');

        generateButton.style.display = 'none';

        const existingTable = document.querySelector('#generatedTable');
        if (existingTable) {
            existingTable.remove();
        }

        const table = document.createElement('table');
        table.id = 'generatedTable';
        table.style.width = '50%';
        table.style.maxWidth = '50%';
        table.style.margin = '20px auto';
        table.style.borderCollapse = 'collapse';
        table.style.backgroundColor = '#fff';
        table.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';

        const headerRow = document.createElement('tr');
        ['MATCH', 'HOKEJ', 'STATISTIKY', 'TRESTY'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #000';
            th.style.padding = '10px';
            th.style.backgroundColor = '#f0f0f0';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        const rows = document.querySelectorAll('tr[data-ng-repeat="row in table.data"]');
        console.log(`Found ${rows.length} rows`);

        rows.forEach(row => {
            try {
                let team1Element = row.querySelector('td.-nowrap.-right');
                let team2Element = row.querySelector('td.-nowrap.-left');
                let team1 = team1Element ? team1Element.textContent.trim() : null;
                let team2 = team2Element ? team2Element.textContent.trim() : null;

                if (!team1 || !team2) {
                    const teamNameElements = row.querySelectorAll('.-team-name');
                    if (teamNameElements.length >= 2) {
                        team1 = teamNameElements[0].textContent.trim();
                        team2 = teamNameElements[1].textContent.trim();
                    }
                }

                const linkElement = row.querySelector('a[title="Spieldetails"]');

                if (team1 && team2 && linkElement) {
                    const href = linkElement.getAttribute('href');

                    const newRow = document.createElement('tr');

                    const teamCell = document.createElement('td');
                    teamCell.innerHTML = `<strong>${team1}</strong> - <strong>${team2}</strong>`;
                    teamCell.style.border = '1px solid #000';
                    teamCell.style.padding = '10px';
                    teamCell.style.textAlign = 'center';
                    newRow.appendChild(teamCell);

                    const hockeyCell = document.createElement('td');
                    hockeyCell.style.border = '1px solid #000';
                    hockeyCell.style.padding = '10px';
                    hockeyCell.style.textAlign = 'center';
                    const hockeyLink = document.createElement('a');
                    hockeyLink.textContent = 'LIVE URL HOKEJ';
                    hockeyLink.href = `https://www.sihf.ch${href.replace('/game-center/', '/game-center//')}`;
                    hockeyLink.target = '_blank';
                    hockeyCell.appendChild(hockeyLink);
                    newRow.appendChild(hockeyCell);

                    const statsCell = document.createElement('td');
                    statsCell.style.border = '1px solid #000';
                    statsCell.style.padding = '10px';
                    statsCell.style.textAlign = 'center';
                    const statsLink = document.createElement('a');
                    statsLink.textContent = 'LIVE URL STATISTIKY';
                    statsLink.href = `https://www.sihf.ch${href}`;
                    statsLink.target = '_blank';
                    statsCell.appendChild(statsLink);
                    newRow.appendChild(statsCell);

                    const penaltyCell = document.createElement('td');
                    penaltyCell.style.border = '1px solid #000';
                    penaltyCell.style.padding = '10px';
                    penaltyCell.style.textAlign = 'center';
                    const penaltyLink = document.createElement('a');
                    penaltyLink.textContent = 'LIVE URL TRESTY';
                    penaltyLink.href = `https://m.sihf.ch${href}`;
                    penaltyLink.target = '_blank';
                    penaltyCell.appendChild(penaltyLink);
                    newRow.appendChild(penaltyCell);

                    table.appendChild(newRow);
                }
            } catch (error) {
                console.error(`Error processing row: ${error}`);
            }
        });

        // Přidáme tabulku nad hlavní obsah stránky
        document.body.insertBefore(table, document.body.firstChild);

        console.log('Table generation complete.');
    });
})();
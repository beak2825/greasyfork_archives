// ==UserScript==
// @name         Food Club Pirate Table
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates a table at the top of the page with the pirates and arenas
// @author       Shiba
// @match        https://www.grundos.cafe/games/foodclub/bet/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513595/Food%20Club%20Pirate%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/513595/Food%20Club%20Pirate%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function extractPirates() {
        const piratesTable = [];
        const arenaDivs = document.querySelectorAll('.fc_place_bet > div.flex.center-items');


        if (arenaDivs.length === 0) {
            return [];
        }

        arenaDivs.forEach((arenaDiv, index) => {

            const label = arenaDiv.querySelector('label');
            const arenaName = label ? label.innerText.trim() : `Arena ${index + 1}`;


            let nextDiv = arenaDiv.nextElementSibling;


            while (nextDiv && (!nextDiv.matches('div.fc_positive, div.fc_negative'))) {
                nextDiv = nextDiv.nextElementSibling;
            }

            if (!nextDiv) {
                console.warn(`No relevant sibling div found for arena: ${arenaName}`);
                return;
            }

            const pirateSelect = nextDiv.querySelector('select[name^="winner"]');
            if (!pirateSelect) {
                console.warn(`No pirate select found for arena: ${arenaName}`);
                return;
            }

            const pirateOptions = pirateSelect.querySelectorAll('option');
            pirateOptions.forEach(option => {
                const optionText = option.innerText.trim();
                if (optionText === 'Who would you like to bet for?' || optionText === '') {
                    return;
                }


                const [pirateNamePart, oddsPart] = optionText.split('(');
                const pirateName = pirateNamePart ? pirateNamePart.trim() : 'Unknown Pirate';
                const odds = oddsPart ? oddsPart.replace(')', '').trim() : 'N/A';

                piratesTable.push({
                    Arena: arenaName,
                    Pirate: pirateName,
                    Odds: odds
                });
            });
        });

        return piratesTable;
    }

    function displayPiratesTable(piratesTable) {
        if (document.getElementById('pirates-table')) {

            return;
        }

        if (piratesTable.length === 0) {
            console.warn("No pirates data found to display.");
            return;
        }


        const table = document.createElement('table');
        table.id = 'pirates-table';
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginBottom = '20px';
        table.style.fontFamily = 'Arial, sans-serif';


        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Arena', 'Pirate', 'Odds'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.innerText = headerText;
            th.style.border = '1px solid #442e19';
            th.style.padding = '8px';
            th.style.backgroundColor = '#926540';
            th.style.color = '#d3d3d3';
            th.style.textShadow = '0 0 3px #442e19';
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);


        const tbody = document.createElement('tbody');

        piratesTable.forEach(row => {
            const tr = document.createElement('tr');


            const tdArena = document.createElement('td');
            tdArena.innerText = row.Arena;
            tdArena.style.border = '1px solid #442e19';
            tdArena.style.padding = '8px';
            tr.appendChild(tdArena);


            const tdPirate = document.createElement('td');
            tdPirate.innerText = row.Pirate;
            tdPirate.style.border = '1px solid #442e19';
            tdPirate.style.padding = '8px';
            tr.appendChild(tdPirate);


            const tdOdds = document.createElement('td');
            tdOdds.innerText = row.Odds;
            tdOdds.style.border = '1px solid #442e19';
            tdOdds.style.padding = '8px';
            tr.appendChild(tdOdds);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);


        const style = document.createElement('style');
        style.textContent = `
            #pirates-table th, #pirates-table td {
                text-align: left;
            }
            #pirates-table tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            #pirates-table tr:hover {
                background-color: #ddd;
            }
        `;
        document.head.appendChild(style);


        const pageContent = document.querySelector('#page_content');
        if (pageContent) {
            pageContent.insertBefore(table, pageContent.firstChild);
        } else {

            document.body.insertBefore(table, document.body.firstChild);
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        const piratesTable = extractPirates();
        if (piratesTable.length > 0) {
            displayPiratesTable(piratesTable);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        const piratesTable = extractPirates();
        if (piratesTable.length > 0) {
            displayPiratesTable(piratesTable);
            observer.disconnect();
        }
    }, 1000);

})();

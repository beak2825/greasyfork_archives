// ==UserScript==
// @name         Enetscores
// @namespace    http://tampermonkey.net/
// @version      2024-06-17
// @description  Generuje odkazy na live url
// @author       MK
// @match        https://www.enetscores.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enetscores.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/498150/Enetscores.user.js
// @updateURL https://update.greasyfork.org/scripts/498150/Enetscores.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Vytvoření tlačítka
let button = document.createElement('button');
button.innerText = 'Vygeneruj odkazy';
button.className = 'generate-button';

// Přidání stylů pro tlačítko
let style = document.createElement('style');
style.type = 'text/css';
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

document.body.appendChild(button);

button.addEventListener('click', () => {
    let existingContainer = document.querySelector('.table-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    let allRows = document.querySelectorAll('.wff_soccer_event_row');
    let hrefs = [];
    let participants = [];

    allRows.forEach(row => {
        let id = row.id;
        let href = "https://eapi.enetpulse.com/statistics/team_performance/?object=event&objectFK=" + id + "&includeStatisticParticipants=yes&includeStatisticData=yes&username=livesportapiusr&token=2327baa6c7789aa86998984b4b3ff13b";
        hrefs.push(href);

        let participantElements = row.querySelectorAll('.wff_event_participant');
        if (participantElements.length >= 2) {
            let participant_1 = participantElements[0].innerText;
            let participant_2 = participantElements[1].innerText;
            let participantsText = participant_1 + " - " + participant_2;
            participants.push(participantsText);
        } else {
            participants.push("Participants not found");
        }
    });

    let container = document.createElement('div');
    container.className = 'table-container';

    let table = document.createElement('table');
    table.className = 'custom-table';

    let header = table.insertRow();
    let headerCell1 = document.createElement('th');
    headerCell1.innerText = 'Zápas';
    header.appendChild(headerCell1);
    let headerCell2 = document.createElement('th');
    headerCell2.innerText = 'Live url';
    header.appendChild(headerCell2);

    for (let i = 0; i < hrefs.length; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();

        cell1.innerText = participants[i];

        let link = document.createElement('a');
        link.href = hrefs[i];
        link.innerText = hrefs[i].split("objectFK=").pop().split("&")[0];  // Zobrazení pouze id
        link.target = '_blank';

        cell2.appendChild(link);
    }

    container.appendChild(table);
    document.body.appendChild(container);
});
})();
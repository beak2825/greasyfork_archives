// ==UserScript==
// @name         Nitro Type Friends List Exporter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Export racer names with gold detection, race count filtering, and ban detection
// @match        https://www.nitrotype.com/friends
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537698/Nitro%20Type%20Friends%20List%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/537698/Nitro%20Type%20Friends%20List%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.background = 'black';
    menu.style.color = 'white';
    menu.style.padding = '10px';
    menu.style.borderRadius = '5px';
    menu.style.zIndex = '10000';

    let exportButton = document.createElement('button');
    exportButton.innerText = 'Export Racer List';
    exportButton.style.padding = '5px';
    exportButton.style.cursor = 'pointer';

    menu.appendChild(exportButton);
    document.body.appendChild(menu);

    exportButton.addEventListener('click', () => {
        let racerRows = document.querySelectorAll('.table-row.friends-list--row');
        let racerList = [];

        racerRows.forEach(row => {
            let nameCell = row.querySelector('.type-ellip');
            let raceCell = row.querySelector('.table-cell.table-cell--races');
            let statusCell = row.querySelector('.table-cell.table-cell--status');

            if (nameCell && raceCell && statusCell) {
                let raceCount = parseInt(raceCell.textContent.replace(/,/g, ''));
                let isGold = nameCell.classList.contains('type-gold');
                let isBanned = statusCell.textContent.includes('Banned');

                if (!isBanned && (isGold || raceCount > 5000)) {
                    racerList.push(nameCell.textContent.trim());
                }
            }
        });

        if (racerList.length === 0) {
            showErrorMessage();
        } else {
            let data = racerList.join('\n');
            let blob = new Blob([data], { type: 'text/plain' });
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'top_racers.txt';
            a.click();
        }
    });

    function showErrorMessage() {
        let errorMenu = document.createElement('div');
        errorMenu.style.position = 'fixed';
        errorMenu.style.top = '50px';
        errorMenu.style.left = '50%';
        errorMenu.style.transform = 'translateX(-50%)';
        errorMenu.style.background = 'black';
        errorMenu.style.color = 'white';
        errorMenu.style.padding = '15px';
        errorMenu.style.borderRadius = '5px';
        errorMenu.style.zIndex = '10000';
        errorMenu.innerText = 'Error No4, No friends detected';

        let closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.background = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', () => {
            errorMenu.remove();
        });

        errorMenu.appendChild(closeButton);
        document.body.appendChild(errorMenu);
    }

})();

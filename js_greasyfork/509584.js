// ==UserScript==
// @name         Hall Of Fame Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract faction data and export as JSON
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/page.php?sid=hof*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509584/Hall%20Of%20Fame%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/509584/Hall%20Of%20Fame%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let PAGES_TO_RECORD = 5; //                 Clicking Save once will iterate this counter, five pages saved, one iteration of file pushed
    let recordedFactions = [];
    let recordedPages = 0;
    let startPosition = null;
    function getPageFromURL() {
        const urlParams = new URLSearchParams(window.location.hash);
        const page = urlParams.get('page') || 0;
        return Math.floor(parseInt(page) / 20);
    }
    function getPageCounter(currentPage) {
        if (startPosition === null) {
            startPosition = currentPage;
        }
        return currentPage - startPosition + 1;
    }
    function createExportButton() {
        let panel = document.createElement('div');
        panel.id = 'exportPanel';
        panel.style.position = 'fixed';
        panel.style.top = '10%';
        panel.style.right = '5px';
        panel.style.padding = '10px';
        panel.style.border = '2px solid black';
        panel.style.backgroundColor = '#282c34';
        panel.style.color = 'white';
        panel.style.width = '200px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
        panel.innerHTML = `
            <button id="exportButton" style="padding: 10px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%; border-radius: 5px;">Save Page Data</button>
        `;
        document.body.appendChild(panel);
        document.getElementById('exportButton').addEventListener('click', saveCurrentPage);
        document.getElementById('clearButton').addEventListener('click', clearSavedData);
    }
    function clearSavedData() {
        recordedFactions = [];
        recordedPages = 0;
        alert('Saved data cleared.');
    }
    function saveCurrentPage() {
        const table = document.querySelector('table');
        if (!table) return;
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let positionCell = row.querySelector('td[class*="tdPosition"]');
            let position = positionCell ? positionCell.innerText.match(/\d+/)[0] : null;
            let faction = {
                "position": parseInt(position),
                "faction": cells[2].innerText,
                "members": parseInt(cells[3].innerText),
                "respect": parseInt(cells[4].innerText.replace(/,/g, ''))
            };
            if (!recordedFactions.find(f => f.position === faction.position)) {
                recordedFactions.push(faction);
            }
        });
        recordedPages++;
        if (recordedPages >= PAGES_TO_RECORD) {
            exportData();
        } else {
            alert(`${recordedPages} of ${PAGES_TO_RECORD} pages recorded`);
        }
    }
    function exportData() {
        const jsonData = JSON.stringify({ "factions": recordedFactions }, null, 4);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HallOfFame${startPosition}-${startPosition + PAGES_TO_RECORD - 1}.json`;
        link.click();
        clearSavedData();
    }
    function observeURLChanges() {
        let currentPage = getPageFromURL();
        let observer = new MutationObserver(function() {
            let newPage = getPageFromURL();
            if (newPage !== currentPage) {
                currentPage = newPage;
                saveCurrentPage();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    window.onload = function() {
        createExportButton();
        observeURLChanges();
    };
})();

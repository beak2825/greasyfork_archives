// ==UserScript==
// @name         DC QuickCheck DataScraper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skript pro sběr příchozích dat z QuickChecku a následné vložení do tabulkového dokumentu.
// @author       Martin, Michal
// @match        https://dc.livesport.eu/kvido/index/quick-check/event-id/*
// @icon         https://lh3.googleusercontent.com/1UFqRHsobU1HVUElYoMEqwFG3jUTblA2xMuEbULMI8F4LYTyqrpe8QYKzrHZIGIUXE8AVHGvZtIa2czvutKDnoXM=s60
// @grant        none
// @license      none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485647/DC%20QuickCheck%20DataScraper.user.js
// @updateURL https://update.greasyfork.org/scripts/485647/DC%20QuickCheck%20DataScraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const activateBtn = document.createElement("button");
    activateBtn.textContent = "Scan";
    activateBtn.style.position = "fixed";
    activateBtn.style.left = "10px";
    activateBtn.style.bottom = "40px";
    activateBtn.style.zIndex = "1000";
    activateBtn.style.padding = '10px 20px';
    activateBtn.style.backgroundImage = 'linear-gradient(to right, #0000ff, #d30000)';
    activateBtn.style.border = '2px solid transparent';
    activateBtn.style.borderRadius = '25px';
    activateBtn.style.color = 'white';
    activateBtn.style.fontSize = '16px';
    activateBtn.style.fontWeight = 'bold';
    activateBtn.style.textTransform = 'uppercase';
    activateBtn.style.cursor = 'pointer';
    activateBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    activateBtn.style.transition = 'border 0.3s, transform 0.2s';
    document.body.appendChild(activateBtn);

    activateBtn.addEventListener("click", function() {
        let data = '';
        const rows = document.querySelectorAll("#quick_check_event_history_list_table > tbody > tr");
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll("td")).slice(1, 6); // Get cells from 2nd to 6th
            const rowData = cells.map(cell => cell.textContent.trim()).join("\t"); // Data separated by tabs
            data += rowData + "\n";
        });

        const collectBtn = document.createElement("button");
        collectBtn.textContent = "Collect Data";
        collectBtn.style.position = "fixed";
        collectBtn.style.left = "10px";
        collectBtn.style.bottom = "100px";
        collectBtn.style.padding = '10px 20px';
        collectBtn.style.backgroundImage = 'linear-gradient(to right, #0000ff, #d30000)';
        collectBtn.style.border = '2px solid transparent';
        collectBtn.style.borderRadius = '25px';
        collectBtn.style.color = 'white';
        collectBtn.style.fontSize = '16px';
        collectBtn.style.fontWeight = 'bold';
        collectBtn.style.textTransform = 'uppercase';
        collectBtn.style.cursor = 'pointer';
        collectBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        collectBtn.style.transition = 'border 0.3s, transform 0.2s';
        document.body.appendChild(collectBtn);

        // Event listener for "Collect Data" button
        collectBtn.addEventListener("click", function() {
            // Copy data to clipboard with tabs
            navigator.clipboard.writeText(data).then(function() {
                console.log('Data successfully copied to clipboard');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });

        const loadAllBtn = document.createElement("button");
        loadAllBtn.textContent = "Načíst vše";
        loadAllBtn.style.position = "fixed";
        loadAllBtn.style.left = "10px";
        loadAllBtn.style.bottom = "160px";
        loadAllBtn.style.padding = '10px 20px';
        loadAllBtn.style.backgroundImage = 'linear-gradient(to right, #0000ff, #d30000)';
        loadAllBtn.style.border = '2px solid transparent';
        loadAllBtn.style.borderRadius = '25px';
        loadAllBtn.style.color = 'white';
        loadAllBtn.style.fontSize = '16px';
        loadAllBtn.style.fontWeight = 'bold';
        loadAllBtn.style.textTransform = 'uppercase';
        loadAllBtn.style.cursor = 'pointer';
        loadAllBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        loadAllBtn.style.transition = 'border 0.3s, transform 0.2s';
        document.body.appendChild(loadAllBtn);

        loadAllBtn.addEventListener("click", function() {
            // Click the "More" button repeatedly until it's not present
            const moreBtn = document.querySelector("#quick_check_event_history_list_more > div > button");
            if (moreBtn) {
                moreBtn.click();
                setTimeout(function() {
                    loadAllBtn.click(); // Trigger the click event recursively
                }, 500); // Adjust the delay as needed
            }
        });

        const deleteHSBtn = document.createElement("button");
        deleteHSBtn.textContent = "Smazat HS";
        deleteHSBtn.style.position = "fixed";
        deleteHSBtn.style.left = "10px";
        deleteHSBtn.style.bottom = "220px";
        deleteHSBtn.style.padding = '10px 20px';
        deleteHSBtn.style.backgroundImage = 'linear-gradient(to right, #0000ff, #d30000)';
        deleteHSBtn.style.border = '2px solid transparent';
        deleteHSBtn.style.borderRadius = '25px';
        deleteHSBtn.style.color = 'white';
        deleteHSBtn.style.fontSize = '16px';
        deleteHSBtn.style.fontWeight = 'bold';
        deleteHSBtn.style.textTransform = 'uppercase';
        deleteHSBtn.style.cursor = 'pointer';
        deleteHSBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        deleteHSBtn.style.transition = 'border 0.3s, transform 0.2s';
        document.body.appendChild(deleteHSBtn);

        deleteHSBtn.addEventListener("click", function() {
            var table = document.querySelector('#quick_check_event_history_list_table');

            if (table) {
                var rows = table.querySelectorAll('tr');

                rows.forEach(function(row) {
                    var cell = row.querySelector('td:nth-child(6)');

                    if (cell && /\d+/.test(cell.textContent)) {
                        row.remove();
                    }
                });
            }
        });
    });
})();
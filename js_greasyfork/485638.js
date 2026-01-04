// ==UserScript==
// @name         DC QuickCheck DataScraper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Skript pro sběr příchozích dat z QuickChecku a následné vložení do tabulkového dokumentu.
// @author       Martin Kaprál
// @match        https://dc.livesport.eu/kvido/index/quick-check/event-id/*
// @icon         https://lh3.googleusercontent.com/1UFqRHsobU1HVUElYoMEqwFG3jUTblA2xMuEbULMI8F4LYTyqrpe8QYKzrHZIGIUXE8AVHGvZtIa2czvutKDnoXM=s60
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/485638/DC%20QuickCheck%20DataScraper.user.js
// @updateURL https://update.greasyfork.org/scripts/485638/DC%20QuickCheck%20DataScraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create "Activate" button
    const activateBtn = document.createElement("button");
    activateBtn.textContent = "Scan";
    activateBtn.style.position = "fixed";
    activateBtn.style.left = "10px";
    activateBtn.style.bottom = "40px";
    activateBtn.style.zIndex = "1000";
    activateBtn.style.padding = '10px 20px';
    activateBtn.style.backgroundImage = 'linear-gradient(to right, #0000ff, #d30000)';
    activateBtn.style.border = '2px solid transparent';
    activateBtn.style.border = 'none';
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
        // Parse and prepare data
        let data = '';
        const rows = document.querySelectorAll("#quick_check_event_history_list_table > tbody > tr");
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll("td")).slice(1, 6); // Get cells from 2nd to 6th
            const rowData = cells.map(cell => cell.textContent.trim()).join("\t"); // Data separated by tabs
            data += rowData + "\n";
        });

        // Create "Collect Data" button
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
        collectBtn.onclick = function() {
            // Copy data to clipboard with tabs
            navigator.clipboard.writeText(data).then(function() {
                console.log('Data successfully copied to clipboard');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        }
        document.body.appendChild(collectBtn);
    });
})();

// ==UserScript==
// @name         Letterboxd Batch watched Marker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Marks all visible unwatched films as watched, with a small delay between each action, and then stops.
// @author       0x00a
// @match        https://letterboxd.com/*/watchlist/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/544501/Letterboxd%20Batch%20watched%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/544501/Letterboxd%20Batch%20watched%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DELAY_BETWEEN_CLICKS = 500; // 0.5 second delay between each click.

    let isRunning = false;

    // --- Helper function for delays ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // --- UI Control Panel ---
    function setupControlPanel() {
        if (document.getElementById('marker-panel')) return;

        const panelHtml = `
            <div id="marker-panel">
                <h3>Batch Mark as Watched</h3>
                <p style="font-size: 12px; color: #c25; font-weight: bold;">CRITICAL: You must scroll to the bottom of the page to load all films before starting!</p>
                <div id="marker-status">Status: Idle</div>
                <button id="start-marker-btn">Start Marking</button>
                <button id="stop-marker-btn">Stop</button>
            </div>
        `;

        GM_addStyle(`
            #marker-panel { position: fixed; top: 70px; right: 20px; z-index: 9999; background: #2C3440; color: #FFF; border: 1px solid #445; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); font-family: 'Letterboxd', 'Graphik', sans-serif; width: 250px; }
            #marker-panel h3 { margin-top: 0; color: #FFF; }
            #marker-panel button { margin-top: 10px; width: 100%; padding: 8px; cursor: pointer; background-color: #00B020; color: white; border: none; border-radius: 4px; font-weight: bold; }
            #marker-panel #stop-marker-btn { background-color: #E9A100; }
            #marker-status { font-weight: bold; margin-bottom: 10px; padding: 5px; background-color: #1A1F26; border-radius: 3px;}
        `);

        document.body.insertAdjacentHTML('beforeend', panelHtml);
        document.getElementById('start-marker-btn').addEventListener('click', startProcess);
        document.getElementById('stop-marker-btn').addEventListener('click', stopProcess);
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('marker-status');
        if (statusEl) statusEl.textContent = `Status: ${message}`;
    }

    // --- Core Logic ---
    function stopProcess() {
        isRunning = false;
        console.log("Process stopped by user.");
    }

    async function startProcess() {
        if (isRunning) {
            alert("Process is already running.");
            return;
        }
        isRunning = true;

        const watchIcons = document.querySelectorAll('li.film-not-watched .icon-watch');
        const totalToProcess = watchIcons.length;

        if (totalToProcess === 0) {
            updateStatus("No unwatched films found on the page.");
            isRunning = false;
            return;
        }

        for (let i = 0; i < totalToProcess; i++) {
            if (!isRunning) {
                updateStatus(`Stopped by user at item ${i + 1}.`);
                break;
            }

            const icon = watchIcons[i];
            const filmContainer = icon.closest('li.poster-container');
            const filmName = filmContainer.querySelector('img')?.alt || `Item ${i + 1}`;

            // Scroll the poster into view so we can see the action
            filmContainer.scrollIntoView({ behavior: 'auto', block: 'center' });
            await sleep(100); // Wait briefly for scroll to finish

            updateStatus(`Marking "${filmName}" (${i + 1}/${totalToProcess})`);
            icon.click();

            // The main delay between each action
            await sleep(DELAY_BETWEEN_CLICKS);
        }

        if (isRunning) {
             updateStatus(`Finished! Processed ${totalToProcess} films.`);
        }
        isRunning = false;
    }

    // --- Initialization ---
    window.addEventListener('load', () => {
        setupControlPanel();
    });

})();
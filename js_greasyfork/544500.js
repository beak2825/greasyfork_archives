// ==UserScript==
// @name         Letterboxd Batch Mark as Unwatched
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Marks all visible "watched" films as "unwatched" from a list/grid view.
// @author       0x00a
// @match        https://letterboxd.com/*/films/*
// @match        https://letterboxd.com/*/likes/films/*
// @match        https://letterboxd.com/*/diary/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/544500/Letterboxd%20Batch%20Mark%20as%20Unwatched.user.js
// @updateURL https://update.greasyfork.org/scripts/544500/Letterboxd%20Batch%20Mark%20as%20Unwatched.meta.js
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
        if (document.getElementById('unmarker-panel')) return;

        const panelHtml = `
            <div id="unmarker-panel">
                <h3>Batch Mark as Unwatched</h3>
                <p style="font-size: 12px; color: #c25; font-weight: bold;">Important: Scroll down to load all films before starting!</p>
                <div id="unmarker-status">Status: Idle</div>
                <button id="start-unmarker-btn">Start Un-marking</button>
                <button id="stop-unmarker-btn">Stop</button>
            </div>
        `;

        GM_addStyle(`
            #unmarker-panel { position: fixed; top: 70px; right: 20px; z-index: 9999; background: #2C3440; color: #FFF; border: 1px solid #445; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); font-family: 'Letterboxd', 'Graphik', sans-serif; width: 250px; }
            #unmarker-panel h3 { margin-top: 0; color: #FFF; }
            #unmarker-panel button { margin-top: 10px; width: 100%; padding: 8px; cursor: pointer; background-color: #E9A100; color: white; border: none; border-radius: 4px; font-weight: bold; }
            #unmarker-panel #stop-unmarker-btn { background-color: #9A231F; }
            #unmarker-status { font-weight: bold; margin-bottom: 10px; padding: 5px; background-color: #1A1F26; border-radius: 3px;}
        `);

        document.body.insertAdjacentHTML('beforeend', panelHtml);
        document.getElementById('start-unmarker-btn').addEventListener('click', startProcess);
        document.getElementById('stop-unmarker-btn').addEventListener('click', stopProcess);
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('unmarker-status');
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

        // Find all "watched" films and then the "eye" icon within them.
        const watchedIcons = document.querySelectorAll('li.film-watched .icon-watched');
        const totalToProcess = watchedIcons.length;

        if (totalToProcess === 0) {
            updateStatus("No watched films found on the page.");
            isRunning = false;
            return;
        }

        for (let i = 0; i < totalToProcess; i++) {
            if (!isRunning) {
                updateStatus(`Stopped by user at item ${i + 1}.`);
                break;
            }

            const icon = watchedIcons[i];
            const filmContainer = icon.closest('li.poster-container');
            const filmName = filmContainer.querySelector('img')?.alt || `Item ${i + 1}`;

            // Scroll the poster into view so we can see the action
            filmContainer.scrollIntoView({ behavior: 'auto', block: 'center' });
            await sleep(100); // Wait briefly for scroll to finish

            updateStatus(`Un-marking "${filmName}" (${i + 1}/${totalToProcess})`);
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
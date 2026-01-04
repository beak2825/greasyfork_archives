// ==UserScript==
// @name         Copy Live Challenge Scores
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Press 'c' to copy live challenge scores to clipboard
// @match        https://www.geoguessr.com/*
// @author       BrainyGPT
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/538815/Copy%20Live%20Challenge%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/538815/Copy%20Live%20Challenge%20Scores.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getScoresCSV() {
        const resultRows = document.querySelectorAll('[class*="results_row"]');
        const data = [];

        resultRows.forEach(row => {
            const columns = row.querySelectorAll('div');
            let playerName = null;
            let scores = [];

            columns.forEach(col => {
                const text = col.textContent.trim();

                // Find player name
                if (!playerName && text.length > 0 && !text.match(/^\d+[,.]?\d* km$/)) {
                    const isPlayer = col.querySelector('a[href*="/user/"]');
                    if (isPlayer) {
                        playerName = text.replace(/^\d+\.\s*/, ''); // Remove ranking numbers like "1. "
                    }
                }

                // Score values like "4,691 pts"
                if (text.endsWith('pts')) {
                    const ptsOnly = text.replace(/[^\d]/g, '');
                    scores.push(ptsOnly);
                }
            });

            if (playerName && scores.length === 6) {
                data.push([playerName, ...scores]);
            }
        });

        return data.map(row => row.join(',')).join('\n');
    }

    function copyToClipboard() {
        const csv = getScoresCSV();
        if (csv && typeof GM_setClipboard === 'function') {
            GM_setClipboard(csv);
            alert('✅ GeoGuessr scores copied to clipboard!');
        } else {
            console.error('Clipboard copy failed. GM_setClipboard not available.');
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            copyToClipboard();
        }
    });

    console.log("✅ GeoGuessr script ready — press 'c' to copy scores to clipboard");
})();

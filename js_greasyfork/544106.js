// ==UserScript==
// @name         Hide Scores
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-07-32
// @description  Hide scores on CMS scoreboard
// @author       You
// @match        https://ioi-2024.github.io/
// @match        https://ioi-2023.github.io/
// @match        https://ranking.ioi2022.id/
// @match        https://ranking.ioi2021.sg/
// @match        https://ranking.ioi2020.sg/
// @match        https://scoreboard.ioi2017.ir/
// @match        https://nhspc.cc/2024/ranking/Ranking.html
// @match        https://nhspc.cc/2023/ranking/Ranking.html
// @match        https://sorahisa-rank.github.io/oi-toi/2025/ranking/
// @match        https://ranking.ioi2025.bo/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544106/Hide%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/544106/Hide%20Scores.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Hide Scores script running...");

    let allHidden = true;

    // CSS to hide table scores, main graph, and progression graph
    const style = document.createElement('style');
    style.innerHTML = `
        td.score-hidden {
            color: transparent !important;
            background: inherit !important;
        }
        .score-graph-hidden, .progression-graph-hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    function getScoreColumns(table) {
        const headerCells = table.rows[0]?.cells || [];
        let hideIndexes = [];
        for (let i = headerCells.length - 1; i >= 0; i--) {
            if (headerCells[i].textContent.trim().toLowerCase() === 'team') break;
            hideIndexes.push(i);
        }
        return hideIndexes;
    }

    function hideScores() {
        // Hide table scores
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const hideIndexes = getScoreColumns(table);
            const rows = table.rows;
            for (let r = 1; r < rows.length; r++) {
                const cells = rows[r].cells;
                hideIndexes.forEach(idx => {
                    if (cells[idx]) cells[idx].classList.add('score-hidden');
                });
            }
        });

        // Hide main rank graph (SVG)
        const rankGraph = document.querySelector('svg');
        if (rankGraph) rankGraph.classList.add('score-graph-hidden');

        // Hide progression graph (canvas or SVG, depending on site)
        const progressionGraph = document.querySelector('#progression-graph, canvas, svg[aria-label="Progression"], .progression');
        if (progressionGraph) progressionGraph.classList.add('progression-graph-hidden');
    }

    function revealScores() {
        // Reveal table scores
        document.querySelectorAll('td.score-hidden').forEach(cell => {
            cell.classList.remove('score-hidden');
        });

        // Reveal main rank graph
        const rankGraph = document.querySelector('svg');
        if (rankGraph) rankGraph.classList.remove('score-graph-hidden');

        // Reveal progression graph
        const progressionGraph = document.querySelector('#progression-graph, canvas, svg[aria-label="Progression"], .progression');
        if (progressionGraph) progressionGraph.classList.remove('progression-graph-hidden');
    }

    function toggleScores() {
        allHidden = !allHidden;
        if (allHidden) hideScores();
        else revealScores();

        const button = document.getElementById('toggle-all-scores-btn');
        if (button) button.textContent = allHidden ? 'Reveal All' : 'Hide All';
    }

    function addToggleButton() {
        if (document.getElementById('toggle-all-scores-btn')) return;

        const button = document.createElement('button');
        button.id = 'toggle-all-scores-btn';
        button.textContent = 'Reveal All';
        Object.assign(button.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '999999',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
        });

        button.addEventListener('click', toggleScores);
        document.body.appendChild(button);
    }

    // MutationObserver to handle dynamic updates
    const observer = new MutationObserver(() => {
        if (allHidden) hideScores();
        addToggleButton();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        hideScores();
        addToggleButton();
    });
})();

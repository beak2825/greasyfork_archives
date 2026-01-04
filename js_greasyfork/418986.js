// ==UserScript==
// @name         Jstris PC stats
// @namespace    Jstris PC stats
// @version      0.1.1
// @description  Shows you PC stats on Jstris replays
// @author       TSTman
// @match        https://jstris.jezevec10.com/replay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418986/Jstris%20PC%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/418986/Jstris%20PC%20stats.meta.js
// ==/UserScript==

(function setupStats() {
    'use strict';
    try {
        const statsToHide = ['Attack', 'Finesse', 'PPS', 'KPP'];
        const statTable =document.querySelector('#statTable');
        [...statTable.querySelectorAll(':scope tr td.ter')].filter(element => statsToHide.includes(element.textContent)).forEach(element => element.parentElement.style.display = 'none');
        const piecesElement = [...statTable.querySelectorAll(':scope tr td.sval')].filter(element => element.previousSibling.textContent === '#')[0];
        piecesElement.previousSibling.textContent = 'Piece';

        const linesRow = statRow('Line');
        const linesElement = linesRow.querySelector(':scope td.sval');
        const bagRow = statRow('Bag');
        const bagElement = bagRow.querySelector(':scope td.sval');
        const loopRow = statRow('Loop');
        const loopElement = loopRow.querySelector(':scope td.sval');

        function statRow(name) {
            const row = document.createElement('tr');
            const titleElement = document.createElement('td');
            const valueElement = document.createElement('td');
            titleElement.setAttribute('width', 120);
            titleElement.classList.add('ter');
            titleElement.textContent = name;
            valueElement.classList.add('sval');
            row.appendChild(titleElement);
            row.appendChild(valueElement);
            statTable.appendChild(row);
            return row;
        }

        setInterval(updateStats, 200);
        function updateStats() {
            const factor = 5;
            const pieceCount = parseInt(piecesElement.textContent);
            const lines = ((pieceCount / 2.5) % 14).toFixed(factor) + ' / 14';
            const bags = ((pieceCount / 7) % 5).toFixed(factor) + ' / 5';
            const loops = (pieceCount / 35).toFixed(factor);
            linesElement.textContent = lines;
            bagElement.textContent = bags;
            loopElement.textContent = loops;
        }
    } catch (e) {
        setTimeout(setupStats, 1000);
    }
})();
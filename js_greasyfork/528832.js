// ==UserScript==
// @name         MAL / MyAnimeList - Enhanced Sorting And Progress On Anime List
// @version      4.0
// @author       Ezektor
// @description  Correctly sorts your anime list by true progress, and reveals your exact progress percentage for each anime.
// @match        http*://myanimelist.net/animelist/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net&sz=256
// @namespace    https://greasyfork.org/users/1414348
// @downloadURL https://update.greasyfork.org/scripts/528832/MAL%20%20MyAnimeList%20-%20Enhanced%20Sorting%20And%20Progress%20On%20Anime%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/528832/MAL%20%20MyAnimeList%20-%20Enhanced%20Sorting%20And%20Progress%20On%20Anime%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSortingEnabled = false;
    let originalRows = [];
    let sortDirection = 'desc';

    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '➖ Default';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#9e9e9e';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '9999';
    document.body.appendChild(toggleButton);

    function isAllAnimePage() {
        return window.location.href.includes('/animelist/') && window.location.href.includes('?status=7');
    }

    function calculateProgress(row) {
        const progressCell = row.querySelector('.data.progress');
        if (!progressCell) return 0;

        const progressText = progressCell.innerText.trim();
        const [watched, total] = progressText.replace(/\[[^\]]*\]/g, '').split('/').map(s => parseInt(s.trim(), 10) || 0);
        return total == null ? 100 : total === 0 ? 0 : Math.floor((watched / total) * 100);
    }

    function addProgressPercentage(row) {
        const progressCell = row.querySelector('.data.progress');
        if (!progressCell) return;

        const progressText = progressCell.innerText.trim();
        if (/^\d+$/.test(progressText)) return;

        const existingPercentage = progressCell.querySelector('.progress-percentage')
        if (existingPercentage) {
            existingPercentage.remove();
        }

        const progressPercentage = calculateProgress(row);

        const progressPercentageElement = document.createElement('div');
        progressPercentageElement.style.fontSize = '12px';
        progressPercentageElement.style.marginTop = '5px';
        progressPercentageElement.classList.add('progress-percentage');
        progressPercentageElement.textContent = `${progressPercentage}% progress`;

        if (progressPercentage <= 33) {
            progressPercentageElement.style.color = '#f44336';
        } else if (progressPercentage <= 66) {
            progressPercentageElement.style.color = '#ff9800';
        } else {
            progressPercentageElement.style.color = '#4caf50';
        }

        progressCell.appendChild(progressPercentageElement);
    }

    function sortRowsByProgress(rows, direction) {

        return [...rows].sort((a, b) => {

            const progressA = calculateProgress(a);
            const progressB = calculateProgress(b);

            const isCompletedA = a.querySelector('.data.status').classList.contains('completed');
            const isCompletedB = b.querySelector('.data.status').classList.contains('completed');

            const isDroppedA = a.querySelector('.data.status').classList.contains('dropped');
            const isDroppedB = b.querySelector('.data.status').classList.contains('dropped');

            if (isAllAnimePage()) {
                if (isDroppedA && !isDroppedB) return 1;
                if (!isDroppedA && isDroppedB) return -1;

                if (isCompletedA && !isCompletedB) return direction === 'desc' ? -1 : 1;
                if (!isCompletedA && isCompletedB) return direction === 'desc' ? 1 : -1;
            }

            return direction === 'asc'
                ? progressA - progressB
                : progressB - progressA;
        });
    }

    function updateTable(sortedRows) {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody.list-item');
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));
    }

    function restoreOriginalOrder() {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody.list-item');
        tbody.innerHTML = '';
        originalRows.forEach(row => tbody.appendChild(row));
    }

    function storeOriginalRows() {
        const rows = document.querySelectorAll('tbody.list-item .list-table-data');
        originalRows = [...rows];
    }

    function main() {
        const rows = document.querySelectorAll('tbody.list-item .list-table-data');

        rows.forEach(addProgressPercentage);

        if (isSortingEnabled) {
            const sortedRows = sortRowsByProgress(rows, sortDirection);

            updateTable(sortedRows);
        }
    }

    toggleButton.addEventListener('click', () => {
        if (!isSortingEnabled) {
            isSortingEnabled = true;
            sortDirection = 'desc';
            toggleButton.style.backgroundColor = '#4CAF50';
            toggleButton.innerHTML = 'Sorting In: 📉 Descending Order';
            main();
        } else if (sortDirection === 'desc') {
            sortDirection = 'asc';
            toggleButton.innerHTML = 'Sorting In: 📈 Ascending Order';
            main();
        } else {
            isSortingEnabled = false;
            toggleButton.style.backgroundColor = '#9e9e9e';
            toggleButton.innerHTML = '➖ Default';
            restoreOriginalOrder();
        }
    });

    window.addEventListener('load', () => {
        storeOriginalRows();
        main();
    });
})();
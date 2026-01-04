// ==UserScript==
// @name         Add and Sort by Avg. Transaction Ratio (Fully Dynamic)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Add "Avg. Transaction Ratio" column, sort dynamically, and track live value changes
// @author       L_G_M
// @match        *://quote.eastmoney.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526750/Add%20and%20Sort%20by%20Avg%20Transaction%20Ratio%20%28Fully%20Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526750/Add%20and%20Sort%20by%20Avg%20Transaction%20Ratio%20%28Fully%20Dynamic%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isDescending = true; // Sorting order state
    let observer; // MutationObserver reference

    function parseNumber(str) {
        if (!str) return 0;
        str = str.replace(/[^\d.万亿]/g, ''); // Remove non-numeric characters except '万' and '亿'
        if (str.includes('万')) return parseFloat(str) * 10000;
        if (str.includes('亿')) return parseFloat(str) * 100000000;
        return parseFloat(str);
    }

    function calculateAvgTransactionRatio(totalTurnover, totalVolume, latestPrice) {
        if (totalVolume === 0 || latestPrice === 0) return 0;
        return ((totalTurnover / totalVolume / latestPrice - 1) * 100).toFixed(2);
    }

    function addAvgTransactionRatioColumn() {
        let tableHead = document.querySelector('thead tr');
        if (!tableHead) return;

        // Insert header for "Avg. Transaction Ratio"
        let headerCell = document.createElement('th');
        headerCell.innerHTML = '<a href="javascript:void(0);" class="glink sort-trigger" title="点击排序"><span>均现比例 ▼</span></a>';
        headerCell.style.cursor = 'pointer';
        tableHead.insertBefore(headerCell, tableHead.children[tableHead.children.length - 2]);

        headerCell.addEventListener('click', function (event) {
            event.preventDefault();
            isDescending = !isDescending;
            sortRows();
            headerCell.innerHTML = `<a href="javascript:void(0);" class="glink sort-trigger" title="点击排序"><span>均现比例 ${isDescending ? '▼' : '▲'}</span></a>`;
        });

        applyTableFixes();

        let tableBody = document.querySelector('tbody');
        if (tableBody) {
            observer = new MutationObserver(mutations => {
                let updated = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        updated = true;
                    }
                });

                if (updated) {
                    observer.disconnect(); // Prevent infinite loop
                    updateRows();
                    sortRows();
                    observer.observe(document.body, { subtree: true, characterData: true, childList: true }); // Observe the entire document
                }
            });

            observer.observe(document.body, { subtree: true, characterData: true, childList: true });
        }

        updateRows();
        sortRows();
    }

    function updateRows() {
        let tableBody = document.querySelectorAll('tbody')[3];
        if (!tableBody) return;

        let rows = Array.from(tableBody.querySelectorAll('tr'));
        let updated = false;

        rows.forEach(row => {
            let cells = row.children;
            if (!cells || cells.length < 14) return;

            let latestPrice = parseNumber(cells[5].innerText);
            let totalVolume = parseNumber(cells[8].innerText);
            let totalTurnover = parseNumber(cells[14].innerText);

            let ratio = calculateAvgTransactionRatio(totalTurnover, totalVolume, latestPrice);

            let existingCell = row.querySelector('.avg-transaction-ratio');
            if (existingCell) {
                if (existingCell.getAttribute('data-value') !== ratio) {
                    existingCell.innerText = ratio;
                    existingCell.setAttribute('data-value', ratio);
                    updated = true;
                }
            } else {
                let newCell = document.createElement('td');
                newCell.className = 'avg-transaction-ratio';
                newCell.innerText = ratio;
                newCell.setAttribute('data-value', ratio);
                row.insertBefore(newCell, row.children[row.children.length - 2]);
                updated = true;
            }
        });

        if (updated) {
            sortRows();
        }

        applyTableFixes();
    }

    function sortRows() {
        let tableBody = document.querySelectorAll('tbody')[3];
        if (!tableBody) return;

        let rows = Array.from(tableBody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            let valueA = parseFloat(a.querySelector('.avg-transaction-ratio')?.getAttribute('data-value')) || 0;
            let valueB = parseFloat(b.querySelector('.avg-transaction-ratio')?.getAttribute('data-value')) || 0;
            return isDescending ? valueB - valueA : valueA - valueB;
        });

        observer.disconnect();
        rows.forEach(row => tableBody.appendChild(row));
        observer.observe(document.body, { subtree: true, characterData: true, childList: true });
    }

    function applyTableFixes() {
        let table = document.querySelector('table');
        if (table) {
            table.style.tableLayout = 'fixed';
            table.style.width = '100%';
        }
    }

    function waitForDOMReady(callback, delay = 3000) {
        setTimeout(() => {
            requestAnimationFrame(callback);
        }, delay);
    }

    waitForDOMReady(addAvgTransactionRatioColumn, 3000);
})();

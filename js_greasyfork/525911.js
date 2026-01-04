// ==UserScript==
// @name         🏆Daily Score & Power Ranking Enhanced ⭐ClopoStars⭐
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  A humble script to enhance the Daily Score and Power Ranking tables on ClopoStars.com, making them more insightful and user-friendly. Shared with care to add ease and clarity. Use at your own risk—I’m not responsible for issues, data loss, or account troubles. This script is made with good intentions, never to harm or invade anyone’s space. Tinker wisely, stay safe, and may your scores always shine bright!
// @author       ChatGPT-4-turbo
// @match        *://clopostars.com/allies/cards
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525911/%F0%9F%8F%86Daily%20Score%20%20Power%20Ranking%20Enhanced%20%E2%AD%90ClopoStars%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/525911/%F0%9F%8F%86Daily%20Score%20%20Power%20Ranking%20Enhanced%20%E2%AD%90ClopoStars%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Stable Suzi GJ Loaded');

    function createHeaderCell(text) {
        const header = document.createElement('th');
        header.textContent = text;
        header.style.textAlign = 'center';
        header.style.padding = '10px';
        header.style.fontWeight = 'bold';
        return header;
    }

    function createStyledCell(content, color = '#808080') {
        const cell = document.createElement('td');
        cell.textContent = content;
        cell.style.textAlign = 'center';
        cell.style.fontWeight = 'bold';
        if (color) cell.style.color = color;
        return cell;
    }

    function calculateCappedScore(row, index) {
    const getValue = (index) => parseInt(row.querySelector(`td:nth-child(${index})`)?.textContent.replace(/,/g, '')) || 0;

    const groundPoints = Math.min(Math.floor(getValue(5) / 600000000), 100);
    const airPoints = Math.min(Math.floor(getValue(6) / 50000), 100);
    const bhPoints = Math.min(getValue(7) * 2, 200); // 🥇 BH cap
    const shPoints = Math.min(getValue(8) * 4, 200); // ✈️ SH cap
    const chPoints = Math.min(getValue(9) * 8, 200); // 🏆 CH cap
    const rhPoints = getValue(10) * 10;
    const mercPoints = getValue(11) * 10;
    const phPoints = getValue(12) * 10;

    return groundPoints + airPoints + bhPoints + shPoints + chPoints + rhPoints + mercPoints + phPoints;
    }

    function calculateImpact(score, power) { // Unified Calculation Function
        if (power === '0' && score > 0) return '+∞';
        if (power === '0' && score === 0) return '0';
        if (!power || power === 'N/A') return 'N/A';
        return (score / parseFloat(power)).toFixed(2);
    }

    function modifyDailyScoresTable(playerStats) {
        const dailyScoresTable = document.querySelector('table');
        const headerRow = dailyScoresTable.querySelector('thead tr');

        // Update "Rank" header to "Tier Level"
        const rankHeader = headerRow.querySelector('th:nth-child(1)');
        if (rankHeader) rankHeader.textContent = 'Tier Level';

        // Dynamic Header Management
        const headersToInsert = ['Wild Impact', 'Capped Score', 'Capped Impact'];
        const totalScoreHeader = [...headerRow.querySelectorAll('th')].find(th => th.textContent.trim() === 'Total Score');

        if (totalScoreHeader) {
            totalScoreHeader.textContent = 'Wild Score';
            headersToInsert.reverse().forEach(header => {
                headerRow.insertBefore(createHeaderCell(header), totalScoreHeader);
            });
        }

        // Helper function for creating plain (unstyled) cells
        const createPlainCell = (content) => {
            const cell = document.createElement('td');
            cell.textContent = content;
            cell.style.textAlign = 'center'; // Keep alignment consistent
            return cell;
        };

        // Process Player Rows
        dailyScoresTable.querySelectorAll('tbody tr').forEach(row => {
            const playerName = row.querySelector('td:nth-child(3)')?.innerText.trim().toLowerCase().replace(/\s+/g, '');
            const stats = playerStats[playerName] || { tier: 'N/A', color: '#808080', power: 'N/A' };

            const insertCell = (value, refIndex) => {
                const cell = createPlainCell(value); // Use plain cell for values
                row.insertBefore(cell, row.querySelector(`td:nth-child(${refIndex})`));
            };

            // Insert Tier Level (keeps the styling for Tier Level only)
            row.replaceChild(createStyledCell(stats.tier, stats.color), row.querySelector('td:nth-child(1)'));

            // Insert Capped Impact & Capped Score (unstyled)
            const cappedScore = calculateCappedScore(row);
            insertCell(calculateImpact(cappedScore, stats.power), 4);
            insertCell(cappedScore, 5);

            // Insert Wild Impact (unstyled)
            const wildScore = parseInt(row.querySelector('td:nth-child(6)')?.textContent.replace(/,/g, '')) || 0;
            insertCell(calculateImpact(wildScore, stats.power), 6);
        });
    }

    function getPlayerStats(rankingTable) { // Modified Function
        const playerStats = {};
        rankingTable.querySelectorAll('tbody tr').forEach(row => {
            const playerName = row.querySelector('td:nth-child(3)')?.innerText.trim().toLowerCase().replace(/\s+/g, '');
            const tier = row.querySelector('td:nth-child(1)')?.innerText.trim();
            const color = row.querySelector('td:nth-child(1)')?.style.color;
            const power = row.querySelector('td:nth-child(4)')?.innerText.trim();

            if (playerName) {
                playerStats[playerName] = { tier, color, power: power || 'N/A' };
            }
        });
        return playerStats;
    }

    function modifyPowerRankingTable(rankingTable) {
        const rows = rankingTable.querySelectorAll('tbody tr');
        const totalPlayers = rows.length;
        const headerRow = rankingTable.querySelector('thead tr');

        const rankHeader = headerRow.querySelector('th:nth-child(1)');
        if (rankHeader) {
            rankHeader.textContent = 'Tier Level';
        }

        rows.forEach((row, index) => {
            const rank = index + 1;
            const percentage = (rank / totalPlayers) * 100;

            let tier = 'T5';
            let color = '#808080';

            if (percentage <= 4.64) { tier = 'T1'; color = '#FFD700'; }
            else if (percentage <= 18.64) { tier = 'T2'; color = '#C0C0C0'; }
            else if (percentage <= 39.09) { tier = 'T3'; color = '#CD7F32'; }
            else if (percentage <= 66.86) { tier = 'T4'; color = '#1E90FF'; }

            const tierCell = createStyledCell(tier, color);
            row.replaceChild(tierCell, row.querySelector('td:nth-child(1)'));
        });
    }

	function waitForPowerRankingLoad(callback) {
        const tables = document.querySelectorAll('table');
        if (tables.length < 2) {
            setTimeout(() => waitForPowerRankingLoad(callback), 500);
            return;
        }

        const rankingTable = tables[1];
        const tbody = rankingTable.querySelector('tbody');

        if (!tbody || tbody.children.length === 0) {
            setTimeout(() => waitForPowerRankingLoad(callback), 500);
            return;
        }

        modifyPowerRankingTable(rankingTable);
        callback(rankingTable);
    }

    // Function to enable sorting with the new descending-first logic
    function enableSorting() {
        const table = document.querySelector('table'); // Selects the Daily Score table
        if (!table) return;

        let lastSortedColumn = null;
        let lastSortDirection = 'desc'; // Default sorting order is descending

        table.querySelectorAll('th').forEach((header, index) => {
            if (['Capped Impact', 'Capped Score', 'Wild Impact', 'Wild Score'].includes(header.textContent.trim())) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    const isSameColumn = lastSortedColumn === index;

                    if (isSameColumn) {
                        // Only switch to ascending if the same column is clicked twice in a row
                        lastSortDirection = lastSortDirection === 'desc' ? 'asc' : 'desc';
                    } else {
                        // New column clicked, reset sorting to descending
                        lastSortDirection = 'desc';
                        lastSortedColumn = index;
                    }

                    sortTableByColumn(table, index, lastSortDirection);
                    updateSortingIndicator(header, lastSortDirection);
                });
            }
        });
    }

    // Function to sort the table by the clicked column
    function sortTableByColumn(table, columnIndex, direction) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex]?.textContent.trim().replace(/,/g, '');
            const cellB = rowB.children[columnIndex]?.textContent.trim().replace(/,/g, '');

            const valueA = parseFloat(cellA) || (cellA === 'N/A' ? -Infinity : 0);
            const valueB = parseFloat(cellB) || (cellB === 'N/A' ? -Infinity : 0);

            return direction === 'asc' ? valueA - valueB : valueB - valueA;
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    // Function to update sorting indicators and highlight sorted column
    function updateSortingIndicator(header, direction) {
        // Ensure each header retains its original text
        document.querySelectorAll('th').forEach(th => {
            if (!th.dataset.originalText) {
                th.dataset.originalText = th.textContent.trim();
            }
            th.innerHTML = th.dataset.originalText.replace(/▲|▼/g, ''); // Reset text
            th.style.color = ''; // Reset header color
        });

        // Change the text color of the sorted column to gold
        header.style.color = '#FFD700';

        // Create sorting arrow at the beginning of the header
        const arrow = document.createElement('span');
        arrow.textContent = direction === 'asc' ? '▲' : '▼';
        arrow.style.color = '#FFD700'; // Gold color for visibility
        arrow.style.fontWeight = 'bold';
        arrow.style.marginRight = '4px'; // Reduce space between arrow and text

        // Insert the arrow at the beginning of the header text
        header.innerHTML = ''; // Clear existing content
        header.appendChild(arrow);
        header.appendChild(document.createTextNode(header.dataset.originalText)); // Restore header text
    }

    // Call enableSorting() after modifying the table
    function startScript() {
        waitForPowerRankingLoad((rankingTable) => {
            const playerStats = getPlayerStats(rankingTable);
            modifyDailyScoresTable(playerStats);
            enableSorting();// Ensure sorting is enabled only after the table is updated
        });
    }

    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (/https:\/\/clopostars\.com\/allies\/cards/.test(currentUrl)) {
                    startScript();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startScript();
        observeUrlChanges();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            startScript();
            observeUrlChanges();
        });
    }
})();
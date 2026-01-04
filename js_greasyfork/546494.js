// ==UserScript==
// @name         TorrentBD Peer Rank
// @version      1.1
// @description  Optimized & Cleaned. Refreshes every 3 seconds. Ranks peers, gives top 10 badges, and highlights your row with a bold font & a vertical bar matching your official rank color.
// @author       RUXE
// @namespace    69.
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546494/TorrentBD%20Peer%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/546494/TorrentBD%20Peer%20Rank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        selectors: {
            peerTable: 'table.peers-table',
            username: '.card-content .card-title span.tbdrank',
            tableHeaderRow: 'thead tr',
            tableBody: 'tbody',
        },
        classNames: {
            selfRow: 'tbd-self-row',
            rankHeader: 'peer-rank-header',
            rankCell: 'peer-rank-cell',
        },
        uploadColumnIndex: 4,
        usernameColumnIndex: 7,
        refreshIntervalMs: 3000, // <-- Refresh interval set to 3 seconds
        style: `
            .rank-badge {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: bold;
                color: #fff;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
                font-size: 0.9em;
            }
            .rank-1 { background-color: #d4af37; }
            .rank-2 { background-color: #c0c0c0; }
            .rank-3 { background-color: #cd7f32; }
            .rank-4 { background-color: #4caf50; }
            .rank-5 { background-color: #2196f3; }
            .rank-6 { background-color: #9c27b0; }
            .rank-7 { background-color: #ff9800; }
            .rank-8 { background-color: #795548; }
            .rank-9 { background-color: #009688; }
            .rank-10 { background-color: #607d8b; }
            .tbd-self-row {
                border-left: 4px solid var(--user-rank-color, #00ffff);
                font-weight: bold;
            }
        `
    };

    let refreshIntervalId = null;
    let cachedUsername = null;
    let cachedUserClass = null;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = CONFIG.style;
        document.head.appendChild(style);
    }

    function parseToBytes(uploadStr) {
        if (!uploadStr) return 0;
        const parts = uploadStr.trim().split(' ');
        if (parts.length < 2) return 0;
        const value = parseFloat(parts[0].replace(/,/g, ''));
        const unit = parts[1].toUpperCase();
        switch (unit) {
            case 'TIB': return value * 1024**4;
            case 'GIB': return value * 1024**3;
            case 'MIB': return value * 1024**2;
            case 'KIB': return value * 1024;
            default: return value;
        }
    }

    function getLoggedInUsername() {
        if (cachedUsername) return cachedUsername;
        try {
            const userElement = document.querySelector(CONFIG.selectors.username);
            const name = userElement?.textContent.trim();
            if (name) {
                cachedUsername = name;
                cachedUserClass = userElement.className;
                return name;
            }
        } catch (e) {
            // Fails silently if the element isn't found
        }
        return null;
    }

    function applyHighlightAndStyle(rows) {
        if (!cachedUsername || !cachedUserClass) return;

        const finalUsernameIndex = CONFIG.usernameColumnIndex + 1;

        for (const row of rows) {
            if (row.cells.length <= finalUsernameIndex) continue;
            const usernameCell = row.cells[finalUsernameIndex];
            const cellText = usernameCell.textContent.trim();

            // Reset styles from previous runs
            row.classList.remove(CONFIG.classNames.selfRow);
            row.style.removeProperty('--user-rank-color');
            const styledSpan = usernameCell.querySelector('span[data-script-styled]');
            if (styledSpan) {
                usernameCell.innerHTML = styledSpan.textContent;
            }

            // Apply styles if username matches
            if (cellText === cachedUsername) {
                usernameCell.innerHTML = `<span class="${cachedUserClass}" data-script-styled="true">${cellText}</span>`;
                const newSpan = usernameCell.querySelector('span[data-script-styled]');
                if (newSpan) {
                    const computedColor = window.getComputedStyle(newSpan).color;
                    row.style.setProperty('--user-rank-color', computedColor);
                    row.classList.add(CONFIG.classNames.selfRow);
                }
            }
        }
    }

    function processPeerTable() {
        const peerTable = document.querySelector(CONFIG.selectors.peerTable);
        if (!peerTable) return;

        const headerRow = peerTable.querySelector(CONFIG.selectors.tableHeaderRow);
        const tbody = peerTable.querySelector(CONFIG.selectors.tableBody);
        if (!headerRow || !tbody) return;

        getLoggedInUsername();

        if (!headerRow.querySelector(`.${CONFIG.classNames.rankHeader}`)) {
            const rankHeader = document.createElement('th');
            rankHeader.className = CONFIG.classNames.rankHeader;
            rankHeader.textContent = 'Rank';
            headerRow.insertBefore(rankHeader, headerRow.firstChild);
        }

        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach(row => row.querySelector(`.${CONFIG.classNames.rankCell}`)?.remove());

        const peers = rows.map(row => ({
            row: row,
            ul: parseToBytes(row.cells[CONFIG.uploadColumnIndex]?.textContent)
        }));

        peers.sort((a, b) => b.ul - a.ul);

        const fragment = document.createDocumentFragment();
        peers.forEach((peer, index) => {
            const rank = index + 1;
            const rankCell = document.createElement('td');
            rankCell.className = CONFIG.classNames.rankCell;
            rankCell.style.textAlign = 'center';

            if (rank <= 10) {
                rankCell.innerHTML = `<span class="rank-badge rank-${rank}">${rank}</span>`;
            } else {
                rankCell.textContent = rank.toString();
            }

            peer.row.insertBefore(rankCell, peer.row.firstChild);
            fragment.appendChild(peer.row);
        });

        tbody.innerHTML = '';
        tbody.appendChild(fragment);

        applyHighlightAndStyle(tbody.querySelectorAll('tr'));
    }

    function init() {
        injectStyles();
        const observer = new MutationObserver(() => {
            const peerTable = document.querySelector(CONFIG.selectors.peerTable);
            if (peerTable && !refreshIntervalId) {
                processPeerTable();
                refreshIntervalId = setInterval(processPeerTable, CONFIG.refreshIntervalMs);
            } else if (!peerTable && refreshIntervalId) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
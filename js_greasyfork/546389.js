// ==UserScript==
// @name         TorrentBD Peer Rank (Improved)
// @version      2.0
// @description  Automatically refreshes peer ranks every 10 seconds. Highlights your username and row, and assigns Gold, Silver, and Bronze badges to the top three peers.
// @author       gaara (Improved by 5ifty6ix)
// @namespace    5ifty6ix
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546389/TorrentBD%20Peer%20Rank%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546389/TorrentBD%20Peer%20Rank%20%28Improved%29.meta.js
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
            selfUser: 'tbd-self-user',
            rankHeader: 'peer-rank-header',
            rankCell: 'peer-rank-cell',
        },
        uploadColumnIndex: 4,
        refreshIntervalMs: 10000,
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
            .tbd-self-row {
                background: linear-gradient(90deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 255, 0) 20%);
                border-left: 3px solid #00ffff;
            }
            .tbd-self-user {
                color: #00ffff !important;
                font-weight: bold;
            }
        `
    };

    let refreshIntervalId = null;
    let cachedUsername = null;

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
            case 'TIB': return value * Math.pow(1024, 4);
            case 'GIB': return value * Math.pow(1024, 3);
            case 'MIB': return value * Math.pow(1024, 2);
            case 'KIB': return value * 1024;
            default: return value;
        }
    }

    function getLoggedInUsername() {
        if (cachedUsername) return cachedUsername;
        try {
            const userElement = document.querySelector(CONFIG.selectors.username);
            const name = userElement?.childNodes[0]?.textContent.trim();
            if (name) {
                cachedUsername = name;
                return cachedUsername;
            }
        } catch (e) {
            console.error("Peer Rank Script: Could not find username element.", e);
        }
        return null;
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function applyHighlightInPeersTable(peerTable) {
        const username = getLoggedInUsername();
        if (!username) return;

        peerTable.querySelectorAll(`.${CONFIG.classNames.selfUser}`).forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize();
            }
        });

        const walker = document.createTreeWalker(peerTable, NodeFilter.SHOW_TEXT);
        const nodesToProcess = [];
        while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

        const pattern = new RegExp(`\\b${escapeRegExp(username)}\\b`, 'g');
        nodesToProcess.forEach(node => {
            if (!node.nodeValue || !pattern.test(node.nodeValue)) return;
            pattern.lastIndex = 0;
            const parent = node.parentNode;
            if (!parent || parent.nodeName === 'SCRIPT' || parent.nodeName === 'STYLE') return;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;
            while ((match = pattern.exec(node.nodeValue)) !== null) {
                fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, match.index)));
                const span = document.createElement('span');
                span.className = CONFIG.classNames.selfUser;
                span.textContent = match[0];
                fragment.appendChild(span);
                lastIndex = pattern.lastIndex;
            }
            fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
            parent.replaceChild(fragment, node);
            parent.normalize();
        });

        peerTable.querySelectorAll('tbody tr').forEach(tr => {
            tr.classList.remove(CONFIG.classNames.selfRow);
            if (tr.querySelector(`.${CONFIG.classNames.selfUser}`)) {
                tr.classList.add(CONFIG.classNames.selfRow);
            }
        });
    }

    function processPeerTable() {
        const peerTable = document.querySelector(CONFIG.selectors.peerTable);
        if (!peerTable) return;

        const headerRow = peerTable.querySelector(CONFIG.selectors.tableHeaderRow);
        const tbody = peerTable.querySelector(CONFIG.selectors.tableBody);
        if (!headerRow || !tbody) return;

        headerRow.querySelector(`.${CONFIG.classNames.rankHeader}`)?.remove();
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach(row => row.querySelector(`.${CONFIG.classNames.rankCell}`)?.remove());

        const rankHeader = document.createElement('th');
        rankHeader.className = CONFIG.classNames.rankHeader;
        rankHeader.textContent = 'Rank';
        headerRow.insertBefore(rankHeader, headerRow.firstChild);

        const peers = rows.map(row => {
            const ulText = row.cells[CONFIG.uploadColumnIndex]?.textContent || '0 B';
            return { row, ul: parseToBytes(ulText) };
        });

        peers.sort((a, b) => b.ul - a.ul);

        peers.forEach((peer, index) => {
            const rank = index + 1;
            const rankCell = document.createElement('td');
            rankCell.className = CONFIG.classNames.rankCell;
            rankCell.style.textAlign = 'center';

            if (rank <= 3) {
                rankCell.innerHTML = `<span class="rank-badge rank-${rank}">${rank}</span>`;
            } else {
                rankCell.textContent = rank.toString();
            }

            peer.row.insertBefore(rankCell, peer.row.firstChild);
            tbody.appendChild(peer.row);
        });

        applyHighlightInPeersTable(peerTable);
    }

    function init() {
        injectStyles();
        const observer = new MutationObserver(() => {
            const peerTable = document.querySelector(CONFIG.selectors.peerTable);
            if (peerTable && !refreshIntervalId) {
                getLoggedInUsername();
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

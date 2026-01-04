// ==UserScript==
// @name         TorrentBD Peer Rank
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-refreshes peer ranks every 10s, highlights your username neon cyan across the entire peer row, and adds glow for top three.
// @author       gaara
// @match        https://*.torrentbd.net/torrents-details.php*
// @grant        none
// @license       GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/544302/TorrentBD%20Peer%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/544302/TorrentBD%20Peer%20Rank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .top-peer td {
            font-weight: bold !important;
            background-color: #2c3e50 !important; /* Dark blue-grey for dark theme */
            color: #e0e0e0 !important;
        }
        body.light-scheme .top-peer td {
            background-color: #e8f5e9 !important; /* Light green for light theme */
            color: #1b5e20 !important;
        }
        .top-peer-1 td {
            color: #FF00FF !important; /* 1st: Neon Magenta */
            font-size: 1.1em !important;
        }
        .top-peer-2 td {
            color: #00FFFF !important; /* 2nd: Neon Cyan */
            font-size: 1.05em !important;
        }
        .top-peer-3 td {
            color: #39FF14 !important; /* 3rd: Neon Green */
        }

        /* Neon cyan highlight for the logged-in username (exact text only) */
        .tbd-neon-user {
            color: #00ffff !important;
            text-shadow:
                0 0 2px #00ffff,
                0 0 4px #00e5ff,
                0 0 8px #00c3ff,
                0 0 12px #00aaff;
            font-weight: 700;
            animation: tbd-neon-pulse 1.8s ease-in-out infinite;
        }
        @keyframes tbd-neon-pulse {
            0%, 100% { text-shadow:
                0 0 1px #00ffff,
                0 0 3px #00e5ff,
                0 0 6px #00c3ff,
                0 0 9px #00aaff; }
            50% { text-shadow:
                0 0 3px #00ffff,
                0 0 6px #00e5ff,
                0 0 12px #00c3ff,
                0 0 18px #00aaff; }
        }

        /* Glow for full row of logged-in user */
        .tbd-row-glow td {
            color: #00ffff !important;
            text-shadow:
                0 0 2px #00ffff,
                0 0 4px #00e5ff,
                0 0 8px #00c3ff,
                0 0 12px #00aaff;
            animation: tbd-neon-pulse 1.8s ease-in-out infinite;
        }

        /* Add glow effect to the top three rows in addition to their color */
        .top-peer-1 td,
        .top-peer-2 td,
        .top-peer-3 td {
            text-shadow:
                0 0 1px currentColor,
                0 0 3px currentColor,
                0 0 6px currentColor;
            animation: tbd-top3-pulse 2.2s ease-in-out infinite;
        }
        @keyframes tbd-top3-pulse {
            0%, 100% { text-shadow:
                0 0 1px currentColor,
                0 0 3px currentColor,
                0 0 6px currentColor; }
            50% { text-shadow:
                0 0 2px currentColor,
                0 0 6px currentColor,
                0 0 10px currentColor; }
        }
    `;
    document.head.appendChild(style);

    function parseToBytes(uploadStr) {
        if (!uploadStr) return 0;
        const parts = uploadStr.trim().split(' ');
        if (parts.length < 2) return 0;

        let value = parseFloat(parts[0].replace(/,/g, ''));
        const unit = parts[1].toUpperCase();

        switch (unit) {
            case 'TIB':
                return value * Math.pow(1024, 4);
            case 'GIB':
                return value * Math.pow(1024, 3);
            case 'MIB':
                return value * Math.pow(1024, 2);
            case 'KIB':
                return value * 1024;
            case 'B':
                return value;
            default:
                return 0;
        }
    }

    let refreshIntervalId = null;
    let cachedUsername = null;

    /**
     * Extract the logged-in username from the left profile card.
     * We read the visible card-title first, then fallback to the card-reveal.
     * Any inline icons/images are ignored; we use textContent trimmed.
     */
    function getLoggedInUsername() {
        if (cachedUsername) return cachedUsername;
        try {
            // Primary: left-block card title -> .tbdrank span contains username (with optional <img>)
            const primary = document.querySelector('#left-block-container .card .card-content .card-title .tbdrank');
            if (primary && primary.textContent) {
                const name = primary.textContent.trim();
                if (name) {
                    cachedUsername = name;
                    return cachedUsername;
                }
            }
            // Fallback: card-reveal title (e.g., <span class="card-title">gaara</span>)
            const fallback = document.querySelector('#left-block-container .card .card-reveal .card-title');
            if (fallback && fallback.textContent) {
                const name2 = fallback.textContent.trim();
                if (name2) {
                    cachedUsername = name2;
                    return cachedUsername;
                }
            }
        } catch (e) {
            // ignore
        }
        return null;
    }

    /**
     * Remove prior neon wrappers to keep idempotency across refreshes.
     */
    function removePreviousUsernameHighlights(scopeEl) {
        scopeEl.querySelectorAll('.tbd-neon-user').forEach(span => {
            const parent = span.parentNode;
            if (!parent) return;
            // Replace the wrapper span with a plain text node of its text
            const textNode = document.createTextNode(span.textContent);
            parent.replaceChild(textNode, span);
            parent.normalize(); // merge adjacent text nodes
        });
    }

    /**
     * Wrap exact username text occurrences inside text nodes with a span.
     * Only operates within the provided root element.
     * Excludes text inside script/style.
     */
    function wrapExactText(root, text, className) {
        if (!root || !text) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                // Skip empty/whitespace
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                // Skip inside script/style
                const p = node.parentNode;
                if (!p) return NodeFilter.FILTER_REJECT;
                const tag = p.nodeName.toLowerCase();
                if (tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
                // Skip if already inside our highlight
                if (p.classList && p.classList.contains('tbd-neon-user')) return NodeFilter.FILTER_REJECT;
                // Consider
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const pattern = new RegExp(`\\b${escapeRegExp(text)}\\b`, 'g'); // word-bounded exact match
        const nodesToProcess = [];
        while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

        nodesToProcess.forEach(node => {
            const value = node.nodeValue;
            pattern.lastIndex = 0;
            let match;
            let lastIndex = 0;
            const fragments = [];
            while ((match = pattern.exec(value)) !== null) {
                if (match.index > lastIndex) {
                    fragments.push(document.createTextNode(value.slice(lastIndex, match.index)));
                }
                const span = document.createElement('span');
                span.className = className;
                span.textContent = match[0];
                fragments.push(span);
                lastIndex = pattern.lastIndex;
            }
            if (fragments.length) {
                if (lastIndex < value.length) {
                    fragments.push(document.createTextNode(value.slice(lastIndex)));
                }
                const parent = node.parentNode;
                fragments.forEach(f => parent.insertBefore(f, node));
                parent.removeChild(node);
                parent.normalize();
            }
        });
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Apply neon highlight for the logged-in username within the peers table.
     * Wrap exact username text and also glow the entire row that contains the username.
     */
    function applyNeonHighlightInPeersTable() {
        const username = getLoggedInUsername();
        if (!username) return;

        // Locate the peers table by the 'UL' header
        const ulHeader = Array.from(document.querySelectorAll('th')).find(th => th.textContent.trim() === 'UL');
        if (!ulHeader) return;
        const peerTable = ulHeader.closest('table');
        if (!peerTable) return;

        // Remove previous text highlights within this table
        removePreviousUsernameHighlights(peerTable);

        // Wrap exact username text in all cells for extra emphasis
        peerTable.querySelectorAll('td, th').forEach(cell => {
            wrapExactText(cell, username, 'tbd-neon-user');
        });

        // Add full-row glow for any row that contains the username
        peerTable.querySelectorAll('tbody tr').forEach(tr => {
            tr.classList.remove('tbd-row-glow');
            const text = tr.textContent || '';
            if (new RegExp(`\\b${escapeRegExp(username)}\\b`).test(text)) {
                tr.classList.add('tbd-row-glow');
            }
        });
    }

    function processPeerTable() {
        const ulHeader = Array.from(document.querySelectorAll('th')).find(th => th.textContent.trim() === 'UL');
        if (!ulHeader) return;

        const headerRow = ulHeader.parentElement;
        const peerTable = headerRow.closest('table');
        const tbody = peerTable.querySelector('tbody');
        if (!headerRow || !peerTable || !tbody) return;

        // --- Cleanup phase: Restore table to a clean state before processing ---
        const oldRankHeader = headerRow.querySelector('.peer-rank-header');
        if (oldRankHeader) oldRankHeader.remove();

        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach(row => {
            const rankCell = row.querySelector('.peer-rank-cell');
            if (rankCell) rankCell.remove();
            row.className = row.className.replace(/top-peer(-\d)?/g, '').trim();
            row.classList.remove('tbd-row-glow');
        });

        // --- Processing phase: Now that the table is clean ---
        const originalHeaders = Array.from(headerRow.children);
        const ulColumnIndex = originalHeaders.findIndex(h => h.textContent.trim() === 'UL');
        if (ulColumnIndex === -1) return;

        const rankHeader = document.createElement('th');
        rankHeader.className = 'peer-rank-header';
        rankHeader.textContent = 'Rank';
        headerRow.insertBefore(rankHeader, headerRow.firstChild);

        const peers = [];
        rows.forEach(row => {
            const cells = row.cells;
            if (cells.length > ulColumnIndex) {
                const ulText = cells[ulColumnIndex].textContent;
                const ulBytes = parseToBytes(ulText);
                peers.push({ row, ul: ulBytes });
            } else {
                peers.push({ row, ul: 0 });
            }
        });

        peers.sort((a, b) => b.ul - a.ul);

        peers.forEach((peer, index) => {
            if (index < 5) {
                peer.row.classList.add('top-peer');
                if (index === 0) peer.row.classList.add('top-peer-1');
                else if (index === 1) peer.row.classList.add('top-peer-2');
                else if (index === 2) peer.row.classList.add('top-peer-3');
            }

            const rankCell = document.createElement('td');
            rankCell.className = 'peer-rank-cell';
            rankCell.textContent = (index + 1).toString();
            rankCell.style.textAlign = 'center';
            peer.row.insertBefore(rankCell, peer.row.firstChild);

            tbody.appendChild(peer.row);
        });

        // After processing and reordering, apply neon highlight for the logged-in username
        applyNeonHighlightInPeersTable();
    }

    // Periodically detect the table and manage refreshes
    setInterval(() => {
        const ulHeader = Array.from(document.querySelectorAll('th')).find(th => th.textContent.trim() === 'UL');

        if (ulHeader && !refreshIntervalId) {
            console.log("TBD Peer Rank: Peer table detected. Starting auto-refresh cycle.");
            // Ensure username is cached early if available
            getLoggedInUsername();
            processPeerTable();
            refreshIntervalId = setInterval(processPeerTable, 10000);
        } else if (!ulHeader && refreshIntervalId) {
            console.log("TBD Peer Rank: Peer table not found. Stopping auto-refresh cycle.");
            clearInterval(refreshIntervalId);
            refreshIntervalId = null;
        } else if (ulHeader && refreshIntervalId) {
            // Table still present; ensure highlight persists even if nothing else changed
            applyNeonHighlightInPeersTable();
        }
    }, 500);
})();
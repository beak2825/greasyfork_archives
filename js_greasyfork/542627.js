// ==UserScript==
// @name         JFK Dispatch Table Modifier
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Colorizes JFK/BK/LI routes with adaptive Dark/Light mode, infers Team IDs, dims unmapped text, cleans rules, and optimizes table layout.
// @author       Sarah
// @match        https://dispatch.uniuni.site/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542627/JFK%20Dispatch%20Table%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/542627/JFK%20Dispatch%20Table%20Modifier.meta.js
// ==/UserScript==

(function(){ 'use strict';
    console.log('[tm] JFK Dispatch Table Modifier v2.3.2 loaded');

    // ==========================================================================
    // 🔹 CONFIGURATION SECTIONS
    // ==========================================================================

    const locationRoutes = {
        JFK: [
            '170006', '170076', '170008', '170069', '170002', '170011', '170015',
            '170072', '170065', '170066', '170064', '170063', '170059'
        ],
        LI: [
            '170003', '170012', '170014', '170016', '170017', '170060', '170061',
            '170062', '170067', '170068', '170073', '170082', '170084', '170086',
            '170087', '170090', '170091'
        ],
        BK: [
            '170004', '170005', '170007', '170009', '170010', '170013', '170018',
            '170019', '170020', '170021', '170022', '170070', '170075', '170078',
            '170089'
        ]
    };

    const teamMap = {
        '313':  { code: 'SD', bg: '#9900ff' },
        '576':  { code: 'GE', bg: '#ff9900' },
        '120':  { code: 'WK', bg: '#4dd0e1' },
        '798':  { code: 'AS', bg: '#ffff00' },
        '1021': { code: 'AR', bg: '#a64d79' },
        '783':  { code: 'DL', bg: '#177233' },
        '519':  { code: 'ZW', bg: '#1155cc' },
        '1004': { code: 'DGO', bg: '#FFC7C7' },
        '944':  { code: 'TY', bg: '#ff00ff' }
    };

    const routeToTeamId = {
        '170002': '576', '170003': '798', '170004': '120', '170005': '120',
        '170006': '313', '170007': '120', '170008': '783', '170009': '120',
        '170010': '120', '170011': '519', '170012': '798', '170013': '120',
        '170014': '576', '170015': '313', '170016': '798', '170017': '798',
        '170018': '120', '170019': '120', '170020': '120', '170059': '783',
        '170060': '798', '170061': '313', '170062': '798', '170063': '783',
        '170064': '783', '170065': '1021', '170066': '1004', '170067': '798',
        '170068': '798', '170069': '313', '170070': '120', '170072': '1021',
        '170073': '798', '170075': '944', '170076': '313', '170078': '120',
        '170082': '798', '170084': '576', '170086': '798', '170087': '798',
        '170089': '120', '170090': '313', '170091': '313'
    };

    // ==========================================================================
    // 🔹 CSS STYLES (ADAPTIVE DARK/LIGHT MODE)
    // ==========================================================================

    const style = document.createElement('style');
    style.innerHTML = `
        /* --- ☀️ LIGHT MODE (Standard / White Background) --- */
        /* Using darker shades for readability on white */
        .tm-bk { color: #d32f2f !important; } /* Dark Red */
        .tm-li { color: #1565c0 !important; } /* Dark Blue */
        .tm-special { color: #a0522d !important; } /* Sienna (Darker Brown) */
        .tm-dim { color: #9e9e9e !important; } /* Medium Grey */
        .tm-jfk { color: inherit !important; } /* Standard Text */

        /* --- 🌙 DARK MODE (Black / Dark Grey Background) --- */
        /* Using bright pastel shades for "pop" on dark */
        @media (prefers-color-scheme: dark) {
            .tm-bk { color: #ffb3b3 !important; } /* Pastel Pink */
            .tm-li { color: #99ccff !important; } /* Pastel Sky Blue */
            .tm-special { color: #d2b48c !important; } /* Tan (Light Brown) */
            .tm-dim { color: #666666 !important; } /* Dark Grey */
            .tm-jfk { color: inherit !important; } /* Standard Text */
        }
    `;
    document.head.appendChild(style);


    // ==========================================================================
    // 🔹 LOGIC IMPLEMENTATION
    // ==========================================================================

    const validPattern = /^\d+-\d+\(\d+\)(?:,\d+-\d+\(\d+\))*$/;
    const routeSets = {
        JFK: new Set(locationRoutes.JFK),
        LI: new Set(locationRoutes.LI),
        BK: new Set(locationRoutes.BK)
    };

    function reorderColumn(table) {
        if (table._reordered) return;
        table._reordered = true;
        table.querySelectorAll('thead tr, tbody tr').forEach(row => {
            const cells = Array.from(row.children);
            const sourceIdx = 6;
            const lastIdx = cells.length - 1;
            if (cells.length <= sourceIdx + 1) return;
            const cell = cells[sourceIdx];
            const ref = cells[lastIdx];
            row.removeChild(cell);
            row.insertBefore(cell, ref);
        });
    }

    function processTable() {
        const table = document.querySelector('table.w-full');
        if (!table) return;

        reorderColumn(table);

        table.querySelectorAll('tbody tr').forEach(row => {
            const cells = row.children;

            // 1. CLEAN RULE CELL (Index 6)
            const ruleCell = cells[6];
            if (ruleCell) {
                const wrapper = ruleCell.querySelector('div') || ruleCell;
                const text = (wrapper.textContent || '').trim();
                if (text && !validPattern.test(text)) wrapper.textContent = '';
            }

            // 2. ROUTE CELL PROCESSING (Index 1 - "2nd column")
            const routeCell = cells[1];
            let baseRoute = null;

            if (routeCell) {
                const routeWrapper = routeCell.querySelector('div') || routeCell;
                const fullText = (routeWrapper.textContent || '').trim();
                const match = fullText.match(/^(\d+)(.*)$/);

                let numClass = 'tm-dim'; // Default to dim
                let sfxClass = 'tm-dim'; // Default to dim

                if (match) {
                    baseRoute = match[1];
                    const extra = match[2];

                    if (routeSets.BK.has(baseRoute)) {
                        numClass = 'tm-bk';      // Pink/Red
                    } else if (routeSets.LI.has(baseRoute)) {
                        numClass = 'tm-li';      // Blue
                    } else if (routeSets.JFK.has(baseRoute)) {
                        numClass = 'tm-jfk';     // Regular Color
                    } else if (baseRoute === '170991') {
                        numClass = 'tm-special'; // Brown
                    } else {
                        numClass = 'tm-dim';     // Dark Grey
                    }

                    // Construct HTML with classes instead of hardcoded styles
                    const newHTML = `<span class="${numClass}">${baseRoute}</span><span class="${sfxClass}">${extra}</span>`;

                    if (routeWrapper.innerHTML !== newHTML) {
                        routeWrapper.innerHTML = newHTML;
                        routeWrapper.style.backgroundColor = 'transparent';
                    }

                } else {
                    // No numbers? Dim everything
                    const newHTML = `<span class="tm-dim">${fullText}</span>`;
                    if (routeWrapper.innerHTML !== newHTML) {
                        routeWrapper.innerHTML = newHTML;
                         routeWrapper.style.backgroundColor = 'transparent';
                    }
                }
            }

            // 3. TEAM CELL (Index 2)
            const teamCell = cells[2];
            if (teamCell) {
                const teamWrapper = teamCell.querySelector('div') || teamCell;
                let rawId = (teamWrapper.textContent || '').trim();
                if ((!rawId || rawId === '-' || rawId === '—') && baseRoute && routeToTeamId[baseRoute]) {
                    rawId = routeToTeamId[baseRoute];
                }
                const info = teamMap[rawId];
                if (info) {
                    teamWrapper.textContent = info.code;
                    teamWrapper.style.backgroundColor = info.bg;
                    teamWrapper.style.color = '#000';
                }
            }

            // 4. SCAN BADGE (Index 5)
            const scanCell = cells[5];
            const routeNum = (cells[1]?.textContent || '').trim();
            if (scanCell && routeNum !== '170991') {
                const badge = scanCell.querySelector('span') || scanCell.firstElementChild;
                if (badge) {
                    badge.classList.forEach(c => {
                        if (c.startsWith('bg-') || c.startsWith('text-')) badge.classList.remove(c);
                    });
                    badge.style.backgroundColor = '#d0e0e3';
                    badge.style.color = '#666666';
                    badge.style.fontSize = '0.875rem';
                }
            }
        });
    }

    // 🔹 OBSERVERS
    const observer = new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                const tbl = node.matches && node.matches('table.w-full') ? node : node.querySelector && node.querySelector('table.w-full');
                if (tbl) { hookTable(tbl); processTable(); }
            }
        }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function hookTable(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody || tbody._hooked) return;
        tbody._hooked = true;
        new MutationObserver(processTable).observe(tbody, { childList: true, subtree: true, characterData: true });
    }

    const initial = document.querySelector('table.w-full');
    if (initial) { hookTable(initial); processTable(); }

    ['pushState','replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function(...args) {
            const res = orig.apply(this, args);
            window.dispatchEvent(new Event('tm-route-change'));
            return res;
        };
    });
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('tm-route-change')));
    window.addEventListener('tm-route-change', () => setTimeout(processTable, 200));
    setInterval(processTable, 500);

})();
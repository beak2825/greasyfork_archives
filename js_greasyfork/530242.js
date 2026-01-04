// ==UserScript==
// @name         nyaa.si magnet copy/paste
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Copy magnet URI's of selected/searched tables
// @match        https://nyaa.si/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530242/nyaasi%20magnet%20copypaste.user.js
// @updateURL https://update.greasyfork.org/scripts/530242/nyaasi%20magnet%20copypaste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uncheckedIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/></svg>`;
    const checkedIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#1976d2" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/><path d="M6 12l4 4 8-8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 7v6a9 9 0 0 0 9 9a9 9 0 0 0 9-9V7h-4v6a5 5 0 0 1-5 5a5 5 0 0 1-5-5V7m10-2h4V2h-4M3 5h4V2H3"/></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><path fill="currentColor" d="m106.667 64l298.666 201.671l-115.905 40.035l66.066 110.419L298.28 448l-66.067-110.419l-93.883 76.841z"/></svg>`;

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Style for the select column header & cells */
            th.select-col, td.select-col {
                text-align: center;
                vertical-align: middle;
                padding: 0.5rem;
            }
            /* Row select button styling */
            .shadcn-select-btn {
                padding: 4px;
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .shadcn-select-btn:hover {
                transform: scale(1.1);
            }
            /* Top buttons container */
            .magnet-button-container {
                margin: 20px 0;
                display: flex;
                gap: 12px;
            }
            /* Top buttons with icon & text */
            .magnet-button {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                font-size: 14px;
                cursor: pointer;
                background-color: #1976d2;
                border: none;
                border-radius: 4px;
                color: #fff;
                transition: background-color 0.3s ease, transform 0.2s ease;
            }
            .magnet-button:hover {
                background-color: #115293;
                transform: translateY(-1px);
            }
            /* Style for selected rows */
            tr.selected-row {
                background-color: #d0ebff !important;
                transition: background-color 0.3s ease;
            }
            /* Icon within top buttons */
            .btn-icon {
                display: inline-flex;
                vertical-align: middle;
            }
            .btn-text {
                display: inline-flex;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }

    function addSelectColumnHeader(table) {
        const thead = table.querySelector('thead');
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                const selectTh = document.createElement('th');
                selectTh.className = 'select-col';
                selectTh.style.width = '50px';
                selectTh.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;
                headerRow.insertBefore(selectTh, headerRow.firstChild);
            }
        }
    }

    function addSelectButtonsToRows(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const selectTd = document.createElement('td');
            selectTd.className = 'select-col';
            const btn = document.createElement('button');
            btn.className = 'shadcn-select-btn';
            btn.innerHTML = uncheckedIcon;
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                btn.classList.toggle('selected');
                if (btn.classList.contains('selected')) {
                    btn.innerHTML = checkedIcon;
                    row.classList.add('selected-row');
                } else {
                    btn.innerHTML = uncheckedIcon;
                    row.classList.remove('selected-row');
                }
            });
            selectTd.appendChild(btn);
            row.insertBefore(selectTd, row.firstChild);
        });
    }

    function addCopyButtons() {
        const table = document.querySelector('table.torrent-list');
        if (!table) return;

        const container = document.createElement('div');
        container.className = 'magnet-button-container';

        const copyAllBtn = document.createElement('button');
        copyAllBtn.className = 'magnet-button';
        copyAllBtn.innerHTML = `<span class="btn-icon">${copyIcon}</span><span class="btn-text">Copy Magnets</span>`;
        container.appendChild(copyAllBtn);

        const copySelectedBtn = document.createElement('button');
        copySelectedBtn.className = 'magnet-button';
        copySelectedBtn.innerHTML = `<span class="btn-icon">${checkIcon}</span><span class="btn-text">Copy Selected</span>`;
        container.appendChild(copySelectedBtn);

        table.parentNode.insertBefore(container, table);

        copyAllBtn.addEventListener('click', () => {
            let magnetLinks = Array.from(table.querySelectorAll('a[href^="magnet:"]'))
                                   .map(a => a.href);
            magnetLinks = Array.from(new Set(magnetLinks));
            const magnetsText = magnetLinks.join('\n');
            navigator.clipboard.writeText(magnetsText)
                .then(() => {
                    const originalHTML = copyAllBtn.innerHTML;
                    copyAllBtn.innerHTML = `<span class="btn-icon">${copyIcon}</span><span class="btn-text">Copied!</span>`;
                    setTimeout(() => { copyAllBtn.innerHTML = originalHTML; }, 2000);
                })
                .catch(err => console.error('Error copying all magnet links:', err));
        });

        copySelectedBtn.addEventListener('click', () => {
            const selectedRows = table.querySelectorAll('tbody tr.selected-row');
            if (selectedRows.length === 0) {
                alert('Please select one or more rows using the select buttons first.');
                return;
            }
            let selectedMagnets = [];
            selectedRows.forEach(row => {
                const magnets = Array.from(row.querySelectorAll('a[href^="magnet:"]'))
                                     .map(a => a.href);
                selectedMagnets = selectedMagnets.concat(magnets);
            });
            selectedMagnets = Array.from(new Set(selectedMagnets));
            const magnetsText = selectedMagnets.join('\n');
            navigator.clipboard.writeText(magnetsText)
                .then(() => {
                    const originalHTML = copySelectedBtn.innerHTML;
                    copySelectedBtn.innerHTML = `<span class="btn-icon">${checkIcon}</span><span class="btn-text">Copied!</span>`;
                    setTimeout(() => { copySelectedBtn.innerHTML = originalHTML; }, 2000);
                })
                .catch(err => console.error('Error copying selected magnet links:', err));
        });
    }

    window.addEventListener('load', function() {
        const table = document.querySelector('table.torrent-list');
        if (table) {
            addStyles();
            addSelectColumnHeader(table);
            addSelectButtonsToRows(table);
            addCopyButtons();
        }
    });
})();

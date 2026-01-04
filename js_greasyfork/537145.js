// ==UserScript==
// @name         Club Royale Offer Modifier
// @namespace    http://tampermonkey.net/
// @version      0.9.9
// @description  Sorts and modifies the Club Royale offers table to track seen, hide, comment, and improve UI.
// @match        https://www.clubroyaleoffers.com/PlayerLookup.asp
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537145/Club%20Royale%20Offer%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/537145/Club%20Royale%20Offer%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants for GM storage keys
    const SEEN_KEY_PREFIX = 'offer_seen_';
    const HIDDEN_KEY_PREFIX = 'offer_hidden_';
    const COMMENT_KEY_PREFIX = 'offer_comment_';

    // SVG Icons
    const ICON_EYE_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.659-2.938C4.508 3.37 6.522 2.5 8 2.5c1.479 0 3.492.87 5.168 2.562A13.133 13.133 0 0 1 14.828 8c-.878 1.64-2.533 2.938-4.832 3.938C8.492 12.63 6.522 13.5 8 13.5c-1.479 0-3.492-.87-5.168-2.562A13.133 13.133 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>';
    const ICON_EYE_SLASH = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.117-.122.229-.194.338-.094.145-.21.288-.338.426L13.359 11.238zM3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.338c.109.19.238.37.386.547l.771-.772A7.029 7.029 0 0 1 3.5 8c0-.59.091-1.153.255-1.688l-.405-.405zM7.543 9.922l.771.772A2.5 2.5 0 0 1 8 10.5c.664 0 1.268-.27 1.688-.707l.707-.707A3.5 3.5 0 0 0 8 7.5c-.702 0-1.359.224-1.88.605l-.404.404z"/><path d="M8.534 12.558a2.5 2.5 0 0 1-3.068-3.068l-3.068-3.068a3.5 3.5 0 0 0 4.474 4.474l1.662 1.662a2.5 2.5 0 0 1-3.068-3.068l-3.068-3.068a3.5 3.5 0 0 0 4.474 4.474l1.662 1.662a2.5 2.5 0 0 1-3.068-3.068zM2.223 2.223a.5.5 0 0 1 .707 0l10.607 10.607a.5.5 0 0 1-.707.707L2.223 2.93a.5.5 0 0 1 0-.707z"/></svg>';
    const ICON_TRASH = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    const ICON_UNDO = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>';

    // --- Add custom CSS ---
    function addCustomStyles() {
        const styleId = 'club-royale-custom-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            #newOfferTable td, #newOfferTable th {
                vertical-align: middle !important;
            }
            #newOfferTable tbody tr:hover td {
                background-color: #f0f8ff !important;
            }
            #newOfferTable .view-link,
            #newOfferTable .view-link:visited {
                color: black !important;
                text-decoration: underline !important;
            }
            #newOfferTable .sortable-header {
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
            }
            .sort-indicator { display: inline-block; width: 1em; text-align: left; }
            .sort-indicator.asc::after { content: ' ▲'; font-size: 0.8em; }
            .sort-indicator.desc::after { content: ' ▼'; font-size: 0.8em; }
        `;
        document.head.appendChild(style);
    }

    // --- Helper functions ---
    function getItem(key, defaultValue) { return GM_getValue(key, defaultValue); }
    function setItem(key, value) { GM_setValue(key, value); }
    function getOfferId(row) { return row.cells && row.cells.length > 8 ? row.cells[8].textContent.trim() : null; }
    function toggleOfferSeen(offerId) { const status = isOfferSeen(offerId); setItem(SEEN_KEY_PREFIX + offerId, !status); return !status; }
    function isOfferSeen(offerId) { return getItem(SEEN_KEY_PREFIX + offerId, false); }
    function setRowHiddenState(offerId, isHidden) { setItem(HIDDEN_KEY_PREFIX + offerId, isHidden); }
    function isRowMarkedHidden(offerId) { return getItem(HIDDEN_KEY_PREFIX + offerId, false); }
    function setRowComment(offerId, comment) { setItem(COMMENT_KEY_PREFIX + offerId, comment); }
    function getRowComment(offerId) { return getItem(COMMENT_KEY_PREFIX + offerId, ''); }

    // --- Row Appearance ---
    function updateRowAppearance(row, offerId, isGloballyShowingHidden) {
        const isSeenStatus = isOfferSeen(offerId);
        const isMarkedAsHidden = isRowMarkedHidden(offerId);
        if (isMarkedAsHidden) {
            row.style.color = 'red';
            row.style.fontWeight = 'normal';
            row.style.backgroundColor = '';
            row.style.display = isGloballyShowingHidden ? '' : 'none';
        } else {
            row.style.color = '';
            row.style.fontWeight = isSeenStatus ? 'normal' : 'bold';
            row.style.backgroundColor = isSeenStatus ? '#e6e6e6' : '';
            row.style.display = '';
        }
    }

    // --- Sorting Logic ---
    function sortOfferTable(table, columnIndex, isAscending) {
        const tableBody = table.tBodies[0];
        const rows = Array.from(tableBody.rows).slice(1);

        const visibleRows = rows.filter(row => !isRowMarkedHidden(getOfferId(row)));
        const hiddenRows = rows.filter(row => isRowMarkedHidden(getOfferId(row)));

        const dataTypes = { 6: 'date', 9: 'number' };
        const dataType = dataTypes[columnIndex] || 'string';

        const parseValue = (row) => {
            const cell = row.cells[columnIndex];
            if (!cell) return null;
            const text = cell.textContent.trim();
            if (dataType === 'date') return new Date(text);
            if (dataType === 'number') return parseInt(text.replace('$', ''), 10) || 0;
            return text.toLowerCase();
        };

        visibleRows.sort((a, b) => {
            const valA = parseValue(a);
            const valB = parseValue(b);
            let comparison = 0;
            if (valA > valB) comparison = 1;
            else if (valA < valB) comparison = -1;
            return isAscending ? comparison : comparison * -1;
        });

        visibleRows.forEach(row => tableBody.appendChild(row));
        hiddenRows.forEach(row => tableBody.appendChild(row));

        table.dataset.sortColumn = columnIndex;
        table.dataset.sortDirection = isAscending ? 'asc' : 'desc';
        updateSortIndicators(table);
    }

    function updateSortIndicators(table) {
        const sortColumn = table.dataset.sortColumn;
        const sortDirection = table.dataset.sortDirection;
        table.querySelectorAll('.sort-indicator').forEach(ind => ind.className = 'sort-indicator');
        const headerCell = table.rows[0].cells[sortColumn];
        if (headerCell) {
            const activeIndicator = headerCell.querySelector('.sort-indicator');
            if (activeIndicator) activeIndicator.classList.add(sortDirection);
        }
    }

    // --- Main function to process the offer table ---
    function processOfferTable(newTable, showingHiddenInitially) {
        if (!newTable.tBodies[0] || newTable.tBodies[0].rows.length === 0) return;

        let currentGlobalShowingHidden = showingHiddenInitially;
        const tableBody = newTable.tBodies[0];
        const headerRow = tableBody.rows[0];

        // RENAME AND PREPARE HEADERS
        const sortableColumns = { 4: 'Offer Name', 5: 'Offer Type', 6: 'Expires', 8: 'CODE', 9: 'VALUE' };
        if (headerRow) {
            Array.from(headerRow.cells).forEach((cell, index) => {
                const textElement = cell.querySelector('u > b');
                if (textElement) {
                    const text = textElement.textContent.trim();
                    if (text === 'OFFER CODE') textElement.textContent = 'CODE';
                    if (text === 'TRADE IN VALUE') textElement.textContent = 'VALUE';
                }
                if (index === 1 || index === 2 || index === 3) cell.style.display = 'none';

                if (sortableColumns[index]) {
                    cell.classList.add('sortable-header');
                    cell.title = `Click to sort by ${sortableColumns[index]}`;
                    // FIX: Append indicator inside the text element to prevent wrapping
                    const textHolder = cell.querySelector('u > b');
                    if (textHolder) {
                         const indicatorSpan = document.createElement('span');
                         indicatorSpan.className = 'sort-indicator';
                         textHolder.appendChild(indicatorSpan);
                    }
                    cell.addEventListener('click', () => {
                        const currentSortCol = newTable.dataset.sortColumn;
                        const isAsc = newTable.dataset.sortDirection === 'asc';
                        const newDirection = (currentSortCol == index && isAsc) ? false : true;
                        sortOfferTable(newTable, index, newDirection);
                    });
                }
            });
            // ADD "ACTIONS" HEADER
            const actionsHeader = document.createElement('th');
            actionsHeader.align = 'center';
            actionsHeader.innerHTML = '<h4><u><b>ACTIONS</b></u></h4>';
            actionsHeader.colSpan = 3;
            headerRow.appendChild(actionsHeader);
        }

        let showHiddenButton = document.createElement('button');
        showHiddenButton.textContent = currentGlobalShowingHidden ? 'Hide Hidden Records' : 'Show Hidden Records';
        showHiddenButton.style.cssText = 'margin-bottom: 10px; margin-right: 10px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;';
        showHiddenButton.addEventListener('click', function() {
            currentGlobalShowingHidden = !currentGlobalShowingHidden;
            this.textContent = currentGlobalShowingHidden ? 'Hide Hidden Records' : 'Show Hidden Records';
            for (let row of tableBody.rows) {
                let id = getOfferId(row);
                if (id) updateRowAppearance(row, id, currentGlobalShowingHidden);
            }
        });
        newTable.parentNode.insertBefore(showHiddenButton, newTable);


        for (let i = 1; i < tableBody.rows.length; i++) {
            let row = tableBody.rows[i];
            let offerId = getOfferId(row);
            if (!offerId) continue;

            if (row.cells.length > 3) {
                row.cells[1].style.display = 'none';
                row.cells[2].style.display = 'none';
                row.cells[3].style.display = 'none';
            }

            updateRowAppearance(row, offerId, currentGlobalShowingHidden);

            const viewLink = row.querySelector('a.changeDialog');
            if (viewLink) {
                const offerGUID = viewLink.getAttribute('data-id');
                if (offerGUID) {
                    viewLink.textContent = 'View';
                    viewLink.href = 'https://www.clubroyaleoffers.com/GetOfferInformationUploadFilesLocal.asp?OfferGUID=' + offerGUID;
                    viewLink.target = '_blank';
                    viewLink.rel = 'noopener noreferrer';
                    viewLink.classList.remove('changeDialog');
                    viewLink.classList.add('view-link');
                    viewLink.onclick = null;
                }
            }

            let seenCell = row.insertCell(-1);
            let markSeenButton = document.createElement('button');
            markSeenButton.style.cssText = 'padding: 5px; border: none; background: transparent; cursor: pointer;';
            const currentSeenStatus = isOfferSeen(offerId);
            markSeenButton.innerHTML = currentSeenStatus ? ICON_EYE_SLASH : ICON_EYE_OPEN;
            markSeenButton.title = currentSeenStatus ? 'Mark as Unseen' : 'Mark as Seen';
            markSeenButton.addEventListener('click', function() {
                toggleOfferSeen(offerId);
                updateRowAppearance(row, offerId, currentGlobalShowingHidden);
                this.innerHTML = isOfferSeen(offerId) ? ICON_EYE_SLASH : ICON_EYE_OPEN;
                this.title = isOfferSeen(offerId) ? 'Mark as Unseen' : 'Mark as Seen';
            });
            seenCell.appendChild(markSeenButton);

            let hideCell = row.insertCell(-1);
            let hideButton = document.createElement('button');
            hideButton.style.cssText = 'padding: 5px; border: none; background: transparent; cursor: pointer;';
            const currentMarkedHiddenStatus = isRowMarkedHidden(offerId);
            hideButton.innerHTML = currentMarkedHiddenStatus ? ICON_UNDO : ICON_TRASH;
            hideButton.title = currentMarkedHiddenStatus ? 'Show Offer' : 'Hide Offer';
            hideButton.addEventListener('click', function() {
                setRowHiddenState(offerId, !isRowMarkedHidden(offerId));
                updateRowAppearance(row, offerId, currentGlobalShowingHidden);
                sortOfferTable(newTable, parseInt(newTable.dataset.sortColumn), newTable.dataset.sortDirection === 'asc');
            });
            hideCell.appendChild(hideButton);

            let commentCell = row.insertCell(-1);
            let commentTextarea = document.createElement('textarea');
            commentTextarea.value = getRowComment(offerId);
            commentTextarea.placeholder = 'Enter comments...';
            commentTextarea.style.cssText = 'width: 400px; min-height: 30px;';
            commentTextarea.rows = 3;
            commentTextarea.addEventListener('blur', function() { setRowComment(offerId, this.value); });
            commentCell.appendChild(commentTextarea);
        }

        sortOfferTable(newTable, 6, true); // DEFAULT SORT
    }

    // --- Table Setup ---
    function setupOfferTables() {
        let originalTable = document.querySelector('div.container table table');
        if (originalTable) {
            let newOfferTable = document.createElement('table');
            newOfferTable.id = 'newOfferTable';

            if(originalTable.getAttribute('border')) newOfferTable.setAttribute('border', originalTable.getAttribute('border'));
            if(originalTable.getAttribute('cellspacing')) newOfferTable.setAttribute('cellspacing', originalTable.getAttribute('cellspacing'));
            if(originalTable.getAttribute('cellpadding')) newOfferTable.setAttribute('cellpadding', originalTable.getAttribute('cellpadding'));
            if(originalTable.className) newOfferTable.className = originalTable.className;
            newOfferTable.style.width = "100%";

            const tableBody = newOfferTable.appendChild(document.createElement('tbody'));

            if (originalTable.rows.length > 3) {
                let headerToClone = originalTable.rows[3];
                tableBody.appendChild(headerToClone.cloneNode(true));
                headerToClone.remove();
                while (originalTable.rows.length > 3) {
                    tableBody.appendChild(originalTable.rows[3]);
                }
            }
            if (originalTable.parentNode) {
                originalTable.parentNode.insertBefore(newOfferTable, originalTable.nextSibling);
            }
            processOfferTable(newOfferTable, false);
        } else {
            setTimeout(setupOfferTables, 500);
        }
    }

    window.addEventListener('load', function() {
        addCustomStyles();
        setupOfferTables();
    });

})();
// ==UserScript==
// @name         1337x Magnet Link Fetcher
// @version      1.9
// @description  Adds checkboxes and magnet link extraction functionality to 1337x.to search results
// @author       neokyuubi
// @match        *://1337x.to/*
// @match        *://www.1337x.to/*
// @namespace    https://github.com/neokyuubi/1337x-Magnet-Link-Fetcher
// @icon         https://1337x.to/favicon.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528928/1337x%20Magnet%20Link%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/528928/1337x%20Magnet%20Link%20Fetcher.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Only run on search and listing pages
    if (!window.location.href.includes('/search/') && 
        !window.location.href.includes('/category/') && 
        !window.location.href.includes('/category-search/') && 
        !window.location.href.includes('/popular/') && 
        !window.location.href.includes('/top-100') && 
        !window.location.href.includes('/sort-search/') && 
        !window.location.href.includes('/trending') && 
        !window.location.href.includes('/movie-library/') && 
        !window.location.href.includes('/cat/')) {
        return;
    }

    // Variables for shift-click functionality
    let lastChecked = null;
    let shiftPressed = false;

    // Track shift key state
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = true;
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
        }
    });

    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .checkbox-column { width: 30px; text-align: center; }
        .magnet-column { width: 100px; text-align: center; }
        .action-buttons {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }
        .action-button {
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-weight: bold;
        }
        .action-button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        .magnet-link {
            cursor: pointer;
            color: #4CAF50;
            font-weight: bold;
        }
        .magnet-link:hover {
            text-decoration: underline;
        }
        .copy-success {
            color: green;
            transition: opacity 1s;
        }
    `;
    document.head.appendChild(style);

    // Find the table containing search results - improved selector
    const table = document.querySelector('table.table-list') || 
                  document.querySelector('.table-list') || 
                  document.querySelector('table.table.table-responsive.table-striped');
    if (!table) return;

    // Add header columns for checkbox and magnet
    const headerRow = table.querySelector('thead tr');
    if (!headerRow) return; // Safety check
    
    const checkboxHeader = document.createElement('th');
    checkboxHeader.className = 'checkbox-column';
    checkboxHeader.textContent = '';
    headerRow.insertBefore(checkboxHeader, headerRow.firstChild);

    const magnetHeader = document.createElement('th');
    magnetHeader.className = 'magnet-column';
    magnetHeader.textContent = 'Magnet';
    headerRow.appendChild(magnetHeader);

    // Add checkboxes and magnet cells to each row
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        // Add checkbox column
        const checkboxCell = document.createElement('td');
        checkboxCell.className = 'checkbox-column';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        // Implement shift-click functionality
        checkbox.addEventListener('click', function(e) {
            if (shiftPressed && lastChecked && lastChecked !== this) {
                // Get all checkboxes
                const checkboxes = Array.from(document.querySelectorAll('.checkbox-column input[type="checkbox"]'));

                // Find indices of current and last checked boxes
                const startIndex = checkboxes.indexOf(this);
                const endIndex = checkboxes.indexOf(lastChecked);

                // Determine range to check (works in both directions)
                const start = Math.min(startIndex, endIndex);
                const end = Math.max(startIndex, endIndex);

                // Check all checkboxes in the range
                for (let i = start; i <= end; i++) {
                    checkboxes[i].checked = this.checked;
                }
            }

            // Update lastChecked reference
            lastChecked = this;
        });

        checkboxCell.appendChild(checkbox);
        row.insertBefore(checkboxCell, row.firstChild);

        // Add magnet column
        const magnetCell = document.createElement('td');
        magnetCell.className = 'magnet-column';
        const torrentLink = row.querySelector('a[href^="/torrent/"]');
        if (torrentLink) {
            magnetCell.dataset.torrentUrl = torrentLink.href;
        }
        row.appendChild(magnetCell);
    });

    // Create sticky action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';

    const fetchButton = document.createElement('button');
    fetchButton.className = 'action-button';
    fetchButton.textContent = 'Fetch Selected Links';
    fetchButton.onclick = fetchSelectedMagnetLinks;

    const copyAllButton = document.createElement('button');
    copyAllButton.className = 'action-button';
    copyAllButton.textContent = 'Copy All Links';
    copyAllButton.onclick = copyAllMagnetLinks;
    copyAllButton.disabled = true;

    actionButtons.appendChild(fetchButton);
    actionButtons.appendChild(copyAllButton);
    document.body.appendChild(actionButtons);

    // Function to fetch magnet links for selected torrents
    function fetchSelectedMagnetLinks() {
        const checkedRows = document.querySelectorAll('.checkbox-column input[type="checkbox"]:checked');
        if (checkedRows.length === 0) {
            alert('No torrents selected! Please select at least one torrent.');
            return;
        }

        let completedRequests = 0;
        let totalRequests = checkedRows.length;

        fetchButton.disabled = true;
        fetchButton.textContent = `Fetching... (0/${totalRequests})`;

        checkedRows.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const magnetCell = row.querySelector('.magnet-column');
            const torrentUrl = magnetCell.dataset.torrentUrl;

            // Skip if we already fetched this link
            if (magnetCell.innerHTML !== '') {
                completedRequests++;
                updateFetchButtonStatus(completedRequests, totalRequests);
                return;
            }

            // Skip if no torrent URL found
            if (!torrentUrl) {
                magnetCell.textContent = 'No URL';
                completedRequests++;
                updateFetchButtonStatus(completedRequests, totalRequests);
                return;
            }

            // Fetch the torrent page
            GM_xmlhttpRequest({
                method: 'GET',
                url: torrentUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Extract magnet link
                    const magnetLink = doc.querySelector('a[href^="magnet:"]');
                    if (magnetLink) {
                        const magnetUrl = magnetLink.href;

                        // Create copy button for the magnet link
                        const copyLink = document.createElement('span');
                        copyLink.className = 'magnet-link';
                        copyLink.textContent = 'Copy';
                        copyLink.dataset.magnetUrl = magnetUrl;
                        copyLink.onclick = function() {
                            navigator.clipboard.writeText(magnetUrl).then(() => {
                                const originalText = copyLink.textContent;
                                copyLink.textContent = 'Copied!';
                                copyLink.classList.add('copy-success');
                                setTimeout(() => {
                                    copyLink.textContent = originalText;
                                    copyLink.classList.remove('copy-success');
                                }, 1000);
                            });
                        };

                        magnetCell.innerHTML = '';
                        magnetCell.appendChild(copyLink);
                    } else {
                        magnetCell.textContent = 'Not found';
                    }

                    completedRequests++;
                    updateFetchButtonStatus(completedRequests, totalRequests);
                },
                onerror: function() {
                    magnetCell.textContent = 'Error';
                    completedRequests++;
                    updateFetchButtonStatus(completedRequests, totalRequests);
                }
            });
        });
    }

    // Update fetch button status
    function updateFetchButtonStatus(completed, total) {
        fetchButton.textContent = `Fetching... (${completed}/${total})`;

        if (completed === total) {
            fetchButton.textContent = 'Fetch Selected Links';
            fetchButton.disabled = false;
            copyAllButton.disabled = false;
        }
    }

    // Function to copy all magnet links
    function copyAllMagnetLinks() {
        const magnetLinks = [];
        const magnetCells = document.querySelectorAll('.magnet-link');

        magnetCells.forEach(link => {
            if (link.dataset.magnetUrl) {
                magnetLinks.push(link.dataset.magnetUrl);
            }
        });

        if (magnetLinks.length === 0) {
            alert('No magnet links found!');
            return;
        }

        navigator.clipboard.writeText(magnetLinks.join('\n')).then(() => {
            const originalText = copyAllButton.textContent;
            copyAllButton.textContent = 'Copied All Links!';
            setTimeout(() => {
                copyAllButton.textContent = originalText;
            }, 1000);
        });
    }
})();
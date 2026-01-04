// ==UserScript==
// @name          TorrentBD: Batch Torrent Downloader (Optimized)
// @namespace     eLibrarian-userscripts
// @description   Download torrents from multiple pages at once, with an option to download only inactive or size-limited torrents.
// @version       0.4
// @author        gaara (optimized by AI)
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/download-history.php*
// @match         https://*.torrentbd.com/download-history.php*
// @match         https://*.torrentbd.org/download-history.php*
// @match         https://*.torrentbd.me/download-history.php*
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/528954/TorrentBD%3A%20Batch%20Torrent%20Downloader%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528954/TorrentBD%3A%20Batch%20Torrent%20Downloader%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        delayBetweenPages: 500,    // (ms)
        delayBetweenDownloads: 100, // (ms)
        selectors: {
            pagination: '.pagination-block',
            tableRows: 'table.notif-table tbody tr',
            downloadLink: 'td.dl-btn-td a',
            sizeCell: 'td:nth-child(3)', // The 3rd column in the row contains the size
            inactiveRow: ':has(td.active-status-td span[title="No"])',
            totalPagesLink: '.pagination li a[href*="page="]',
        },
        styles: {
            button: `
                margin: 15px auto; display: block; padding: 8px 16px; color: white;
                border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s;`,
            dialogOverlay: `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7);
                display: flex; justify-content: center; align-items: center; z-index: 10000;`,
            dialogContent: `
                width: 400px; background: #2d2d2d; padding: 20px 25px; border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5); color: #fff;`,
            toast: `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(50, 50, 50, 0.95); color: white; padding: 20px; border-radius: 8px;
                z-index: 10001; text-align: center; min-width: 300px; box-shadow: 0 5px 25px rgba(0,0,0,0.5);`,
            progressBarContainer: `
                width: 100%; height: 5px; background: #555; margin-top: 10px; border-radius: 2px; overflow: hidden;`,
            progressBar: `
                width: 0%; height: 100%; background: #4b8b61; transition: width 0.3s ease-in-out;`
        }
    };

    // --- State Management ---
    const STATE = {
        isRunning: false,
        shouldStop: false,
        elements: {} // To cache DOM elements
    };

    // --- Main Logic ---

    function addDownloadButton() {
        const pagination = document.querySelector(CONFIG.selectors.pagination);
        if (!pagination || document.getElementById('batch-download-btn')) return;

        const button = document.createElement('button');
        button.id = 'batch-download-btn';
        button.textContent = 'Batch Download Torrents';
        button.style.cssText = CONFIG.styles.button;
        button.style.backgroundColor = '#4b8b61';

        button.addEventListener('click', () => {
            if (STATE.isRunning) {
                STATE.shouldStop = true;
                updateButtonState(false, 'Stopping...');
            } else {
                showSettingsDialog();
            }
        });

        STATE.elements.downloadButton = button;
        pagination.appendChild(button);
    }

    function updateButtonState(isRunning, text) {
        STATE.isRunning = isRunning;
        const button = STATE.elements.downloadButton;
        if (!button) return;

        button.disabled = (text === 'Stopping...');
        button.textContent = text || (isRunning ? 'Stop Download' : 'Batch Download Torrents');
        button.style.backgroundColor = isRunning ? '#ef5350' : '#4b8b61';
    }

    function showSettingsDialog() {
        const totalPages = detectTotalPages();
        if (totalPages === 0) {
            alert('Could not detect total pages. Ensure you are on the download history page.');
            return;
        }

        const existingDialog = document.getElementById('batch-dl-dialog');
        if (existingDialog) existingDialog.remove();

        const dialog = document.createElement('div');
        dialog.id = 'batch-dl-dialog';
        dialog.style.cssText = CONFIG.styles.dialogOverlay;
        dialog.innerHTML = `
            <div style="${CONFIG.styles.dialogContent}">
                <h3 style="margin: 0 0 20px; text-align: center;">Download Settings</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label for="start-page" style="display: block; margin-bottom: 5px;">Start Page:</label>
                        <input type="number" id="start-page" min="1" max="${totalPages}" value="1" style="width: 100%; padding: 8px; box-sizing: border-box; background: #3d3d3d; border: 1px solid #555; border-radius: 4px; color: #fff;">
                    </div>
                    <div>
                        <label for="end-page" style="display: block; margin-bottom: 5px;">End Page:</label>
                        <input type="number" id="end-page" min="1" max="${totalPages}" value="${totalPages}" style="width: 100%; padding: 8px; box-sizing: border-box; background: #3d3d3d; border: 1px solid #555; border-radius: 4px; color: #fff;">
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="max-size" style="display: block; margin-bottom: 5px;">Max Size (GB):</label>
                    <input type="number" id="max-size" min="0" step="0.1" placeholder="0 for no limit" style="width: 100%; padding: 8px; box-sizing: border-box; background: #3d3d3d; border: 1px solid #555; border-radius: 4px; color: #fff;">
                </div>
                <div style="margin-bottom: 20px;">
                    <input type="checkbox" id="inactive-only" style="vertical-align: middle;">
                    <label for="inactive-only" style="vertical-align: middle; cursor: pointer;">Download INACTIVE torrents only</label>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button id="cancel-btn" style="${CONFIG.styles.button} margin: 0; background: #555;">Cancel</button>
                    <button id="start-btn" style="${CONFIG.styles.button} margin: 0; background: #4b8b61;">Start Download</button>
                </div>
            </div>`;

        document.body.appendChild(dialog);

        const closeDialog = () => document.body.removeChild(dialog);
        dialog.querySelector('#cancel-btn').onclick = closeDialog;
        dialog.querySelector('#start-btn').onclick = () => {
            const startPage = parseInt(document.getElementById('start-page').value, 10);
            const endPage = parseInt(document.getElementById('end-page').value, 10);
            const inactiveOnly = document.getElementById('inactive-only').checked;
            const maxSizeGB = parseFloat(document.getElementById('max-size').value) || 0;

            if (isNaN(startPage) || isNaN(endPage) || startPage > endPage || startPage < 1) {
                alert('Invalid page range.');
                return;
            }

            closeDialog();
            startDownload({ startPage, endPage, inactiveOnly, maxSizeGB });
        };
    }

    async function startDownload({ startPage, endPage, inactiveOnly, maxSizeGB }) {
        updateButtonState(true);
        STATE.shouldStop = false;
        const downloadedFiles = [];
        const totalPagesToProcess = endPage - startPage + 1;

        showToast('Starting download...', 0);

        for (let i = 0; i < totalPagesToProcess; i++) {
            if (STATE.shouldStop) break;

            const currentPage = startPage + i;
            const progress = Math.round((i / totalPagesToProcess) * 100);
            showToast(`Fetching page ${currentPage} of ${endPage}...`, progress);

            const torrents = await getTorrentsFromPage(currentPage, { inactiveOnly, maxSizeGB });
            if (torrents.length === 0) {
                 console.log(`No matching torrents found on page ${currentPage}.`);
                 await new Promise(r => setTimeout(r, 200));
                 continue;
            }

            for (let j = 0; j < torrents.length; j++) {
                if (STATE.shouldStop) break;
                const torrent = torrents[j];
                const itemProgress = Math.round(((i + (j + 1) / torrents.length) / totalPagesToProcess) * 100);
                showToast(`Page ${currentPage}: Downloading ${j + 1}/${torrents.length}<br>Total: ${downloadedFiles.length + 1} files`, itemProgress);
                try {
                    const file = await downloadTorrent(torrent.url);
                    if (file) {
                        downloadedFiles.push({ blob: file.blob, filename: torrent.name + '.torrent' });
                    }
                } catch (error) {
                    console.error(`Error downloading torrent: ${torrent.name}`, error);
                }
                await new Promise(r => setTimeout(r, CONFIG.delayBetweenDownloads));
            }
             if (i < totalPagesToProcess - 1) {
                await new Promise(r => setTimeout(r, CONFIG.delayBetweenPages));
            }
        }

        if (downloadedFiles.length > 0) {
            showToast('Creating ZIP file...', 100);
            await createZip(downloadedFiles);
            showToast(`Complete! Zipped ${downloadedFiles.length} torrents.`, -1);
        } else {
            showToast(STATE.shouldStop ? 'Download stopped.' : 'No matching torrents found.', -1);
        }

        setTimeout(hideToast, 4000);
        updateButtonState(false);
    }

    function parseSizeToGB(sizeString) {
        if (!sizeString) return Infinity;
        const parts = sizeString.match(/([\d.]+)\s*(KiB|MiB|GiB|TiB)/i);
        if (!parts) return Infinity;

        const value = parseFloat(parts[1]);
        const unit = parts[2].toLowerCase();

        switch (unit) {
            case 'tib': return value * 1024;
            case 'gib': return value;
            case 'mib': return value / 1024;
            case 'kib': return value / (1024 * 1024);
            default: return Infinity;
        }
    }

    async function getTorrentsFromPage(page, { inactiveOnly, maxSizeGB }) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);

        try {
            const response = await fetch(url.href);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const rowSelector = inactiveOnly
                ? `${CONFIG.selectors.tableRows}${CONFIG.selectors.inactiveRow}`
                : CONFIG.selectors.tableRows;

            const rows = doc.querySelectorAll(rowSelector);

            const allTorrents = Array.from(rows).map(row => {
                const linkElement = row.querySelector(CONFIG.selectors.downloadLink);
                if (!linkElement) return null;

                const torrentName = row.querySelector('td:first-child a')?.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') || `torrent_page_${page}`;
                const sizeText = row.querySelector(CONFIG.selectors.sizeCell)?.textContent.trim();
                const sizeGB = parseSizeToGB(sizeText);

                return { name: torrentName, url: linkElement.href, sizeGB };
            }).filter(Boolean);

            if (maxSizeGB > 0) {
                return allTorrents.filter(torrent => torrent.sizeGB < maxSizeGB);
            }

            return allTorrents;
        } catch (error) {
            console.error(`Failed to fetch or parse page ${page}:`, error);
            return [];
        }
    }

    async function downloadTorrent(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
        const blob = await response.blob();
        return { blob };
    }

    async function createZip(files) {
        const zip = new JSZip();
        files.forEach(file => zip.file(file.filename, file.blob));

        const content = await zip.generateAsync({ type: 'blob' });
        const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `TorrentBD_Batch_${date}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    function detectTotalPages() {
        const links = document.querySelectorAll(CONFIG.selectors.totalPagesLink);
        if (links.length === 0) return 1;
        const pageNumbers = Array.from(links).map(a => parseInt(a.href.match(/page=(\d+)/)[1], 10));
        return Math.max(...pageNumbers, 1);
    }

    function showToast(message, progress = -1) {
        let toast = STATE.elements.toast;
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'batch-dl-toast';
            toast.style.cssText = CONFIG.styles.toast;
            toast.innerHTML = `<div>
                <div id="toast-message" style="margin-bottom: 15px;"></div>
                <div id="toast-progress-container" style="${CONFIG.styles.progressBarContainer}">
                    <div id="toast-progress-bar" style="${CONFIG.styles.progressBar}"></div>
                </div>
                <button id="toast-stop-btn" style="${CONFIG.styles.button} margin: 15px auto 0; background: #c62828; padding: 6px 12px; font-size: 0.9em;">Stop & Zip Current Files</button>
            </div>`;
            document.body.appendChild(toast);

            STATE.elements.toast = toast;
            STATE.elements.toastMessage = toast.querySelector('#toast-message');
            STATE.elements.toastProgressContainer = toast.querySelector('#toast-progress-container');
            STATE.elements.toastProgressBar = toast.querySelector('#toast-progress-bar');
            STATE.elements.toastStopBtn = toast.querySelector('#toast-stop-btn');

            STATE.elements.toastStopBtn.onclick = () => {
                STATE.shouldStop = true;
                updateButtonState(false, 'Stopping...');
            };
        }

        toast.style.display = 'block';
        STATE.elements.toastMessage.innerHTML = message;

        const showProgressUI = progress >= 0;
        STATE.elements.toastProgressContainer.style.display = showProgressUI ? 'block' : 'none';
        STATE.elements.toastStopBtn.style.display = showProgressUI ? 'block' : 'none';

        if (progress >= 0) {
            STATE.elements.toastProgressBar.style.width = `${progress}%`;
        }
    }

    function hideToast() {
        if (STATE.elements.toast) {
            STATE.elements.toast.style.display = 'none';
        }
    }

    // --- Initialization ---
    addDownloadButton();

})();
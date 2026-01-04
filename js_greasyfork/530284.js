// ==UserScript==
// @name         Archives.gov PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download all PDFs from archives.gov table and create ZIP
// @author       You
// @match        *://*.archives.gov/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530284/Archivesgov%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/530284/Archivesgov%20PDF%20Downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let pdfLinks = [];
    const baseUrl = 'https://www.archives.gov';
    let currentPage = 1;
    const zip = new JSZip();
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || 'Archives PDFs';

    function getPdfLinksFromPage() {
        return Array.from(document.querySelectorAll('table.datatable tbody tr td a'))
            .map(a => a.getAttribute('href').startsWith('http') ? a.getAttribute('href') : baseUrl + a.getAttribute('href'))
            .filter(href => href.endsWith('.pdf'));
    }

    async function fetchNextPage() {
        const nextButton = document.querySelector('.dataTables_paginate .next:not(.disabled)');
        if (nextButton) {
            currentPage++;
            const nextUrl = nextButton.querySelector('a')?.href;
            if (nextUrl) {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: nextUrl,
                        onload: function(response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const tempContainer = document.createElement('div');
                            tempContainer.innerHTML = doc.body.innerHTML;
                            const modal = document.getElementById('pdf-downloader-modal');
                            document.body.innerHTML = tempContainer.innerHTML;
                            document.body.appendChild(modal);
                            resolve(true);
                        }
                    });
                });
            }
        }
        return false;
    }

    function formatSize(sizeInBytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
        while (sizeInBytes >= 1024 && i < sizes.length - 1) {
            sizeInBytes /= 1024;
            i++;
        }
        return `${sizeInBytes.toFixed(2)} ${sizes[i]}`;
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const sec = Math.floor(seconds % 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m ${sec}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${sec}s`;
        } else {
            return `${sec}s`;
        }
    }

    async function downloadAndZip(link, index, totalFiles, startTime) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                responseType: 'arraybuffer',
                onload: function(response) {
                    const fileName = link.split('/').pop();
                    const fileSize = response.response.byteLength;
                    zip.file(fileName, response.response, { binary: true });

                    const progress = document.getElementById('download-progress');
                    const sizeDisplay = document.getElementById('size-display');
                    const etaDisplay = document.getElementById('eta-display');

                    let downloadedFiles = parseInt(progress.getAttribute('data-downloaded')) + 1;
                    let totalSize = parseFloat(progress.getAttribute('data-total-size')) + fileSize;

                    progress.setAttribute('data-downloaded', downloadedFiles);
                    progress.setAttribute('data-total-size', totalSize);

                    progress.value = (downloadedFiles / totalFiles) * 100;
                    document.getElementById('modal-status').textContent = `Downloading ${downloadedFiles}/${totalFiles}`;

                    const elapsedTime = (Date.now() - startTime) / 1000;
                    const downloadRate = downloadedFiles / elapsedTime;
                    const remainingFiles = totalFiles - downloadedFiles;
                    const etaSeconds = remainingFiles / downloadRate;
                    etaDisplay.textContent = `ETA: ${formatTime(etaSeconds)}`;
                    sizeDisplay.textContent = `Size: ${formatSize(totalSize)}`;

                    resolve();
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'pdf-downloader-modal';
        modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid black; z-index: 9999; width: 300px; box-shadow: 0 0 10px rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.3s;';
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0;">${ogTitle}</h2>
                <button id="closeBtn" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <p id="modal-status" style="margin: 0 0 10px 0;">Press Start to search and collect all PDF links</p>
            <button id="startBtn">Start</button>
            <button id="downloadBtn" style="display: none;">Download</button>
            <button id="cancelBtn">Cancel</button>
            <progress id="download-progress" value="0" max="100" data-downloaded="0" data-total-size="0" style="width: 100%; margin-top: 10px;"></progress>
            <p id="size-display" style="margin: 5px 0 0 0; font-size: 12px;">Size: 0 MB</p>
            <p id="eta-display" style="margin: 5px 0 0 0; font-size: 12px;">ETA: --s</p>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.style.opacity = '1', 10);

        document.getElementById('startBtn').addEventListener('click', async () => {
            const startBtn = document.getElementById('startBtn');
            startBtn.disabled = true;
            do {
                pdfLinks = pdfLinks.concat(getPdfLinksFromPage());
                document.getElementById('modal-status').textContent = `Found ${pdfLinks.length} PDFs (Page ${currentPage})`;
                await new Promise(resolve => setTimeout(resolve, 100));
            } while (await fetchNextPage());

            pdfLinks = [...new Set(pdfLinks)];
            document.getElementById('modal-status').textContent = `Found ${pdfLinks.length} unique PDFs. Download?`;
            startBtn.style.display = 'none';
            document.getElementById('downloadBtn').style.display = 'inline';
        });

        document.getElementById('downloadBtn').addEventListener('click', async () => {
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.disabled = true;

            const startTime = Date.now();
            const totalFiles = pdfLinks.length;
            let downloadCount = 0;

            document.getElementById('download-progress').style.display = 'block';
            document.getElementById('size-display').style.display = 'block';
            document.getElementById('eta-display').style.display = 'block';

            for (let i = 0; i < pdfLinks.length; i++) {
                await downloadAndZip(pdfLinks[i], i + 1, totalFiles, startTime);
                downloadCount++;
            }

            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    saveAs(content, ogTitle + '.zip');
                    document.getElementById('modal-status').textContent = `Download Complete.`;
                    document.getElementById('download-progress').style.display = 'none';
                    document.getElementById('size-display').style.display = 'none';
                    document.getElementById('eta-display').style.display = 'none';
                });
        });
    }

    createModal();
})();
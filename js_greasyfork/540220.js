// ==UserScript==
// @name         MediaZipper
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Download images, audio, and video files from a webpage into a ZIP file with filters and draggable UI panel.
// @author       Kanha Pise
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/540220/MediaZipper.user.js
// @updateURL https://update.greasyfork.org/scripts/540220/MediaZipper.meta.js
// ==/UserScript==

(function waitForLibraries() {
    if (typeof JSZip === 'undefined' || typeof window.saveAs === 'undefined') {
        console.log('Waiting for JSZip and FileSaver...');
        setTimeout(waitForLibraries, 100);
        return;
    }

    (function () {
        'use strict';

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 220px;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            font-family: sans-serif;
        `;
        panel.innerHTML = `
            <div id="mz-header" style="cursor: move; font-weight: bold; margin-bottom: 5px;">📦 MediaZipper</div>
            <div id="mz-body">
                <label><input type="checkbox" id="filterJPG" checked> .jpg</label><br>
                <label><input type="checkbox" id="filterPNG" checked> .png</label><br>
                <label><input type="checkbox" id="filterMP3" checked> .mp3</label><br>
                <label><input type="checkbox" id="filterMP4" checked> .mp4</label><br>
                <button id="downloadBtn" style="margin-top: 8px; width: 100%;">Download ZIP</button>
                <div id="progress" style="margin-top: 10px; display: none;">
                    <progress id="progressBar" value="0" max="100" style="width: 100%;"></progress>
                    <span id="progressText">0%</span>
                </div>
            </div>
            <button id="toggleBtn" style="margin-top: 5px; width: 100%;">Collapse</button>
        `;
        document.body.appendChild(panel);

        // Draggable Panel
        const header = document.getElementById('mz-header');
        let isDragging = false, offsetX, offsetY;

        header.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        // Toggle Collapse
        const toggleBtn = document.getElementById('toggleBtn');
        const body = document.getElementById('mz-body');
        toggleBtn.onclick = function () {
            const hidden = body.style.display === 'none';
            body.style.display = hidden ? 'block' : 'none';
            toggleBtn.textContent = hidden ? 'Collapse' : 'Expand';
        };

        // Main ZIP download function (Promise-based)
        function fetchAndZipMedia() {
            const zip = new JSZip();
            const filters = {
                jpg: document.getElementById('filterJPG').checked,
                png: document.getElementById('filterPNG').checked,
                mp3: document.getElementById('filterMP3').checked,
                mp4: document.getElementById('filterMP4').checked
            };

            const mediaElements = Array.from(document.querySelectorAll('img[src], audio[src], video[src], source[src]'));
            const mediaSrcs = new Set();

            const progress = document.getElementById('progress');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            progress.style.display = 'block';

            let completed = 0;
            let addedCount = 0;

            function updateProgress() {
                const percent = Math.round((completed / mediaElements.length) * 100);
                progressBar.value = percent;
                progressText.textContent = percent + '%';
            }

            const fetchPromises = mediaElements.map(function (el) {
                let src = el.src || el.currentSrc || el.getAttribute('src');
                if (!src || mediaSrcs.has(src)) {
                    completed++;
                    updateProgress();
                    return Promise.resolve(); // Skip duplicate or empty src
                }
                mediaSrcs.add(src);

                const ext = src.split('.').pop().split('?')[0].toLowerCase();
                if ((ext === 'jpg' && !filters.jpg) ||
                    (ext === 'png' && !filters.png) ||
                    (ext === 'mp3' && !filters.mp3) ||
                    (ext === 'mp4' && !filters.mp4)) {
                    completed++;
                    updateProgress();
                    return Promise.resolve();
                }

                return fetch(src, { mode: 'cors' }).then(function (res) {
                    return res.blob();
                }).then(function (blob) {
                    const filename = decodeURIComponent(src.split('/').pop().split('?')[0]).replace(/[\\/:*?"<>|]/g, '_');
                    zip.file(filename, blob);
                    addedCount++;
                }).catch(function (err) {
                    console.warn('Failed to fetch:', src, err);
                }).finally(function () {
                    completed++;
                    updateProgress();
                });
            });

            Promise.all(fetchPromises).then(function () {
                if (addedCount === 0) {
                    alert("No media files matched the selected filters or were blocked by CORS.");
                    progress.style.display = 'none';
                    return;
                }
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                    window.saveAs(content, 'media.zip');
                    progress.style.display = 'none';
                }).catch(function (err) {
                    alert("Failed to generate ZIP file.");
                    console.error(err);
                    progress.style.display = 'none';
                });
            });
        }

        document.getElementById('downloadBtn').addEventListener('click', fetchAndZipMedia);
    })();
})();

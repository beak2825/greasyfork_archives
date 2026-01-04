// ==UserScript==
// @name         HentaiNexus Gallery Download
// @namespace    https://greasyfork.org/en/users/1314621
// @version      1.0
// @description  Add a download button to download all full-sized images from the gallery as a zip file
// @author       paper-jam-spitball-soldier
// @match        *://hentainexus.com/view/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/497371/HentaiNexus%20Gallery%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/497371/HentaiNexus%20Gallery%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxSimultaneousDownloads = 5;
    let zipBlob = null;
    let zipUrl = null;
    let zipFileName = '';

    // Function to create and add the download button
    function addDownloadAllButton() {
        const buttonSet = document.querySelector('.level.depict-button-set .level-left');
        if (!buttonSet) {
            console.error('Button set container not found.');
            return;
        }

        const downloadAllButton = document.createElement('a');
        downloadAllButton.className = 'button is-primary';
        downloadAllButton.style.marginRight = '1em';
        downloadAllButton.innerHTML = `
            <span class="icon">
                <i class="fas fa-download"></i>
            </span>
            <span class="button-label">Download</span>
        `;

        // Add click event to download all images as zip
        downloadAllButton.addEventListener('click', async () => {
            if (zipBlob && zipUrl) {
                downloadZipAgain(zipUrl, downloadAllButton, zipFileName);
            } else {
                const { title, artist } = parseTitleAndArtist();
                zipFileName = `[${artist}] ${title}`.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');
                await downloadAllImagesAsZip(zipFileName, downloadAllButton);
            }
        });

        buttonSet.appendChild(downloadAllButton);
    }

    // Function to parse title and artist from the page
    function parseTitleAndArtist() {
        const titleElement = document.querySelector('.column .title');
        const artistElement = document.querySelector('.view-page-details [href*="artist"]');

        const title = titleElement ? titleElement.textContent.trim() : '';
        const artist = artistElement ? artistElement.textContent.trim().replace(/\s*\(\d+\)$/, '') : '';

        return { title, artist };
    }

    // Function to fetch full-sized image URLs and download them as a zip file
    async function downloadAllImagesAsZip(zipFileName, button) {
        try {
            button.disabled = true;
            button.classList.add('is-disabled');
            const originalText = button.innerHTML;
            button.innerHTML = `
                <span class="icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </span>
                <span class="button-label">Downloading... 0%</span>
            `;

            const response = await fetch(window.location.href.replace('/view/', '/read/'));
            const html = await response.text();
            const regex = /initReader\("([^"]+)"/;
            const match = html.match(regex);

            // Check if there's a match and extract the first parameter
            if (match && match.length > 1) {
                var firstParam = match[1];
            } else {
                console.log("No match found.");
            }
            const decoded = decode(firstParam);

            // Extract image URLs from the decoded JSON
            const urls = decoded.map(data => data.image);

            const zip = new JSZip();
            const totalImages = urls.length;
            let downloadedCount = 0;

            await Promise.all(urls.map(async (url, index) => {
                try {
                    const response = await fetch(url, { timeout: 30000 });
                    const blob = await response.blob();
                    const filename = url.substring(url.lastIndexOf('/') + 1);
                    zip.file(filename, blob);
                    downloadedCount++;
                    const progress = Math.round((downloadedCount / totalImages) * 100);
                    button.querySelector('.button-label').textContent = `Downloading... ${progress}%`;
                } catch (error) {
                    throw error;
                }
            }));

            // Generate and store the zip file with progress
            button.querySelector('.button-label').textContent = 'Generating ZIP... 0%';
            zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" }, (metadata) => {
                const progress = Math.round(metadata.percent);
                button.querySelector('.button-label').textContent = `Generating ZIP... ${progress}%`;
            });
            zipUrl = URL.createObjectURL(zipBlob);

            // Initiate download
            downloadZipAgain(zipUrl, button, zipFileName);

            // Change button text to "Done"
            button.innerHTML = `
                <span class="icon">
                    <i class="fas fa-check"></i>
                </span>
                <span class="button-label">Done</span>
            `;
            button.disabled = false;
            button.classList.remove('is-disabled');
        } catch (error) {
            console.error('Error downloading images:', error);
            button.querySelector('.button-label').textContent = 'Retry Download';
            button.disabled = false;
            button.classList.remove('is-disabled');
        }
    }

    function downloadZipAgain(zipUrl, button, zipFileName) {
        const link = document.createElement("a");
        link.href = zipUrl;
        link.download = zipFileName + '.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function decode(data) {
        var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
        var blob = atob(data);
        var key = blob.substr(0, 64);

        var C = 0;
        for (var i = 0; i < key.length; i++) {
            C = C ^ key.charCodeAt(i);
            for (var j = 0; j < 8; j++) {
                if (C & 1) {
                    C = (C >> 1) ^ 0xc;
                } else {
                    C = C >> 1;
                }
            }
        }
        var k = primes[C & 0x7];

        var x = 0;
        var S = Array.from(Array(256).keys());
        for (var i = 0; i < 256; i++) {
            x = (x + S[i] + key.charCodeAt(i % key.length)) % 256;
            var temp = S[i];
            S[i] = S[x];
            S[x] = temp;
        }

        var result = "";
        var a = 0, c = 0, m = 0, x = 0;
        for (var n = 64; n < blob.length; n++) {
            a = (a + k) % 256;
            x = (c + S[(x + S[a]) % 256]) % 256;
            c = (c + a + S[a]) % 256;

            var temp = S[a];
            S[a] = S[x];
            S[x] = temp;
            m = S[(x + S[(a + S[(m + c) % 256]) % 256]) % 256];
            result += String.fromCharCode(blob.charCodeAt(n) ^ m);
        }

        return JSON.parse(result);
    }

    // Add the download all button with a delay after the page loads
    window.addEventListener('load', async () => {
        addDownloadAllButton();
    });

})();

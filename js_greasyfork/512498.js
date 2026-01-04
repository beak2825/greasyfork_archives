// ==UserScript==
// @name         MangaPlus Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloader for MangaPlus
// @author       Baconana-chan
// @match        https://mangaplus.shueisha.co.jp/viewer/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/512498/MangaPlus%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/512498/MangaPlus%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blobs = [];
    let imageHashes = new Set();  // To keep track of unique image hashes
    let downloadedCount = 0;

    // Function for calculating hash from blob object
    async function hashBlob(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Function for saving blob objects as PNG files
    function saveBlob(blob, filename) {
        const blobUrl = URL.createObjectURL(blob);
        GM_download({
            url: blobUrl,
            name: filename,
            saveAs: false
        });
    }

    // Function for loading all images one by one
    function downloadSequentially(index) {
        if (index >= blobs.length) {
            alert(`Downloaded all ${blobs.length} images.`);
            return;
        }

        const filename = `page-${index + 1}.png`;
        const blob = blobs[index];
        saveBlob(blob, filename);
        downloadedCount++;

        console.log(`Downloaded ${filename}`);

        setTimeout(() => {
            downloadSequentially(index + 1);
        }, 1000);  // 1 second delay between loads
    }

    // Function for loading all blob images
    function downloadImages() {
        if (blobs.length === 0) {
            alert("No images found. Try scrolling manually and reloading.");
            return;
        }

        downloadedCount = 0;
        downloadSequentially(0);
    }

    // Intercept blob URL creation and store unique blob objects
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        const url = originalCreateObjectURL(blob);
        if (blob.type.startsWith('image/')) {
            hashBlob(blob).then(hash => {
                if (!imageHashes.has(hash)) {  // Check uniqueness by hash
                    blobs.push(blob);  // Save the unique blob
                    imageHashes.add(hash);  // Add hash to set
                    console.log(`Captured unique image blob: ${url} (hash: ${hash})`);
                } else {
                    console.log(`Duplicate image blob skipped: ${url} (hash: ${hash})`);
                }
            });
        }
        return url;
    };

    // Create a button for loading
    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerText = "Download All Images";
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            console.log("Download button clicked");
            downloadImages();
        });
    }

    // Check if the page is ready and create a button
    const interval = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(interval);
            console.log("Page fully loaded, initializing script.");
            createDownloadButton();
        }
    }, 1000);
})();

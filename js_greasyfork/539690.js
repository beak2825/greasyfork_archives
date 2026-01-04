// ==UserScript==
// @name         X(Twitter) Images Downloader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Download all original quality images from an X/Twitter media timeline.
// @author       GPT
// @match        https://x.com/*/media*
// @match        [https://twitter.com/*/media*](https://twitter.com/*/media*)
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539690/X%28Twitter%29%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539690/X%28Twitter%29%20Images%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let user = '';
    let images = new Map(); // Use Map to preserve order and prevent duplicates
    let isRunning = false;

    // --- UI Functions ---
    function addButton(text, onclick, id) {
        const button = document.createElement('button');
        button.id = id;
        button.innerHTML = text;
        button.onclick = onclick;
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            backgroundColor: '#1DA1F2',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
        });
        document.body.appendChild(button);
        return button;
    }

    function updateButtonState(button, text, disabled) {
        if (button) {
            button.innerHTML = text;
            button.disabled = disabled;
            button.style.cursor = disabled ? 'not-allowed' : 'pointer';
            button.style.backgroundColor = disabled ? '#888' : '#1DA1F2';
        }
    }

    // --- Core Logic ---
    function scrollAndCollect() {
        if (!isRunning) return;

        getImageUrls();
        updateButtonState(document.getElementById("download-all-btn"), `Collecting... (${images.size} found)`, true);

        const lastHeight = document.body.scrollHeight;
        window.scrollTo(0, lastHeight);

        // Wait for new content to load after scrolling
        setTimeout(() => {
            if (document.body.scrollHeight > lastHeight) {
                // Page grew, continue scrolling
                scrollAndCollect();
            } else {
                // Page did not grow, we are likely at the bottom
                console.log("Reached the end of the timeline.");
                isRunning = false;
                // Final collection to catch any stragglers
                getImageUrls();
                downloadAllImgs();
            }
        }, 3000); // Wait 3 seconds for content to load. Adjust if needed.
    }

    function getImageUrls() {
        document.querySelectorAll('img').forEach(image => {
            // The most reliable way to find media images is to check the src
            if (image.src && image.src.includes('pbs.twimg.com/media/')) {
                try {
                    const url = new URL(image.src);
                    // Get the highest quality version of the image
                    url.searchParams.set('name', 'orig');
                    const originalUrl = url.href;

                    // Generate a unique filename from the URL
                    const pathParts = url.pathname.split('/');
                    const imageIdWithExt = pathParts[pathParts.length - 1];
                    const imageId = imageIdWithExt.split('.')[0];
                    const format = url.searchParams.get('format') || 'jpg';
                    const filename = `${user}-${imageId}.${format}`;

                    if (!images.has(filename)) {
                        console.log(`Found image: ${filename}`);
                        images.set(filename, originalUrl);
                    }
                } catch (e) {
                    console.error("Error processing image URL:", image.src, e);
                }
            }
        });
    }

    function downloadAllImgs() {
        const imageCount = images.size;
        const button = document.getElementById("download-all-btn");

        if (imageCount === 0) {
            alert("No images found. Please try scrolling down a bit first, or check if you are on a media timeline.");
            updateButtonState(button, "Download All Images", false);
            return;
        }

        alert(`Found ${imageCount} images. Starting download.`);
        updateButtonState(button, `Downloading 0/${imageCount}`, true);

        let downloadedCount = 0;
        images.forEach((url, filename) => {
            GM_download({
                url: url,
                name: filename,
                onload: () => {
                    downloadedCount++;
                    updateButtonState(button, `Downloading ${downloadedCount}/${imageCount}`, true);
                    if (downloadedCount === imageCount) {
                        alert("All downloads complete!");
                        updateButtonState(button, "Download All Images", false);
                    }
                },
                onerror: (err) => {
                    console.error(`Failed to download ${filename}:`, err);
                    downloadedCount++; // Count as "processed" even on error
                     if (downloadedCount === imageCount) {
                        alert("Download process finished, but some files failed. Check the console for errors.");
                        updateButtonState(button, "Download All Images", false);
                    }
                }
            });
        });
    }

    function begin() {
        if (isRunning) return;
        isRunning = true;

        const startButton = document.getElementById("download-all-btn");
        updateButtonState(startButton, "Starting...", true);

        user = window.location.pathname.split('/')[1];
        images.clear();

        console.log("Starting image collection for user:", user);
        scrollAndCollect();
    }

    // --- Main Execution ---
    addButton("Download All Images", begin, "download-all-btn");
})();
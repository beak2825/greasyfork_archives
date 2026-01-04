// ==UserScript==
// @name         Tidal Special
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Click on elements and copy links to clipboard with user confirmation and success message, and download links as a .txt file
// @author       You
// @match        https://tidal.com/browse/playlist/*
// @match        https://pixeldrain.com/*
// @icon         https://w7.pngwing.com/pngs/973/746/png-transparent-tidal-round-logo-tech-companies-thumbnail.png
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502466/Tidal%20Special.user.js
// @updateURL https://update.greasyfork.org/scripts/502466/Tidal%20Special.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to read text from the clipboard
    async function readClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    }

    function createLoader() {
        // Check if the loader already exists
        if (document.querySelector('.loader-overlay')) {
            return; // Exit if the loader is already present
        }

        // Create the overlay div
        const overlay = document.createElement('div');
        overlay.className = 'loader-overlay'; // Add a class for easy removal
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Black background with slight transparency
        overlay.style.color = '#fff'; // White text color
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column'; // Stack items vertically
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.fontSize = '1.5em';
        overlay.style.zIndex = '9999'; // Ensure it's on top of other content

        // Add the loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'loader-text';
        loadingText.innerHTML = '<h1>STAY ON PAGE </h1>';
        loadingText.style.textAlign = "center";
        overlay.appendChild(loadingText);

        // Create the button
        const button = document.createElement('button');
        button.textContent = 'Start Extraction';
        button.style.marginTop = '20px'; // Space between text and button
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';

        // Attach the click event handler to the button
        button.addEventListener('click', () => {
            handleClick()
            button.hidden = true
        });

        // Add the button to the overlay
        overlay.appendChild(button);

        // Append the overlay to the body
        document.body.appendChild(overlay);
    }

    function updateLoaderMessage(message) {
        const loadingText = document.querySelector('.loader-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }

    function removeLoader() {
        // Find the overlay by its class name and remove it
        const overlay = document.querySelector('.loader-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    function downloadLinks(links) {
        const blob = new Blob([links.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Collect all links
    let collectedLinks = [];

    async function handleClick() {
        updateLoaderMessage('Starting extraction...');

        // Click on all elements with class "track-options"
        let trackOptions = document.querySelectorAll('.track-options');
        let index = 0;

        function processNext() {
            if (index >= trackOptions.length) {
                updateLoaderMessage('All links collected!');
                setTimeout(() => {
                    updateLoaderMessage('Downloading links...');
                    downloadLinks(collectedLinks);
                    updateLoaderMessage('Success! All links have been collected and downloaded.');
                    setTimeout(removeLoader, 3000); // Show success message for a few seconds before removing the loader
                }, 1000); // Adjust the delay for the success message as needed
                return;
            }

            let element = trackOptions[index++];
            element.click();

            // Wait for the modal to appear and then click the button
            setTimeout(async () => {
                let copyButton = document.querySelector('#__layout > div > div.font-weight-bold.modal-wrapper-mobile-only > div > ul > li:nth-child(4) > button');
                if (copyButton) {
                    copyButton.click();

                    // Assuming there's a delay before the link is copied
                    setTimeout(async () => {
                        // Use a way to obtain the copied link if possible or retrieve it from modal
                        let link = await readClipboard();
                        if (link) {
                            collectedLinks.push(link);
                            updateLoaderMessage(`Collected ${collectedLinks.length} links...`);
                        } else {
                            console.warn('No link was copied.');
                        }
                        processNext();
                    }, 10); // Adjust the delay as needed
                } else {
                    console.error('Copy button not found');
                    processNext();
                }
            }, 10); // Adjust the delay as needed
        }

        processNext();
    }

    if (window.location.host == "tidal.com") {
        createLoader();
    }

    if (window.location.host == "pixeldrain.com") {
        // ==UserScript==
        // @name         Pixel Drain Auto Audio Downloader
        // @namespace    http://tampermonkey.net/
        // @version      0.2
        // @description  Automatically download audio files from Pixel Drain
        // @author       Your Name
        // @match        https://pixeldrain.com/*
        // @grant        none
        // @run-at       document-end
        // ==/UserScript==

        (function() {
            'use strict';

            function autoDownloadAudio() {
                // Select all audio elements
                const audioElements = document.querySelectorAll('audio.player');

                audioElements.forEach(audio => {
                    // Find the source element
                    const source = audio.querySelector('source');
                    if (!source) return;

                    // Check if the file is already downloaded or not
                    if (source.dataset.downloaded) return;

                    // Mark the file as downloaded to avoid multiple downloads
                    source.dataset.downloaded = 'true';

                    // Construct the absolute URL
                    const audioUrl = source.src;
                    const absoluteUrl = new URL(audioUrl, window.location.origin).href;

                    // Create a temporary anchor element to trigger download
                    const a = document.createElement('a');
                    a.href = absoluteUrl;
                    a.download = ''; // Use the filename if needed, e.g., `source.src.split('/').pop()`
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            }

            // Run the function when the page is loaded
            window.addEventListener('load', autoDownloadAudio);

            // Also check for dynamically loaded content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    autoDownloadAudio();
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        })();

    }
})();

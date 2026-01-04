// ==UserScript==
// @name         Neocities CYOA Downloader (Any JSON Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Downloads CYOA JSON and images from Neocities sites as a ZIP with a progress bar, searching for any JSON file
// @author       Grok
// @license      MIT 
// @match        *://*.neocities.org/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/533185/Neocities%20CYOA%20Downloader%20%28Any%20JSON%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533185/Neocities%20CYOA%20Downloader%20%28Any%20JSON%20Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if on a Neocities site
    if (!window.location.hostname.endsWith('.neocities.org')) {
        return;
    }

    // Create progress bar UI
    const progressContainer = document.createElement('div');
    progressContainer.style.position = 'fixed';
    progressContainer.style.top = '10px';
    progressContainer.style.right = '10px';
    progressContainer.style.zIndex = '10000';
    progressContainer.style.backgroundColor = '#fff';
    progressContainer.style.padding = '10px';
    progressContainer.style.border = '1px solid #000';
    progressContainer.style.borderRadius = '5px';
    progressContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    const progressLabel = document.createElement('div');
    progressLabel.textContent = 'Preparing to download CYOA...';
    progressLabel.style.marginBottom = '5px';

    const progressBar = document.createElement('div');
    progressBar.style.width = '200px';
    progressBar.style.height = '20px';
    progressBar.style.backgroundColor = '#e0e0e0';
    progressBar.style.borderRadius = '3px';
    progressBar.style.overflow = 'hidden';

    const progressFill = document.createElement('div');
    progressFill.style.width = '0%';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = '#4caf50';
    progressFill.style.transition = 'width 0.3s';

    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressLabel);
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    // Utility functions
    function extractProjectName(url) {
        try {
            const hostname = new URL(url).hostname;
            if (hostname.endsWith('.neocities.org')) {
                return hostname.replace('.neocities.org', '');
            }
            return hostname;
        } catch (e) {
            return 'project';
        }
    }

    function updateProgress(value, max, label) {
        const percentage = (value / max) * 100;
        progressFill.style.width = `${percentage}%`;
        progressLabel.textContent = label;
    }

    async function findImages(obj, baseUrl, imageUrls) {
        if (typeof obj === 'object' && obj !== null) {
            if (obj.image && typeof obj.image === 'string' && !obj.image.includes('base64,')) {
                try {
                    const url = new URL(obj.image, baseUrl).href;
                    imageUrls.add(url);
                } catch (e) {
                    console.warn(`Invalid image URL: ${obj.image}`);
                }
            }
            for (const key in obj) {
                await findImages(obj[key], baseUrl, imageUrls);
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                await findImages(item, baseUrl, imageUrls);
            }
        }
    }

    async function findJsonFile(baseUrl) {
        // Step 1: Check all HTML elements for .json references
        const elements = document.querySelectorAll('script[src], link[href], a[href]');
        for (const el of elements) {
            const url = el.src || el.href;
            if (url && url.endsWith('.json')) {
                return new URL(url, baseUrl).href;
            }
        }

        // Step 2: Check inline scripts for JSON references
        const inlineScripts = document.querySelectorAll('script:not([src])');
        for (const script of inlineScripts) {
            const matches = script.textContent.match(/"[^"]*\.json"/g);
            if (matches) {
                for (const match of matches) {
                    const jsonFile = match.replace(/"/g, '');
                    try {
                        return new URL(jsonFile, baseUrl).href;
                    } catch (e) {
                        continue;
                    }
                }
            }
        }

        // Step 3: Try an expanded list of common JSON file names
        const commonNames = [
            'project.json', 'data.json', 'cyoa.json', 'config.json',
            'game.json', 'settings.json', 'content.json', 'main.json',
            'story.json', 'options.json', 'assets.json', 'tokhaar.json'
        ];
        for (const name of commonNames) {
            const url = new URL(name, baseUrl).href;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    return url;
                }
            } catch (e) {
                continue;
            }
        }

        // Step 4: Prompt user with detailed instructions
        const userInput = prompt(
            'Could not find JSON file. Please enter the JSON file name (e.g., data.json).\n' +
            'To find the correct file:\n' +
            '1. Open DevTools (F12 or right-click -> Inspect).\n' +
            '2. Go to the Network tab.\n' +
            '3. Refresh the page (F5).\n' +
            '4. Look for a .json file in the list (e.g., data.json).\n' +
            'Enter the file name or leave blank to cancel.'
        );
        if (userInput && userInput.trim().endsWith('.json')) {
            return new URL(userInput.trim(), baseUrl).href;
        }

        throw new Error('No JSON file found and no valid user input provided.');
    }

    async function downloadCYOA() {
        const baseUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
        const projectName = extractProjectName(baseUrl);
        const zip = new JSZip();
        const imagesFolder = zip.folder('images');
        const externalImages = [];

        try {
            // Find and download JSON file
            updateProgress(0, 100, 'Searching for JSON file...');
            const projectJsonUrl = await findJsonFile(baseUrl);
            updateProgress(5, 100, 'Downloading JSON file...');
            const response = await fetch(projectJsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${projectJsonUrl}`);
            }
            const projectData = await response.json();

            // Save JSON file with project name
            const jsonFileName = projectJsonUrl.split('/').pop();
            zip.file(`${projectName}.json`, JSON.stringify(projectData, null, 2));
            updateProgress(10, 100, 'Scanning for images...');

            // Extract image URLs
            const imageUrls = new Set();
            await findImages(projectData, baseUrl, imageUrls);
            const imageUrlArray = Array.from(imageUrls);

            // Download images
            for (let i = 0; i < imageUrlArray.length; i++) {
                const url = imageUrlArray[i];
                try {
                    updateProgress(10 + (i / imageUrlArray.length) * 80, 100, `Downloading image ${i + 1}/${imageUrlArray.length}...`);
                    const response = await fetch(url);
                    if (!response.ok) {
                        externalImages.push(url);
                        continue;
                    }
                    const blob = await response.blob();
                    const filename = url.split('/').pop();
                    imagesFolder.file(filename, blob);
                } catch (e) {
                    console.warn(`Failed to download image ${url}: ${e}`);
                    externalImages.push(url);
                }
            }

            // Generate ZIP
            updateProgress(90, 100, 'Creating ZIP file...');
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${projectName}.zip`);

            updateProgress(100, 100, 'Download complete!');
            setTimeout(() => progressContainer.remove(), 2000);

            // Log external images
            if (externalImages.length > 0) {
                console.warn('Some images could not be downloaded (external/CORS issues):');
                externalImages.forEach(url => console.log(url));
            }
        } catch (e) {
            console.error(`Error: ${e}`);
            progressLabel.textContent = `Error: ${e.message}. Check console.`;
            progressFill.style.backgroundColor = '#f44336';
            setTimeout(() => progressContainer.remove(), 5000);
        }
    }

    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download CYOA';
    downloadButton.style.marginTop = '10px';
    downloadButton.style.padding = '5px 10px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.onclick = downloadCYOA;
    progressContainer.appendChild(downloadButton);
})();
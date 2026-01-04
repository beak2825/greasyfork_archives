// ==UserScript==
// @name         PDFTron Image Extractor (v1.2 - Manual Control, Linter Fixes, EN)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Manually start/stop downloading images from PDFTron viewer iframe, prevents duplicate UI.
// @author       Tinaut1986
// @match        https://pdftron-viewer-quasar.pro.iberley.net/webviewer/ui/index.html*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      pdftron.pro.iberley.net
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531163/PDFTron%20Image%20Extractor%20%28v12%20-%20Manual%20Control%2C%20Linter%20Fixes%2C%20EN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531163/PDFTron%20Image%20Extractor%20%28v12%20-%20Manual%20Control%2C%20Linter%20Fixes%2C%20EN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const IMAGE_PATTERN_KEY = 'pdfTronImagePattern';
    const DEFAULT_IMAGE_PATTERN = /\/pageimg\d+\.jpg/i; // Default pattern
    const UI_ID = 'pdftron-downloader-ui-9k4h';         // UI container ID
    const STATUS_ID = 'pdftron-status-display-a8fj';    // Status text ID
    const START_BUTTON_ID = 'pdftron-start-button-x7gt';// Start/Stop button ID
    const FOLDER_KEY = 'pdfTronDestinationFolder';
    const DEFAULT_FOLDER = 'PDFTron_Images';            // Default subfolder

    const VERIFICATION_INTERVAL = 5000; // ms

    // --- Global Variables ---
    let latestImages = new Set();
    let destinationFolder = GM_getValue(FOLDER_KEY, DEFAULT_FOLDER);
    let imagePattern;
    let observer = null;
    let cacheCheckInterval = null;
    let isDownloadingActive = false;

    // --- Initialize Image Pattern ---
    function initializeImagePattern() {
        const savedPattern = GM_getValue(IMAGE_PATTERN_KEY, DEFAULT_IMAGE_PATTERN.source);
        try {
            imagePattern = new RegExp(savedPattern, 'i');
            log(`Image pattern initialized: ${imagePattern.source}`);
        } catch (e) {
            log(`Error creating RegExp from saved pattern "${savedPattern}". Using default. Error: ${e.message}`, 'error');
            imagePattern = DEFAULT_IMAGE_PATTERN;
            GM_setValue(IMAGE_PATTERN_KEY, DEFAULT_IMAGE_PATTERN.source);
        }
    }

    // --- Logging Utility ---
    function log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[PDFTron Extractor][${timestamp}] ${message}`;
        switch (type) {
            case 'error': console.error(formattedMessage); break;
            case 'warn': console.warn(formattedMessage); break;
            default: console.log(formattedMessage);
        }
     }

    // --- Configuration Functions ---
    function configureFolder() {
        const message = `Enter the subfolder name.\nThis folder will be created inside your browser's main download location.\n\nExample: PDFTron_Images\nCurrent: ${destinationFolder}`;
        const newFolder = prompt(message, destinationFolder);
        if (newFolder !== null) {
            destinationFolder = newFolder.replace(/[\\/]/g, '').trim();
            if (!destinationFolder) {
                destinationFolder = DEFAULT_FOLDER;
                alert(`Folder name cannot be empty. Using default: ${DEFAULT_FOLDER}`);
            }
            GM_setValue(FOLDER_KEY, destinationFolder);
            log(`Destination subfolder set to: ${destinationFolder}`);
            updateInterface();
        }
    }

    function configureImagePattern() {
        const currentSource = imagePattern ? imagePattern.source : DEFAULT_IMAGE_PATTERN.source;
        const message = `Enter a regular expression (RegExp) pattern to find the image URLs.\nThis allows you to match specific filenames, such as those containing page numbers.\n\nExample: /pageimg\\d+\\.jpg/i\n(This matches filenames starting with 'pageimg', followed by numbers, ending in '.jpg', case-insensitive)\n\nIf you're not familiar with regular expressions, you may want to look up online guides on how to create them.\n\nCurrent pattern: ${currentSource}`;
        const newPatternSource = prompt(message, currentSource);
        if (newPatternSource === null) return;

        try {
            const testRegExp = new RegExp(newPatternSource, 'i');
            imagePattern = testRegExp;
            GM_setValue(IMAGE_PATTERN_KEY, newPatternSource);
            log(`Image pattern configured manually: ${imagePattern.source}`);
            latestImages.clear();
            log("Detected images list cleared due to pattern change.");
             if (isDownloadingActive) {
                 stopDownloading();
                 startDownloading();
                 log("Download process restarted with new pattern.");
             }
            updateInterface();
        } catch (error) {
            log(`Invalid pattern format: ${error.message}`, 'error');
            alert(`Invalid pattern format: ${error.message}\nPlease enter a valid pattern (like the example).`);
        }
    }

    // --- User Interface ---
    function createInterface() {
        if (document.getElementById(UI_ID)) {
            log(`UI with ID ${UI_ID} already exists in this iframe. Ensuring button state is correct.`);
            updateInterface();
            return;
        }

        log(`Creating UI (ID: ${UI_ID}) inside the iframe...`);

        const container = document.createElement('div');
        container.id = UI_ID;
        container.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 2147483647;
            padding: 12px; background: rgba(240, 240, 240, 0.95); border: 1px solid #ccc;
            border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif; font-size: 14px; color: #333;
            display: flex; flex-direction: column; gap: 8px; max-width: 250px;
        `;

        const title = document.createElement('h3');
        title.textContent = 'PDFTron Extractor';
        title.style.cssText = 'margin: 0 0 5px 0; font-size: 16px; text-align: center;';

        const startButton = document.createElement('button');
        startButton.id = START_BUTTON_ID;
        startButton.textContent = '▶️ Start Download';
        startButton.onclick = toggleDownloadState;
        startButton.style.cssText = 'padding: 8px 10px; font-size: 1em; margin-bottom: 5px; cursor: pointer; border-radius: 3px; border: 1px solid #bbb; background-color: #e7e7e7;';

        const configButtonContainer = document.createElement('div');
        configButtonContainer.style.cssText = 'display: flex; justify-content: space-around; gap: 5px;';

        const folderButton = document.createElement('button');
        folderButton.textContent = 'Folder';
        folderButton.title = 'Configure download subfolder';
        folderButton.onclick = configureFolder;
        folderButton.style.cssText = 'padding: 5px 10px; flex-grow: 1; border-radius: 3px; border: 1px solid #bbb; background-color: #e7e7e7; cursor: pointer;';

        const patternButton = document.createElement('button');
        patternButton.textContent = 'Pattern';
        patternButton.title = 'Configure image URL pattern';
        patternButton.onclick = configureImagePattern;
        patternButton.style.cssText = 'padding: 5px 10px; flex-grow: 1; border-radius: 3px; border: 1px solid #bbb; background-color: #e7e7e7; cursor: pointer;';

        configButtonContainer.append(folderButton, patternButton);

        const status = document.createElement('div');
        status.id = STATUS_ID;
        status.style.cssText = 'margin-top: 8px; font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word; background: #fff; border: 1px solid #ddd; padding: 5px; border-radius: 3px;';

        container.append(title, startButton, configButtonContainer, status);

        try {
            document.body.appendChild(container);
            log(`UI added to the iframe body.`);
            updateInterface();
        } catch (e) {
            log(`Error adding UI to iframe body: ${e.message}.`, 'error');
        }
    }

    function updateInterface() {
        const statusElement = document.getElementById(STATUS_ID);
        const startButton = document.getElementById(START_BUTTON_ID);

        if (statusElement) {
            const patternSource = imagePattern ? imagePattern.source : 'N/A (Error?)';
            const activeStatus = isDownloadingActive ? '🟢 Active' : '🔴 Idle';
            statusElement.textContent = `Status: ${activeStatus}\nFolder: ${destinationFolder || '(None)'}\nPattern: ${patternSource}\nDownloaded: ${latestImages.size}`;
        }

        if (startButton) {
            startButton.textContent = isDownloadingActive ? '⏹️ Stop Download' : '▶️ Start Download';
            startButton.style.backgroundColor = isDownloadingActive ? '#ffdddd' : '#ddffdd';
        }
    }

    // --- Download Control Functions ---
    function toggleDownloadState() {
        if (isDownloadingActive) {
            stopDownloading();
        } else {
            startDownloading();
        }
        updateInterface();
    }

    function startDownloading() {
        if (isDownloadingActive) return;
        log("Starting download process...");
        isDownloadingActive = true;

        setupPerformanceObserver();

        if (cacheCheckInterval) clearInterval(cacheCheckInterval);
        log("Running initial cache check...");
        verifyCache().then(() => {
             log("Initial cache check complete.");
             cacheCheckInterval = setInterval(verifyCache, VERIFICATION_INTERVAL);
             log(`Periodic cache check started (interval: ${VERIFICATION_INTERVAL}ms).`);
        }).catch(err => {
            log(`Error during initial cache check: ${err.message}`, 'error');
             cacheCheckInterval = setInterval(verifyCache, VERIFICATION_INTERVAL);
             log(`Periodic cache check started DESPITE initial error (interval: ${VERIFICATION_INTERVAL}ms).`);
        });

        log("Detection and download system ACTIVATED.");
        updateInterface();
    }

    function stopDownloading() {
        if (!isDownloadingActive) return;
        log("Stopping download process...");
        isDownloadingActive = false;

        if (observer) {
            observer.disconnect();
            log("PerformanceObserver stopped.");
        }

        if (cacheCheckInterval) {
            clearInterval(cacheCheckInterval);
            cacheCheckInterval = null;
            log("Periodic cache check stopped.");
        }
        log("Detection and download system DEACTIVATED.");
        updateInterface();
    }

    // --- Image Processing and Downloading ---
    function processImage(url) {
        if (!isDownloadingActive) {
            return;
        }
        if (!url || typeof url !== 'string') {
            log(`[processImage] Invalid URL provided: ${url}`, 'warn');
            return;
        }
        if (!imagePattern) {
            log(`[processImage] Image pattern not initialized. Aborting process for ${url}.`, 'error');
            return;
        }
        if (!imagePattern.test(url)) {
            log(`[processImage] URL unexpectedly failed pattern test inside processImage: ${url}`, 'warn');
            return;
        }

        const cleanUrl = url.split('?')[0];
        const name = cleanUrl.split('/').pop();

        if (latestImages.has(cleanUrl)) {
            return;
        }

        log(`[processImage] New image URL detected: ${cleanUrl}`);
        latestImages.add(cleanUrl);

        const fullPath = destinationFolder ? `${destinationFolder}/${name}` : name;
        log(`[processImage] Preparing direct download for: ${name} to path: ${fullPath} from URL: ${url}`);

        try {
            GM_download({
                url: url,
                name: fullPath,
                saveAs: false,
                headers: {
                    'Referer': location.href
                },
                timeout: 20000,
                onload: () => {
                    log(`✅ [GM_download] Download successful: ${fullPath}`);
                    updateInterface();
                },
                onerror: (error) => {
                    let errorDetails = error?.error || 'unknown';
                    let finalUrl = error?.details?.finalUrl || url;
                    let httpStatus = error?.details?.httpStatus;
                    log(`❌ [GM_download] Error: ${errorDetails}. Status: ${httpStatus || 'N/A'}. Final URL: ${finalUrl}. Path: ${fullPath}`, 'error');
                    latestImages.delete(cleanUrl);
                    updateInterface();
                },
                ontimeout: () => {
                    log(`❌ [GM_download] Timeout downloading: ${fullPath}`, 'error');
                    latestImages.delete(cleanUrl);
                    updateInterface();
                }
            });
            log(`[processImage] GM_download call initiated for ${name}. Waiting for callbacks...`);

        } catch (e) {
            log(`❌ [processImage] CRITICAL Exception calling GM_download: ${e.message}`, 'error');
            latestImages.delete(cleanUrl);
            updateInterface();
        }
    }

    // --- Resource Detection Mechanisms ---
    function setupPerformanceObserver() {
        try {
            if (observer) {
                observer.disconnect();
                log('[Observer] Disconnected existing observer.');
            }

            log('[Observer] Setting up PerformanceObserver...');
            observer = new PerformanceObserver((list) => {
                if (!isDownloadingActive) return;

                list.getEntriesByType('resource').forEach(entry => {
                    const url = entry.name;
                    if (imagePattern && imagePattern.test(url)) {
                        log(`[Observer] MATCHED pattern: ${url}`);
                        processImage(url);
                    } else {
                         if (!url.startsWith('data:') && !url.endsWith('.css') && !url.endsWith('.js') && !url.includes('favicon')) {
                            // log(`[Observer] Ignored resource (no pattern match): ${url}`);
                         }
                    }
                });
            });
            observer.observe({ type: 'resource', buffered: true });
            log('[Observer] PerformanceObserver started and listening.');
        } catch (e) {
            log('[Observer] Error starting PerformanceObserver: ' + e.message, 'error');
        }
    }

    // --- Cache Verification (FIXED) ---
    async function verifyCache() {
        if (!isDownloadingActive) {
             return;
        }
        // log('[Cache] Verifying cache (active)...'); // Can be verbose
        try {
            const keys = await caches.keys(); // Get all cache storage keys
            for (const key of keys) { // Loop through cache keys (outer loop)
                try {
                    const cache = await caches.open(key); // Open specific cache
                    const requests = await cache.keys(); // Get all request objects (keys) in this cache
                    // *** FIXED: Use for...of instead of forEach to avoid linter warnings ***
                    for (const request of requests) { // Loop through requests in *this* cache (inner loop)
                        const url = request.url;
                        // Check if the cached request URL matches the pattern
                        if (imagePattern && imagePattern.test(url)) {
                            log(`[Cache] MATCHED pattern: ${url}`);
                            processImage(url); // Hand off to processing function
                        }
                    }
                } catch (cacheError) {
                     // Log errors accessing specific caches if needed for debugging
                     // log(`[Cache] Could not access/read cache '${key}': ${cacheError.message}`, 'warn');
                }
            }
        } catch (error) {
            log('[Cache] General error verifying cache: ' + error.message, 'error');
        }
    }

    // --- Main Initialization ---
    function initialize() {
        initializeImagePattern();
        log(`Initializing script in IFRAME: ${location.href}`);
        createInterface();
        try {
            GM_registerMenuCommand('🖼️ Configure Download Subfolder', configureFolder);
            GM_registerMenuCommand('🔍 Configure Image URL Pattern', configureImagePattern);
        } catch (e) {
            log(`Error registering menu commands (already registered?): ${e.message}`, 'warn');
        }
        log('Script ready. Press "Start Download" to begin.');
    }

    // --- Run Initialization ---
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }

})(); // End of userscript
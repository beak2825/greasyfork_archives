// ==UserScript==
// @name         Amazon Video ASIN Display
// @namespace    sac@libidgel.com
// @version      0.4.0
// @description  Show unique ASINs for episodes and movies/seasons on Amazon Prime Video
// @author       ReiDoBrega
// @license      MIT
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496577/Amazon%20Video%20ASIN%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/496577/Amazon%20Video%20ASIN%20Display.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Add styles for ASIN display and pop-up
    let style = document.createElement("style");
    style.textContent = `
        // Modify your style.textContent by adding this rule:
        .x-asin-container ._3ra7oO {
            font-size: 0.2em;
            opacity: 0.75;
            margin-top: 2px;
        }
        .x-asin-item, .x-episode-asin {
            color: #1399FF; /* Blue color */
            cursor: pointer;
            margin: 5px 0;
        }
        .x-copy-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0); /* Transparent background */
            color: #1399FF; /* Blue text */
            padding: 10px 20px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0);
            z-index: 1000;
            animation: fadeInOut 2.5s ease-in-out;
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        .x-asin-display {
            font-size: 5px; /* Absolute size in pixels */
            opacity: 0.7;
            margin-top: 12px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Store for captured episode data
    let capturedEpisodeData = [];

    // Flag to indicate if we've already processed episodes from API
    let episodesProcessed = false;

    // Function to extract ASIN from URL
    function extractASINFromURL() {
        const url = window.location.href;
        const asinRegex = /\/gp\/video\/detail\/([A-Z0-9]{10})/;
        const match = url.match(asinRegex);
        return match ? match[1] : null;
    }

    // Function to find and display unique ASINs
    function findUniqueASINs() {
        // Extract ASIN from URL first
        const urlASIN = extractASINFromURL();
        if (urlASIN) {
            return { urlASIN };
        }

        // Object to store one unique ASIN/ID for each type
        let uniqueIds = {};

        // List of ID patterns to find
        const idPatterns = [
            {
                name: 'titleID',
                regex: /"titleID":"([^"]+)"/
            },
            // {
            //     name: 'pageTypeId',
            //     regex: /pageTypeId: "([^"]+)"/
            // },
            // {
            //     name: 'pageTitleId',
            //     regex: /"pageTitleId":"([^"]+)"/
            // },
            // {
            //     name: 'catalogId',
            //     regex: /catalogId":"([^"]+)"/
            // }
        ];

        // Search through patterns
        idPatterns.forEach(pattern => {
            let match = document.body.innerHTML.match(pattern.regex);
            if (match && match[1]) {
                uniqueIds[pattern.name] = match[1];
            }
        });

        return uniqueIds;
    }

    // Function to find ASINs from JSON response
    function findUniqueASINsFromJSON(jsonData) {
        let uniqueIds = {};

        // Comprehensive search paths for ASINs
        const searchPaths = [
            { name: 'titleId', paths: [
                ['titleID'],
                ['page', 0, 'assembly', 'body', 0, 'args', 'titleID'],
                ['titleId'],
                ['detail', 'titleId'],
                ['data', 'titleId']
            ]},
        ];

        // Deep object traversal function
        function traverseObject(obj, paths) {
            for (let pathSet of paths) {
                try {
                    let value = obj;
                    for (let key of pathSet) {
                        value = value[key];
                        if (value === undefined) break;
                    }

                    if (value && typeof value === 'string' && value.trim() !== '') {
                        return value;
                    }
                } catch (e) {
                    // Silently ignore traversal errors
                }
            }
            return null;
        }

        // Search through all possible paths
        searchPaths.forEach(({ name, paths }) => {
            const value = traverseObject(jsonData, paths);
            if (value) {
                uniqueIds[name] = value;
                console.log(`[ASIN Display] Found ${name} in JSON: ${value}`);
            }
        });

        return uniqueIds;
    }

    // Function to extract episodes from JSON data
    function extractEpisodes(jsonData) {
        try {
            // Possible paths to episode data
            const episodePaths = [
                ['items'],
                ['widgets', 0, 'data', 'items'],
                ['widgets', 0, 'items'],
                ['data', 'widgets', 0, 'items'],
                ['page', 0, 'assembly', 'body', 0, 'items'],
                ['data', 'items']
            ];

            // Try each path
            for (const path of episodePaths) {
                let current = jsonData;
                let valid = true;

                // Navigate through the path
                for (const key of path) {
                    if (current && current[key] !== undefined) {
                        current = current[key];
                    } else {
                        valid = false;
                        break;
                    }
                }

                // If we found a valid path and it's an array of items
                if (valid && Array.isArray(current)) {
                    return current.filter(item =>
                        item &&
                        (item.titleId || item.id || item.episodeID || item.asin)
                    );
                }
            }
        } catch (e) {
            console.error("Error extracting episodes:", e);
        }
        return [];
    }

    // Function to add episode ASINs from captured API data
    function addAPIEpisodeASINs() {
        try {
            if (capturedEpisodeData.length === 0 || episodesProcessed) {
                return false;
            }

            console.log(`[ASIN Display] Processing ${capturedEpisodeData.length} captured episodes`);

            // Process and display episode ASINs
            capturedEpisodeData.forEach(episode => {
                const episodeId = episode.titleId || episode.id || episode.episodeID || episode.asin;
                const episodeNumber = episode.episodeNumber || episode.number;
                const seasonNumber = episode.seasonNumber;

                if (!episodeId) return;

                // Find episode element to attach ASIN to
                const selector = `[data-automation-id="ep-${episodeNumber}"], [id^="selector-${episodeId}"], [id^="av-episode-expand-toggle-${episodeId}"]`;
                let episodeElement = document.querySelector(selector);

                // If can't find by direct ID, try to find by episode number
                if (!episodeElement && episodeNumber) {
                    episodeElement = document.querySelector(`[data-automation-id*="ep-${episodeNumber}"]`);

                    // Try alternative approaches for finding episode elements
                    if (!episodeElement) {
                        // This will try to match elements that might contain the episode number visually
                        const possibleElements = [...document.querySelectorAll('[data-automation-id*="ep-"]')];
                        episodeElement = possibleElements.find(el => {
                            const text = el.textContent.trim();
                            return text.includes(`Episode ${episodeNumber}`) ||
                                  text.includes(`Ep. ${episodeNumber}`) ||
                                  text.match(new RegExp(`\\b${episodeNumber}\\b`));
                        });
                    }
                }

                // If we found an element to attach to
                if (episodeElement) {
                    // Skip if ASIN already added
                    if (episodeElement.parentNode.querySelector("._3ra7oO")) {
                        return;
                    }

                    // Create ASIN element
                    let asinEl = document.createElement("div");
                    asinEl.className = "_3ra7oO x-asin-display"; // Add your custom class alongside the original
                    asinEl.textContent = asin;
                    asinEl.addEventListener("click", () => copyToClipboard(asin));

                    // Insert ASIN element after the episode title
                    let epTitle = episodeElement.parentNode.querySelector("[data-automation-id^='ep-title']");
                    if (epTitle) {
                        epTitle.parentNode.insertBefore(asinEl, epTitle.nextSibling);
                    } else {
                        // If can't find specific title element, just append to the episode element's parent
                        episodeElement.parentNode.appendChild(asinEl);
                    }
                } else {
                    console.log(`[ASIN Display] Could not find element for episode ${episodeNumber} with ID ${episodeId}`);
                }
            });

            // Mark as processed to avoid duplicate processing
            episodesProcessed = true;

            return true; // API episode ASINs added successfully
        } catch (e) {
            console.error("ASIN Display - Error in addAPIEpisodeASINs:", e);
            return false; // Error occurred
        }
    }

    // Function to add episode ASINs using DOM
    function addEpisodeASINs() {
        try {
            document.querySelectorAll("[id^='selector-'], [id^='av-episode-expand-toggle-']").forEach(el => {
                // Skip if ASIN already added
                if (el.parentNode.querySelector("._3ra7oO")) {
                    return;
                }

                // Extract ASIN from the element ID
                let asin = el.id.replace(/^(?:selector|av-episode-expand-toggle)-/, "");

                // Create ASIN element
                let asinEl = document.createElement("div");
                asinEl.className = "_3ra7oO x-asin-display"; // Add your custom class alongside the original
                asinEl.textContent = asin;
                asinEl.addEventListener("click", () => copyToClipboard(asin));

                // Insert ASIN element after the episode title
                let epTitle = el.parentNode.querySelector("[data-automation-id^='ep-title']");
                if (epTitle) {
                    epTitle.parentNode.insertBefore(asinEl, epTitle.nextSibling);
                }
            });
            return true; // Episode ASINs added successfully
        } catch (e) {
            console.error("ASIN Display - Error in addEpisodeASINs:", e);
            return false; // Error occurred
        }
    }

    // Function to add ASIN display
    function addASINDisplay(uniqueIds = null) {
        try {
            // If no IDs provided, find them from HTML
            if (!uniqueIds) {
                uniqueIds = findUniqueASINs();
            }

            // Remove existing ASIN containers
            document.querySelectorAll(".x-asin-container").forEach(el => el.remove());

            // If no IDs found, return
            if (Object.keys(uniqueIds).length === 0) {
                console.log("ASIN Display: No ASINs found");
                return false;
            }

            // Create ASIN container
            let asinContainer = document.createElement("div");
            asinContainer.className = "x-asin-container";

            // Add each unique ID as a clickable element
            Object.entries(uniqueIds).forEach(([type, id]) => {
                let asinEl = document.createElement("div");
                asinEl.className = "_1jWggM v2uvTa fbl-btn _2Pw7le";
                asinEl.textContent = id;
                asinEl.addEventListener("click", () => copyToClipboard(id));
                asinContainer.appendChild(asinEl);
            });

            // Insert the ASIN container after the synopsis
            let after = document.querySelector(".dv-dp-node-synopsis, .av-synopsis");
            if (!after) {
                console.log("ASIN Display: Could not find element to insert after");
                return false;
            }

            after.parentNode.insertBefore(asinContainer, after.nextSibling);
            return true;
        } catch (e) {
            console.error("ASIN Display - Error in addASINDisplay:", e);
            return false;
        }
    }

    // Function to copy text to clipboard and show pop-up
    function copyToClipboard(text) {
        const input = document.createElement("textarea");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);

        // Show pop-up
        const popup = document.createElement("div");
        popup.className = "x-copy-popup";
        popup.textContent = `Copied: ${text}`;
        document.body.appendChild(popup);

        // Remove pop-up after 1.5 seconds
        setTimeout(() => {
            popup.remove();
        }, 1500);
    }

    // Intercept fetch requests for JSON responses
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url] = args;
        const isString = typeof url === 'string';

        // Create a promise for the original fetch
        const fetchPromise = originalFetch.apply(this, args);

        // Check if this is a URL we're interested in
        if (isString &&
           ((url.includes('/detail/') && url.includes('primevideo.com')) ||
            (url.includes('api/getDetailWidgets')))) {

            // Process the response without blocking the original fetch
            fetchPromise.then(async response => {
                try {
                    // Only process JSON responses
                    const contentType = response.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                        // Clone the response to avoid consuming it
                        const clonedResponse = response.clone();
                        const jsonResponse = await clonedResponse.json();

                        // Find unique IDs from the response
                        const jsonIds = findUniqueASINsFromJSON(jsonResponse);

                        // For Detail API calls, extract episodes
                        if (url.includes('getDetailWidgets')) {
                            const episodes = extractEpisodes(jsonResponse);
                            if (episodes && episodes.length > 0) {
                                console.log(`[ASIN Display] Intercepted API response with ${episodes.length} episodes`);

                                // Store episode data for later use
                                capturedEpisodeData = episodes;

                                // Reset the processed flag to allow reprocessing on new data
                                episodesProcessed = false;

                                // Wait for the page to settle before updating
                                setTimeout(() => {
                                    addAPIEpisodeASINs();
                                }, 1000);
                            }
                        }

                        // Update ASIN display with any findings
                        if (Object.keys(jsonIds).length > 0) {
                            setTimeout(() => {
                                addASINDisplay(jsonIds);
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error('[ASIN Display] Error processing fetch response:', error);
                }
            }).catch(error => {
                console.error('[ASIN Display] Error in fetch intercept:', error);
            });
        }

        // Return the original fetch promise so the page works normally
        return fetchPromise;
    };

    // Also intercept XHR requests to capture any non-fetch API calls
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        // Store the URL if it's a detail API call
        if (typeof url === 'string' && url.includes('api/getDetailWidgets')) {
            this._asinDisplayUrl = url;
        }
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._asinDisplayUrl) {
            // Add a response handler
            this.addEventListener('load', function() {
                try {
                    if (this.responseType === 'json' ||
                        (this.getResponseHeader('content-type')?.includes('application/json'))) {

                        let jsonResponse;
                        if (this.responseType === 'json') {
                            jsonResponse = this.response;
                        } else {
                            jsonResponse = JSON.parse(this.responseText);
                        }

                        // Extract episodes and IDs
                        const episodes = extractEpisodes(jsonResponse);
                        if (episodes && episodes.length > 0) {
                            console.log(`[ASIN Display] Intercepted XHR with ${episodes.length} episodes`);
                            capturedEpisodeData = episodes;
                            episodesProcessed = false;

                            setTimeout(() => {
                                addAPIEpisodeASINs();
                            }, 1000);
                        }

                        // Update main ASIN display
                        const jsonIds = findUniqueASINsFromJSON(jsonResponse);
                        if (Object.keys(jsonIds).length > 0) {
                            setTimeout(() => {
                                addASINDisplay(jsonIds);
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error('[ASIN Display] Error processing XHR response:', error);
                }
            });
        }
        return originalXHRSend.apply(this, args);
    };

    // Track the current URL
    let currentURL = window.location.href;

    // Function to update all ASINs
    function updateAllASINs() {
        // Display main ASINs
        addASINDisplay();

        // Try to add episode ASINs from DOM first
        addEpisodeASINs();

        // Try to add episode ASINs from captured API data
        addAPIEpisodeASINs();

        // Reset the episodesProcessed flag on page change
        episodesProcessed = false;
    }

    // Function to check for URL changes
    function checkForURLChange() {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            console.log("[ASIN Display] URL changed. Updating IDs...");

            // Clear captured data on page change
            capturedEpisodeData = [];
            episodesProcessed = false;

            // Wait for the page to settle before displaying ASINs
            setTimeout(() => {
                updateAllASINs();
            }, 1000);
        }
    }

    // Run the URL change checker every 500ms
    setInterval(checkForURLChange, 500);

    // Initial run after the page has fully loaded
    window.addEventListener("load", () => {
        setTimeout(() => {
            updateAllASINs();
        }, 1000);
    });

    // Additional MutationObserver to detect DOM changes that might indicate new episodes loaded
    const observer = new MutationObserver((mutations) => {
        // Look for mutations that might indicate new episode content
        const episodeContentChanged = mutations.some(mutation => {
            // Check if any added nodes contain episode selectors
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    return node.querySelector?.('[id^="selector-"], [id^="av-episode-expand-toggle-"]') ||
                           node.id?.startsWith('selector-') ||
                           node.id?.startsWith('av-episode-expand-toggle-');
                }
                return false;
            });
        });

        if (episodeContentChanged) {
            console.log("[ASIN Display] Detected new episode content, updating ASINs...");
            setTimeout(() => {
                updateAllASINs();
            }, 1000);
        }
    });

    // Start observing the document body for episode content changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
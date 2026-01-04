// ==UserScript==
// @name         Sniffies Helper & Ad Blocker with Place Scrape
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Adds helper buttons to profiles and places, removes ads across Sniffies.
// @author       You
// @match        *://sniffies.com/*
// @match        *://*.sniffies.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      100.88.77.24
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541493/Sniffies%20Helper%20%20Ad%20Blocker%20with%20Place%20Scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/541493/Sniffies%20Helper%20%20Ad%20Blocker%20with%20Place%20Scrape.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const FLASK_APP_URL = 'http://100.88.77.24:3989'; // Your local Flask app IP/port

    // =====================================================================
    // SECTION 1.5: API Response Interceptor
    // =====================================================================

    // Intercept fetch requests to capture place data
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            // Check if this is a place metadata API call
            if (response.url && response.url.includes('/api/place/metadata')) {
                // Clone the response so we can read it without affecting the original
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    if (data && data.place && data.place._id) {
                        console.log('Intercepted place data for:', data.place._id);
                        // Send the place data to your Flask app
                        sendPlaceDataToFlask(data);
                    }
                }).catch(err => {
                    console.log('Error parsing place data:', err);
                });
            }
            return response;
        });
    };

    // Function to send place data to Flask
    function sendPlaceDataToFlask(placeData) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${FLASK_APP_URL}/api/place_data`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(placeData),
            onload: (response) => {
                if (response.status === 200) {
                    console.log('Place data sent successfully:', placeData.place._id);
                } else {
                    console.log('Failed to send place data:', response.status);
                }
            },
            onerror: (error) => {
                console.log('Error sending place data:', error);
            }
        });
    }

    // =====================================================================
    // SECTION 1: Ad Blocker Logic
    // =====================================================================
    function removeAds(root = document) {
        // 1) remove the custom house-ads component
        root.querySelectorAll('app-house-ads').forEach(el => el.remove());

        // 2) remove any overset DIV with a dynamic ng-tns-c* class
        root.querySelectorAll('div.overset').forEach(div => {
            for (let cls of div.classList) {
                if (/^ng-tns-c/.test(cls)) {
                    div.remove();
                    break;
                }
            }
        });

        // 3) remove the 3-level-up ancestor of any element with Upgrade CTA
        root.querySelectorAll('[aria-label="Upgrade to Sniffies Plus"]').forEach(el => {
            let anc = el;
            for (let i = 0; i < 3 && anc; i++) anc = anc.parentElement;
            if (anc) anc.remove();
        });

        // 4) remove any chat-row marked as an ad
        root.querySelectorAll('tr[data-testid="sniffiesChatRow"]').forEach(el => el.remove());
        root.querySelectorAll('[aria-label="View Advertisement"]').forEach(el => {
            const row = el.closest('tr');
            if (row) row.remove();
        });
    }

    // =====================================================================
    // SECTION 2: Helper Buttons Logic
    // =====================================================================
    const buildLocalViewURL = (id) => `${FLASK_APP_URL}/?_id=${id}`;
    const buildLocalPlaceURL = (placeId) => `${FLASK_APP_URL}/place/${placeId}`;

    // EXACT WORKING USER PROFILE BUTTONS (unchanged from working script)
    const injectButtons = () => {
        const targetDiv = document.querySelector('div[data-testid="cruiserInfoContainer"]');
        if (!targetDiv || document.getElementById('local-helper-buttons-container')) {
            return;
        }

        const userId = window.location.pathname.split('/').pop();
        if (!/^[0-9a-f]{24,}$/.test(userId)) {
            return; // Not a valid user ID / profile page
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'local-helper-buttons-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.width = '100%';

        const baseButtonStyles = `
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: bold;
            color: white;
            transition: background-color 0.3s;
        `;

        const localViewButton = document.createElement('button');
        localViewButton.innerText = 'View Local';
        localViewButton.title = 'Open this profile in your local viewer';
        localViewButton.style.cssText = baseButtonStyles + 'background-color: #6c757d;';
        localViewButton.onmouseover = () => { localViewButton.style.backgroundColor = '#5a6268'; };
        localViewButton.onmouseout = () => { localViewButton.style.backgroundColor = '#6c757d'; };
        localViewButton.addEventListener('click', () => {
            window.open(buildLocalViewURL(userId), '_blank');
        });

        const scrapeButton = document.createElement('button');
        scrapeButton.innerText = 'Manual Scrape';
        scrapeButton.title = 'Add this user to the manual scrape queue';
        scrapeButton.style.cssText = baseButtonStyles + 'background-color: #4CAF50;';
        scrapeButton.addEventListener('click', () => {
            scrapeButton.innerText = 'Requesting...';
            scrapeButton.disabled = true;
            GM_xmlhttpRequest({
                method: "POST",
                url: `${FLASK_APP_URL}/trigger_scrape/${userId}`,
                onload: (response) => {
                    scrapeButton.innerText = response.status === 200 ? '✅ Queued!' : '❌ Failed!';
                    scrapeButton.style.backgroundColor = response.status === 200 ? '#007BFF' : '#DC3545';
                },
                onerror: (response) => {
                    scrapeButton.innerText = '❌ Error!';
                    scrapeButton.style.backgroundColor = '#DC3545';
                    alert('Error: Could not connect to the local Flask app. Is it running?');
                }
            });
        });

        buttonContainer.appendChild(localViewButton);
        buttonContainer.appendChild(scrapeButton);
        targetDiv.insertAdjacentElement('afterend', buttonContainer);
    };

    // PLACE BUTTONS (separate function)
    const injectPlaceButtons = () => {
        // Only run on place pages
        if (!window.location.pathname.includes('/place/')) {
            return;
        }

        // Look for the specific place title h1 element
        const placeTitle = document.querySelector('h1[data-testid="place-title"]');

        const existingContainer = document.getElementById('place-helper-buttons-container');

        if (!placeTitle || existingContainer) {
            return;
        }

        // Extract place ID from URL - place URLs are typically /place/PLACE_ID
        const pathParts = window.location.pathname.split('/');
        const placeId = pathParts[pathParts.indexOf('place') + 1];

        if (!placeId || placeId.length < 10) {
            return; // Not a valid place ID
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'place-helper-buttons-container';
        buttonContainer.style.cssText = `
            display: flex !important;
            gap: 10px;
            margin: 10px;
            padding: 10px;
            width: calc(100% - 20px);
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            z-index: 9999;
            position: relative;
        `;

        const baseButtonStyles = `
            padding: 10px 15px !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-size: 0.9em !important;
            font-weight: bold !important;
            color: white !important;
            transition: background-color 0.3s !important;
            z-index: 10000 !important;
            position: relative !important;
            min-width: 120px !important;
            text-align: center !important;
        `;

        const localPlaceViewButton = document.createElement('button');
        localPlaceViewButton.innerText = 'View Place Local';
        localPlaceViewButton.title = 'Open this place in your local viewer';
        localPlaceViewButton.style.cssText = baseButtonStyles + 'background-color: #17a2b8;';
        localPlaceViewButton.onmouseover = () => { localPlaceViewButton.style.backgroundColor = '#138496'; };
        localPlaceViewButton.onmouseout = () => { localPlaceViewButton.style.backgroundColor = '#17a2b8'; };
        localPlaceViewButton.addEventListener('click', () => {
            window.open(buildLocalPlaceURL(placeId), '_blank');
        });

        const placeScrapeButton = document.createElement('button');
        placeScrapeButton.innerText = 'Scrape Place';
        placeScrapeButton.title = 'Add this place to the manual scrape queue';
        placeScrapeButton.style.cssText = baseButtonStyles + 'background-color: #fd7e14;';
        placeScrapeButton.addEventListener('click', () => {
            placeScrapeButton.innerText = 'Requesting...';
            placeScrapeButton.disabled = true;
            GM_xmlhttpRequest({
                method: "GET",
                url: `${FLASK_APP_URL}/trigger_place_scrape/${placeId}`,
                onload: (response) => {
                    placeScrapeButton.innerText = response.status === 200 ? '✅ Queued!' : '❌ Failed!';
                    placeScrapeButton.style.backgroundColor = response.status === 200 ? '#007BFF' : '#DC3545';
                },
                onerror: (response) => {
                    placeScrapeButton.innerText = '❌ Error!';
                    placeScrapeButton.style.backgroundColor = '#DC3545';
                    alert('Error: Could not connect to the local Flask app. Is it running?');
                }
            });
        });

        buttonContainer.appendChild(localPlaceViewButton);
        buttonContainer.appendChild(placeScrapeButton);

        // Insert the button container after the place title h1
        placeTitle.insertAdjacentElement('afterend', buttonContainer);
    };

    // =====================================================================
    // SECTION 3: Execution Logic (EXACT COPY from working script)
    // =====================================================================
    // This single observer will handle both ad removal and button injection
    // whenever the page content changes.
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Check if it's an element node
                    removeAds(node);
                }
            }
        }
        // Always try to inject buttons after any DOM change
        injectButtons();
        injectPlaceButtons(); // Add place buttons separately
    });

    // Start observing the entire document for changes.
    observer.observe(document.body, { childList: true, subtree: true });

    // Run both functions once on initial script load after a short delay.
    setTimeout(() => {
        removeAds();
        injectButtons();
        injectPlaceButtons(); // Add place buttons separately
    }, 1000);

    // Also run the ad remover periodically as a safeguard.
    setInterval(() => {
        removeAds();
        injectButtons(); // Keep calling the working user profile function
        injectPlaceButtons(); // Also call place buttons
    }, 1500);

})();
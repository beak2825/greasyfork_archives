// ==UserScript==
// @name         Cyclist Ring (Enhanced)
// @namespace    microbes.torn.ring.enhanced
// @version      1.1
// @description  Plays an alert and highlights when the Cyclist pickpocket target is available. Alerts are on by default and can be toggled.
// @author       Microbes (Enhanced by eaksquad)
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540532/Cyclist%20Ring%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540532/Cyclist%20Ring%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Set to true to have alerts enabled by default when the page loads, false to have them off.
    const ALERTS_ENABLED_BY_DEFAULT = true;
    const ALERT_SOUND_URL = 'https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103';
    const HIGHLIGHT_COLOR = "#00ff00"; // Green highlight for cyclist

    // --- State Management ---
    let isAlertsEnabled = ALERTS_ENABLED_BY_DEFAULT;

    // --- Core Functions ---

    /**
     * Checks the API response to see if the "Cyclist" target is available.
     * @param {Array} crimes - The array of crime objects from the API.
     * @returns {boolean} - True if the cyclist is available, false otherwise.
     */
    function isCyclistAvailable(crimes) {
        if (!crimes || !Array.isArray(crimes)) return false;
        for (const crime of crimes) {
            if (crime.title === "Cyclist" && crime.available === true) {
                return true;
            }
        }
        return false;
    }

    /**
     * Plays the alert sound.
     */
    function playAlertSound() {
        const audio = new Audio(ALERT_SOUND_URL);
        audio.play().catch(error => console.error("[Cyclist Ring] Audio playback failed:", error));
    }

    /**
     * Highlights all available cyclist targets on the page.
     */
    function highlightCyclists() {
        // The original logic to find the cyclist icon is clever.
        // It checks the background-position-y of the icon sprite. '0px' is the cyclist.
        $('.CircularProgressbar').nextAll().each(function() {
            if ($(this).css('background-position-y') === '0px') {
                // Traverse up to the main container for the target and apply the highlight
                $(this).parent().parent().parent().parent().css("background-color", HIGHLIGHT_COLOR);
            }
        });
    }

    /**
     * Sets up the main logic to intercept network requests and check for the cyclist.
     */
    function initializeAlerts() {
        interceptFetch("torn.com", "/page.php?sid=crimesData", (response) => {
            // Only run the check if alerts are currently enabled by the user
            if (!isAlertsEnabled) {
                return;
            }

            const crimes = response?.DB?.crimesByType;
            if (isCyclistAvailable(crimes)) {
                playAlertSound();
                highlightCyclists();
            }
        });
    }

    /**
     * Creates the toggle button and adds it to the page.
     */
    function setupInterface() {
        // *** FIX 1: Check if the button already exists to prevent duplicates ***
        if (document.getElementById('cyclist-alert-controls')) {
            return;
        }

        const controlsContainer = `
            <div id="cyclist-alert-controls" style="margin-bottom: 10px;">
                <a id="cyclist-toggle-btn" class="torn-btn"></a>
            </div>
        `;
        $('.pickpocketing-root').prepend(controlsContainer);

        const toggleButton = $('#cyclist-toggle-btn');

        // Function to update the button's appearance based on the current state
        function updateButtonState() {
            if (isAlertsEnabled) {
                toggleButton.text('Cyclist Alerts: ON').css({ 'background': '#4CAF50', 'color': 'white' });
            } else {
                toggleButton.text('Cyclist Alerts: OFF').css({ 'background': '', 'color': '' });
            }
        }

        // *** FIX 2: Make the button a toggle instead of disappearing ***
        toggleButton.on('click', () => {
            isAlertsEnabled = !isAlertsEnabled; // Flip the state
            updateButtonState();

            // Play a sound when enabling as confirmation
            if (isAlertsEnabled) {
                playAlertSound();
            }
        });

        // Set the initial state of the button when it's first created
        updateButtonState();
    }


    // --- Utility Functions (kept inside the script to avoid global conflicts) ---

    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { subtree: true, childList: true });
        });
    }

    function interceptFetch(url, q, callback) {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [resource, config] = args;
            const requestUrl = typeof resource === 'string' ? resource : resource.url;

            return originalFetch.apply(this, args).then(response => {
                if (response.url.includes(url) && response.url.includes(q)) {
                    const clone = response.clone();
                    clone.json()
                        .then(json => callback(json, response.url))
                        .catch(error => console.error("[Cyclist Ring][InterceptFetch] Error parsing JSON:", error));
                }
                return response;
            }).catch(error => {
                console.error("[Cyclist Ring][InterceptFetch] Error with fetch:", error);
                // Still reject the promise to not break the chain
                return Promise.reject(error);
            });
        };
    }

    // --- Script Entry Point ---

    // Wait for the crimes container to exist before doing anything
    waitForElementToExist('.pickpocketing-root').then(() => {
        console.log("[Cyclist Ring] Pickpocketing container found. Initializing script.");
        setupInterface();
    });

    // *** FIX 3: Enable by default by initializing the alerts immediately ***
    // This runs once when the script is loaded, independent of the UI.
    initializeAlerts();

})();
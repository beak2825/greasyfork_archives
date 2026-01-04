// ==UserScript==
// @name         Torn Pickpocketing Helper (Enhanced & Optimized)
// @namespace    torn.pickpocketing.helper.rebuilt.v15.2 // Updated namespace
// @version      15.6 // Updated version
// @description  An optimized and robust helper for Torn City pickpocketing, merging Cyclist Ring and Pickpocketing Colors.
// @author       eaksquad, Microbes, Korbrm
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540535/Torn%20Pickpocketing%20Helper%20%28Enhanced%20%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540535/Torn%20Pickpocketing%20Helper%20%28Enhanced%20%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use the version number from the metadata for internal logging and consistency.
    const SCRIPT_VERSION = "15.6"; // Updated internal version to match metadata
    console.log(`[PPHelper v${SCRIPT_VERSION}] Script loading.`);

    // --- Configuration ---
    // User-configurable settings for the script's features.
    const SETTINGS = {
        cyclistAlerts: {
            enabled: true,
            soundUrl: 'https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103', // Custom sound for cyclist appearance
            highlightColor: '#00ff00', // Bright green for cyclist highlight
            highlightOpacity: '0.3'    // Transparency level for the highlight background
        },
        difficultyColors: {
            enabled: true,
            showCategoryText: true // Whether to append the difficulty category name (e.g., "(Safe)") to crime titles
        },
        // NEW: Setting to control hiding the Police Officer target.
        hidePolice: {
            enabled: true // Default to enabled, can be toggled by the button.
        }
    };

    // --- Data Definitions ---
    // Maps target names to difficulty categories. These are used for applying specific colors.
    const markGroups = {
        "Safe": ["Drunk man", "Drunk woman", "Homeless person", "Junkie", "Elderly man", "Elderly woman"],
        "Moderately Unsafe": ["Classy lady", "Laborer", "Postal worker", "Young man", "Young woman", "Student"],
        "Unsafe": ["Rich kid", "Sex worker", "Thug"],
        "Risky": ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
        "Dangerous": ["Cyclist"], // Specifically targets Cyclists for alerts.
        "Very Dangerous": ["Police officer"] // Typically the highest risk category.
    };

    // Standard color mapping for each difficulty category.
    const categoryColorMap = {
        "Safe": "#37b24d",        // Green
        "Moderately Unsafe": "#74b816", // Light Green/Yellow
        "Unsafe": "#f59f00",      // Orange
        "Risky": "#f76707",       // Dark Orange
        "Dangerous": "#f03e3e",   // Red
        "Very Dangerous": "#7048e8" // Purple (often for special or very high risk)
    };

    // Color mapping for borders, dynamically determined by the player's skill tiers.
    const skillTiers = {
        tier1: { "Safe": "#37b24d", "Moderately Unsafe": "#f76707", "Unsafe": "#f03e3e", "Risky": "#f03e3e", "Dangerous": "#f03e3e", "Very Dangerous": "#7048e8" },
        tier2: { "Safe": "#37b24d", "Moderately Unsafe": "#37b24d", "Unsafe": "#f76707", "Risky": "#f03e3e", "Dangerous": "#f03e3e", "Very Dangerous": "#7048e8" },
        tier3: { "Safe": "#37b24d", "Moderately Unsafe": "#37b24d", "Unsafe": "#37b24d", "Risky": "#f76707", "Dangerous": "#f03e3e", "Very Dangerous": "#7048e8" },
        tier4: { "Safe": "#37b24d", "Moderately Unsafe": "#37b24d", "Unsafe": "#37b24d", "Risky": "#37b24d", "Dangerous": "#f76707", "Very Dangerous": "#7048e8" },
        tier5: { "Safe": "#37b24d", "Moderately Unsafe": "#37b24d", "Unsafe": "#37b24d", "Risky": "#37b24d", "Dangerous": "#37b24d", "Very Dangerous": "#7048e8" }
    };

    // --- State Management ---
    // Flags to track the enabled status of script features.
    let isCyclistAlertsEnabled = SETTINGS.cyclistAlerts.enabled;
    let isDifficultyColorsEnabled = SETTINGS.difficultyColors.enabled;
    // NEW: State variable for hiding police officers.
    let isHidePoliceEnabled = SETTINGS.hidePolice.enabled;

    // State variables for managing the cyclist sound alert's cooldown and visibility.
    let wasCyclistVisibleLastRun = false;
    let lastCyclistCheckTime = 0;

    // --- Enhanced Utility Functions ---

    /**
     * Helper function to debounce rapid calls to a function.
     * Ensures a function is only executed after a specified period of inactivity.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The number of milliseconds to delay execution.
     * @returns {Function} The debounced function.
     */
    function debounce(func, wait) {
        let timeout; // Stores the timeout ID
        return function executedFunction(...args) {
            // `this` context and arguments are preserved for the debounced function
            const context = this;

            const later = () => {
                clearTimeout(timeout); // Clear the timeout so it doesn't run again
                func.apply(context, args); // Execute the original function
            };

            clearTimeout(timeout); // Clear any previously scheduled execution
            timeout = setTimeout(later, wait); // Schedule the execution
        };
    }

    /**
     * Plays the configured alert sound for cyclists.
     * Includes a fallback mechanism to generate a simple beep using the Web Audio API if the audio file fails to play.
     */
    function playAlertSound() {
        try {
            const audio = new Audio(SETTINGS.cyclistAlerts.soundUrl);
            audio.volume = 0.7; // Set volume to 70% for clarity.
            audio.play().catch(error => {
                console.error(`[PPHelper v${SCRIPT_VERSION}] Audio playback failed:`, error);
                // Fallback to a simple beep if audio playback fails.
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.type = 'sine'; // Use a sine wave for a pure tone.
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Set frequency to 800 Hz.
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Set gain (volume) to 30%.
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.5); // Stop the oscillator after 0.5 seconds.
                } catch (beepError) {
                    console.error(`[PPHelper v${SCRIPT_VERSION}] Fallback beep generation also failed:`, beepError);
                }
            });
        } catch (error) {
            console.error(`[PPHelper v${SCRIPT_VERSION}] Error creating Audio object:`, error);
        }
    }

    /**
     * Waits for a specific DOM element to appear in the document.
     * This is crucial for elements that are loaded asynchronously or after initial page rendering.
     * @param {string} selector - The CSS selector for the element to wait for.
     * @returns {Promise<Element>} A promise that resolves with the found element.
     */
    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            // Check if the element already exists.
            const existingElement = document.querySelector(selector);
            if (existingElement) {
                return resolve(existingElement);
            }

            // If not, set up a MutationObserver to watch for changes.
            const observer = new MutationObserver((mutations, obs) => {
                mutations.forEach(mutation => {
                    // If nodes were added, check them.
                    if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            // Ensure it's an element node and contains or is the target selector.
                            if (node.nodeType === 1) {
                                if (node.querySelector(selector)) {
                                    resolve(node.querySelector(selector)); // Resolve with the found element.
                                    obs.disconnect(); // Stop observing once found.
                                }
                            }
                        });
                    }
                    // Also check if the target node itself was modified and now matches.
                    if (mutation.target.nodeType === 1 && mutation.target.matches(selector)) {
                        resolve(mutation.target);
                        obs.disconnect();
                    }
                });
            });
            // Start observing the entire document body for any changes.
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    /**
     * Intercepts network requests to specific URLs.
     * This is used to detect when the game fetches crime data, signaling a good time to update styles.
     * @param {string} urlPart - A substring to match in the response URL (e.g., "torn.com").
     * @param {string} queryPart - A substring to match in the response URL's path/query (e.g., "/page.php?sid=crimesData").
     * @param {Function} callback - A function to be called with the parsed JSON response data.
     */
    function interceptFetch(urlPart, queryPart, callback) {
        const originalFetch = window.fetch; // Store the original fetch function.

        // Override window.fetch with our custom function.
        window.fetch = function(...args) {
            // Call the original fetch and process its response.
            return originalFetch.apply(this, args).then(response => {
                // Check if the response URL matches our criteria.
                if (response.url.includes(urlPart) && response.url.includes(queryPart)) {
                    // Clone the response to ensure the original response remains available.
                    // Then, parse the cloned response as JSON.
                    response.clone().json().then(json => {
                        callback(json); // Pass the JSON data to the callback function.
                    }).catch(error => {
                        console.error(`[PPHelper v${SCRIPT_VERSION}] Intercepted fetch JSON parsing failed:`, error);
                        callback(null); // Call callback with null if JSON parsing fails.
                    });
                }
                return response; // Return the original response object.
            });
        };
    }

    /**
     * Applies difficulty-based styling and cyclist highlighting to crime options,
     * and hides the Police Officer target if enabled.
     * This function is optimized to perform styling in a single pass over the crime elements,
     * improving efficiency and responsiveness.
     */
    function applyAllStyling() {
        // Find the player's skill button to determine their current skill level.
        const skillButton = document.querySelector('button[aria-label^="Skill:"]');
        if (!skillButton) {
            // If the skill button isn't found, we cannot determine skill tiers, so we exit early.
            return;
        }

        const skillText = skillButton.getAttribute('aria-label');
        const currentSkill = parseFloat(skillText.replace('Skill: ', '')); // Extract skill value.

        // Determine the active color tier based on the player's current skill level.
        let activeTierColors;
        if (currentSkill < 10) { activeTierColors = skillTiers.tier1; }
        else if (currentSkill < 35) { activeTierColors = skillTiers.tier2; }
        else if (currentSkill < 65) { activeTierColors = skillTiers.tier3; }
        else if (currentSkill < 80) { activeTierColors = skillTiers.tier4; }
        else { activeTierColors = skillTiers.tier5; }

        // Find all primary containers for crime options. These are the elements we will style or hide.
        const allCrimeWrappers = document.querySelectorAll('div[class*="crimeOptionWrapper"]');
        let isCyclistVisibleThisRun = false; // Flag to track if any cyclist is detected in the current update cycle.

        // --- Single Pass Styling & Hiding: Iterate through each crime option wrapper ---
        allCrimeWrappers.forEach(container => {
            // --- Reset all previous styling applied by this script ---
            // Resetting display to '' ensures elements are visible by default before the hiding logic is applied.
            container.style.backgroundColor = '';
            container.style.borderLeft = '';
            container.style.boxShadow = '';
            container.style.border = ''; // Reset any custom script border.
            container.style.display = ''; // Reset display to ensure elements are visible by default.
            container.classList.remove('cyclist-highlight'); // Remove the specific cyclist highlight class.

            // Find the title element within the container, which typically holds the target's name.
            const titleElement = container.querySelector('div[class*="titleAndProps"] > div');
            if (!titleElement) {
                // If a container lacks a title element, skip it.
                return;
            }

            // Extract the base target name, stripping any category suffix (e.g., "(Safe)") that might have been added by previous runs of this script.
            const originalTextFull = titleElement.textContent.trim();
            const originalTextBase = originalTextFull.split(' (')[0];

            // --- Police Officer Hiding Logic ---
            // If hiding police is enabled and the target is a "Police officer", hide the entire container.
            if (isHidePoliceEnabled && originalTextBase === "Police officer") {
                container.style.display = 'none';
                // Skip all further styling and checks for this hidden element.
                return;
            }

            // --- Reset title element styles ---
            titleElement.style.color = '';
            titleElement.style.fontWeight = '';
            titleElement.style.textShadow = '';

            // --- Difficulty Coloring Logic ---
            let category = null; // Variable to hold the determined difficulty category.
            if (isDifficultyColorsEnabled) {
                // Find the difficulty category for the current target name.
                category = Object.keys(markGroups).find(cat => markGroups[cat].includes(originalTextBase));

                if (category) {
                    // Apply text color based on the category's standard color map.
                    titleElement.style.color = categoryColorMap[category];

                    // Apply the left border color based on the player's skill tier and the target's category.
                    container.style.borderLeft = `3px solid ${activeTierColors[category]}`;

                    // Optionally append the category name to the title text if configured and the screen width is sufficient.
                    if (SETTINGS.difficultyColors.showCategoryText && window.innerWidth > 400) {
                        titleElement.textContent = `${originalTextBase} (${category})`;
                    } else {
                        // Otherwise, ensure only the base target name is displayed.
                        titleElement.textContent = originalTextBase;
                    }
                } else {
                    // If the target name is not found in any category, ensure it displays only its base name.
                    titleElement.textContent = originalTextBase;
                }
            } else {
                // If difficulty colors are globally disabled, ensure only the base target name is displayed.
                titleElement.textContent = originalTextBase;
            }

            // --- Cyclist Highlighting Logic ---
            // Determine if the current target is a cyclist. This check prioritizes exact matches and falls back to broader string checks.
            const isCurrentTargetACyclist = (
                originalTextBase.toLowerCase() === 'cyclist' || // Exact match for "Cyclist".
                originalTextBase.toLowerCase().includes('cyclist') || // Check if "cyclist" is part of the name.
                container.textContent.toLowerCase().includes('cyclist') // Broader fallback: check entire container text.
            );

            if (isCurrentTargetACyclist) {
                isCyclistVisibleThisRun = true; // Mark that at least one cyclist has been found in this scan.

                if (isCyclistAlertsEnabled) {
                    // Apply specific, prominent styles for cyclist highlights.
                    container.style.backgroundColor = SETTINGS.cyclistAlerts.highlightColor + SETTINGS.cyclistAlerts.highlightOpacity;
                    container.style.boxShadow = `0 0 15px ${SETTINGS.cyclistAlerts.highlightColor}`;
                    container.style.border = `2px solid ${SETTINGS.cyclistAlerts.highlightColor}`; // Override border if it was set by difficulty coloring.
                    container.classList.add('cyclist-highlight'); // Add the CSS class which includes the pulsating animation.

                    // Enhance the title text for better visibility.
                    titleElement.style.fontWeight = 'bold';
                    titleElement.style.textShadow = `0 0 5px ${SETTINGS.cyclistAlerts.highlightColor}`;
                }
            }
        });

        // --- Sound Alert Logic ---
        // Trigger the sound alert if:
        // 1. Cyclist alerts are enabled.
        // 2. A cyclist was visible in the current update cycle (`isCyclistVisibleThisRun`).
        // 3. No cyclist was visible in the previous run (`!wasCyclistVisibleLastRun`), indicating a new appearance.
        // 4. The cooldown period has passed since the last alert was triggered.
        const currentTime = Date.now();
        if (isCyclistAlertsEnabled && isCyclistVisibleThisRun && !wasCyclistVisibleLastRun) {
            if (currentTime - lastCyclistCheckTime > 2000) { // Enforce a 2-second cooldown to prevent rapid, annoying alerts.
                console.log(`[PPHelper v${SCRIPT_VERSION}] Cyclist has appeared! Playing sound.`);
                playAlertSound(); // Play the alert sound.
                lastCyclistCheckTime = currentTime; // Record the time of this alert.
            }
        }

        // Update the state variable for the next cycle to track visibility continuity.
        wasCyclistVisibleLastRun = isCyclistVisibleThisRun;
    }

    /**
     * Initializes the DOM observer and periodic checks to detect changes
     * and trigger styling updates efficiently.
     */
    function initializeCrimeObserver() {
        // Method 1: Intercept fetch requests for `crimesData`.
        // This is often the most reliable trigger as the game explicitly fetches this data when crime lists update.
        interceptFetch("torn.com", "/page.php?sid=crimesData", () => {
            console.log(`[PPHelper v${SCRIPT_VERSION}] Intercepted crimesData, scheduling style update.`);
            // Use setTimeout to allow the DOM to potentially update after fetch success before styling.
            // The debounced call prevents multiple rapid updates if multiple fetches occur.
            debouncedApplyAllStyling();
        });

        // Method 2: Use a MutationObserver to watch for changes in the DOM.
        // This catches dynamic content additions that might not directly correspond to a fetch call.
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            // Iterate through all mutations detected.
            mutations.forEach((mutation) => {
                // We are primarily interested in nodes that were added to the DOM.
                if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        // Check if the added node is an element and if it, or its descendants, contain elements relevant to the script.
                        if (node.nodeType === 1) { // nodeType 1 indicates an Element node.
                            // Heuristic check: if the node contains crime wrappers, relevant buttons, or the keyword 'cyclist',
                            // it's a strong indication that the crime list has been updated.
                            if (node.querySelector('div[class*="crimeOptionWrapper"]') ||
                                node.querySelector('button[aria-label="Pickpocket, 5 nerve"]') ||
                                node.textContent.toLowerCase().includes('cyclist')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                console.log(`[PPHelper v${SCRIPT_VERSION}] DOM mutation detected, scheduling style update.`);
                // Call the debounced version of applyAllStyling to prevent rapid, repeated executions.
                debouncedApplyAllStyling();
            }
        });

        // Start observing the entire document body for changes.
        // `childList: true` observes direct children, `subtree: true` observes all descendants.
        // This ensures comprehensive detection of dynamic content changes.
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            // characterData: true // Generally not needed unless text content changes directly without node replacement.
        });

        // Method 3: Periodic check as a fallback.
        // This serves as a safety net to ensure styling is applied even if observers somehow miss an update or if the page state doesn't trigger them.
        // It runs every 5 seconds.
        setInterval(() => {
            // Only perform the check if relevant elements are present on the page, to avoid unnecessary operations.
            if (document.querySelector('div[class*="crimeOptionWrapper"]')) {
                console.log(`[PPHelper v${SCRIPT_VERSION}] Periodic check triggered, applying styles.`);
                // Use the debounced function for the periodic check as well.
                debouncedApplyAllStyling();
            }
        }, 5000);
    }

    /**
     * Sets up the user interface elements (buttons) for controlling the script's features.
     * This function has been refactored to use vanilla JavaScript, removing the jQuery dependency.
     * The "Test Sound" button is repurposed to toggle the "Hide Police" functionality.
     */
    function setupInterface() {
        // Wait for the main container element of the pickpocketing section to ensure it has loaded.
        waitForElementToExist('.pickpocketing-root').then((pickpocketingRoot) => {
            // Prevent re-adding controls if they already exist (e.g., during rapid reloads or script updates).
            if (document.getElementById('pp-helper-controls')) return;

            // HTML structure for the control panel containing toggle buttons.
            // The 'Test Sound' button is repurposed for controlling the 'Hide Police' feature.
            const controlsContainerHTML = `
                <div id="pp-helper-controls" style="margin-bottom: 10px; display: flex; gap: 10px; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 5px;"> 
                    <button id="cyclist-toggle-btn" class="torn-btn" style="min-width: 120px;">Cyclist Alerts: ON</button>
                    <button id="colors-toggle-btn" class="torn-btn" style="min-width: 120px;">Risk Colors: ON</button>
                    <button id="police-hide-btn" class="torn-btn" style="background: #2196F3; color: white; min-width: 120px;">Hide Police: ON</button>
                </div>
            `;

            // Insert the HTML for the controls into the page using a native DOM method.
            pickpocketingRoot.insertAdjacentHTML('afterbegin', controlsContainerHTML);

            // Get references to the newly created buttons using native DOM methods.
            const cyclistBtn = document.getElementById('cyclist-toggle-btn');
            const colorsBtn = document.getElementById('colors-toggle-btn');
            // Renamed button for its new function
            const policeHideBtn = document.getElementById('police-hide-btn');

            /**
             * Updates the text and visual styling of the toggle buttons to accurately reflect their current enabled state.
             */
            function updateButtons() {
                // Update text content for cyclist alerts.
                cyclistBtn.textContent = `Cyclist Alerts: ${isCyclistAlertsEnabled ? 'ON' : 'OFF'}`;
                cyclistBtn.style.background = isCyclistAlertsEnabled ? '#4CAF50' : ''; // Green when ON.
                cyclistBtn.style.color = isCyclistAlertsEnabled ? 'white' : '';

                // Update text content for difficulty colors.
                colorsBtn.textContent = `Difficulty Colors: ${isDifficultyColorsEnabled ? 'ON' : 'OFF'}`;
                colorsBtn.style.background = isDifficultyColorsEnabled ? '#4CAF50' : ''; // Green when ON.
                colorsBtn.style.color = isDifficultyColorsEnabled ? 'white' : '';

                // Update text content and styling for the police hiding button.
                policeHideBtn.textContent = `Hide Police: ${isHidePoliceEnabled ? 'ON' : 'OFF'}`;
                policeHideBtn.style.background = isHidePoliceEnabled ? '#4CAF50' : ''; // Green when ON.
                policeHideBtn.style.color = isHidePoliceEnabled ? 'white' : '';
            }

            /**
             * Attempts to trigger a page refresh or directly re-applies styles.
             * This is useful to ensure that UI changes (like toggling features) are immediately visible.
             */
            function forceRefreshOrApplyStyles() {
                // Try to find and click the game's built-in refresh button for a natural refresh.
                // The selector for the refresh button might change with Torn updates.
                const refreshButton = document.querySelector('div[class*="refresh-icon_"]'); // Example selector.
                if (refreshButton) {
                    refreshButton.click();
                } else {
                    // If the refresh button is not found, directly re-apply all styles.
                    console.log(`[PPHelper v${SCRIPT_VERSION}] Refresh button not found, forcing style re-application.`);
                    // Use the debounced function for safety against rapid calls.
                    debouncedApplyAllStyling();
                }
            }

            // Add event listeners to the buttons for user interaction.
            cyclistBtn.addEventListener('click', () => {
                isCyclistAlertsEnabled = !isCyclistAlertsEnabled; // Toggle the cyclist alerts setting.
                updateButtons(); // Update the button's appearance.
                forceRefreshOrApplyStyles(); // Apply the new setting to the crime list.
            });

            colorsBtn.addEventListener('click', () => {
                isDifficultyColorsEnabled = !isDifficultyColorsEnabled; // Toggle the difficulty colors setting.
                updateButtons(); // Update the button's appearance.
                forceRefreshOrApplyStyles(); // Apply the new setting to the crime list.
            });

            // NEW EVENT LISTENER: Repurposed button toggles Police hiding.
            policeHideBtn.addEventListener('click', () => {
                isHidePoliceEnabled = !isHidePoliceEnabled; // Toggle the hide police setting.
                updateButtons(); // Update the button's appearance.
                // Re-applying styles will now hide/show the police officer based on the new setting.
                forceRefreshOrApplyStyles();
            });

            // Initialize the buttons' appearance based on current settings.
            updateButtons();

            // Apply styling to the crime list initially. A slight delay helps ensure the DOM is fully ready.
            setTimeout(debouncedApplyAllStyling, 500);
        });
    }

    // --- Script Entry Point ---
    console.log(`[PPHelper v${SCRIPT_VERSION}] Initializing...`);

    // Define the debounced styling function here so it's available globally within the script's scope.
    const debouncedApplyAllStyling = debounce(applyAllStyling, 200); // 200ms debounce delay.

    // Ensure the script logic executes only after the DOM is fully loaded and parsed.
    if (document.readyState === 'loading') {
        // If the document is still loading, wait for the 'DOMContentLoaded' event.
        document.addEventListener('DOMContentLoaded', () => {
            setupInterface(); // Set up the user interface controls.
            initializeCrimeObserver(); // Initialize the DOM observers and periodic checks.
        });
    } else {
        // If the document is already loaded (e.g., script injected after page load), proceed immediately.
        setupInterface();
        initializeCrimeObserver();
    }

    // Inject CSS for cyclist highlighting animation and smoother style transitions.
    const style = document.createElement('style');
    style.textContent = `
        /* Keyframes for the pulsating animation on cyclist highlights. */
        @keyframes cyclistPulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        /* Apply the animation to elements with the cyclist-highlight class. */
        .cyclist-highlight {
            animation: cyclistPulse 2s infinite;
        }

        /* Add smooth transitions to crime option wrappers for visual feedback when styles change. */
        div[class*="crimeOptionWrapper"] {
            transition: background-color 0.3s ease, border-left 0.3s ease, box-shadow 0.3s ease, display 0.1s ease-in-out; /* Added display transition for smoother hiding/showing */
        }

        /* Basic styling for control panel buttons to ensure consistency. */
        #pp-helper-controls button.torn-btn {
            cursor: pointer; /* Indicates the button is clickable. */
            padding: 6px 12px; /* Standard padding for buttons. */
            border-radius: 4px; /* Slightly rounded corners. */
            border: 1px solid #555; /* Default border. */
            background-color: #3a3a3a; /* Dark background, typical for Torn UI elements. */
            color: #eee; /* Light text color. */
            font-size: 0.9em; /* Readable font size. */
            display: inline-flex; /* Helps align content within the button. */
            align-items: center; /* Vertically center text. */
            justify-content: center; /* Horizontally center text. */
            flex-shrink: 0; /* Prevent buttons from shrinking, ensuring they stay in one row */
        }
        #pp-helper-controls button.torn-btn:hover {
            background-color: #555; /* Slightly lighter background on hover. */
        }
    `;
    document.head.appendChild(style);

    console.log(`[PPHelper v${SCRIPT_VERSION}] Script fully loaded and initialized.`);

})();
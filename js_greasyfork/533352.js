// ==UserScript==
// @name        Civitai Better Galleries: Larger Video/Image & Preload
// @namespace   Violentmonkey Scripts
// @match       *://*.civitai.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      rainlizard
// @license     MIT
// @description Hides UI elements when viewing galleries and attempts to preload upcoming videos/images by simulating key presses
// @downloadURL https://update.greasyfork.org/scripts/533352/Civitai%20Better%20Galleries%3A%20Larger%20VideoImage%20%20Preload.user.js
// @updateURL https://update.greasyfork.org/scripts/533352/Civitai%20Better%20Galleries%3A%20Larger%20VideoImage%20%20Preload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SELECTORS_TO_HIDE = [
        ".p-3.gap-8.justify-between.flex", // Original top bar
        ".flex.flex-col.gap-3.p-3",        // Container for reaction buttons
        // Target the main sidebar container using its specific width and layout classes
        ".\\@md\\:w-\\[450px\\].\\@md\\:min-w-\\[450px\\].flex-col"
    ];
    const SELECTOR_TO_HIDE_DURING_SIMULATION = ".flex.min-h-0.flex-1.items-stretch.justify-stretch"; // Main image/video container
    const TOGGLE_VISIBILITY_KEY = 'Backspace';
    const RIGHT_KEY = 'ArrowRight';
    const RIGHT_CODE = 'ArrowRight';
    const LEFT_KEY = 'ArrowLeft';
    const LEFT_CODE = 'ArrowLeft';
    const PRESS_COUNT = 3; // Number of times to press the first key in the sequence
    const DELAY_BETWEEN_PRESSES_MS = 0; // Delay between simulated keystrokes
    // --- End Configuration ---

    const HIDE_STYLE_ID = 'toggle-hide-elements-style-' + Math.random().toString(36).substring(7);
    const TEMP_HIDE_STYLE_ID = 'temp-hide-during-sim-style-' + Math.random().toString(36).substring(7); // ID for temporary style
    const TOGGLE_BUTTON_ID = 'civitai-toggle-ui-button-' + Math.random().toString(36).substring(7); // ID for the toggle button
    let isHidden = true; // Start hidden by default
    let styleElement = null;
    let tempHideStyleElement = null; // Style element for temporary hiding
    let isSimulating = false; // Flag to prevent rapid re-triggering
    let toggleButton = null; // Reference to the toggle button
    let urlObserver = null; // Observer for URL changes

    // URL pattern to match for showing the button
    const SHOW_BUTTON_URL_PATTERN = 'https://civitai.com/images/';

    // Combine selectors into a single CSS rule string for hiding
    const hideRule = `
        ${SELECTORS_TO_HIDE.join(',\n')} {
            display: none !important;
        }
    `;

    // CSS rule for temporarily hiding the main content
    const tempHideRule = `
        ${SELECTOR_TO_HIDE_DURING_SIMULATION} {
            opacity: 0 !important; /* Make transparent but keep interactable */
            pointer-events: none !important; /* Prevent accidental clicks on the invisible element */
        }
    `;

    // Style for the toggle button
    const buttonStyleRule = `
        #${TOGGLE_BUTTON_ID} {
            position: fixed;
            bottom: 10px; /* Changed from top */
            right: 10px;  /* Changed from left */
            z-index: 9999; /* Ensure it's on top */
            padding: 5px 10px;
            background-color: #4CAF50; /* Green */
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.7;
            transition: opacity 0.2s ease-in-out;
        }
        #${TOGGLE_BUTTON_ID}:hover {
            opacity: 1;
        }
    `;

    // Function to check the URL and show/hide the toggle button
    function checkUrlAndToggleButton() {
        if (!toggleButton) return; // Button not initialized yet

        const currentUrl = window.location.href;
        if (currentUrl.startsWith(SHOW_BUTTON_URL_PATTERN)) {
            // console.log("Civitai Script: URL matches, showing toggle button."); // Optional: for debugging
            toggleButton.style.display = 'block'; // Or 'inline-block' or '' depending on original display
        } else {
            // console.log("Civitai Script: URL does not match, hiding toggle button."); // Optional: for debugging
            toggleButton.style.display = 'none';
        }
    }

    // Function to update the style element based on the isHidden state
    function updateVisibilityStyle() {
        if (!styleElement) return;
        if (isHidden) {
            styleElement.textContent = hideRule;
            if (toggleButton) toggleButton.textContent = "Show UI"; // Update button text
            console.log("Civitai Script: Hiding elements.");
        } else {
            styleElement.textContent = '';
            if (toggleButton) toggleButton.textContent = "Hide UI"; // Update button text
            console.log("Civitai Script: Showing elements.");
        }
    }

    // Function to toggle the visibility state
    function toggleVisibility() {
        isHidden = !isHidden;
        updateVisibilityStyle();
    }

    // Function to simulate a specific key press
    function simulateKeyPress(key, code) {
        // console.log(`Civitai Script: Simulating '${key}'...`); // Very verbose at 1ms
        const keyEvent = new KeyboardEvent('keydown', {
            key: key,
            code: code,
            bubbles: true,
            cancelable: true,
        });
        document.body.dispatchEvent(keyEvent);
    }

    // Recursive function to simulate multiple key presses with delay
    function simulateMultipleKeyPresses(key, code, remainingCount, callback) {
        if (remainingCount <= 0) {
            if (callback) callback();
            return;
        }
        simulateKeyPress(key, code);
        setTimeout(() => {
            simulateMultipleKeyPresses(key, code, remainingCount - 1, callback);
        }, DELAY_BETWEEN_PRESSES_MS);
    }

    // Function to start the simulation sequence (N times first key, N-1 times second key)
    function startSimulationSequence(firstKey, firstCode, secondKey, secondCode, count) {
        if (isSimulating) {
            console.log("Civitai Script: Simulation already in progress, ignoring trigger.");
            return;
        }
        isSimulating = true;
        const secondCount = Math.max(0, count - 1);
        console.log(`Civitai Script: Starting simulation: ${count}x ${firstKey} -> ${secondCount}x ${secondKey}`);

        // Apply temporary hide style
        if (tempHideStyleElement) {
            tempHideStyleElement.textContent = tempHideRule;
            console.log("Civitai Script: Temporarily hiding main content.");
        }

        simulateMultipleKeyPresses(firstKey, firstCode, count, () => {
            console.log(`Civitai Script: Finished ${firstKey} sequence. Starting ${secondKey} sequence...`);
            simulateMultipleKeyPresses(secondKey, secondCode, secondCount, () => {
                console.log("Civitai Script: Simulation sequence finished.");
                 // Remove temporary hide style
                if (tempHideStyleElement) {
                    tempHideStyleElement.textContent = '';
                     console.log("Civitai Script: Restoring main content visibility.");
                }
                isSimulating = false;
            });
        });
    }

    // Function to handle the initial setup and potential simulation trigger
    function initialize() {
        console.log(`Civitai Script: Loading for ${window.location.href}`);
        console.log(`Civitai Script: Press '${TOGGLE_VISIBILITY_KEY}' or click the top-left button (if visible) to toggle UI visibility.`);
        console.log(`Civitai Script: Press '${RIGHT_KEY}' or '${LEFT_KEY}' to trigger ${PRESS_COUNT}/${PRESS_COUNT - 1} simulations and temporarily hide content.`);

        try {
            // Add styles for hiding/showing UI elements
            styleElement = GM_addStyle('');
            styleElement.id = HIDE_STYLE_ID;

            // Initialize the temporary style element (initially empty)
            tempHideStyleElement = GM_addStyle('');
            tempHideStyleElement.id = TEMP_HIDE_STYLE_ID;

            // Add style for the toggle button
            GM_addStyle(buttonStyleRule);

            // Create the toggle button
            toggleButton = document.createElement('button');
            toggleButton.id = TOGGLE_BUTTON_ID;
            toggleButton.textContent = isHidden ? "Show UI" : "Hide UI"; // Set initial text
            toggleButton.addEventListener('click', toggleVisibility);
            toggleButton.style.display = 'none'; // Initially hide the button
            document.body.appendChild(toggleButton);

            updateVisibilityStyle(); // Apply initial hidden state & set initial button text
            checkUrlAndToggleButton(); // Check URL and set initial button visibility

            // --- URL Change Monitoring ---

            // 1. Listen for browser back/forward navigation
            window.addEventListener('popstate', checkUrlAndToggleButton);

            // 2. Observe DOM changes (common in SPAs for navigation)
            urlObserver = new MutationObserver((mutations) => {
                // We don't need to inspect mutations, just re-check the URL
                // Add a small debounce/throttle if performance becomes an issue
                checkUrlAndToggleButton();
            });

            urlObserver.observe(document.body, {
                childList: true, // Detect when elements are added/removed from body
                subtree: true    // Detect changes within the body's descendants
                // We don't need 'attributes' or 'characterData' for typical SPA navigation detection
            });

            // --- End URL Change Monitoring ---

            console.log(`Civitai Script: Style elements, toggle button, and URL observer initialized.`);
        } catch (e) {
             console.error(`Civitai Script: Error initializing:`, e);
             // Clean up observer if initialization failed partway
             if (urlObserver) urlObserver.disconnect();
             window.removeEventListener('popstate', checkUrlAndToggleButton);
             return; // Don't proceed if setup fails
        }
    }

    // --- Event Listener ---
    document.addEventListener('keydown', function(event) {
         if (isSimulating) {
             if (event.key === TOGGLE_VISIBILITY_KEY) {
                 if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
                 const targetTagName = event.target.tagName.toUpperCase();
                 const isEditable = event.target.isContentEditable;
                 if (!(targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || targetTagName === 'SELECT' || isEditable)) {
                     toggleVisibility();
                 }
             }
            return;
        }

        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;

        const targetTagName = event.target.tagName.toUpperCase();
        const isEditable = event.target.isContentEditable;
        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || targetTagName === 'SELECT' || isEditable) {
             if (event.key === TOGGLE_VISIBILITY_KEY || event.key === RIGHT_KEY || event.key === LEFT_KEY) {
                 console.log(`Civitai Script: Key '${event.key}' pressed in editable field, ignoring.`);
             }
            return;
        }

        if (event.key === TOGGLE_VISIBILITY_KEY) {
            toggleVisibility();
        }
        else if (event.key === RIGHT_KEY) {
            event.preventDefault();
            event.stopPropagation();
            startSimulationSequence(RIGHT_KEY, RIGHT_CODE, LEFT_KEY, LEFT_CODE, PRESS_COUNT);
        }
        else if (event.key === LEFT_KEY) {
            event.preventDefault();
            event.stopPropagation();
            startSimulationSequence(LEFT_KEY, LEFT_CODE, RIGHT_KEY, RIGHT_CODE, PRESS_COUNT);
        }

    }, true);
    // --- End Event Listener ---

    // --- Run Initialization ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize(); // DOM is already ready
    }
    // --- End Run Initialization ---

})();
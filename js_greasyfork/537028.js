// ==UserScript==
// @name         Drawaria Canvas Expander Toggle
// @namespace    http://tampermonkey.net/
// @version      2025-05-23.3 // Incremented version to reflect this crucial fix
// @description  Adds a toggle menu to expand/collapse the drawing canvas on Drawaria.online by hiding/showing side panels, and expands the canvas.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537028/Drawaria%20Canvas%20Expander%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/537028/Drawaria%20Canvas%20Expander%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LS_KEY = 'drawaria_expand_canvas_v2'; // localStorage key for state persistence

    // --- Helper function to apply/remove canvas expansion styles ---
    function setCanvasExpanded(isExpanded) {
        const leftbar = document.getElementById('leftbar');
        const rightbar = document.getElementById('rightbar');
        const canvas = document.getElementById('canvas'); // The actual canvas element

        // Ensure main game elements are present before attempting modifications
        if (!leftbar || !rightbar || !canvas) {
            console.warn("Drawaria core elements (leftbar, rightbar, canvas) not found for expansion/collapse. Will re-attempt when elements are ready.");
            return false; // Indicate that elements were not ready
        }

        if (isExpanded) {
            // Apply styles to hide panels
            leftbar.style.display = 'none';
            rightbar.style.display = 'none';

            // Make the canvas element expand to fill the available flex space
            canvas.style.flexGrow = '1';
            canvas.style.width = 'auto'; // Important for flex items to allow growth
            console.log("Canvas expanded.");
        } else {
            // Restore original styles by clearing inline styles
            leftbar.style.display = '';
            rightbar.style.display = '';

            // Remove flex-grow and width to restore original canvas size
            canvas.style.flexGrow = '';
            canvas.style.width = '';
            console.log("Canvas collapsed.");
        }

        // Trigger a window resize event. This is crucial for Drawaria to re-render
        // its canvas based on the new available space.
        window.dispatchEvent(new Event('resize'));
        localStorage.setItem(LS_KEY, isExpanded ? 'true' : 'false'); // Save state
        return true; // Indicate successful application
    }

    // --- Inject custom UI (Button and Menu) and its CSS ---
    function injectUI() {
        // Inject CSS for the custom UI elements to make them look integrated
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #drawaria-custom-menu-container {
                position: absolute;
                top: 5px; /* Position from the top of the viewport */
                right: 180px; /* Adjust this value to place it appropriately relative to other top-right elements */
                z-index: 10000; /* Ensure it's on top of other elements */
                font-family: 'Open Sans', Arial, sans-serif; /* Try to match Drawaria's font */
                color: #333;
            }

            #drawaria-menu-toggle-button {
                background-color: #f1f9f5; /* Light background, similar to Drawaria's panels */
                border: 1px solid #b0b5b9; /* Soft border */
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px; /* Space between icon and text */
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Subtle shadow */
                transition: background-color 0.2s ease; /* Smooth hover effect */
                white-space: nowrap; /* Prevent text wrapping */
            }

            #drawaria-menu-toggle-button:hover {
                background-color: #e0e0e0; /* Slightly darker on hover */
            }

            #drawaria-menu-toggle-button span {
                font-size: 16px; /* Icon size */
            }

            #drawaria-menu-content {
                display: none; /* Hidden by default */
                position: absolute;
                background-color: #f1f9f5;
                border: 1px solid #b0b5b9;
                border-radius: 5px;
                padding: 10px;
                top: 40px; /* Position just below the toggle button */
                right: 0;
                min-width: 180px; /* Ensure enough width for text */
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }

            #drawaria-menu-content.visible {
                display: block; /* Make visible when 'visible' class is added */
            }

            #drawaria-menu-content label {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 0; /* No extra margin if only one item */
            }

            #drawaria-menu-content input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2); /* Make checkbox slightly larger for easier clicking */
            }
        `;
        document.head.appendChild(style); // Add CSS to the document's head

        // Inject HTML for the button and menu into the body
        const uiHtml = `
            <div id="drawaria-custom-menu-container">
                <button id="drawaria-menu-toggle-button" title="Toggle Canvas Expansion">
                    <span>🖼️</span> Canvas Options
                </button>
                <div id="drawaria-menu-content">
                    <label>
                        <input type="checkbox" id="expandCanvasCheckbox"> Expand Drawing Area
                    </label>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHtml); // Insert at the end of the body

        // --- Get references to the injected UI elements ---
        const menuContainer = document.getElementById('drawaria-custom-menu-container');
        const toggleButton = document.getElementById('drawaria-menu-toggle-button');
        const menuContent = document.getElementById('drawaria-menu-content');
        const expandCanvasCheckbox = document.getElementById('expandCanvasCheckbox');

        if (!menuContainer || !toggleButton || !menuContent || !expandCanvasCheckbox) {
            console.error("Failed to find Drawaria custom UI elements after injection.");
            return;
        }

        // --- Add Event Listeners ---
        // Toggle the visibility of the menu content when the button is clicked
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click listener from immediately closing it
            menuContent.classList.toggle('visible');
        });

        // Hide the menu when a click occurs outside of it
        document.addEventListener('click', (event) => {
            if (!menuContainer.contains(event.target)) {
                menuContent.classList.remove('visible');
            }
        });

        // Listen for changes on the "Expand Canvas" checkbox
        expandCanvasCheckbox.addEventListener('change', () => {
            setCanvasExpanded(expandCanvasCheckbox.checked);
        });

        // --- Initialize state from localStorage and apply when game is ready ---
        const storedState = localStorage.getItem(LS_KEY);
        const initialState = storedState === 'true';

        expandCanvasCheckbox.checked = initialState; // Set checkbox state visually

        // Use a MutationObserver to wait for the #main element to become visible,
        // which indicates the game content (leftbar, rightbar, canvas) is ready.
        const observer = new MutationObserver((mutationsList, observerInstance) => {
            const mainDiv = document.getElementById('main');
            // Check if mainDiv exists and its display style is not 'none'
            if (mainDiv && mainDiv.style.display !== 'none') {
                console.log("#main element became visible. Attempting to apply initial canvas state.");
                // Attempt to apply the state. setCanvasExpanded will internally check for sub-elements.
                if (setCanvasExpanded(initialState)) { // Only disconnect if successful
                    observerInstance.disconnect(); // Disconnect observer once the state is applied successfully
                }
                // If setCanvasExpanded returns false (elements not ready), the observer will continue
                // watching for other changes, which might involve the elements becoming available.
            }
        });

        // Start observing the document body for changes, looking for #main to become visible.
        // A small delay helps ensure this observer setup runs slightly after initial DOM render
        // to avoid conflicts or race conditions with the page's own JS.
        setTimeout(() => {
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
            // Also, make an immediate check in case the main content is already loaded/visible
            const mainDiv = document.getElementById('main');
            if (mainDiv && mainDiv.style.display !== 'none') {
                console.log("Immediate check: #main already visible. Attempting to apply initial canvas state.");
                if (setCanvasExpanded(initialState)) {
                     observer.disconnect();
                }
            }
        }, 500); // Wait 500ms before starting observation

        // Fallback for window.load just in case, this could also apply the state if observers somehow missed it.
        window.addEventListener('load', () => {
            const mainDiv = document.getElementById('main');
            if (mainDiv && mainDiv.style.display !== 'none') {
                console.log("Window loaded and #main is visible (fallback). Applying initial canvas state.");
                setCanvasExpanded(initialState);
                observer.disconnect(); // Ensure observer is stopped if fallback works
            }
        });
    }

    // Execute the UI injection function once the DOM is ready (or shortly after)
    // Using DOMContentLoaded for quicker UI appearance, but the core canvas expansion
    // logic will wait for the game's #main div to be truly ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }

})();
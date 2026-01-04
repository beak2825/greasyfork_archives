// ==UserScript==
// @name         Review Skip
// @namespace    https://greasyfork.org/en/users/1291009
// @version      2.5
// @description  Clicks the "Skip" button every time it appears
// @author       BadOrBest
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://admin192c.acellus.com/student/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_disable
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496612/Review%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/496612/Review%20Skip.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isEnabled = false; // Flag to track script enable/disable
    let debounceTimer; // Timer for debouncing continuous clicking
    let reloadOnDisable = GM_getValue('reloadOnDisable', false); // Get the reload option state

    // Inject CSS for animations
    const style = document.createElement('style');
    style.innerHTML = `
        /* Toggle button animation */
        .toggle-button {
            transition: background-color 0.3s ease, transform 0.2s ease-in-out, opacity 0.5s ease-in-out;
        }

        /* Toggle button hover animation */
        .toggle-button:hover {
            transform: scale(1.1);
            background-color: #17a2b8; /* Change to a teal color on hover */
        }

        /* Collapse button rotation animation */
        .collapsible-button {
            transition: transform 0.3s ease-in-out;
        }

        /* Rotation when expanded */
        .collapsible-expanded {
            transform: rotate(180deg); /* Rotate the arrow when collapsed */
        }

        /* Fade in/out animation for hiding/showing elements */
        .fade {
            transition: opacity 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Function to click the "Skip" button
    function clickSkipButton(skipElement) {
        try {
            if (skipElement) {
                skipElement.click();
            }
        } catch (error) {
            console.error('Error clicking skip button:', error);
        }
    }

    // Function to handle mutations
    function handleMutations(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const newSkipElements = Array.from(mutation.addedNodes).filter(node => node.textContent.trim() === 'Skip');
                if (newSkipElements.length > 0) {
                    if (isEnabled) {
                        newSkipElements.forEach(newSkipElement => clickSkipButton(newSkipElement));
                    }
                }
            }
        }
    }

    // Function to continuously click the "Skip" button with debouncing
    function clickSkipButtonContinuously() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const skipSpans = Array.from(document.querySelectorAll('span')).filter(span => span.textContent.trim() === 'Skip');
            if (isEnabled) {
                skipSpans.forEach(span => clickSkipButton(span));
            }
        }, 500);
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Function to toggle script enable/disable
    function toggleScript() {
        isEnabled = !isEnabled;
        if (isEnabled) {
            toggleButton.textContent = 'Review Skip ON';
            toggleButton.classList.remove('script-off');
            toggleButton.classList.add('script-on');
            toggleButton.style.backgroundColor = '#28a745'; // Green color for ON state
        } else {
            toggleButton.textContent = 'Review Skip OFF';
            toggleButton.classList.remove('script-on');
            toggleButton.classList.add('script-off');
            toggleButton.style.backgroundColor = '#dc3545'; // Red color for OFF state

            if (reloadOnDisable) {
                location.reload(); // Reload the page if the option is ON
            }
        }
        adjustCollapsibleButtonPosition();
    }

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Review Skip OFF'; // Initial text
    toggleButton.classList.add('toggle-button', 'script-off'); // Initial class for style
    toggleButton.addEventListener('click', toggleScript);

    // Style the toggle button
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.left = '20px';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.borderRadius = '30px'; // Make it round
    toggleButton.style.backgroundColor = '#dc3545'; // Red color for OFF state
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontFamily = 'Arial, sans-serif'; // Bubble-like font
    toggleButton.style.fontWeight = 'bold'; // Bold text
    toggleButton.style.fontStyle = 'italic'; // Italicized text
    toggleButton.style.fontSize = '14px'; // Adjust font size as needed
    toggleButton.style.zIndex = '9998'; // Ensure it's above other elements

    document.body.appendChild(toggleButton);

    // Create the collapsible button
    const collapsibleButton = document.createElement('button');
    collapsibleButton.innerHTML = '&#x25B2;'; // Downwards arrow initially
    collapsibleButton.classList.add('collapsible-button');
    collapsibleButton.style.position = 'fixed';
    collapsibleButton.style.bottom = '80px'; // Default bottom position when collapsed
    collapsibleButton.style.left = '10px'; // Default left position
    collapsibleButton.style.padding = '5px';
    collapsibleButton.style.backgroundColor = 'transparent'; // No need to set initial background color
    collapsibleButton.style.color = '#fff';
    collapsibleButton.style.border = 'none';
    collapsibleButton.style.cursor = 'pointer';
    collapsibleButton.style.borderRadius = '50%'; // Round shape
    collapsibleButton.style.zIndex = '9999'; // Ensure it's above other elements

    // Function to toggle visibility of the main toggle button
    collapsibleButton.addEventListener('click', function() {
        toggleButton.classList.toggle('fade');
        toggleButton.style.opacity = toggleButton.style.opacity === '0' ? '1' : '0'; // Fading in/out animation
        collapsibleButton.classList.toggle('collapsible-expanded'); // Rotate the arrow
        adjustCollapsibleButtonPosition();
    });
    document.body.appendChild(collapsibleButton);

    setInterval(clickSkipButtonContinuously, 1000);

    function adjustCollapsibleButtonPosition() {
        if (toggleButton.style.opacity !== '0') {
            collapsibleButton.innerHTML = '&#x25BC;'; // Downwards arrow when expanded
            collapsibleButton.style.backgroundColor = 'transparent'; // Set back to transparent when expanded
            const rect = toggleButton.getBoundingClientRect();
            collapsibleButton.style.top = rect.top + 'px';
            collapsibleButton.style.left = rect.left + 'px';
        } else {
            collapsibleButton.innerHTML = '&#x25BC;'; // Upwards arrow when collapsed
            collapsibleButton.style.backgroundColor = 'black'; // Change background color when collapsed
            collapsibleButton.style.top = 'auto';
            collapsibleButton.style.bottom = '20px';
            collapsibleButton.style.left = '10px';
        }
    }

    adjustCollapsibleButtonPosition();

    // Add Tampermonkey menu commands
    GM.registerMenuCommand("Toggle Reloading When OFF (Current: " + (reloadOnDisable ? "ON" : "OFF") + ")", function() {
        reloadOnDisable = !reloadOnDisable;
        GM_setValue('reloadOnDisable', reloadOnDisable);
        alert("Reloading Acellus is now " + (reloadOnDisable ? "ON" : "OFF"));
    });
})();

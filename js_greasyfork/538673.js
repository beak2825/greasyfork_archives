// ==UserScript==
// @name         Stripchat VR Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters VR models on Stripchat
// @author       Sergi0
// @match        https://*.stripchat.com/*
// @grant        GM_addStyle
// @icon         https://stripchat.com/favicon.ico
// @license      MIT
// @run-at       document-idle
// @homepageURL  https://greasyfork.org/es/scripts/538673-stripchat-vr-filter
// @supportURL   https://greasyfork.org/es/scripts/538673-stripchat-vr-filter/feedback

// @downloadURL https://update.greasyfork.org/scripts/538673/Stripchat%20VR%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/538673/Stripchat%20VR%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let vrFilterEnabled = false;
    let observer = null;
    let currentPageUrl = window.location.href;

    // Function to apply the VR filter
    function applyVrFilter() {
        const models = document.querySelectorAll('.model-list-item');
        models.forEach(model => {
            const vrBadge = model.querySelector('span[class*="ModelListItemBadge__vr"]');
            const hasVrBadge = !!vrBadge;

            if (vrFilterEnabled) {
                if (hasVrBadge) {
                    // Show VR models
                    model.style.setProperty('display', 'block', 'important');
                } else {
                    // Hide non-VR models
                    model.style.setProperty('display', 'none', 'important');
                }
            } else {
                // If filter is disabled, show all models
                model.style.setProperty('display', 'block', 'important'); // Ensure all models are visible
            }
        });
    }

    // Function to create and add the toggle to the DOM
    function addVrToggleButton() {
        const existingToggle = document.getElementById('vrFilterToggleContainer');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'vrFilterToggleContainer';
        toggleContainer.style.position = 'fixed';
        toggleContainer.style.bottom = '10px';
        toggleContainer.style.right = '10px';
        toggleContainer.style.zIndex = '9999';
        toggleContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toggleContainer.style.color = 'white';
        toggleContainer.style.padding = '10px 15px';
        toggleContainer.style.borderRadius = '5px';
        toggleContainer.style.fontFamily = 'Arial, sans-serif';
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.gap = '10px';
        toggleContainer.style.cursor = 'pointer';

        const label = document.createElement('span');
        label.textContent = 'Show VR Models Only';
        label.style.marginRight = '10px';
        label.style.whiteSpace = 'nowrap';

        const slider = document.createElement('label');
        slider.className = 'switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'vrFilterCheckbox';
        input.checked = vrFilterEnabled;

        input.addEventListener('change', (event) => {
            vrFilterEnabled = event.target.checked;
            applyVrFilter();
            localStorage.setItem('vrFilterEnabled', vrFilterEnabled);
        });

        const spanSlider = document.createElement('span');
        spanSlider.className = 'slider round';

        slider.appendChild(input);
        slider.appendChild(spanSlider);

        toggleContainer.appendChild(label);
        toggleContainer.appendChild(slider);

        document.body.appendChild(toggleContainer);
    }

    // Add styles for the toggle
    GM_addStyle(`
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(16px);
            -ms-transform: translateX(16px);
            transform: translateX(16px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 24px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    `);

    // Mutation Observer to detect DOM changes and URL changes
    function startObserver() {
        if (observer) {
            observer.disconnect();
        }

        const targetNode = document.querySelector('.js-list-content') || document.body;

        observer = new MutationObserver(function(mutations) {
            let modelsChangeDetected = false;
            let urlChanged = (window.location.href !== currentPageUrl);

            // Check for added nodes that are model-list-item or contain them
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Check if the added node itself is a model-list-item or contains one
                                if (node.classList.contains('model-list-item') || node.querySelector('.model-list-item')) {
                                    modelsChangeDetected = true;
                                    break;
                                }
                            }
                        }
                    }
                    // Also check if existing model-list-items had their 'style' or 'class' attributes changed.
                    // This is less common for "showing/hiding" issues, but good for robustness.
                } else if (mutation.type === 'attributes' && mutation.target.classList.contains('model-list-item')) {
                    modelsChangeDetected = true;
                }

                if (modelsChangeDetected) break;
            }

            // If URL changed, re-initialize everything (likely a new page load)
            if (urlChanged) {
                currentPageUrl = window.location.href;
                console.log('URL changed, re-initializing script.'); // Debug
                initializeScript();
            } else if (modelsChangeDetected) {
                // If models were added/changed (e.g., infinite scroll or dynamic update), apply filter
                console.log('Models changed, applying filter.'); // Debug
                setTimeout(applyVrFilter, 100); // Increased delay slightly
            }
        });

        // Observe changes on the targetNode: child additions/removals and attribute changes
        // Use subtree: true for deep observation
        observer.observe(targetNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }

    // Initialize the script
    function initializeScript() {
        const savedState = localStorage.getItem('vrFilterEnabled');
        if (savedState !== null) {
            vrFilterEnabled = savedState === 'true';
        } else {
            vrFilterEnabled = false; // Filter is OFF by default
        }

        addVrToggleButton();
        // Apply filter after a slightly longer delay on initial load/re-init
        setTimeout(applyVrFilter, 200); // Increased initial delay
        startObserver();
    }

    // Execute initialization when the DOM is fully loaded, with an initial delay
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initializeScript, 200));
    } else {
        setTimeout(initializeScript, 200);
    }

    // Listen for SPA navigation events
    window.addEventListener('popstate', () => {
        console.log('Popstate event detected, re-initializing script.'); // Debug
        setTimeout(initializeScript, 200);
    });
    window.addEventListener('hashchange', () => {
        console.log('Hashchange event detected, re-initializing script.'); // Debug
        setTimeout(initializeScript, 200);
    });

    // Also consider using a custom event listener if Stripchat dispatches one
    // when content is fully loaded after an SPA navigation. This is site-specific.
    // For now, the combination of URL changes and MutationObserver should cover most cases.

})();
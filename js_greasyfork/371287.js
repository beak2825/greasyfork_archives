// ==UserScript==
// @name         Youtube Video hider (to only listen to audio)
// @description  A userscript that hides most of the video content on youtube, so you can listen rather than watch!
// @grant       none
// @version     2.0
// @author      DJ Panaflex
// @description 10/7/2024, 11:33:35 AM
// @include     http://*youtube.*/*watch*
// @include     https://*youtube.*/*watch*
// @include     https://*youtube.*/embed*
// @include     //*youtube.*/embed*
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-end
// @namespace https://greasyfork.org/users/44041
// @downloadURL https://update.greasyfork.org/scripts/371287/Youtube%20Video%20hider%20%28to%20only%20listen%20to%20audio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371287/Youtube%20Video%20hider%20%28to%20only%20listen%20to%20audio%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // === Configuration ===

    // Selectors for elements to hide
    const selectorsToHide = [
        'video', // All <video> elements
        '.ytp-cued-thumbnail-overlay', // YouTube's thumbnail overlay
        '.video-overlay', // Example: Another overlay class (add as needed)
        // Add more selectors here if there are other overlay elements you want to hide
    ];

    // Selector for the <h1> element where the checkbox will be appended
    const targetH1Selector = 'h1.style-scope.ytd-watch-metadata';

    // Storage key for checkbox state
    const storageKey = 'hideVideosAndOverlays';

    // === Functions ===

    /**
     * Hide all specified elements.
     */
    function hideElements() {
        selectorsToHide.forEach(selector => {
            $(selector).hide();
            console.log(`Hidden elements with selector: ${selector}`);
        });
    }

    /**
     * Show all specified elements.
     */
    function showElements() {
        selectorsToHide.forEach(selector => {
            $(selector).show();
            console.log(`Shown elements with selector: ${selector}`);
        });
    }

    /**
     * Toggle visibility based on the checkbox state.
     * @param {boolean} hide - Whether to hide or show elements.
     */
    function toggleVisibility(hide) {
        if (hide) {
            hideElements();
        } else {
            showElements();
        }
    }

    /**
     * Initialize the checkbox and its event listener.
     * @param {jQuery} $h1 - The jQuery object of the target <h1> element.
     */
    function initializeCheckbox($h1) {
        // Check if the checkbox already exists to prevent duplication
        if ($h1.find('#toggleHideVideosCheckbox').length > 0) {
            return;
        }

        // Create the checkbox element
        const $checkbox = $('<input>', {
            type: 'checkbox',
            id: 'toggleHideVideosCheckbox',
            style: 'margin-left: 10px; cursor: pointer;',
            checked: true // Checked by default
        });

        // Create the label element (omitted as per requirement)

        // Append checkbox to the <h1> element
        $h1.append($checkbox);

        // Apply initial visibility based on the stored state or default to hidden
        const storedState = localStorage.getItem(storageKey);
        const isChecked = storedState !== null ? (storedState === 'true') : true; // Default to true
        $checkbox.prop('checked', isChecked);
        toggleVisibility(isChecked);

        // Event listener for checkbox state change
        $checkbox.on('change', function() {
            const hide = $(this).is(':checked');
            toggleVisibility(hide);
            // Store the state in localStorage
            localStorage.setItem(storageKey, hide);
        });

        console.log('Checkbox to toggle video and overlay visibility has been added.');
    }

    /**
     * Observe the DOM for changes to dynamically handle new content.
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Handle added nodes
                mutation.addedNodes.forEach((node) => {
                    const $node = $(node);
                    // If the target <h1> is added, initialize the checkbox
                    if ($node.is(targetH1Selector)) {
                        initializeCheckbox($node);
                    }
                    // If the target <h1> is nested within the added node
                    else if ($node.find(targetH1Selector).length > 0) {
                        initializeCheckbox($node.find(targetH1Selector));
                    }

                    // Optionally, hide any new elements that match the selectors
                    selectorsToHide.forEach(selector => {
                        if ($node.is(selector)) {
                            $node.hide();
                            console.log(`Hidden newly added element with selector: ${selector}`);
                        }
                        $node.find(selector).hide();
                        if ($node.find(selector).length > 0) {
                            console.log(`Hidden newly added elements matching selector: ${selector}`);
                        }
                    });
                });

                // Handle removed nodes if necessary
                // (Not required for hiding/showing elements)
            });
        });

        // Configuration for the observer
        const config = { childList: true, subtree: true };

        // Start observing the document body
        observer.observe(document.body, config);

        console.log('MutationObserver has been set up to monitor DOM changes.');
    }

    /**
     * Main initialization function.
     */
    function init() {
        // Find all existing target <h1> elements and initialize the checkbox
        $(targetH1Selector).each(function() {
            initializeCheckbox($(this));
        });

        // Set up DOM mutation observer
        observeDOMChanges();
    }

    // === Run the Script ===

    $(document).ready(function() {
        init();
    });

})(jQuery);
// ==UserScript==
// @name          CIJ subtitle scroll into view
// @namespace     http://tampermonkey.net/
// @version       0.0.3
// @description   make the subtitle in transcript scrolled into viewport
// @author        Sapjax
// @license MIT
// @match         https://cijapanese.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=cijapanese.com
// @grant         none
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/544789/CIJ%20subtitle%20scroll%20into%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/544789/CIJ%20subtitle%20scroll%20into%20view.meta.js
// ==/UserScript==


(function() {
    // The selector for the main container.
    const transcriptSelector = '.transcript';
    // The selector for the button inside the container.
    const buttonSelector = '.btn-ghost-yellow';

    /**
 * Scrolls the button into view within its container, without affecting the page scroll.
 * @param {HTMLElement} transcriptElement The scrollable container.
 * @param {HTMLElement} buttonElement The button element to scroll.
 */
    function scrollButtonToTop(transcriptElement, buttonElement) {
        if (transcriptElement && buttonElement) {
            const transcriptRect = transcriptElement.getBoundingClientRect();
            const buttonRect = buttonElement.getBoundingClientRect();
            const scrollMargin = 20

            // Calculate the new scroll position.
            // The scroll position is the button's position relative to the container's top edge,
            // plus the container's current scroll position.
            const newScrollTop = buttonRect.top - transcriptRect.top + transcriptElement.scrollTop - scrollMargin;

            // Smoothly scroll the container to the new position.
            transcriptElement.scrollTo({
                top: newScrollTop,
                behavior: 'smooth'
            });
            console.log("Button element appeared or changed. Scrolling it to the top of the container.");
        }
    }

    /**
 * Creates and starts a MutationObserver to watch the transcript container for changes.
 * This function will be called once the transcript container is found.
 * @param {HTMLElement} transcriptElement The transcript container to observe.
 */
    function observeTranscriptForButtonChanges(transcriptElement) {
        const buttonObserver = new MutationObserver((mutationsList, obs) => {
            // We only need to check for a new button if the DOM structure changed.
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const currentButton = transcriptElement.querySelector(buttonSelector);
                    if (currentButton) {
                        scrollButtonToTop(transcriptElement, currentButton);
                        return;
                    }
                }
            }
        });

        const config = {
            childList: true, // Watch for additions and removals of children.
            subtree: true    // Watch all descendants.
        };

        buttonObserver.observe(transcriptElement, config);
        console.log("Started observing the '.transcript' container for button changes.");
    }

    /**
 * Initializes the entire process: checks for the transcript, applies styles,
 * and sets up the observer for the button.
 */
    function initialize() {
        let transcriptElement = document.querySelector(transcriptSelector);

        if (!transcriptElement) {
            // If the transcript element is not yet in the DOM, watch for it.
            const mainObserver = new MutationObserver((mutationsList, obs) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        transcriptElement = document.querySelector(transcriptSelector);
                        if (transcriptElement) {
                            console.log("'.transcript' container has appeared. Applying styles.");
                            transcriptElement.style.maxHeight = '600px';
                            transcriptElement.style.overflow = 'auto';

                            const initialButton = transcriptElement.querySelector(buttonSelector);
                            if (initialButton) {
                                scrollButtonToTop(transcriptElement, initialButton);
                            }

                            observeTranscriptForButtonChanges(transcriptElement);
                            return;
                        }
                    }
                }
            });

            mainObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log("Waiting for '.transcript' container to appear.");

        } else {
            // If the transcript element already exists, apply styles and proceed.
            console.log("'.transcript' container already exists. Applying styles.");
            transcriptElement.style.maxHeight = '600px';
            transcriptElement.style.overflow = 'auto';


            observeTranscriptForButtonChanges(transcriptElement);
        }
    }

    // Start the process.
    initialize();

})();
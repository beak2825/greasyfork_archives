// ==UserScript==
// @name         8chan Soundpost Player
// @namespace    sneed
// @version      1.4
// @description  Automatically expands/collapses linked audio when expanding/collapsing an image/video with [sound=audio.ext] in the filename on 8chan.moe/.se
// @author       Gemini 2.5
// @license      MIT
// @match        https://8chan.moe/*/res/*.html*
// @match        https://8chan.se/*/res/*.html*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533269/8chan%20Soundpost%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/533269/8chan%20Soundpost%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("8chan Soundpost Player: Script Loaded");

    // --- Configuration ---
    const DEBUG = false; // Set to true for detailed console logs

    // --- Core Logic ---

    // Function to extract the sound filename from the [sound=...] tag
    function getSoundFilename(filename) {
        if (!filename) return null;
        const match = filename.match(/\[sound=([^\]]+?)]/i);
        return match ? match[1] : null;
    }

    // Function to find the sibling audio figure element
    function findAudioFigure(triggerFigure, audioFilename) {
        const uploadsContainer = triggerFigure.closest('.panelUploads');
        if (!uploadsContainer || !audioFilename) return null;

        const figures = uploadsContainer.querySelectorAll('figure.uploadCell');
        for (const figure of figures) {
            if (figure === triggerFigure) continue; // Don't check the trigger figure itself

            const originalNameLink = figure.querySelector('a.originalNameLink');
            if (originalNameLink && originalNameLink.download === audioFilename) {
                // Check if it's actually an audio file by mime type
                // Note: the mime type check is on the a.imgLink which is present even for audio thumbs
                const imgLink = figure.querySelector('a.imgLink');
                 if (imgLink && imgLink.dataset.filemime && imgLink.dataset.filemime.startsWith('audio/')) {
                    if (DEBUG) console.log(`Found matching audio figure for ${audioFilename}`, figure);
                    return figure;
                } else {
                     if (DEBUG) console.log(`Found figure matching download name ${audioFilename}, but mime type is not audio: ${imgLink?.dataset?.filemime}`, figure);
                }
            }
        }
        if (DEBUG) console.log(`No matching audio figure found for ${audioFilename} in container`, uploadsContainer);
        return null;
    }

    // Function to clean up duplicate hideLink elements, keeping the LAST one
    function cleanupDuplicateHideLinks(audioFigure) {
        if (!audioFigure) return;

        const hideLinks = audioFigure.querySelectorAll('a.hideLink');
        if (hideLinks.length > 1) {
            if (DEBUG) console.log(`Found ${hideLinks.length} hideLink elements in audio figure, cleaning up (keeping last one)...`, audioFigure);
            // Keep the last one, remove the rest
            // Iterate from the first up to the second-to-last
            for (let i = 0; i < hideLinks.length - 1; i++) {
                 if (DEBUG) console.log("Removing duplicate hideLink:", hideLinks[i]);
                hideLinks[i].remove();
            }
            if (DEBUG) console.log(`Cleaned up duplicate hideLink elements, ${audioFigure.querySelectorAll('a.hideLink').length} remaining (should be 1).`);
        } else {
            if (DEBUG) console.log(`No duplicate hideLink elements found or only one (${hideLinks.length}) in audio figure.`, audioFigure);
        }
    }


    // Function to trigger the expansion of the audio file
    function expandAudio(audioFigure) {
        if (!audioFigure || audioFigure.classList.contains('expandedCell')) {
            if (DEBUG && audioFigure) console.log("Audio figure already expanded or null, skipping expansion click.", audioFigure);
             // Still perform cleanup just in case a hideLink got added mysteriously or display is wrong
             // Cleanup should now keep the LAST one, which the site might manage
             cleanupDuplicateHideLinks(audioFigure);
            return;
        }

        const audioImgLink = audioFigure.querySelector('a.imgLink');
        if (audioImgLink) {
             // Use a slight delay to ensure it happens after the image expansion logic might fully settle
             // and to avoid potential race conditions if the site's JS is complex.
            setTimeout(() => {
                if (DEBUG) console.log("Clicking audio imgLink to expand:", audioImgLink);
                audioImgLink.click();
                if (DEBUG) console.log("Clicked audio imgLink for expansion:", audioFigure.querySelector('a.originalNameLink')?.download);
                // Clean up duplicates AFTER clicking, as the click might trigger the addition
                // Keeping the last one should allow the site's JS to manage its display state
                cleanupDuplicateHideLinks(audioFigure);
            }, 50); // 50ms delay, adjust if needed
        } else {
            if (DEBUG) console.log("Could not find audio imgLink to click for expansion in:", audioFigure);
            // Still perform cleanup just in case
            cleanupDuplicateHideLinks(audioFigure);
        }
    }

    // Function to trigger the collapse of the audio file
    function collapseAudio(audioFigure) {
        if (!audioFigure || !audioFigure.classList.contains('expandedCell')) {
            if (DEBUG && audioFigure) console.log("Audio figure already collapsed or null, skipping collapse action.", audioFigure);
            // Still perform cleanup just in case
             cleanupDuplicateHideLinks(audioFigure);
            return;
        }

        // Find the specific collapse button ([ - ]) if it exists
        // After cleanup (which keeps the last), there should be only one.
        // We can just target that one.
        const hideLink = audioFigure.querySelector('a.hideLink');

        if (hideLink) {
             // Use a slight delay similar to expansion
             setTimeout(() => {
                if (DEBUG) console.log("Clicking audio hideLink to collapse:", hideLink);
                hideLink.click();
                if (DEBUG) console.log("Clicked audio hideLink for collapse:", audioFigure.querySelector('a.originalNameLink')?.download);
                // Clean up duplicates AFTER clicking, as the click might trigger the addition
                // Keeping the last one should allow the site's JS to manage its display state
                cleanupDuplicateHideLinks(audioFigure);
            }, 50); // 50ms delay
        } else {
             if (DEBUG) console.log("Could not find hideLink to click for collapse in:", audioFigure);
             // Still perform cleanup just in case
             cleanupDuplicateHideLinks(audioFigure);
        }
    }


    // --- Mutation Observer Setup ---

    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const targetElement = mutation.target;

                // Check if it's a figure element that changed class
                if (targetElement.nodeName === 'FIGURE' && targetElement.classList.contains('uploadCell')) {
                    const oldValue = mutation.oldValue || ""; // Get old class list string
                    const currentlyExpanded = targetElement.classList.contains('expandedCell');
                    const wasExpanded = oldValue.includes('expandedCell');

                    // --- Check for EXPANSION ---
                    if (currentlyExpanded && !wasExpanded) {
                        if (DEBUG) console.log("Detected expansion on:", targetElement);

                        const originalNameLink = targetElement.querySelector('a.originalNameLink');
                        if (originalNameLink) {
                            const soundFilename = getSoundFilename(originalNameLink.download);
                            if (soundFilename) {
                                if (DEBUG) console.log(`Found [sound=${soundFilename}] tag in expanded file: ${originalNameLink.download}`);
                                const audioFigure = findAudioFigure(targetElement, soundFilename);
                                if (audioFigure) {
                                    expandAudio(audioFigure);
                                } else {
                                    if (DEBUG) console.log(`Audio figure not found for [sound=${soundFilename}] linked from: ${originalNameLink.download}`);
                                }
                            } else {
                                if (DEBUG) console.log(`Expanded file has no [sound=] tag: ${originalNameLink.download}`);
                            }
                        }
                    }
                    // --- Check for COLLAPSE ---
                    else if (!currentlyExpanded && wasExpanded) {
                        if (DEBUG) console.log("Detected collapse on:", targetElement);

                        const originalNameLink = targetElement.querySelector('a.originalNameLink');
                        if (originalNameLink) {
                             const soundFilename = getSoundFilename(originalNameLink.download);
                            if (soundFilename) {
                                if (DEBUG) console.log(`Found [sound=${soundFilename}] tag in collapsed file: ${originalNameLink.download}`);
                                const audioFigure = findAudioFigure(targetElement, soundFilename);
                                if (audioFigure) {
                                    collapseAudio(audioFigure);
                                } else {
                                    if (DEBUG) console.log(`Audio figure not found for [sound=${soundFilename}] linked from: ${originalNameLink.download}`);
                                }
                            } else {
                                 if (DEBUG) console.log(`Collapsed file has no [sound=] tag: ${originalNameLink.download}`);
                            }
                        }
                    }
                }
            }
        }
    };

    // Select the node that will be observed for mutations
    // Use the body or a higher-level stable element if #divThreads isn't reliable
    // body is usually safe if #divThreads is added dynamically or sometimes missing
    const targetNode = document.getElementById('divThreads') || document.body;

    if (targetNode) {
        // Options for the observer
        const config = {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true,
            attributeOldValue: true // Crucial for detecting gain/loss of class
        };

        // Create and start the observer
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        console.log(`8chan Soundpost Player: Observer Attached to ${targetNode.id || 'body'}`);

    } else {
        console.error("8chan Soundpost Player: Could not find a suitable target node to attach observer.");
    }

})();
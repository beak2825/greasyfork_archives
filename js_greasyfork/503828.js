// ==UserScript==
// @name         Sessionize helper
// @namespace    http://tampermonkey.net/
// @version      2025-08-17.2
// @license      Apache 2.0
// @description  Highlight session types/tracks, highlight notes, make the submit button sticky, and add an Enter key shortcut.
// @author       Sebastiano Poggi (updated by Gemini)
// @match        https://sessionize.com/app/organizer/event/evaluation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sessionize.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503828/Sessionize%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/503828/Sessionize%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const autoIgnoreFlutter = true;

    /**
     * Finds the value cell (<td>) corresponding to a given text label (in a <th>).
     * @param {Element} container - The session container element to search within.
     * @param {string} labelText - The exact text of the label to find (e.g., "Session format").
     * @returns {Element|null} The <td> element or null if not found.
     */
    function findRowValueCell(container, labelText) {
        const headers = container.querySelectorAll("div.es-categories table th");
        for (const th of headers) {
            if (th.textContent.trim() === labelText) {
                return th.nextElementSibling;
            }
        }
        return null;
    }

    // Get all session blocks on the page
    const sessionContainers = document.querySelectorAll('.evaluation-session');

    // --- Process each session block individually ---
    for (const container of sessionContainers) {
        // 1. Highlight Session Format
        const sessionFormatCell = findRowValueCell(container, 'Session format');
        if (sessionFormatCell) {
            const sessionSpan = sessionFormatCell.querySelector('p > span');
            if (sessionSpan) {
                const text = sessionSpan.textContent.trim();
                console.log("Processing Session format: " + text);
                switch (text) {
                    case 'Lightning talk':
                        sessionSpan.style.backgroundColor = "#FFA0A0"; // Light red
                        break;
                    case 'Workshop':
                        sessionSpan.style.backgroundColor = "#A0FFA0"; // Light green
                        break;
                    case 'Office hours':
                        sessionSpan.style.backgroundColor = "#FFFFA0"; // Light yellow
                        break;
                    default:
                        sessionSpan.style.backgroundColor = "#A0A0FF"; // Light blue
                        break;
                }
            }
        }

        // 2. Highlight and Auto-Ignore Specific Tracks
        const trackCell = findRowValueCell(container, 'Track');
        if (trackCell) {
            const trackSpans = trackCell.querySelectorAll('p > span');
            for (const trackSpan of trackSpans) {
                const text = trackSpan.textContent.trim();
                console.log("Processing Track: " + text);
                if (text === 'Flutter') {
                    const ibox = container.closest('.ibox');
                    if (ibox) {
                        ibox.style.setProperty('border', '2px solid red', 'important');
                        const ignoreLink = ibox.querySelector('a.dropdown-item span[data-e2icons="i"]');

                        if (autoIgnoreFlutter && ignoreLink) {
                            console.log("Auto-ignoring Flutter session.");
                            ignoreLink.click();
                        }
                    }
                    break;
                }
            }
        }

        // 3. Highlight Notes Button if a note exists
        const notesButtonIcon = container.querySelector('i.fa-comment-alt');
        if (notesButtonIcon) {
            const notesButton = notesButtonIcon.closest('button');
            if (notesButton) {
                // A note exists if the button contains a <span> with the count.
                const noteCountSpan = notesButton.querySelector('span');
                if (noteCountSpan) {
                    console.log("Found session with a note, highlighting button.");
                    // Apply a light yellow background to make it stand out.
                    notesButton.style.backgroundColor = '#FFECB3';
                    notesButton.style.borderColor = '#FFC107';
                }
            }
        }
    }

    // --- 4. Make Submit Button Sticky & Add Enter Shortcut ---
    const headerBar = document.querySelector('#vue-holder .col-lg-12.m-b-xs');
    let submitButton = null;

    if (headerBar) {
        // Find the button by its text content for robustness
        submitButton = Array.from(headerBar.querySelectorAll('button'))
            .find(btn => btn.textContent.includes('Submit your decision'));
    }

    if (submitButton && headerBar) {
        // Logic for the sticky (floating) button
        const handleScroll = () => {
            const headerRect = headerBar.getBoundingClientRect();
            if (headerRect.bottom < 0) {
                submitButton.style.position = 'fixed';
                submitButton.style.top = '10px';
                submitButton.style.right = '20px';
                submitButton.style.zIndex = '9999';
            } else {
                submitButton.style.position = '';
                submitButton.style.top = '';
                submitButton.style.right = '';
                submitButton.style.zIndex = '';
            }
        };

        // Logic for the Enter key shortcut
        const handleEnterKey = (event) => {
            if (event.key === 'Enter' && !submitButton.disabled) {
                console.log("Enter key pressed, clicking submit button.");
                event.preventDefault();
                submitButton.click();
            }
        };

        // Attach the event listeners
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('keydown', handleEnterKey);
    }
})();
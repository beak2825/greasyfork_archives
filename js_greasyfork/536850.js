// ==UserScript==
// @name         MusicBrainz: Warn on significant length differences during recording merge (MBS-10966)
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.3
// @description  Adds a warning on the recording merge page when the lengths differ by at least 15 seconds
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/recording/merge*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536850/MusicBrainz%3A%20Warn%20on%20significant%20length%20differences%20during%20recording%20merge%20%28MBS-10966%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536850/MusicBrainz%3A%20Warn%20on%20significant%20length%20differences%20during%20recording%20merge%20%28MBS-10966%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Converts a time string (MM:SS, H:MM:SS, or milliseconds) to total seconds.
     * Handles formats like "5:36", "1:05:30", "200", or "200 ms".
     * Returns null if the length is unknown (e.g., "?:??").
     * @param {string} timeString - The time string to parse.
     * @returns {number|null} The total duration in seconds, or null if parsing fails or length is unknown.
     */
    function parseTimeToSeconds(timeString) {
        timeString = timeString.trim();

        // Ignore unknown lengths like "?:??"
        if (timeString === '?:??') {
            return null;
        }

        // Attempt to parse MM:SS or H:MM:SS format first
        const parts = timeString.split(':');
        if (parts.length >= 2) {
            let totalSeconds = 0;
            let allPartsAreNumbers = true;
            for (let i = 0; i < parts.length; i++) {
                const part = parseInt(parts[i], 10);
                if (isNaN(part)) {
                    allPartsAreNumbers = false;
                    break;
                }
                if (i === parts.length - 1) { // Seconds part
                    totalSeconds += part;
                } else if (i === parts.length - 2) { // Minutes part
                    totalSeconds += part * 60;
                } else if (i === parts.length - 3) { // Hours part
                    totalSeconds += part * 3600;
                }
            }

            if (allPartsAreNumbers) {
                return totalSeconds;
            }
        }

        // If not MM:SS or H:MM:SS, try parsing as a number, potentially with "ms" suffix.
        let numericValue;
        if (timeString.toLowerCase().endsWith('ms')) {
            // Remove "ms" suffix and parse
            const msString = timeString.substring(0, timeString.length - 2).trim();
            numericValue = parseFloat(msString);
        } else {
            // Try parsing as a direct number
            numericValue = parseFloat(timeString);
        }

        if (!isNaN(numericValue)) {
            // If it's a number, assume it's milliseconds and convert to seconds.
            return numericValue / 1000;
        }

        console.warn('Could not parse time string:', timeString);
        return null; // Default to null if parsing fails
    }

    /**
     * Creates a warning message HTML div element.
     * @param {string} message - The warning text to display.
     * @returns {HTMLDivElement} The created warning div.
     */
    function createWarningDiv(message) {
        const warningDiv = document.createElement('div');
        warningDiv.classList.add('warning', 'warning-lengths-differ'); // Add specific class for easy identification and removal
        const paragraph = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = 'Warning:';
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(' ' + message));
        warningDiv.appendChild(paragraph);
        return warningDiv;
    }

    /**
     * Processes all relevant tables on the page to identify and mark length discrepancies,
     * and inserts a textual warning if needed.
     */
    function processTables() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            // If the main content area is not found, exit.
            return;
        }

        // Remove any previously added length warnings to prevent duplicates on re-runs.
        document.querySelectorAll('.warning-lengths-differ').forEach(warn => warn.remove());

        // Select all tables that contain recording data, both on the merge form and on the post-merge view.
        const tablesToProcess = document.querySelectorAll('form table.tbl, table.details.merge-recordings table.tbl');
        let overallNeedsWarning = false; // Flag to determine if a textual warning is needed for the page.

        tablesToProcess.forEach(table => {
            let lengthColumnIndex = -1;
            // Find the index of the 'Length' column by checking table headers.
            const headers = table.querySelectorAll('thead th');
            headers.forEach((header, index) => {
                if (header.textContent.trim() === 'Length') {
                    lengthColumnIndex = index;
                }
            });

            // Only proceed if the 'Length' column is found.
            if (lengthColumnIndex !== -1) {
                const lengthCells = [];
                const parsedLengths = []; // Stores { cell: HTMLElement, seconds: number|null }

                // Iterate through table rows to collect length cells and their parsed values.
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > lengthColumnIndex) {
                        const lengthCell = cells[lengthColumnIndex];
                        const seconds = parseTimeToSeconds(lengthCell.textContent.trim());
                        lengthCells.push(lengthCell); // Keep track of all cells
                        parsedLengths.push({ cell: lengthCell, seconds: seconds });
                    }
                });

                // Filter out unknown lengths for comparison.
                const knownLengths = parsedLengths.filter(item => item.seconds !== null);

                // If there are at least two known lengths, compare them.
                if (knownLengths.length >= 2) {
                    let tableNeedsWarning = false; // Flag for the current table.
                    // Compare each known length with every other known length in the table.
                    for (let i = 0; i < knownLengths.length; i++) {
                        for (let j = i + 1; j < knownLengths.length; j++) {
                            const diff = Math.abs(knownLengths[i].seconds - knownLengths[j].seconds);
                            if (diff >= 15) { // Check if the difference is 15 seconds or more.
                                tableNeedsWarning = true;
                                overallNeedsWarning = true; // Set overall warning flag if any table needs it.
                                break; // Found a significant difference, no need to check further in this table.
                            }
                        }
                        if (tableNeedsWarning) {
                            break;
                        }
                    }

                    // If a warning is needed for this table, add the 'warn-lengths' class to all its length cells
                    // that have a known length.
                    if (tableNeedsWarning) {
                        parsedLengths.forEach(item => {
                            if (item.seconds !== null) { // Only apply class to cells with known lengths
                                item.cell.classList.add('warn-lengths');
                            }
                        });
                    }
                }
            }
        });

        // If any significant length difference was found across all processed tables,
        // create and insert the textual warning message.
        if (overallNeedsWarning) {
            const warningMessage = "Some of the recordings you're merging have significantly different lengths (15 seconds or more). Please check if they are indeed the same recordings.";
            const newWarningDiv = createWarningDiv(warningMessage);

            const isrcWarning = contentDiv.querySelector('.warning-isrcs-differ');
            const mergeForm = contentDiv.querySelector('form[method="post"]');
            const postMergeDetailsTable = contentDiv.querySelector('table.details.merge-recordings');

            if (isrcWarning) {
                // If the ISRC warning exists, insert our warning directly after it.
                isrcWarning.parentNode.insertBefore(newWarningDiv, isrcWarning.nextSibling);
            } else if (mergeForm) {
                // If no ISRC warning but on a pre-merge page, insert our warning before the main form.
                // This places it where the ISRC warning would typically appear.
                contentDiv.insertBefore(newWarningDiv, mergeForm);
            } else if (postMergeDetailsTable) {
                // On a post-merge page, insert our warning before the details table.
                contentDiv.insertBefore(newWarningDiv, postMergeDetailsTable);
            }
        }
    }

    // Execute the main function when the DOM is initially loaded.
    processTables();

    // Use a MutationObserver to re-run the script if the DOM changes.
    // This is crucial for dynamic content loading, although for merge pages,
    // most relevant content is usually present on initial load. It helps
    // ensure the script works even if parts of the page are updated.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if any newly added nodes or their descendants are relevant tables.
                const relevantChange = Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (
                        node.matches('form table.tbl, table.details.merge-recordings') ||
                        node.querySelector('form table.tbl, table.details.merge-recordings table.tbl')
                    )
                );
                if (relevantChange) {
                    processTables(); // Re-process tables if relevant changes are detected.
                }
            }
        });
    });

    // Start observing the entire document body for changes in its child elements and their subtrees.
    observer.observe(document.body, { childList: true, subtree: true });

})();

// ==UserScript==
// @name         Jira Task Priority Colorizer
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Change card colors based on Jira task priority and add an emoji if a task has been in a status for more than 3 working days, excluding specific columns
// @author       erolatex
// @include      https://*/secure/RapidBoard.jspa*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512008/Jira%20Task%20Priority%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/512008/Jira%20Task%20Priority%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Columns to exclude from emoji update
    const excludedColumns = ['ready for development', 'deployed'];

    // CSS styles to change card colors and position the emoji
    const styleContent = `
        .ghx-issue[data-priority*="P0"] {
            background-color: #FFADB0 !important;
        }
        .ghx-issue[data-priority*="P1"] {
            background-color: #FF8488 !important;
        }
        .ghx-issue[data-priority*="P2"] {
            background-color: #FFD3C6 !important;
        }
        .ghx-issue[data-priority*="P3"],
        .ghx-issue[data-priority*="P4"] {
            background-color: #FFF !important;
        }
        .stale-emoji {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 14px;
            display: flex;
            align-items: center;
            background-color: #d2b48c;
            border-radius: 3px;
            padding: 2px 4px;
            font-weight: bold;
        }
        .stale-emoji span {
            margin-left: 5px;
            font-size: 12px;
            color: #000;
        }
        .ghx-issue {
            position: relative;
        }
        .column-badge.bad-count {
            margin-left: 5px;
            background-color: #d2b48c;
            border-radius: 3px;
            padding: 0 4px;
            font-size: 11px;
            color: #333;
            font-weight: normal;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            line-height: 20px;
        }
        .ghx-limits {
            display: flex;
            align-items: center;
            gap: 5px;
        }
    `;

    // Inject CSS styles into the page
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styleContent));
    document.head.appendChild(styleElement);

    /**
     * Calculates the number of working days between two dates.
     * Excludes Saturdays and Sundays.
     * @param {Date} startDate - The start date.
     * @param {Date} endDate - The end date.
     * @returns {number} - The number of working days.
     */
    function calculateWorkingDays(startDate, endDate) {
        let count = 0;
        let currentDate = new Date(startDate);
        // Set time to midnight to avoid timezone issues
        currentDate.setHours(0, 0, 0, 0);
        endDate = new Date(endDate);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }

    /**
     * Calculates the number of working days based on the total days in the column.
     * Assumes days are counted backward from the current date.
     * @param {number} daysInColumn - Total number of days in the column.
     * @returns {number} - The number of working days.
     */
    function calculateWorkingDaysFromDaysInColumn(daysInColumn) {
        let workingDays = 0;
        let currentDate = new Date();
        // Set time to midnight to avoid timezone issues
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < daysInColumn; i++) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
                workingDays++;
            }
            // Move to the previous day
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return workingDays;
    }

    /**
     * Updates the priorities of the cards and adds/removes the emoji based on working days.
     */
    function updateCardPriorities() {
        // Disconnect the observer to prevent it from reacting to our changes
        observer.disconnect();

        let cards = document.querySelectorAll('.ghx-issue');
        let poopCountPerColumn = {};

        cards.forEach(card => {
            // Update priority attribute
            let priorityElement = card.querySelector('.ghx-priority');
            if (priorityElement) {
                let priority = priorityElement.getAttribute('title') || priorityElement.getAttribute('aria-label') || priorityElement.innerText || priorityElement.textContent;
                if (priority) {
                    card.setAttribute('data-priority', priority);
                }
            }

            // Initialize working days count
            let workingDays = 0;

            // Attempt to get the start date from a data attribute (e.g., data-start-date)
            let startDateAttr = card.getAttribute('data-start-date'); // Example: '2024-04-25'
            if (startDateAttr) {
                let startDate = new Date(startDateAttr);
                let today = new Date();
                workingDays = calculateWorkingDays(startDate, today);
            } else {
                // If start date is not available, use daysInColumn
                let daysElement = card.querySelector('.ghx-days');
                if (daysElement) {
                    let title = daysElement.getAttribute('title');
                    if (title) {
                        let daysMatch = title.match(/(\d+)\s+days?/);
                        if (daysMatch && daysMatch[1]) {
                            let daysInColumn = parseInt(daysMatch[1], 10);
                            workingDays = calculateWorkingDaysFromDaysInColumn(daysInColumn);
                        }
                    }
                }
            }

            // Check and update the emoji 💩
            let columnElement = card.closest('.ghx-column');
            if (workingDays > 3 && columnElement) {
                let columnTitle = columnElement.textContent.trim().toLowerCase();
                if (!excludedColumns.some(col => columnTitle.includes(col))) {
                    let existingEmoji = card.querySelector('.stale-emoji');
                    if (!existingEmoji) {
                        let emojiContainer = document.createElement('div');
                        emojiContainer.className = 'stale-emoji';

                        let emojiElement = document.createElement('span');
                        emojiElement.textContent = '💩';

                        let daysText = document.createElement('span');
                        daysText.textContent = `${workingDays} d`;

                        emojiContainer.appendChild(emojiElement);
                        emojiContainer.appendChild(daysText);

                        card.appendChild(emojiContainer);
                    } else {
                        let daysText = existingEmoji.querySelector('span:last-child');
                        daysText.textContent = `${workingDays} d`;
                    }

                    // Count poop emoji per column
                    let columnId = columnElement.getAttribute('data-column-id') || columnElement.getAttribute('data-id');
                    if (columnId) {
                        if (!poopCountPerColumn[columnId]) {
                            poopCountPerColumn[columnId] = 0;
                        }
                        poopCountPerColumn[columnId]++;
                    }
                }
            } else {
                let existingEmoji = card.querySelector('.stale-emoji');
                if (existingEmoji) {
                    existingEmoji.remove();
                }
            }
        });

        // Update poop count badges for each column
        Object.keys(poopCountPerColumn).forEach(columnId => {
            let columnHeader = document.querySelector(`.ghx-column[data-id="${columnId}"]`);
            if (columnHeader) {
                let limitsContainer = columnHeader.querySelector('.ghx-column-header .ghx-limits');
                let existingBadge = columnHeader.querySelector('.column-badge.bad-count');
                if (!existingBadge) {
                    // Change from 'div' to 'span' and adjust classes
                    existingBadge = document.createElement('span');
                    existingBadge.className = 'ghx-constraint aui-lozenge aui-lozenge-subtle column-badge bad-count';
                }
                existingBadge.textContent = `💩 ${poopCountPerColumn[columnId]}`;
                existingBadge.style.display = 'inline-block';

                if (limitsContainer) {
                    let maxBadge = limitsContainer.querySelector('.ghx-constraint.ghx-busted-max');
                    if (maxBadge) {
                        limitsContainer.insertBefore(existingBadge, maxBadge);
                    } else {
                        limitsContainer.appendChild(existingBadge);
                    }
                } else {
                    // If limitsContainer doesn't exist, create it
                    limitsContainer = document.createElement('div');
                    limitsContainer.className = 'ghx-limits';
                    limitsContainer.appendChild(existingBadge);
                    let headerContent = columnHeader.querySelector('.ghx-column-header-content');
                    if (headerContent) {
                        headerContent.appendChild(limitsContainer);
                    }
                }
            }
        });

        // Reconnect the observer after making changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // MutationObserver to watch for changes in the DOM and update priorities accordingly
    const observer = new MutationObserver(() => {
        updateCardPriorities();
    });

    // Start observing the body
    observer.observe(document.body, { childList: true, subtree: true });

    // Update priorities when the page loads
    window.addEventListener('load', function() {
        updateCardPriorities();
    });

    // Periodically update priorities every 5 seconds
    setInterval(updateCardPriorities, 5000);
})();

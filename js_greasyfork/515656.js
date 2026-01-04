// ==UserScript==
// @name Warhammer Kill Team Rules Sorter
// @namespace https://greasyfork.org/en/users/Kardiff
// @version 1.1.1
// @description Fan-made sorting tool for Kill Team rules page. Adds alphabetical and date sorting functionality with configurable date formats. This is an unofficial tool not affiliated with, endorsed, or sponsored by Games Workshop. Warhammer Kill Team is a trademark of Games Workshop Limited.
// @author Kardiff
// @match https://www.warhammer-community.com/*/downloads/kill-team/
// @license MIT
// @run-at document-idle
// @supportURL https://github.com/Kardiff-Kill-Team/page_sorter/issues
// @homepageURL https://github.com/Kardiff-Kill-Team/page_sorter
// @downloadURL https://update.greasyfork.org/scripts/515656/Warhammer%20Kill%20Team%20Rules%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/515656/Warhammer%20Kill%20Team%20Rules%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .sort-controls {
            position: sticky;
            top: 0;
            background: white;
            padding: 10px;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .sort-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            background: #234;
            color: white;
            cursor: pointer;
            font-weight: bold;
            min-width: 150px;
        }
        .sort-button:hover {
            background: #345;
        }
    `;

    // Date format configurations
    const dateFormats = {
        US: {
            label: 'US (MM/DD/YYYY)',
            format: (day, month, year) => `${month}/${day}/${year}`,
            parse: (text) => {
                const [month, day, year] = text.split('/');
                return new Date(`${year}-${month}-${day}`);
            }
        },
        EU: {
            label: 'EU (DD/MM/YYYY)',
            format: (day, month, year) => `${day}/${month}/${year}`,
            parse: (text) => {
                const [day, month, year] = text.split('/');
                return new Date(`${year}-${month}-${day}`);
            }
        },
        ISO: {
            label: 'ISO (YYYY-MM-DD)',
            format: (day, month, year) => `${year}-${month}-${day}`,
            parse: (text) => new Date(text)
        }
    };

    // Add styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    function initializeSorter(container) {
        // Create control buttons
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'sort-controls';
        
        const alphabeticalButton = document.createElement('button');
        alphabeticalButton.textContent = 'Sort A-Z';
        alphabeticalButton.className = 'sort-button';
        
        const dateButton = document.createElement('button');
        dateButton.textContent = 'Sort by Latest Update';
        dateButton.className = 'sort-button';

        const formatButton = document.createElement('button');
        formatButton.className = 'sort-button';
        let currentFormat = 'US'; // Default format

        // Store original dates to prevent conversion errors
        const originalDates = new Map();

        function updateFormatButtonText() {
            formatButton.textContent = `Format: ${dateFormats[currentFormat].label}`;
        }
        updateFormatButtonText();

        controlsDiv.appendChild(alphabeticalButton);
        controlsDiv.appendChild(dateButton);
        controlsDiv.appendChild(formatButton);
        container.parentElement.insertBefore(controlsDiv, container);

        // Store original dates when first encountering them
        container.querySelectorAll('.shared-downloadCard').forEach(card => {
            const dateSpan = card.querySelector('.border-t span.ml-5');
            if (dateSpan && !originalDates.has(card)) {
                const dateParts = dateSpan.textContent.trim().split('/');
                // Store as day, month, year
                originalDates.set(card, {
                    day: dateParts[0],
                    month: dateParts[1],
                    year: dateParts[2]
                });
            }
        });

        function updateAllDates() {
            container.querySelectorAll('.shared-downloadCard').forEach(card => {
                const dateSpan = card.querySelector('.border-t span.ml-5');
                if (dateSpan && originalDates.has(card)) {
                    const { day, month, year } = originalDates.get(card);
                    if (currentFormat === 'ISO') {
                        dateSpan.textContent = dateFormats.ISO.format(day, month, year);
                    } else if (currentFormat === 'US') {
                        dateSpan.textContent = dateFormats.US.format(day, month, year);
                    } else {
                        dateSpan.textContent = dateFormats.EU.format(day, month, year);
                    }
                }
            });
        }

        // Initial date conversion
        updateAllDates();

        function getTeamBoxes() {
            return Array.from(container.querySelectorAll('.shared-downloadCard'));
        }

        function getTeamName(box) {
            const link = box.querySelector('a[download]');
            return link ? link.textContent.trim() : '';
        }

        function getLastUpdated(box) {
            if (originalDates.has(box)) {
                const { day, month, year } = originalDates.get(box);
                // Always use ISO format for date comparison
                return new Date(`${year}-${month}-${day}`);
            }
            return new Date(0);
        }

        function sortBoxes(sortFunction) {
            const boxes = getTeamBoxes();
            if (boxes.length === 0) return;

            const sortedBoxes = [...boxes].sort(sortFunction);
            sortedBoxes.forEach(box => container.appendChild(box));
        }

        function sortAlphabetically() {
            sortBoxes((a, b) => getTeamName(a).localeCompare(getTeamName(b)));
        }

        function sortByDate() {
            sortBoxes((a, b) => {
                const dateCompare = getLastUpdated(b) - getLastUpdated(a);
                return dateCompare === 0 ? getTeamName(a).localeCompare(getTeamName(b)) : dateCompare;
            });
        }

        alphabeticalButton.addEventListener('click', sortAlphabetically);
        dateButton.addEventListener('click', sortByDate);
        formatButton.addEventListener('click', () => {
            // Cycle through formats: US -> EU -> ISO -> US
            const formats = Object.keys(dateFormats);
            const currentIndex = formats.indexOf(currentFormat);
            currentFormat = formats[(currentIndex + 1) % formats.length];
            updateFormatButtonText();
            updateAllDates();
        });

        // Initial sort
        setTimeout(sortAlphabetically, 1000);
    }

    // Watch for content to load
    const observer = new MutationObserver((mutations, obs) => {
        const downloadCards = document.querySelectorAll('.shared-downloadCard');
        if (downloadCards.length > 0) {
            const container = downloadCards[0].parentElement;
            if (container && !document.querySelector('.sort-controls')) {
                obs.disconnect();
                initializeSorter(container);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback timeout
    setTimeout(() => {
        observer.disconnect();
        const downloadCards = document.querySelectorAll('.shared-downloadCard');
        if (downloadCards.length > 0) {
            const container = downloadCards[0].parentElement;
            if (container && !document.querySelector('.sort-controls')) {
                initializeSorter(container);
            }
        }
    }, 10000);
})();
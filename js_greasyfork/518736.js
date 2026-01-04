// ==UserScript==
// @name         Combined Filter for New Music Releases
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Enhanced dropdown filters for release types and weeks, fixed issue with filtering year-only releases when selecting "This Week".
// @author       Skeebadoo
// @match        https://rateyourmusic.com/new-music/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518736/Combined%20Filter%20for%20New%20Music%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/518736/Combined%20Filter%20for%20New%20Music%20Releases.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const releaseTypeStyles = {
        album: 'Album',
        ep: 'EP',
        djmix: 'DJ Mix',
        mixtape: 'Mixtape',
        musicvideo: 'Music Video',
        video: 'Video',
        single: 'Single',
        unauth: 'Bootleg',
        comp: 'Compilation',
        additional: 'Additional'
    };

    // Updated week options
    const weekOptions = [
        'Earlier',
        '4 Weeks Ago',
        '3 Weeks Ago',
        '2 Weeks Ago',
        'Last Week',
        'This Week',
        'Next Week',
        'In 2 Weeks',
        'Unspecified' // New option for unspecified dates
    ];

    function createFilters() {
        // Create the filter container
        const filterContainer = document.createElement('div');
        filterContainer.style.display = 'flex';
        filterContainer.style.gap = '50px'; // Space between the filters

        // Create filters
        const typeFilter = createTypeFilter();
        const weekFilter = createWeekFilter();

        filterContainer.appendChild(typeFilter);
        filterContainer.appendChild(weekFilter);

        // Add the filter container to the header
        const header = document.querySelector('.section_header_selectorline');
        if (header) {
            header.insertBefore(filterContainer, header.querySelector('.newreleases_settings_btn'));
        }
    }

    function createTypeFilter() {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.position = 'relative';

        const dropdownHeader = document.createElement('div');
        dropdownHeader.style.backgroundColor = '#1c1c1c';
        dropdownHeader.style.color = '#ffffff';
        dropdownHeader.style.padding = '5px 10px';
        dropdownHeader.style.borderRadius = '5px';
        dropdownHeader.style.cursor = 'pointer';
        dropdownHeader.style.fontSize = '14px';
        dropdownHeader.style.fontWeight = 'bold';
        dropdownHeader.textContent = 'Filter by Release Type';

        const dropdownContent = document.createElement('div');
        dropdownContent.style.display = 'none';
        dropdownContent.style.backgroundColor = '#1c1c1c';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.border = '1px solid #444';
        dropdownContent.style.borderRadius = '5px';
        dropdownContent.style.marginTop = '5px';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.zIndex = '1000';
        dropdownContent.style.width = 'max-content';

        dropdownContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, auto); gap: 10px;">
                ${Object.entries(releaseTypeStyles)
                    .map(
                        ([type, label]) => `
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" class="releaseTypeCheckbox" value="${type}" checked style="margin-right: 5px;" />
                            ${label}
                        </label>
                    `
                    )
                    .join('')}
            </div>
        `;

        dropdownHeader.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            dropdownContent.style.display =
                dropdownContent.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownContent.style.display = 'none';
            }
        });

        dropdownContainer.appendChild(dropdownHeader);
        dropdownContainer.appendChild(dropdownContent);
        return dropdownContainer;
    }

    function createWeekFilter() {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.position = 'relative';

        const dropdownHeader = document.createElement('div');
        dropdownHeader.style.backgroundColor = '#1c1c1c';
        dropdownHeader.style.color = '#ffffff';
        dropdownHeader.style.padding = '5px 10px';
        dropdownHeader.style.borderRadius = '5px';
        dropdownHeader.style.cursor = 'pointer';
        dropdownHeader.style.fontSize = '14px';
        dropdownHeader.style.fontWeight = 'bold';
        dropdownHeader.textContent = 'Filter by Week';

        const dropdownContent = document.createElement('div');
        dropdownContent.style.display = 'none';
        dropdownContent.style.backgroundColor = '#1c1c1c';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.border = '1px solid #444';
        dropdownContent.style.borderRadius = '5px';
        dropdownContent.style.marginTop = '5px';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.zIndex = '1000';
        dropdownContent.style.width = 'max-content';

        dropdownContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, auto); gap: 10px;">
                ${weekOptions
                .map(
                (week) => `
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" class="weekCheckbox" value="${week}" checked style="margin-right: 5px;" />
                            ${week}
                        </label>
                    `
            )
                .join('')}
            </div>
        `;

        dropdownHeader.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            dropdownContent.style.display =
                dropdownContent.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownContent.style.display = 'none';
            }
        });

        dropdownContainer.appendChild(dropdownHeader);
        dropdownContainer.appendChild(dropdownContent);
        return dropdownContainer;
    }

    function parseDate(dateString) {
        dateString = dateString.trim();
        // Define patterns
        const fullDatePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // e.g., "24/11/2024"
        const monthYearPattern = /^[A-Za-z]+\s+\d{4}$/; // e.g., "December 2024"
        const yearPattern = /^\d{4}$/; // e.g., "2024"

        if (fullDatePattern.test(dateString)) {
            // Parse exact date
            const parts = dateString.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-based
            const year = parseInt(parts[2], 10);
            return { date: new Date(year, month, day), specified: true };
        } else if (monthYearPattern.test(dateString)) {
            // Parse month and year, unspecified date
            const parts = dateString.split(' ');
            const month = new Date(`${parts[0]} 1, 2000`).getMonth(); // Year is irrelevant
            const year = parseInt(parts[1], 10);
            const date = new Date(year, month, 1);
            return { date: date, specified: false };
        } else if (yearPattern.test(dateString)) {
            // Parse year only, unspecified date
            const year = parseInt(dateString, 10);
            const date = new Date(year, 0, 1);
            return { date: date, specified: false };
        } else {
            // Attempt default parsing
            const date = new Date(dateString);
            if (!isNaN(date)) {
                // Assume specified if parsed and matches the expected format
                return { date: date, specified: true };
            }
            // If parsing fails, treat as unspecified
            return { date: null, specified: false };
        }
    }

    // Calculate the week relative to today, considering weeks start on Monday
    function getRelativeWeek(releaseDate) {
        const today = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        // Function to get the Monday of the week for a given date
        function getMonday(d) {
            const date = new Date(d);
            const day = date.getDay(); // Sunday - Saturday : 0 - 6
            const diff = (day === 0 ? -6 : 1) - day; // Adjust when day is Sunday
            date.setDate(date.getDate() + diff);
            date.setHours(0, 0, 0, 0); // Normalize time
            return date;
        }

        const currentWeekStart = getMonday(today);
        const releaseWeekStart = getMonday(releaseDate);

        // Calculate the difference in milliseconds
        const diffInTime = releaseWeekStart - currentWeekStart;
        // Convert to weeks
        const diffInWeeks = Math.round(diffInTime / oneWeek);

        return diffInWeeks;
    }

    function applyFilters() {
        const selectedTypes = Array.from(
            document.querySelectorAll('.releaseTypeCheckbox:checked')
        ).map((checkbox) => checkbox.value);

        const selectedWeeks = Array.from(
            document.querySelectorAll('.weekCheckbox:checked')
        ).map((checkbox) => checkbox.value);

        const weekMapping = {
            '4 Weeks Ago': -4,
            '3 Weeks Ago': -3,
            '2 Weeks Ago': -2,
            'Last Week': -1,
            'This Week': 0,
            'Next Week': 1,
            'In 2 Weeks': 2
            // 'Earlier' and 'Unspecified' are handled separately below
        };

        const releaseItems = document.querySelectorAll('.newreleases_itembox');
        releaseItems.forEach((item) => {
            const releaseLink = item.querySelector('.newreleases_item_title');
            const releaseDateElement = item.querySelector('.newreleases_item_releasedate');

            if (releaseLink && releaseDateElement) {
                const href = releaseLink.getAttribute('href');
                const releaseTypeMatch = href.match(/\/release\/([^/]+)\//);
                const dateInfo = parseDate(releaseDateElement.textContent.trim());

                const releaseWeek = dateInfo.date ? getRelativeWeek(dateInfo.date) : null;

                // Week filtering logic refinement
                let matchesWeek = false;
                let matchesUnspecified = false;

                // If the date is completely unspecified and "Unspecified" is selected, allow it
                if (!dateInfo.specified) {
                    matchesUnspecified = selectedWeeks.includes('Unspecified');
                }

                // If the date is specified, compare with the week selections
                if (dateInfo.specified) {
                    selectedWeeks.forEach((week) => {
                        if (weekMapping[week] === releaseWeek) {
                            matchesWeek = true;
                        }
                    });
                }

                // Prevent year-only entries from matching "This Week"
                if (selectedWeeks.includes('This Week') && !dateInfo.specified) {
                    matchesWeek = false;
                }

                // Match types properly
                const matchesType = releaseTypeMatch
                ? selectedTypes.includes(releaseTypeMatch[1])
                : false;

                // Determine visibility based on both week and type conditions
                if ((matchesWeek || matchesUnspecified) && matchesType) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    function observeDynamicContent() {
        const containerSelector = document.querySelector('#selector_new_releases_personal')?.classList.contains('subsection_selector_btn_active')
            ? 'newreleases_items_container_new_releases_personal'
            : 'newreleases_items_container_new_releases_all';

        const container = document.getElementById(containerSelector);
        if (!container) return;

        const observer = new MutationObserver(() => applyFilters());
        observer.observe(container, { childList: true, subtree: true });

        // Initial application
        applyFilters();
    }

    function handleTabSwitch() {
        const personalTab = document.getElementById('selector_new_releases_personal');
        const allTab = document.getElementById('selector_new_releases_all');

        if (personalTab && allTab) {
            personalTab.addEventListener('click', () => {
                observeDynamicContent();
            });

            allTab.addEventListener('click', () => {
                observeDynamicContent();
            });
        }
    }

    function initialize() {
        createFilters();
        observeDynamicContent();
        handleTabSwitch();

        const filterContainer = document.querySelector('.section_header_selectorline');
        if (filterContainer) {
            filterContainer.addEventListener('change', applyFilters);
        }
    }

    // Run the initialize function when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
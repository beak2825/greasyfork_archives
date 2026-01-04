// ==UserScript==
// @name         Compact Filter for New Music Release Types
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add a compact dropdown filter for release types in the header of the new releases page.
// @author       Skeebadoo
// @match        https://rateyourmusic.com/new-music/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518722/Compact%20Filter%20for%20New%20Music%20Release%20Types.user.js
// @updateURL https://update.greasyfork.org/scripts/518722/Compact%20Filter%20for%20New%20Music%20Release%20Types.meta.js
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

    // Create the dropdown checklist for filtering
    function createDropdown() {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'releaseTypeFilter';
        dropdownContainer.style.position = 'relative';
        dropdownContainer.style.marginLeft = '20px';
        dropdownContainer.style.display = 'inline-block'; // Keep it inline with the header

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
        dropdownContent.id = 'releaseTypeChecklist';
        dropdownContent.style.display = 'none'; // Initially hidden
        dropdownContent.style.backgroundColor = '#1c1c1c';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.border = '1px solid #444';
        dropdownContent.style.borderRadius = '5px';
        dropdownContent.style.marginTop = '5px';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.zIndex = '1000'; // Ensure it appears above other elements
        dropdownContent.style.width = 'max-content';

        dropdownContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(5, auto); gap: 10px;">
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

        // Toggle dropdown content visibility on header click
        dropdownHeader.addEventListener('click', () => {
            dropdownContent.style.display =
                dropdownContent.style.display === 'none' ? 'block' : 'none';
        });

        dropdownContainer.appendChild(dropdownHeader);
        dropdownContainer.appendChild(dropdownContent);

        // Add the dropdown to the header section
        const header = document.querySelector('.section_header_selectorline');
        if (header) {
            header.insertBefore(dropdownContainer, header.querySelector('.newreleases_settings_btn'));
        }
    }

    // Filter the list items based on selected types
    function filterList() {
        const selectedTypes = Array.from(
            document.querySelectorAll('.releaseTypeCheckbox:checked')
        ).map((checkbox) => checkbox.value);

        const releaseItems = document.querySelectorAll('.newreleases_itembox');
        releaseItems.forEach((item) => {
            const releaseLink = item.querySelector('.newreleases_item_title');
            if (releaseLink) {
                const href = releaseLink.getAttribute('href');
                const releaseTypeMatch = href.match(/\/release\/([^/]+)\//);
                if (releaseTypeMatch) {
                    const releaseType = releaseTypeMatch[1];
                    if (selectedTypes.includes(releaseType)) {
                        item.style.display = ''; // Show item
                    } else {
                        item.style.display = 'none'; // Hide item
                    }
                }
            }
        });
    }

    // Use MutationObserver to detect newly added items and apply filtering
    function observeDynamicContent() {
        const containerId =
            document.querySelector('#selector_new_releases_personal')
                .classList.contains('subsection_selector_btn_active')
                ? 'newreleases_items_container_new_releases_personal'
                : 'newreleases_items_container_new_releases_all';

        const container = document.getElementById(containerId);
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    filterList(); // Reapply the filter to newly added items
                }
            });
        });

        observer.observe(container, { childList: true });
    }

    // Reinitialize the observer when tabs are switched
    function handleTabSwitch() {
        document
            .getElementById('selector_new_releases_personal')
            .addEventListener('click', () => {
                observeDynamicContent(); // Reinitialize observer for "My New Releases"
                filterList(); // Apply filter to already loaded items
            });

        document
            .getElementById('selector_new_releases_all')
            .addEventListener('click', () => {
                observeDynamicContent(); // Reinitialize observer for "All New Releases"
                filterList(); // Apply filter to already loaded items
            });
    }

    // Initialize the script
    function initialize() {
        createDropdown(); // Create the dropdown checklist
        filterList(); // Apply the initial filter
        observeDynamicContent(); // Watch for dynamically loaded items
        handleTabSwitch(); // Handle tab switching between "All" and "My New Releases"

        // Add event listener for checkbox changes
        const checklist = document.getElementById('releaseTypeChecklist');
        if (checklist) {
            checklist.addEventListener('change', filterList);
        }
    }

    initialize();
})();
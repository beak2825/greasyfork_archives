// ==UserScript==
// @name         JIRA Assignee Quick Filter Menu
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Convert assignee Quick Filters into dropdown menu with an "All" option to clear assignee filter
// @author       Jake Savin
// @copyright    Copyright (c) 2023 Jake Savin
// @license      MIT
// @source       https://github.com/jsavin/userscripts/
// @match        https://*/secure/RapidBoard.jspa?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472518/JIRA%20Assignee%20Quick%20Filter%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/472518/JIRA%20Assignee%20Quick%20Filter%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitUntilJiraIsLoaded = setInterval(() => {
        if (document.getElementById('js-work-quickfilters')) {
            clearInterval(waitUntilJiraIsLoaded);
            createQuickFiltersDropdown('board');
            createQuickFiltersDropdown('backlog');
        }
    }, 500);

    // Watch for the view to switch between the backlog (plan) view and board (work) view,
    // and create the menu when the view changes.
    function observeViewChanges() {
        // Set up observer for changing to the backlog view
        const ghxPlan = document.getElementById('ghx-plan');
        if (ghxPlan) {
            const observerBacklog = new MutationObserver(() => {
                if (ghxPlan.children.length > 0) {
                    console.log("Switching to backlog view");
                    createQuickFiltersDropdown('backlog');
                    updateSelectedFilter('backlog');
                }
            });
            observerBacklog.observe(ghxPlan, { childList: true });
        }

        // Set up observer for changing to the board view
        const ghxControlsWork = document.getElementById('ghx-controls-work');
        if (ghxControlsWork) {
            const observerBoard = new MutationObserver(() => {
                if (ghxControlsWork.classList.contains('ghx-controls-list')) { // Adjust this condition as needed
                    console.log("Switching to board view");
                    createQuickFiltersDropdown('board');
                    updateSelectedFilter('board');
                }
            });
            observerBoard.observe(ghxControlsWork, { attributes: true });
        }
    }

    // Select the correct menu option after switching between backlog and board views
    function updateSelectedFilter(view) {
        console.log("Updating selected filter");
        const filtersDivId = view === 'backlog' ? 'js-plan-quickfilters' : 'js-work-quickfilters';
        const selectId = view === 'backlog' ? 'assignee-filter-backlog' : 'assignee-filter-board';
        const filtersDiv = document.getElementById(filtersDivId);
        const select = document.getElementById(selectId); // Access the correct select element for the view

        // Loop through the options in the select element
        for (const option of select.options) {
            const filterId = option.value;
            // Find the corresponding filter link
            const filterLink = filtersDiv.querySelector(`.js-quickfilter-button[data-filter-id="${filterId}"]`);

            // Check if the filter link has the "ghx-active" class
            if (filterLink && filterLink.classList.contains('ghx-active')) {
                // Set this option as selected
                select.value = filterId;
                break;
            }
        }
    }

    // Initial creation of the dropdown menu based on the current view
    const currentView = document.getElementById('ghx-plan').children.length > 0 ? 'backlog' : 'board';
    createQuickFiltersDropdown(currentView);

    // Set up the observer to detect view changes
    observeViewChanges();


    // Make a dropdown menu with options for all the filters that appear to be for assignees,
    // including an option at the top called "All" to clear the assignee filter. Only one
    // assignee filter can be active at a time.
    function createQuickFiltersDropdown(view) {
        const containerId = view === 'board' ? 'js-work-quickfilters' : 'js-plan-quickfilters';
        const selectId = view === 'board' ? 'assignee-filter-board' : 'assignee-filter-backlog';
        const container = document.getElementById(containerId);
        if (!container) return; // Exit if the container is not found

        const filters = Array.from(container.querySelectorAll('.js-quickfilter-button'));

        // Create dropdown and add 'Clear' option
        const select = document.createElement('select');
        select.id = selectId;
        select.addEventListener('change', () => {
            clearAndSetFilter(select, view);
        });
        const clearOption = document.createElement('option');
        clearOption.text = 'All';
        select.appendChild(clearOption);
        select.style.marginRight = '0.6em';

        // Create label
        const label = document.createElement('label');
        label.textContent = 'Assignee:';
        label.style.marginRight = '0.3em';

        // Add each filter to the dropdown
        let firstFilterContainer;
        filters.forEach((filter) => {
            if (/assigned|assignee/i.test(filter.title) && /[a-zA-Z]{2,}/.test(filter.innerText)) {
                const option = document.createElement('option');
                option.text = filter.textContent;
                option.value = filter.dataset.filterId;
                select.appendChild(option);

                // Hide the original filter link only, not the entire dd element
                const container = document.createElement('span');
                container.style.display = 'none';
                filter.parentNode.replaceChild(container, filter);
                container.appendChild(filter);

                // Remember the first filter and replace it with the dropdown
                if (!firstFilterContainer) {
                    firstFilterContainer = filter.parentElement;
                    let filtersParent = firstFilterContainer.parentNode;
                    filtersParent.insertBefore(label, firstFilterContainer);
                    filtersParent.insertBefore(select, firstFilterContainer);
                }
            }
        });
        updateSelectedFilter(view);
    }

    // Activate the selected filter and deactivate any other assignee filter that was previously active
    function clearAndSetFilter(select, view) {
        const containerId = view === 'board' ? 'js-work-quickfilters' : 'js-plan-quickfilters';
        const container = document.getElementById(containerId);
        if (!container) return; // Exit if the container is not found

        // Find only the active filters that correspond to options in our menu
        const activeFilters = Array.from(container.querySelectorAll('.js-quickfilter-button.ghx-active'))
            .filter((filter) => {
                return Array.from(select.options).some((option) => option.value === filter.dataset.filterId);
            });

        // Clear active filters
        activeFilters.forEach((filter) => {
            filter.click();
        });

        // Set new filter
        const selectedFilterId = select.value;
        if (selectedFilterId) {
            const filterToClick = container.querySelector(`.js-quickfilter-button[data-filter-id="${selectedFilterId}"]`);
            filterToClick.click();
        }

        select.blur();
    }
})();

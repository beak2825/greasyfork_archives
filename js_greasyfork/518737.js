// ==UserScript==
// @name         Auto Load More Items on New Music Page
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically clicks "View More..." after switching tabs or sort order on the new music page.
// @author       You
// @match        https://rateyourmusic.com/new-music/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518737/Auto%20Load%20More%20Items%20on%20New%20Music%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/518737/Auto%20Load%20More%20Items%20on%20New%20Music%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const maxClicks = 5; // Maximum number of auto-clicks per tab switch
    const clickDelay = 1000; // Delay between clicks in milliseconds

    let clicksPerformed = 0;
    let currentTab = "all"; // "all" or "personal"
    let contentObserver = null; // To hold the content observer instance

    // Utility function to wait for a specified time (milliseconds)
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to simulate a click on the "View More..." button
    function clickViewMoreButton() {
        let buttonId;
        if (currentTab === 'all') {
            buttonId = 'view_more_new_releases_all';
        } else if (currentTab === 'personal') {
            buttonId = 'view_more_new_releases_personal';
        } else {
            console.error(`Unknown currentTab value: "${currentTab}"`);
            return;
        }

        const viewMoreButton = document.getElementById(buttonId);
        if (viewMoreButton) {
            // Check if the button is visible
            const style = window.getComputedStyle(viewMoreButton);
            if (style.display !== 'none' && style.visibility !== 'hidden' && viewMoreButton.offsetParent !== null) {
                console.log(`Clicking "View More..." button (${clicksPerformed + 1}/${maxClicks}) on "${currentTab}" tab.`);

                // Dispatch a MouseEvent to better simulate a user click
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                const cancelled = !viewMoreButton.dispatchEvent(event);
                if (!cancelled) {
                    console.log('"View More..." button click dispatched successfully.');
                    clicksPerformed++;
                } else {
                    console.log('"View More..." button click was cancelled.');
                }
            } else {
                console.log(`"View More..." button ("${buttonId}") is not visible.`);
            }
        } else {
            console.log(`"View More..." button with ID "${buttonId}" not found.`);
        }
    }

    // Function to repeatedly click the button with delays, up to maxClicks
    async function loadMoreItems() {
        while (clicksPerformed < maxClicks) {
            const viewMoreButton = document.getElementById(currentTab === 'all' ? 'view_more_new_releases_all' : 'view_more_new_releases_personal');
            if (!viewMoreButton) {
                console.log('"View More..." button not found. Stopping auto-click.');
                break;
            }

            // Check if the button is visible before clicking
            const style = window.getComputedStyle(viewMoreButton);
            if (style.display === 'none' || style.visibility === 'hidden' || viewMoreButton.offsetParent === null) {
                console.log(`"View More..." button ("${viewMoreButton.id}") is not visible. Stopping auto-click.`);
                break;
            }

            clickViewMoreButton();

            // Wait for content to load. Adjust the delay as needed.
            await wait(clickDelay);
        }

        console.log(`Reached the maximum of ${maxClicks} auto-clicks.`);
    }

    // Function to observe attribute changes on tab elements
    function observeTabSwitch() {
        const allTab = document.getElementById("selector_new_releases_all");
        const personalTab = document.getElementById("selector_new_releases_personal");

        if (!allTab || !personalTab) {
            console.error("Tab elements not found. Please check the element IDs.");
            return;
        }

        // Callback for attribute changes
        const tabChangeCallback = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (allTab.classList.contains("subsection_selector_btn_active") && currentTab !== "all") {
                        console.log('Switched to "All New Releases" tab.');
                        currentTab = "all";
                        clicksPerformed = 0; // Reset click count when tab switches
                        resetContentObserver(); // Reset content observer for the new tab
                        setTimeout(loadMoreItems, 1000); // Delay before starting to load items
                    }

                    if (personalTab.classList.contains("subsection_selector_btn_active") && currentTab !== "personal") {
                        console.log('Switched to "My New Releases" tab.');
                        currentTab = "personal";
                        clicksPerformed = 0; // Reset click count when tab switches
                        resetContentObserver(); // Reset content observer for the new tab
                        setTimeout(loadMoreItems, 1000); // Delay before starting to load items
                    }
                }
            }
        };

        // Create separate observers for each tab to watch attribute changes
        const allTabObserver = new MutationObserver(tabChangeCallback);
        const personalTabObserver = new MutationObserver(tabChangeCallback);

        // Start observing class attribute changes on both tabs
        allTabObserver.observe(allTab, { attributes: true, attributeFilter: ['class'] });
        personalTabObserver.observe(personalTab, { attributes: true, attributeFilter: ['class'] });

        console.log('Started observing tab switches.');
    }

    // Function to observe content changes in the active tab's container
    function observeDynamicContent() {
        let containerId;

        // Determine which tab is active and set the container ID accordingly
        if (currentTab === "all") {
            containerId = 'newreleases_items_container_new_releases_all';
        } else if (currentTab === "personal") {
            containerId = 'newreleases_items_container_new_releases_personal';
        } else {
            console.error(`Unknown tab: ${currentTab}`);
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Content container with ID "${containerId}" not found.`);
            return;
        }

        // Disconnect any existing observer before creating a new one
        if (contentObserver) {
            contentObserver.disconnect();
            console.log('Disconnected previous content observer.');
        }

        // Set up content observer
        contentObserver = new MutationObserver(() => {
            console.log('New content detected. Loading more items...');
            loadMoreItems();
        });

        contentObserver.observe(container, { childList: true, subtree: true });
        console.log(`Started observing content changes in container "${containerId}".`);
    }

    // Function to reset the content observer when switching tabs
    function resetContentObserver() {
        observeDynamicContent(); // Set up the observer for the new container
    }

    // Function to handle sort order switching (if applicable)
    function handleSortSwitch() {
        const sortBtn = document.querySelector('.newreleases_sort_btn_date');
        if (!sortBtn) {
            console.error('Sort button not found.');
            return;
        }

        // Check if sort order has changed by inspecting child elements or classes
        const caretUp = sortBtn.querySelector('.fa-caret-up');
        const caretDown = sortBtn.querySelector('.fa-caret-down');

        if (caretUp && caretDown) {
            if (caretDown.style.display !== "none") {
                console.log('Sort order changed to descending.');
                clicksPerformed = 0; // Reset click count when sort order switches
                loadMoreItems(); // Start loading more items after sort order switch
            } else if (caretUp.style.display !== "none") {
                console.log('Sort order changed to ascending.');
                clicksPerformed = 0; // Reset click count when sort order switches
                loadMoreItems(); // Start loading more items after sort order switch
            }
        }
    }

    // Function to observe sort order changes
    function observeSortSwitch() {
        const sortBtn = document.querySelector('.newreleases_sort_btn_date');
        if (!sortBtn) {
            console.error('Sort button not found for sort switch observation.');
            return;
        }

        // Callback for attribute changes
        const sortChangeCallback = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    handleSortSwitch(); // Handle sort order change
                }
            }
        };

        // Create an observer to watch attribute changes on the sort button
        const sortObserver = new MutationObserver(sortChangeCallback);
        sortObserver.observe(sortBtn, { attributes: true, attributeFilter: ['class'] });

        console.log('Started observing sort order changes.');
    }

    // Initialization function
    function initialize() {
        // Determine the initial active tab
        const allTab = document.getElementById("selector_new_releases_all");
        const personalTab = document.getElementById("selector_new_releases_personal");

        if (allTab.classList.contains("subsection_selector_btn_active")) {
            currentTab = "all";
        } else if (personalTab.classList.contains("subsection_selector_btn_active")) {
            currentTab = "personal";
        } else {
            console.warn('No active tab detected. Defaulting to "all".');
            currentTab = "all";
        }

        console.log(`Initial active tab: "${currentTab}"`);

        // Start observing tab switches
        observeTabSwitch();

        // Start observing sort order switches (if applicable)
        observeSortSwitch();

        // Start observing content changes in the active tab's container
        observeDynamicContent();

        // Begin auto-clicking "View More..." buttons
        loadMoreItems();
    }

    // Run the initialize function when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();

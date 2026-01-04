// ==UserScript==
// @name         Sniffies age fetcher and overlay
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Ensure the sidebar opens for each avatar and fetch ages consistently on Sniffies.com with hover and click simulation fixed.
// @author       Your Name
// @match        *://sniffies.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523678/Sniffies%20age%20fetcher%20and%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/523678/Sniffies%20age%20fetcher%20and%20overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processingAvatars = new WeakSet();
    let stopFetching = false; // Global flag to stop the fetching process
    let lastFetchedAge = null; // Keep track of the last fetched age

    // Function to add the age overlay to an avatar
    function addAgeOverlay(avatarElement, ageValue) {
        const existingOverlay = avatarElement.querySelector('.age-overlay');
        if (existingOverlay) existingOverlay.remove();

        const ageOverlay = document.createElement('div');
        ageOverlay.textContent = ageValue || "-"; // Default to a hyphen if age is missing
        ageOverlay.className = 'age-overlay';
        ageOverlay.style.position = 'absolute';
        ageOverlay.style.top = '5px';
        ageOverlay.style.left = '5px';
        ageOverlay.style.padding = '2px 5px';
        ageOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        ageOverlay.style.color = 'white';
        ageOverlay.style.fontSize = '14px';
        ageOverlay.style.fontWeight = 'bold';
        ageOverlay.style.borderRadius = '3px';
        ageOverlay.style.zIndex = '10';

        avatarElement.style.position = 'relative';
        avatarElement.appendChild(ageOverlay);
    }

    // Function to simulate hover and click
    function simulateHoverAndClick(element) {
        const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

        element.dispatchEvent(mouseOverEvent);
        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseUpEvent);
        element.dispatchEvent(clickEvent);
    }

    // Function to ensure the sidebar opens and fetch the correct age
    async function fetchAgeWithRetries(avatarElement) {
        const sidebarSelector = "span[data-testid='ageStat']"; // Selector for ageStat in sidebar
        let retries = 0;
        const maxRetries = 10;

        simulateHoverAndClick(avatarElement);

        while (retries < maxRetries) {
            const ageElement = document.querySelector(sidebarSelector);
            if (ageElement) {
                const ageValue = ageElement.textContent.trim();
                if (ageValue !== lastFetchedAge) {
                    console.log("New age found:", ageValue);
                    lastFetchedAge = ageValue; // Update the last fetched age
                    return ageValue;
                }
            }

            console.log(`Retrying to fetch updated age... Attempt: ${retries + 1}`);
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log("Failed to fetch age for avatar:", avatarElement);
        return null;
    }

    // Function to handle avatar clicks and fetch age
    async function handleAvatarClick(avatarElement) {
        if (processingAvatars.has(avatarElement)) return;

        processingAvatars.add(avatarElement);

        // Clear overlay for a fresh start
        addAgeOverlay(avatarElement, "-");

        const ageValue = await fetchAgeWithRetries(avatarElement);
        if (ageValue) {
            addAgeOverlay(avatarElement, ageValue);
        } else {
            addAgeOverlay(avatarElement, "-");
        }

        processingAvatars.delete(avatarElement);
    }

    // Function to attach manual click listeners to avatars
    function attachAvatarListeners() {
        const avatarSelectors = ['div.marker-avatar', 'div.marker-avatar-image'];
        avatarSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (!element.dataset.listenerAttached) {
                    element.addEventListener('click', async () => {
                        console.log("Manually clicked avatar:", element);
                        await handleAvatarClick(element);
                    });
                    element.dataset.listenerAttached = "true";
                }
            });
        });
    }

    // Function to simulate clicks on all avatars
    async function clickAllAvatars() {
        console.log("Fetching ages for all avatars...");
        stopFetching = false; // Reset the stop flag

        // Capture all visible avatars at the moment the button is pressed
        const avatarSelectors = ['div.marker-avatar', 'div.marker-avatar-image'];
        const avatars = [];

        avatarSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (!processingAvatars.has(element)) {
                    avatars.push(element);
                }
            });
        });

        console.log(`Found ${avatars.length} avatars to process.`);

        // Process avatars sequentially
        for (const avatar of avatars) {
            if (stopFetching) {
                console.log("Fetching process stopped by user.");
                break; // Exit the loop if the stop button is pressed
            }

            await handleAvatarClick(avatar); // Process the current avatar
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay between avatars
        }

        console.log("Finished processing all avatars or stopped by user.");
    }

    // Add the "Fetch All Ages" and "Stop" buttons
    function addControlButtons() {
        // Fetch All Ages Button
        const fetchButton = document.createElement('button');
        fetchButton.textContent = "Fetch All Ages";
        fetchButton.style.position = 'fixed';
        fetchButton.style.bottom = '10px';
        fetchButton.style.left = '40%';
        fetchButton.style.padding = '8px 20px';
        fetchButton.style.backgroundColor = '#007BFF';
        fetchButton.style.color = 'white';
        fetchButton.style.border = 'none';
        fetchButton.style.borderRadius = '5px';
        fetchButton.style.fontSize = '16px';
        fetchButton.style.cursor = 'pointer';
        fetchButton.style.zIndex = '10000';

        fetchButton.addEventListener('click', clickAllAvatars);

        // Stop Button
        const stopButton = document.createElement('button');
        stopButton.textContent = "Stop";
        stopButton.style.position = 'fixed';
        stopButton.style.bottom = '10px';
        stopButton.style.left = '55%';
        stopButton.style.padding = '8px 20px';
        stopButton.style.backgroundColor = '#FF0000';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.fontSize = '16px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.zIndex = '10000';

        stopButton.addEventListener('click', () => {
            stopFetching = true;
            console.log("Stop button clicked. Fetching process will stop.");
        });

        // Add buttons to the page
        document.body.appendChild(fetchButton);
        document.body.appendChild(stopButton);
    }

    const observer = new MutationObserver(() => {
        attachAvatarListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    addControlButtons();
    attachAvatarListeners();
})();

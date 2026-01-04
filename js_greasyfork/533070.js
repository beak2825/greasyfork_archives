// ==UserScript==
// @name         Twitter Followers Mutual Tracker
// @description  Track mutual and non-mutual Twitter followers and download as JSON
// @namespace    https://github.com/kaubu
// @version      1.1.1
// @author       kaubu (https://github.com/kaubu)
// @match        https://twitter.com/*/followers
// @match        https://twitter.com/*/following
// @match        https://x.com/*/followers
// @match        https://x.com/*/following
// @grant        none
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/533070/Twitter%20Followers%20Mutual%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/533070/Twitter%20Followers%20Mutual%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arrays to store mutuals and non-mutuals
    let mutuals = [];
    let nonMutuals = [];

    // Flag to track if the script is active
    let isTrackerActive = true;

    // Auto-scroll variables
    let isAutoScrolling = false;
    let autoScrollInterval;
    let lastUserCount = 0;
    let noNewUsersCounter = 0;

    // Helper: Extract display name
    function getDisplayName(cell) {
        // Try to find the display name in the most robust way
        // Twitter/X often uses the first span in the first link for display name
        const link = cell.querySelector('a[role="link"]:not([tabindex="-1"])');
        if (link) {
            const span = link.querySelector('span');
            if (span) return span.textContent.trim();
        }
        // Fallback to previous selector
        const fallback = cell.querySelector('.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3:not([style*="display: none"])');
        return fallback ? fallback.textContent.trim() : '';
    }

    // Helper: Extract username
    function getUsername(cell) {
        // Try to find the username by looking for a span starting with '@'
        const spans = cell.querySelectorAll('span');
        for (const span of spans) {
            if (span.textContent.trim().startsWith('@')) {
                return span.textContent.trim();
            }
        }
        // Fallback to previous selector
        const fallback = cell.querySelector('[style*="color: rgb(113, 118, 123)"] .css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
        return fallback ? fallback.textContent.trim() : '';
    }

    // Helper: Extract profile URL
    function getProfileUrl(cell, username) {
        // Try to find the first profile link
        const link = cell.querySelector('a[role="link"]:not([tabindex="-1"])');
        if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('/')) {
            return `https://x.com${link.getAttribute('href')}`;
        }
        // Fallback to constructing from username
        return username ? `https://x.com/${username.replace('@', '')}` : '';
    }

    // Helper: Check if element is within "You might like" section
    function isInYouMightLikeSection(element) {
        // Check if this element or any parent has the "You might like" heading
        let current = element;
        const maxDepth = 10; // Prevent infinite loop
        let depth = 0;

        while (current && depth < maxDepth) {
            // Check if it's within a section with "You might like" heading
            const headingNearby = current.querySelector('h2 span');
            if (headingNearby && headingNearby.textContent.includes('You might like')) {
                return true;
            }

            // Check if this is inside aside[aria-label="Who to follow"]
            const aside = current.closest('aside[aria-label="Who to follow"]');
            if (aside) {
                return true;
            }

            current = current.parentElement;
            depth++;
        }

        return false;
    }

    // Function to start auto-scrolling
    function startAutoScroll() {
        if (isAutoScrolling) return;

        isAutoScrolling = true;
        noNewUsersCounter = 0;
        lastUserCount = mutuals.length + nonMutuals.length;
        document.getElementById('auto-scroll-btn').textContent = 'Stop Auto-Scroll';

        autoScrollInterval = setInterval(() => {
            // Scroll down by a small amount
            window.scrollBy(0, 300);

            // Get current total users
            const currentUserCount = mutuals.length + nonMutuals.length;

            // Check if we've found new users
            if (currentUserCount > lastUserCount) {
                // Reset the counter if we found new users
                noNewUsersCounter = 0;
                lastUserCount = currentUserCount;
            } else {
                // Increment counter if no new users found
                noNewUsersCounter++;
            }

            // If we haven't found new users after several scrolls, consider it done
            if (noNewUsersCounter >= 10) {
                // Play beep sound
                playBeepSound();

                // Stop auto-scrolling
                stopAutoScroll();
            }
        }, 500);
    }

    // Function to stop auto-scrolling
    function stopAutoScroll() {
        if (!isAutoScrolling) return;

        isAutoScrolling = false;
        clearInterval(autoScrollInterval);
        document.getElementById('auto-scroll-btn').textContent = 'Auto-Scroll to Bottom';
    }

    // Function to play a beep sound
    function playBeepSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 220; // Lower A3 note for a deeper sound
        gainNode.gain.value = 0.1; // Low volume

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 300);
    }

    // Function to close the tracker and cleanup
    function closeTracker() {
        // Stop auto-scrolling if active
        if (isAutoScrolling) {
            stopAutoScroll();
        }

        // Remove the status div
        const statusDiv = document.getElementById('mutual-tracker-status');
        if (statusDiv) {
            statusDiv.remove();
        }

        // Set the tracker as inactive
        isTrackerActive = false;

        // Remove event listeners
        window.removeEventListener('scroll', processUserCells);
        window.removeEventListener('resize', processUserCells);
    }

    // Function to add the status div and buttons
    function addStatusDiv() {
        // Don't add if tracker is inactive
        if (!isTrackerActive) return;

        // Remove any existing status div
        const existingDiv = document.getElementById('mutual-tracker-status');
        if (existingDiv) {
            existingDiv.remove();
        }

        // Create the status div
        const statusDiv = document.createElement('div');
        statusDiv.id = 'mutual-tracker-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.bottom = '20px';
        statusDiv.style.right = '20px';
        statusDiv.style.backgroundColor = '#1DA1F2';
        statusDiv.style.color = 'white';
        statusDiv.style.padding = '15px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.zIndex = '10000';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.fontFamily = 'Arial, sans-serif';
        statusDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        statusDiv.style.width = '220px';
        statusDiv.style.maxWidth = '90vw';
        statusDiv.style.boxSizing = 'border-box';

        // Create header with close button
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '12px';

        const headerTitle = document.createElement('div');
        headerTitle.textContent = 'Mutual Tracker';
        headerTitle.style.fontWeight = 'bold';

        const closeButton = document.createElement('div');
        closeButton.textContent = '✕';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.lineHeight = '16px';
        closeButton.addEventListener('click', closeTracker);

        headerDiv.appendChild(headerTitle);
        headerDiv.appendChild(closeButton);
        statusDiv.appendChild(headerDiv);

        // Create the status text
        const statusText = document.createElement('div');
        const totalAccounts = mutuals.length + nonMutuals.length;
        statusText.innerHTML = `Mutuals: ${mutuals.length} | Non-Mutuals: ${nonMutuals.length}<br>Total Accounts: ${totalAccounts}`;
        statusText.style.marginBottom = '12px';
        statusDiv.appendChild(statusText);

        // Create button container for consistent styling
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '8px';

        // Create the auto-scroll button
        const autoScrollButton = document.createElement('button');
        autoScrollButton.id = 'auto-scroll-btn';
        autoScrollButton.textContent = 'Auto-Scroll to Bottom';
        autoScrollButton.style.padding = '8px 10px';
        autoScrollButton.style.borderRadius = '4px';
        autoScrollButton.style.border = 'none';
        autoScrollButton.style.backgroundColor = 'white';
        autoScrollButton.style.color = '#1DA1F2';
        autoScrollButton.style.cursor = 'pointer';
        autoScrollButton.style.fontWeight = 'bold';
        autoScrollButton.style.width = '100%';
        autoScrollButton.style.transition = 'background-color 0.2s';

        autoScrollButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0';
        });

        autoScrollButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'white';
        });

        // Add event listener to auto-scroll button
        autoScrollButton.addEventListener('click', function() {
            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });

        buttonContainer.appendChild(autoScrollButton);

        // Create the download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Data';
        downloadButton.style.padding = '8px 10px';
        downloadButton.style.borderRadius = '4px';
        downloadButton.style.border = 'none';
        downloadButton.style.backgroundColor = 'white';
        downloadButton.style.color = '#1DA1F2';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontWeight = 'bold';
        downloadButton.style.width = '100%';
        downloadButton.style.transition = 'background-color 0.2s';

        downloadButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0';
        });

        downloadButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'white';
        });

        // Add event listener to download button
        downloadButton.addEventListener('click', function() {
            downloadData();
        });

        buttonContainer.appendChild(downloadButton);
        statusDiv.appendChild(buttonContainer);
        document.body.appendChild(statusDiv);
    }

    // Function to download the data
    function downloadData() {
        const data = {
            mutuals: mutuals,
            nonMutuals: nonMutuals,
            totalMutuals: mutuals.length,
            totalNonMutuals: nonMutuals.length
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'x_twitter_mutual_data.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    // Function to check if an element is visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to process user cells
    function processUserCells() {
        // Don't process if tracker is inactive
        if (!isTrackerActive) return;

        const userCells = document.querySelectorAll('[data-testid="UserCell"]');

        userCells.forEach(cell => {
            // Skip if already processed
            if (cell.dataset.processed === 'true') {
                return;
            }

            // Only process visible cells
            if (!isElementInViewport(cell)) {
                return;
            }

            // Skip if in "You might like" section
            if (isInYouMightLikeSection(cell)) {
                cell.dataset.processed = 'true';
                return;
            }

            try {
                // Get display name
                const displayName = getDisplayName(cell);

                // Get username
                const username = getUsername(cell);

                // Get URL
                const url = getProfileUrl(cell, username);

                // Check if mutual (has "Follows you" indicator)
                const followsYouIndicator = cell.querySelector('[data-testid="userFollowIndicator"]');

                // Create user object
                const userObject = {
                    displayName: displayName,
                    username: username,
                    url: url
                };

                // Add to appropriate array
                if (username) {
                    if (followsYouIndicator && !mutuals.some(m => m.username === username)) {
                        mutuals.push(userObject);
                    } else if (!followsYouIndicator && !nonMutuals.some(nm => nm.username === username)) {
                        nonMutuals.push(userObject);
                    }
                }

                // Mark as processed
                cell.dataset.processed = 'true';

                // Update status
                addStatusDiv();
            } catch (error) {
                console.error('Error processing user cell:', error);
            }
        });
    }

    // Function to initialize the observer
    function initObserver() {
        const observer = new MutationObserver(function() {
            if (isTrackerActive) {
                processUserCells();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial processing
        processUserCells();

        // Add status initially
        addStatusDiv();
    }

    // Initialize when page is loaded
    window.addEventListener('load', function() {
        setTimeout(initObserver, 1500);
    });

    // Also process on scroll and resize (for dynamic content)
    window.addEventListener('scroll', processUserCells);
    window.addEventListener('resize', processUserCells);

})();
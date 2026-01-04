// ==UserScript==
// @name         Old Reddit Karma & Account Age Display Next To Username
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows karma counts and account age next to Reddit usernames
// @author       greenwenvy
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_xmlhttpRequest
// @connect      reddit.com
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/531299/Old%20Reddit%20Karma%20%20Account%20Age%20Display%20Next%20To%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/531299/Old%20Reddit%20Karma%20%20Account%20Age%20Display%20Next%20To%20Username.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Determine if we're on old Reddit
    const isOldReddit = window.location.hostname === 'old.reddit.com';

    // Cache to avoid duplicate requests
    const userDataCache = {};

    // Function to get color based on account age
    function getAgeColor(createdDate) {
        const now = new Date();
        const created = new Date(createdDate * 1000);
        const ageInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

        // Color scheme based on account age
        if (ageInDays < 30) {
            return '#e74c3c'; // Red for new accounts (< 1 month)
        } else if (ageInDays < 180) {
            return '#e67e22'; // Orange for newer accounts (< 6 months)
        } else if (ageInDays < 365) {
            return '#f1c40f'; // Yellow for accounts < 1 year
        } else if (ageInDays < 365 * 2) {
            return '#27ae60'; // Green for accounts 1-2 years
        } else if (ageInDays < 365 * 5) {
            return '#3498db'; // Blue for accounts 2-5 years
        } else {
            return '#8e44ad'; // Purple for accounts > 5 years
        }
    }

    // Function to format the date difference
    function formatTimeDifference(createdDate) {
        const now = new Date();
        const created = new Date(createdDate * 1000);
        const diffYears = now.getFullYear() - created.getFullYear();
        const diffMonths = now.getMonth() - created.getMonth();

        if (diffYears > 0) {
            return diffYears + (diffYears === 1 ? 'y' : 'y');
        } else if (diffMonths > 0) {
            return diffMonths + (diffMonths === 1 ? 'm' : 'm');
        } else {
            const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            return diffDays + (diffDays === 1 ? 'd' : 'd');
        }
    }

    // Function to fetch user data
    function fetchUserData(username) {
        // Return cached data if available
        if (userDataCache[username]) {
            return Promise.resolve(userDataCache[username]);
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.reddit.com/user/${username}/about.json`,
                responseType: 'json',
                onload: function(response) {
                    if (response.status === 200 && response.response && response.response.data) {
                        // Cache the data
                        userDataCache[username] = response.response.data;
                        resolve(response.response.data);
                    } else {
                        reject('Failed to fetch user data');
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Function to add karma display
    function addKarmaDisplay(userElement, userData) {
        // Check if we've already added karma info to this element
        if (userElement.getAttribute('data-karma-added') === 'true') {
            return;
        }

        // Create the karma display element
        const karmaDisplay = document.createElement('span');
        karmaDisplay.className = 'karma-display';
        karmaDisplay.style.fontSize = '10px'; // Smaller font
        karmaDisplay.style.color = '#888';
        karmaDisplay.style.marginLeft = '4px';

        // Format the karma numbers to be more compact
        const postKarma = userData.link_karma >= 1000 ?
            (userData.link_karma / 1000).toFixed(1) + 'k' :
            userData.link_karma;

        const commentKarma = userData.comment_karma >= 1000 ?
            (userData.comment_karma / 1000).toFixed(1) + 'k' :
            userData.comment_karma;

        // Create the display text without account age first
        let displayText = `(${postKarma}|${commentKarma})`;
        karmaDisplay.innerHTML = displayText;

        // Add account age for old Reddit with color
        if (isOldReddit) {
            const accountAge = formatTimeDifference(userData.created);
            const ageSpan = document.createElement('span');
            ageSpan.textContent = `|${accountAge}`;
            ageSpan.style.color = getAgeColor(userData.created);

            karmaDisplay.innerHTML = `(${postKarma}|${commentKarma}`;
            karmaDisplay.appendChild(ageSpan);
            karmaDisplay.innerHTML += ')';
        }

        // Insert the karma display after the username
        userElement.parentNode.insertBefore(karmaDisplay, userElement.nextSibling);

        // Mark this element as processed
        userElement.setAttribute('data-karma-added', 'true');
    }

    // Main function to find and process usernames
    function processUsernames() {
        // Selectors for both old and new Reddit
        const userSelectors = isOldReddit ?
            '.author:not([data-karma-added="true"]):not([data-karma-added="processing"])' :
            'a[href^="/user/"]:not([data-karma-added="true"]):not([data-karma-added="processing"]):not([href*="/comments/"]):not([href*="/submit/"])';

        const userElements = document.querySelectorAll(userSelectors);

        userElements.forEach(userElement => {
            // Skip already processed elements
            if (userElement.getAttribute('data-karma-added') === 'true' ||
                userElement.getAttribute('data-karma-added') === 'processing') {
                return;
            }

            const username = userElement.textContent.trim();

            // Skip if username is empty, contains special characters, or is a system user
            if (!username ||
                username.includes('[') ||
                username.includes('deleted') ||
                username === 'AutoModerator') {
                userElement.setAttribute('data-karma-added', 'true'); // Mark as processed
                return;
            }

            // Mark as being processed to prevent duplicate processing
            userElement.setAttribute('data-karma-added', 'processing');

            fetchUserData(username)
                .then(userData => {
                    addKarmaDisplay(userElement, userData);
                })
                .catch(error => {
                    console.error('Error fetching data for', username, error);
                    // Mark as processed even on error to prevent retries
                    userElement.setAttribute('data-karma-added', 'true');
                });
        });
    }

    // Throttle function to limit how often processUsernames runs
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Throttled version of processUsernames
    const throttledProcessUsernames = throttle(processUsernames, 1000);

    // Run on page load after a short delay
    setTimeout(processUsernames, 1000);

    // Set up a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        // Check if any of the mutations might have added new user links
        let shouldProcess = false;
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            throttledProcessUsernames();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
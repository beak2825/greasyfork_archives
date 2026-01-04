// ==UserScript==
// @name         Twitter/X Chronological For You Feed
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Arrange Twitter "For You" feed in chronological order
// @author       MidniteRyder
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-end
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/543459/TwitterX%20Chronological%20For%20You%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/543459/TwitterX%20Chronological%20For%20You%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let observer = null;

    // Function to check if we're on the "For You" timeline
    function isForYouTimeline() {
        const url = window.location.href;
        return url.includes('/home') || url === 'https://twitter.com/' || url === 'https://x.com/';
    }

    // Function to extract timestamp from a tweet element
    function extractTimestamp(tweetElement) {
        try {
            // Look for the time element (this selector might need updates as Twitter changes)
            const timeElement = tweetElement.querySelector('time');
            if (timeElement && timeElement.dateTime) {
                return new Date(timeElement.dateTime);
            }
            
            // Fallback: try to find timestamp in various possible locations
            const timeSelectors = [
                'time[datetime]',
                '[datetime]',
                'a[href*="/status/"] time',
                '[data-testid="Time"] time'
            ];
            
            for (const selector of timeSelectors) {
                const element = tweetElement.querySelector(selector);
                if (element) {
                    const datetime = element.getAttribute('datetime') || element.getAttribute('title');
                    if (datetime) {
                        return new Date(datetime);
                    }
                }
            }
        } catch (error) {
            console.log('Error extracting timestamp:', error);
        }
        return null;
    }

    // Function to get all tweet articles in the timeline
    function getTweetElements() {
        // Twitter uses article elements for tweets
        const articles = document.querySelectorAll('article[data-testid="tweet"]');
        return Array.from(articles);
    }

    // Track sorted tweets to prevent re-sorting
    let sortedTweetIds = new Set();

    // Function to get tweet ID from element
    function getTweetId(tweetElement) {
        try {
            // Try to find the tweet ID from the URL in links
            const link = tweetElement.querySelector('a[href*="/status/"]');
            if (link) {
                const match = link.href.match(/\/status\/(\d+)/);
                if (match) return match[1];
            }
            
            // Fallback: use element's position as ID
            return Array.from(tweetElement.parentNode.children).indexOf(tweetElement);
        } catch (error) {
            return Math.random().toString(36);
        }
    }

    // Function to sort tweets chronologically using CSS order
    function sortTweetsChronologically() {
        if (isProcessing || !isForYouTimeline()) return;
        
        isProcessing = true;
        
        // Temporarily disconnect observer to prevent infinite loop
        if (observer) observer.disconnect();
        
        try {
            const tweets = getTweetElements();
            if (tweets.length < 2) {
                isProcessing = false;
                startObserver(); // Reconnect observer
                return;
            }

            // Check if we've already sorted these tweets
            const currentTweetIds = tweets.map(tweet => getTweetId(tweet));
            const alreadySorted = currentTweetIds.every(id => sortedTweetIds.has(id));
            
            if (alreadySorted && sortedTweetIds.size > 0) {
                isProcessing = false;
                startObserver(); // Reconnect observer
                return;
            }

            // Create array of tweets with their timestamps
            const tweetsWithTime = tweets.map((tweet, index) => {
                const timestamp = extractTimestamp(tweet);
                const tweetId = getTweetId(tweet);
                return {
                    element: tweet,
                    timestamp: timestamp,
                    id: tweetId,
                    originalIndex: index
                };
            }).filter(item => item.timestamp !== null);

            // Sort by timestamp (newest first)
            tweetsWithTime.sort((a, b) => b.timestamp - a.timestamp);

            // Use CSS flexbox order instead of DOM manipulation
            const container = tweets[0]?.parentNode;
            if (container) {
                // Set container to use flexbox with column direction
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                
                // Assign order values to sort tweets
                tweetsWithTime.forEach((item, index) => {
                    item.element.style.order = index;
                    sortedTweetIds.add(item.id);
                });
            }

            console.log(`Sorted ${tweetsWithTime.length} tweets chronologically using CSS order`);

        } catch (error) {
            console.error('Error sorting tweets:', error);
        }
        
        isProcessing = false;
        
        // Reconnect observer after a delay
        setTimeout(() => {
            startObserver();
        }, 1000);
    }

    // Function to start observing changes
    function startObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            let shouldSort = false;

            mutations.forEach((mutation) => {
                // Check if new tweet articles were added
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('article[data-testid="tweet"]')) {
                            shouldSort = true;
                        } else if (node.querySelector && node.querySelector('article[data-testid="tweet"]')) {
                            shouldSort = true;
                        }
                    }
                });
            });

            if (shouldSort) {
                // Debounce the sorting to avoid excessive processing
                setTimeout(() => {
                    sortTweetsChronologically();
                }, 500);
            }
        });

        // Start observing the document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to initialize the script
    function initialize() {
        if (!isForYouTimeline()) return;

        console.log('Twitter Chronological Feed script initialized');
        
        // Initial sort
        setTimeout(() => {
            sortTweetsChronologically();
        }, 2000);

        // Start observing for new tweets
        startObserver();
    }

    // Handle navigation changes (Twitter is a SPA)
    let currentUrl = window.location.href;
    function checkForUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            setTimeout(initialize, 1000);
        }
    }

    // Check for URL changes every second
    setInterval(checkForUrlChange, 1000);

    // Initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Add a manual sort button (optional)
    function addSortButton() {
        if (!isForYouTimeline() || document.getElementById('chronological-sort-btn')) return;

        const button = document.createElement('button');
        button.id = 'chronological-sort-btn';
        button.textContent = '🕒 Sort Chronologically';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background: #1d9bf0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        button.addEventListener('click', () => {
            sortTweetsChronologically();
            button.textContent = '✅ Sorted!';
            setTimeout(() => {
                button.textContent = '🕒 Sort Chronologically';
            }, 2000);
        });

        document.body.appendChild(button);
    }

    // Add the sort button after a delay
    setTimeout(addSortButton, 3000);

})();
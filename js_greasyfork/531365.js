// ==UserScript==
// @name nowcoder extend class
// @description  展开多少届。直观看到用户是多少届的
// @version  1.1
// @include  https://www.nowcoder.com/search/*
// @include  https://www.nowcoder.com/feed/main/detail/*
// @namespace    baojie.nowcoder
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531365/nowcoder%20extend%20class.user.js
// @updateURL https://update.greasyfork.org/scripts/531365/nowcoder%20extend%20class.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Cache to store user IDs and their graduation years
    const userCache = new Map();
    // Set to track user IDs that have been processed
    const processedUserIds = new Set();

    // Add CSS styles for graduation year display
    function addStyles() {
        // Check if styles already added
        if (document.getElementById('nowcoder-grad-year-styles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'nowcoder-grad-year-styles';
        styleElement.textContent = `
            .grad-year-display {
                color: #ff7830;
                margin-left: 5px;
                font-size: 12px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Extract user ID from element
    function getUserIdFromElement(element) {
        // For links with href attribute
        if (element.tagName === 'A' && element.href) {
            const match = element.href.match(/\/users\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        // For other elements, check parent or child links
        const link = element.closest('a[href*="/users/"]') || 
                     element.querySelector('a[href*="/users/"]');
        
        if (link) {
            const match = link.href.match(/\/users\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }

    // Display the graduation year next to the user name
    function displayGradYear(element, gradYear) {
        // Find the appropriate container
        const nameSpan = element.querySelector('.name-text');
        
        // Check if we already added to this specific element
        if (nameSpan.querySelector('.grad-year-display') || element.hasAttribute('data-grad-displayed')) {
            return;
        }
        
        // Create the graduation year display
        const gradYearElement = document.createElement('span');
        gradYearElement.className = 'grad-year-display';
        gradYearElement.textContent = `(${gradYear})`;
        gradYearElement.setAttribute('data-userid', element.getAttribute('data-userid'));
        
        // Add to the page
        nameSpan.appendChild(gradYearElement);
        
        // Mark this element as having the graduation year displayed
        element.setAttribute('data-grad-displayed', 'true');
    }

    // Fetch user info using GM_xmlhttpRequest
    function fetchUserInfo(userId) {
        return new Promise((resolve) => {
            const url = `https://gw-c.nowcoder.com/api/sparta/user/info/card/${userId}?_=${Date.now()}`;
            
            // Use GM_xmlhttpRequest directly, avoiding the unsafe header issue
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                    // Removed Referer header to avoid the 'unsafe header' error
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.data && data.data.workTime) {
                            resolve(data.data.workTime);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        console.error('Failed to parse response', e);
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    // Process a single user element
    async function processUserElement(element) {
        // Skip if already fully processed
        if (element.hasAttribute('data-grad-displayed')) {
            return;
        }
        
        const userId = getUserIdFromElement(element);
        if (!userId) {
            return;
        }
        
        // Store userId as data attribute to help with duplicate detection
        element.setAttribute('data-userid', userId);
        
        // Skip if already in progress for this user ID
        if (processedUserIds.has(userId)) {
            // If we already know this user's info, display it
            if (userCache.has(userId)) {
                displayGradYear(element, userCache.get(userId));
            }
            return;
        }
        
        // Mark as being processed
        processedUserIds.add(userId);
        
        // Check cache first
        if (userCache.has(userId)) {
            displayGradYear(element, userCache.get(userId));
            return;
        }
        
        // Fetch user info
        const gradYear = await fetchUserInfo(userId);
        if (gradYear) {
            userCache.set(userId, gradYear);
            
            // Update all instances of this user on the page
            document.querySelectorAll(`[data-userid="${userId}"]:not([data-grad-displayed])`).forEach(el => {
                displayGradYear(el, gradYear);
            });
        }
    }

    // Process all user elements visible on the page
    function processVisibleElements() {
        // Find all user name links
        document.querySelectorAll('a[href*="/users/"]').forEach(link => {
            if (link.closest('.user-nickname') || link.querySelector('.name-text')) {
                processUserElement(link);
            }
        });
    }

    // Simple debounce function
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Initialize
    function init() {
        console.log('Nowcoder graduation year display script initialized');
        addStyles();
        
        // Initial processing with a short delay
        setTimeout(processVisibleElements, 500);
        
        // Process on scroll (debounced)
        window.addEventListener('scroll', debounce(processVisibleElements, 300));
        
        // Process on content changes
        const observer = new MutationObserver(debounce(mutations => {
            let hasNewNodes = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                }
            });
            
            if (hasNewNodes) {
                processVisibleElements();
            }
        }, 300));
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run after page has loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         Remove Xiaohongshu Recommended Feeds
// @name:zh-CN   移除小红书首页的个性化推送
// @description  Automatically removes recommended content from Xiaohongshu homepage
// @description:zh-CN  当访问小红书首页时自动移除个性化推送
// @namespace    https://github.com/
// @version      1.2.0.20250429
// @author       Konano
// @homepageURL  https://github.com/Konano/greasyfork-script
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534356/Remove%20Xiaohongshu%20Recommended%20Feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/534356/Remove%20Xiaohongshu%20Recommended%20Feeds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DOM MANIPULATION SECTION
    // -----------------------

    // Function to remove recommended feed elements
    function removeRecommendedElements() {
        // Track removed elements to avoid processing them multiple times
        const elementsToRemove = [
            { selector: '#exploreFeeds', logMessage: 'Removed exploreFeeds element' },
            { selector: '#homefeed_recommend', logMessage: 'Removed homefeed_recommend element' },
            { selector: '[id^="homefeed."]', logMessage: 'Removed element with ID starting with "homefeed."', isQuerySelector: true }
        ];

        elementsToRemove.forEach(item => {
            const elements = item.isQuerySelector ?
                document.querySelectorAll(item.selector) :
                [document.querySelector(item.selector)].filter(Boolean);

            elements.forEach(element => {
                if (!element.dataset.removed) {
                    element.remove();
                    console.log(item.logMessage);
                    element.dataset.removed = 'true';
                }
            });
        });
    }

    // Execute after page load
    window.addEventListener('load', removeRecommendedElements);

    // Monitor DOM changes to remove newly added elements
    const domObserver = new MutationObserver(removeRecommendedElements);
    domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // INITIAL STATE MODIFICATION SECTION
    // ---------------------------------

    // Process inline script content to remove feed data
    function processScriptContent(scriptElement) {
        const content = scriptElement.textContent || '';

        if (content.includes('window.__INITIAL_STATE__')) {
            console.log('Found INITIAL_STATE script!');

            // Remove feed data from the script content
            scriptElement.textContent = scriptElement.textContent.replace(
                /"feeds":\[\{.*?\}\],"currentChannel"/g,
                '"feeds":[],"currentChannel"'
            );

            // Log the modified state if available
            if (window.__INITIAL_STATE__) {
                console.log('Modified INITIAL_STATE');
            }
        }

        return scriptElement;
    }

    // Monitor for script elements being added to the page
    const scriptObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'SCRIPT') {
                        processScriptContent(node);
                    } else if (node.querySelectorAll) {
                        const scripts = node.querySelectorAll('script');
                        scripts.forEach(script => processScriptContent(script));

                        // // Check if state is available and log feeds
                        // if (window.__INITIAL_STATE__?.feed) {
                        //     console.log('Current feed state:', window.__INITIAL_STATE__.feed.feeds);
                        // }
                    }
                }
            }
        }
    });

    scriptObserver.observe(document, {
        childList: true,
        subtree: true
    });

    // NETWORK REQUEST INTERCEPTION SECTION
    // ----------------------------------

    // Empty response for blocked requests
    const emptyFeedResponse = '{"success":true,"data":{"items":[]}}';

    // Block fetch requests to homefeed endpoint
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (typeof input === 'string' &&
            input.endsWith('/homefeed') &&
            init?.method?.toUpperCase() === 'POST') {

            console.log('Blocked fetch request to ' + input);
            return Promise.resolve(new Response(emptyFeedResponse, {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            }));
        }
        return originalFetch.apply(this, arguments);
    };

    // Block XMLHttpRequest to homefeed endpoint
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        const xhr = this;

        if (typeof url === 'string' &&
            url.endsWith('/homefeed') &&
            method.toUpperCase() === 'POST') {

            xhr._blockedHomefeed = true;
            console.log('Blocked XMLHttpRequest to ' + url);

            // Override send method for this specific XHR instance
            xhr.send = function() {
                setTimeout(function() {
                    // Set up fake successful response
                    Object.defineProperty(xhr, 'responseText', {
                        value: emptyFeedResponse,
                        writable: false
                    });
                    Object.defineProperty(xhr, 'status', {
                        value: 200,
                        writable: false
                    });

                    // Trigger appropriate callbacks
                    if (xhr.onreadystatechange) {
                        Object.defineProperty(xhr, 'readyState', { value: 4 });
                        xhr.onreadystatechange();
                    }
                    if (xhr.onload) xhr.onload();

                    // Dispatch events
                    xhr.dispatchEvent(new Event('load'));
                    xhr.dispatchEvent(new Event('loadend'));
                }, 0);
            };
        }

        return originalOpen.apply(this, arguments);
    };
})();

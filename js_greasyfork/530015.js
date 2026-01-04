// ==UserScript==
// @name         Enhanced Pinterest Page Title with Username and Alt Text
// @version      3.4
// @description  Replace the page title with the user profile name, username, post title and auto alt text on Pinterest
// @author       wolffgang
// @match        *://*.pinterest.*/*
// @grant        none
// @run-at       document-end
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/530015/Enhanced%20Pinterest%20Page%20Title%20with%20Username%20and%20Alt%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/530015/Enhanced%20Pinterest%20Page%20Title%20with%20Username%20and%20Alt%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cachedData = null;
    let lastParsedUrl = '';
    let desiredTitle = null;
    let isUpdatingTitle = false; // Prevent re-entry

    function findKey(obj, targetKey, depth = 0) {
        if (depth > 4 || !obj || typeof obj !== 'object') return undefined;
        if (targetKey in obj) return obj[targetKey];

        for (const key in obj) {
            const result = findKey(obj[key], targetKey, depth + 1);
            if (result !== undefined) return result;
        }
        return undefined;
    }

    function extractPinData() {
        const currentUrl = location.href;
        if (cachedData && lastParsedUrl === currentUrl) return cachedData;

        try {
            // Method 1: __PWS_INITIAL_PROPS__ (primary method)
            const scriptElement = document.getElementById('__PWS_INITIAL_PROPS__');
            if (scriptElement?.textContent) {
                const data = JSON.parse(scriptElement.textContent);

                if (data.initialReduxState?.pins) {
                    const pinData = data.initialReduxState.pins[Object.keys(data.initialReduxState.pins)[0]];
                    if (pinData) {
                        cachedData = {
                            fullName: pinData.native_creator?.full_name,
                            username: pinData.native_creator?.username,
                            title: pinData.closeup_unified_title || pinData.title,
                            altText: pinData.auto_alt_text
                        };
                        lastParsedUrl = currentUrl;
                        return cachedData;
                    }
                }

                const resources = data.resources || {};
                for (const key in resources) {
                    const response = resources[key]?.response?.data;
                    if (!response) continue;

                    if (response.pin) {
                        cachedData = {
                            fullName: response.pin.pinner?.full_name || findKey(response, 'full_name'),
                            username: response.pin.pinner?.username || findKey(response, 'username'),
                            title: response.pin.title || response.pin.description,
                            altText: response.pin.alt_text || response.pin.auto_alt_text
                        };
                        lastParsedUrl = currentUrl;
                        return cachedData;
                    }

                    if (response.user) {
                        cachedData = {
                            fullName: response.user.full_name,
                            username: response.user.username,
                            title: 'Pinterest Profile',
                            altText: null
                        };
                        lastParsedUrl = currentUrl;
                        return cachedData;
                    }
                }
            }

            // Method 2: __NEXT_DATA__ (fallback)
            const nextData = window.__NEXT_DATA__?.props?.pageProps;
            if (nextData?.pins?.[0]) {
                const pin = nextData.pins[0];
                cachedData = {
                    fullName: pin.pinner?.full_name,
                    username: pin.pinner?.username,
                    title: pin.title || pin.description,
                    altText: pin.alt_text || pin.auto_alt_text
                };
                lastParsedUrl = currentUrl;
                return cachedData;
            }

            if (nextData?.user) {
                cachedData = {
                    fullName: nextData.user.full_name,
                    username: nextData.user.username,
                    title: 'Pinterest Profile',
                    altText: null
                };
                lastParsedUrl = currentUrl;
                return cachedData;
            }

            // Method 3: Meta tags (last resort)
            const metaTitle = document.querySelector('meta[property="og:title"]')?.content;
            if (metaTitle) {
                cachedData = {
                    fullName: null,
                    username: null,
                    title: metaTitle,
                    altText: document.querySelector('meta[property="og:description"]')?.content
                };
                lastParsedUrl = currentUrl;
                return cachedData;
            }
        } catch (e) {
            console.error('Pinterest title extractor error:', e);
        }

        return null;
    }

    function updateTitle() {
        if (isUpdatingTitle) return false; // Prevent re-entry

        const data = extractPinData();
        if (!data) return false;

        const parts = [];

        // Always include user info if available
        if (data.fullName && data.username) {
            parts.push(`${data.fullName} (${data.username})`);
        } else if (data.username) {
            parts.push(`(${data.username})`);
        }

        // Only add title if it's not just emojis/whitespace or if we have no user info
        if (data.title) {
            const titleText = data.title.trim();
            // Check if title has at least some alphanumeric content
            if (/[a-zA-Z0-9]/.test(titleText) || parts.length === 0) {
                parts.push(titleText);
            }
        }

        if (data.altText) parts.push(data.altText);

        if (parts.length) {
            const newTitle = parts.join(' - ');
            if (newTitle !== desiredTitle) {
                isUpdatingTitle = true;
                desiredTitle = newTitle;
                document.title = desiredTitle;
                setTimeout(() => { isUpdatingTitle = false; }, 100);
            }
            return true;
        }
        return false;
    }

    // Single title protection mechanism - only fires when title changes externally
    const titleObserver = new MutationObserver(() => {
        if (!isUpdatingTitle && desiredTitle && document.title !== desiredTitle) {
            isUpdatingTitle = true;
            document.title = desiredTitle;
            setTimeout(() => { isUpdatingTitle = false; }, 100);
        }
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }

    function onPageChange() {
        cachedData = null;
        desiredTitle = null;

        if (updateTitle()) return;

        // Retry with exponential backoff
        [150, 400, 800].forEach(delay => {
            setTimeout(() => {
                if (!desiredTitle) updateTitle();
            }, delay);
        });
    }

    let lastUrl = location.href;
    let urlCheckTimeout = null;

    // CRITICAL FIX: Only check URL periodically, not on every mutation
    function checkUrlChange() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            onPageChange();
        }
    }

    // Poll for URL changes instead of using MutationObserver on body
    setInterval(checkUrlChange, 500);

    // Listen for history changes (catches most navigation)
    window.addEventListener('popstate', onPageChange);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(onPageChange, 0);
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(onPageChange, 0);
    };

    onPageChange();
})();
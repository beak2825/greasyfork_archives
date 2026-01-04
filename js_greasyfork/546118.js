// ==UserScript==
// @name         Affiliate Cleaner
// @name:zh-CN   AFF/REF链接自动清理
// @description:zh-CN 在全部网页中尽可能删除值为整数或UUID的AFF/REF相关参数和链接，包括POST请求，并处理路径中的AFF链接。
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Removes affiliate tracking parameters from links, the current URL, cookies, and outgoing POST requests. Handles both query and path-based trackers.
// @author       0x7
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546118/Affiliate%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/546118/Affiliate%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Matches parameters starting with 'aff' or 'ref' (case-insensitive)
    const AFFILIATE_PARAM_REGEX = /^(aff|ref)/i;
    // Matches values that are purely integers
    const INTEGER_VALUE_REGEX = /^\d+$/;
    // Matches values that are in UUID format (case-insensitive)
    const UUID_VALUE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Matches affiliate patterns embedded in the URL path, like 'aff.php?aff=123/'
    const AFFILIATE_PATH_REGEX = /aff\.php\?aff=\d+\//i;


    /**
     * Checks if a URL parameter key and value match the affiliate tracking pattern for query parameters.
     * @param {string} key - The parameter key.
     * @param {string} value - The parameter value.
     * @returns {boolean} - True if it's an affiliate parameter to be removed.
     */
    const isAffiliateParam = (key, value) => {
        if (!AFFILIATE_PARAM_REGEX.test(key)) {
            return false;
        }
        // Check if the value is either an integer or a UUID
        return INTEGER_VALUE_REGEX.test(value) || UUID_VALUE_REGEX.test(value);
    };

    /**
     * Cleans a URL by removing specified affiliate tracking parameters from the path and query string.
     * @param {string} urlString - The URL to clean.
     * @returns {string} - The cleaned URL.
     */
    const cleanUrl = (urlString) => {
        let currentUrl = urlString;

        // --- Part 1: Clean Path-based Affiliate Links ---
        if (AFFILIATE_PATH_REGEX.test(currentUrl)) {
            currentUrl = currentUrl.replace(AFFILIATE_PATH_REGEX, '');
            console.log(`[Affiliate Cleaner] Removed path segment from URL: ${urlString}`);
        }

        // --- Part 2: Clean Query-based Affiliate Links ---
        try {
            const url = new URL(currentUrl);
            let paramsChanged = false;
            const newParams = new URLSearchParams();

            url.searchParams.forEach((value, key) => {
                if (!isAffiliateParam(key, value)) {
                    newParams.append(key, value);
                } else {
                    paramsChanged = true;
                    console.log(`[Affiliate Cleaner] Removed query param: ${key}=${value} from URL: ${url.hostname}`);
                }
            });

            if (paramsChanged) {
                url.search = newParams.toString();
                return url.toString();
            }

            // If we are here, either only the path was changed, or nothing was changed.
            // Returning url.toString() handles both cases correctly.
            return url.toString();

        } catch (e) {
            // This might happen for "javascript:void(0)" or if path cleaning resulted in an invalid URL.
            // Return the URL after path cleaning, as it's our best effort.
            return currentUrl;
        }
    };

    /**
     * Cleans the current page's URL in the address bar without reloading.
     */
    const cleanCurrentUrl = () => {
        const originalUrl = window.location.href;
        const cleanedUrl = cleanUrl(originalUrl);
        if (originalUrl !== cleanedUrl) {
            window.history.replaceState(null, '', cleanedUrl);
            console.log('[Affiliate Cleaner] Cleaned current page URL.');
        }
    };

    /**
     * Scans and cleans all <a> tags currently in the DOM.
     */
    const cleanAllLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            if (link.href) {
                const originalHref = link.href;
                const cleanedHref = cleanUrl(originalHref);
                if (originalHref !== cleanedHref) {
                    link.href = cleanedHref;
                }
            }
        });
    };

    /**
     * Removes cookies whose names match the affiliate pattern.
     * This is a best-effort attempt, as domain/path specifics can be tricky.
     */
    const cleanCookies = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            // This part is interpretive: we assume the cookie *name* starts with 'aff' or 'ref'.
            if (AFFILIATE_PARAM_REGEX.test(name)) {
                const domain = window.location.hostname;
                const path = '/';
                // Expire the cookie by setting its date to the past.
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; path=${path};`;
                // Attempt to remove from parent domain as well
                const parentDomain = domain.substring(domain.indexOf('.') + 1);
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${parentDomain}; path=${path};`;
                console.log(`[Affiliate Cleaner] Removed cookie: ${name}`);
            }
        }
    };

    /**
     * Cleans data objects for POST requests (FormData, URLSearchParams, or JSON).
     * @param {*} data - The data to be sent.
     * @returns {*} - The cleaned data.
     */
    const cleanRequestData = (data) => {
        if (data instanceof URLSearchParams || data instanceof FormData) {
            const keysToDelete = [];
            for (const [key, value] of data.entries()) {
                if (typeof value === 'string' && isAffiliateParam(key, value)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach(key => {
                data.delete(key);
                console.log(`[Affiliate Cleaner] Removed param from POST data: ${key}`);
            });
        } else if (typeof data === 'string') {
            try {
                // Attempt to parse as JSON
                const jsonData = JSON.parse(data);
                let dataChanged = false;
                for (const key in jsonData) {
                    if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                        const value = jsonData[key];
                        if ((typeof value === 'number' || typeof value === 'string') && isAffiliateParam(key, String(value))) {
                            delete jsonData[key];
                            dataChanged = true;
                            console.log(`[Affiliate Cleaner] Removed param from JSON POST data: ${key}`);
                        }
                    }
                }
                if (dataChanged) {
                    return JSON.stringify(jsonData);
                }
            } catch (e) {
                // Not a JSON string, could be URL-encoded string.
                const params = new URLSearchParams(data);
                const cleanedParams = cleanUrl(`http://dummy.com?${params.toString()}`).split('?')[1] || '';
                if (cleanedParams !== params.toString()) {
                    return cleanedParams;
                }
            }
        }
        return data;
    };

    /**
     * Intercept fetch requests to clean their body.
     */
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (init && init.body && init.method && init.method.toUpperCase() === 'POST') {
            init.body = cleanRequestData(init.body);
        }
        return originalFetch.apply(this, arguments);
    };

    /**
     * Intercept XMLHttpRequest to clean the data sent.
     */
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (body) {
            body = cleanRequestData(body);
        }
        return originalSend.apply(this, [body]);
    };

    // --- Main Execution ---

    // 1. Clean the URL as soon as the script runs. This handles the 302 redirect case upon arrival.
    cleanCurrentUrl();
    cleanCookies();

    // 2. When the initial DOM is loaded, clean all links.
    document.addEventListener('DOMContentLoaded', () => {
        cleanAllLinks();
    });

    // 3. Set up a MutationObserver to clean links added to the page dynamically.
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // We only care about element nodes
                    if (node.nodeType === 1) {
                        // Check if the node itself is a link
                        if (node.tagName === 'A' && node.href) {
                            node.href = cleanUrl(node.href);
                        }
                        // Check for any links within the added node
                        node.querySelectorAll('a').forEach(link => {
                            if (link.href) {
                                link.href = cleanUrl(link.href);
                            }
                        });
                    }
                });
            }
        });
    });

    // Start observing the entire document body for changes.
    // Use a try-catch in case the body isn't ready immediately on some pages.
    const observeBody = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            // If body is not available, wait for it.
            window.addEventListener('DOMContentLoaded', () => {
                 observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    };

    observeBody();

    const origSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (this.tagName === 'A' && name === 'href' && typeof value === 'string') {
            value = cleanUrl(value);
        }
        return origSetAttribute.call(this, name, value);
    };

    const hrefDesc = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
    Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
        set: function(v) {
            hrefDesc.set.call(this, cleanUrl(v));
        },
        get: hrefDesc.get
    });
    cleanAllLinks();
})();

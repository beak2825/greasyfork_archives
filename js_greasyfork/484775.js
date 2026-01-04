// ==UserScript==
// @name         Redirect Reddit URLs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect any Reddit domain that isn't "old" to old.reddit.com while keeping the rest of the URL. Remove string after the last / in old.reddit.com URLs. Integrate shouldExcludePath function.
// @author       You
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484775/Redirect%20Reddit%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/484775/Redirect%20Reddit%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeDotsFromPath() {
        const host = window.location.host;
        const path = window.location.pathname;
        if (host === "old.reddit.com") {
            if (path.includes("/domain/")) {
                const newPath = path.replace(/\.[a-z]+$/, '');
                const newUrl = `https://${host}${newPath}${window.location.search}${window.location.hash}`;
                if (newUrl !== window.location.href) {
                    window.location.replace(newUrl);
                }
            } else if (path.includes(".")) {
                const newPath = path.replace(/\.[a-z]+$/, '');
                const newUrl = `https://${host}${newPath}${window.location.search}${window.location.hash}`;
                if (newUrl !== window.location.href) {
                    window.location.replace(newUrl);
                }
            }
        }
    }

    function shouldExcludePath(path) {
        // Define paths to exclude
        const excludePaths = ['/poll/', '/gallery/', '/media'];

        // Check if the path contains any excluded substring and is not preceded by "/r"
        return excludePaths.some(exclude => path.includes(exclude) && !path.includes('/r' + exclude));
    }

    function redirectNonOldDomains() {
        const host = window.location.host;
        const path = window.location.pathname;
        const nonOldDomainRegex = /^(?!old\.)/;
        if (nonOldDomainRegex.test(host) && !shouldExcludePath(path)) {
            window.location.href = 'https://old.reddit.com' + window.location.pathname + window.location.search + window.location.hash;
        }
    }

    function redirectToOldRedditIfNotOnOldOrRedditOrTwoLetterDomain() {
        const host = window.location.host;
        const path = window.location.pathname;

        if (
            host === "www.reddit.com" &&
            !shouldExcludePath(path)
        ) {
            redirectToOldReddit();
        } else if (host === "old.reddit.com" && shouldExcludePath(path)) {
            const newUrl = `https://www.reddit.com${path}${window.location.search}${window.location.hash}`;
            window.location.replace(newUrl);
        }
    }

    function redirectToOldReddit() {
        window.location.href = 'https://old.reddit.com' + window.location.pathname + window.location.search + window.location.hash;
    }

    // Call the functions
    removeDotsFromPath();
    redirectNonOldDomains();
    redirectToOldRedditIfNotOnOldOrRedditOrTwoLetterDomain();
})();

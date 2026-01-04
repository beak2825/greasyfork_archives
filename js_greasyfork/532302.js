// ==UserScript==
// @name         OnlyFans/Fansly to Coomer Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects OnlyFans/Fansly profiles to Coomer.su
// @author       droopy
// @match        *://onlyfans.com/*
// @match        *://fansly.com/*
// @match        *://*.fansly.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532302/OnlyFansFansly%20to%20Coomer%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/532302/OnlyFansFansly%20to%20Coomer%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleOnlyFans() {
        const path = window.location.pathname;
        const profilePattern = /^\/([^\/]+)$/;
        const match = path.match(profilePattern);

        if (match) {
            const username = match[1];
            window.location.replace('https://coomer.su/onlyfans/user/' + username);
        }
    }

    function handleFansly() {
        const originalFetch = window.fetch;
        window.fetch = async function(url, options) {
            if (url.includes('apiv3.fansly.com/api/v1/account?usernames=')) {
                try {
                    const response = await originalFetch(url, options);
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    // Compatibility fix: Replace optional chaining with traditional checks
                    if (data && data.response && data.response[0] && data.response[0].id) {
                        const accountId = data.response[0].id;
                        window.location.replace('https://coomer.su/fansly/user/' + accountId);
                    }
                    return response;
                } catch (error) {
                    console.error('Error intercepting Fansly API:', error);
                    return originalFetch(url, options);
                }
            }
            return originalFetch(url, options);
        };

        const fanslyPathMatch = window.location.pathname.match(/^\/([^\/]+)\/posts/);
        if (fanslyPathMatch) {
            const username = fanslyPathMatch[1];
            fetch('https://apiv3.fansly.com/api/v1/account?usernames=' + username + '&ngsw-bypass=true');
        }
    }

    if (window.location.hostname.includes('onlyfans.com')) {
        handleOnlyFans();
    } else if (window.location.hostname.includes('fansly.com')) {
        handleFansly();
    }
})();
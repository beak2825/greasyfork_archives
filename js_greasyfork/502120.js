// ==UserScript==
// @name         Paimon.moe Wish Import fix
// @namespace    https://jogerj.com
// @version      0.2.0
// @description  Modify request body to api.paimon.moe/corsproxy on paimon.moe
// @author       JogerJ
// @match        https://paimon.moe/wish/import*
// @downloadUrl  https://gist.github.com/jogerj/5ab40acfb77e0fd3c89de7c798a3b4b8/raw/paimon-moe-fix-wish-import.user.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502120/Paimonmoe%20Wish%20Import%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/502120/Paimonmoe%20Wish%20Import%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.warn('JogerJ: Wish import requests will be intercepted!');
    // Store the original fetch function
    const originalFetch = window.fetch;
    // Override the global fetch function
    window.fetch = async (...args) => {
        let [resource, init] = args;
        // Intercept corsproxy requests
        if (resource &&
            typeof resource === 'string' &&
            resource.includes('https://api.paimon.moe/corsproxy') &&
            init &&
            init.method === 'POST'
           ) {
            init.body = init.body.replace('hk4e-api-os\.hoyoverse\.com', 'public-operation-hk4e-sg.hoyoverse.com')
        }
        // Call the original fetch function with modified body
        return originalFetch(resource, init);
    };
})();

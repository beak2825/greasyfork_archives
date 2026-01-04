// ==UserScript==
// @name         Speedrun.com Site Admin UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gives admin UI (gives verifiers of games the "Automatically Verify Run" UI most importantly lol)
// @author       retrozy
// @match        *://www.speedrun.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534113/Speedruncom%20Site%20Admin%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/534113/Speedruncom%20Site%20Admin%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
        const url = (typeof input === 'string') ? input : input.url;

        if (url.includes('/api/v2/GetSession')) {
            console.log('[Tampermonkey] Intercepted GetSession request:', url);

            const response = await originalFetch.apply(this, arguments);

            const clonedResponse = response.clone();

            const json = await clonedResponse.json();

            if (json.session.user) {
                json.session.user.powerLevel = 5;
            }

            const modifiedResponse = new Response(JSON.stringify(json), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });

            return modifiedResponse;
        }

        return originalFetch.apply(this, arguments);
    };
})();

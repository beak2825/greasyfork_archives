// ==UserScript==
// @name         pkmn.gg Pro
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Unlocks several Pro features such as "Binder View"
// @match        *://*.pkmn.gg/*
// @grant        none
// @esversion    8
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/532785/pkmngg%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/532785/pkmngg%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUrl = 'api/auth/session';
    const originalFetch = window.fetch;

    window.fetch = async function(resource, init) {
        const url = typeof resource === 'string' ? resource : resource.url;

        if (url.includes(targetUrl) && (!init || !init.method || init.method.toUpperCase() === 'GET')) {
            const response = await originalFetch(resource, init);
            const clonedResponse = response.clone();

            try {
                const data = await clonedResponse.json();
                data.user.roles.push({ roleName: 'subscriber' });

                const modifiedResponse = new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });

                return modifiedResponse;
            } catch (error) {
                console.error('VioletMonkey: Error modifying session response:', error);
                return response;
            }
        }
        return originalFetch.apply(this, arguments);
    };
})();
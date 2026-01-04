// ==UserScript==
// @name         Misskey Auto-Unblur Sensitive Image (Open in New Tab)
// @namespace    https://your.domain/
// @version      3.0
// @description  Replaces blurred images and opens real image in a new tab
// @match        *://*/notes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535027/Misskey%20Auto-Unblur%20Sensitive%20Image%20%28Open%20in%20New%20Tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535027/Misskey%20Auto-Unblur%20Sensitive%20Image%20%28Open%20in%20New%20Tab%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Misskey Revealer] Script Loaded');

    // Monkey-patch fetch to intercept API responses
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        if (args[0].includes('/api/notes/show')) {
            const clone = response.clone();
            clone.json().then(json => {
                if (json?.files?.length > 0) {
                    json.files.forEach(file => {
                        console.log('[Misskey Revealer] Found file:', file.name, file.url);

                        // Open the unblurred image in a new tab
                        window.open(file.url, '_blank');
                        console.log('[Misskey Revealer] Opened unblurred image in new tab:', file.url);
                    });
                }
            }).catch(e => console.warn('[Misskey Revealer] Error parsing JSON:', e));
        }

        return response;
    };
})();

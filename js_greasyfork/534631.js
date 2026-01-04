// ==UserScript==
// @name         Rosetta Stone Fake Time Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercepts time sent to the server and replaces it with fake value
// @author       Dev
// @match        https://login.rosettastone.com/launchpad*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534631/Rosetta%20Stone%20Fake%20Time%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/534631/Rosetta%20Stone%20Fake%20Time%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        if (init && init.body && typeof init.body === 'string' && init.body.includes('duration')) {
            try {
                let body = JSON.parse(init.body);
                if (body.duration) {
                    body.duration += 3600; // زيادة ساعة (بالثواني)
                    init.body = JSON.stringify(body);
                    console.log('[FakeTime] duration modified to:', body.duration);
                }
            } catch (e) {
                console.warn('[FakeTime] Error parsing request body:', e);
            }
        }
        return originalFetch.apply(this, arguments);
    };
})();
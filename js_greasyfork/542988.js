// ==UserScript==
// @name         Supersport Rugby Match to API Redirect
// @namespace    https://supersport.com/
// @version      1.0
// @description  Redirect rugby match page to API stats URL
// @author       JV
// @license      MIT
// @match        https://supersport.com/rugby/match/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542988/Supersport%20Rugby%20Match%20to%20API%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542988/Supersport%20Rugby%20Match%20to%20API%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const match = window.location.href.match(/\/rugby\/match\/([a-f0-9\-]{36})/i);
    if (match && match[1]) {
        const matchId = match[1];
        const apiUrl = `https://supersport.com/apix/rugby/v5.1/match/${matchId}/stats`;
        window.location.href = apiUrl;
    }
})();
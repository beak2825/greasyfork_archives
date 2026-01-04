// ==UserScript==
// @name         Show youtube transcript by default
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  display the youtube transcript by default
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471805/Show%20youtube%20transcript%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/471805/Show%20youtube%20transcript%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const transcripts = document.querySelectorAll('[target-id="engagement-panel-searchable-transcript"]');
        if(transcripts.length == 1) {
            const transcript = transcripts[0];
            transcript.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            console.log('transcript should show up now...');
        }
    }, "3000"); // wait for 3 seconds (hopefully sufficient for all the necessary elements to load) - adjust this based on your internet speed
})();
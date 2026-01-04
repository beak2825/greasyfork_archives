// ==UserScript==
// @name         Show Downvote - Reddit
// @namespace    immature_llama
// @version      0.91
// @description  Attempts to show the downvote and upvote arrows on subreddits that hide it.
// @author       StereoBucket
// @match        *://*.reddit.com/r/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/392838/Show%20Downvote%20-%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/392838/Show%20Downvote%20-%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
`
body.loggedin div.arrow.down,
body.loggedin div.arrow.up,
body.loggedin div.arrow.downmod,
body.loggedin div.arrow.upmod,
body.loggedin div.midcol
    {
     display: block !important;
     visibility: visible !important;
     pointer-events: auto !important;
    }
`);
})();
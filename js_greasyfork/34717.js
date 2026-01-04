// ==UserScript==
// @name           highlight_anchor_target
// @namespace      https://greasyfork.org/de/users/157797-lual
// @match          *://*/*
// @version        1.0
// @description	   if url contains a target, the anchor in the site will be highlighted
// @author         lual
// @grant          GM_addStyle
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2378F48F" stroke="%231B6329" stroke-width="2" /> <text x="50" y="50" font-family="Arial, sans-serif" font-size="90" fill="%23000000" text-anchor="middle" dominant-baseline="central">%23</text></svg>
// @downloadURL https://update.greasyfork.org/scripts/34717/highlight_anchor_target.user.js
// @updateURL https://update.greasyfork.org/scripts/34717/highlight_anchor_target.meta.js
// ==/UserScript==
//
// Some URIs refer to a location within a document.
// This kind of URI ends with "#" followed by an anchor identifier (called the fragment identifier).
// This script will highligt the anchor in the document.
//
// For fundamentals and as an example for using this script - see...
//   http://www.w3.org/TR/html401/intro/intro.html#fragment-uri
//
//
// changes:        2011-03-17 initial
//                 2017-11-01 publish on greasyfork
//                 2022-11-10 convert deprecated @include to @match
//                 2024-10-16 improve @match
/////////////////////////////////////////////////////////////////////////////////////////////////////////
if (document.contentType === 'text/html') {
    // Proceed with the script only for HTML content (ignore XML, JSON, etc.)
    (function() {
        'use strict';
        GM_addStyle(`
      :target {
        color: black !important;
        background-color: #78F48F !important;
        border: 1px solid #27A53F !important;
        border-bottom: 1px solid #1B6329 !important;
        border-right: 1px solid #1B6329 !important;
        border-radius: 3px;
      }`);

    })();
}

// ==UserScript==
// @name         Rule34 Blacklisted Element Blocker
// @namespace    Vshal
// @version      1.0
// @description  Blocks blacklisted elements on Rule34 website for a cleaner browsing experience
// @match        *://rule34.xxx/*
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/469430/Rule34%20Blacklisted%20Element%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/469430/Rule34%20Blacklisted%20Element%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the CSS rule to hide the elements
    var css = '.blacklisted-image.thumb, span.blacklisted-image { display: none !important; }';

    // Add the CSS rule
    GM_addStyle(css);
})();

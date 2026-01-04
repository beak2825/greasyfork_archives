// ==UserScript==
// @name         Append UwU Parameter to .dev Domains
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Appends /?uwu=true to any .dev domain URLs
// @author       soda3x
// @match        *://*.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494549/Append%20UwU%20Parameter%20to%20dev%20Domains.user.js
// @updateURL https://update.greasyfork.org/scripts/494549/Append%20UwU%20Parameter%20to%20dev%20Domains.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if URL already has a uwu parameter
    var url = new URL(window.location.href);
    if (!url.searchParams.has('uwu')) {
        // If uwu parameter doesn't exist, append "?uwu=true"
        url.searchParams.append('uwu', 'true');
        window.location.href = url.href;
    }
})();
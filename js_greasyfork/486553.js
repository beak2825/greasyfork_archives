// ==UserScript==
// @name         V2EX Redirect to www
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect all V2EX pages to www subdomain
// @author       Xiniah
// @match        *://*.v2ex.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486553/V2EX%20Redirect%20to%20www.user.js
// @updateURL https://update.greasyfork.org/scripts/486553/V2EX%20Redirect%20to%20www.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentLocation = window.location;
    if (!currentLocation.hostname.startsWith('www.') && !currentLocation.hostname.startsWith('v2ex') && !currentLocation.hostname.startsWith('cdn')) {
        const wwwLocation = currentLocation.protocol + '//www.' + currentLocation.hostname.replace(/^.*?\./, '') + currentLocation.pathname + currentLocation.search + currentLocation.hash;
        window.location.replace(wwwLocation);
    }
})();

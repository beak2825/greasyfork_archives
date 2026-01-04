// ==UserScript==
// @name         CSFD.cz -> CSFD.sk Redirect
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  Redirects all csfd.cz pages to csfd.sk
// @author       pystik
// @match        *://*.csfd.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535970/CSFDcz%20-%3E%20CSFDsk%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/535970/CSFDcz%20-%3E%20CSFDsk%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current host parts
    const hostParts = window.location.hostname.split('.');

    // Replace Czech TLD with Slovak TLD
    hostParts[hostParts.length - 1] = 'sk';
    const newHost = hostParts.join('.');

    // Preserve path and parameters
    const newURL = window.location.protocol + '//' + newHost + window.location.pathname + window.location.search + window.location.hash;

    // Perform redirect
    window.location.replace(newURL);
})();
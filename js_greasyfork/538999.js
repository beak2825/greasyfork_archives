// ==UserScript==
// @name         FFXIV Language redirect
// @namespace    FFXIV redirect
// @version      1.0
// @description  Redirect any FFXIV website (DE, FR, EU, JP, etc.) to the NA version
// @author       ceeprus
// @match        https://*.finalfantasyxiv.com/*
// @icon         https://www.finalfantasyxiv.com/favicon.ico
// @license MIT 
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538999/FFXIV%20Language%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/538999/FFXIV%20Language%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = window.location.hostname;

    if (currentHost.startsWith('na.')) return;

    const newHost = currentHost.replace(/^[^.]+\.finalfantasyxiv\.com/, 'na.finalfantasyxiv.com');

    const newUrl = window.location.href.replace(currentHost, newHost);

    window.location.replace(newUrl);
})();

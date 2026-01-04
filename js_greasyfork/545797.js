// ==UserScript==
// @name         Roblox to Pekora Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects roblox to pekora
// @author       9999 - Pekora
// @match        *://www.roblox.com/*
// @match        *://roblox.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545797/Roblox%20to%20Pekora%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/545797/Roblox%20to%20Pekora%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL is roblox.com or www.roblox.com
    if (window.location.hostname === 'roblox.com' || window.location.hostname === 'www.roblox.com') {
        // Redirect to pekora.zip/home
        window.location.replace('https://pekora.zip/home');
    }
})();
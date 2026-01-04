// ==UserScript==
// @name         Mega URL Changer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Change Mega.nz URL format
// @author       GhostySS
// @match        https://mega.nz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478434/Mega%20URL%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/478434/Mega%20URL%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = window.location.href;

    // Check if it's a Mega.nz file URL
    if (currentUrl.match(/^https:\/\/mega\.nz\/file\/.*$/)) {
        // Extract the key from the URL
        var key = currentUrl.split('#')[1];

        // Extract the file identifier from the URL
        var fileIdentifier = currentUrl.split('/')[4];

        // Create the new URL format
        var newUrl = 'https://mega.nz/embed/' + fileIdentifier + '#' + key;

        // Redirect to the new URL
        window.location.href = newUrl;
    }
})();

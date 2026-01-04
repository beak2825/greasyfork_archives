// ==UserScript==
// @name         Spotify URL - Open to Desktop App
// @namespace    http://your-namespace.example.com/
// @version      1.0
// @description  Modifies Spotify URLs to use the "spotify:" app handler and open the url to desktop app
// @match        https://open.spotify.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/469773/Spotify%20URL%20-%20Open%20to%20Desktop%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/469773/Spotify%20URL%20-%20Open%20to%20Desktop%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prepend "spotify:" to the URL
    var newUrl = 'spotify:' + window.location.href;

    // Reload the page with the modified URL
    window.location.replace(newUrl);

    // Close the tab (you may need to enable the "Tabs" permission for Tampermonkey)
    window.close();
})();

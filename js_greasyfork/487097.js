// ==UserScript==
// @name         Userscript Utilities
// @namespace    https://github.com/AmeLooksSus
// @version      1.0
// @description  Adds functionality to interact with Greasy Fork and Chrome Web Store.
// @icon         https://i.imgur.com/LXyAydx.png
// @author       AmeLooksSus
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487097/Userscript%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/487097/Userscript%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Choose the filter for Greasy Fork: updated, created, total_installs, ratings, or name.
    var filter = "updated";
    // To enable CSS filtering, uncomment the line below and optionally specify "all" to view both javascript and css. Remember to add "+ language" before the semicolon(;) in line 27
    // var language = "css";

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Greasy Fork: ' + filter, function() {
        // Get the base domain of the website
        var hostname = window.location.hostname;
        // Remove subdomains like www from the hostname
        var baseDomain = hostname.replace(/^[^.]+\./, '');
        // Create the modified link for Greasy Fork
        var modifiedLink = 'https://greasyfork.org/en/scripts/by-site/' + baseDomain + '?sort=' + filter;
        // Open the modified link in a new tab
        window.open(modifiedLink, '_blank');
    });
      GM_registerMenuCommand('Extensions', function() {
        // Get the base domain of the website
        var baseDomain = window.location.hostname.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/)[1];
        // Create the modified link for Chrome Web Store extensions
        var modifiedLink = 'https://chromewebstore.google.com/search/' + baseDomain + '?itemTypes=EXTENSION';
        // Open the modified link in a new tab
        window.open(modifiedLink, '_blank');
    });
      GM_registerMenuCommand('Themes', function() {
        // Get the base domain of the website
        var baseDomain = window.location.hostname.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/)[1];
        // Create the modified link for Chrome Web Store themes
        var modifiedLink = 'https://chromewebstore.google.com/search/' + baseDomain + '?itemTypes=THEME';
        // Open the modified link in a new tab
        window.open(modifiedLink, '_blank');
    });
      GM_registerMenuCommand('Both', function() {
        // Get the base domain of the website
        var baseDomain = window.location.hostname.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/)[1];
        // Create the modified link for Chrome Web Store both extensions and themes
        var modifiedLink = 'https://chromewebstore.google.com/search/' + baseDomain + '?itemTypes=EXTENSION%2CTHEME';
        // Open the modified link in a new tab
        window.open(modifiedLink, '_blank');
    });
    }
})();
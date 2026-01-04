// ==UserScript==
// @name         Blooket Cheat Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load cheats from external URL on all Blooket subdomains
// @author       You
// @match        *://*.blooket.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523779/Blooket%20Cheat%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/523779/Blooket%20Cheat%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the external JavaScript cheat file
    const cheatURL = 'https://raw.githubusercontent.com/Blooket-Council/Blooket-Cheats/refs/heads/main/cheats/KGui.js';

    // Fetch the cheat file
    GM_xmlhttpRequest({
        method: 'GET',
        url: cheatURL,
        onload: function(response) {
            if (response.status === 200) {
                // Inject the script content into the page
                const script = document.createElement('script');
                script.textContent = response.responseText;
                document.head.appendChild(script);
            } else {
                console.error('Failed to load cheat script:', response.status);
            }
        },
        onerror: function(error) {
            console.error('Error fetching cheat script:', error);
        }
    });
})();
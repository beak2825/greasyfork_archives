// ==UserScript==
// @name         Onion Link Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open .onion links in Tor Browser
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523050/Onion%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/523050/Onion%20Link%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the link is a .onion link
    function isOnionLink(url) {
        return url.includes('.onion');
    }

    // Get all anchor tags on the page
    const links = document.getElementsByTagName('a');

    // Loop through the links and modify .onion links
    for (let link of links) {
        if (isOnionLink(link.href)) {
            // Change the link to open in Tor Browser
            link.href = 'tor:' + link.href;
        }
    }
})();
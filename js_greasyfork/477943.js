// ==UserScript==
// @name         Open Links in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open all links in a new tab when tapped
// @author       drakulaboy
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477943/Open%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/477943/Open%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add an event listener to all links on the page
    document.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Open the link in a new tab
            window.open(link.href);
            event.preventDefault(); // Prevent the default link behavior
        });
    });
})();

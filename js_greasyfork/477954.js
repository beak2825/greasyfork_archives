// ==UserScript==
// @name         Open Links in New Tab2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open all links in a new tab when tapped
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477954/Open%20Links%20in%20New%20Tab2.user.js
// @updateURL https://update.greasyfork.org/scripts/477954/Open%20Links%20in%20New%20Tab2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add an event listener to all links on the page
    document.querySelectorAll('a').forEach(function(link) {
        link.setAttribute('target', '_blank');
    });
})();

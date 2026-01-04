// ==UserScript==
// @name         Open External Links in New Tab
// @version      1.0
// @description  Opens all external links in a new tab
// @match        *://*/*
// @grant        none
// @license      MIT
// @author       Howard D. Lince III
// @supportURL   https://twitter.com/HowardL3
// @namespace    https://github.com/howard3
// @downloadURL https://update.greasyfork.org/scripts/484410/Open%20External%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/484410/Open%20External%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all links in the document
    var links = document.getElementsByTagName('a');

    // Loop through each link
    for (var i = 0; i < links.length; i++) {
        // Check if the link's hostname is different from the current page's hostname
        if (links[i].hostname !== window.location.hostname) {
            // Change the target attribute to _blank
            links[i].target = '_blank';
        }
    }
})();

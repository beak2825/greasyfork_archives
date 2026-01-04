// ==UserScript==
// @name         Open New Tab Script
// @namespace    http://your.namespace/
// @version      1.0
// @description  Opens a new tab and inserts content
// @author       You
// @match        https://appaddict.org/search/?type=ios&price=1
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486202/Open%20New%20Tab%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486202/Open%20New%20Tab%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the element using a valid selector
    var element = document.querySelector("section#content > section > div > div > div:nth-child(9) > div");

    // Check if the element is found
    if (element) {
        // Open a new tab/window without specifying a URL
        var newTab = window.open('', '_blank');

        // Focus on the new tab and insert content
        newTab.document.write('New tab content here');
        newTab.document.close();
    } else {
        console.error('Element not found');
    }
})();

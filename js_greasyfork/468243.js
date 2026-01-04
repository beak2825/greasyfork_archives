// ==UserScript==
// @name         Click All Chevron Down
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click all elements with class "fa-chevron-down"
// @author       You
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/468243/Click%20All%20Chevron%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/468243/Click%20All%20Chevron%20Down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickAllChevronDown() {
        // Get all elements with class "fa-chevron-down"
        let elements = document.querySelectorAll('i.fa-chevron-down');

        // Trigger a click event on each element
        for (let element of elements) {
            element.click();
        }
    }

    // Add a command to the Greasemonkey menu
    GM_registerMenuCommand('Click All Chevron Down', clickAllChevronDown);
})();

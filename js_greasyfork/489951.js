// ==UserScript==
// @name           Glassdoor Paywall Remover 2024
// @description    Remove the Glassdoor Popup
// @author         Muhd Farhad @ https://github.com/HachiroSan
// @version        1.0
// @include        http*://*glassdoor.*
// @namespace      http://www.greasyfork.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489951/Glassdoor%20Paywall%20Remover%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/489951/Glassdoor%20Paywall%20Remover%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add global styles
    function addGlobalStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Function to remove a specific element by its ID
    function removeElementById(id) {
        var element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // Hide the paywall overlay
    addGlobalStyle("#HardsellOverlay { display: none !important; }");

    // Remove the ContentWallHardsell and UserAlert divs
    removeElementById('ContentWallHardsell');
    removeElementById('UserAlert');

    // Allow scrolling
    addGlobalStyle("body { overflow: auto !important; }");

    // Remove scroll event listener
    document.body.onscroll = null;
})();

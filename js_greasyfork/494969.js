// ==UserScript==
// @name         Google Docs Dark Mode
// @namespace    http://your.namespace.here
// @version      0.1
// @description  Force Google Docs into dark mode
// @author       owen thiessen
// @match        https://docs.google.com/document/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494969/Google%20Docs%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/494969/Google%20Docs%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply dark mode styles
    function applyDarkMode() {
        // Get the document body
        var body = document.getElementsByTagName("body")[0];

        // Apply dark mode styles
        body.style.backgroundColor = "#1e1e1e"; // Background color
        body.style.color = "#d4d4d4"; // Text color
    }

    // Call the function to apply dark mode
    applyDarkMode();

})();

// ==UserScript==
// @name         Change Background Color2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A simple userscript to change the background color and display an alert
// @author       Your Name
// @match        https://example.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515692/Change%20Background%20Color2.user.js
// @updateURL https://update.greasyfork.org/scripts/515692/Change%20Background%20Color2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the background color of the page
    document.body.style.backgroundColor = "#ADD8E6"; // Light blue color

    // Display an alert message
    alert("Welcome to example.com! Background color changed.");

})();

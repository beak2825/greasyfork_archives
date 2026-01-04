// ==UserScript==
// @name         Google Tools Button Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the Tools button on Google.com
// @author       webmaster.greasy
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466465/Google%20Tools%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/466465/Google%20Tools%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Wait for the page to load completely
        setTimeout(clickToolsButton, 1000); // Adjust the delay if needed
    });

    function clickToolsButton() {
        var toolsButton = document.getElementById('hdtb-tls');
        if (toolsButton) {
            toolsButton.click();
        }
    }
})();

// ==UserScript==
// @name         AliExpress Sidecart Width Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the width of the .root-sidecart on AliExpress US
// @author       You
// @match        https://www.aliexpress.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515835/AliExpress%20Sidecart%20Width%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/515835/AliExpress%20Sidecart%20Width%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load and for the .root-sidecart element to be present
    window.addEventListener('load', function() {
        // Select the .root-sidecart element
        var sidecart = document.querySelector('.root-sidecart');

        // Check if the sidecart element exists
        if (sidecart) {
            // Set the width of the .root-sidecart to 65px
            sidecart.style.width = '65px';
        }
    });
})();

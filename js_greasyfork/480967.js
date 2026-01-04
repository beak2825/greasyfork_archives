// ==UserScript==
// @name         Perchance no ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change css to hide all the banners.
// @author       Antiokh
// @match        https://perchance.org/ai-text-to-image-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perchance.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480967/Perchance%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/480967/Perchance%20no%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the document to be fully loaded
    window.addEventListener('load', function() {
        // Select all iframe elements with the "allowfullscreen" attribute
        const iframes = document.querySelectorAll('iframe[allowfullscreen]');

        // Loop through each iframe and add the specified styles
        iframes.forEach(function(iframe) {
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.height = '100vh';
            iframe.style.width = '100vw';
        });

        // Select all div elements with onclick="flagImage()"
        const flagImageDivs = document.querySelectorAll('div[onclick="flagImage()"]');

        // Loop through each div and update the onclick attribute
        flagImageDivs.forEach(function(div) {
            div.setAttribute('onclick', 'saveImageToComputer()');
        });
    });
})();
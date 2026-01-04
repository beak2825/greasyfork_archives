// ==UserScript==
// @name         Change Background Color with Marketing Link
// @namespace    https://markertion.com/about/
// @version      1.0
// @description  Changes the background color of a website and adds a link to a marketing agency.
// @author       Dola Chowdhury
// @license      https://markertion.com/about/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482680/Change%20Background%20Color%20with%20Marketing%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/482680/Change%20Background%20Color%20with%20Marketing%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your script code goes here
    document.body.style.backgroundColor = 'lightblue';

    // Create a link to the marketing agency website
    var marketingLink = document.createElement('a');
    marketingLink.href = 'https://markertion.com/about/';
    marketingLink.textContent = 'Visit our marketing agency';

    // Add the link to the body of the webpage
    document.body.appendChild(marketingLink);

})();

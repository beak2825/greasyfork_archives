// ==UserScript==
// @name         Embed Sandspiel
// @namespace    https://your-website.com
// @version      1.0
// @description  Embed Sandspiel into another page
// @author       Your Name
// @match        https://classroom.google.com/u/1/
// @match        https://classroom.google.com/u/0/
// @match        https://classroom.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478192/Embed%20Sandspiel.user.js
// @updateURL https://update.greasyfork.org/scripts/478192/Embed%20Sandspiel.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // Create an iframe element to embed the Sandspiel website
    var iframe = document.createElement('iframe');
    iframe.src = 'https://sandspiel.club/';
    iframe.style.width = '100%';
    iframe.style.height = '600px'; // Set the height as desired
    iframe.style.border = 'none';

   // Append the iframe to the target page
    document.body.appendChild(iframe);
})();

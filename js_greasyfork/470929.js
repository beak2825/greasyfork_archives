// ==UserScript==
// @name         2014 Google Neocities Part 7
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add custom Google menu item to Vanced YouTube page.
// @author       You
// @match        https://vanced-youtube.neocities.org/2013/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470929/2014%20Google%20Neocities%20Part%207.user.js
// @updateURL https://update.greasyfork.org/scripts/470929/2014%20Google%20Neocities%20Part%207.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new div element
    var customDiv = document.createElement('div');
    customDiv.setAttribute('class', 'gb_Q gb_R');

    // Create the new link element
    var customLink = document.createElement('a');
    customLink.setAttribute('class', 'gb_P');
    customLink.setAttribute('href', 'https://support.google.com/answer/2451065?hl=en');
    customLink.setAttribute('data-pid', '23');
    customLink.setAttribute('data-ved', '0CBQQwi4oAA');
    customLink.innerText = '+You';

    // Add the link to the div
    customDiv.appendChild(customLink);

    // Get the reference to the parent element of the existing div
    var parentElement = document.querySelector('div.gb_Q.gb_R');

    // Insert the custom div before the existing div
    parentElement.parentNode.insertBefore(customDiv, parentElement);
})();

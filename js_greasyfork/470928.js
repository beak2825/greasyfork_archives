// ==UserScript==
// @name         +You Google Menu 2014
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add custom Google menu item to Vanced YouTube page.
// @author       You
// @match        https://vanced-youtube.neocities.org/2013/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470928/%2BYou%20Google%20Menu%202014.user.js
// @updateURL https://update.greasyfork.org/scripts/470928/%2BYou%20Google%20Menu%202014.meta.js
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

    // Get the reference to the "Gmail" div
    var gmailDiv = document.querySelector('div.gb_Q.gb_R a.gb_P[href="https://mail.google.com/mail/?tab=wm"]');
    
    // Insert the custom div before the "Gmail" div
    gmailDiv.parentNode.insertBefore(customDiv, gmailDiv);
})();

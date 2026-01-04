// ==UserScript==
// @name         Show Source Code Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a button to show the source code of the current page
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472230/Show%20Source%20Code%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/472230/Show%20Source%20Code%20Button.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';

    // Create a new button element
    var button = document.createElement('button');

    // Add text to the button
    button.textContent = 'Show Source Code';

    // Add an onclick event to the button
    button.onclick = function() {
        // Log the outer HTML of the entire document
        console.log(document.documentElement.outerHTML);
    };

    // Append the button to the body of the document
    document.body.appendChild(button);
}
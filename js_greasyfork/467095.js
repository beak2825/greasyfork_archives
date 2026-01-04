// ==UserScript==
// @name         Copy Prolific ID to clipboard Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a copy to clipboard button in the upper right corner of the page
// @match        *://*/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/467095/Copy%20Prolific%20ID%20to%20clipboard%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/467095/Copy%20Prolific%20ID%20to%20clipboard%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    let copyButton = document.createElement('button');
    copyButton.innerHTML = 'Prolific';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '75px';
    copyButton.style.right = '10px';
    copyButton.style.zIndex = '9999';
    copyButton.style.borderRadius = '50%';
    copyButton.style.backgroundColor = 'green';
    copyButton.style.width = '30px';
    copyButton.style.height = '30px';

    // Add hover effect
    copyButton.onmouseover = function() {
        this.style.width = 'auto';
        this.style.height = 'auto';
        this.style.borderRadius = '5px';
        this.style.padding = '5px 10px';
    }
    copyButton.onmouseout = function() {
        this.style.width = '30px';
        this.style.height = '30px';
        this.style.borderRadius = '50%';
        this.style.padding = '0px';
    }

    // Add click event to copy text to clipboard
    copyButton.onclick = function() {
        navigator.clipboard.writeText('ENTERYOURIDHERE');
    }

    // Append the button to the body
    document.body.appendChild(copyButton);
})();
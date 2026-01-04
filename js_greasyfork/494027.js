// ==UserScript==
// @name         Keka Centered Bold Text Display
// @namespace    https://greasyfork.org/en/users/688917
// @version      1.5
// @description  Display bold text at the center of the page on keka.com
// @run-at       document-end
// @match        https://ezeetechnosys.keka.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494027/Keka%20Centered%20Bold%20Text%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/494027/Keka%20Centered%20Bold%20Text%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new div element to hold the text
    var newDiv = document.createElement('div');
    newDiv.style.position = 'fixed';
    newDiv.style.top = '50%';
    newDiv.style.left = '50%';
    newDiv.style.transform = 'translate(-50%, -50%)';
    newDiv.style.fontSize = '24px';
    newDiv.style.color = 'black';
    newDiv.style.fontWeight = 'bold';
    newDiv.style.zIndex = '1000'; // High z-index to ensure visibility

    // Set the text content
    newDiv.textContent = 'Eat/Sleep/Code/Repeat';

    // Append the div to the body
    document.body.appendChild(newDiv);
})();

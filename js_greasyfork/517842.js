// ==UserScript==
// @name         smlwiki.com - change lil logan gif
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  press 0 to change him
// @author       smlwiki fan
// @match        https://smlwiki.com/index
// @match        https://smlwiki.com/index.html
// @match        https://smlwiki.com/
// @match        https://smlwiki.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517842/smlwikicom%20-%20change%20lil%20logan%20gif.user.js
// @updateURL https://update.greasyfork.org/scripts/517842/smlwikicom%20-%20change%20lil%20logan%20gif.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add an event listener for keypress
    document.addEventListener('keydown', function (event) {
        // Check if the key pressed is "0"
        if (event.key === '0') {
            // Create a popup menu
            const gifLink = prompt('Enter the GIF/PNG link:');
            if (gifLink) {
                // Find the target span and update the image source
                const targetSpan = document.querySelector('#lillogan a img');
                if (targetSpan) {
                    targetSpan.src = gifLink;
                    alert('GIF updated successfully!');
                } else {
                    alert('Target image not found.');
                }
            }
        }
    });
})();

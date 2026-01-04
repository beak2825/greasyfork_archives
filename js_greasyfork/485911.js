




// ==UserScript==
// @name         Bonk.io Username Toggle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Toggle visibility of player usernames on bonk.io with Alt+H
// @author       You
// @match        https://bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485911/Bonkio%20Username%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/485911/Bonkio%20Username%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'h' and the 'Alt' key is pressed
        if (event.altKey && event.key === 'h') {
            // Toggle the visibility of elements with class 'user'
            const usernameElements = document.querySelectorAll('.user');
            usernameElements.forEach(usernameElement => {
                usernameElement.style.visibility = (usernameElement.style.visibility === 'hidden') ? 'visible' : 'hidden';
            });
        }
    });

})();

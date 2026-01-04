// ==UserScript==
// @name         SayPi Call Button Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click the saypi-callButton with a media key shortcut
// @author       Your Name
// @match        https://pi.ai/talk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497936/SayPi%20Call%20Button%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/497936/SayPi%20Call%20Button%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the button
    function clickSayPiCallButton() {
        let button = document.getElementById('saypi-callButton');
        if (button) {
            button.click();
        } else {
            console.log('Button not found!');
        }
    }

    // Event listener for keyboard shortcut
    document.addEventListener('keydown', function(e) {
        // Check for Ctrl + Shift + C
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
            clickSayPiCallButton();
        }
    }, false);
})();
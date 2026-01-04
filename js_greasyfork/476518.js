// ==UserScript==
// @name         Bonk.io Name Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change your name to Chaz in Bonk.io
// @author       Studz
// @match        https://www.bonk.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476518/Bonkio%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/476518/Bonkio%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the name
    function changeName() {
        // Replace your current name with 'Chaz'
        document.querySelector('.name-input').value = 'Chaz';
    }

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        // Call the function to change the name after a slight delay
        setTimeout(changeName, 2000); // Adjust the delay as needed
    });
})();

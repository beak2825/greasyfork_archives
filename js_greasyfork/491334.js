// ==UserScript==
// @name         brickwall hacks
// @namespace    http://tampermonkey.net/
// @version      2024-03-31
// @description  Changes the password to the Admin password. On full release of Brick Wall Website, the admin password will be changed. However this script "HACKS" into the security pin and finds the passwords. (javascript keeps all the password data). 
// @author       You
// @match        https://thebrickwall.w3spaces.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w3spaces.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/491334/brickwall%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/491334/brickwall%20hacks.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to change the input type attribute to text
    function changeInputTypeToText(input) {
        input.setAttribute('type', 'text');
    }

    // Function to change whatever is typed inside the input to "Admin"
    function changeInputToAdmin(input) {
        input.value = 'Admin';
    }

    // Wait for the document to fully load
    window.addEventListener('load', function() {
        // Find all input fields with class "input"
        var inputFields = document.querySelectorAll('input.input[type="password"]');
        inputFields.forEach(function(input) {
            // Change the type attribute to text
            changeInputTypeToText(input);

            // Add event listener for input event
            input.addEventListener('input', function() {
                // Change whatever is typed inside the input to "Admin"
                changeInputToAdmin(input);
            });
        });
    });
})();

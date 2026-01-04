// ==UserScript==
// @name         EvoWorld.io Gems Cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set gems to 9999999 when 'M' key is pressed on EvoWorld.io
// @author       You
// @match        https://evoworld.io/*
// @liscense       MIT
// @downloadURL https://update.greasyfork.org/scripts/486106/EvoWorldio%20Gems%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/486106/EvoWorldio%20Gems%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable to store the number of gems
    var gems = 9999999;

    // Function to set gems to the specified value
    function setGems() {
        // Assuming there is a variable or function in the website's code to set gems
        // Replace 'setGemsFunction' with the actual function or variable in the website's code
        // This is just a placeholder and might not be accurate for the website
        setGemsFunction(gems);
    }

    // Event listener for the 'M' key press
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'M'
        if (event.key === 'M') {
            // Set gems when 'M' key is pressed
            setGems();
        }
    });
})();
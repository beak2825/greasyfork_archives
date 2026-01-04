// ==UserScript==
// @name         Wormax.io FOV Booster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increases the Field of View (FOV) in Wormax.io
// @author       Your Name
// @match        https://wormax.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490668/Wormaxio%20FOV%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/490668/Wormaxio%20FOV%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your desired FOV value here
    var desiredFOV = 120; // You can adjust this value as needed

    // Function to modify FOV
    function modifyFOV() {
        // Find the canvas element
        var canvas = document.getElementById('canvas');
        if (canvas) {
            // Modify the FOV attribute
            canvas.setAttribute('fov', desiredFOV);
        } else {
            // If canvas element is not found, try again after a short delay
            setTimeout(modifyFOV, 1000);
        }
    }

    // Call the function to modify FOV
    modifyFOV();

})();

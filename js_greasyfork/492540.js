// ==UserScript==
// @name         Blooket Gamecode Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  idk what to call it lol
// @author       generic
// @match        https://*.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492540/Blooket%20Gamecode%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/492540/Blooket%20Gamecode%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Image URL to detect
    const imageUrl = 'https://ac.blooket.com/marketassets/blooks/lightblue.svg';

    // Redirect URL
    const redirectUrl = 'https://dashboard.blooket.com/my-sets';

    let timer;

    // Function to check if the image is on the screen
    function checkForImg() {
        const images = document.querySelectorAll('img[src="' + imageUrl + '"]');
        
        if (images.length > 0) {
            // Start the timer
            timer = setTimeout(() => {
                window.location.href = redirectUrl;
            },  60000);
        } else {
            clearTimeout(timer);
        }
    }

    setInterval(checkForImg, 500);

})();

// ==UserScript==
// @name         Swordz.io Clean Up + hides boxes
// @namespace    intuxs
// @version      1
// @description  Hides junk in the homescreen and other boxes on the top left
// @author       YourName
// @match        *.swordz.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527676/Swordzio%20Clean%20Up%20%2B%20hides%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/527676/Swordzio%20Clean%20Up%20%2B%20hides%20boxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide ads
    function hideAds() {
        // Target ads based on their structure or other attributes
        const ads = document.querySelectorAll('div[style*="background-color"], iframe, img[src*="ads"]');
        
        ads.forEach(ad => {
            // Check if the ad is visible and matches certain criteria
            if (ad.offsetWidth > 0 && ad.offsetHeight > 0) { // Ensure the ad is visible
                ad.style.display = 'none'; // Hide the ad
                console.log('Ad hidden:', ad);
            }
        });
    }

    // Function to hide specific elements on the top left
    function hideTopLeftElements() {
        // Hide the <img> element with id "buttonFullscreenImage" visually
        const imgFullscreen = document.getElementById("buttonFullscreenImage");
        if (imgFullscreen) {
            imgFullscreen.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <div> element with id "buttonFullscreen" visually
        const divFullscreen = document.getElementById("buttonFullscreen");
        if (divFullscreen) {
            divFullscreen.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <img> element with id "buttonMusicImage" visually
        const imgMusic = document.getElementById("buttonMusicImage");
        if (imgMusic) {
            imgMusic.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <div> element with id "buttonMusic" visually
        const divMusic = document.getElementById("buttonMusic");
        if (divMusic) {
            divMusic.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <img> element with id "buttonPauseImage" visually
        const imgPause = document.getElementById("buttonPauseImage");
        if (imgPause) {
            imgPause.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <div> element with id "buttonPause" visually
        const divPause = document.getElementById("buttonPause");
        if (divPause) {
            divPause.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <img> element with id "buttonSoundImage" visually
        const imgSound = document.getElementById("buttonSoundImage");
        if (imgSound) {
            imgSound.style.visibility = 'hidden'; // You can also use opacity: 0
        }

        // Hide the <div> element with id "buttonSound" visually
        const divSound = document.getElementById("buttonSound");
        if (divSound) {
            divSound.style.visibility = 'hidden'; // You can also use opacity: 0
        }
    }

    // Run the hideAds function when the page loads
    window.addEventListener('load', hideAds);

    // Use MutationObserver to handle dynamically loaded ads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideAds(); // Check for new ads and hide them
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Delay before hiding the top left elements
    setTimeout(hideTopLeftElements, 100);
})();
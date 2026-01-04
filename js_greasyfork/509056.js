// ==UserScript==
// @name         Remove Youtube Yoodle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove yoodles from youtube
// @author       Marcer_f
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://e7.pngegg.com/pngimages/268/71/png-clipart-adblock-plus-web-browser-ad-blocking-computer-icons-opera-hand-rectangle-thumbnail.png
// @downloadURL https://update.greasyfork.org/scripts/509056/Remove%20Youtube%20Yoodle.user.js
// @updateURL https://update.greasyfork.org/scripts/509056/Remove%20Youtube%20Yoodle.meta.js
// ==/UserScript==



//Bugs:
//no HD Youtube Logo (this will be adjustable later in the script)
//alt Text is visibile

(function() {
    'use strict';

    // URL of the static YouTube logo
    const staticLogoURL = 'https://i.ibb.co/mBhKRcp/frame-000-delay-0-04s.webp';

    // Function to remove and replace specific elements
    function replaceLogo() {
        // Remove element with ID 'dismissible' and class 'style-scope ytd-statement-banner-renderer'
        const elementsToRemove = document.querySelectorAll('#dismissible.style-scope.ytd-statement-banner-renderer');
        elementsToRemove.forEach(element => {
            if (element) {
                element.remove();
            }
        });

        // Replace animated logo with the static logo
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.startsWith('https://www.gstatic.com/youtube/img/promos/')) {
                img.src = staticLogoURL;
                img.srcset = staticLogoURL; // Update srcset for responsive images
            }
        });
    }

    // Initial run
    replaceLogo();

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        replaceLogo();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Additional handling for dynamic content
    window.addEventListener('yt-navigate-finish', replaceLogo);

})();
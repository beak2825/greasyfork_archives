// ==UserScript==
// @name         Torn.com Loader - Remove Images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove background and other images from Torn.com/loader
// @author       Your Name
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471618/Torncom%20Loader%20-%20Remove%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/471618/Torncom%20Loader%20-%20Remove%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove all background images
    function removeBackgroundImages() {
        const elementsWithBackground = document.querySelectorAll('[style*="background-image"]');
        for (const element of elementsWithBackground) {
            element.style.backgroundImage = 'none';
        }
    }

    // Function to remove all images
    function removeImages() {
        const allImages = document.querySelectorAll('img');
        for (const image of allImages) {
            image.remove();
        }
    }

    // Remove background images and other images after the page is fully loaded
    window.addEventListener('load', function() {
        removeBackgroundImages();
        removeImages();
    });
})();
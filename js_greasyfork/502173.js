
// ==UserScript==
// @name         HobbySearch Image Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the Portrait Image to a Full Body Image
// @author       bejak
// @match        https://www.1999.co.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502173/HobbySearch%20Image%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/502173/HobbySearch%20Image%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all images on the page
    let images = document.querySelectorAll('img');

    images.forEach(function(img) {
        // Get the current src attribute
        let src = img.getAttribute('src');

        // Check if the src contains "itsmall"
        if (src.includes('/itsmall')) {
            // Replace "itsmall" with "itbig"
            let newSrc = src.replace('/itsmall', '/itbig');

            // Remove the 's' at the end of the number
            newSrc = newSrc.replace(/(\d+)s\.jpg$/, '$1.jpg');

            // Set the new src attribute
            img.setAttribute('src', newSrc);
        }
    });
})();

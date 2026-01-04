// ==UserScript==
// @name         Swampsmut
// @namespace    http://www.swapsmut.com/*
// @version      0.1
// @description  View full images on login
// @author       Your Name
// @match        http://www.swapsmut.com/*
// @grant        none
// @license      mit    
// @downloadURL https://update.greasyfork.org/scripts/487121/Swampsmut.user.js
// @updateURL https://update.greasyfork.org/scripts/487121/Swampsmut.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Target the element with ID "gallery_tpl" and class "gallery_thumb"
    var targetElement = document.querySelector('#gallery_tpl > div.gallery_thumb');

    // Check if the target element exists
    if (targetElement) {
        // Apply flexbox styles to the target element
        targetElement.style.display = 'grid'; // Set display to flex
        targetElement.style.width = '100%'; // Set width to 100%
        var links = targetElement.querySelectorAll('a');
        // Loop through each <a> tag
        links.forEach(function(link) {
            // Replace the <a> tag with its child <img> element
            var img = link.querySelector('img');
            if (img) {
                link.parentNode.replaceChild(img, link);
            }
        });

        // Select all images within the target element
        var images = targetElement.querySelectorAll('img');

        // Loop through each image and set width to 100%
        images.forEach(function(img) {
            img.src = img.src.replace('-t.jpg', '.jpg');
            img.style.width = '100%';
        });
    }
})();
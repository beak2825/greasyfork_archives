// ==UserScript==
// @name         Replace Images with Animated Smiley
// @namespace    your-namespace
// @version      1.0
// @description  Replaces all images (including JPG, PNG, GIF, etc.) on the page with an animated smiley.
// @author       Your Name
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476115/Replace%20Images%20with%20Animated%20Smiley.user.js
// @updateURL https://update.greasyfork.org/scripts/476115/Replace%20Images%20with%20Animated%20Smiley.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var smileyImageUrl = 'https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp';

    function replaceImagesWithSmiley() {
        var images = document.querySelectorAll('img, span.img.m');

        for (var i = 0; i < images.length; i++) {
            if (images[i].tagName === 'IMG') {
                images[i].src = smileyImageUrl;
            } else if (images[i].style.backgroundImage) {
                images[i].style.backgroundImage = 'url(' + smileyImageUrl + ')';
            }
        }
    }

    replaceImagesWithSmiley(); // Replace images initially

    // Set an interval to check and replace images every second
    setInterval(replaceImagesWithSmiley, 1000);
})();

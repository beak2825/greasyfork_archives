// ==UserScript==
// @name         Google Images Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace every image on Google Image Search with a random funny picture!
// @author       You
// @license      MIT
// @match        https://www.google.com/search*tbm=isch*
// @match        https://www.google.*.*/search*tbm=isch*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534097/Google%20Images%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/534097/Google%20Images%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const randomImages = [
        'https://placekitten.com/300/300',
        'https://picsum.photos/300',
        'https://placebear.com/300/300',
        'https://baconmockup.com/300/300',
        'https://www.fillmurray.com/300/300',
        'https://loremflickr.com/300/300',
        'https://placebeard.it/300x300',
        'https://www.placecage.com/300/300'
    ];

    function replaceImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const randomUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
            img.src = randomUrl;
            img.srcset = randomUrl; // For high-resolution
        });
    }

    // Initial run
    replaceImages();

    // Watch for new images loaded dynamically
    const observer = new MutationObserver(() => {
        replaceImages();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();

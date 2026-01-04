// ==UserScript==
// @name         Pant Devil Attractor to Holy Cross Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Replace specific image on Grundos Cafe
// @author       Abel
// @match        https://www.grundos.cafe/*
// @grant        none
// @run-at       document-end
// @icon         https://i.imgur.com/FiNv0DD.gif
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/530033/Pant%20Devil%20Attractor%20to%20Holy%20Cross%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/530033/Pant%20Devil%20Attractor%20to%20Holy%20Cross%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Original and replacement image URLs
    const originalImage = 'https://grundoscafe.b-cdn.net/items/vor_pd_attr.gif';
    const replacementImage = 'https://i.imgur.com/FiNv0DD.gif';

    // Function to replace images
    function replaceImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src === originalImage) {
                img.src = replacementImage;
            }
        });
    }

    // Run initially
    replaceImages();

    // Create observer to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                replaceImages();
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
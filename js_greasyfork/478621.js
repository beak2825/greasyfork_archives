// ==UserScript==
// @name         Disable Shafa Lazy Loading
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable the lazy loading for images
// @author       max5555
// @match        https://shafa.ua/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478621/Disable%20Shafa%20Lazy%20Loading.user.js
// @updateURL https://update.greasyfork.org/scripts/478621/Disable%20Shafa%20Lazy%20Loading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disableLazyLoading() {
        // Find all images with data-src attribute and the relevant classes
        const images = document.querySelectorAll('img.js-lazy-img[data-src]');

        images.forEach(img => {
            // Set the src attribute to the value of data-src
            img.src = img.getAttribute('data-src');

            // Remove the lazy loading related classes
            img.classList.remove('js-lazy-img', 'lazy-loaded');

            // If there's a loading attribute set to "lazy", change it to "eager"
            if (img.getAttribute('loading') === 'lazy') {
                img.setAttribute('loading', 'eager');
            }
        });
    }

    disableLazyLoading();

    // As many sites load content dynamically (e.g., infinite scroll, AJAX),
    // consider setting up a MutationObserver to handle new elements being added to the DOM.
    const observer = new MutationObserver(mutationsList => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                disableLazyLoading();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();

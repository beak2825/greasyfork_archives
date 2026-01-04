// ==UserScript==
// @name        Saulular phone
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0.1
// @author      ApertureUA
// @license     WTFPLv2.0
// @description 12.09.2023, 20:37:22
// @downloadURL https://update.greasyfork.org/scripts/475155/Saulular%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/475155/Saulular%20phone.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function addStyleToElement(element) {
        // Modify the style attribute of the element with random styles
        element.style = "background-image: url('https://media.tenor.com/1y8zDc-ll-EAAAAC/3d-saul-saul-goodman.gif'); background-size: 100% 100%;";
    }

    function traverseAndStyleElements(element) {
        if (element) {
            // Add style to the current element
            addStyleToElement(element);

            // Recursively traverse and style children
            var children = element.children;
            for (var i = 0; i < children.length; i++) {
                traverseAndStyleElements(children[i]);
            }
        }
    }
    setInterval(traverseAndStyleElements(document.body), 20000); // 20,000 milliseconds = 20 seconds
    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Start traversing from the document body
        traverseAndStyleElements(document.body);

    });
})();


(function() {
    'use strict';

    function replaceImages() {
        var images = document.getElementsByTagName('img');
        var replacementImageURL = 'https://media.tenor.com/1y8zDc-ll-EAAAAC/3d-saul-saul-goodman.gif';

        for (var i = 0; i < images.length; i++) {
            images[i].src = replacementImageURL;
            images[i].removeAttribute('srcset');
        }
    }
  setInterval(replaceImages, 20000); // 20,000 milliseconds = 20 seconds
    // Wait for the page to fully load
    window.addEventListener('load', function() {
        replaceImages();
    });
})();

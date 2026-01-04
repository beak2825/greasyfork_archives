// ==UserScript==
// @name         geoguessr comic sans
// @version      1.1
// @description  Force GeoGuessr to use all lowercase Comic Sans because it's funny
// @author       5ummrtime (with much help from MS Copilot)
// @license      WTFPL
// @match        *://*.geoguessr.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.1.0/fontfaceobserver.standalone.js

// @namespace https://greasyfork.org/users/1356265
// @downloadURL https://update.greasyfork.org/scripts/504735/geoguessr%20comic%20sans.user.js
// @updateURL https://update.greasyfork.org/scripts/504735/geoguessr%20comic%20sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom font
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(`
        @font-face {
            font-family: 'Comic Sans';
            src: url(https://db.onlinewebfonts.com/t/7cc6719bd5f0310be3150ba33418e72e.woff) format("woff");
        }
    `));
    document.head.appendChild(newStyle);

    // Use Font Face Observer to check if the font is loaded
    var font = new FontFaceObserver('Comic Sans');

    font.load().then(function() {
        // Load the Comic Sans font
        console.log('Custom font loaded successfully.');
        var applyFontStyle = document.createElement('style');
        applyFontStyle.appendChild(document.createTextNode(`
            * {
                font-family: 'Comic Sans' !important;
                letter-spacing: 0.5px;
            }
        `));
        document.head.appendChild(applyFontStyle);

        // Force everything to be lowercase
        function applyLowercaseStyle(element) {
            element.style.textTransform = 'lowercase';
            Array.from(element.children).forEach(applyLowercaseStyle);
        }

        function convertAllTextToLowerCase() {
            applyLowercaseStyle(document.body);
        }

        // Initial conversion
        convertAllTextToLowerCase();

        // Observe for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyLowercaseStyle(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }).catch(function() {
        console.log('Custom font failed to load.');
    });
})();
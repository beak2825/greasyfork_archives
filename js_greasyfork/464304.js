// ==UserScript==
// @name         Quora make blur images clear
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the filter attribute from images with the q-box class
// @author       Lee Davider
// @match        https://*.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/464304/Quora%20make%20blur%20images%20clear.user.js
// @updateURL https://update.greasyfork.org/scripts/464304/Quora%20make%20blur%20images%20clear.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("aaa\n");
    function removeFilterFromImages() {
        const images = document.querySelectorAll('.q-box');

        // Log the images NodeList to the console
        console.log(images);

        images.forEach(img => {
            img.style.filter = 'none';
        });
    }

    // Observe the DOM for changes and execute the function when the content is loaded
    function observeDOM(targetNode) {
        const config = { childList: true, subtree: true };

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    removeFilterFromImages();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Wait for the mainContent div to be loaded and set it as the targetNode
    function waitForMainContent() {
        console.log("dsdsad");
        //const mainContent = document.getElementById('mainContent');
        const mainContent = document.querySelector('.q-box.dom_annotate_multifeed_tribe_top_items');
        if (mainContent) {
            console.log("bb\n");
            observeDOM(mainContent);
        } else {
            console.log("cc\n");
            setTimeout(waitForMainContent, 500);
        }
    }

        // Run the function when the page content is loaded or if it's already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForMainContent);
    } else {
        waitForMainContent();
    }


})();
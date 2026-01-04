// ==UserScript==
// @name         Fapello.su Image Link Helper
// @namespace    http://fapello.su
// @version      0.4
// @description  Adds buttons to open images via direct links with vocabulary replacements
// @match        *://fapello.su/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489665/Fapellosu%20Image%20Link%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489665/Fapellosu%20Image%20Link%20Helper.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Dictionary for replacing parts of the image URL
    const replacements = {
        '_t': '_o',
        'thumbs2': 'images2',
        '.md': '',
        '.th': '',
        // Add more replacements as needed
    };

    function replaceUrl(url) {
        let newUrl = url;
        for (const [original, replacement] of Object.entries(replacements)) {
            newUrl = newUrl.replace(original, replacement);
        }
        return newUrl;
    }

    // Function to add a button to an image
    function addButtonToImage(image) {
        const modifiedUrl = replaceUrl(image.src);
        const button = document.createElement('a');
        button.href = modifiedUrl;
        button.textContent = 'Source IMG';
        button.style.position = 'absolute';
        button.style.top = '5px';
        button.style.right = '5px';
        button.style.zIndex = '1000';
        button.style.background = 'white';
        button.style.border = '1px solid black';
        button.style.padding = '2px 5px';
        button.style.borderRadius = '5px';
        button.style.textDecoration = 'none';
        button.style.color = 'black';
        button.style.fontSize = '12px';
        button.style.fontWeight = 'bold';
        image.parentNode.style.position = 'relative';
        image.parentNode.appendChild(button);
    }

    // Function to process all images in the #content div
    function processImages() {
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            const images = contentDiv.querySelectorAll('img');
            images.forEach(addButtonToImage);
        }
    }

    // Observe for new images loaded by lazyload.js
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        addButtonToImage(node);
                    }
                });
            }
        });
    });

    // Start observing the #content div for changes
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        observer.observe(contentDiv, {
            childList: true,
            subtree: true
        });
    }

    // Initial processing of images
    processImages();

    // Re-process images on page scroll
    window.addEventListener('scroll', processImages);
})();
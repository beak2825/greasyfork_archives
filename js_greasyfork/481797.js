// ==UserScript==
// @name         Imgur: add numbers to gallery images in the old design
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds numbers to the images in posts, indicating their position in the album, so you can refer to them in comments.
// @author       Corrodias
// @match        https://imgur.com/gallery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481797/Imgur%3A%20add%20numbers%20to%20gallery%20images%20in%20the%20old%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/481797/Imgur%3A%20add%20numbers%20to%20gallery%20images%20in%20the%20old%20design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof imgur === 'undefined') return; // This is not the old design.

    const mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE)
                    processAddedElement(node);
            }
        }
    });

    // Add them to images already loaded.
    for (const image of document.querySelectorAll('.post-image-container')) {
        processAddedElement(image);
    }
    // Add them to any images loaded later.
    mutationObserver.observe(document.querySelector('.post-images'), { childList: true, subtree: true });

    function processAddedElement(node) {
        if (!node.classList.contains('post-image-container')) return;

        let images = getImagesData();

        let index = (images === null || images.length === 0) ? 1 : images.findIndex(a => a.hash === node.id) + 1;
        let newElement = document.createElement('h1');
        newElement.textContent = `#${index}`;
        node.prepend(newElement);
    }

    function getImagesData() {
        let node = document.querySelector('form.caption-create');
        // The rest of the name past the $ is not always identical.
        for (const propertyKey in node) {
            if (propertyKey.startsWith('__reactInternalInstance$')) {
                let data = node[propertyKey]._currentElement._owner._instance.props.image.album_images;
                if (data === undefined) return null; // If there's only one image, sometimes this property doesn't exist.
                return Array.isArray(data) ? data : data.images; // Oddly enough, on a fresh load, it's one type, and when navigating to a new post, it's the other.
            }
        }

        return null;
    }
})();
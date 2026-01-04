// ==UserScript==
// @name         BDSMLR Auto Image Expander for Archive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-load images for image_content with imgcount, check duplicates by querying DOM for exact src before inserting
// @author       You
// @match        *://*.bdsmlr.com/archive/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/538432/BDSMLR%20Auto%20Image%20Expander%20for%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/538432/BDSMLR%20Auto%20Image%20Expander%20for%20Archive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function imageExists(src) {
        // Use exact match querySelector for <img src="...">
        // Escape quotes in src to avoid selector syntax errors:
        const escapedSrc = CSS.escape(src);
        return document.querySelector(`img[src="${escapedSrc}"]`) !== null;
    }

    function fetchAndInsertImages(link, anchorElement) {
    if (anchorElement.nextElementSibling && anchorElement.nextElementSibling.classList.contains('expanded-images')) {
        return;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: link,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const postholder = doc.querySelector('.postholder');
            if (!postholder) return;

            const imageContainer = postholder.querySelector('.image_container');
            if (!imageContainer) return;

            const images = imageContainer.querySelectorAll('img');
            if (images.length === 0) return;

            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image_container';
            //imageWrapper.style.border = '1px solid #ccc';
            //imageWrapper.style.margin = '10px 0';
            //imageWrapper.style.padding = '5px';
            //imageWrapper.style.display = 'flex';
            //imageWrapper.style.flexWrap = 'wrap';
            //imageWrapper.style.gap = '5px';
            //imageWrapper.style.background = '#f9f9f9';

            let addedCount = 0;

            images.forEach((img, index) => {
                if (index === 0) return; // Skip first image

                if (!imageExists(img.src)) {
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.className = 'image_content';
                    wrapperDiv.style.display = 'inline-block'; // Optional: keep inline block like originals
                    wrapperDiv.style.margin = '5px'; // Optional: spacing similar to original

                    const newImg = document.createElement('img');
                    newImg.src = img.src;
                    //newImg.style.maxWidth = '150px';
                    //newImg.style.height = 'auto';

                    wrapperDiv.appendChild(newImg);
                    imageWrapper.appendChild(wrapperDiv);
                    addedCount++;
                }
            });


            if (addedCount > 0 && anchorElement.parentNode) {
                anchorElement.parentNode.insertBefore(imageWrapper, anchorElement.nextSibling);
            }
        }
    });
}


    function processImageContent() {
        const imageContentDivs = document.querySelectorAll('.image_content');

        imageContentDivs.forEach(div => {
            const imgCount = div.querySelector('.imgcount');
            if (imgCount) {
                const anchor = div.closest('a');
                if (anchor && anchor.href) {
                    if (!anchor.hasAttribute('data-expanded')) {
                        anchor.setAttribute('data-expanded', 'true');
                        fetchAndInsertImages(anchor.href, anchor);
                    }
                }
            }
        });
    }

    function startObserver() {
        processImageContent();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('.image_content') || node.querySelector('.image_content')) {
                            processImageContent();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete') {
        startObserver();
    } else {
        window.addEventListener('load', startObserver);
    }
})();

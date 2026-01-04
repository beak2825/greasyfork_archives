// ==UserScript==
// @name         Bilibili Mall High Definition Image
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes extra parameters from .jpg and .png image URLs in <img> tags and background-image CSS properties on Bilibili Mall.
// @author       MinorMole
// @match        https://mall.bilibili.com/*
// @match        https://www.biligo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539837/Bilibili%20Mall%20High%20Definition%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/539837/Bilibili%20Mall%20High%20Definition%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Regex to find .jpg or .png followed by an optional '@' and then any characters
    // The parentheses create a capturing group for the file extension (.jpg or .png)
    const urlCleanRegex = /(\.jpg|\.png)(@.*)?$/i;

    // Function to process all image URLs (src and background-image)
    function processAllImageUrls() {
        // --- Process <img> tags ---
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            let originalSrc = img.src;
            if (urlCleanRegex.test(originalSrc)) {
                const newSrc = originalSrc.replace(urlCleanRegex, '$1');
                if (newSrc !== originalSrc) {
                    img.src = newSrc;
                    // console.log(`[IMG SRC] Changed: ${originalSrc} -> ${newSrc}`);
                }
            }
        });

        // --- Process elements with background-image style ---
        // Select all elements that have a 'style' attribute (or be more specific if needed)
        // For efficiency, we might want to target elements more specifically if they have certain classes
        // For now, let's look at all elements, and filter by style later.
        const elementsWithStyle = document.querySelectorAll('[style*="background-image"]');
        elementsWithStyle.forEach(element => {
            let originalStyle = element.style.backgroundImage;
            if (originalStyle) {
                // Extract the URL part from 'url("...")'
                const urlMatch = originalStyle.match(/url\(['"]?(.*?)['"]?\)/i);
                if (urlMatch && urlMatch[1]) {
                    let originalImageUrl = urlMatch[1];

                    // Check if the extracted URL matches our cleaning regex
                    if (urlCleanRegex.test(originalImageUrl)) {
                        const newImageUrl = originalImageUrl.replace(urlCleanRegex, '$1');
                        if (newImageUrl !== originalImageUrl) {
                            // Reconstruct the background-image style
                            element.style.backgroundImage = `url("${newImageUrl}")`;
                            // console.log(`[BG IMAGE] Changed: ${originalImageUrl} -> ${newImageUrl}`);
                        }
                    }
                }
            }
        });
    }

    // Run the function initially on page load
    processAllImageUrls();

    // Observe changes in the DOM to catch dynamically loaded images and style changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            // Case 1: New nodes are added to the DOM (e.g., new elements with background-image)
            // or img tags.
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                processAllImageUrls();
            }
            // Case 2: Attributes of existing elements change (e.g., img.src or element.style)
            else if (mutation.type === 'attributes') {
                // If the 'src' attribute of an <img> changes, or 'style' attribute of any element
                if (mutation.attributeName === 'src' || mutation.attributeName === 'style') {
                    processAllImageUrls();
                }
            }
        }
    });

    // Start observing the document body for changes and its subtree
    // Watch for childList (new elements) and attributes (changes to src or style)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });

})();

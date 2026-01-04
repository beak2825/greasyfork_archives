// ==UserScript==
// @name         CatholicMatch deblur
// @namespace    http://tampermonkey.net/
// @version      2024-08-10
// @description  Removes blur on the CatholicMatch
// @author       anon
// @match        *://*.catholicmatch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catholicmatch.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516535/CatholicMatch%20deblur.user.js
// @updateURL https://update.greasyfork.org/scripts/516535/CatholicMatch%20deblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the 'blur' parameter from image URLs
    function removeBlurParams() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.includes('blur=')) {
                // Modify the src URL by removing the blur portion
                let newSrc = img.src.replace(/blur=\d+,?/, '');
                img.src = newSrc;
                console.log("deblur", newSrc);
            }
        });
    }

    // Run the function once the page is loaded
    window.addEventListener('load', removeBlurParams);

    // Optional: Run the function again if the page content is dynamically loaded (e.g., with AJAX)
    const observer = new MutationObserver(removeBlurParams);
    observer.observe(document.body, { childList: true, subtree: true });

})();
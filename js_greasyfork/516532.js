// ==UserScript==
// @name         Soundcloud DeBlur
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Removes blur on the SoundCloud
// @author       https://github.com/ojczeo/
// @match        *://*.soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @grant        none
// @license      MIT
// @source       https://gist.github.com/ojczeo/01e492e7cf6a0e39bc9c8e1ecc39d119/
// @downloadURL https://update.greasyfork.org/scripts/516532/Soundcloud%20DeBlur.user.js
// @updateURL https://update.greasyfork.org/scripts/516532/Soundcloud%20DeBlur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the 'blur' parameter from image URLs
    function removeBlurParams() {
       let elems = document.querySelectorAll('[class*="Blur"]')
       elems.forEach(function (el) {
           el.setAttribute('class', '');
       });
    }

        // Run the function once the page is loaded
    window.addEventListener('load', removeBlurParams);

    // Optional: Run the function again if the page content is dynamically loaded (e.g., with AJAX)
    const observer = new MutationObserver(removeBlurParams);
    observer.observe(document.body, { childList: true, subtree: true });
})();
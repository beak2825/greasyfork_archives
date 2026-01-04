// ==UserScript==
// @name         Fox News video remover
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  Removes the annoying autoplaying videos from Fox News articles.
// @author       J1bill
// @match        https://www.foxnews.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=foxnews.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518610/Fox%20News%20video%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/518610/Fox%20News%20video%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements with specific classes
    function removeElements() {
        const elements = document.querySelectorAll('.featured.featured-video.video-ct');
        elements.forEach(element => element.remove());
    }

    // Run the function on page load
    removeElements();

    // Run the function when the DOM changes (to handle dynamically loaded content)
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
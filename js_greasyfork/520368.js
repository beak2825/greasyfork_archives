// ==UserScript==
// @name        Google Auto Navigate to Next Page
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Infinite scrolling for Google Search with site icons displayed and 2-second delay before loading next page.
// @author      tofuine
// @match       https://www.google.com/search*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520368/Google%20Auto%20Navigate%20to%20Next%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/520368/Google%20Auto%20Navigate%20to%20Next%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Observer for infinite scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Trigger Google's infinite scroll with a delay of 2 seconds
                const moreButton = document.querySelector("#pnnext");
                if (moreButton) {
                    setTimeout(() => {
                        moreButton.click();
                    }, 2000); // Wait for 2 seconds before navigating
                }
            }
        });
    });

    // Add observer to the footer or a scrolling sentinel
    function addObserver() {
        const sentinel = document.querySelector("#foot") || document.createElement("div");
        sentinel.style.height = "1px";
        sentinel.id = "scroll-sentinel";
        document.body.appendChild(sentinel);
        observer.observe(sentinel);
    }




    // Initialize script
    function init() {

        addObserver();

    }

    window.addEventListener("load", init);
})();

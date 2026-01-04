// ==UserScript==
// @name         Remove Premium Sign Up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the Premium Sign Up element on x.com websites
// @author       Grapdna
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502522/Remove%20Premium%20Sign%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/502522/Remove%20Premium%20Sign%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the target element
    function removeElement() {
        const element = document.querySelector('div.css-175oi2r > a[href="/i/premium_sign_up"]');
        if (element) {
            element.parentNode.remove();
        }
    }

    // Run the function to remove the element
    removeElement();

    // Observe the DOM for changes and run the function again if the target element appears
    const observer = new MutationObserver(() => {
        removeElement();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

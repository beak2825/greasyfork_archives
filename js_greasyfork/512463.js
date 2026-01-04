// ==UserScript==
// @name        Skip Go to
// @namespace   Violentmonkey Scripts
// @match       *://forums.socialmediagirls.com/goto/*
// @icon        https://cdn0.iconfinder.com/data/icons/arrow-2-1/512/826-21-512.png
// @grant       none
// @run-at      document-start
// @version     0.1
// @author      drak4r
// @description Redirects directly to the final page without "Yes, I confirmed"
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/512463/Skip%20Go%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/512463/Skip%20Go%20to.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the document to be completely loaded
    window.addEventListener('load', function() {
        // Select the link that contains the specific class
        const link = document.querySelector('a.button--cta.button');

        // Checks if the link exists
        if (link) {
            // Capture the href URL
            const url = link.href;

            // Redirects to the captured URL
            window.location.href = url;
        }
    });
})();

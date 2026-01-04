// ==UserScript==
// @name         Force Load All Images (disabled lazy loading)
// @version      1.0.0
// @description  Load all images immediately (disable lazy loading).
// @match        *://*/*
// @run-at       document-end
// @license      MIT License
// @author       Khaoklong
// @namespace https://greasyfork.org/users/1507942
// @downloadURL https://update.greasyfork.org/scripts/546900/Force%20Load%20All%20Images%20%28disabled%20lazy%20loading%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546900/Force%20Load%20All%20Images%20%28disabled%20lazy%20loading%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceLoadImages() {
        document.querySelectorAll("img").forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
            if (img.dataset.original) img.src = img.dataset.original;
            if (img.dataset.lazy) img.src = img.dataset.lazy;
            if (img.hasAttribute("loading")) img.removeAttribute("loading");
        });
    }

    // Run immediately
    forceLoadImages();

    // Re-run if new elements are added (infinite scroll)
    new MutationObserver(forceLoadImages).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

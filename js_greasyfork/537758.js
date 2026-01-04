// ==UserScript==
// @name         lolz.live
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gg
// @author       xz
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537758/lolzlive.user.js
// @updateURL https://update.greasyfork.org/scripts/537758/lolzlive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeIgnoredBlocks() {
        const ignoredLinks = document.querySelectorAll('a.JsOnly.DisplayIgnoredContent');

        ignoredLinks.forEach(link => {
            let block = link.closest('.message');
            if (block) {
                block.remove();
            }
        });
    }

    // Run on page load
    removeIgnoredBlocks();

    // Optional: run again if new content is dynamically loaded (e.g. infinite scroll)
    const observer = new MutationObserver(() => {
        removeIgnoredBlocks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

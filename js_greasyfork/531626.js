// ==UserScript==
// @name         Mangaupdates Thumbnail Enlarger
// @namespace    https://github.com/momoehab
// @version      2025-04-02
// @description  I made this because my eyes hurt while looking at those tiny thumbnails :<
// @author       momoehab
// @match        https://www.mangaupdates.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangaupdates.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531626/Mangaupdates%20Thumbnail%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/531626/Mangaupdates%20Thumbnail%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enlarge() {
        document.querySelectorAll(".series-box_series_thumb__Chdoz").forEach(x => {
            x.style.setProperty("width", "190px", "important");
            x.style.setProperty("height", "300px", "important");
        });
    }

    enlarge();

    const y = new MutationObserver(enlarge);
    y.observe(document.body, { childList: true, subtree: true });
})();
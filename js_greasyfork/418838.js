  
// ==UserScript==
// @name         Anti-Hololive
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Be gone, thot!
// @author       NorthWestWind
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418838/Anti-Hololive.user.js
// @updateURL https://update.greasyfork.org/scripts/418838/Anti-Hololive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    checkAll();
    document.addEventListener("scroll", checkAll);
    document.addEventListener("mousemove", checkAll);
    document.addEventListener("mousedown", checkAll);
    document.addEventListener("mouseup", checkAll);
})();

function checkAll() {
    var elements = document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-autoplay-renderer,  ytd-compact-video-renderer, ytd-search-refinement-card-renderer");
    for (const element of elements) {
        var text = element.innerHTML;
        if (text.toLowerCase().includes("hololive")) {
            console.log("Found Hololive content. Attempting to remove...");
            element.parentNode.removeChild(element);
        }
    }
}
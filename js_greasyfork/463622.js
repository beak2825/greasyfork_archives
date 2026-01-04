// ==UserScript==
// @name         turbo next page
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  press space to go to next page
// @author       You
// @match        *://*.websight.blue/thread/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463622/turbo%20next%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/463622/turbo%20next%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(e) {
        const readMore = document.getElementById("nextpage");
        const visibleButton = readMore.style.display != "none";
        const isPosting = document.activeElement.tagName == "TEXTAREA";
        if (e.key == ' ' && visibleButton && !isPosting) {
           readMore.click();
        }
    });

})();
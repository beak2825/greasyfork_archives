// ==UserScript==
// @name         Udemy Video Viewport Height
// @namespace    Violentmonkey Scripts
// @version      1.2
// @license      MIT
// @description  Changes the max-height of the specified div on Udemy
// @match        https://www.udemy.com/*
// @icon         https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504557/Udemy%20Video%20Viewport%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/504557/Udemy%20Video%20Viewport%20Height.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyHeight() {
        var curriculumItemDivs = document.querySelectorAll('div[class^="curriculum-item-view--scaled-height-limiter"][class*="curriculum-item-view--no-sidebar"]');
        curriculumItemDivs.forEach(function(div) {
            div.style.maxBlockSize  = '94vh';
        });
    }

    // Run the modification function when the page loads
    window.addEventListener('load', modifyHeight);

    // Run the modification function when the DOM is modified
    var observer = new MutationObserver(function(mutations) {
        modifyHeight();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
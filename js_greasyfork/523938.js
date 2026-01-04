// ==UserScript==
// @name         Hide Element on Douyin Live
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the element with class "aqK_4_5U" on Douyin Live
// @author       You
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/follow/live*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523938/Hide%20Element%20on%20Douyin%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/523938/Hide%20Element%20on%20Douyin%20Live.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide the element with class "aqK_4_5U"
    const hideElement = () => {
        const element = document.querySelector('.aqK_4_5U');
        if (element) {
            element.style.display = 'none';
        }
    };

    // Run the function once the page is loaded
    window.addEventListener('load', hideElement);

    // Optionally, observe DOM changes in case the element is dynamically loaded
    const observer = new MutationObserver(hideElement);
    observer.observe(document.body, { childList: true, subtree: true });
})();

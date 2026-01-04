// ==UserScript==
// @name         Bilibili Remove Recommended Swipe
// @namespace    http://tampermonkey.net/
// @version      2024-12-11
// @description  Remove the specific element on Bilibili homepage
// @author       Huangs
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520384/Bilibili%20Remove%20Recommended%20Swipe.user.js
// @updateURL https://update.greasyfork.org/scripts/520384/Bilibili%20Remove%20Recommended%20Swipe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement() {
        const target = document.querySelector('#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div.recommended-swipe.grid-anchor');
        if (target) {
            target.remove();
            console.log('Removed the recommended swipe element.');
        }
    }

    // Run when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', removeElement);

    // Observe changes to handle dynamically loaded content
    const observer = new MutationObserver(removeElement);
    observer.observe(document.body, { childList: true, subtree: true });
})();

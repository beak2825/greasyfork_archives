// ==UserScript==
// @name         Homepage tweaks (removes YT shorts, and featured tab) For Youtube
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes shorts from youtube
// @author       overlookk on github
// @match        https://www.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492032/Homepage%20tweaks%20%28removes%20YT%20shorts%2C%20and%20featured%20tab%29%20For%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/492032/Homepage%20tweaks%20%28removes%20YT%20shorts%2C%20and%20featured%20tab%29%20For%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeElements = () => {
        // Remove ytd-rich-shelf-renderer elements
        const shelfRenderers = document.querySelectorAll('ytd-rich-shelf-renderer.style-scope.ytd-rich-section-renderer');
        shelfRenderers.forEach(element => element.remove());

        const contentDivs = document.querySelectorAll('div#content.style-scope.ytd-rich-section-renderer');
        contentDivs.forEach(element => element.remove());
    };

    window.addEventListener('load', removeElements);

    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
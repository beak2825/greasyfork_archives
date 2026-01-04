// ==UserScript==
// @name         Remove annoying Tiktok Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes 3 overlays which forces the user to register to Tiktok
// @author       tairasu
// @match        *://www.tiktok.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501569/Remove%20annoying%20Tiktok%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/501569/Remove%20annoying%20Tiktok%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide divs with specific classes
    function hideDivs() {
        const classesToHide = [
            'css-v2a75e-DivModalMask e1gjoq3k2',
            'css-1dw2wty-DivCenterWrapper e1gjoq3k7',
            'css-behvuc-DivModalContainer e1gjoq3k0'
        ];

        classesToHide.forEach(className => {
            const elements = document.querySelectorAll(`.${className.split(' ').join('.')}`);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
    }

    // Run the hideDivs function when the page loads
    window.addEventListener('load', hideDivs);

    // Run the hideDivs function whenever the DOM is updated (e.g., when new content is loaded dynamically)
    const observer = new MutationObserver(hideDivs);
    observer.observe(document.body, { childList: true, subtree: true });
})();
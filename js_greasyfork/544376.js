// ==UserScript==
// @name         Remove NeatReader Popup Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author iniquitousx
// @description  Remove the selection menu container from the neat-reader webapp
// @match        https://www.neat-reader.com/webapp*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544376/Remove%20NeatReader%20Popup%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/544376/Remove%20NeatReader%20Popup%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement() {
        const el = document.querySelector('#root > div > div.selection-menu-container.css-normalize');
        if (el) el.remove();
    }

    // Wait until DOM is fully loaded
    window.addEventListener('load', () => {
        removeElement();

        // Optional: handle dynamic content
        const observer = new MutationObserver(removeElement);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();

// ==UserScript==
// @name         Telegram copy prevention bypass
// @namespace    micalm
// @version      1.0
// @description  Removes all the 'copy' event listener from <html> to allow copying on locked down groups on Telegram.
// @author       micalm <greasyfork@mical.pl>
// @match        *://web.telegram.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525726/Telegram%20copy%20prevention%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/525726/Telegram%20copy%20prevention%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeCopyListeners() {
        const oldHtml = document.documentElement;
        const newHtml = oldHtml.cloneNode(true);
        oldHtml.parentNode.replaceChild(newHtml, oldHtml);
    }

    window.addEventListener('load', () => {
        setTimeout(removeCopyListeners, 250);
    });
})();

// ==UserScript==
// @name         Half page (up/down) scroll
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.0
// @description  scrolls half a page when pressing page up / down
// @author       Alistair1231
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444151/Half%20page%20%28updown%29%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/444151/Half%20page%20%28updown%29%20scroll.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/444151-half-page-up-down-scroll/
// https://openuserjs.org/scripts/Alistair1231/Half_page_(updown)_scroll
(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        // page down
        if (e.key === "PageDown") {
            e.preventDefault();
            window.scrollBy(0, window.innerHeight*.45);
            console.log("page down");
        }
        // page up
        else if (e.key === "PageUp") {
            e.preventDefault();
            window.scrollBy(0, -window.innerHeight*.45);
            console.log("page up");
        }
    });

})();

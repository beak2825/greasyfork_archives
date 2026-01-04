// ==UserScript==
// @name         Shopee Next/Prev Shortcut
// @namespace    https://wiki.gslin.org/wiki/Shopee_Next/Prev_Shortcut
// @version      0.20200105.0
// @description  Use arrow keys to operate
// @author       Gea-Suan Lin <gslin@gslin.com>
// @match        https://shopee.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/394628/Shopee%20NextPrev%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/394628/Shopee%20NextPrev%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(event) {
        if ('input' === document.activeElement.tagName.toLowerCase()) {
            return;
        }
        if ('<' === event.key) {
            let el = document.querySelector('button.shopee-mini-page-controller__prev-btn');
            if (el) {
                el.click();
            }
            return;
        }
        if ('>' === event.key) {
            let el = document.querySelector('button.shopee-mini-page-controller__next-btn');
            if (el) {
                el.click();
            }
            return;
        }
    });
})();

// ==UserScript==
// @name        Add Esc key on Google Maps
// @namespace   https://github.com/gslin/add-esc-key-on-google-maps
// @match       https://www.google.com/maps*
// @grant       none
// @version     0.20220228.0
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Add Esc key on Google Maps for better UX.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/419475/Add%20Esc%20key%20on%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/419475/Add%20Esc%20key%20on%20Google%20Maps.meta.js
// ==/UserScript==

(() => {
    'use strict';

    window.addEventListener('keydown', ev => {
        // Esc only
        if (27 !== ev.keyCode) {
            return;
        }
        console.debug('Application "Add Esc key on Google Maps" esc key detected.');

        // User page.
        let el = document.querySelector('button[aria-label="Close"], button[aria-label="關閉"]');
        if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
            el.click();
            return;
        }

        // Comment page.
        el = document.querySelector('button[aria-label="Back"], button[aria-label="返回"]');
        if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
            el.click();
            return;
        }

        // Store page.
        el = document.querySelector('a[aria-label="Clear search"], a[guidedhelpid="clear_search"]');
        if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
            el.click();
            return;
        }
    }, true);

    console.debug('Application "Add Esc key on Google Maps" installed.');
})();

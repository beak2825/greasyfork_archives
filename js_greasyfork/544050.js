// ==UserScript==
// @name         Trainline – kill Booking.com (with real click)
// @namespace    https://gist.github.com/yourname
// @version      4.0
// @description  Simulate a real user click on the “Open places to stay” checkbox so Trainline doesn’t open Booking.com. Also blocks every other attempt to launch Booking.com.
// @match        https://www.thetrainline.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544050/Trainline%20%E2%80%93%20kill%20Bookingcom%20%28with%20real%20click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544050/Trainline%20%E2%80%93%20kill%20Bookingcom%20%28with%20real%20click%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------------------------- CONFIG -------------------------------- */
    const PROMO_ID     = 'bookingPromo';  // <input id="bookingPromo">
    const BLOCKED_HOST = 'booking.com';   // Anything ending with this is vetoed

    /* ----------------------- helper functions --------------------------- */
    function pointsToBooking(url) {
        try { return new URL(url, location.href).hostname.endsWith(BLOCKED_HOST); }
        catch { return false; }
    }

    function fakeWindow() {
        const fakeLoc = new Proxy({}, { get: () => '', set: () => true });
        return new Proxy({},  { get: (_, p) => (p === 'location' ? fakeLoc : undefined),
                                set: () => true });
    }

    /* -------------------- 1. block pop-ups & redirects ------------------ */
    const nativeOpen = window.open;
    window.open = function (url = '', ...rest) {
        if (url === '' || url === 'about:blank' || pointsToBooking(url)) {
            console.info('[TM] Booking pop-up blocked:', url || 'about:blank');
            return fakeWindow();
        }
        return nativeOpen.call(this, url, ...rest);
    };

    document.addEventListener('click', ev => {
        const a = ev.target.closest('a[href]');
        if (a && pointsToBooking(a.href)) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            console.info('[TM] Link to Booking.com suppressed');
        }
    }, true);

    /* -------------------- 2. simulate a *real* untick ------------------- */
    function synthClick(el) {
        ['pointerdown','mousedown','mouseup','click'].forEach(type =>
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            })));
    }

    function ensurePromoOff() {
        const cb = document.getElementById(PROMO_ID);
        if (!cb || !cb.checked) return;        // already off or not on page

        console.info('[TM] bookingPromo is ON – simulating user click to turn it OFF');
        synthClick(cb);                        // toggles it, fires React handler
    }

    /* run once, then on every SPA update */
    document.addEventListener('DOMContentLoaded', ensurePromoOff);
    new MutationObserver(ensurePromoOff)
        .observe(document.documentElement, { childList: true, subtree: true });

})();

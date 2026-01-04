// ==UserScript==
// @name            Scrolller.com Adblocker 2.0
// @name:de         Scrolller.com Werbeblocker 2.0
// @version         1.0
// @description     Blocks Ads and the Premium, Adblock & Bandwidth Popup on Scrolller.com
// @description:de  Blockiert Werbung und das Premium, Adblock & Bandwith Popup auf Scrolller.com
// @icon            https://scrolller.com/assets/favicon-16x16.png
// @author          TalkLounge(org) & PanMenel(2.0)
// @namespace       https://github.com/TalkLounge/scrolller.com-adblocker
// @license         MIT
// @match           https://scrolller.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/545412/Scrolllercom%20Adblocker%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/545412/Scrolllercom%20Adblocker%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const s = document.createElement("style");
    s.innerHTML = `.popup:has(#recommendations__popup) {
        display: none;
    }

    /* General: Anti-Adblock Popup */
    .popup:has(svg[width=80]) {
        display: none;
    }

    /* General: Premium Popup */
    .popup:has(img[src*=cat]) {
        display: none;
    }

    /* Feed: Bandwidth Popup */
    .popup:has([class^=_description]) {
        display: none;
    }

    /* Feed: Upgrade for the Ultimate Experience! Popup */
    .popup:has([class^=body_description]) {
        display: none;
    }

    /* Feed: Inline Ads */
    [class^=verticalView_container] a[aria-label='Ad Link'] {
        visibility: hidden;
    }

	/* Feed: Inline Ads */
    main div:has(>div>div>iframe), [class^=verticalView_container] div:has(>div>div>iframe) {
        visibility: hidden;
    }

    /* Post: Banner Ad */
    #fullscreen-view a[class^=FullscreenView_adLink] {
        display: none;
    }

    /* Post: Right Bottom Corner Circle Ad */
    #fullscreen-view button:has(>div>img[src^='/assets/fullscreen']) {
        display: none;
    }

    /* Legacy */
    .popup:has([class^=PremiumCTAPopup]) {
        display: none;
    }

    /* New: Upgrade for the Ultimate Experience! Popup with body_popup__Tg27F */
    .popup:has(.body_popup__Tg27F) {
        display: none;
    }`;
    document.head.append(s);

    const old_window_top_fetch = window.top.fetch;
    window.top.fetch = function () {
        if (arguments[1] && arguments[1].body && arguments[1].body.indexOf("AffiliateQuery") != -1) {
            return;
        }

        return old_window_top_fetch.apply(this, arguments);
    };
})();
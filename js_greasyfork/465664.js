// ==UserScript==
// @name            Scrolller.com Adblocker
// @name:de         Scrolller.com Werbeblocker
// @version         1.0.7
// @description     Blocks Ads and the Premium, Adblock & Bandwidth Popup on Scrolller.com
// @description:de  Blockiert Werbung und das Premium, Adblock & Bandwith Popup auf Scrolller.com
// @icon            https://scrolller.com/assets/favicon-16x16.png
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/scrolller.com-adblocker
// @license         MIT
// @match           https://scrolller.com/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465664/Scrolllercom%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/465664/Scrolllercom%20Adblocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    /* General: Popup: Wish Scrolller Was Ad-Free? */
    .popup:has(img[src*=cat]) {
        display: none;
    }

    /* General: Popup: Support Scrolller - Explore More Content! */
    .popup:has([class*=ctaButton]) {
        display: none;
    }

    /* General: Header Button */
    [class*=desktopAdSessionButton] {
        display: none;
    }

    /* Feed: Banner Ad Links */
    [class*=content]>a[class*=highlight] {
        display: none;
    }

    /* Feed: Inline Scrolller Ads */
    [class*=galleryItemHandler]:has([class*=nativeAd]) {
        visibility: hidden;
    }

    /* Feed: Inline External Ads */
    [class*=galleryItemHandler]:has([class*=iframeAdContainer]) {
        visibility: hidden;
    }

    /* Feed: Right Bottom Corner Circle Ad */
    button:has([class*=liveCircle]) {
        display: none;
    }

    /* Post: Banner Ad Link */
    #fullscreen-view [class*=topBanner] a[class*=adLink] {
        display: none;
    }`);
})();
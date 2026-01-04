// ==UserScript==
// @name		1_decrypt.day
// @description		block ads
// @match		*://decrypt.day/*
// @match		https://decrypt.day/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/473325-1_decrypt-day
// @author		sports_wook
// @version		2025.05.15
// @downloadURL https://update.greasyfork.org/scripts/473325/1_decryptday.user.js
// @updateURL https://update.greasyfork.org/scripts/473325/1_decryptday.meta.js
// ==/UserScript==


GM_addStyle (`
ins[class^="adsbygoogle"], div[class="google-auto-placed"], div[id^="kofi-widget-overlay"], div[id="svelte-announcer"], div[class^="modal"][class*="backdrop-blur-sm"], div[class^="modal"], div[id^="google-anno-"] {
    display: none !important;
}

.touchpadSwipeAnimationCore, body {
    padding: 0px 0px 0px !important;
}

.app-container .app-detail .description {
    max-height: fit-content !important;
}

`);
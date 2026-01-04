// ==UserScript==
// @name              NoAds Youtube
// @namespace     ghostrider47
// @version            0.1
// @description     Simple Hack to Bypass Youtube Ads
// @author            ghostrider47
// @match            *://*.youtube.com/watch*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/412215/NoAds%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/412215/NoAds%20Youtube.meta.js
// ==/UserScript==
// @run-at            document-start
// @run-at            document-end
// @run-at            document-idle

document.location = document.URL.replace('.com','.com.');
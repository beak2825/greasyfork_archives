/* DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE

            ? Copyright (C) 2024 DebSec (͡ ° ͜ʖ ͡ °)

   Everyone Is Permitted To Copy And Distribute Verbatim Or Modified
   Copies Of This License Document And Changing It Is Allowed As Long
   As The Name Is Changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
            DO WHAT THE FUCK YOU WANT TO.
                Credit uBlock-user
*/
// ==UserScript==
// @run-at       document-end
// @name         eBay Annoyances Remover
// @description  Removes eBay Ads, Reviews, Recommendations & Other General Annoyances
// @namespace    https://greasyfork.org/en/users/1031446-debsec
// @version      2.3
// @author       DebSec
// @include      https://*.ebay.*/*
// @include      /^https://[a-z.]+\.ebay(desc)?(\.*?)?\.[a-z]{2,3}/.*$/
// @icon         https://www.google.com/s2/favicons?domain=ebay.com
// @grant        none
// @license      DWTFYWTPL
// @downloadURL https://update.greasyfork.org/scripts/460620/eBay%20Annoyances%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/460620/eBay%20Annoyances%20Remover.meta.js
// ==/UserScript==
'use strict';
(function(w, d, list, n, i, e) {
        e = new MutationObserver(function(list, n, i) {
        list = d.querySelectorAll("[class^='vim vi-grid x-evo-btf-seller-card-river']/* Store Information */, [class^='x-evo-btf-seller-card-river__container']/* About seller, ratings, feedback */, [class^='tourtip__mask']/* Pop-UP Tour Tip */, [id^='animated-container']/* Pop-UP Alternate Login */, [id^='seo-related-search-container']/* Related Searches */, [class^='srp-items-carousel__container s-carousel-theme--tp']/* Picks for you under */, [class^='srp-bos-items']/* Trending now */, [class^='s-footer-notes']/* *Learn about pricing */, [class^='vim x-reviews']/* Reviews */, [class^='footer-panel-container']/* Widgets */, [class^='ifh-content']/* Widget */, [class^='vim x-survey-plugin']/* Feedback */, [class^='seo-footer-container']/* Best Sellers */, [class^='ux-navigator__container']/* Remove Explore More */, [class^='srp-sov']/* Remove Best Savings */, [id^='gh-doodleS']/* Remove Sponsored Ads */, [id^='UserReviews']/* Remove Reviews */, [id^='p-carousel-browse_related']/* Remove Sponsored Related Ads */, [id^='p-carousel-save_on']/* Remove Sponsored Save On Ads */, [id^='p-carousel-best_selling']/* Remove Sponsored Best Selling Ads */, [id^='placement']/* Remove Sponsored Ads */, [id^='LISTING_FRAME_MODULE']/* Remove Seller Info */, [id^='rwid']/* Remove Reviews */, [class^='vim d-sme-btf']/* Remove Sponsored Ads */, [class^='x-financing-info']/* Remove Sponsored Financing Ads */, [class^='gf-legal']/* Remove Litigious Info */, [title^='ADVERTISEMENT']/* Remove Sponsored Ads */, [id^='gf-t-box']/* Remove Litigious Info */, [id^='FootPanel']/* Remove Litigious Info */, [class^='srp-main-below-river']/* Inspired */");
        n = list.length;
        for (i = 0; i < n; i++)
            list[i].remove();
    });
    e.observe(d, {childList: true, subtree:true});
})(window, document);
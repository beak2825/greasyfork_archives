// ==UserScript==
// @name         nzherald.co.nz free premium
// @version      0.3
// @description  View premium articles without premium
// @author       Jujhar Singh
// @match        https://www.nzherald.co.nz/*
// @grant        GM_addStyle
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @namespace https://greasyfork.org/users/303738
// @downloadURL https://update.greasyfork.org/scripts/383344/nzheraldconz%20free%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/383344/nzheraldconz%20free%20premium.meta.js
// ==/UserScript==

$(window).load(() => {
    'use strict';

    GM_addStyle(
`.pb-f-homepage-story .premium[class*="headline-only-"] .flex-item:before, .pb-f-homepage-story-feed .premium.landscape-text-below .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.portrait-style-triple-items .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.triple-large-image-items .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.portrait-text-side .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.portrait-text-below .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.hero-left-items .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.quad-small-image-item .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.landscape-text-below-mobile-text-side .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.portrait-text-below-mobile-text-side .lazy-wrapper:before, .pb-f-homepage-story-feed .premium.portrait-text-side-mobile-text-below .lazy-wrapper:before, .pb-f-homepage-story-feed .premium[class*="guilty-pleasures-"] .lazy-wrapper:before, .pb-f-homepage-hero .story-hero.premium .link-wrapper:before, .pb-f-article-header header.premium:before, .pb-f-homepage-story .premium.landscape-text-below .lazy-wrapper:before, .pb-f-homepage-story .premium.portrait-style-triple-items .lazy-wrapper:before, .pb-f-homepage-story .premium.triple-large-image-items .lazy-wrapper:before, .pb-f-homepage-story .premium.portrait-text-side .lazy-wrapper:before, .pb-f-homepage-story .premium.portrait-text-below .lazy-wrapper:before, .pb-f-homepage-story .premium.hero-left-items .lazy-wrapper:before, .pb-f-homepage-story .premium.quad-small-image-item .lazy-wrapper:before, .pb-f-homepage-story .premium.landscape-text-below-mobile-text-side .lazy-wrapper:before, .pb-f-homepage-story .premium.portrait-text-below-mobile-text-side .lazy-wrapper:before, .pb-f-homepage-story .premium.portrait-text-side-mobile-text-below .lazy-wrapper:before, .pb-f-homepage-story .premium[class*="guilty-pleasures-"] .lazy-wrapper:before {
    text-decoration: line-through !important;
}`)

    $(".pb-f-ads-ad").remove()
    $(".premium-sub").remove()
    $(".pb-f-article-body").removeClass("pb-f-article-body")
    $(".article-offer").remove()
});
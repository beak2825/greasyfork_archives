// ==UserScript==
// @name           eBay - Hilight Items With Bids
// @namespace      https://mathemaniac.org
// @include        http://*.ebay.*/*
// @include        https://*.ebay.*/*
// @grant      none
// @version    2.4.0
// @description    Hilights items that have bids with a red border and yellow background.
// @downloadURL https://update.greasyfork.org/scripts/4578/eBay%20-%20Hilight%20Items%20With%20Bids.user.js
// @updateURL https://update.greasyfork.org/scripts/4578/eBay%20-%20Hilight%20Items%20With%20Bids.meta.js
// ==/UserScript==

// Based on http://userscripts.org/users/126140 v.2.2.1
// Updated for newer eBay layout.

document.querySelectorAll('.srp-results .s-item').forEach((item) => {
    const bidBox = item.querySelector('.s-item__bidCount');
    if (! bidBox) return;

    const bidText = bidBox.innerText;
    if (bidText.match(/^\s*\b0\b/) || ! bidText.match(/^\s*\d+/)) return;

    item.style.border = "3px solid red";
    item.style.backgroundColor = "yellow";
});

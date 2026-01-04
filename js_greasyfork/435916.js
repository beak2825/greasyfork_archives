// ==UserScript==
// @name         Etsy - Remove Seller Ads From Search Results 2021
// @description  Removes native advertising (Seller Ads) from Etsy search results
// @copyright    2021
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      0.2

// @include      https://www.etsy.com/search*
// @include      https://www.etsy.com/market/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @namespace https://greasyfork.org/users/842826
// @downloadURL https://update.greasyfork.org/scripts/435916/Etsy%20-%20Remove%20Seller%20Ads%20From%20Search%20Results%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/435916/Etsy%20-%20Remove%20Seller%20Ads%20From%20Search%20Results%202021.meta.js
// ==/UserScript==
/* global onElementReady */

onElementReady("p.wt-text-caption.wt-text-truncate.wt-text-gray", { findOnce: false }, (el) => {
    var parentListItem = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    var obsfucatedSpans = el.getElementsByTagName('span');
    var dict = new Object();

    // Sift the nonsense spans into piles.
    for (let i = 0; i < obsfucatedSpans.length; i++) {
        if (obsfucatedSpans[i].innerText && obsfucatedSpans[i].className)
        {
            if (dict[obsfucatedSpans[i].className] == undefined) {
                dict[obsfucatedSpans[i].className] = '';
            }
            dict[obsfucatedSpans[i].className] += obsfucatedSpans[i].innerText;
        }
    }

    // Identify if any of the text discovered looks like an ad.
    if (dict && Object.keys(dict).length > 1) {
        for (let i = 0; i < Object.keys(dict).length; i++) {
            var concatenatedString = String(dict[Object.keys(dict)[i]]);
            if (concatenatedString.match('Ad by '))
            {
                parentListItem.remove();
            }
        }
    }
})
// ==UserScript==
// @name         DoneDeal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For car search: Convert (miles) mileage to km, and (£) price to €, so that the list contains consistent information, and item page
// @author       You
// @match        https://www.donedeal.ie/cars*
// @match        https://www.donedeal.ie/cars-for-sale/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donedeal.ie
// @grant        none
// @require         https://code.jquery.com/jquery-3.6.3.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457264/DoneDeal.user.js
// @updateURL https://update.greasyfork.org/scripts/457264/DoneDeal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.location.href.includes ('/cars-for-sale/')) { /* Details page */
        $('div[class|="KeyInfoList__Text"]:contains(" mi")').css('color','red').each(function() {
            $( this ).text (Math.round(parseInt ($( this ).text().replace (" mi", "").replace (",", "")) * 1.609).toLocaleString() + " km");
        });
        $('p[class|="Price__CurrentPrice"]:contains("£")').css('color','red').each(function() {
            $( this ).text ("€" + Math.round(parseInt ($( this ).text().replace ("£", "").replace (",", "")) * 1.14).toLocaleString());
        });
    } else if (document.location.href.includes ('/cars')) { /* List page */
        $('div[class|="Card__Body"] li[class|="Card__KeyInfoItem"]:contains(" mi")').css('color','red').each(function() {
            $( this ).text (Math.round(parseInt ($( this ).text().replace (" mi", "").replace (",", "")) * 1.609).toLocaleString() + " km");
        });
        $('p[class|="Card__InfoText"]:contains("£")').css('color','red').each(function() {
            $( this ).text ("€" + Math.round(parseInt ($( this ).text().replace ("£", "").replace (",", "")) * 1.14).toLocaleString());
        });
    }
})();
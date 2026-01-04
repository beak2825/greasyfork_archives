// ==UserScript==
// @name         Reaper Purchase History
// @namespace    https://www.reapermini.com/
// @version      0.1
// @description  Show indication on previously-purchased minis
// @author       Spodi
// @match        https://www.reapermini.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/371157/Reaper%20Purchase%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/371157/Reaper%20Purchase%20History.meta.js
// ==/UserScript==

let cacheDurationMs = 1000 * 60 * 10; // 10 min cache

// Gets the product ids, and passes them to the given callback
let getIds = (callback) => {

    // Check if cache has expired
    let expireAt = JSON.parse(GM_getValue('getIdsExpireAt', null));
    if (expireAt && Date.now() > expireAt) {
        GM_setValue('getIdsCache', null);
    }

    // Check if
    let cachedIds = JSON.parse(GM_getValue('getIdsCache', null));
    if (cachedIds) {
        callback(cachedIds);
    } else {
        jQuery.get('https://www.reapermini.com/AccountDetails', (result) => {
            let parsed = parsePage(result);
            GM_setValue('getIdsCache', JSON.stringify(parsed));
            GM_setValue('getIdsExpireAt', Date.now() + cacheDurationMs);
            callback(parsed);
        });
    }
};

// Parse the purchase page html, return the list of purchased product ids
let parsePage = (html) => {
    let regex = /([0-9]{4,7}):/g;

    let str;
    $(html).find('.orderboxhistory')
        .each(function() { str += $(this).html(); });

    let results = [];
    let match;
    do {
        match = regex.exec(str);
        if (match) {
            results.push(match[1]);
        }
    } while (match);
    return results;
}

(function() {
    'use strict';
    getIds(purchasedProductIds => {

        $('.widget li').each(function() {
            // Get the product id for each widget
            let match = $(this).text().match(/([0-9]{4,6}):/);
            let elemProductId = match && match[1];

            // Check if this is one we have purchased before
            if (purchasedProductIds.indexOf(elemProductId) < 0) {
                return;
            }

            // If so, style accordingly
            $(this)
                .css('border-color', 'green')
                .css('background', '#ddd');
        });
    });
})();
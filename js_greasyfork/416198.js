// ==UserScript==
// @name        SteamAddTo
// @namespace	Forbidden Siren
// @version      0.1
// @description  input SteamAppId then the item is added
// @author       You
// @match        https://store.steampowered.com/*
// @grant	GM_registerMenuCommand
// @grant	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/416198/SteamAddTo.user.js
// @updateURL https://update.greasyfork.org/scripts/416198/SteamAddTo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_registerMenuCommand("AddWishlist", function () {
        const name = prompt("Please input steam", "");
        if (name) {
            const num = parseInt(name);
            if (!isNaN(num)) {
                unsafeWindow.AddToWishlist(num, 'add_to_wishlist_area', 'add_to_wishlist_area_success', 'add_to_wishlist_area_fail', '1_5_9__407');
            }
        }
    });
    GM_registerMenuCommand("AddCart", function () {
        const name = prompt("Please input steam", "");
        if (name) {
            const num = parseInt(name);
            if (!isNaN(num)) {
                unsafeWindow.addToCart(num);
            }
        }
    })
})();
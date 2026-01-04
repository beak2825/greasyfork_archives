// ==UserScript==
// @name         Etsy Redirector
// @namespace    https://ejew.in/
// @version      2025-01-22
// @description  Makes it so people earn more money per money.
// @author       EntranceJew
// @match        https://*.etsy.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524594/Etsy%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/524594/Etsy%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top === window.self && (new URLSearchParams(window.location.search)).get('etsrc') !== 'sdt') {
        let shop_user_name_check = window.location.pathname.match(/^\/shop\/([^\/\r\n]*)/);
        if (shop_user_name_check) {
            let shop_user_name = shop_user_name_check[1];
            window.location.href = `https://${shop_user_name}.etsy.com`;
        }
    }
})();
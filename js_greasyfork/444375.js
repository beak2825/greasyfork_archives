// ==UserScript==
// @name         Steam Powered Auto Code Redeemer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Helper for Twtich chat steam code redeem
// @author       jaceob
// @match        https://store.steampowered.com/account/registerkey*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/444375/Steam%20Powered%20Auto%20Code%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/444375/Steam%20Powered%20Auto%20Code%20Redeemer.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    $(window).load(function() {
        $("#accept_ssa").prop('checked', true);
        $('#register_btn')[0].click();
    });
})();
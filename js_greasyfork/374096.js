// ==UserScript==
// @name         自動結帳click
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://buy.mi.com/tw/cart
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374096/%E8%87%AA%E5%8B%95%E7%B5%90%E5%B8%B3click.user.js
// @updateURL https://update.greasyfork.org/scripts/374096/%E8%87%AA%E5%8B%95%E7%B5%90%E5%B8%B3click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval (function() {
        $("#mi_checkout").click();
    }, 1000);
})();
// ==UserScript==
// @name         nswitch_books_cart_list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  博客來購物車
// @author       aKan
// @match        https://db.books.com.tw/shopping/cart_list.php?item=N001144188
// @match        https://db.books.com.tw/shopping/cart_list.php?item=N001156044
// @match        https://db.books.com.tw/shopping/cart_list.php?loc=tw_customer_001
// @match        https://db.books.com.tw/shopping/cart_list.php
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/397536/nswitch_books_cart_list.user.js
// @updateURL https://update.greasyfork.org/scripts/397536/nswitch_books_cart_list.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        $("a#inside_checkout").click();
    });
})();

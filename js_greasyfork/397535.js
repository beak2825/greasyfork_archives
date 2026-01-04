// ==UserScript==
// @name         nswitch_books_payment_info
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  博客來結帳流程 (分3期0利率)
// @author       aKan
// @match        https://db.books.com.tw/shopping/payment_info.php
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/397535/nswitch_books_payment_info.user.js
// @updateURL https://update.greasyfork.org/scripts/397535/nswitch_books_payment_info.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        // [value=5] 7-11取貨
        // [value=3] 宅配到府
        var shippingMethodRadio = $("input:radio[name='shipping_method'][value=5]");
        //console.log(shippingMethodRadio);
        shippingMethodRadio.click();

        // [value=7] 7-11取貨付現
        // [value=C] 信用卡一次付清
        // [value=V] 信用卡分期付款
        var paytypeRadio = $("input:radio[name='paytype'][value=V]");
        //console.log(paytypeRadio);
        paytypeRadio.click();

        // [value=3] 分3期
        // [value=6] 分6期
        var selectRadio = $("input:radio[name='SelectNcccInstallment'][value=3]");
        //console.log(selectRadio);
        selectRadio.click();

        //setTimeout(function () {
            var nextOneButton = $("#NextOne")
            //console.log(nextOneButton);
            //nextOneButton.click();
            //console.log(nextOneButton[0]);
            nextOneButton[0].click();
        //}, 100);
    });
})();

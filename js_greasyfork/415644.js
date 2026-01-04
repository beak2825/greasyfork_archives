// ==UserScript==
// @name         樂天確認結帳
// @description  樂天確認結帳!
// @namespace    https://www.rakuten.com.tw/
// @version      1.1
// @author       lupohan44
// @match        *://www.rakuten.com.tw/buy/payment
// @grant        none
// @require      //code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415644/%E6%A8%82%E5%A4%A9%E7%A2%BA%E8%AA%8D%E7%B5%90%E5%B8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/415644/%E6%A8%82%E5%A4%A9%E7%A2%BA%E8%AA%8D%E7%B5%90%E5%B8%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body > payment-page > div > div > div.row > div.col-sm-6.col-md-8.main-frame > form > div:nth-child(8) > super-points > div > div:nth-child(4) > div > div.col-md-10.col-md-offset-1 > label:nth-child(2) > div > div.media-left").click();
    $("body > payment-page > div > div > div.row > div.col-sm-6.col-md-8.main-frame > form > div:nth-child(9) > coupons > div > div > div > div > div:nth-child(2) > div > label > div > div.media-left").click();
    $("#order-payments > payment-methods > div > div > div > div:nth-child(1) > div > div > payment-method > div > div > div.media-left.lt-payment-method > input").click();
})();
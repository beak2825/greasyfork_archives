// ==UserScript==
// @name         楽天市場（購入時ショップお気に入り自動チェックOFF）
// @namespace    rakuten
// @version      0.1
// @description  楽天で商品を購入するとき、お気に入り登録を自動でOFFにする
// @author       moniter_support
// @include      https://basket.step.rakuten.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440680/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%EF%BC%88%E8%B3%BC%E5%85%A5%E6%99%82%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AFOFF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440680/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%EF%BC%88%E8%B3%BC%E5%85%A5%E6%99%82%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AFOFF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (0 < jQuery("img#clearShopBookMark").size()) {
        jQuery("img#clearShopBookMark").click();
    }
})();

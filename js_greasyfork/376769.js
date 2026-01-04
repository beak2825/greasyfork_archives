// ==UserScript==
// @name         楽天市場（購入時メルマガ自動チェックOFF）
// @namespace    rakuten
// @version      0.1
// @description  楽天で商品を購入するとき、メルマガ購読のチェックを自動でOFFにする
// @author       nikukoppun
// @include      https://basket.step.rakuten.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376769/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%EF%BC%88%E8%B3%BC%E5%85%A5%E6%99%82%E3%83%A1%E3%83%AB%E3%83%9E%E3%82%AC%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AFOFF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376769/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%EF%BC%88%E8%B3%BC%E5%85%A5%E6%99%82%E3%83%A1%E3%83%AB%E3%83%9E%E3%82%AC%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AFOFF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (0 < jQuery("img#clearMailMagazine").size()) {
        jQuery("img#clearMailMagazine").click();
    }
})();
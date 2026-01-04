// ==UserScript==
// @name         Twitterのリスト(タイムライン)を画像だけにする
// @namespace    https://twitter.com/yosshi9990
// @version      1.0
// @description  ツイートを画像だけにする。
// @author       元祖のヨッシー
// @match        https://twitter.com/i/lists/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487106/Twitter%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%28%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%82%A4%E3%83%B3%29%E3%82%92%E7%94%BB%E5%83%8F%E3%81%A0%E3%81%91%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/487106/Twitter%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%28%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%82%A4%E3%83%B3%29%E3%82%92%E7%94%BB%E5%83%8F%E3%81%A0%E3%81%91%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    window.setInterval(function(){
        document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(function (value, index) {
                if(value.querySelector('[aria-label="画像"]')===null){
                    value.style="display:none; !important";
                }
        });
    }, 500);
})();
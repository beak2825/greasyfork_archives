// ==UserScript==
// @name         Twitter簡単ブロック
// @namespace    https://twitter.com/yosshi9990
// @version      1.0
// @description  Twitterで簡単にブロックできる
// @author       元祖のヨッシー
// @match        *://twitter.com/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480536/Twitter%E7%B0%A1%E5%8D%98%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/480536/Twitter%E7%B0%A1%E5%8D%98%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    window.setInterval(function(){
        document.querySelectorAll('[data-testid="block"]').forEach(function (value, index) {
                value.click();
        });
        document.querySelectorAll('[data-testid="confirmationSheetConfirm"]').forEach(function (value, index) {
                value.click();
        });
    }, 200);
//上の200の値を短くすると更にブロックが早くなりますが、重くなる可能性があります。
})();
// ==UserScript==
// @name         ポストするボタンをエックスするボタンに変更
// @namespace    https://twitter.com/yosshi9990
// @version      1.1
// @description  Twiiterのツイートするボタンをエックスするボタンに変更する。
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
// @downloadURL https://update.greasyfork.org/scripts/471612/%E3%83%9D%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%82%A8%E3%83%83%E3%82%AF%E3%82%B9%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%81%AB%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/471612/%E3%83%9D%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%82%A8%E3%83%83%E3%82%AF%E3%82%B9%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%81%AB%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    window.setInterval(function(){
        let elements = document.querySelectorAll('*');
        const filterElements = Array.from(elements)
        .filter((element)=> element.textContent === 'ポストする');
        filterElements[7].textContent="エックスする";
    }, 500);
})();
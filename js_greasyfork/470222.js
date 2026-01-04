// ==UserScript==
// @name         Twitterツイートをさらに表示を自動クリック
// @namespace    https://twitter.com/yosshi9990
// @version      1.0
// @description  Twitterツイートをさらに表示を自動でクリックします
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
// @downloadURL https://update.greasyfork.org/scripts/470222/Twitter%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92%E3%81%95%E3%82%89%E3%81%AB%E8%A1%A8%E7%A4%BA%E3%82%92%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/470222/Twitter%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92%E3%81%95%E3%82%89%E3%81%AB%E8%A1%A8%E7%A4%BA%E3%82%92%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    window.setInterval(function(){
        let sarani=document.querySelectorAll('[class="css-18t94o4 css-1dbjc4n r-1777fci r-1pl7oy7 r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu"]');
        if(sarani.length!==0){
            sarani[0].click();
        }
        let hensin=document.querySelectorAll('[class="css-18t94o4 css-1dbjc4n r-16y2uox r-19u6a5r r-1ny4l3l r-m2pi6t r-o7ynqc r-6416eg"]');
        if(hensin.length!==0){
            hensin[0].click();
        }
    }, 200);
//上の200の値を短くすると更にブロックが早くなりますが、重くなる可能性があります。
})();
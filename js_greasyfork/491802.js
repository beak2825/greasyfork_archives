// ==UserScript==
// @name         Twitterいいね爆撃
// @namespace    https://twitter.com/yosshi9990
// @version      1.1
// @description  Twitterいいね爆撃します。
// @author       元祖のヨッシー
// @match        *://x.com/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491802/Twitter%E3%81%84%E3%81%84%E3%81%AD%E7%88%86%E6%92%83.user.js
// @updateURL https://update.greasyfork.org/scripts/491802/Twitter%E3%81%84%E3%81%84%E3%81%AD%E7%88%86%E6%92%83.meta.js
// ==/UserScript==

(function() {
       window.setInterval(function(){
        let basea=document.querySelectorAll('[class="css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l"]');
        basea.forEach(function (vaka, inde) {
            window.scrollTo({top: vaka.getBoundingClientRect().top+window.pageYOffset, left: 0, behavior: 'instant'});
            if(vaka.getAttribute("data-testid")=="like"){
                vaka.click();
            }
        });
    }, 100);
})();
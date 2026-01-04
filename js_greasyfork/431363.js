// ==UserScript==
// @name ヨシケイの注文画面を横6列にする
// @namespace com.mikan-megane.yoshikei
// @version 1.2.0
// @description 横6列にして1週間毎に見えるようにする
// @author mikan-megane
// @grant GM_addStyle
// @run-at document-start
// @match *://*.yoshikei-dvlp.co.jp/*
// @downloadURL https://update.greasyfork.org/scripts/431363/%E3%83%A8%E3%82%B7%E3%82%B1%E3%82%A4%E3%81%AE%E6%B3%A8%E6%96%87%E7%94%BB%E9%9D%A2%E3%82%92%E6%A8%AA6%E5%88%97%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431363/%E3%83%A8%E3%82%B7%E3%82%B1%E3%82%A4%E3%81%AE%E6%B3%A8%E6%96%87%E7%94%BB%E9%9D%A2%E3%82%92%E6%A8%AA6%E5%88%97%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
let css = `
    .container {
        max-width: calc(1170px *2);
    }
    .site-inner--recipe .main-wrap .menu-lst__item, .site-inner--menu-list .main-wrap .menu-lst__item {
        width: calc(31% / 2);
        margin-right: calc(3.5% / 2.5);
    }
    .site-inner--recipe .main-wrap .menu-lst__item:nth-child(3n), .site-inner--menu-list .main-wrap .menu-lst__item:nth-child(3n) {
        margin-right: calc(3.5% / 2.5);
    }
    .site-inner--recipe .main-wrap .menu-lst__item:nth-child(6n), .site-inner--menu-list .main-wrap .menu-lst__item:nth-child(6n) {
        margin-right: 0;
    }
    .site-inner--recipe .search-area .week-sort, .site-inner--menu-list .search-area .week-sort {
        width: calc(40%/2);
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

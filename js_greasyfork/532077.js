// ==UserScript==
// @name AtCoder の順位表を広げるやつ
// @namespace github.com/tatyam-prime
// @version 0.1.1
// @description AtCoder の順位表を幅 100% で表示します。ついでに高さを圧縮します。
// @author tatyam
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match https://atcoder.jp/contests/*/standings*
// @downloadURL https://update.greasyfork.org/scripts/532077/AtCoder%20%E3%81%AE%E9%A0%86%E4%BD%8D%E8%A1%A8%E3%82%92%E5%BA%83%E3%81%92%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/532077/AtCoder%20%E3%81%AE%E9%A0%86%E4%BD%8D%E8%A1%A8%E3%82%92%E5%BA%83%E3%81%92%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
let css = `#main-container > div.row {
    margin: 0;
}
#main-container {
    padding-top: 0 !important;
    padding-bottom: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    margin: 0;
    width: 100%;
}
#main-container > div.row > div:nth-child(2) {
    padding: 0;
}
#vue-standings > div.clearfix > p > span.pull-right.small.mt-2.loading-hide {
    margin: 0;
}
.standings-result p {
    margin: 0;
}
hr,
.pagination,
.a2a_kit,
#contest-nav-tabs,
#main-div > nav,
#vue-standings > div.clearfix > p > span.h2,
body > div.container {
    display: none;
}
#menu-wrap,
#scroll-page-top {
    display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

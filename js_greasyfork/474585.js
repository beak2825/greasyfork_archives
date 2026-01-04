// ==UserScript==
// @name 楽天の PR 商品を非表示にする
// @namespace https://github.com/Cside/rakuten-pr-blocker
// @version 0.0.4
// @description 楽天市場の検索結果から PR 商品（広告商品）を除外する
// @author Cside
// @homepageURL https://github.com/Cside/rakuten-pr-blocker
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://search.rakuten.co.jp/search/mall/*
// @downloadURL https://update.greasyfork.org/scripts/474585/%E6%A5%BD%E5%A4%A9%E3%81%AE%20PR%20%E5%95%86%E5%93%81%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474585/%E6%A5%BD%E5%A4%A9%E3%81%AE%20PR%20%E5%95%86%E5%93%81%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  [class~='searchresultitem'][data-card-type='cpc'] {
    display: none;
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

// ==UserScript==
// @name Compact Yahoo! Finance
// @namespace https://greasyfork.org/ja/users/135110-shino
// @version 2024.0829.1838
// @description Compact Yahoo! Finance CSS (Japan)
// @author shino
// @license Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match https://finance.yahoo.co.jp/portfolio/detail?portfolioId*
// @downloadURL https://update.greasyfork.org/scripts/451241/Compact%20Yahoo%21%20Finance.user.js
// @updateURL https://update.greasyfork.org/scripts/451241/Compact%20Yahoo%21%20Finance.meta.js
// ==/UserScript==

(function() {
let css = `

/* テーブルセル内の余白調整 */
td.ListDisplayPortfolioItems__detail__3Swz{padding:1px!important;}

/* 検索ボックスの余白調整  */
div.PortfolioDetail__search__3C9b{margin:2px!important;}

/* 損益表の余白調整 */
section.ProfitLossTable__2tKF{margin-top:2px!important; padding-top:2px!important;}

/* 損益や保有数など・・・非表示 */
div.PortfolioDetailHeader__note__2Mrb{display:none;}

/* 銘柄やファンドの・・・非表示 */
a.ProfitLossTable__link__2jWJ{display:none;}

/* 損益表とテーブル間のボーダー調整 */
div.Liquid__3exa{margin:1px!important;}

/* テーブルの余白調整 */
div.Card__1Idt{margin:2px!important; padding:2px!important;}
div.ListDisplayPortfolioItems__mainInner__9LS8{padding:1px!important;}

/* フッターメニュー 非表示 */
div.ServiceFooter__introduction__2b7t{display:none;}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

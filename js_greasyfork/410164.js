// ==UserScript==
// @name Twitterのでかいカード小さくする
// @namespace rinsuki.net
// @version 1.1.3
// @description 場所を取るでかいカードを小さくします
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/410164/Twitter%E3%81%AE%E3%81%A7%E3%81%8B%E3%81%84%E3%82%AB%E3%83%BC%E3%83%89%E5%B0%8F%E3%81%95%E3%81%8F%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/410164/Twitter%E3%81%AE%E3%81%A7%E3%81%8B%E3%81%84%E3%82%AB%E3%83%BC%E3%83%89%E5%B0%8F%E3%81%95%E3%81%8F%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    [data-testid="card.wrapper"] {
        flex-direction: row;
    }
    [data-testid="card.wrapper"] > *:not([data-testid*="card"]) {
        flex: 1;
    }
    [data-testid="card.layoutLarge.media"] {
        width: calc(6em / (9 / 16));
        border: none !important;
    }
    [data-testid="card.layoutLarge.media"] + div [style*="-webkit-line-clamp"] {
        -webkit-line-clamp: 1 !important;
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

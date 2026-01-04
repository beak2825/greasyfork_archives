// ==UserScript==
// @name ニコニコ FullHD プレーヤー
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description WQHD以上の解像度のモニターを使っている人向けに、プレーヤー部が1920x1080になる新サイズを導入します。
// @author rinsuki
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.nicovideo.jp/watch/*
// @downloadURL https://update.greasyfork.org/scripts/465067/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%20FullHD%20%E3%83%97%E3%83%AC%E3%83%BC%E3%83%A4%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/465067/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%20FullHD%20%E3%83%97%E3%83%AC%E3%83%BC%E3%83%A4%E3%83%BC.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    @media screen and (min-width: calc(1920px + 384px + 72px)) and (min-height: calc(1080px + 130px)) {
        body.is-autoResize .WatchAppContainer-main {
            width: calc(1920px + 384px);
        }
        body.is-autoResize:not(.is-fullscreen) .VideoContainer {
            height: 1080px;
            width: 1920px;
        }
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

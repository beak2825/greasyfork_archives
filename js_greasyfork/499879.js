// ==UserScript==
// @name jpdb.io KanjiStrokeOrders Vocabulary
// @namespace https://greasyfork.org/users/1309172
// @version 0.1
// @description Use KanjiStrokeOrders font on Vocabulary page
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://jpdb.io/*
// @downloadURL https://update.greasyfork.org/scripts/499879/jpdbio%20KanjiStrokeOrders%20Vocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/499879/jpdbio%20KanjiStrokeOrders%20Vocabulary.meta.js
// ==/UserScript==

(function() {
let css = `

@font-face {
    font-family: "KanjiStrokeOrders";
    src: url("https://raw.githubusercontent.com/edarzh/kanjistrokeorders/main/KanjiStrokeOrders_v4.004.woff2");
}

body > .container > div > .review-hidden > div > .plain > :nth-child(3) {
    font-family: KanjiStrokeOrders;
    font-size: 100pt;
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

// ==UserScript==
// @name 快团团小票打印间距
// @namespace tester
// @version 0.1.2
// @description ktt
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/522615/%E5%BF%AB%E5%9B%A2%E5%9B%A2%E5%B0%8F%E7%A5%A8%E6%89%93%E5%8D%B0%E9%97%B4%E8%B7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/522615/%E5%BF%AB%E5%9B%A2%E5%9B%A2%E5%B0%8F%E7%A5%A8%E6%89%93%E5%8D%B0%E9%97%B4%E8%B7%9D.meta.js
// ==/UserScript==

(function() {
let css = `.print-item {
    padding-top: 150px !important;
    padding-bottom: 150px !important;
}

.order-import-time {
    display: none;
}

.order-sort-num {
    display: none;
}

#printContent {
    width: 250px;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

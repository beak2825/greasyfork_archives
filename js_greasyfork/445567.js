// ==UserScript==
// @name weibo hot search font
// @namespace span
// @author max
// @description change into bigger font
// @version 1.2
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://s.weibo.com/top/summary*
// @downloadURL https://update.greasyfork.org/scripts/445567/weibo%20hot%20search%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/445567/weibo%20hot%20search%20font.meta.js
// ==/UserScript==

(function() {
let css = `
th, td {
    margin: 0;
    padding: 0;
    font-style: normal;
    font-size: 14px;
}
 `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

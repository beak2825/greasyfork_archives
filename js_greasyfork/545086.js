// ==UserScript==
// @name Suima Rainbow
// @namespace https://github.com/TwoSquirrels
// @version 1.0
// @description 五フッ化アンチモンを虹色に光らせるだけ
// @author TwoSquirrels
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/545086/Suima%20Rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/545086/Suima%20Rainbow.meta.js
// ==/UserScript==

(function() {
let css = `div[role="button"][style*="0197a4f8-b134-7523-8643-f4b8a5c76b9a"] {
  animation: rainbow linear .5s infinite;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

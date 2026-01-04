// ==UserScript==
// @name kickでコメントの名前消すだけのCSS
// @namespace https://greasyfork.org/users/1401270
// @version 0.0.1.20241123134102
// @description This is your new file, start writing code
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/518586/kick%E3%81%A7%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E5%90%8D%E5%89%8D%E6%B6%88%E3%81%99%E3%81%A0%E3%81%91%E3%81%AECSS.user.js
// @updateURL https://update.greasyfork.org/scripts/518586/kick%E3%81%A7%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E5%90%8D%E5%89%8D%E6%B6%88%E3%81%99%E3%81%A0%E3%81%91%E3%81%AECSS.meta.js
// ==/UserScript==

(function() {
let css = `.inline.font-bold{
  display:none;
}
.inline-flex.font-bold{
  display:none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

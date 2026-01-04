// ==UserScript==
// @name futaba-dark-theme
// @namespace http://2chan.net/
// @version 0.2.0
// @description ふたばちゃんねるのスレッド表示のデザインをダークテーマにします
// @author ame-chan
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/472501/futaba-dark-theme.user.js
// @updateURL https://update.greasyfork.org/scripts/472501/futaba-dark-theme.meta.js
// ==/UserScript==

(function() {
let css = `:root {
  --link: #dc143c;
  --bg-dark: #1d2123;
  --border-dark: #333;
}

body {
  background-color: var(--bg-dark) !important;
  color: #ccc !important;
}
a {
  color: var(--link);
}
a:hover {
  color: #fff;
}
th[bgcolor="#e04000"] {
  background-color: var(--link);
}
.ftdc {
  color: #ccc;
  background-color: var(--bg-dark);
}
.thre > :is(.rsc, .cnw, .cno) {
  color: #666;
}
.rtd {
  background-color: var(--bg-dark);
  border-top: 1px solid var(--border-dark);
}
.rtd span {
  color: #666;
}
.res_no {
  color: #da4b58 !important;
}
.cno,
.sod {
  color: #fff;
}
hr {
  border-bottom: 1px solid var(--border-dark);
}

#futaoptions-resBtn {
  background-color: var(--link);
}
.futaoptions-form {
  background-color: #292c32;
  border: 1px solid #333;
}

/* No.ポップアップ */
.pdmm {
  background-color: #292c32;
  border: 1px solid #333;
  box-shadow: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

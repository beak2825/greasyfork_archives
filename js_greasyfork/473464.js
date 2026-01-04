// ==UserScript==
// @name KKTV 去浮水印
// @namespace https://greasyfork.org/zh-TW/scripts/473464
// @version 0.1
// @description 去除 KKTV 浮水印
// @author Clavius
// @license 無
// @match https://*.kktv.me/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=kktv.me
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/473464/KKTV%20%E5%8E%BB%E6%B5%AE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473464/KKTV%20%E5%8E%BB%E6%B5%AE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
let css = `

/* 去浮水印 */
.player__logo {
	display: none;
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

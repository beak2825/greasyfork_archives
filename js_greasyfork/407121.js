// ==UserScript==
// @name 垃圾百度
// @namespace net.xiamp
// @version 1.0.1
// @description 屏蔽百度
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/407121/%E5%9E%83%E5%9C%BE%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/407121/%E5%9E%83%E5%9C%BE%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

	body { display: none; }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

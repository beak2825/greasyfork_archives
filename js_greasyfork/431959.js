// ==UserScript==
// @name CSS示例
// @namespace AN drew
// @version 0.0.1
// @description 以百度为例
// @grant GM_addStyle
// @run-at document-start
// @match *://*.baidu.com/*
// @match baidu.com
// @match baidu.com*
// @include /^(?:baidu.com)$/
// @downloadURL https://update.greasyfork.org/scripts/431959/CSS%E7%A4%BA%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431959/CSS%E7%A4%BA%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href === "baidu.com") {
  css += `
  .text-color {
      color: black;
  }
  `;
}
if (location.href.startsWith("baidu.com")) {
  css += `
  .text-color {
      color: black;
  }
  `;
}
if ((location.hostname === "baidu.com" || location.hostname.endsWith(".baidu.com"))) {
  css += `
  .text-color {
      color: black;
  }
  `;
}
if (new RegExp("^(?:baidu.com)\$").test(location.href)) {
  css += `
  .text-color {
      color: black;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

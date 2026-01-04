// ==UserScript==
// @name 虎slslsls
// @namespace Sssss
// @version 1.0.5
// @description 我在，不用担心。 —— 瑶瑶·加入队伍·其三
// @author 云浮鱼
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ambr.top/*
// @match *://*.genshin-impact.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/469468/%E8%99%8Eslslsls.user.js
// @updateURL https://update.greasyfork.org/scripts/469468/%E8%99%8Eslslsls.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "ambr.top" || location.hostname.endsWith(".ambr.top"))) {
  css += `
  div[name="Advertisment"],
  div[class*=“footer”],
  video {
      display: none;
  }
  `;
}
if ((location.hostname === "genshin-impact.fandom.com" || location.hostname.endsWith(".genshin-impact.fandom.com"))) {
  css += `

  .right-rail-wrapper.WikiaRail,
  .sticky-modules-wrapper {
  display:none;
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

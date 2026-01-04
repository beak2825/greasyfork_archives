// ==UserScript==
// @name 2_CSS_Blocker All content
// @namespace https://greasyfork.org/ru/users/816924-grizon
// @version 1.1
// @description Блокировщик всего контента
// @author GrizonRu
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.crypto4tun.com/*
// @match *://*.askpaccosi.com/*
// @match *://*.2the.space/*
// @match *://*.westbit.online/*
// @downloadURL https://update.greasyfork.org/scripts/443511/2_CSS_Blocker%20All%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/443511/2_CSS_Blocker%20All%20content.meta.js
// ==/UserScript==

(function() {
let css = `
body
{
	display: none;
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

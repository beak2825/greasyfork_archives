// ==UserScript==
// @name Discord thing
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Blocks "message user" box in the popup that appears when you click on a person's name.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/420090/Discord%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/420090/Discord%20thing.meta.js
// ==/UserScript==

(function() {
let css = `

  div.footer-1fjuF6 {
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

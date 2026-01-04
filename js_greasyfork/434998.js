// ==UserScript==
// @name SSC image fix
// @namespace github.com/regs01/usercss
// @version 1.0.0
// @description Fix whitespace for downscaled images.
// @author coth
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.skyscrapercity.com/*
// @downloadURL https://update.greasyfork.org/scripts/434998/SSC%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/434998/SSC%20image%20fix.meta.js
// ==/UserScript==

(function() {
let css = `
  
article.message article.message-body div.lbContainer {
  padding-bottom: unset !important;
  height: unset !important;
}

article.message article.message-body div.lbContainer img {
  position: relative !important;
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

// ==UserScript==
// @name Reduce Chat3.0 transition-duration
// @namespace tornraffy
// @version 1.2
// @description Reduces Torn City Chat3.0 transition-duration
// @author Raffy
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/532354/Reduce%20Chat30%20transition-duration.user.js
// @updateURL https://update.greasyfork.org/scripts/532354/Reduce%20Chat30%20transition-duration.meta.js
// ==/UserScript==

(function() {
let css = `
#chatRoot * {transition-duration: 50ms !important;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

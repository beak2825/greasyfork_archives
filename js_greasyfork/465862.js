// ==UserScript==
// @name ChatGPT Hide Identity
// @namespace github.com/openstyles/stylus
// @version 0.1.1
// @description To hide your identity in ChatGPT
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/465862/ChatGPT%20Hide%20Identity.user.js
// @updateURL https://update.greasyfork.org/scripts/465862/ChatGPT%20Hide%20Identity.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    
    img[src*="avatar"]{
        transform: scale(10) translate(-2px,-2px);
        transform-origin: 0 0;
        pointer-events: none !important;
        user-select: none !important;
    }
    button:has(img[src*="avatar"]) .text-ellipsis{
        contain: strict;
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

// ==UserScript==
// @name ChatGPT Version in Header
// @namespace github.com/openstyles/stylus
// @version 1.0.4
// @description To make the ChatGPT version in each chat located in the top.
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/464983/ChatGPT%20Version%20in%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/464983/ChatGPT%20Version%20in%20Header.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    
    main.flex>div.flex-1>div:first-child>div:first-child>div.flex:first-child>div.flex:first-child:nth-last-child(n+3) {
        position: sticky;
        top: 0;
        z-index: 999;
        background-color: #182436;
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

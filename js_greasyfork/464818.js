// ==UserScript==
// @name Make Google Lyrics Copyable
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description To copy lyrics in Google Search
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/464818/Make%20Google%20Lyrics%20Copyable.user.js
// @updateURL https://update.greasyfork.org/scripts/464818/Make%20Google%20Lyrics%20Copyable.meta.js
// ==/UserScript==

(function() {
let css = `
    
    [data-async-context] [id*="lyrics"] div[jsname] div[data-lyricid]:only-of-type{
        user-select: all !important;
        touch-events: initial !important;
        pointer-events: none !important;
    } 
    
    [data-async-context] [id*="lyrics"] div[jsname] > div[class]:not([jsname]){
        pointer-events:none !important;
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

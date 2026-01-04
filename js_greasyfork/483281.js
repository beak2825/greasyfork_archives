// ==UserScript==
// @name No Indeterminate-bar in YouTube Live Chat
// @namespace github.com/openstyles/stylus
// @version 0.1.0
// @description A new userstyle
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/483281/No%20Indeterminate-bar%20in%20YouTube%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/483281/No%20Indeterminate-bar%20in%20YouTube%20Live%20Chat.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    #banner-container.yt-live-chat-banner-renderer #indeterminate-bar {
        
      --yt-live-chat-banner-indeterminate-bar-background:repeating-linear-gradient( 90deg, transparent, transparent 6px, transparent 6px, transparent 9px )
        
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

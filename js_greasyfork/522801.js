// ==UserScript==
// @name Fix YouTube Chat Emoji Button Position
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description A new userstyle
// @author Me
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/live_chat*
// @downloadURL https://update.greasyfork.org/scripts/522801/Fix%20YouTube%20Chat%20Emoji%20Button%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/522801/Fix%20YouTube%20Chat%20Emoji%20Button%20Position.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    
    #input-container.yt-live-chat-message-input-renderer yt-live-chat-text-input-field-renderer.style-scope.yt-live-chat-message-input-renderer {
        
        margin-right: 30px;
    }
    
     #input-container.yt-live-chat-message-input-renderer yt-live-chat-text-input-field-renderer.style-scope.yt-live-chat-message-input-renderer + #emoji-picker-button {
        position: absolute;
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

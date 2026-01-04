// ==UserScript==
// @name Fix tp-yt-paper-tooltip.yt-live-chat-text-message-renderer
// @namespace github.com/openstyles/stylus
// @version 1.0.3
// @description It is to fix tp-yt-paper-tooltip.yt-live-chat-text-message-renderer
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/live_chat*
// @downloadURL https://update.greasyfork.org/scripts/472954/Fix%20tp-yt-paper-tooltipyt-live-chat-text-message-renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/472954/Fix%20tp-yt-paper-tooltipyt-live-chat-text-message-renderer.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    tp-yt-paper-tooltip.style-scope.yt-live-chat-text-message-renderer[role="tooltip"],
    tp-yt-paper-tooltip.style-scope.yt-live-chat-author-badge-renderer[role="tooltip"] {
        
        border-radius: 4px;
        margin: 8px;
        text-transform: none;
        word-break: normal;
        font-family: "Roboto","Arial",sans-serif;
        font-size: 1.2rem;
        line-height: 1.8rem;
        font-weight: 400;
                background-color: var(--paper-tooltip-background, #616161);
        color: var(--paper-tooltip-text-color, white);
        padding: 8px;
            -webkit-font-smoothing: antialiased;
            outline: none;
        
        
        opacity: 0.8;
        transform:translate(0px, -10px);
        display: var(--mtooltip-display);
        
    }
    
    .yt-live-chat-item-list-renderer:not(:hover){
        --mtooltip-display: none;
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

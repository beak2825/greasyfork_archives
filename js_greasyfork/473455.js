// ==UserScript==
// @name YouTube: Hide Tickers (Live Chat)
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description To Hide Tickers Bar in YouTube Live Chat
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/live_chat*
// @downloadURL https://update.greasyfork.org/scripts/473455/YouTube%3A%20Hide%20Tickers%20%28Live%20Chat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473455/YouTube%3A%20Hide%20Tickers%20%28Live%20Chat%29.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    yt-live-chat-ticker-renderer.style-scope.yt-live-chat-renderer {
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

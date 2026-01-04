// ==UserScript==
// @name YouTube - Misc CSS Fix
// @namespace github.com/openstyles/stylus
// @version 1.0.2
// @description To fix some css issues (like YouTube Offline Slate Background)
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/536413/YouTube%20-%20Misc%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/536413/YouTube%20-%20Misc%20CSS%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
    .html5-endscreen.ytp-show-tiles ~ .ytp-offline-slate .ytp-offline-slate-background {
        background-image: none !important;
    }
    .more-button.ytd-comment-replies-renderer > #creator-thumbnail {
        margin: 4px 8px;
        line-height: 100%;
    }
    yt-icon.yt-player-error-message-renderer {
        color: var(--yt-spec-static-overlay-text-primary);
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

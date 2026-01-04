// ==UserScript==
// @name bilibili 自用去广告
// @namespace bilibili
// @version 0.1.2
// @description B 站去广告
// @author bowencool
// @supportURL https://github.com/bowencool/Tampermonkey-Scripts/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/480860/bilibili%20%E8%87%AA%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/480860/bilibili%20%E8%87%AA%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
let css = `
  .note-content .preview-editor * {
    user-select: text;
  }
  [role="caption"] {
    user-select: text !important;
  }
  .pop-live-small-mode,
  [data-loc-id],
  .bili-vote.bili-show,
  .video-page-special-card-small {
    display: none !important;
  }

  :is(.bili-video-card, .feed-card):not(:has(a[href^="https://www.bilibili.com/video"]))
  {
    display: none !important;
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

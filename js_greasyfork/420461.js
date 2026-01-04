// ==UserScript==
// @name Glassy Youtube
// @namespace @ngokimphu
// @version 0.2
// @description make Youtube panes and pop-ups glassy
// @author Ngo Kim Phu
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @include https://www.youtube.com*/*
// @downloadURL https://update.greasyfork.org/scripts/420461/Glassy%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/420461/Glassy%20Youtube.meta.js
// ==/UserScript==

(function() {
let css = `@charset "UTF-8";

    
html:not(.style-scope)[dark] {
    --yt-endpoint-visited-color: #a9c;
    --yt-spec-call-to-action: #9bd !important;
    --yt-spec-text-primary: #ccc !important;
    --yt-button-color: #ccc !important;
    --yt-spec-icon-active-other: var(--yt-button-color) !important;
    --yt-spec-icon-inactive: #777 !important;
    --yt-spec-brand-icon-inactive: var(--yt-spec-icon-inactive) !important;
}
.ytp-button > svg path {
    fill: var(--yt-button-color);
}
.sponsorSkipNotice *, .sponsorBlockPageBody * {
    border-color: var(--yt-spec-text-primary) !important;
    color: var(--yt-spec-text-primary) !important;
}
.sponsorBlockPageBody .switchDot {
    background-color: var(--yt-button-color) !important;
}

html:not(.style-scope)[dark] * {
  --app-drawer-content-container_-_background-color: #18181855;
  --yt-spec-brand-background-primary: #18181899;
  --yt-spec-brand-background-solid: #21212133;
  --yt-searchbox-background: #12121233;
  --ytd-searchbox-legacy-border-color: #30303055;
  --ytd-searchbox-legacy-button-border-color: #30303055;
  --yt-dialog-background: #24242455;
  --paper-listbox-background-color: #212121aa;
  --paper-dialog-background-color: #212121aa;
}
#contentWrapper, #masthead, #masthead-container + * #contentContainer, paper-listbox, paper-dialog {
  backdrop-filter: blur(4px);
}
#chips-wrapper {
  backdrop-filter: blur(2px);
}
ytd-thumbnail-overlay-time-status-renderer {
  opacity: .7 !important;
}
.ytp-ce-element.ytp-ce-element-show, .ytp-progress-list {
  opacity: .4 !important;
}
.ytp-ce-shadow, .ytp-title-text:hover, .ytp-gradient-top:hover {
  opacity: 0 !important;
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

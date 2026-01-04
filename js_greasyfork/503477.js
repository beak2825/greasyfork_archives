// ==UserScript==
// @name YouTube - Compact Thumbnails on Subscriptions Page
// @namespace userstyles.world/user/magma_craft
// @version 20240813.00.36
// @description This style reverts back to compact-styled thumbnails from the subscriptions feed. (but this also removes the 'Shorts' feed from this page to have a cleaner page)
// @author magma_craft
// @license CC Zero
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/503477/YouTube%20-%20Compact%20Thumbnails%20on%20Subscriptions%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/503477/YouTube%20-%20Compact%20Thumbnails%20on%20Subscriptions%20Page.meta.js
// ==/UserScript==

(function() {
let css = `
[page-subtype="subscriptions"] #avatar-link.ytd-rich-grid-media, [page-subtype="subscriptions"] #avatar-container.ytd-rich-grid-media {
display: none !important;
margin-right: 0 !important
}

[page-subtype="subscriptions"] #video-title.ytd-rich-grid-media {
font-size: 1.4rem !important;
line-height: 1.8rem !important
}

[page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #channel-name.ytd-video-meta-block, [page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block {
font-size: 1.2rem !important
}

[page-subtype="subscriptions"] ytd-rich-shelf-renderer {
display: none !important
}

[page-subtype="subscriptions"] ytd-rich-item-renderer {
margin-left: 0px !important;
margin-right: 0px !important;
margin-bottom: 24px;
width: calc(100% / var(--ytd-rich-grid-items-per-row) - 4px - 0.01px)
}

[page-subtype="subscriptions"] h3.ytd-rich-grid-video-renderer {
margin: 8px 0 8px !important
}

[page-subtype="subscriptions"] ytd-primetime-promo-renderer.ytd-rich-section-renderer, [page-subtype="subscriptions"] ytd-inline-survey-renderer.ytd-rich-section-renderer {
border-top: 1px solid var(--yt-spec-10-percent-layer);
border-bottom: 1px solid var(--yt-spec-10-percent-layer)
}

[page-subtype="subscriptions"] ytd-thumbnail[size=large] a.ytd-thumbnail, [page-subtype="subscriptions"] ytd-thumbnail[size=large]:before {
border-radius: 8px !important
}

ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail {
margin: 4px !important
}

[page-subtype="subscriptions"] div.ghost-grid.style-scope.ytd-ghost-grid-renderer {
display: none !important
}

[page-subtype="subscriptions"] html:not(.style-scope) {
--ytd-rich-grid-item-max-width: 210px !important;
--ytd-rich-grid-item-margin: 4px !important
}

[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer, [page-subtype="subscriptions"] #grid-header.ytd-rich-grid-renderer {
width: calc(100% + 4px + 0.01px) !important;
max-width: calc( var(--ytd-rich-grid-items-per-row) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin))) !important
}

@media (max-width: 456px) {ytd-rich-grid-renderer {--ytd-rich-grid-items-per-row: 1 !important;--ytd-rich-grid-posts-per-row: 1 !important;}}

[page-subtype="subscriptions"] ytd-rich-grid-renderer, [page-subtype="subscriptions"] ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer {
--ytd-rich-grid-items-per-row: var(--grid-items-videos--per-row) !important;
--ytd-rich-grid-posts-per-row: var(--grid-posts-videos-per-row) !important
}

@media (max-width: 456px) {html:not(.style-scope) {--grid-items-videos--per-row: 1;--grid-posts-videos-per-row: 1;}}

@media (min-width: 457px) {html:not(.style-scope) {--load-videos-items-per-row: 903px;--grid-items-videos--per-row: 2;--grid-posts-videos-per-row: 2;}}@media (min-width: 647px) {html:not(.style-scope) {--load-videos-items-per-row: 1300px;--grid-items-videos--per-row: 3;--grid-posts-videos-per-row: 3;}}

@media (min-width: 957px) {html:not(.style-scope) {--load-videos-items-per-row: 1680px;--grid-items-videos--per-row: 4;--grid-posts-videos-per-row: 3;}}

@media (min-width: 1171px) {html:not(.style-scope) {--load-videos-items-per-row: 2013px;--grid-items-videos--per-row: 5;--grid-posts-videos-per-row: 3;}}

@media (min-width: 1600px) {html:not(.style-scope) {--load-videos-items-per-row: 2348px;--grid-items-videos--per-row: 6;--grid-posts-videos-per-row: 3;}}

[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row, 
[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row #contents {
display: contents !important
}

[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer, [page-subtype="subscriptions"] #grid-header.ytd-rich-grid-renderer {
--ytd-rich-grid-item-max-width: 210px !important
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

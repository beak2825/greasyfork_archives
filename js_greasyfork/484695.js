// ==UserScript==
// @name YT - Revert home and subscriptions thumbnails pages before 2023
// @namespace userstyles.world/user/magma_craft
// @version 20251208.13.16
// @description This style forces to revert 4-row thumbnails on home feed along with compact thumbnails on subscriptions grid (plus, this also includes disabling gigantic search page thumbnails prior to 2024).
// @author magma_craft
// @license CC Zero
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/484695/YT%20-%20Revert%20home%20and%20subscriptions%20thumbnails%20pages%20before%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/484695/YT%20-%20Revert%20home%20and%20subscriptions%20thumbnails%20pages%20before%202023.meta.js
// ==/UserScript==

(function() {
let css = `
/* Revert 3-row thumbnails on home page back to 4-row one */
[page-subtype="home"] #contents.ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 4 !important
}

[page-subtype="home"] > ytd-two-column-browse-results-renderer > #primary.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer > #contents.ytd-rich-grid-renderer {
  max-width: 1536px !important
}

[page-subtype="home"] #contents > ytd-rich-grid-row,
[page-subtype="home"] #contents > ytd-rich-grid-row > #contents {
  display: contents !important
}

[page-subtype="home"] > ytd-two-column-browse-results-renderer > #primary.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer > #contents.ytd-rich-grid-renderer > #contents > ytd-rich-grid-row > #contents > ytd-rich-item-renderer > #content {
  margin-left: 0 !important;
  margin-right: 0 !important
}

/* Font size and other fixes for the homepage info */
[page-subtype="home"] ytd-video-meta-block[rich-meta][mini-mode] #byline-container.ytd-video-meta-block {
  font-size: 1.4rem !important
}

[page-subtype="home"] ytd-video-meta-block[rich-meta][mini-mode] #metadata-line.ytd-video-meta-block {
  font-size: 1.4rem !important
}

[page-subtype="home"] #content.ytd-rich-section-renderer {
  margin: 0 8px !important
}

/* Force compact thumbnails on subscriptions page */
[page-subtype="subscriptions"] #avatar-link.ytd-rich-grid-media, [page-subtype="subscriptions"] #avatar-container.ytd-rich-grid-media, [page-subtype="subscriptions"] .yt-lockup-metadata-view-model__avatar {
display: none !important;
margin-right: 0 !important
}

[page-subtype="subscriptions"] #video-title.ytd-rich-grid-media, [page-subtype="subscriptions"] .yt-lockup-metadata-view-model__title {
font-size: 1.4rem !important;
line-height: 1.8rem !important
}

[page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #channel-name.ytd-video-meta-block, [page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block, [page-subtype="subscriptions"] .yt-content-metadata-view-model__metadata-text {
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

[page-subtype="subscriptions"] ytd-thumbnail[size=large] a.ytd-thumbnail, [page-subtype="subscriptions"] ytd-thumbnail[size=large]:before, [page-subtype="subscriptions"] .ytThumbnailViewModelLarge {
border-radius: 8px !important
}

ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail, .yt-thumbnail-overlay-badge-view-model--large {
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

/* Revert giant search thumbnails back to normal one */
ytd-two-column-search-results-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #primary.ytd-two-column-search-results-renderer, ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
  max-width: 1096px !important
}
 
ytd-channel-renderer[use-bigger-thumbs][bigger-thumb-style=BIG] #avatar-section.ytd-channel-renderer, ytd-channel-renderer[use-bigger-thumbs] #avatar-section.ytd-channel-renderer,
ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-video-renderer, ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer,
ytd-playlist-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-playlist-renderer, ytd-playlist-renderer[use-bigger-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer,
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-radio-renderer,
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-radio-renderer,
ytd-movie-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] .thumbnail-container.ytd-movie-renderer, ytd-movie-renderer[use-bigger-thumbs] .thumbnail-container.ytd-movie-renderer,
ytd-promoted-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-promoted-video-renderer,
ytd-promoted-sparkles-web-renderer[web-search-layout][use-bigger-thumbs][bigger-thumbs-style=BIG] #thumbnail-container.ytd-promoted-sparkles-web-renderer,
ytd-text-image-no-button-layout-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #text-image-container.ytd-text-image-no-button-layout-renderer,
.yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image,
.yt-lockup-view-model--horizontal .yt-lockup-view-model__content-image {
  max-width: 360px !important
}

/* Quick fixes */
[page-subtype="home"] #content.ytd-rich-section-renderer {
margin: 0 8px !important
}

[page-subtype="home"] ytd-rich-item-renderer[rendered-from-rich-grid] {
margin-left: calc(var(--ytd-rich-grid-item-margin)/2 + var(--ytd-rich-grid-gutter-margin)) !important;
margin-right: -8px !important
}

[page-subtype="home"] ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column], ytd-ad-slot-renderer {
display: none !important
}

[page-subtype="home"] ytd-rich-section-renderer {
margin-left: 16px;
margin-right: 16px
}

[page-subtype="subscriptions"] #content.ytd-rich-item-renderer>.lockup.ytd-rich-item-renderer {
margin-left: 4px !important
}

#home-container-media {
    margin: 24px -16px 0 24px !important;
    padding-right: 24px !important;
    justify-content: center !important
}

@media only screen and (min-width: 392px) {
    #home-page-skeleton .rich-grid-media-skeleton {
        flex-basis: 240px !important;
        min-width: 240px !important;
        max-width: 320px !important
    }
}

@media only screen and (min-width: 1583px) {
    #home-page-skeleton .rich-grid-media-skeleton {
    flex-basis: 304px !important;
    min-width: 304px !important;
    max-width: 360px !important;
    margin: 0 16px 0 0 !important
    }
}

@media only screen and (min-width: 1807px) {
    #home-page-skeleton .rich-grid-media-skeleton {
    flex-basis: 360px !important;
    min-width: 360px !important;
    max-width: 360px !important;
    margin: 0 16px 0 0 !important
    }
}

@media only screen and (min-width: 1600px) {
    #home-container-media {
    display: flex !important;
    grid-template-columns: repeat(4, 1fr) !important
    }
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

// ==UserScript==
// @name         YouTube - Watch Page Classic
// @version      1.0.1
// @description  This script reverts back to the old watch layout before 2022.
// @author       Joey_JTS
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/761382-joey-jts
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499966/YouTube%20-%20Watch%20Page%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/499966/YouTube%20-%20Watch%20Page%20Classic.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_modern_metapanel = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_modern_panels = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_fixie = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_panel_height_matches_player = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();

(function() {
let css = `
ytd-watch-metadata {
display: none !important
}

#meta-contents[hidden], #info-contents[hidden] {
display: block !important
}

#comment-teaser.ytd-watch-metadata {
display: none
}

#owner.ytd-watch-metadata {
border: none
}

ytd-watch-metadata:not([modern-metapanel]) #owner.ytd-watch-metadata {
border: none
}

ytd-watch-metadata[smaller-yt-sans-light-title] h1.ytd-watch-metadata {
font-family: "Roboto",sans-serif;
font-weight: 400;
font-size: 18px
}

ytd-video-primary-info-renderer[use-yt-sans20-light] .title.ytd-video-primary-info-renderer {
font-family: "Roboto",sans-serif;
font-weight: 400;
font-size: 18px
}

.yt-formatted-string[style-target="bold"] {
font-weight: 400
}

/* Revert video list and watch UI fixes */
ytd-watch-flexy #comment-teaser.ytd-watch-metadata {
display: none
}

ytd-watch-flexy #dismissible.ytd-rich-grid-media {
flex-direction: row
}

ytd-watch-flexy #attached-survey.ytd-rich-grid-media,
ytd-watch-flexy #avatar-link.ytd-rich-grid-media {
display: none
}

ytd-watch-flexy ytd-thumbnail.ytd-rich-grid-media,
ytd-watch-flexy ytd-playlist-thumbnail.ytd-rich-grid-media {
margin-right: 8px;
height: 94px;
width: 168px
}

ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail,
ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail {
margin: 4px
}

ytd-watch-flexy ytd-rich-item-renderer,
ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row {
margin: 0
}

ytd-watch-flexy ytd-rich-item-renderer[reduced-bottom-margin] {
margin-top: 8px;
margin-bottom: 0
}

ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer {
padding-top: 0px
}

ytd-watch-flexy ytd-rich-grid-media {
margin-bottom: 8px
}

ytd-watch-flexy #details.ytd-rich-grid-media {
width: 100%;
min-width: 0
}

ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block,
ytd-watch-flexy #channel-name.ytd-video-meta-block {
font-family: "Roboto", "Arial", sans-serif;
font-size: 1.2rem;
line-height: 1.8rem;
font-weight: 400
}

ytd-watch-flexy #video-title.ytd-rich-grid-media {
margin: 0 0 4px 0;
display: block;
font-family: "Roboto", "Arial", sans-serif;
font-size: 1.4rem;
line-height: 2rem;
font-weight: 500;
overflow: hidden;
display: block;
max-height: 4rem;
-webkit-line-clamp: 2;
display: box;
display: -webkit-box;
-webkit-box-orient: vertical;
text-overflow: ellipsis;
white-space: normal
}

ytd-watch-flexy h3.ytd-rich-grid-media {
margin: 0
}

ytd-watch-flexy .title-badge.ytd-rich-grid-media, ytd-watch-flexy .video-badge.ytd-rich-grid-media {
margin-top: 0
}

ytd-watch-flexy ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
display: none
}

ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-watch] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-home] #header.ytd-rich-grid-renderer ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer {
display: flex;
height: 51px;
margin-bottom: 8px
}

ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
position: relative;
top: 0
}

ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer {
padding: 0
}

ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type {
margin: 8px;
margin-left: 0
}

ytd-watch-flexy ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
margin: 0;
padding: 0 8px
}

ytd-watch-flexy[default-layout][reduced-top-margin] #primary.ytd-watch-flexy, ytd-watch-flexy[default-layout][reduced-top-margin] #secondary.ytd-watch-flexy {
padding-top: var(--ytd-margin-6x) !important
}

#channel-name.ytd-video-owner-renderer {
font-size: 1.4rem !important;
line-height: 2rem !important
}

#meta #avatar {
width: 48px;
height: 48px;
margin-right: 16px
}

#meta #avatar img {
width: 100%
}

#actions.ytd-watch-metadata {
min-width: auto !important;
}

/* Subscribe button tweaks */
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:hover {
background-color: #c00
}

yt-button-shape.style-scope.ytd-subscribe-button-renderer {
  display: flex !important
}

yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el {
  display: flex !important
}

#notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible], #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] {
  pointer-events: auto;
  visibility: visible;
  position: static
}

div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m {
  background-color: transparent !important;
  border-radius: 16px !important;
  padding-left: 14px !important;
  padding-right: 2px !important;
  margin-left: 4px !important
}

div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.cbox.yt-spec-button-shape-next--button-text-content, div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing > div.yt-spec-button-shape-next__button-text-content {
  display: none !important
}

#buttons.ytd-c4-tabbed-header-renderer {
  flex-direction: row-reverse !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

// Fix watch action buttons issue on unsupported browsers
const abtnconfig = {
    noFlexibleItems: true
};

function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;

    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;

            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }

            if (abtnconfig.noFlexibleItems) {
                for (var i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }

                delete actions.flexibleItems
            }
        }
    }

    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}

document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});
// ==UserScript==
// @name         YouTube Dark Tweaks
// @namespace    https://greasyfork.org/en/users/805718-spectro
// @version      1.0
// @description  Simply fix white styles in the dark theme
// @author       @Spectro
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455112/YouTube%20Dark%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/455112/YouTube%20Dark%20Tweaks.meta.js
// ==/UserScript==

	// Logo
GM_addStyle(`
img.ytd-yoodle-renderer { height: 24px; content: url("https://www.dropbox.com/s/clov29avkjclrjm/yt_logo_dark.png?raw=1") !important;}
`);
	// Searchbox
GM_addStyle(`
.sbsb_a { background-color: #121212 !important; }
.sbdd_b { background-color: rgb(22, 23, 24) !important; border-color: rgb(53, 58, 59) rgb(56, 61, 63) rgb(56, 61, 63); !important box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px !important; }
.sbsb_d { filter: invert(80%) !important; }
.gsfs { filter: invert(80%) !important; }
.sbqs_c:before { filter: invert(20%) !important; }
.sbfl_a { color: #757575 !important; }
.sbfl_a:hover { color: #dbdbdb !important; }
.sbfl_b { background: rgba(237, 237, 237, .1) !important; }
.sbsb_i { filter: invert(100%) !important; }
ytd-searchbox[has-focus] #container.ytd-searchbox { border: 1px solid #757575 !important; }
ytd-searchbox[desktop-searchbar-style="rounded_corner_borders_light_btn"] #container.ytd-searchbox, ytd-searchbox[desktop-searchbar-style="rounded_corner_autofocus"] #container.ytd-searchbox {border-radius: 12px 0 0 0px !important; }
.sbdd_b { border-color: #757575 #757575 #757575 !important; border-radius: 0px !important; border-bottom-left-radius: 12px !important; border-bottom-right-radius: 12px !important; border-top: 1px solid #757575 !important; }
.sbdd_a {top: 45px !important;}
.sbdd_c {top: 45px !important;}
`);
	// Progress Bar
GM_addStyle(`
.html5-play-progress, .ytp-play-progress {background: ##c00 !important;}
.html5-scrubber-button, .ytp-scrubber-button { background: url("https://www.youtube.com/s/desktop/5708b2cc/img/favicon_32x32.png") !important; width: 32px !important; height: 32px !important; border: none !important; margin-left: -5px !important; margin-top: -6px !important;}
.html5-progress-bar-container, .ytp-progress-bar-container {height: 12px !important;}
.html5-progress-bar, .ytp-progress-bar {margin-top: 12px !important;}
.html5-progress-list, .ytp-progress-list, .video-ads .html5-progress-list.html5-ad-progress-list, .video-ads .ytp-progress-list.ytp-ad-progress-list {height: 8px !important;}
.ytp-volume-slider-track {background: #32eaff !important;}
`);
	// Description
GM_addStyle(`
ytd-watch-flexy[flexy] #primary ytd-watch-metadata ytd-text-inline-expander#description-inline-expander #snippet.style-scope.ytd-text-inline-expander {display: none !important;}
ytd-watch-metadata[clickable-description][description-collapsed] #description.ytd-watch-metadata:hover {background: #ffffff1a !important;}
`);
    // Old Description
GM_addStyle(`
:root {
    --sub-red-btn: #CC0000;
    --sub-white--text-btn: #F2F2F2;
    --sub-black-bg-btn: #303030;}
ytd-watch-metadata { display: none !important;}
#meta-contents[hidden],
#info-contents[hidden] { display: block !important;}
  /* Reverts the video title font. */
ytd-watch-metadata[smaller-yt-sans-light-title] h1.ytd-watch-metadata { font-family: "Roboto", sans-serif; font-weight: 400 !important; font-size: 18px !important;}
ytd-video-primary-info-renderer[use-yt-sans20-light] .title.ytd-video-primary-info-renderer { font-family: "Roboto", sans-serif; font-weight: 400 !important; font-size: 18px !important;}
  /* Removes the bold letters on upload date and view count. */
.yt-formatted-string[style-target="bold"] { font-weight: 400;}
ytd-button-renderer { margin-left: 0 !important; font-size: 13px;}
ytd-toggle-button-renderer { font-size: 13px !important;}
ytd-video-primary-info-renderer { --yt-button-icon-size: 30.6px !important;}
ytd-button-renderer.force-icon-button a.ytd-button-renderer { padding-right: 0;}
.ryd-tooltip-bar-container { padding-top: 0; padding-bottom: 0px; top: -8px; bottom: 0;}
#top-row.style-scope.ytd-video-secondary-info-renderer { padding-top: 4px;}
  /* remove border */
.yt-spec-button-shape-next--size-m,
.yt-spec-touch-feedback-shape__stroke { border-radius: 0 !important; border: none !important;}
  /* Remove spacing between icons */
.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end,
.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading { padding-right: 0;}
  /* Remove margin */
 ytd-download-button-renderer { margin: 0 !important;}
  /* Add spacing for dislike counts */
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end span { padding-left: 6px;}
  /* Change color of subscribe button */
  /* Light theme users */
html:not([dark]) yt-button-shape.ytd-subscribe-button-renderer { color: #82807F !important; background-color: var(--sub-white--text-btn) !important;}
  /* Dark theme users */
html[dark] yt-button-shape.ytd-subscribe-button-renderer { color: #82807F !important; background-color: var(--sub-black-bg-btn) !important;}
  /* Add red background color to Subscribed button */
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled[aria-label^="Subscribe"] { color: var(--sub-white--text-btn) !important; background: var(--sub-red-btn) !important; background-color: var(--sub-red-btn) !important;}
  /* Remove background color*/
.yt-simple-endpoint.style-scope.ytd-subscription-notification-toggle-button-renderer yt-icon-button { background-color: transparent !important;}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after { display: none;}
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
.yt-spec-touch-feedback-shape__fill { background-color: transparent !important;}
  /* Fixed watch page */
ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media { display: inline !important;}
yt-formatted-string#index.style-scope.ytd-playlist-video-renderer { display: inline !important;}
  /* Remove double line on playlits */
ytd-playlist-video-renderer[can-reorder][is-editable]:hover #reorder.ytd-playlist-video-renderer,
ytd-playlist-video-renderer[persistent-drag-handle] #reorder.ytd-playlist-video-renderer { display: none;}
yt-button-shape span[role="text"] { text-transform: uppercase;}
  /* Remove padding spaces */
ytd-watch-flexy[is-two-columns_][theater]:not([fullscreen]) > #columns > #secondary {display: none !important;}
.super-title.ytd-video-primary-info-renderer {display: none !important;}
body ytd-video-primary-info-renderer {padding: 0px 0 0px 0 !important;}
#top-row.style-scope.ytd-video-secondary-info-renderer {padding-top: 0px !important;}
ytd-video-secondary-info-renderer {margin-bottom: 0px !important; padding-bottom: 0px !important;}
#top-row.ytd-video-secondary-info-renderer {margin-bottom: 0px !important;}
`);
	// More...

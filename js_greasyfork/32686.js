//
// Written by Glenn Wiking
// Script Version: 2.0.2c
// Date of issue: 08/29/17
// Date of resolution: 08/29/17
//
// ==UserScript==
// @name        ShadeRoot YT2
// @namespace   SRYT2
// @description Google is at it again, but they'll never destroy your eyes while I'm alive.
// @version     2.0.2c
// @icon        https://i.imgur.com/jtqb6rP.png

// @include        http://*.youtube.*
// @include        https://*.youtube.*
// @include        http://*plus.google.*
// @include        https://*plus.google.*
// @include        http://*apis.google.*
// @include        https://*apis.google.*
// @include        http://*.appspot.*
// @include        https://*.appspot.*

// @exclude        http://*.apiblog.*
// @exclude        https://*.apiblog.*
// @downloadURL https://update.greasyfork.org/scripts/32686/ShadeRoot%20YT2.user.js
// @updateURL https://update.greasyfork.org/scripts/32686/ShadeRoot%20YT2.meta.js
// ==/UserScript==

function ShadeRootYT2(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootYT2(
	'html, iframe html {background: rgba(33, 20, 20, 1) !important;}'
	+
	'img {opacity: .88 !important;}'
	+
	'ytd-masthead, #masthead, ytd-app {background: #2a1f1f !important;}'
	+
	'form #container {background: #594040 !important;}'
	+
	'#text {color: #c62323 !important;}'
	+
	'#guide-icon, *[yt-icons:menu], yt-icon {color: #e6d0d0 !important;}'
	+
	'ytd-searchbox[mode="legacy"] #container.ytd-searchbox {box-shadow: inset 0 1px 2px rgb(53, 32, 32) !important; border: 1px solid #6e1717;}'
	+
	'ytd-searchbox[mode="legacy"][has-focus] #container.ytd-searchbox {border: 1px solid #95271a !important;}'
	+
	'ytd-searchbox[mode="legacy"] #container.ytd-searchbox {box-shadow: inset 0 1px 2px rgb(53, 32, 32) !important;}'
	+
	'#contents.ytd-section-list-renderer > .ytd-section-list-renderer:not(:last-child) {border-bottom: 1px solid #541616 !important;}'
	+
	'.sbsb_a {background: #683030 !important;}'
	+
	'.gsfs {font-size: 1.4rem !important; color: #ecd7d7 !important;}'
	+
	'.sbsb_c {padding: 1px 24px 0px 10px !important;}'
	+
	'iframe.sbdd_c {height: 50px !important;}'
	+
	'.sbsb_d {background: #555 !important;}'
	+
	'.sbdd_b {border: 1px solid #8d1515 !important;}'
	+
	'#sections {background: #2c1414 !important;}'
	+
	'#sections.ytd-guide-renderer > .ytd-guide-renderer:not(:last-child), .yt-sharing-renderer {border-bottom: 1px solid #531717 !important;}'
	+
	'#guide-spacer.ytd-app {margin-top: var(--ytd-masthead-height, 55px);}'
	+
	'a.yt-simple-endpoint.yt-formatted-string, #share-label.yt-sharing-renderer, .paper-input-container input, #author-text.yt-simple-endpoint.ytd-comment-renderer, .ytd-video-meta-block {color: #a82222 !important;}'
	+
	'ytd-searchbox[mode="legacy"] #container.ytd-searchbox input.ytd-searchbox {color: #ffe2e2 !important;}'
	+
	'#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {background-color: #4a0c0c !important;}'
	+
	'.title.ytd-guide-entry-renderer, #title.ytd-shelf-renderer, #toggle.ytd-grid-renderer {color: #ecd4d4 !important;}'
	+
	'ytd-guide-entry-renderer {min-height: 28px !important; max-height: 28px !important;}'
	+
	'#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer {min-height: 28px; max-height: 28px !important;}'
	+
	'#video-title.yt-simple-endpoint.ytd-grid-video-renderer, #video-title.ytd-video-renderer {color: #c61818 !important;}'
	+
	'#metadata-line.ytd-grid-video-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, yt-icon, .ytd-video-secondary-info-renderer, .description.ytd-video-secondary-info-renderer yt-formatted-string.ytd-video-secondary-info-renderer, ytd-toggle-button-renderer #button.ytd-toggle-button-renderer, .ytd-comments-header-renderer, .yt-dropdown-menu, .ytd-comment-renderer, ytd-button-renderer, .ytd-compact-video-renderer, .ytd-menu-renderer[button-renderer] + .ytd-menu-renderer[button-renderer], .ytd-menu-renderer[button-renderer] + template.ytd-menu-renderer + #button.ytd-menu-renderer, #top-level-buttons.ytd-menu-renderer:not(:empty) + #button.ytd-menu-renderer, button.ytd-masthead[is="paper-icon-button-light"], ytd-topbar-menu-button-renderer #button.ytd-topbar-menu-button-renderer, #button.ytd-notification-topbar-button-renderer {color: #ddc5c5 !important;}'
	+
	'#toggle.ytd-grid-renderer {margin-bottom: 4px !important;}'
	+
	'ytd-searchbox[mode="legacy"] #search-icon-legacy.ytd-searchbox {border-color: #8d1c1c !important; background-color: #aa1c1c !important;}'
	+
	'ytd-searchbox[mode="legacy"] #search-icon-legacy.ytd-searchbox:hover {background-color: #7e1c1c; !important;}'
	+
	'ytd-browse[persistent-guide] ytd-two-column-browse-results-renderer.ytd-browse {background: #211818 !important; padding: 0 2rem !important;}'
	+
	'yt-icon.ytd-badge-supported-renderer {color: #655d5c !important;}'
	+
	'yt-icon.ytd-badge-supported-renderer:hover {color: #4081d5 !important;}'
	+
	'yt-img-shadow.ytd-guide-entry-renderer, #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer, #avatar.ytd-video-owner-renderer, #avatar.ytd-c4-tabbed-header-renderer {border-radius: 0px !important; opacity: .88 !important;}'
	+
	'ytd-watch {background: #201212 !important;}'
	+
	'.title.ytd-video-primary-info-renderer {font-size: 2rem !important; color: #b12323 !important;}'
	+
	'#upnext.ytd-compact-autoplay-renderer, #channel-title.ytd-c4-tabbed-header-renderer, #subscriber-count.ytd-c4-tabbed-header-renderer {color: #d8baba !important;}'
	+
	'span.yt-view-count-renderer, #video-title.ytd-newspaper-hero-video-renderer, .tab-content.paper-tab, #title, .title {color: #e3caca !important;}'
	+
	'ytd-video-primary-info-renderer, ytd-video-secondary-info-renderer, #placeholder-area.ytd-comment-simplebox-renderer, ytd-compact-autoplay-renderer {border-bottom: 1px solid #561515 !important;}'
	+
	'#like-bar.ytd-sentiment-bar-renderer {background: hsl(6.3, 77.4%, 24.3%) !important;}'
	+
	'yt-sharing-renderer {background: #3b1313 !important;}'
	+
	'.ytd-video-meta-block {color: #555 !important;}'
	+
	'#byline.ytd-video-meta-block, h3, h4, h5, h6 {color: #b32323 !important;}'
	+
	'#expander.ytd-comment-replies-renderer {color: #555 !important;}'
	+
	'.toggle-button.paper-toggle-button {background-color: #7b0c0c !important;}'
	+
	'app-drawer {width: 256px !important;}'
	+
	'#guide-content.ytd-app {background: #2C1414 !important;}'
	+
	'#footer.ytd-guide-renderer #guide-links-primary, #contents.ytd-browse-secondary-contents-renderer > .ytd-browse-secondary-contents-renderer:not(:first-child) {border-top: 1px solid #7a0e0e !important;}'
	+
	'.arrow.yt-horizontal-list-renderer {background-color: #a71b1b !important;}'
	+
	'paper-menu, ytd-popup-container, ytd-add-to-playlist-renderer {background: #500f0f !important; color: #ead6d6 !important;}'
	+
	'.ytd-menu-service-item-renderer, #label, .ytd-add-to-playlist-renderer, .index-message.ytd-playlist-panel-renderer, #byline.ytd-playlist-panel-video-renderer, .index-message {color: #ead6d6 !important;}'
	+
	'#header.ytd-add-to-playlist-renderer, #playlists.ytd-add-to-playlist-renderer {border-bottom: 1px solid #7e0707 !important;}'
	+
	'.toggle-bar.paper-toggle-button {background-color: #713f3f !important;}'
	+
	'.ytd-badge-supported-renderer {background: #2d1111 !important; color: #efd7d7 !important;}'
	+
	'.badge.badge-style-type-simple.style-scope.ytd-badge-supported-renderer {border: 1px solid #891818 !important;}'
	+
	'#scrim.app-drawer {background: rgba(150, 46, 46, 0) !important;}'
	+
	'app-drawer[opened] > #contentContainer.app-drawer {box-shadow: 8px 8px 8px #2a1414b3 !important;}'
	+
	'app-drawer.ytd-app:not([persistent]) #header.ytd-app, .ytd-multi-page-menu-renderer:not(:last-child) {border-bottom: 1px solid #6e1212 !important;}'
	+
	'ytd-menu-service-item-renderer:hover {background-color: #7e1f1f !important;}'
	+
	'#channel-header.ytd-c4-tabbed-header-renderer, #tabs-inner-container.ytd-c4-tabbed-header-renderer {background-color: #4b1515 !important;}'
	+
	'ytd-browse[page-subtype="channels"] {background: #1b1010 !important;}'
	+
	'ytd-subscribe-button-renderer[button-style="COMPACT_GRAY"] paper-button.ytd-subscribe-button-renderer {background-color: hsl(0, 69.5%, 38.6%) !important; color: hsla(0, 0%, 6.7%, .6) !important; font-weight: bold !important;}'
	+
	'paper-button.ytd-subscribe-button-renderer[subscribed] {background: hsl(0, 66.8%, 40.2%) !important; color: hsla(0, 12.5%, 9.4%, 0.9) !important;}'
	+
	'*[aria-label="Unsubscribe from this channel."] {background-color: hsl(0, 66.7%, 28.2%) !important; color: hsla(0, 25.9%, 5.3%, 0.8) !important;}'
	+
	'#subtitle.ytd-shelf-renderer, #message {color: #806868 !important;}'
	+
	'.header.ytd-playlist-panel-renderer {background-color: #3e2424 !important;}'
	+
	'.playlist-items.ytd-playlist-panel-renderer {background-color: #272727 !important;}'
	+
	'.ytd-video-meta-block {color: #716969 !important;}'
	+
	'#simplebox-placeholder.ytd-comment-simplebox-renderer {color: #555 !important;}'
	+
	'#guide-icon, *[yt-icons:menu], yt-icon, #account-name, .ytd-active-account-header-renderer, #email, textarea {color: #e6d0d0 !important;}'
	+
	'.ytd-active-account-header-renderer {background: #592525 !important;}'
	+
	'ytd-account-settings {background-color: #2d1919 !important;}'
	+
	'paper-item:hover {background-color: #691d1d !important;}'
	+
	'paper-button.yt-next-continuation {background: #711919 !important; color: #e7cdcd !important;}'
	+
	'#author-text .style-scope {color: #a71414 !important; font-weight: 600 !important; padding-right: 0.2rem !important;}'
	+
	'#hearted-thumbnail.ytd-creator-heart-renderer {width: 24px !important; height: 24px !important; margin: 5px !important;}'
	+
	'#author-text .style-scope::after {content: "-" !important; padding-left: .5rem !important;}'
	+
	'#hearted-thumbnail.ytd-creator-heart-renderer {width: 28px !important; height: 28px !important; margin: 3px !important;}'
	+
	'#hearted-border.ytd-creator-heart-renderer {right: -3px !important; bottom: -1px !important; width: 20px !important; height: 19px !important;}'
	+
	'#hearted.ytd-creator-heart-renderer {right: -3px !important; bottom: 0px !important; width: 20px !important; height: 18px !important;}'
	+
	'.unfocused-line.paper-input-container {background: #571616 !important;}'
	+
	'ytd-button-renderer.style-primary[is-paper-button] {background-color: hsl(2.2, 67.2%, 23.9%) !important;}'
	+
	'#account-name, #email, .description, h2, #result-count.ytd-search-sub-menu-renderer {color: #e6d0d0 !important;}'
	+
	'ytd-simple-menu-header-renderer {background-color: #571010 !important;}'
	+
	'#edit-buttons.ytd-c4-tabbed-header-renderer ytd-button-renderer.ytd-c4-tabbed-header-renderer {background-color: #aa1717 !important;}'
	+
	'ytd-toggle-button-renderer.style-compact-gray[is-paper-button] {background-color: hsl(0, 67%, 22.5%) !important;}'
	+
	'#contentContainer.app-header, #background.app-header {left: 16px !important;}'
	+
	'#primary-links.ytd-c4-tabbed-header-renderer, #secondary-links.ytd-c4-tabbed-header-renderer {background-color: hsla(0, 69.6%, 18%, 0.6) !important;}'
	+
	'#items.ytd-vertical-channel-section-renderer > .ytd-vertical-channel-section-renderer:not(:first-child) {padding-top: 8px !important;}'
	+
	'.sbsb_c.gsfs:hover {background: #541313 !important;}'
	+
	'#player-ads {display: none !important;}'
	+
	'.title.ytd-video-primary-info-renderer {font-size: 2.3rem !important;}'
	+
	'yt-view-count-renderer {font-size: 1.8rem !important;}'
	+
	'tp-paid-content-overlay, ideo-ads {display: none !important;}'
	+
	'.ytp-chrome-bottom {opacity: .92;}'
	+
	'.ytp-progress-bar {opacity: .7;}'
	+
	'.ytp-videowall-still.ytp-suggestion-set {filter: brightness(0.85);}'
	+
	'.standalone-collection-badge-renderer-icon {background-color: #5c0b0b !important;}'
	+
	'paper-button.ytd-subscribe-button-renderer {background-color: #830b0b !important;}'
	+
	'.style-scope.ytd-playlist-panel-renderer:hover {background: #1e1c1c !important;}'
	+
	'.html5-compatibility-table li {background: #5a1313 !important; box-shadow: 0 1px 1px #3c1717 !important;}'
	+
	'#name.ytd-author-comment-badge-renderer {color: #dd2525 !important;}'
	+
	'ytd-search-sub-menu-renderer {border-bottom: 1px solid #6e1a1a !important;}'
	+
	'.ytd-search-sub-menu-renderer {color: color: #EDD !important;}'
	+
	'.ytd-comment-renderer.creator {background: #512626 !important;}'
);
// ==UserScript==
// @name Dark theme for Youtube Hitchhiker
// @namespace Me
// @version 1.0.0
// @description Designed for Rehike
// @author Legosavant
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/475634/Dark%20theme%20for%20Youtube%20Hitchhiker.user.js
// @updateURL https://update.greasyfork.org/scripts/475634/Dark%20theme%20for%20Youtube%20Hitchhiker.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    --dark:rgba(33, 33, 33, 0.98);
    --darker:#0f0f0f;
    --bordercolor:rgba(255, 255, 255, 0.1);
    --bordercolorhov:rgba(255,255,255,.2);
    --bordercoloract:rgba(255,255,255,.3);
    --popupbg:#282828;
    --deemphtxt:#aaa;
    --midemphtxt:#ddd;
    --emphtxt:#fff;
    --brue:#3ea6ff;
    
    
    --sboxbg: hsl(0, 0%, 7%);
    --sboxborder:hsl(0, 0%, 18.82%);
    --sboxbutton:hsla(0, 0%, 100%, 0.08);
    --sboxbuttonhov:hsla(0,0%,100%,.1);
    --sboxbuttonact:hsla(0,0%,100%,.12);
}
/*global*/

#yt-masthead-container, #masthead-appbar {
    background-color:var(--dark);
    border-color:var(--bordercolor)
}
body {
    background-color:var(--darker);
    color:var(--emphtxt)
}
.yt-card {
    background-color:var(--dark)
}
#masthead-search-terms, #masthead-search-terms:hover {
    border-color:var(--sboxborder);
    background-color:var(--sboxbg);
    box-shadow:inset 0 1px 2px #111
}
#masthead-search-terms.gsfe_b {
    border-color: #1c62b9
}
#masthead-search-terms input {
    color:var(--emphtxt)
}
#masthead-search .search-btn-component {
    background-color:var(--sboxbutton);
    border-color:var(--sboxborder);
}
.yt-uix-button-default, .yt-uix-button-default[disabled], .yt-uix-button-default[disabled]:hover, .yt-uix-button-default[disabled]:active, .yt-uix-button-default[disabled]:focus, .yt-uix-button-subscribed-branded, .yt-uix-button-subscribed-branded[disabled] {
    background-color:var(--sboxbutton);
    border-color:var(--bordercolor);
    color:var(--emphtxt)
}
.yt-uix-button-default:hover, .yt-uix-button-text:hover, .yt-uix-button-subscribed-branded:hover {
    background-color:var(--sboxbuttonhov);
    border-color:var(--bordercolorhov);
}
.yt-uix-button-default:active, .yt-uix-button-text:active, .yt-uix-button-subscribed-branded:active {
    background-color:var(--sboxbuttonact);
    border-color:var(--bordercoloract);
}
.yt-uix-button-default.yt-uix-button-toggled {
    background-color:var(--sboxbuttonhov);
    border-color:var(--bordercolorhov);
    box-shadow:inset 0 1px 0 #222
}
.yt-uix-button-default.yt-uix-button-toggled:hover {
    background-color:var(--sboxbuttonact);
    border-color:var(--bordercoloract);
    box-shadow:none
}
.yt-uix-button-arrow {
    border-top-color:var(--midemphtxt)
}
.yt-uix-button-icon-bell, #yt-masthead .search-btn-component .yt-uix-button-content, .yt-uix-button-icon-appbar-guide {
    filter:invert(1)
}
#guide-container {
    background-color:var(--dark);
}
.guide-pinned .guide-pinning-enabled #appbar-guide-menu {
    border-right-color:var(--bordercolor);
    background:var(--dark)
}
.guide-item {
    color:var(--emphtxt)
}
.yt-scrollbar ::-webkit-scrollbar-track {
    background:var(--dark)
}
.yt-scrollbar ::-webkit-scrollbar-thumb {
    background:#444
}
.yt-scrollbar ::-webkit-scrollbar-thumb:hover {
    background:#666
}
.guide-section-separator {
    border-color:var(--bordercolor)
}
.yt-lockup-title a, .yt-lockup:hover a, .yt-lockup:hover .yt-lockup-meta a, .yt-lockup:hover .yt-lockup-description a {
    color:var(--brue)
}
.yt-badge {
    border-color:var(--bordercolor);
    color:var(--deemphtxt)
}
.branded-page-module-title, .branded-page-module-title a {
    color:var(--deemphtxt)
}

.yt-lockup .video-actions {
    background:#444;
}
.yt-lockup .addto-button:before, .autoplay-bar .autoplay-info-icon {
    filter:invert(1)
}
.yt-uix-checkbox-on-off label {
    background-color:var(--deemphtxt)
}
.yt-thumb {
    background:var(--darker)
}
.gssb_e[style*="display: none;"] {
    border-color:transparent
}
.gssb_e {
    border-color:var(--bordercolor)
}
.gssb_m {
    border-color:var(--bordercolor);
    background:var(--darker);
    color:var(--emphtxt)
}
.gssb_i td {
    background:var(--dark)
}
/*watch*/
#watch7-sidebar .video-list-item a .title, #watch7-sidebar .video-list-item a .title .yt-deemphasized-text {
    color:var(--emphtxt)
}
#watch7-sidebar .video-list-item a:visited .title, #watch7-sidebar .video-list-item a:visited .title .yt-deemphasized-text, .yt-uix-button-text, .yt-uix-button-text[disabled] {
    color:var(--midemphtxt)
}
#watch7-sidebar .video-list-item:hover a:visited .title, #watch7-sidebar .video-list-item:hover a:visited .title .yt-deemphasized-text, #watch7-sidebar .video-list-item:hover a .title, #watch7-sidebar .video-list-item:hover a .title .yt-deemphasized-text {
    color:var(--brue)
}
#watch7-sidebar .watch-sidebar-separation-line, #watch8-action-buttons, .comment-simplebox-renderer-collapsed-content, .comment-simplebox-renderer, .yt-card .yt-uix-tabs, .comment-simplebox-frame {
    border-color:var(--bordercolor)
}
.comment-simplebox-arrow .arrow-inner {
    border-color:var(--dark) var(--dark) transparent transparent
}
.comment-simplebox, .comment-simplebox-text, .comment-simplebox-prompt {
    background-color:var(--dark);
    color:var(--emphtxt)
}
.comment-simplebox-arrow .arrow-outer {
    border-color:var(--bordercolor) var(--bordercolor) transparent transparent
}
.comment-replies-renderer-expander-down:after {
    filter:invert(1)
}
.yt-card .yt-uix-button-expander {
    border-color:var(--bordercolor) transparent transparent transparent;
    color:var(--deemphtxt)
}
#watch-header .yt-user-info a, #watch-description, #action-panel-details a {
    color:var(--midemphtxt)
}
.yt-subscription-button-subscriber-count-branded-horizontal, .yt-subscription-button-subscriber-count-unbranded-horizontal {
    background-color:var(--popupbg);
    border-color:var(--bordercolor)
}
.watch-view-count, .yt-subscription-button-subscriber-count-branded-horizontal, .yt-subscription-button-subscriber-count-unbranded-horizontal {
    color:var(--deemphtxt)
}
.yt-uix-button-subscribed-branded+.yt-uix-subscription-preferences-button {
    border-left-color:transparent;
}
.yt-uix-button-subscribed-branded+.yt-uix-subscription-preferences-button:before {
    filter:invert(1)
}
.yt-uix-button.yt-uix-button-subscribed-branded {
    border-right-color:transparent
}
.load-more-button,.load-more-button:hover, .standalone-collection-badge-renderer-text a {
    background:none;
}

.yt-card .yt-uix-button-expander:hover {
    color:var(--emphtxt)
}
.comment-renderer-reply {
    color:var(--deemphtxt)
}
.comment-renderer-reply:hover {
    color:var(--midemphtxt)
}
.standalone-collection-badge-renderer-text a {
    color:var(--brue);
}
/*filter hax*/
#watch8-action-buttons .yt-uix-button, #action-panel-dismiss, #action-panel-dismiss:hover, .comment-action-buttons-renderer-thumb {
    filter:invert(1)
}
#watch8-action-buttons .yt-uix-button:focus {
    box-shadow:0 0 0 2px rgba(220,120,24,.4)
}
#watch8-action-buttons .like-button-renderer-like-button-clicked.yt-uix-button, #watch8-action-buttons .like-button-renderer-like-button:active, #comment-section-renderer .sprite-like[aria-checked="true"] {
    filter:invert(0)
}
#watch8-action-buttons .like-button-renderer-like-button-clicked.yt-uix-button:focus,#watch8-action-buttons .like-button-renderer-like-button:active:focus {
    box-shadow:0 0 0 2px rgba(27,127,204,0.4)
}
/*search*/
.yt-ui-ellipsis {
    background:var(--dark)
}
#results .section-list li .item-section .branded-page-box, .search-header {
    border-color:var(--bordercolor)
}
.filter {
    color:var(--deemphtxt)
}
.filter-col-title, .search-header .num-results, .search-header .num-results strong, .search-header .yt-uix-button-content {
    color:var(--midemphtxt)
}
/*playlist*/
#pl-header .pl-header-title {
    color:var(--emphtxt)
}
.pl-video-title-link {
    color:var(--midemphtxt)
}
.play-all-icon-btn:before {
    filter:invert(1)
}
/*channel*/
#c4-header-bg-container {
    border-color:var(--bordercolor)
}
.about-metadata-container {
    color:var(--midemphtxt)
}
.yt-uix-button-icon-channel-back {
    filter:invert(1)
}
.branded-page-related-channels h3 a, .branded-page-related-channels h3 {
    color:var(--midemphtxt)
}
#browse-items-primary .item-section>li>.yt-lockup-tile, .branded-page-v2-primary-col .branded-page-box, .section-list li .item-section .branded-page-box {
    border-color:var(--bordercolor)
}
.compact-shelf .yt-uix-button-shelf-slider-pager {
    background:var(--dark)
}
.browse-list-item-container:hover .compact-shelf .yt-uix-button-shelf-slider-pager, .compact-shelf:hover .yt-uix-button-shelf-slider-pager {
    border-color:var(--bordercolor);
}
.compact-shelf .yt-uix-shelfslider-next-arrow, .rtl .compact-shelf .yt-uix-shelfslider-prev-arrow {
    filter:invert(1)
}
a.yt-uix-button.yt-uix-button-epic-nav-item, button.yt-uix-button-epic-nav-item, .epic-nav-item {
    color:var(--deemphtxt)
}
a.yt-uix-button-epic-nav-item.selected, a.yt-uix-button-epic-nav-item.yt-uix-button-toggled, button.yt-uix-button-epic-nav-item.selected, button.yt-uix-button-epic-nav-item.yt-uix-button-toggled, .epic-nav-item.selected, .epic-nav-item.yt-uix-button-toggled, .epic-nav-item-heading, .channel-header .branded-page-header-title .branded-page-header-title-link {
    color:var(--emphtxt)
}
.branded-page-v2-subnav-container {
    border-color:var(--bordercolor)
}
/*feet*/
body #footer-container {
    background-color:var(--dark);
    border-color:var(--bordercolor);
}
#footer-main {
    border-color:var(--bordercolor);
}
#footer-links-primary a {
    color:var(--midemphtxt)
}
#footer .yt-uix-button-icon-footer-history, #footer .yt-uix-button-icon-questionmark {
    filter:invert(1)
}
#footer-links-primary a:hover {
    color:var(--brue)
}
/*popup*/
.yt-ui-menu-content, .yt-uix-clickcard-card-border, .yt-uix-hovercard-card-border {
    background-color:var(--popupbg);
    border-color:var(--bordercolor)
}

.yt-ui-menu-item {
    color:var(--midemphtxt)
}
.yt-ui-menu-item.has-icon:before, .yt-ui-menu-item-label:before {
    filter:invert(1)
}
.yt-ui-menu-item:focus, .yt-ui-menu-item:hover {
    background:var(--bordercolor)
}
        /*add to*/
#yt-uix-videoactionmenu-menu h3, .add-to-widget .addto-playlist-item {
    color:var(--midemphtxt)
}
.add-to-widget .addto-playlist-item:hover, .add-to-widget .create-playlist-item:hover, .add-to-widget .addto-playlist-item.yt-uix-kbd-nav-highlight {
    background-color:var(--bordercolor)
}
.yt-uix-form-input-select, .yt-uix-form-input-text, .yt-uix-form-input-textarea {
    background-color:var(--sboxbg);
    color:var(--emphtxt)
}
.yt-uix-form-input-select:not(:focus), .yt-uix-form-input-text:not(:focus), .yt-uix-form-input-textarea:not(:focus) {
    border-color:var(--sboxborder);
}
.add-to-widget .addto-search-playlist-section .search-icon {
    filter:invert(1)
}
        /*notifs n chan*/
#yt-masthead-notifications-title {
    color:var(--deemphtxt)
}
.yt-uix-clickcard-card-reverse .yt-uix-card-body-arrow-vertical, .yt-uix-hovercard-card-reverse .yt-uix-card-body-arrow-vertical {
    border-bottom-color:var(--dark)
}
#yt-masthead-notifications-content {
    background-color:var(--popupbg)
}
#yt-masthead-notifications-content .item-section>li>.yt-lockup-tile, #yt-masthead-notifications-content .yt-ui-ellipsis {
    background:inherit;
    color:var(--midemphtxt)
}
#yt-masthead-notifications-content .item-section>li>.yt-lockup-tile:hover, #yt-masthead-notifications-content .yt-lockup-tile:hover .yt-ui-ellipsis, .yt-masthead-account-picker-option, .yt-masthead-account-picker-option:hover {
    background-color:var(--dark)
}
.yt-masthead-account-picker-option .yt-masthead-picker-name, .yt-masthead-account-picker.yt-uix-clickcard-card-content {
    color:var(--emphtxt)
}
.yt-masthead-picker-footer {
    background-color:var(--darker)
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

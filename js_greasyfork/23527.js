//
// Written by Glenn Wiking
// Script Version: 1.0.3a
// Date of issue: 26/09/16
// Date of resolution: 27/09/16
//
// ==UserScript==
// @name        ShadeRoot Minds
// @namespace   SRMI
// @version     1.0.3a
// @grant       none
// @icon        http://i.imgur.com/rtFIRg9.png
// @description	Eye-friendly magic in your browser for Minds

// @include     http://*.minds.com/*
// @include     https://*.minds.com/*

// @downloadURL https://update.greasyfork.org/scripts/23527/ShadeRoot%20Minds.user.js
// @updateURL https://update.greasyfork.org/scripts/23527/ShadeRoot%20Minds.meta.js
// ==/UserScript==

function ShadeRootMinds(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootMinds(
	'html {color: #E3E3E3 !important;}'
	+
	'a img, .m-thumb-image, .minds-video-thumbnail, .minds-blog-thumbnail, .thumbnail, .minds-banner img, .minds-avatar img, .m-messenger-conversation-messages-message img, .overlay i, .post-preview {opacity: .85;}'
	+ // LINK COLOR 1
	'a {color: #679FD5 !important;}'
	+
	'*::-moz-selection {background: rgba(54, 97, 150, 0.9) !important;}'
	+
	'minds-app {background: #15191B !important;}'
	+
	'.mdl-color--grey-100 {background-color: rgb(28, 35, 30) !important;}'
	+ // COLOR 2
	'.minds-app minds-topbar, .minds-header-row, .mdl-menu__outline, .mce-tabs, minds-app, .minds-editable-container textarea {background-color: rgb(28, 35, 30);}'
	+ // COLOR 1
	'.mdl-textfield input, .minds-search-bar, .m-title-block, .m-title-block-fixed, .m-bubble-popup {background-color: #37474F !important;}'
	+
	'.m-search-bar-suggestions-list, .minds-dropdown-menu, .mdl-menu, .m-merchant-legal, .mce-textbox {background: #37474F !important; border: 1px solid #26343B !important;}'
	+
	'.m-search-bar-suggestions-suggestion, .mdl-menu__item, .m-messenger-dockpane-tab, .m-album, .mce-tabs {border-bottom: 1px solid #26343B !important; color: #BBC5CA !important;}'
	+ //ITEM HOVER
	'.m-search-bar-suggestions-suggestion:hover, .mdl-menu__item:hover, .minds-card-navigation li :hover, .minds-settings-nav li :hover, .minds-settings-item:hover, .mce-container-body .mce-menu-item {background-color: rgb(36, 48, 54) !important;}'
	+ //TEXT COLOR 1 / LINK COLOR 2
	'.m-isomorphic-link, .mdl-card__title, .mdl-card__supporting-text, #message, #message a, #message span a, .m-comment-message, .m-content-sidebar-nav-item a, .mdl-tabs__tab-bar a span, .mdl-tabs__tab, .mdl-card__title, textarea, .m-discovery-suggested-actions .minds-subscribe-button {color: #BCCDD5 !important;}'
	+
	'.mdl-tabs__action-buttons > * button {color: #BCCDD5; border: 1px solid #BCCDD5;}'
	+ // COLOR 1
	'.mdl-card, .m-owner-block {background: #37474F !important;}'
	+ // COLOR 3
	'.mdl-card:not(.mdl-cell), .tabs, .m-action-tabs, .minds-avatar-hovercard, .m-newsfeed-message {background: #28343B !important;}'
	+ // TEXT COLOR 2
	'.m-owner-block a, .mdl-menu__item, .mdl-card__title-text, .m-blurb, #search, .mdl-color-text--blue-grey-50, .mdl-color-text--blue-grey-300, .mdl-color-text--blue-grey-600 span, .wallet-grid .mdl-color-text--blue-grey-500, .wallet-grid label.mdl-color-text--blue-grey-600, .m-homepage-titles h1, .m-homepage-titles h3 {color: #BBC5CA !important;}'
	+ // TEXT COLOR 3
	'.m-owner-block span, .impressions-tag, strong, counter, .m-full-label, .minds-transaction-details p, .mdl-color-text--grey-600, .minds-blog-ownerblock .minds-body a, .minds-usercard-block .body h3, .mdl-cell minds-card-user .m-usercard-bio {color: #E3E3E3 !important;}'
	+ // TEXT COLOR 4
	'.m-footer-nav-item a, .mdl-color-text--blue-grey-500 span, .1, .2, .3, .m-emoji, .minds-messenger-conversation-message-bubble, .mdl-color-text--blue-grey-700 {color: #90A4AE !important;}'
	+
	'.impressions-tag {background-color: #607D8B !important; font-size: .8em !important;}'
	+
	'.minds-subscribe-button, button.material-icons {color: #5D7986 !important; border: 1px solid #5D7986 !important;}'
	+
	'.m-messenger-dockpane-container {background: #37474F !important;}'
	+
	'.m-messenger-userlist-search, .m-messenger-userlist-search > input, .m-upload input, .mdl-cell input, select, .m-messenger-bar input, .mce-combobox input, .mce-abs-layout input {background: rgb(40, 52, 59) !important; color: #BBC5CA !important;}'
	+
	'.m-messenger-userlist-search > input, .m-upload input, .mce-combobox input {padding: 0 .5em !important;}'
	+
	'.m-messenger-dockpane-tab-ribbon {background: #28343B !important; border-bottom: 1px solid #5D7986 !important;}'
	+
	'.m-comments-composer form textarea, form textarea, .m-messenger-conversation-composer textarea, minds-comments .m-comments-composer form textarea, minds-comments .minds-editable-container textarea {background: #455A64 !important; border: 1px solid #5F7C8A !important;}'
	+
	'.m-horizontal-content-carousel, .m-discovery-cities li, .m-bubble-popup .m-emoji-selector-title, .mce-window-head {border-bottom: 1px solid #5D7986 !important;}'
	+
	'.minds-avatar {background-color: #28343B !important;}'
	+ // TEXT COLOR 5
	'.material-icons, .m-overgrown-material-icon, .m-inline-owner-block span, .is-boosted a, .mce-content-body {color: #C9D6DD !important;}'
	+
	'.mdl-button, .m-input, .username {color: #CFCFCF;}'
	+
	'.m-album-create input, .mce-combobox input, .mce-tab {border-color: #5D7986 !important; color: #BCCDD5 !important;}'
	+
	'.body h3, .router-link-active .body span {text-shadow: 0 0 5px #555 !important;}'
	+ // BORDER COLOR 1
	'.minds-group-join-button, .mdl-cell input, select, minds-form-tags-input, minds-comments .m-rich-embed, .m-messenger-bar input, .minds-editable-container textarea, .m-channel-social-profile-input, .mce-textbox, .mce-preview-object {border: 1px solid #5D7986 !important;}'
	+ // BORDER COLOR 2
	'.m-group-info .m-group-info-name > div > span, .m-group-info .m-group-info-brief-description > div > span, .m-group-info .m-group-info-tags > div > span, .m-group-info .m-group-info-membership > div > span, .mdl-tabs__tab-bar, .m-input, .m-upload input {border-color: #38525F !important;}'
	+ // TEXT COLOR 6 / LABEL COLOR
	'.mdl-textfield__label {color: #718792 !important;}'
	+
	'.mdl-button--accent.mdl-button--accent.mdl-button--raised, .mdl-button--accent.mdl-button--accent.mdl-button--fab {background: #4690D6 !important;}'
	+
	'.progressbar, .minds-messenger-conversation-message-bubble, .odd .minds-messenger-conversation-message-bubble, .bar1, .bar2, .bar3, minds-capture .progressbar {background: #0076B7 !important;}'
	+
	'.mdl-tabs__tab.is-active, .mdl-tabs__tab.is-active {border-bottom: 2px solid #0076B7;}'
	+
	'.mdl-button--colored {background: rgba(158, 158, 158, 0.2) !important;}'
	+
	'.m-albums-selector .mdl-card__title .mdl-button {padding: 0 6px !important;}'
	+
	'.body p {color: #90A4AE !important;}'
	+
	'.m-infinite-scroll-manual {color: #253238 !important;}'
	+
	'infinite-scroll .mdl-color--blue-grey-200 {background: #0076B7 !important;}'
	+
	'.minds-transaction-points .positive, .minds-wallet-points h2 {color: #2691EC !important;}'
	+
	'.minds-transaction-points .negative {color: #EC4226 !important;}'
	+
	'.minds-boost-points-input input {font-size: 18px !important; padding: 14px !important;}'
	+
	'.minds-card-navigation li :hover {background-color: #1D2529 !important;}'
	+
	'.m-content-sidebar-nav-item .is-active {border-left: 3px solid #0076B7 !important;}'
	+
	'.m-boost-button-fat, .mdl-card__actions .mdl-button--colored {background-color: #0076B7 !important; color: #C9D6DD !important; padding: 0 14px !important;}'
	+
	'.m-discovery-suggested-actions .minds-subscribe-button {background-color: #0076B7 !important; color: #C9D6DD !important;}'
	+
	'.wallet-grid form, .m-rich-embed {background: #37474F !important;}'
	+
	'.username {color: #CFCFCF !important;}'
	+
	'.mdl-color--white {background-color: #37474F !important;}'
	+
	'.overlay {background-color: rgba(0, 0, 0, 0.2) !important;}'
	+
	'.mce-edit-area, .mce-container, .mce-panel, .mce-stack-layout-item {background-color: #37474F !important;}'
	+
	'.mce-panel, .mce-btn {background-color: #506974 !important;}'
	+
	'.mce-btn-group:not(:first-child) {border-left: 1px solid #678D99 !important;}'
	+
	'.mce-content-body {background-color: #28343B !important;}'
	+
	'.minds-blog-body p {color: #99C7E3 !important;}'
	+
	'.minds-blog-ownerblock .minds-body a {font-size: 1.4em !important;}'
	+
	'minds-app minds-body {box-shadow: 0px -10px 6px 4px #161A21 inset !important;}'
	+
	'.m-channel-social-profiles, .mce-foot {border-top: 1px solid #5D7986 !important;}'
	+
	'.mdl-cell minds-card-user .avatar {background-color: #37474F !important;}'
	+
	'.m-discovery-suggested-actions .minds-subscribe-button:hover {background-color: #1C5884 !important;}'
	+
	'.mdl-shadow--4dp, .mdl-shadow--2dp {box-shadow: 0px 0px 8px 4px rgba(19, 21, 23, 0.40);}'
	+
	'.m-homepage-titles h1, .m-homepage-titles h3 {text-shadow: 0 0 4px rgba(176, 46, 25, 0.82) !important;}'
	+
	'.mdl-color-text--blue-grey-700 {color: #CFCFCF !important;}'
	+
	'.m-messenger-conversation-composer textarea {padding: 6px !important; min-height: 28px;}'
	+
	'.odd div {background: #182F39 !important; box-shadow: 0px 0px 12px 120px #151B23 inset !important;}'
	+
	'.m-messenger-dockpane-tab {background-color: #132A35 !important;}'
	+
	'.m-boost-rotator-tabs li.mdl-color--blue-grey-100 {background-color: #2E3A41 !important;}'
	+
	'.minds-banner-editing .overlay {background: #101B20 !important; color: #90A4AE !important;}'
	+
	'.m-messenger-userlist-conversations-item:hover {background-color: #1B272C !important;}'
	+
	'.m-emoji:hover {transform: scale(1.25) !important; opacity: .85 !important;}'
	+
	'.mdl-textfield input {padding: .2em .5em !important;}'
	+
	'.mdl-textfield__label {margin: 1px .35em !important;}'
	+
	'.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label, .mdl-textfield--floating-label.is-focused .mdl-textfield__label {left: -4px !important;}'
	+
	'.mce-btn.mce-active, .mce-btn.mce-active:hover, .mce-btn:hover, .mce-btn:focus, div[role="toolbar"] {border-color: #0076B7 !important;}'
	+
	'.mce-menu-item-normal.mce-active:hover .mce-text, .mce-menu-item-normal.mce-active:hover .mce-ico, .mce-menu-item-normal.mce-active .mce-text {color: #60A1C5 !important;}'
	+
	'.mce-menu-item .mce-ico, .mce-menu-item .mce-text {color: #E3E3E3 !important;}'
	+
	'.mce-container, .mce-container *, .mce-widget, .mce-widget *, .mce-reset {color: #C9D6DD !important;}'
	+
	'.mce-floatpanel .mce-label {text-shadow: 0px 1px 1px rgb(43, 58, 66) !important;}'
	+
	'.mce-widget .mce-btn, .mce-foot button {background-color: #374853 !important;}'
	+
	'.mce-i-checkbox {border: 1px solid #438BB9 !important; background-color: #485B68 !important;}'
	+
	'.mce-container-body, .mce-tabs, .mce-tabs + .mce-container-body {background: rgb(28, 35, 30) !important;}'
	+
	'.mce-tab {background: #2D3B48 !important; text-shadow: 0px 1px 1px rgb(43, 58, 66) !important;}'
	+
	'img[src="https://d3ae0shxev0cb7.cloudfront.net/thumbProxy?src=&c=2708"] {visibility: hidden;}'
	+
	'.minds-banner {background-color: #12171B !important;}'
	+
	'.minds-blog-descriptions .mce-panel .mce-toolbar .mce-container-body {background-color: #506974 !important;}'
	+
	'.mdl-card .is-focused label[for="email"] {display: none;}'
	+
	'.m-fb-login-button {background: #151C21 !important;}'
	+
	'.m-bar-wrapper {background: #18202A !important;}'
	+
	'.m-bar-wrapper::before {border-color: transparent transparent transparent #18202A !important;}'
	+
	'.minds-editable-container .mdl-button--raised, .m-ribbon {background: #1D2226 !important;}'
	+
	'.minds-list .item .mdl-color--blue-grey-50 {background: #1D2226 !important;}'
	+
	'.minds-boost-container > .mdl-cell:nth-of-type(1) {border-right: 1px solid #3C4C62 !important;}'
	+
	'a.selected i.material-icons {color: #447C9B !important;}'
	+
	'minds-topbar minds-search-bar .mdl-textfield input, minds-topbar minds-search-bar .mdl-textfield label {padding: 8px 8px 8px 32px !important;}'
	+
	'minds-topbar minds-search-bar .mdl-textfield label {margin: 0 auto !important;}'
	+
	'.m-has-thumbnail p {color: #DEF2FF !important;}'
	+
	'.minds-navigation div:hover {background: #03090B !important;}'
	+
	'minds-comments .m-comments-composer form minds-textarea, minds-comments .minds-editable-container textarea {background: #212B2D !important;}'
	+
	'minds-textarea {border: 1px solid #4A585C;}'
);
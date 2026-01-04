// ==UserScript==
// @name     Zalo Dark
// @name:vi  Zalo Dark (Nền Tối)
// @description   Dark Theme for Zalo, making your eyes feel comfortable when you work, especially at night.
// @description:vi Dark Theme cho Zalo, giúp bạn thoải mái hơn trong việc làm việc với zalo, đặc biệt là vào buổi tối.
// @include  https://*.zalo.me/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  0.0.6
// @namespace    f97
// @author       f97
// @homepageURL https://f97.xyz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441592/Zalo%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/441592/Zalo%20Dark.meta.js
// ==/UserScript==

GM_addStyle ( `
html:root {
	--white-700: rgba(51, 51, 51, 0.1);
	--white-600: rgba(51, 51, 51, 0.25);
	--white-500: rgba(51, 51, 51, 0.5);
	--white-400: rgba(51, 51, 51, 0.75);
	--white-300: #18191a;
	--white-base: #18191a;
	--neutral-700: #4f5051;
	--neutral-600: #747576;
	--neutral-500: #999a9a;
	--neutral-400: #bebfbf;
	--neutral-300: #e3e3e3;
	--neutral-200: #f6f6f6;
	--neutral-100: #ffffff;
	--neutral-base: #e3e3e3;
	--grey-700: #232525;
	--grey-600: #2a2b2c;
	--grey-500: #313233;
	--grey-400: #38393a;
	--grey-300: #3d3e3f;
	--grey-base: #3d3e3f;
	--dark-grey-700: var(--grey-700);
	--dark-grey-600: var(--grey-600);
	--dark-grey-500: var(--grey-500);
	--dark-grey-400: var(--grey-400);
	--dark-grey-300: var(--grey-300);
	--dark-grey-base: var(--grey-base);
	--black-700: rgba(0, 0, 0, 0.1);
	--black-600: rgba(0, 0, 0, 0.25);
	--black-500: rgba(0, 0, 0, 0.5);
	--black-400: rgba(0, 0, 0, 0.75);
	--black-300: #fff;
	--black-base: #fff;
	--blue-700: #0f2345;
	--blue-650: #0e2d5b;
	--blue-600: #0b3a7e;
	--blue-500: #074bad;
	--blue-400: #035bdc;
	--blue-300: #3989ff;
	--blue-base: #3989ff;
	--dark-blue-200: #004bb9;
	--dark-blue-base: #004bb9;
	--red-700: #431418;
	--red-600: #58181c;
	--red-500: #791a1f;
	--red-400: #a61d24;
	--red-300: #d32029;
	--red-base: #d32029;
	--orange-700: #432716;
	--orange-600: #58351c;
	--orange-500: #794620;
	--orange-400: #a65c26;
	--orange-300: #d3722b;
	--orange-base: #d3722b;
	--green-700: #1d3712;
	--green-600: #274916;
	--green-500: #306317;
	--green-400: #3c8618;
	--green-300: #49aa19;
	--green-base: #49aa19;
	--yellow-700: #443b11;
	--yellow-600: #595014;
	--yellow-500: #7c6e14;
	--yellow-400: #aa9514;
	--yellow-300: #d8bd14;
	--yellow-200: #e8d639;
	--yellow-100: #e8d639;
	--yellow-base: #d8bd14;
	--purple-700: #24163a;
	--purple-600: #301c4d;
	--purple-500: #3e2069;
	--purple-400: #51258f;
	--purple-300: #642ab5;
	--purple-base: #642ab5;
	--pink-700: #40162f;
	--pink-600: #551c3b;
	--pink-500: #75204f;
	--pink-400: #a02669;
	--pink-300: #cb2b83;
	--pink-base: #cb2b83;
	--teal-700: #113536;
	--teal-600: #144848;
	--teal-500: #146262;
	--teal-400: #138585;
	--teal-300: #13a8a8;
	--teal-base: #13a8a8;
	--gradient-blue: linear-gradient(45deg, #408dfd, #0068ff);
	--gradient-sky-blue: linear-gradient(225deg, #00bac0, #72abff);
	--gradient-pink: linear-gradient(225deg, #ea87ff, #f2bdff);
	--gradient-orange: linear-gradient(225deg, #db342e 100%, #f5832f 0);
	--gradient-green: linear-gradient(225deg, #ffda39, #49bb82);
	--gradient-red-pink: linear-gradient(199deg, #eb8e8b, #f2bdff);
	--gradient-light-pink: linear-gradient(199deg, #ea87ff, #f2bdff);
	--gradient-purple-pink: linear-gradient(199deg, #b3a8e9, #f2bdff);
	--gradient-light-purple: linear-gradient(199deg, #7562d8, #b3a8e9);
	--gradient-purple-blue: linear-gradient(199deg, #7562d8, #0068ff);
	--gradient-light-blue: linear-gradient(199deg, #72abff, #0068ff);
	--gradient-teal-blue: linear-gradient(199deg, #00bac0, #0068ff);
	--gradient-teal-green: linear-gradient(199deg, #00bac0, #15a85f);
	--gradient-light-green: linear-gradient(199deg, #15a85f, #49bb82);
	--gradient-yellow-green: linear-gradient(199deg, #ffda39, #49bb82);
	--gradient-orange-yellow: linear-gradient(199deg, #f5832f, #ffd000);
	--gradient-red-orange: linear-gradient(199deg, #db342e, #f5832f);
	--shades-left-bar: var(--grey-700);
	--shades-left-bar-active: var(--grey-500);
	--shades-photo-bg: #545454;
	--box-input: rgba(0, 133, 255, 0.25);
	--box-input2: rgba(24, 144, 255, 0.2);
	--box-grey: rgba(0, 0, 0, 0.02);
	--box-notif: rgba(0, 26, 51, 0.1);
	--box-popover: rgba(0, 0, 0, 0.18);
	--transparent-blue08: rgba(0, 104, 255, 0.8);
	--border: var(--grey-300);
	--card-me-btn-bg: var(--blue-650);
	--card-me-btn-border: var(--blue-600);
	--message-view-gradient: linear-gradient(to top, #000, #121212);
	--brand-base: #0068ff;
}
html[data-dark-theme="dark_dimmed"]:root {
	--white-700: rgba(69, 69, 69, 0.1);
	--white-600: rgba(69, 69, 69, 0.25);
	--white-500: rgba(69, 69, 69, 0.5);
	--white-400: rgba(69, 69, 69, 0.75);
	--white-300: #232526;
	--white-base: #232526;
	--neutral-700: #58595a;
	--neutral-600: #7b7c7d;
	--neutral-500: #9e9f9f;
	--neutral-400: #c1c2c2;
	--neutral-300: #e5e5e5;
	--neutral-200: #f6f6f6;
	--neutral-100: #ffffff;
	--neutral-base: #e5e5e5;
	--grey-700: #2d3031;
	--grey-600: #343637;
	--grey-500: #3a3d3e;
	--grey-400: #424444;
	--grey-300: #464849;
	--grey-base: #464849;
	--message-view-gradient: linear-gradient(to top, #141414, #18191a);
}
html div::-webkit-scrollbar-thumb {
	background: var(--grey-300);
}
html ::selection {
	background: var(--brand-base);
}
html body {
	background: var(--white-300);
	-webkit-font-smoothing: auto;
}
html body #main-tab {
	border-right: 1px solid var(--border);
}
html body .chat-info-link__title {
	color: var(--neutral-base);
}
html body .chat-info-general__item:after {
	border-color: var(--border);
}
html body .chat-info-general__item--title--sub {
	color: var(--neutral-500);
}
html body .setting-menu,
  html body .setting-section {
	border-color: var(--border);
}
html body .app-info__header {
	align-items: center;
	color: #fff;
	background-color: var(--brand-base);
}
html body .app-info__section {
	padding: 16px;
}
html body .message-view__blur__overlay, html body .message-view__blur__overlay_noavatar {
	background: var(--message-view-gradient);
}
html body .media-tabs__main {
	border-bottom-color: var(--border);
}
html body .media-tabs__main.active {
	background-color: var(--white-300);
	border-color: transparent var(--border);
}
html body .emoji-tabs {
	background-color: var(--white-300);
}
html body .z--btn--fill--primary {
	color: var(--black-300);
	background: var(--gradient-blue);
}
html body .z--btn--fill--secondary-red.--disabled {
	color: var(--red-300);
	opacity: 0.5;
}
html body .z--btn--fill--danger {
	color: var(--black-300);
}
html body .reaction-emoji-list {
	color: var(--white-400);
	border: 0.5px solid var(--grey-400);
}
html body .leftbar-tab {
	color: var(--neutral-base);
}
html body .leftbar-tab:hover {
	background-color: var(--shades-left-bar-active);
}
html body .leftbar-unread {
	color: #fff !important;
}
html body .user-status-footer .footer-text {
	color: #fff;
}
html body .file-sidebar__option:hover {
	background-color: var(--grey-700);
}
html body .file-sidebar__option.chat-message.first-selected > .file-sidebar__option__title,
  html body .file-sidebar__option.chat-message.last-selected > .file-sidebar__option__title,
  html body .file-sidebar__option.selected > .file-sidebar__option__title {
	color: var(--neutral-300);
}
html body .file-sidebar__option.chat-message.first-selected .file-sidebar__option__icon,
  html body .file-sidebar__option.chat-message.last-selected .file-sidebar__option__icon,
  html body .file-sidebar__option.selected .file-sidebar__option__icon {
	color: var(--neutral-300);
}
html body .file-sidebar__option__icon.fa-file-icon-drive {
	color: #fff !important;
}
html body .file-sidebar__option__icon.fa-file-icon-dropbox {
	color: #fff !important;
}
html body .chat-onboard,
  html body .friend-center-main.subtract-title {
	height: 100vh;
}
html body .chips--choice.--active {
	color: #fff;
}
html body .chat-date {
	color: var(--neutral-300);
}
html body .chat-date > span {
	background: var(--white-500);
}
html body #contact-search-input {
	color: var(--neutral-base);
}
html body .phone-i-input {
	color: var(--neutral-base);
	background-color: var(--white-300);
}
html body .input {
	color: var(--neutral-base);
	background-color: var(--white-300);
}
html body .chat-input__content.highlight {
	border-color: var(--brand-base);
}
html body .chat-message .extra-btn {
	padding: 6px 16px;
	background-color: var(--white-300);
	color: var(--neutral-300);
	transition: all 250ms ease-in-out;
}
html body .chat-message .extra-btn:hover {
	color: #fff;
}
html body .chat-group-topic__item {
	min-height: 56px;
}
html body .chat-group-topic__item .icon-container {
	height: 56px;
}
html body .chat-group-topic-outer {
	min-height: 58px;
}
html body .group-board-page .virtualized-scroll {
	background: var(--white-base);
}
html body .cb-info-file-item__actions-container > div {
	background: transparent !important;
}
html body #info-links-container .library-media > div {
	background: transparent !important;
}
html body #group-creator .create-group__item__link-icon {
	color: #fff;
}
html body div[data-id="div_TabCT_FrdReqList"],
  html body div[data-id="div_TabCT_JoinedGrpList"] {
	background: var(--message-view-gradient) !important;
}
html body .chat-message.highlighted .card:not(.card--group-photo) {
	background-color: var(--blue-700);
}
html body .chat-message.highlighted .card:not(.card--group-photo):hover {
	background-color: var(--blue-650);
}
html body .sticker-selector__menu {
	height: 48px;
}
html body #stickerSelector {
	background-color: var(--white-300) !important;
}
html body .media-dock-tabs:not(.docked) {
	height: 48px;
	border-bottom: 0;
}
html body .gradient-border.left .fa-sendtome-image,
  html body .gradient-border.right .message-view__guide__item__sign .fa-sendtome-image {
	color: #fff;
}
html body .card-send-time {
	color: var(--neutral-500);
}
html body .card-send-time.me {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .chat-message {
	line-height: 1.5;
}
html body .file-message__container .file-progress-no {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .file-message__container .file-progress__track {
	background-color: var(--grey-600);
}
html body .card {
	border: 1px solid var(--grey-600);
}
html body .card.card--oa, html body .card.card--oa.admin, html body .card.card--picture, html body .card.card--picture.admin, html body .card.card--video, html body .card.card--video.admin, html body .card.card--sticker, html body .card.card--sticker.admin, html body .card.card--group-photo, html body .card.card--group-photo.admin {
	border: 0;
}
html body .card.admin {
	border: 1px solid var(--neutral-700);
}
html body .card.me {
	border-color: transparent;
}
html body .card.me .quote-name-container {
	color: var(--blue-300);
}
html body .card.me .quote-banner-content .quote-text {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .card.me .file-message__container .file-message__actions-icon {
	border-color: var(--card-me-btn-border);
	background-color: var(--card-me-btn-bg);
}
html body .card.me .file-message__container .file-progress__track {
	background-color: var(--blue-650);
}
html body .card.me.card--link .card-content > .card--link__sub {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .card.me.card--business .card-content div {
	color: #fff !important;
}
html body .card.me.card--business .msg-contact-footer {
	border-top: 1px solid var(--blue-600);
}
html body .card.me .msg-urgency-indicator {
	padding: 4px 8px;
	border-radius: 4px;
	border: 1px solid var(--red-300);
	color: var(--red-300);
}
html body .card.card--undo {
	opacity: 0.75;
	filter: blur(1px);
}
html body .card.card--undo > span {
	color: var(--neutral-300);
}
html body .message-reaction-container.me .reacts-list,
  html body .message-reaction-container.me .msg-reaction-icon {
	border-color: var(--card-me-btn-border);
	background-color: var(--card-me-btn-bg);
}
html body .message-reaction-container.me .msg-reaction-icon .default-react-icon-thumb {
	filter: brightness(2);
}
html body .tipv2-content {
	color: var(--neutral-300);
}
html body .tipv2 .tip-close-button {
	color: var(--neutral-300);
}
html body .qu-ba {
	background: var(--white-base);
}
html body .qrsc {
	background: var(--white-300);
}
html body .qri {
	background-color: var(--white-300);
}
html body .conv-action__unread .conv-unread {
	color: #fff !important;
}
html body .conv-item:hover {
	background-color: var(--grey-700);
}
html body .conv-item .conv-message.progress-bar .progress-track {
	background-color: var(--grey-400) !important;
}
html body .message-view__guide__item__sign {
	color: var(--neutral-300);
}
html body .msg-info-popup .quote-banner-content .quote-text {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .msg-info-popup .rl-msg .quote-banner {
	margin-bottom: 10px !important;
}
html body .msg-info-popup .rl-msg .msg-from-me .rl-username {
	color: var(--blue-base);
}
html body .msg-info-popup .rl-msg .msg-from-me .rl-msg-time {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .multi-select-mode-selected .card {
	border-color: var(--blue-base);
}
html body .multi-select-mode-selected .card.card--text.show-sender > .card-sender-name {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .multi-select-mode-selected .card-send-time {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .multi-select-mode-selected .quote-name-container .quote-name {
	color: var(--neutral-300);
}
html body .multi-select-mode-selected .quote-banner-content .quote-text {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .multi-select-mode-selected .message-reaction-container .reacts-list,
  html body .multi-select-mode-selected .message-reaction-container .msg-reaction-icon {
	border-color: var(--blue-500);
	background-color: var(--blue-600);
}
html body .multi-select-mode-selected .message-reaction-container .msg-reaction-icon .default-react-icon-thumb {
	filter: brightness(2);
}
html body .call-msg.--callee {
	background-color: var(--white-300);
}
html body .call-msg__separator {
	border-bottom: 1px solid var(--border);
}
html body .chat-message.me .call-msg {
	border-color: var(--blue-500);
}
html body .chat-message.me .call-msg__separator {
	border-bottom: 1px solid var(--blue-500);
}
html body .chat-message.me .call-msg__content__txt > span {
	color: var(--neutral-300);
	opacity: 0.5;
}
html body .pin-input__item {
	background: var(--white-300);
	color: var(--neutral-300);
}
html body .zl-avatar {
	--white-base: #fff;
	--neutral-500: #000;
}
html body .chat-date .line {
	border-top: 1px solid var(--grey-700);
}
html body .zavi-clock__date, html body .zavi-clock__time {
	color: var(--neutral-300);
}
html body .zavi-btn > .fa-icn-createmeeting {
	color: var(--neutral-300);
}
html body .btn-play {
	color: var(--neutral-300);
}
html body .conv-item.chat-message.first-selected,
  html body .conv-item.chat-message.last-selected,
  html body .conv-item.selected,
  html body .zavi-sidebar-list-item.chat-message.first-selected,
  html body .zavi-sidebar-list-item.chat-message.last-selected,
  html body .zavi-sidebar-list-item.selected
.contact-list-item.chat-message.first-selected,
  html body .contact-list-item.chat-message.last-selected,
  html body .contact-list-item.selected,
  html body .file-sidebar__option.chat-message.first-selected,
  html body .file-sidebar__option.chat-message.last-selected,
  html body .file-sidebar__option.selected {
	background: var(--grey-700);
}
html body .contact-list.web {
	top: 71px;
	height: calc(100% - 71px);
}
html body .image-show__title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 32px;
	color: var(--neutral-base);
}
html body .image-show__title > .fl-l {
	margin: 3px 10px 3px 0px !important;
}
html body .image-show__bottom__sender__info {
	color: var(--neutral-base);
}
html body .image-show__bottom__ctrl > .btn,
  html body .image-show__bottom__ctrl > a > .btn {
	color: var(--neutral-base);
}
html body .image-show__icon-fullscreen {
	color: var(--neutral-base);
}
html body .image-show .image-show__reaction .msg-reaction-icon {
	background: var(--neutral-base);
}
html body .image-show__thumb__legend {
	color: var(--neutral-base);
}
html body .timeline-slider__handle {
	background: var(--neutral-base);
}
html body .image-show__close > .fa-close,
  html body .image-show__close > .quote-base__close-icon {
	color: var(--neutral-base);
}
html body .image-show__thumb-container .btn-play {
	color: var(--neutral-base);
}
html body .image-show__caption {
	color: var(--neutral-base);
}
html body .friend-profile__addfriend__msg {
	background: transparent;
}
html body .overlay__video__duration {
	color: var(--neutral-300);
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
	font-weight: 500;
}
html body .overlay__video i {
	color: var(--neutral-base);
}
html body .toast {
	color: var(--neutral-300);
	background-color: var(--grey-700);
	border: 1px solid var(--grey-base);
	box-shadow: 4px 4px 12px var(--black-500);
	padding: 16px 24px;
}
html body .app-lock__main__input {
	display: flex;
	align-items: center;
}
html body .app-lock__main__input input {
	height: 40px;
	padding: 0px 16px;
	border-right: 0;
	color: var(--neutral-base);
}
html body .app-lock__main__input a {
	height: 40px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0px 16px;
	border: 1px solid var(--blue-300);
	background: var(--gradient-blue);
	color: var(--neutral-300);
}
html body .chat-input__img-preview__thumb__title {
	color: var(--neutral-300);
	background-color: var(--black-400);
}
html body #scroll-vertical > div {
	background-color: var(--neutral-500) !important;
	opacity: 0.5;
}
html body .file-icon__ext-text {
	color: #fff;
}
` );
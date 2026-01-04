// ==UserScript==
// @name         Stips Dark Theme
// @namespace    https://github.com/KeshetBehanan
// @version      0.2
// @description  A dark theme for Stips.
// @author       KeshetBehanan
// @match        https://stips.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370993/Stips%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/370993/Stips%20Dark%20Theme.meta.js
// ==/UserScript==

var s = document.createElement('style');
var t = document.createTextNode(`
html {
	background: #222 !important;
}
body{
	background: #222 !important;
	height: auto;
}
.section-title-lable, .messages-toolbar .user-nickname a, .cancel-button.mat-button {
	color: white !important;
}
.item-card .bottom, .page-item-card .bottom, .filter-sections, .add-item .mat-card-content {
	background: #444 !important;
}
.item-card, .title-wrapper, .items-box.theme-four-on-one .items-box-item.theme-small-circle-image:nth-of-type(n+2) .item-card .content-container, .message-bar, .post-content-form.modal mat-card-content {
	background: #4a4a4a !important;
}
.item-profile .name, .item-profile .name a, .filter-sections a, .messages-list .text, .message-input::placeholder, .time, .date-line .text {
	color: #aaa !important;
}
.info-icons, #app-component, .page-item-card .text-content, .item-card .content, .user-nickname, .action-list li .single-line, .messages-list .nickname, .notifications-list .notification, .notifications-list .notification .msg, .confirm-dialog .message, .title-wrapper .title {
	color: #ddd !important;
}
a:hover {
	color: #fff !important;
}
.items-box.theme-four-on-one .items-box-item.theme-small-circle-image:nth-of-type(n+2) .item-card .item-image {
	border-color: #444 !important;
}
.section-title .section-title-line {
	background-color: rgba(255,255,255,.08) !important;
}
.page-item-card .text-content {
	background: #222 !important;
}
.elastic-layer, .chat-messages-list, .notifications-list-wrapper, .thankswall {
	background: #555 !important;
}
.response-count-title {
	color: #999 !important;
}
textarea {
	background: transparent;
	color: #aaa;
}
.item-profile .time {
	color: #777 !important;
}
.filter-sections .mat-ink-bar {
	background: #aaa !important;
}
.messages-list, .emoji-select-button {
	background: transparent !important;
}

.chat-message-area .chat-message .msg-content {
	background: #444 !important;
	color: #fff;
}
.chat-message-area.user-msg .chat-message .msg-content {
	background: #596bd0 !important;
}
.notifications-list .notification .msg em {
	color: #85b7e1 !important;
}
.mat-dialog-container {
	background: #666 !important;
}
`);
s.appendChild(t);
document.head.appendChild(s);
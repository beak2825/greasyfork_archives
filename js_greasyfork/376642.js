// ==UserScript==
// @name         Twitch: Compact Chat
// @namespace    http://tampermonkey.net/
// @version      2020.18.08
// @description  Larger video in theater mode with smaller chat and emote zoom on hover
// @author       cmcooper123
// @match        https://www.twitch.tv/*
// @match        http://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376642/Twitch%3A%20Compact%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/376642/Twitch%3A%20Compact%20Chat.meta.js
// ==/UserScript==

(function() {
  'use strict';
	(document.head || document.documentElement).insertAdjacentHTML('beforeend',
		'<style>' +
			'.channel-root__right-column, .right-column--theatre.right-column--beside { width: 26rem!important; }' +
			'.persistent-player--theatre { width: calc(100% - 26rem)!important; }' +
			'.chat-line__message, .chat-line__moderation, .chat-line__status { padding: .3rem 0!important; }' +
			'.rooms-header { height: unset!important; }' +
			'.user-notice-line { padding-left: 0.1rem!important; }' +
			'.chat-input.tw-pd-b-2.tw-pd-x-2 { padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 0 !important; }' +
			'.tw-textarea { margin-bottom: -1rem!important; }' +
			'.chat-input .tw-textarea--no-resize { max-height: 50px!important; }' +
			'.chat-line__message--emote:hover { transform: scale(2)!important; padding-top: 10px!important; z-index: 10 !important; }' +
			'.simplebar-track { display: none!important; }' +
			'.chat-shell__expanded { min-width: unset!important; }' +
			'.stream-chat-header { height: 2rem; }' +
			'.channel-root__right-column--expanded { min-width: 34rem; }' +
			'.right-column--theatre .right-column__toggle-visibility { display: none !important; }' +
			'.chat-viewers__header { height: 3rem !important; }' +
			'.viewer-card-layer__draggable { width: 26rem !important; }' +
			'.reward-center__content { width: 24rem !important; }' +
			'.video-chat__header { height: 2rem !important; }' +
			'.right-column__toggle-visibility { top: -7px !important; }' +
			'.chat-input .tw-textarea--no-resize { padding-right: 1em !important; }' +
		'</style>'
	);
})();
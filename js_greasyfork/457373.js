// ==UserScript==
// @name         Twitch Chat Anti-Ban
// @namespace    https://github.com/tmarenko/twitch_chat_antiban
// @version      1.0
// @description  This script automatically opens a proxy chat to channels where you are banned.
// @author       seaque
// @match        *://*.twitch.tv/*
// @icon         data:image/svg+xml, <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 2400 2800" style="enable-background:new 0 0 2400 2800" xml:space="preserve"><style>.st1{fill:blueviolet}</style><path style="fill:white" d="m2200 1300-400 400h-400l-350 350v-350H600V200h1600z"/><g id="Layer_1-2"><path class="st1" d="M500 0 0 500v1800h600v500l500-500h400l900-900V0H500zm1700 1300-400 400h-400l-350 350v-350H600V200h1600v1100z"/><path class="st1" d="M1700 550h200v600h-200zm-550 0h200v600h-200z"/></g></svg>
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-start
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/457373/Twitch%20Chat%20Anti-Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/457373/Twitch%20Chat%20Anti-Ban.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    $(document).ready(() => {
    window.setInterval(function () {
        if ($('.chat-room__content .scrollable-area').length < 1 && $('#proxy_chat').length < 1) {
			let channel = (location.href.indexOf('popout') > -1) ? location.href.split('/')[4] : location.href.split('/')[3];
			let url = `https://nightdev.com/hosted/obschat/?theme=bttv_dark&channel=${channel}&fade=false&bot_activity=true&prevent_clipping=true`;
			let div_data = `<iframe name="proxy_chat" id="proxy_chat" src="${url}"  style="width: 100%; height: 100%;"></iframe>`;
			let chat_el = $('.chat-room__content').children().first();
			chat_el.removeClass();
			chat_el.addClass("chat-list--default scrollable-area");
			chat_el.html(div_data);
        }
    }, 250);
});
})();
// ==UserScript==
// @name         Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A chat in every webpage! Only one global chat.
// @author       ALF1
// @include      *
// @icon         https://img.favpng.com/13/19/18/chat-icon-png-favpng-VKinQiXDg2r36LkdNHRSUCeDr.jpg
// @exclude      https://*codesandbox.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436964/Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/436964/Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var chat = document.createElement("div");
    chat.innerHTML = `<div style="
    top: 0px;
    position: fixed;
    right: 0%;
    z-index: 10000;
    height: 100%;
"><iframe src="https://1j2of.sse.codesandbox.io/" style="
    height: 100%;
    background-color: white;
"></iframe></div>`;
    document.body.insertBefore(chat, document.body.firstChild);
    document.body.style.marginRight = "300px";
})();
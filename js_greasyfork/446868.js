// ==UserScript==
// @name         Invisible YouTube live chat mentions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove highlighted mentions in YouTube live chat.
// @author       hazysu
// @license      Unlicense
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446868/Invisible%20YouTube%20live%20chat%20mentions.user.js
// @updateURL https://update.greasyfork.org/scripts/446868/Invisible%20YouTube%20live%20chat%20mentions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElem = document.createElement('style')
    styleElem.innerHTML = `.mention.yt-live-chat-text-message-renderer { background: transparent; padding: 0; }`
    document.body.appendChild(styleElem)
})();
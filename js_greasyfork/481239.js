// ==UserScript==
// @name         Remove youtube livechat survey
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove survey
// @author       You
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481239/Remove%20youtube%20livechat%20survey.user.js
// @updateURL https://update.greasyfork.org/scripts/481239/Remove%20youtube%20livechat%20survey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let element = document.querySelector("#contents > yt-live-chat-poll-renderer")
if (element) {
    element.parentNode.removeChild(element);
}

})();

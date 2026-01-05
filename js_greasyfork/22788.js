// ==UserScript==
// @name         Kim Dotcom Stream IRC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace YouTube Gaming chat with IRC
// @author       /u/GarethPW
// @match        https://gaming.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22788/Kim%20Dotcom%20Stream%20IRC.user.js
// @updateURL https://update.greasyfork.org/scripts/22788/Kim%20Dotcom%20Stream%20IRC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // For the record, I don't usually code JavaScript.
    var el = document.querySelector('.ytg-watch-sidebar-0 .message.ytg-watch-sidebar');

    var newEl = el;
    newEl.innerHTML = '<iframe src="https://kiwiirc.com/client/irc.freenode.net/#kimcourt" style="height:100%;width:100%;margin-bottom:-2px;"></iframe>'; // ?theme=cli

    el.parentNode.replaceChild(newEl, el);
})();
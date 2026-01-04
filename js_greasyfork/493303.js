// ==UserScript==
// @name         Claude.ai Full Screen Chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modifies the styles of claude.ai to display the chat in full screen.
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493303/Claudeai%20Full%20Screen%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/493303/Claudeai%20Full%20Screen%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .max-w-3xl {
            max-width: none !important;
        }
    `);
})();
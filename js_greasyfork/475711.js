// ==UserScript==
// @name         Youtube Player Unrounder
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  unround the YouTube video player
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475711/Youtube%20Player%20Unrounder.user.js
// @updateURL https://update.greasyfork.org/scripts/475711/Youtube%20Player%20Unrounder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle // video player
    (`ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy {
    border-radius: 0px;
    }
   `);

    GM_addStyle // channel trailer player
    (`ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {
    border-radius: 0px;
    }
   `);
    GM_addStyle // video player variant 2
    (`ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy {
    border-radius: 0px;
    }
   `);

    // Your code here...
})();
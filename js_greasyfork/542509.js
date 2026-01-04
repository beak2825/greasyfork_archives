// ==UserScript==
// @name         Block RainbowPls and GatoPls Emotes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the RainbowPls and GatoPls emotes from DGG chat
// @author       chatter
// @match        https://www.destiny.gg/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542509/Block%20RainbowPls%20and%20GatoPls%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/542509/Block%20RainbowPls%20and%20GatoPls%20Emotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .RainbowPls,
        .GatoPls {
            display: none !important;
        }
    `);
})();

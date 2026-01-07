// ==UserScript==
// @name         Block RainbowPls, GatoPls and poroPls Emotes
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes the RainbowPls and GatoPls emotes from DGG chat
// @author       chatter
// @match        https://www.destiny.gg/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542509/Block%20RainbowPls%2C%20GatoPls%20and%20poroPls%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/542509/Block%20RainbowPls%2C%20GatoPls%20and%20poroPls%20Emotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .RainbowPls,
        .GatoPls,
        .poroPls {
            display: none !important;
        }
    `);
})();

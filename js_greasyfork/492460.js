// ==UserScript==
// @name         Clean pause COUB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  скрывает подборку коубов на паузе
// @author       ash911
// @match        *://coub.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492460/Clean%20pause%20COUB.user.js
// @updateURL https://update.greasyfork.org/scripts/492460/Clean%20pause%20COUB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .viewer.viewer--v2 .viewer__suggests { visibility: hidden; }
    `);
})();
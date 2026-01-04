// ==UserScript==
// @name           YouTube hide chat
// @name:es        YouTube chat oculto
// @description    Hide completely live chat on live streams by css
// @description:es Esconde el chat de las transmisiones en vivo completamente por css
// @version        0.5
// @author         IgnaV
// @match          https://www.youtube.com/*
// @icon           http://youtube.com/favicon.ico
// @namespace      http://tampermonkey.net/
// @license        MIT
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444216/YouTube%20hide%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/444216/YouTube%20hide%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#chat { display: none; }');
})();
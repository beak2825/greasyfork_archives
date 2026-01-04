// ==UserScript==
// @name         YouTube Hide Buttons
// @namespace    http://tampermonkey.net/
// @version      2025-06-19
// @description  Hides some YouTube Buttons
// @author       Dirk Bourgeois
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527085/YouTube%20Hide%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/527085/YouTube%20Hide%20Buttons.meta.js
// ==/UserScript==

GM_addStyle('button[aria-label="Download"] { display: none !important; }');
GM_addStyle('button[aria-label="Share"] { display: none !important; }');
GM_addStyle('button[aria-label="Thanks"] { display: none !important; }');
GM_addStyle('button[aria-label="Clip"] { display: none !important; }');
GM_addStyle('#subscribe-button { display: none !important; }'); // Remove Bell Button
GM_addStyle('#top-level-buttons-computed { display: none !important; }'); // Remove Like Dislike

(function() {
    'use strict';
})();
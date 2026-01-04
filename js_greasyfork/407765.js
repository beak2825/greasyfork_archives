// ==UserScript==
// @name         Youtube remove cards
// @namespace    https://greasyfork.org/en/scripts/407765-youtube-remove-cards/
// @version      0.5
// @match       *://youtube.com/watch/*
// @description  Youtube remove cards end video
// @author       TechComet
// @supportURL   https://greasyfork.org/en/scripts/407765-youtube-remove-cards/feedback
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407765/Youtube%20remove%20cards.user.js
// @updateURL https://update.greasyfork.org/scripts/407765/Youtube%20remove%20cards.meta.js
// ==/UserScript==

const currentUrl = window.location.href;
if (currentUrl.includes("youtube.com")) {
(function() {
    'use strict';
    GM_addStyle('.ytp-ce-element-show { visibility:hidden !important; }');
})();
}
// ==UserScript==
// @name         YouTube Addiction-Killer
// @version      0.2.0
// @namespace    https://github.com/xHadie
// @description  Hide Unproductive parts of YouTube Mobile. Only see the content that you searched for and subscribed to!
// @author       xHadie
// @match      https://www.youtube.com/*
// @match      https://m.youtube.com/*
// @icon         https://i.ytimg.com/an/r0deIusKuMOsUobj89aPZA/featured_channel.jpg?v=60f4dc70
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456773/YouTube%20Addiction-Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/456773/YouTube%20Addiction-Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#app > ytm-pivot-bar-renderer:nth-child(2) > ytm-pivot-bar-item-renderer:nth-child(2) { display: none; !important;');
    GM_addStyle('#filter-chip-bar { display: none; !important;');
    GM_addStyle('[tab-identifier="FEwhat_to_watch"] { display: none; !important;');
    GM_addStyle('ytm-item-section-renderer.scwnr-content:nth-child(4) { display: none; !important;');
    GM_addStyle('[data-content-type="related"] { display: none; !important;');

if (window.location.href.indexOf('youtube.com/shorts') > -1) {
    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
}

})();
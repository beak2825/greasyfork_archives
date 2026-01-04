// ==UserScript==
// @name        New script - 4anime.gg
// @namespace   Violentmonkey Scripts
// @match       https://*/*
// @grant       none
// @version     1.0
// @grant        GM_addStyle
// @author      -
// @description 2022/11/11 22:54:42
// @downloadURL https://update.greasyfork.org/scripts/454686/New%20script%20-%204animegg.user.js
// @updateURL https://update.greasyfork.org/scripts/454686/New%20script%20-%204animegg.meta.js
// ==/UserScript==
(function() {
    'use strict';

  GM_addStyle(`html body .jw-captions{pointer-events: fill;    height: 200px;    top: auto;bottom: 170px;}html body .jw-text-track-cue{user-select: text;}
                                       `);
})();
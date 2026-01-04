// ==UserScript==
// @name         BeatSaver Color Changer
// @namespace    bv-downvote-color-changer
// @description  Change the downvote color to the old one
// @match        https://*.beatsaver.com/*
// @grant        GM_addStyle
// @version      1.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449040/BeatSaver%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/449040/BeatSaver%20Color%20Changer.meta.js
// ==/UserScript==


GM_addStyle(`.search-results .beatmap small.vote .d,
            .search-results .beatmap .vote.small .d,
            .playlist .beatmap small.vote .d,
            .playlist .beatmap .vote.small .d,
            .search-results small.vote .d,
            .search-results .vote.small .d,
            .playlist small.vote .d,
            .playlist .vote.small .d
            {background: #e74c3c;}!important`)
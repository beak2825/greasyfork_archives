// ==UserScript==
// @name         MetroLyrics - Simple
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trash everything on the site. Just a simple banner and the lyrics.
// @author       jurassicplayer
// @match        http://www.metrolyrics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387483/MetroLyrics%20-%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/387483/MetroLyrics%20-%20Simple.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    addStyleString('.content .col-wide { padding: 30px 30px 0; margin: auto; float: none; }')
    addStyleString('div:empty, footer, sd-highlight { display:none !important; }');
    addStyleString('.js-col1, .writers, .ad, .sharing, .leaderboard, .big-box, .driver-related, .collapse, .bottom-mpu, .video-container-inline, .MLringtones, .note, .mid-song-wrap { display: none !important; }');
})();
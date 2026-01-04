// ==UserScript==
// @name         Spotify Lyrics Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description 获取并复制 Spotify Web 歌词
// @author       You
// @match        https://open.spotify.com/track/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528409/Spotify%20Lyrics%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/528409/Spotify%20Lyrics%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractLyrics() {
        let lyricsElements = document.querySelectorAll('[data-testid="lyrics-line-always-visible"], [data-testid="lyrics-container"] p');
        let lyrics = Array.from(lyricsElements).map(el => el.textContent.trim()).join('\n');
        if (lyrics) {
            console.log("Spotify Lyrics:\n" + lyrics);
            GM_setClipboard(lyrics);
            alert("歌词已复制到剪贴板！");
        } else {
            alert("未找到歌词，请确保歌词已加载。");
        }
    }

    GM_registerMenuCommand("复制 Spotify 歌词", extractLyrics);
})();
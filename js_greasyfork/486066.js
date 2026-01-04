// ==UserScript==
// @name         Apple Music Track info in tab title
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  Show track information in tab title in Apple Music Web
// @author       Pango
// @match        https://*.music.apple.com/*
// @icon         https://www.google.com/s2/favicons?domain=music.apple.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486066/Apple%20Music%20Track%20info%20in%20tab%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/486066/Apple%20Music%20Track%20info%20in%20tab%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sleep = ms => new Promise(r => setTimeout(r, ms)); // Don't judge me, musickitloaded event is broken and fires too early, causing MusicKit.getInstance() to return undefined

    sleep(2000).then(() => {
        const music = MusicKit.getInstance();
        music.addEventListener('nowPlayingItemDidChange', ({ item: nowPlayingItem }) => {
            document.title = `${nowPlayingItem.attributes.name} - ${nowPlayingItem.attributes.artistName} - Apple Music`;
        });
    })
})();
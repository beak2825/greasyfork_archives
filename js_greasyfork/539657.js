// ==UserScript==
// @name         YouTube Music Lyrics Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rend les paroles sur YouTube Music sélectionnables et copiables
// @author       FantasistEldrun
// @match        https://music.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539657/YouTube%20Music%20Lyrics%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/539657/YouTube%20Music%20Lyrics%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enableCopy = () => {
        const lyricsPanel = document.querySelector('ytmusic-section-list-renderer');
        if (!lyricsPanel) return;

        const style = document.createElement('style');
        style.textContent = `
            ytmusic-section-list-renderer {
                user-select: text !important;
                -webkit-user-select: text !important;
            }
            ytmusic-section-list-renderer * {
                user-select: text !important;
                -webkit-user-select: text !important;
                cursor: text !important;
            }
        `;
        document.head.appendChild(style);
    };


    const observer = new MutationObserver(() => {
        enableCopy();
    });

    observer.observe(document.body, { childList: true, subtree: true });


    enableCopy();
})();

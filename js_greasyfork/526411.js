// ==UserScript==
// @name         SpinSha.re default player
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  SpinSha.re default Audio player for song previews
// @author       ByteFun
// @license      MIT
// @match        https://spinsha.re/song/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spinsha.re
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526411/SpinShare%20default%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/526411/SpinShare%20default%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addAudioPlayers = () => {
        const songDetail = document.querySelector('.song-statistics');

        if (!songDetail) return;

        const scripts = document.getElementsByTagName('script');
        let mp3Url = '';
        let oggUrl = '';

        for (let script of scripts) {
            const scriptContent = script.innerHTML;

            const mp3Match = scriptContent.match(/currentPreviewAudio\s*=\s*new\s*Audio\("([^"]*\.mp3)"\)/);
            const oggMatch = scriptContent.match(/currentPreviewAudio\s*=\s*new\s*Audio\("([^"]*\.ogg)"\)/);

            if (mp3Match) {
                mp3Url = mp3Match[1];
            }

            if (oggMatch) {
                oggUrl = oggMatch[1];
            }
        }

        if (mp3Url) {
            const mp3Player = document.createElement('audio');
            mp3Player.controls = true;
            mp3Player.style.width = "100%";

            const mp3Source = document.createElement('source');
            mp3Source.src = mp3Url;
            mp3Source.type = 'audio/mpeg';

            mp3Player.appendChild(mp3Source);
            songDetail.appendChild(mp3Player);
        }

        if (oggUrl) {
            const oggPlayer = document.createElement('audio');
            oggPlayer.controls = true;
            oggPlayer.style.width = "100%";

            const oggSource = document.createElement('source');
            oggSource.src = oggUrl;
            oggSource.type = 'audio/ogg';

            oggPlayer.appendChild(oggSource);
            songDetail.appendChild(oggPlayer);
        }
    };

    window.addEventListener('load', addAudioPlayers);
})();
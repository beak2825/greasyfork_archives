// ==UserScript==
// @name                       YouTube - Volume Adjustment by 5%
// @name:fr                    YouTube - Ajustement du volume de 5%
// @name:es                    YouTube - Ajuste del volumen en 5%
// @name:de                    YouTube - Lautstärkeanpassung um 5%
// @name:it                    YouTube - Regolazione del volume del 5%
// @name:zh-CN                 YouTube - 音量调节 5%
// @namespace                  https://gist.github.com/4lrick/0c225473e9609302c6dd6f0dfa4f22a3
// @version                    1.3
// @description                Increments the audio volume of YouTube videos by 5%.
// @description:fr             Augmente le volume audio des vidéos YouTube de 5%.
// @description:es             Aumenta el volumen de audio de los videos de YouTube en un 5%.
// @description:de             Erhöht die Lautstärke der YouTube-Videos um 5%.
// @description:it             Aumenta il volume audio dei video YouTube del 5%.
// @description:zh-CN          将 YouTube 视频的音频音量增加 5%。
// @author                     4lrick
// @match                      https://www.youtube.com/*
// @icon                       https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant                      none
// @license                    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/479191/YouTube%20-%20Volume%20Adjustment%20by%205%25.user.js
// @updateURL https://update.greasyfork.org/scripts/479191/YouTube%20-%20Volume%20Adjustment%20by%205%25.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adjustVolume(player) {
        const currentVolume = player.getVolume();
        const adjustedVolume = Math.round(currentVolume / 5) * 5;

        if (adjustedVolume !== currentVolume) {
            player.setVolume(adjustedVolume);
            updateLocalStorage(adjustedVolume);
        }
    }

    function updateLocalStorage(volume) {
        const playerVolume = localStorage.getItem('yt-player-volume');
        if (!playerVolume) return;

        const volumeData = JSON.parse(playerVolume);
        volumeData.data = JSON.stringify({
            volume: volume,
            muted: JSON.parse(volumeData.data).muted
        });

        localStorage.setItem('yt-player-volume', JSON.stringify(volumeData));
    }

    function checkVideoExists() {
        const videoElement = document.querySelector('video');
        const player = document.getElementById('movie_player');

        if (!videoElement || !player) return;

        videoElement.addEventListener('volumechange', () => adjustVolume(player));
        adjustVolume(player);
        observer.disconnect();
    }

    const observer = new MutationObserver(checkVideoExists);
    observer.observe(document.body, { childList: true, subtree: true });
    checkVideoExists();
})();
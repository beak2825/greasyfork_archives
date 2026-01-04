// ==UserScript==
// @name               YouTube - Display current volume
// @name:fr            YouTube - Afficher le volume actuel
// @name:es            YouTube - Mostrar el volumen actual
// @name:de            YouTube - Aktuelle Lautstärke anzeigen
// @name:it            YouTube - Visualizza il volume corrente
// @name:zh-CN         YouTube - 显示当前音量
// @namespace          https://gist.github.com/4lrick/7a069ce704be9ac95f00d8fb9c2c9bb2
// @version            1.4
// @description        Displays the volume when it's changing.
// @description:fr     Affiche le volume lorsqu'il change.
// @description:es     Muestra el volumen cuando cambia.
// @description:de     Zeigt die Lautstärke an, wenn sie sich ändert.
// @description:it     Visualizza il volume quando cambia.
// @description:zh-CN  显示音量变化。
// @author             4lrick
// @match              https://www.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              none
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/479475/YouTube%20-%20Display%20current%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/479475/YouTube%20-%20Display%20current%20volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let volumeDisplayTimeout;
    let lastMutedState;

    const VOLUME_DISPLAY_ID = 'ytp-video-volume';
    const VOLUME_DISPLAY_DURATION = 1000;
    const VOLUME_DISPLAY_STYLE = {
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#eee',
        fontSize: '175%',
        zIndex: '19',
        padding: '10px 20px',
        borderRadius: '3%'
    };

    function createVolumeDisplay() {
        const volumeDisplay = document.createElement('div');

        volumeDisplay.id = VOLUME_DISPLAY_ID;
        Object.assign(volumeDisplay.style, VOLUME_DISPLAY_STYLE);

        return volumeDisplay;
    }

    function displayVolume(player) {
        let volumeDisplay = document.getElementById(VOLUME_DISPLAY_ID) || player.appendChild(createVolumeDisplay());

        if (player.isMuted() !== lastMutedState) {
            lastMutedState = player.isMuted();
            volumeDisplay.style.display = 'none';
            return;
        }

        volumeDisplay.textContent = `${player.getVolume()}%`;
        volumeDisplay.style.display = 'block';

        clearTimeout(volumeDisplayTimeout);
        volumeDisplayTimeout = setTimeout(() => {
            volumeDisplay.style.display = 'none';
        }, VOLUME_DISPLAY_DURATION);
    }

    function checkVideoExists() {
        const videoElement = document.querySelector('video');
        const player = document.getElementById('movie_player');

        if (!videoElement || !player) return;

        lastMutedState = player.isMuted();
        videoElement.addEventListener('volumechange', () => displayVolume(player));
        observer.disconnect();
    }

    const observer = new MutationObserver(checkVideoExists);
    observer.observe(document.body, { childList: true, subtree: true });
})();
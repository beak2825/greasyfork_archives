// ==UserScript==
// @name               YouTube - Volume Badge
// @name:fr            YouTube - Badge de Volume
// @name:es            YouTube - Indicador de volumen
// @name:de            YouTube - Lautstärke-Anzeige
// @name:it            YouTube - Etichetta del volume
// @name:zh-CN         YouTube - 音量徽章
// @namespace          https://gist.github.com/4lrick/89f4efb2fb0a3c48cc3411edeb6a7339
// @version            1.1
// @description        Displays a badge on the volume button showing the current volume percentage.
// @description:fr     Affiche un badge sur le bouton de volume indiquant le pourcentage actuel.
// @description:es     Muestra una insignia en el botón de volumen con el porcentaje actual.
// @description:de     Zeigt ein Abzeichen auf dem Lautstärkeknopf mit dem aktuellen Prozentsatz an.
// @description:it     Mostra un'etichetta sul pulsante del volume con la percentuale attuale.
// @description:zh-CN  在音量按钮上显示当前音量百分比的徽章。
// @author             4lrick
// @match              https://www.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              none
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/533082/YouTube%20-%20Volume%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/533082/YouTube%20-%20Volume%20Badge.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VOLUME_BADGE_ID = 'ytp-volume-badge';
    const VOLUME_BADGE_STYLE = {
        position: 'absolute',
        padding: '1px 3px',
        backgroundColor: 'var(--yt-spec-red-indicator, #e1002d)',
        fontFamily: 'Verdana,sans-serif',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 2px 0 rgba(0,0,0,.6)',
        backgroundImage: 'none',
        borderRadius: '1.5px',
        height: 'auto',
        width: 'auto',
        lineHeight: 'normal',
        transition: 'opacity 0.2s ease',
        opacity: '0',
    };

    function createBadge() {
        const badge = document.createElement('div');

        badge.id = VOLUME_BADGE_ID;
        Object.assign(badge.style, VOLUME_BADGE_STYLE);

        return badge;
    }

    function injectBadge() {
        const muteBtn = document.querySelector('.ytp-mute-button');
        if (!muteBtn || document.getElementById(VOLUME_BADGE_ID)) return;

        const badge = createBadge();
        muteBtn.style.position = 'relative';
        muteBtn.appendChild(badge);
        return badge;
    }

    function updateBadgeSize() {
        const badge = document.getElementById(VOLUME_BADGE_ID);
        if (!badge) return;

        const fullscreenEl = document.fullscreenElement;
        const video = document.querySelector('video');
        const isVideoFullscreen = fullscreenEl && fullscreenEl.contains(video);
        const zoomFactor = window.devicePixelRatio || 1;

        if (isVideoFullscreen) {
            badge.style.right = `${12 / zoomFactor}px`;
            badge.style.top = `${12 / zoomFactor}px`;
            badge.style.fontSize = `${10 / zoomFactor}px`;
        } else {
            badge.style.right = `${8 / zoomFactor}px`;
            badge.style.top = `${8 / zoomFactor}px`;
            badge.style.fontSize = `${10 / zoomFactor}px`;
        }
    }

    function displayBadge(player) {
        let badge = document.getElementById(VOLUME_BADGE_ID) || injectBadge();
        if (!badge || !player) return;

        const volume = player.getVolume();
        const isMuted = player.isMuted() || volume === 0;
        updateBadgeSize();

        badge.textContent = volume;
        badge.style.opacity = isMuted ? '0' : '1';
    }

    function checkVideoExists() {
        const video = document.querySelector('video');
        const player = document.getElementById('movie_player');
        if (!video || !player) return;

        displayBadge(player);

        video.addEventListener('volumechange', () => {
            displayBadge(player);
        });

        observer.disconnect();
    }

    const observer = new MutationObserver(checkVideoExists);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', updateBadgeSize);
})();
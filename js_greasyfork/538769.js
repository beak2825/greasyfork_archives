// ==UserScript==
// @name         AdBlockThisYT2
// @namespace    SebaARG22
// @version      3.1.8
// @description  Evita bloqueos por AdBlock sin romper botones ni dejar fondo oscuro que bloquea clicks. Intenta autoplay sin mute ni botones, y elimina capa .opened./Avoids AdBlock restrictions without breaking buttons or leaving a dark overlay that blocks clicks. Attempts autoplay without mute or buttons, and removes the .opened layer.
// @author       SebaARG22
// @match        *://www.youtube.com/*
// @icon         https://i.imgur.com/fd1D46S.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538769/AdBlockThisYT2.user.js
// @updateURL https://update.greasyfork.org/scripts/538769/AdBlockThisYT2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[😭 CryTubeFix]';

    console.log(`${LOG_PREFIX} Script iniciado.`);

    // CSS para ocultar anuncios y capa .opened
    const css = `
        .ytp-ad-overlay-container,
        .ytp-ad-player-overlay,
        .ytp-ad-module,
        ytd-enforcement-message-view-model[data-adblock-hidden] {
            display: none !important;
        }

        .opened,
        .opened * {
            background: transparent !important;
            pointer-events: none !important;
            user-select: none !important;
            opacity: 0 !important;
            z-index: 0 !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    function removeOpenedOverlay() {
        const openedElements = document.querySelectorAll('.opened');
        openedElements.forEach(el => {
            if (el.parentElement) el.parentElement.style.pointerEvents = 'auto';
            el.remove();
            console.log(`${LOG_PREFIX} Eliminado elemento .opened.`);
        });
    }

    const observer = new MutationObserver(() => {
        const messages = document.querySelectorAll('ytd-enforcement-message-view-model');
        messages.forEach(el => {
            const text = el.innerText?.toLowerCase() || '';
            if (text.includes('ad blocker') || text.includes('bloqueador de anuncios')) {
                el.setAttribute('data-adblock-hidden', 'true');
                document.body.style.overflow = 'auto';
                console.log(`${LOG_PREFIX} Ocultado aviso AdBlock.`);
            }
        });
        removeOpenedOverlay();
    });
    observer.observe(document, { childList: true, subtree: true });
    setInterval(removeOpenedOverlay, 500);

    function autoplayVideo() {
        const video = document.querySelector('video');
        if (!video) {
            setTimeout(autoplayVideo, 500);
            return;
        }

        video.muted = false; // No mute
        video.play().then(() => {
            console.log(`${LOG_PREFIX} Autoplay sin mute iniciado.`);
        }).catch(() => {
            console.warn(`${LOG_PREFIX} Autoplay sin mute fue bloqueado por el navegador.`);
        });
    }

    function setupAutoplayOnPage() {
        autoplayVideo();

        let lastPath = location.pathname;
        setInterval(() => {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
                console.log(`${LOG_PREFIX} Cambio de página detectado, intentando autoplay.`);
                autoplayVideo();
            }
        }, 1000);
    }

    if (window.location.pathname.startsWith('/watch')) {
        window.addEventListener('DOMContentLoaded', setupAutoplayOnPage);
    }

})();

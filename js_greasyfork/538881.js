// ==UserScript==
// @name         AdBlockThisYT2
// @namespace    SebaARG22
// @version      3.0.2
// @description  Permite reproducir videos con AdBlock activado sin errores ni bloqueos, incluso en nueva pestaña. Corrige pausa automática.
// @author       SebaARG22
// @match        *://www.youtube.com/*
// @icon         https://i.imgur.com/fd1D46S.png
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538881/AdBlockThisYT2.user.js
// @updateURL https://update.greasyfork.org/scripts/538881/AdBlockThisYT2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[😭 CryTubeFix]';

    console.log(`${LOG_PREFIX} Script iniciado. Bloqueando el berrinche de YouTube.`);

    // 1. Oculta overlays molestos
    const css = `
        ytd-enforcement-message-view-model,
        tp-yt-paper-dialog,
        ytd-popup-container,
        #dialog,
        .ytp-ad-overlay-container,
        .ytp-ad-player-overlay,
        .ytp-ad-module {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        body {
            overflow: auto !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    console.log(`${LOG_PREFIX} CSS inyectado. Publicidad visual: OUT.`);

    // 2. Observa cambios en el DOM para eliminar bloqueos dinámicos
    const observer = new MutationObserver(() => {
        const dialogs = document.querySelectorAll('ytd-popup-container tp-yt-paper-dialog, ytd-enforcement-message-view-model');
        dialogs.forEach(el => {
            console.log(`${LOG_PREFIX} Eliminado un popup llorón.`);
            el.remove();
        });
        const backdrop = document.querySelector('#backdrop');
        if (backdrop) {
            console.log(`${LOG_PREFIX} Backdrop eliminado.`);
            backdrop.remove();
        }
        document.body.style.overflow = 'auto';
    });
    observer.observe(document, { childList: true, subtree: true });

    console.log(`${LOG_PREFIX} Observador activado. Listo para limpiar rabietas.`);

    // 3. Soluciona pausa automática del video
    if (window.location.pathname.startsWith('/watch')) {
        window.addEventListener('DOMContentLoaded', () => {
            const tryPlay = () => {
                const player = document.querySelector('video');
                if (player) {
                    console.log(`${LOG_PREFIX} Intentando reproducir el video automáticamente...`);
                    const playPromise = player.play();
                    if (playPromise !== undefined) {
                        playPromise.catch((err) => {
                            console.warn(`${LOG_PREFIX} Error al intentar reproducir:`, err);
                        });
                    }
                } else {
                    console.warn(`${LOG_PREFIX} Player no encontrado. Reintentando en 500ms...`);
                    setTimeout(tryPlay, 500);
                }
            };
            tryPlay();
        });
    }

})();
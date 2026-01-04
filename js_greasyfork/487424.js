// ==UserScript==
// @name         Autoclick bonificación Twitch (detector completo con sonido)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Click automático y con sonido en el botón "Reclamar bonificación" en Twitch
// @author       De_lujo
// @license      De_lujo
// @match        https://www.twitch.tv/*
// @match        https://www.twitch.tv/popout/*/chat?popout=
// @exclude      *://*.twitch.tv/p/*
// @exclude      *://*.twitch.tv/popout/*/poll*
// @exclude      *://*.twitch.tv/popout/*/reward-queue*
// @exclude      *://*.twitch.tv/popout/*/predictions*
// @exclude      *://*.twitch.tv/popout/moderator/*
// @exclude      *://*.twitch.tv/moderator/*
// @exclude      *://*.twitch.tv/broadcast/*
// @exclude      *://*.twitch.tv/subs/*
// @exclude      *://*.twitch.tv/jobs/*
// @exclude      *://*.twitch.tv/teams/*
// @exclude      *://*.twitch.tv/store/*
// @exclude      *://player.twitch.tv/*
// @exclude      *://dashboard.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487424/Autoclick%20bonificaci%C3%B3n%20Twitch%20%28detector%20completo%20con%20sonido%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487424/Autoclick%20bonificaci%C3%B3n%20Twitch%20%28detector%20completo%20con%20sonido%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sound = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
    sound.volume = 0.7;

    function clickBonusButton() {
        const button = document.querySelector('button[aria-label="Reclamar bonificación"]') ||
                       Array.from(document.querySelectorAll('button')).find(btn =>
                           btn.innerText.trim().toLowerCase().includes('bonificación')
                       );

        if (button) {
            button.click();
            console.log('[AutoBonus] ✅ Bonificación reclamada');
            sound.play().catch(err => console.warn('[AutoBonus] Error al reproducir sonido:', err));
        }
    }

    // Click inmediato si ya está presente
    const tryClickImmediately = () => {
        clickBonusButton();
    };

    // Observa TODO el DOM
    const observer = new MutationObserver(() => {
        clickBonusButton();
    });

    function startObserver() {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[AutoBonus] 👀 Observando la página para detectar bonificaciones...');
    }

    // Inicia después que la página esté lista
    window.addEventListener('load', () => {
        tryClickImmediately(); // intenta hacer click por si ya está
        startObserver(); // observa continuamente cambios
    });
})();

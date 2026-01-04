// ==UserScript==
// @license MIT
// @name         Twitch Unmute
// @namespace    rochera5
// @version      1.9
// @description  Simula un click real en el botón de desmuteo tras 10s de cargar la web
// @author       rochera5
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
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
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537572/Twitch%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/537572/Twitch%20Unmute.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    setTimeout(function() {
        let intentos = 0;
        const maxIntentos = 20;
        const intervalo = setInterval(function() {
            const muteButton = document.querySelector('button[data-a-target="player-mute-unmute-button"]');
            if (muteButton) {
                // Simula un click real de usuario
                muteButton.dispatchEvent(new MouseEvent('mouseover', {bubbles:true, cancelable:true, view:window}));
                muteButton.dispatchEvent(new MouseEvent('mousedown', {bubbles:true, cancelable:true, view:window}));
                muteButton.dispatchEvent(new MouseEvent('mouseup', {bubbles:true, cancelable:true, view:window}));
                muteButton.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, view:window}));
                console.log('¡Botón de desmuteo pulsado con evento realista!');
                clearInterval(intervalo);
            } else {
                intentos++;
                if (intentos >= maxIntentos) {
                    console.log('No se encontró el botón de desmuteo tras 20 intentos.');
                    clearInterval(intervalo);
                }
            }
        }, 1000);
    }, 10000);
});

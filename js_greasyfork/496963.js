// ==UserScript==
// @name         Auto Play Twitch
// @namespace    elanis
// @version      1,0
// @description  Reproduce automáticamente los streams de Twitch si están pausados
// @author       elanis
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
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        none
// @license      Ns
// @downloadURL https://update.greasyfork.org/scripts/496963/Auto%20Play%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/496963/Auto%20Play%20Twitch.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    console.log('Script iniciado');

    function playStream() {
        // Selector para encontrar el botón de reproducir
        const playButton = $('button[aria-label="Reproducir (espacio/k)"]');

        if (playButton.length > 0) {
            playButton.click();
            console.log('Stream reproducido');
        }
    }

    // Intenta reproducir el stream cada 5 segundos
    setInterval(playStream, 5000);
});

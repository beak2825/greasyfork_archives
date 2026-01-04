// ==UserScript==
// @name         Auto Click "Empezar a ver" on Twitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hace clic automáticamente en el botón "Empezar a ver" en Twitch en 15 segundos
// @author       elanis
// @license      Ns
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
// @downloadURL https://update.greasyfork.org/scripts/501806/Auto%20Click%20%22Empezar%20a%20ver%22%20on%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/501806/Auto%20Click%20%22Empezar%20a%20ver%22%20on%20Twitch.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    console.log('Script iniciado');

    function clickEmpezarVer() {
        // Selector para encontrar el botón "Empezar a ver"
        const empezarVerButton = $('div[data-a-target="tw-core-button-label-text"]:contains("Empezar a ver")');

        if (empezarVerButton.length > 0) {
            empezarVerButton.click();
            console.log('Botón "Empezar a ver" clickeado');
        }
    }

    // Intenta hacer clic en el botón "Empezar a ver" cada 15 segundos
    setInterval(clickEmpezarVer, 15000);
});

// ==UserScript==
// @name         Auto Click Participate Button
// @namespace    elanis
// @version      1.0
// @description  Hace clic automáticamente en el botón "Aun así quiero participar" en Twitch
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
// @downloadURL https://update.greasyfork.org/scripts/499671/Auto%20Click%20Participate%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/499671/Auto%20Click%20Participate%20Button.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    console.log('Script iniciado');

    function clickParticipateButton() {
        // Selector para encontrar el botón "Aun así quiero participar"
        const participateButton = $('div[data-a-target="tw-core-button-label-text"]:contains("Aun así quiero participar")');

        if (participateButton.length > 0) {
            participateButton.click();
            console.log('Botón "Aun así quiero participar" clickeado');
        }
    }

    // Intenta hacer clic en el botón cada 10 segundos
    setInterval(clickParticipateButton, 10000);
});

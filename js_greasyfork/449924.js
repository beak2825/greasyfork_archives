// ==UserScript==
// @name            Quitar carrusel de streamers
// @name:en         Remove carousel from twitch
// @description     Quitar carrusel de streamers en twitch
// @description:en  Removes Front-page carousel
// @version      2.0
// @author       Maqui
// @exclude      *://*.twitch.tv/p/*
// @exclude      *://*.twitch.tv/popout/*/poll*
// @exclude      *://*.twitch.tv/popout/*/reward-queue*
// @exclude      *://*.twitch.tv/popout/*/predictions*
// @exclude      *://*.twitch.tv/moderator/*
// @exclude      *://*.twitch.tv/subs/*
// @exclude      *://*.twitch.tv/teams/*
// @exclude      *://player.twitch.tv/*
// @match        https://www.twitch.tv/
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/949091
// @downloadURL https://update.greasyfork.org/scripts/449924/Quitar%20carrusel%20de%20streamers.user.js
// @updateURL https://update.greasyfork.org/scripts/449924/Quitar%20carrusel%20de%20streamers.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    const boxes = document.querySelectorAll("[class*=front-page-carousel]");

boxes.forEach(box => {
  box.remove();
});
}, false);

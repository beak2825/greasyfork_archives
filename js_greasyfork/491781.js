// ==UserScript==
// @name        anime1.me - Auto Unmuted
// @namespace   UserScripts
// @match       https://anime1.me/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/6/2024, 5:28:51 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491781/anime1me%20-%20Auto%20Unmuted.user.js
// @updateURL https://update.greasyfork.org/scripts/491781/anime1me%20-%20Auto%20Unmuted.meta.js
// ==/UserScript==


document.addEventListener('play', function (evt) {

    const target = evt.target;
    if (!(target instanceof HTMLVideoElement)) return;
    if (target.duration < 59) return;
    if (target.currentTime > 0.2) return;
    if (target.muted) return;
    target.muted = false;

}, true)
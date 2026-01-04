// ==UserScript==
// @name         AniWave Auto Enabler
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      8
// @description  Automatically enables the AniWave website default auto play and auto next options.
// @author       hacker09
// @include      https://aniwave.*/watch/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://aniwave.se&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446544/AniWave%20Auto%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/446544/AniWave%20Auto%20Enabler.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".auto-play > i.fa-solid.fa-square") !== null ? document.querySelector(".auto-play > i").click() : ''; //Enable Auto Play
  document.querySelector(".fa-square") !== null ? document.querySelector(".fa-square").click() : ''; //Enable Auto Next
})();
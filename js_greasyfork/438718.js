// ==UserScript==
// @name         AniWave Ads Hider
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      6
// @description  Removes all Ads from AniWave.
// @author       hacker09
// @include      https://aniwave.*/*
// @include      https://mcloud.bz/e/*
// @include      https://vidplay.online/e/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://aniwave.se&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438718/AniWave%20Ads%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/438718/AniWave%20Ads%20Hider.meta.js
// ==/UserScript==
// || img.src === 'https://vidplay.online/assets/bn/3.png'
setTimeout((function() {
  'use strict';
  document.querySelectorAll("section.sda").forEach(el => el.style.display = 'none'); //Hides the video right sidebar ads and the row of ads below the video
  document.querySelectorAll('img').forEach(function(img) { //forEach img on the iframe
    if (img.src.match(/movie.jpg|assets\/bn/)) { //Check if the image source includes the specified image name
      img.parentNode.parentNode.parentNode.parentNode.style.display = 'none'; //Hide the ad
    } //Finishes the if condition
  }); //Finishes the forEach loop
}), 1000)();
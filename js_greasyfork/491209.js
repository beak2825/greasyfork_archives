// ==UserScript==
// @name         Default Resolution - YouTube
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Choose the default resolution for YouTube videos!
// @author       hacker09
// @match        https://m.youtube.com/watch?v=*
// @match        https://www.youtube.com/embed/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/491209/Default%20Resolution%20-%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/491209/Default%20Resolution%20-%20YouTube.meta.js
// ==/UserScript==

setTimeout(() => {
  'use strict';
  if (GM_getValue('Default_Desktop_Resolution') === undefined) //If the Default_Resolution wasn't set yet
  { //Starts the if condition
    GM_setValue('Default_Desktop_Resolution', 'hd1080'); //Save the Default YT Desktop Resolution as 1080p
    GM_setValue('Default_Mobile_Resolution', 'tiny'); //Save the Default YT Mobile Resolution as 144p
  } //Finishes the if condition

  document.querySelector(".html5-main-video").addEventListener("play", (ev) => {
    ev.target.closest('#movie_player').setPlaybackQualityRange((navigator.userAgentData.mobile === true) ? GM_getValue('Default_Mobile_Resolution') : (ev.target.closest('#movie_player').getAvailableQualityLevels().includes(GM_getValue('Default_Desktop_Resolution')) === true) ? GM_getValue('Default_Desktop_Resolution') : ev.target.closest('#movie_player').getAvailableQualityLevels()[0]); //If the user is on mobile, use the default mobile resolution, otherwise if the default desktop resolution exists use it, or if it doesn't exist then use the highest resolution available
  }, { once: true });
}, 800);
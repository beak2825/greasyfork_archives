// ==UserScript==
// @name         Auto Set Youtube Volume
// @namespace    YTVol
// @version      5
// @description  Choose the default volume for YouTube videos!
// @author       hacker09
// @match        https://www.youtube.com/embed/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/429143/Auto%20Set%20Youtube%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/429143/Auto%20Set%20Youtube%20Volume.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (GM_getValue('Default_Volume') === undefined) //If the Default_Volume wasn't set yet
  { //Starts the if condition
    GM_setValue('Default_Volume', 20); //Save the Default YT Volume as 20%
  } //Finishes the if condition

  window.sessionStorage.setItem('yt-player-volume', '{"data":"{\\"volume\\":' + GM_getValue('Default_Volume') + ',\\"muted\\":false}","creation":' + new Date().valueOf() + '}'); //Set the Default YT Volume
})();
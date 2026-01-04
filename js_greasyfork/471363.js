// ==UserScript==
// @name         iDNES skip video Ad
// @version      1.1.0
// @description  Zobrazování průměru ze známek i když nejsou administrátorem povolené
// @copyright    2021, Engy
// @author       engy@centrum.cz
// @license      MIT
// @match        https://*.idnes.cz/*
// @icon         https://www.google.com/s2/favicons?domain=idnes.cz
// @grant        none
// @namespace https://greasyfork.org/users/1132330
// @downloadURL https://update.greasyfork.org/scripts/471363/iDNES%20skip%20video%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/471363/iDNES%20skip%20video%20Ad.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setInterval(function(){
    //debugger
    let videoPlayer = document.getElementsByTagName('videoplayer');
    if (videoPlayer.length > 0)
    {
      let skip = videoPlayer[0].getElementsByTagName('skip');
      if (skip.length > 0 && skip[0].innerHTML != "")
      {
        console.log('Skip Ad');
        let video = document.getElementsByTagName('video');
        video[0].currentTime = video[0].duration;
      }
    }
  }, 500);
})();
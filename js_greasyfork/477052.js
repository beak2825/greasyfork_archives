// ==UserScript==
// @name         Meu filho youtube
// @version      v1.2
// @description  gok é fodao
// @author       gok
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @noframes
// @namespace https://greasyfork.org/users/1189822
// @downloadURL https://update.greasyfork.org/scripts/477052/Meu%20filho%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/477052/Meu%20filho%20youtube.meta.js
// ==/UserScript==


function onYouTubeIframeAPIReady() {
  
  var adBlockNotice = document.querySelector(".ytd-adblock-notice");

 
  if (adBlockNotice) {
    adBlockNotice.parentNode.removeChild(adBlockNotice);
  }
}


window.addEventListener("YouTubeIframeAPIReady", onYouTubeIframeAPIReady);
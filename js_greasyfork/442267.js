// ==UserScript==
// @name        Auto unmute Stories
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.2.1
// @author      jside
// @description Automaticly unmute stories / turn story audio on
// @downloadURL https://update.greasyfork.org/scripts/442267/Auto%20unmute%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/442267/Auto%20unmute%20Stories.meta.js
// ==/UserScript==



var mainLoop = setInterval(()=>{
  try {
    videoElement = document.getElementsByClassName('_aa63  _ac3u')[0]
    audioButton = document.getElementsByClassName("_abl-")[1];
    
    if (videoElement.muted == true && audioButton.jside_done != true && videoElement.jside_tried != true) {
        audioButton.click();
        videoElement.jside_tried = true; // only run once per muted story
    }
    else if (videoElement.muted == false){
      audioButton.jside_done = true; // to allow muting again
    }
  }
  catch(err) {
  // lets not spam the console
  }
},1000);

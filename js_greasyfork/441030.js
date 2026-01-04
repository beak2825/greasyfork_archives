// ==UserScript==
// @name        nekos.life image viewer
// @namespace   Violentmonkey Scripts
// @match       https://nekos.life/*
// @grant       none
// @version     1.0
// @author      incursion
// @description nekos.life image viewer (k for lewd l for normal)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441030/nekoslife%20image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/441030/nekoslife%20image%20viewer.meta.js
// ==/UserScript==
var shit = document.querySelector("[id='modal01']")
shit.style.display='block'
 $(document).keydown(function(e){
  if(e.which == 75){ // capital W
    window.stop();
    history.pushState({},'',location.href)
    location.href = "https://nekos.life/lewd";
  }else if(e.which == 76){
    window.stop();
    history.pushState({},'',location.href)
    location.href = "https://nekos.life/";
  }
});
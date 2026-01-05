// ==UserScript==
// @name        Proxer_TodDenSchlechtenEmotes
// @author      Dravorle
// @namespace   proxer.me
// @description Shiro ist geiler
// @include     http://proxer.me/forum/*
// @include     https://proxer.me/forum/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13791/Proxer_TodDenSchlechtenEmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/13791/Proxer_TodDenSchlechtenEmotes.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function() {
  var dummeEmotes = document.getElementsByClassName("bbcode_smiley");
    
  for(i=0; i<dummeEmotes.length;i++) {
    //dummeEmotes[i].style.display = 'none'; //Smileys löschen
    //dummeEmotes[i].setAttribute("src", "http://puu.sh/lhZn8/75262aa2cc.png"); //ALL HAIL LOLI
    dummeEmotes[i].setAttribute("src", ""); //The christl way of doing things
  }
});
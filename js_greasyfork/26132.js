// ==UserScript==
// @name         VK NoRepost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрывает репосты в новостях и группах.
// @author       Hebi
// @match        *://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26132/VK%20NoRepost.user.js
// @updateURL https://update.greasyfork.org/scripts/26132/VK%20NoRepost.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function NoRepost(){
    var pw = document.getElementById("public_wall"),
        fr = document.getElementById("feed_rows");
    if (pw || fr) {
      var pc = document.querySelectorAll( 'div[data-copy].post:not([vpf])' );
      for (var i = 0; i < pc.length; i++) {
        //pc[i].style.backgroundColor = "red";//debug
        pc[i].style.display="none";
      }
    }
  }
    var timerId = setInterval(function() {
    NoRepost();
   }, 1000);
})();
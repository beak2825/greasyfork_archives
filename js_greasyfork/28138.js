// ==UserScript==
// @name         KR exploit
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  reloads page as invest button
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28138/KR%20exploit.user.js
// @updateURL https://update.greasyfork.org/scripts/28138/KR%20exploit.meta.js
// ==/UserScript==

$(".loginButton").mousedown(function(ev){
      if(ev.which == 1)
      {
          location.reload(true);
      }
});

window.onkeydown = function() {
   if (event.keyCode === 220) { 
    location.reload(true);    
   }
};
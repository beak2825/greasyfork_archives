// ==UserScript==
// @name         Open link in steam client
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Opens steamcommunity and steam store page in steam client when you right click while holding ctrl
// @author       Bum
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397563/Open%20link%20in%20steam%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/397563/Open%20link%20in%20steam%20client.meta.js
// ==/UserScript==

$(document).keydown(function(event){
    if(event.which=="17")
        cntrlIsPressed = true;
});

$(document).keyup(function(){
    cntrlIsPressed = false;
});

var cntrlIsPressed = false;


(function() {
    'use strict';

if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {if(cntrlIsPressed)
    {
        window.location.replace("steam://openurl/" + window.location.href);
    cntrlIsPressed = false;
             e.preventDefault();}
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
      if(cntrlIsPressed){
        window.location.replace("steam://openurl/" + window.location.href);
    cntrlIsPressed = false;
    window.event.returnValue = false;
      }
  });
}
})();
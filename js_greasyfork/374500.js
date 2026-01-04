// ==UserScript==
// @name           Adblock Wall Spiegel Online entfernen
// @namespace      https://greasyfork.org/de/users/226752-quatze
// @description    Entfernt die Anti-Adblock-Meldung von SPON.
// @author         quatze
// @locale         de
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.1
// @license        GPLv2
// @match          http://www.spiegel.de/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374500/Adblock%20Wall%20Spiegel%20Online%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/374500/Adblock%20Wall%20Spiegel%20Online%20entfernen.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global $: false */
'use strict';

$(function() {
  var h, s;
  h = document.getElementsByTagName('head')[0];
  if (!h) {
    return;
  }
  s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = '.ua-detected { display: none !important; }' +
    '#wrapper-content { opacity: 1.0 !important; filter: none !important; pointer-events: auto !important; }';
  h.appendChild(s);
  var messageCleared, wallCleared = false;
  var interval = window.setInterval(removeWall, 500);
  function removeWall() {
	 var iFrameDOM = $("#main-frame").contents();
     var message = iFrameDOM.length > 0 ? iFrameDOM.find("[id^=sp_message]") : $("[id^=sp_message]");
     if (message && message.length > 0)
     {
         for (var i = 0; i < message.length; i++) {
              message[i].remove();
         }
         messageCleared = true;
     }
     var wall = iFrameDOM.length > 0 ? iFrameDOM.find("[class^=sp_veil]") : $("[class^=sp_veil]");
     if (wall && wall.length > 0)
     {
         for (var j = 0; j < wall.length; j++) {
             wall[j].remove();
         }
         wallCleared = true;
     }
     if (messageCleared && wallCleared)
     {
         $("body").removeAttr("style");
         $("html").removeAttr("style");
         clearInterval(interval);
     }
  }
});

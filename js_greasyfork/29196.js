// ==UserScript==
// @name        WD Cloud Unhide Button
// @description Unhides the "shutdown" button for the WD Cloud.
// @namespace   Pogmog
// @include     http://192.168.1.07/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29196/WD%20Cloud%20Unhide%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/29196/WD%20Cloud%20Unhide%20Button.meta.js
// ==/UserScript==


window.setInterval(function(){
  $('#id_shutdown_td').css({
    'display': 'initial'
  });
}, 5000);
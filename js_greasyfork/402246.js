// ==UserScript==
// @name        OfficialOculusRiftS
// @namespace   OfficialOculusRiftS
// @description Play a sound if Oculus Rift S is in stock
// @version     2
// @include 	https://www.oculus.com/rift-s/?locale=en_US*
// @include     https://www.oculus.com/rift-s/*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/402246/OfficialOculusRiftS.user.js
// @updateURL https://update.greasyfork.org/scripts/402246/OfficialOculusRiftS.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.oculus.com/rift-s/?locale=en_US

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/c5ff2543b53f4cc0ad3819a36752467b/file-playful-jingle-bells.mp3';
player.preload = 'auto';

if (!(/Notify Me/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 3*1000);
}
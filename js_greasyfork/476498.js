// ==UserScript==
// @name     vrporn.com 2D mode player
// @description vrporn.com switches mode to 2D
// @version  4
// @grant    none
// @include  https://vrporn.com/*
// @include  https://www.vrporn.com/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/476498/vrporncom%202D%20mode%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/476498/vrporncom%202D%20mode%20player.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  var video_player = document.getElementsByTagName("dl8-video")[0];
  if (video_player !== null && video_player !== undefined){
  	video_player.setAttribute('format', 'MONO_FLAT');
  }
}, false);
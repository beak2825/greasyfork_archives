// ==UserScript==
// @name     vrporn.com player resized
// @description vrporn.com resize player
// @version  2
// @grant    none
// @include  https://vrporn.com/*
// @include  https://www.vrporn.com/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/476499/vrporncom%20player%20resized.user.js
// @updateURL https://update.greasyfork.org/scripts/476499/vrporncom%20player%20resized.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  setStyles();
}, false);


window.addEventListener('visibilitychange', function() {
  setStyles();
}, false);

function setStyles(){
	var video_player = document.getElementById("dl8videoplayer");
  video_player.style.height = "80vh";
  video_player.style.maxHeight = "unset";
  
  var content = document.getElementsByClassName("content-sidebar-wrap")[0];
  content.style.paddingLeft = content.style.paddingRight = "20px";
  
  
  var wr_video = document.getElementsByClassName("wr-video")[0];
  wr_video.style.height = "80vh";
}
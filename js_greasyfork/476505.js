// ==UserScript==
// @name     vrporn.com player resized to full width
// @description vrporn.com resized player to full width
// @version  3
// @grant    none
// @include  https://vrporn.com/*
// @include  https://www.vrporn.com/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/476505/vrporncom%20player%20resized%20to%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/476505/vrporncom%20player%20resized%20to%20full%20width.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  setStyles();
}, false);


window.addEventListener('visibilitychange', function() {
  setStyles();
}, false);


window.addEventListener('resize', function() {
  setStyles();
}, false);


function setStyles(){
	var video_player = document.getElementById("dl8videoplayer");
  if (video_player !== null && video_player !== undefined){
    video_player.style.width = "99vw";
    video_player.style.height = "90vh";
    video_player.style.maxHeight = "unset";

    var content = document.getElementsByClassName("content-sidebar-wrap")[0];
    content.style.position = "absolute";
    content.style.left = content.style.right = "0.5vw";
    content.style.width = "100vw";
    content.style.paddingLeft = content.style.paddingRight = "0px";

    var wr_video = document.getElementsByClassName("wr-video")[0];
    wr_video.style.height = "100vh";
    wr_video.style.width = "100vw";
  }
}
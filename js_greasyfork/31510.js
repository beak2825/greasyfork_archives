// ==UserScript==
// @name        Copy Video Links from Youtube Watch Later
// @namespace   ktaragorn
// @description Copy Video Links from Youtube Watch Later for later downloading
// @include     https://www.youtube.com/playlist?list=WL
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31510/Copy%20Video%20Links%20from%20Youtube%20Watch%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/31510/Copy%20Video%20Links%20from%20Youtube%20Watch%20Later.meta.js
// ==/UserScript==

function getUrls(){
  return JSON.stringify(Array.prototype.slice.call(document.querySelectorAll("a.ytd-playlist-video-renderer")).map(function(a){return a.href.replace(/&list=.*/g,'').replace(/&index=.*/g,'')}))
}

window.linkClick= function(){
  if(confirm("Have you revealed all videos(click show more at the bottom)??")){
    prompt("Copy to clipboard", getUrls());
    alert("Now copy these videos to another playlist, delete from WL, delete the other playlist")
  }
}

function createLink(){
  document.getElementById("title").innerHTML += '<a href="javascript:window.linkClick();">'+"Click to get all urls"+'</a>'
}

createLink();
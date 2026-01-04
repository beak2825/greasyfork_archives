// ==UserScript==
// @name         Youtube disable playlist autoplay
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Disable autoplay on Youtube when You're in any playlist.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375429/Youtube%20disable%20playlist%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/375429/Youtube%20disable%20playlist%20autoplay.meta.js
// ==/UserScript==

// youtube disable playlist autoplay
var refreshIntervalId = setInterval(function(){
  if (document.querySelector('#movie_player > div.html5-video-container > video').currentTime > document.querySelector('#movie_player > div.html5-video-container > video').duration-1){
    document.querySelector('#movie_player > div.html5-video-container > video').pause() ;
  }
} , 200);

// low load, optimized ver.
// you may want to use following code instead of the above. To use this one, just comment out following one and do comment the above one. 
// var refreshIntervalId = setInterval(function(){
//   if (document.querySelector('#movie_player > div.html5-video-container > video').currentTime > document.querySelector('#movie_player > div.html5-video-container > video').duration-2){
//     document.querySelector('#movie_player > div.html5-video-container > video').pause() ;
//   }
// } , 970);
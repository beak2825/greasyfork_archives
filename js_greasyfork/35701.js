// ==UserScript==
// 
// @name         gfycat redirect to mp4
// @namespace    gfycatmp4redirect
// @description  takes you straight to the file
// @version      0
// @author       h
// @match        http://gfycat.com/*
// @match        https://gfycat.com/*
// @grant        none
// @run-at       document-start
// 
// @downloadURL https://update.greasyfork.org/scripts/35701/gfycat%20redirect%20to%20mp4.user.js
// @updateURL https://update.greasyfork.org/scripts/35701/gfycat%20redirect%20to%20mp4.meta.js
// ==/UserScript==

if (window.location.href.indexOf("gifs/detail") > 0){
  window.location = window.location.href.replace(/gifs\/detail\//,"");
}
else{
  var mp4 = document.getElementById('mp4Source').src;
  location.assign(mp4);
}
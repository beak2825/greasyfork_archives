// ==UserScript==
// @name         9gag remove GIF/video
// @namespace    https://github.com/GitEin11
// @version      1.0
// @description  return to old 9gag, no animation just image
// @author       ein
// @match        https://9gag.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/485694/9gag%20remove%20GIFvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/485694/9gag%20remove%20GIFvideo.meta.js
// ==/UserScript==

function hide_element() {

var videoPosts = document.querySelectorAll (".video-post, .gif-post, .promoted");

for (var i = 0; i < videoPosts.length; i++) {
  var postContainer = videoPosts [i].closest ("article");
  postContainer.style.display = "none";
}
}

hide_element()
//Also rerun the code each time document change (i.e new posts are added when user scroll down)
document.addEventListener("DOMNodeInserted", hide_element);
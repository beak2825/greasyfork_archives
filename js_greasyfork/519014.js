// ==UserScript==
// @name         ThisVid arrow key navigation
// @version      1
// @namespace    _pc
// @description  Adds arrow key navigation (next page, previous page)
// @license      MIT
// @icon         https://www.thisvid.com/favicon.ico
// @grant        none
// @match	     *://thisvid.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519014/ThisVid%20arrow%20key%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/519014/ThisVid%20arrow%20key%20navigation.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", function() {
var thumbs = document.getElementById('list_videos_common_videos_list').querySelectorAll("div.thumbs-items > a")
document.getElementById('list_videos_common_videos_list').querySelectorAll(".thumbs-items").forEach(el => el.remove());
document.getElementById('list_videos_common_videos_list').querySelectorAll(".container").forEach(el => el.remove());
var headline = document.getElementById('list_videos_common_videos_list').querySelectorAll("div.headline");
headline = headline[0];
document.getElementById('list_videos_common_videos_list').querySelectorAll(".headline").forEach(el => el.remove());
var pagination = document.getElementById('list_videos_common_videos_list').querySelectorAll("div.pagination");
pagination = pagination[0];
document.getElementById('list_videos_common_videos_list').querySelectorAll(".pagination").forEach(el => el.remove());

document.getElementById('list_videos_common_videos_list').appendChild(headline);
    var newdiv = document.createElement("div");
    newdiv.classList.add("thumbs-items");
thumbs.forEach((thumb) => {
newdiv.appendChild(thumb);
});
document.getElementById('list_videos_common_videos_list').appendChild(newdiv);
document.getElementById('list_videos_common_videos_list').appendChild(pagination);
});
(function() {
  'use strict';
  document.onkeyup = e => {
    switch(e.key) {
      case 'ArrowLeft':
        document.querySelector('a:has(i[class="ico-pagination-left"])').click();
        break;
      case 'ArrowRight':
        document.querySelector('a:has(i[class="ico-pagination-right"])').click();
        break;
    }
  }
})();
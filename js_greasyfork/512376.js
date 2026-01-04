// ==UserScript==
// @name        Remove ads Twitch
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.0
// @author      Hoax017
// @license MIT
// @description Continue to view twitch stream when ad
// @downloadURL https://update.greasyfork.org/scripts/512376/Remove%20ads%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/512376/Remove%20ads%20Twitch.meta.js
// ==/UserScript==
let switched = false
function antiAdd() {
  const miniVideoparent = document.querySelector("div.picture-by-picture-player")
  const isOpen = !miniVideoparent.className.includes("picture-by-picture-player--collapsed")
  const mainVideo = document.querySelector("div.video-ref video")
  if (!isOpen) {
    if (switched) {
      mainVideo.muted = false
      switched = false
    }
    return;
  }
  const miniVideo = miniVideoparent.querySelector("video")
  // deplacer l'element mini video a coter de main video
  mainVideo.parentElement.appendChild(miniVideo)
  mainVideo.parentElement.appendChild(mainVideo.parentElement.querySelector("div"))
  // unmute mini video
  miniVideo.muted = mainVideo.muted
  mainVideo.muted = true
  switched = true
}
setInterval(antiAdd, 500)
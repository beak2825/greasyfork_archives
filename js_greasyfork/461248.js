// ==UserScript==
// @name        YouTube Shorts Like/Dislike Shortcut
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      Amaki
// @license MIT
// @description Add 2 shortcuts to quickly like or dislike a youtube shorts video with the keyboard : numpad + (like) and numpad - (dislike)
// @downloadURL https://update.greasyfork.org/scripts/461248/YouTube%20Shorts%20LikeDislike%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/461248/YouTube%20Shorts%20LikeDislike%20Shortcut.meta.js
// ==/UserScript==

document.addEventListener('keypress', logKey);

function logKey(e) {
  if (window.location.href.startsWith("https://www.youtube.com/shorts/")) {
    console.log(document.querySelector("ytd-reel-video-renderer[is-active]").querySelector('[id="like-button"]').querySelector("button"));
    if (e.keyCode == 107){
      document.querySelector("ytd-reel-video-renderer[is-active]").querySelector('[id="like-button"]').querySelector("button").click();
    }
    if (e.keycode == 109){
      document.querySelector("ytd-reel-video-renderer[is-active]").querySelector('[id="dislike-button"]').querySelector("button").click();
    }
  }
}
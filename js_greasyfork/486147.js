// ==UserScript==
// @name        MB change speed - youtube.com
// @namespace   Violentmonkey Scripts
// @match       *://m.youtube.com/*
// @match       *://youtu.be/*
// @match       *://www.youtube.com/*
// @match       *://www.youtube-nocookie.com/embed/*
// @grant       none
// @run-at      document-start
// @version     1.0
// @author      entryway
// @license MIT
// @description 10/28/2023, 10:58:07 PM
// @downloadURL https://update.greasyfork.org/scripts/486147/MB%20change%20speed%20-%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/486147/MB%20change%20speed%20-%20youtubecom.meta.js
// ==/UserScript==

(function() {
  document.addEventListener('mousedown', function(e) {
    const video = document.getElementsByClassName("video-stream html5-main-video")[0]
    if (video && e.target === video && e.button === 1) {
      video.playbackRate = {1:1.25, 1.25:1.5}[video.playbackRate] ?? 1
      const info = document.getElementsByClassName("ytp-speedmaster-user-edu")[0]
      const label = document.getElementsByClassName("ytp-speedmaster-label")[0]
      if(info && label){
        clearTimeout(timer)
        info.style.display = ''
        info.style.marginTop = '20%'
        label.innerHTML = `${video.playbackRate}x`
        var timer = setTimeout(() => {
          info.style.display = 'none'
          label.innerHTML = '2x'
        }, 500);
      }
      e.preventDefault()
    }
  });
})();

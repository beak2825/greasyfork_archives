// ==UserScript==
// @name Stop Youtube Autoplay
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/*
// @grant none
// @noframes
// @description Stops Youtube videos from autoplaying
// @version 0.0.6
// @downloadURL https://update.greasyfork.org/scripts/372780/Stop%20Youtube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/372780/Stop%20Youtube%20Autoplay.meta.js
// ==/UserScript==

function isPlayingPlaylist(){
  var params = new URLSearchParams(window.location.search);
  return params.has('list')
}

const pauseVideo = () => !isPlayingPlaylist() && document.querySelector('.html5-video-player').pauseVideo()

function stopAutoPlay(){
  const interval = setInterval(() => {
    if(!document.querySelector('video') || !document.querySelector('.html5-video-player')) return
      pauseVideo()
  }, 200)  

  document.addEventListener('mousedown', () => {
      if(interval){
        clearInterval(interval)
      }
    },
    {once: true}
  )
  document.addEventListener('keydown', e => {
      if(interval){
        clearInterval(interval)
      }
    },
    {once: true}
  )  
}

stopAutoPlay()


window.addEventListener('yt-navigate-finish', stopAutoPlay)

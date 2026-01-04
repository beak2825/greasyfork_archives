// ==UserScript==
// @name ban Youtube Autoplay
// @namespace yum
// @match https://m.youtube.com/*
// @grant none
// @noframes
// @description ban Youtube video autoplaying
// @version 0.0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436142/ban%20Youtube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/436142/ban%20Youtube%20Autoplay.meta.js
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
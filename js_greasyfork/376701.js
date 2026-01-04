// ==UserScript==
// @name Stop Youtube Autoplay (excluding playlists)
// @icon https://s.ytimg.com/yts/img/favicon_144-vfliLAfaB.png
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/*
// @exclude https://www.youtube.com/*list=*
// @description Stops Youtube videos from autoplaying, excluding playlists.
// @grant none
// @version 0.0.1
// @downloadURL https://update.greasyfork.org/scripts/376701/Stop%20Youtube%20Autoplay%20%28excluding%20playlists%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376701/Stop%20Youtube%20Autoplay%20%28excluding%20playlists%29.meta.js
// ==/UserScript==

function stopAutoplay(){
  var videoElement = document.querySelector('video')
  var playerElement = document.querySelector('.html5-video-player')
  var playerContainer = document.querySelector('#player-container .html5-video-container')
  var thumbnailOverlay = document.querySelector('#player-container .ytp-cued-thumbnail-overlay')
  var playButton = document.querySelector('#player-container .ytp-play-button')
  var hasClickedOnVideoToPlayIt = false
  if(!playerContainer || !playButton){
    return
  }
  
  playerContainer.addEventListener('click', (e) => {
    hasClickedOnVideoToPlayIt = true
  }, {once: true})
  
  thumbnailOverlay.addEventListener('click', (e) => {
    hasClickedOnVideoToPlayIt = true
  }, {once: true})
  
  playButton.addEventListener('click', (e) => {
    hasClickedOnVideoToPlayIt = true
  }, {once: true})
  
  videoElement.addEventListener('play',
    () => {
      console.log("videoElement.addEventListener('play'")
      if(!hasClickedOnVideoToPlayIt){
        playerElement.pauseVideo()
      }
    },
    {once: true}
  )
  
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'k'){
        hasClickedOnVideoToPlayIt = true
    }
  })  
  
  videoElement.addEventListener('playing',
    () => {
      console.log("videoElement.addEventListener('playing'")
      if(!hasClickedOnVideoToPlayIt){
        playerElement.pauseVideo()
      }
    },
    {once: true}
  )
  
  videoElement.addEventListener('timeupdate',
    () => {
      console.log("videoElement.addEventListener('timeupdate'")
      if(!hasClickedOnVideoToPlayIt){
        playerElement.pauseVideo()
      }
    },
    {once: true}
  )
}
window.addEventListener('spfdone', stopAutoplay)
window.addEventListener('yt-navigate-finish', stopAutoplay)

stopAutoplay()





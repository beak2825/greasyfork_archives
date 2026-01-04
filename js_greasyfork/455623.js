// ==UserScript==
// @name        youtube Quality
// @namespace   9nice
// @match       *://www.youtube.com/*
// @grant       none
// @version     2.0
// @author      9nice
// @description youtube Quality setting
// @license MadeInTaiwan
// @downloadURL https://update.greasyfork.org/scripts/455623/youtube%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/455623/youtube%20Quality.meta.js
// ==/UserScript==

let main = () => {

  //AUTO = auto
  //4320p 4k = highres ; 2880p = hd2880 ; 2160p = hd2160
  //1440p = hd1440 ; 1080p = hd1080 ; 720p = hd720
  //480p = large ; 360p = medium ;240p = small ; 144p = tiny
  let setQuality = 'hd720'

  let player = document.querySelector('#movie_player')
  let loadQuality = player.getAvailableQualityLevels()[0]

  if (loadQuality !== setQuality){
      player.setPlaybackQualityRange(setQuality)
  }
}

document.addEventListener('yt-navigate-finish', () => { if (window.location.href.includes('/watch?v=')) main() })
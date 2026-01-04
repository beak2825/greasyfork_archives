// ==UserScript==
// @name     ILIAS OpenCast Bookmarking
// @version  1.01
// @grant    none
// @include  https://ilias.studium.kit.edu/*cmd=streamVideo*
// @description Stores video progress and volume in local storage and recovers it when revisiting the video. It also saves the volume. Currently only working on KIT ILIAS.
// @namespace https://greasyfork.org/users/666678
// @downloadURL https://update.greasyfork.org/scripts/407036/ILIAS%20OpenCast%20Bookmarking.user.js
// @updateURL https://update.greasyfork.org/scripts/407036/ILIAS%20OpenCast%20Bookmarking.meta.js
// ==/UserScript==

const targetNode = document
const config = {
  childList: true,
  subtree: true
}

function get_video_key() {
  return "VIDEO_TIMESTAMP_" + document.querySelector("video > source").src.split('?')[0]
}

function get_video() {
  return document.querySelector('video')
}

function store_video_time() {
  
  let video_time = get_video().currentTime
  console.log("Storing video time", video_time)
  localStorage.setItem(get_video_key(), video_time)
}

function recover_video_time() {
  let timestamp = localStorage.getItem(get_video_key())
  if (timestamp != null) {
    console.log("Found video time in storage")
    get_video().currentTime = timestamp
  }
}

function store_video_volume() {
  console.log("Storing video volume")
  localStorage.setItem("VIDEO_VOLUME", get_video().volume)
}

function recover_video_volume() {
	let volume = localStorage.getItem("VIDEO_VOLUME")
  if (volume != null) {
    console.log("Found volume in storage", volume)
    get_video().volume = volume
  }
}

const callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type == 'childList' && mutation.target.tagName == 'VIDEO') {
      observer.disconnect()
    	
      
      let video = mutation.target
      console.log("Found video player", video)
      
      
      recover_video_time()
      
      video.addEventListener('seeked', store_video_time, true)
      video.addEventListener('pause', store_video_time, true)
      
      video.addEventListener('play', recover_video_time, true)
      video.addEventListener('play', recover_video_volume, true)
      video.addEventListener('play', () => {
        video.addEventListener('volumechange', store_video_volume, false)
        
      }, {once: true})
    }
  }
}

const observer = new MutationObserver(callback)
observer.observe(targetNode, config)

window.onbeforeunload = store_video_time
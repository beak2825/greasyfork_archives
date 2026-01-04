// ==UserScript==
// @name        Better XVideos
// @namespace   Violentmonkey Scripts
// @match       https://www.xvideos.com/video*
// @grant       none
// @version     2.4
// @author      -
// @description Always expand video to large size, scroll down to video, use Q W E S to rotate video, allow seeking to 0:00, allow clicking anywhere to start video - 2022-05-16, 19:35:39
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/453912/Better%20XVideos.user.js
// @updateURL https://update.greasyfork.org/scripts/453912/Better%20XVideos.meta.js
// ==/UserScript==

this.$ = jQuery.noConflict(true)


$("div#video-player-bg").ready(function () {
  // 
  // player = $("div#player-container")
  // $("img[title='Double player size']").trigger("click") // only if it's not enlarged already
  setTimeout(function () {
    if (window.xvideos.player.isEnlarged() === false) { // isEnlarged() is true if it's not enlarged ... well done, xvideos
      window.xvideos.player.toggleSize(1)
    }
    //$("div#video-player-bg")[0].scrollIntoView(true)
      $("#html5video").css("padding-bottom", "45%")
    
  }, 100)
})

// Somehow, the below didn't work - the button got added, but when clicking it,
// it showed the menu for the next button to the right (originally from xvideos),
// and that button showed the menu for the next one, etc.
// 
//$("button#v-actions-overflow-menu").ready(function () {
//  var rotation_buttons = `<button class="tab-button rotate-video-right"><span>Rotate video right (E)</span></button>`
//  $(rotation_buttons).insertAfter("button#v-actions-overflow-menu")
//})

video = $("div#video-player-bg video")[0]

//keyboard handler for various things
$("html").ready(function () {
  
  
  // make whole player clickable to start playing
  $("div.video-pic").click(function () { $("div.big-button.play > img").trigger("click") })
  
  // define our keyboard handler
  
  function extra_keyboard_handler(event) {
    if (83 == event.keyCode) { // s - turn upside down
      $("div.video-bg-pic > video").css("transform", "scaleX(-1) scaleY(-1)")
      event.stopImmediatePropagation() // hack to stop the event from being processed by xvideos' original handler
      return true
    }
    if (87 == event.keyCode) { // w - restore upright rotation (no rotation)
      $("div.video-bg-pic > video").css("transform", "")
      event.stopImmediatePropagation() // hack to stop the event from being processed by xvideos' original handler
      return true
    }
    if (81 == event.keyCode) { // q - rotate 90 degrees to the left - currently BROKEN - also triggers original q binding, i.e. jump 10 seconds to the left
      rotation = 270
      video = $("div.video-bg-pic > video")[0]      
      fit_scale = Math.min(video.videoWidth / video.videoHeight, video.videoHeight / video.videoWidth)
      transform = `rotate(${rotation}deg) scale(${fit_scale})`
      $("div.video-bg-pic > video").css("transform", transform)
      event.stopImmediatePropagation() // hack to stop the event from being processed by xvideos' original handler
      return true
    }
    if (69 == event.keyCode) { // e - rotate 90 degrees to the right
      rotation = 90
      video = $("div.video-bg-pic > video")[0]      
      fit_scale = Math.min(video.videoWidth / video.videoHeight, video.videoHeight / video.videoWidth)
      transform = `rotate(${rotation}deg) scale(${fit_scale})`
      $("div.video-bg-pic > video").css("transform", transform)
      event.stopImmediatePropagation() // hack to stop the event from being processed by xvideos' original handler
      return true
    }
    if (65 == event.keyCode) { // a - seek left
      if (video.currentTime < 10) {
        // allow seeking to start
        video.currentTime = 0
      }
      return true
    }
    if (37 == event.keyCode) { // left arrow - seek left
      if (video.currentTime < 10) {
        // allow seeking to start
        video.currentTime = 0
      }
      return true
    }
    return false
  }
  
  
  // attach our keyboard handler - step 1: find old keyboard handler
  
  var xv_keyboard_handler = null
  
  $.each($._data($("html")[0], "events"), function(i, event) {
    // i is the event type, like "click"
    if (i != "keydown") return
    $.each(event, function(j, h) {
      // h.handler is the function being called
      xv_keyboard_handler = h.handler
    })
  })
  
  
  // attach our keyboard handler - step 2: override keyboard handler with our pass-through
  
  $("html").off("keydown", "**") // BROKEN - currently doesn't detach the original listener
  
  $("html").keydown(function(event) {
    
    if((extra_keyboard_handler(event) === false) && (xv_keyboard_handler !== null)) {
      xv_keyboard_handler(event) // BROKEN - the original listener fires no matter what
    }
  })
})

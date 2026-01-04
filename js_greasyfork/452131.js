// ==UserScript==
// @name            2022 CR: Window Fill
// @description     Moves the video to the top of the website and resizes it to the screen size. Based off of [Chris H (Zren / Shade), Ran Cossack]'s script.
// @author          Event_Horizon
// @license MIT

// @homepageURL     https://codepen.io/Event_Horizon
// @namespace       https://codepen.io/Event_Horizon
// @version         0.2
// @include         http*://*.crunchyroll.c*/*
// @include         http*://crunchyroll.c*/*
// @run-at 					document-end
// @downloadURL https://update.greasyfork.org/scripts/452131/2022%20CR%3A%20Window%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/452131/2022%20CR%3A%20Window%20Fill.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function() {
  // create a global object to hold state
  // update the style object if any classes change
  var state={
    style:`html, body, .video-player-wrapper, .video_player{ 
width: 100%; 
height: 100%; 
}

.erc-header .header-content{
position:relative;
}`
  };
  
  // Can't use !important with javascript element.style.X so we need to inject CSS.
  function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.id = 'styles_js';
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
  }   
  
  // Generic function to test for selector and rerun any function until a variable can be set to that element
  // This will allow the script to be updated easier in the future
  function testForSelectorLoop(selector,varname,func){
    if(!document.querySelector(selector)){
      setTimeout(func,1000);
      return;
    }
    state[varname]=document.querySelector(selector);
  }
  
  // Loop where all the actual page work is done
  console.log("Resize Crunchyroll Started...");  
  function loopUntilDone(){
    console.log("Resize Crunchyroll timeout looping...");
    testForSelectorLoop('.video-player-wrapper','videoPlayerWrapper',loopUntilDone);//loop until var set
    if(!state.videoPlayerWrapper) return;
    document.body.insertBefore(state.videoPlayerWrapper, document.body.firstChild);
    state.videoPlayerWrapper.style="width:100%;height:100%;display:grid;align-items:center;";
    
    testForSelectorLoop('.video-player','videoPlayer',loopUntilDone);//loop until var set
    if(!state.videoPlayer) return;
    state.videoPlayer.style="width:100%;aspect-ratio:16/9;max-height:100vh;border:0px;";
    
    testForSelectorLoop('.video-player-placeholder','videoPlayerPlaceholder',loopUntilDone);//loop until var set
    if(!state.videoPlayerPlaceholder) return;
    state.videoPlayerWrapper.removeChild(state.videoPlayerPlaceholder);    
    
    addNewStyle(state.style);
    console.log("Resize Crunchyroll Completed.");
  }
  loopUntilDone();
})();
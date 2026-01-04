// ==UserScript==
// @name         Loop HTML5 Videos Toggle
// @namespace   StephenP
// @version      1.0
// @description  Enables loop functionality for HTML5 videos with context menu toggle
// @author      StephenP
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530766/Loop%20HTML5%20Videos%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/530766/Loop%20HTML5%20Videos%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isLoopingEnabled = false;
    GM_registerMenuCommand('▶️ Enable Loop',setLooping);
    // Variables to track the state of looping

    const videoElements = document.getElementsByTagName('VIDEO');

    function toggleVideoLoop(video) {
        if (!video.loop) {
            video.loop = true;
            video.removeEventListener('ended',vPause);
            video.addEventListener('ended',vPlay);
        } else {
            video.loop = false;
            video.removeEventListener('ended',vPlay);
            video.addEventListener('ended',vPause);
        }
    }

    // Toggle loop when clicking on videos
    function setLooping(){
      if(!isLoopingEnabled){
        GM_unregisterMenuCommand('▶️ Enable Loop')
        GM_registerMenuCommand('⏹️ Disable Loop',setLooping)
        isLoopingEnabled=true;
      }
      else{
        GM_unregisterMenuCommand('⏹️ Disable Loop')
        GM_registerMenuCommand('▶️ Enable Loop',setLooping)
        isLoopingEnabled=false;
      }
      for(let video of videoElements){
        toggleVideoLoop(video);
      }
    }

    function vPause(e){
      e.target.pause();
    }
    function vPlay(e){
      e.target.play();
    }
})();

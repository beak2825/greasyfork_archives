// ==UserScript==
// @name         Rounded Youtube
// @namespace    https://github.com/Arora-Sir
// @version      1.1
// @license      MIT
// @description  Round the Youtube watch video screen
// @author       Mohit Arora
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @icon         https://www.svgrepo.com/show/92784/youtube.svg
// @supportURL   https://github.com/Arora-Sir/Tampermonkey/issues
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/454081/Rounded%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/454081/Rounded%20Youtube.meta.js
// ==/UserScript==

function setYTRoundCorners(evt) {
  let checkForRoundYT_TimerCheck;
  function checkForRoundYT() {
    try {
      let OuterVideoPlayer = document.querySelector(".html5-video-player") ?? document.querySelector("#container.ytd-player > div");
      OuterVideoPlayer.style.borderRadius = "15px"; //Initial State
      document.addEventListener(
        "fullscreenchange",
        function () {
          if (document.fullscreenElement) {
            //console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
            OuterVideoPlayer.style.borderRadius = "0px";
          } else {
            //console.log('Leaving fullscreen mode.');
            OuterVideoPlayer.style.borderRadius = "15px";
          }
        },
        true
      );
    } catch (error) {
      //console.log("[RoundedYoutube]: " + error.message);
      return;
    }
    clearInterval(checkForRoundYT_TimerCheck);
  }
  checkForRoundYT_TimerCheck = setInterval(checkForRoundYT, 100);
}

(function () {
  "use strict";
  setYTRoundCorners();
  //RoundYT
  //window.addEventListener("yt-navigate-finish", RoundYoutube, true);

  //Old Method Limitations: (Double click listner not added, not work sometimes!)
  /*
  let OuterVideoPlayer = document.querySelector(".html5-video-player");
  let FullScreenButton = document.querySelector('[title="Full screen (f)"]');

  // Removed the code as now script run at document end
  //     if(OuterVideoPlayer!=null){
  OuterVideoPlayer.style.borderRadius = "15px";
  //     }
  //     else{
  //         while (OuterVideoPlayer.style.borderRadius != "15px"){
  //             OuterVideoPlayer.style.borderRadius = "15px";
  //         };
  //     }

  //When F is preessed or Left clicked on Full Screen Button
  document.addEventListener("keydown", ButtonOrF_Pressed, false);
  FullScreenButton.addEventListener("click", ButtonOrF_Pressed, false);

  function ButtonOrF_Pressed(f) {
      if(f.code == "KeyF" || event.button==0){
          if(OuterVideoPlayer.style.borderRadius == "0px"){
              OuterVideoPlayer.style.borderRadius = "15px";
          }
          else{
              OuterVideoPlayer.style.borderRadius = "0px"
          }
      }
  }
*/
})();

// ==UserScript==
// @name        Youtube Shorts button control
// @description  seek videos with keyboard in shorts
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/shorts/*
// @grant       none
// @version     1.0
// @run-at        document-idle
// @license     MIT
// @author      Sabbir Hossain(shasabbir234@gmail.com)
// @description 4/2/2022, 11:05:09 PM
// @downloadURL https://update.greasyfork.org/scripts/442563/Youtube%20Shorts%20button%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/442563/Youtube%20Shorts%20button%20control.meta.js
// ==/UserScript==

var timer=setInterval(()=>{
  console.log('INTERVAL');
  if(document.querySelector("#shorts-player > div.html5-video-container > video")!=null){
    
  console.log('IF');
var vid=document.querySelector("#shorts-player > div.html5-video-container > video");


vid.currentTime=vid.currentTime-2;

addEventListener("keydown", function(e) {
    switch (e.key.toUpperCase()) {

      case "ARROWLEFT":
      case "A":
        vid.currentTime=vid.currentTime-5;
        break;
      case "ARROWRIGHT":
      case "D":
        vid.currentTime=vid.currentTime+5;
        break;
      
			default:
				console.log(e.key.toUpperCase());
				break;
    }
  });
  clearInterval(timer);
  }
  },1000);
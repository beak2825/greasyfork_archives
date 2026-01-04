// ==UserScript==
// @name        Youtube Shorts keyboard control
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     3.0
// @run-at        document-idle
// @license     MIT
// @author      -
// @description 4/2/2022, 11:05:09 PM
// @downloadURL https://update.greasyfork.org/scripts/445768/Youtube%20Shorts%20keyboard%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/445768/Youtube%20Shorts%20keyboard%20control.meta.js
// ==/UserScript==


var timer=setInterval(()=>{
  console.log('INTERVAL');
  if(document.querySelector("#shorts-player > div.html5-video-container > video")!=null && document.querySelector("#shorts-player > div.html5-video-container > video").getAttribute("control")==null){

  //console.log('IF');
var vid=document.querySelector("#shorts-player > div.html5-video-container > video");

  vid.setAttribute("control",1);
//vid.currentTime=vid.currentTime-2;

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
      case "ESCAPE":
        document.querySelector("#items > ytd-guide-entry-renderer:nth-child(1)").click();
        //console.log("Exiting");
        break;

			default:
				console.log(e.key.toUpperCase());
				break;
    }
  });
  //clearInterval(timer);

}
  },1000);
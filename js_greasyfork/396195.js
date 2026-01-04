// ==UserScript==
// @name     Video zooming buttons
// @description Allows you to zoom in on YouTube videos. Useful to get rid of black borders at the top/bottom of a video if you have an ultrawide display.
// @version  1
// @grant    none
// @match    https://www.youtube.com/*
// @namespace https://greasyfork.org/users/442760
// @downloadURL https://update.greasyfork.org/scripts/396195/Video%20zooming%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/396195/Video%20zooming%20buttons.meta.js
// ==/UserScript==

function prepareButton(b)
{
  b.style.float = "right";
}

function getVideo()
{
  return document.querySelector(".html5-main-video");
}

console.log("Start waiting");

var waitInterval = setInterval(function() {
  var elemTitle = document.querySelector("yt-formatted-string.ytd-video-primary-info-renderer:nth-child(1)");

  if (!elemTitle || !getVideo()) {
    return;
  }

  clearInterval(waitInterval);
  console.log("Clear interval");
  
  var zoomSpeed = 0.0;
  var zoom = 1.0;

  setInterval(function() {
    var video = getVideo();
    if (video) {
    	zoom += zoomSpeed;
    	video.style.transform = "scale(" + zoom + ")";
    }
  }, 17);

  var newButtonIncrease = document.createElement("button");
  newButtonIncrease.innerText = "+";
  prepareButton(newButtonIncrease);

  var newButtonDecrease = document.createElement("button");
  newButtonDecrease.innerText = "-";
  prepareButton(newButtonDecrease);

  var newButtonReset = document.createElement("button");
  newButtonReset.innerText = "Reset";
  prepareButton(newButtonReset);

  newButtonIncrease.onmousedown = function() { zoomSpeed = 0.01; };
  newButtonIncrease.onmouseup = function() { zoomSpeed = 0; };

  newButtonDecrease.onmousedown = function() { zoomSpeed = -0.01; };
  newButtonDecrease.onmouseup = function() { zoomSpeed = 0; };

  newButtonReset.onclick = function() { zoom = 1.0; }

  elemTitle.appendChild(newButtonIncrease);
  elemTitle.appendChild(newButtonDecrease);
  elemTitle.appendChild(newButtonReset);
  
  console.log(elemTitle);
  console.log("Everything done");
}, 500);

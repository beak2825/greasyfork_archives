// ==UserScript==
// @name        Add Volume Control Slider
// @namespace   Violentmonkey Scripts
// @match       https://www.redgifs.com/watch/*
// @grant       none
// @version     1.0
// @author      LovingObserver
// @license     GNU GPLv3
// @icon        https://icons.duckduckgo.com/ip2/redgifs.com.ico
// @description 6/10/2024
// @downloadURL https://update.greasyfork.org/scripts/497845/Add%20Volume%20Control%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/497845/Add%20Volume%20Control%20Slider.meta.js
// ==/UserScript==

//create a MutationObserver instance to detect the video, since they are added dynamically
let observer = new MutationObserver((mutations, observer) => {
  //look through all mutations that just occured
  for(let mutation of mutations) {
    //if the addedNodes property has one or more nodes
    if(mutation.addedNodes.length) {
      let element = document.querySelector('.GifPreview_isActive');
      if(element) {
        //get the video element
        let video = document.querySelector('video');

        //set the video volume to the value stored in localStorage
        if (localStorage.getItem("videoVolume")) {
          video.volume = localStorage.getItem("videoVolume");
        } else {
          video.volume = 0.75;
        }

        //create a volume control slider
        let volumeControl = document.createElement('input');
        volumeControl.type = 'range';
        volumeControl.min = 0;
        volumeControl.max = 1;
        volumeControl.step = 0.01;
        volumeControl.value = video.volume;
        volumeControl.style.position = "absolute";
        volumeControl.style.top = "6px";
        volumeControl.style.right = "7.5px";
        volumeControl.style.zIndex = 3;
        volumeControl.style.cursor = "pointer";

        //update the video volume when the slider value changes
        volumeControl.addEventListener('input', (event) => {
          video.volume = volumeControl.value;
          localStorage.setItem("videoVolume", volumeControl.value);
        });

        //add the volume control to the page
        element.appendChild(volumeControl);

        //after the video element is found, stop observing
        observer.disconnect();
        return;
      }
    }
  }
});

//start observing the document with the configured parameters
observer.observe(document, { childList: true, subtree: true });
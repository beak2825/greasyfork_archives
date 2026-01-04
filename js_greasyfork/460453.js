

// ==UserScript==
// @name Twitter Video Keyboard Shortcuts
// @namespace https://example.com/
// @version 1.02
// @description Add keyboard shortcuts for controlling Twitter video playback
// @author Your Name
// @match https://twitter.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460453/Twitter%20Video%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/460453/Twitter%20Video%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define the keyboard shortcuts
  const shortcuts = {
    // get keycode in https://css-tricks.com/snippets/javascript/javascript-keycodes/
    97: -1/23.976024, // numpad1 move forward 0.1 seconds
    98: 1/23.976024, // numpad2 move forward 0.1 seconds
    100: -1, // numpad4
    101: 1, // numpad5
    103: "x0.2", // numpad7
    104: "x1", // numpad8
    105: "play", // numpad9
  };

  let speedIndex = 0; // keeps track of the current playback speed index
  const speeds = [0.2, 0.4, 0.6, 0.8, 1];



  // Add a keydown event listener to the document
  document.addEventListener('keydown', (event) => {

    let video = document.querySelectorAll('video');
    const mediaElement = document.querySelectorAll('video, [aria-label="GIF"]');
    if(mediaElement){
      video = mediaElement;
    }
    const hideDiv = document.querySelector('.css-1dbjc4n.r-1p0dtai.r-113qch9.r-105ug2t.r-u8s1d.r-13qz1uu.r-18phcnl');
    // If there is no video element, remove the keydown event listener
    if (video.length === 0) {
      document.removeEventListener('keydown', arguments.callee);
      return;
    }

    // Get the Twitter video element
    if (video.length>0) {

       // get the current playback time
      const shortcutValue = shortcuts[event.keyCode]; // get the playback time or speed for the current key

      if (shortcutValue !== undefined) {
        event.preventDefault(); // prevent the default behavior of the key press
        if(hideDiv){hideDiv.style.display = "none"}
         for(let i=0;i<video.length;i++){

        if (shortcutValue === "x0.2") {
          // change the playback speed
          video[i].playbackRate = speeds[speedIndex];
          video[i].play();
          display_playrate(speeds[speedIndex]);
          speedIndex = (speedIndex+1) % speeds.length;


        }else if(shortcutValue === "x1"){
          video[i].playbackRate = 1;
          video[i].play();
          speedIndex = 0
           display_playrate(1);


        }else if(shortcutValue === "play"){
          video[i].play();

          display_playrate(speeds[speedIndex]);

        }
        else {
          // change the playback time
          video[i].pause(); // pause the video
          video[i].currentTime = Math.max(0, video[i].currentTime + shortcutValue);
        }
      }}
    }

    return false;
  });
})();

function display_playrate(speed){
              // Find the playback speed element using the xpath
      const playbackSpeedElement = document.evaluate(
        '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div[1]/article/div/div/div/div[3]/div[3]/div/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div[2]/div/div/div[5]/div/div[2]/div/span',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      // Change the text content of the playback speed element
      if (playbackSpeedElement) {
        playbackSpeedElement.textContent = "x"+speed;
      }
          // Change the GIF text content.  Find the playback speed element using the xpath
const playbackSpeedElement2 = document.evaluate(
        '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div[1]/article/div/div/div/div[3]/div[3]/div/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div[2]/div/div[2]/div/div[2]/div/span',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      // Change the text content of the playback speed element
      if (playbackSpeedElement2) {
        playbackSpeedElement2.textContent = "x"+speed;
      }
}

// ==UserScript==
// @name        Coalville Public Radio Simple Volume Slider
// @description Adds a very simple volume slider to the Coalville Public Radio live listen page
// @match       *://*.coalvillepublicradio.com/listen*
// @require     https://code.jquery.com/jquery-latest.js
// @grant       none
// @version     1.2
// @author      LupusMAL
// @license     MIT
// @description 22/05/2025, 21:26:08
// @namespace   https://greasyfork.org/users/1473556
// @downloadURL https://update.greasyfork.org/scripts/536897/Coalville%20Public%20Radio%20Simple%20Volume%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/536897/Coalville%20Public%20Radio%20Simple%20Volume%20Slider.meta.js
// ==/UserScript==

$(function(){
  'use strict';

  function addVolumeSlider(playPauseButton){
    const volumeSlider = document.createElement('input'); // create new element
    volumeSlider.type = 'range';
    volumeSlider.id = 'volume-slider';
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.step = "any";
    volumeSlider.value = "100";
    volumeSlider.style = "width: 75%";

    $("[title='Play']").before(volumeSlider); // add volume slider to DOM

    $('#volume-slider').on("input", function(event){
      let evalString = "window.__playerAudio.volume = " + parseFloat(event.target.value)/100 + ";";
      window.eval(evalString); // change volume of audio
    })
  }

  function waitForElement(selector, callback){
    const interval = setInterval(() => {
      const element = $(selector);
      if (element.length > 0) {
        clearInterval(interval);
        callback(element);
      }
    }, 100); // Check every 100ms until found
  }

  waitForElement("[title='Play']", addVolumeSlider); // Need to wait for page script to create play button
});
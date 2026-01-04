// ==UserScript==
// @name         Podbean - Allow Adjusting of Podcast Speed and add Rewind/Fast forward buttons (with hotkeys)
// @version      1.2
// @description  Allows you to adjust the playback speed of podcasts by adjusting a progress bar above the play button. Also lets you use left arrow to go back 5 seconds and right arrow to go forward 5 seconds. Space bar pauses and plays. Also added rewind and fast forward buttons incase the hotkeys don't work.
// @author       Threeskimo
// @match        *://*.podbean.com/*
// @match        *://*.acast.com/*
// @match        https://www.podbean.com/media/share/dir-sqmuj-15d03575?utm_campaign=w_share_ep&utm_medium=dlink&utm_source=w_share
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podbean.com
// @grant        none
// @namespace https://greasyfork.org/users/695986
// @downloadURL https://update.greasyfork.org/scripts/456096/Podbean%20-%20Allow%20Adjusting%20of%20Podcast%20Speed%20and%20add%20RewindFast%20forward%20buttons%20%28with%20hotkeys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456096/Podbean%20-%20Allow%20Adjusting%20of%20Podcast%20Speed%20and%20add%20RewindFast%20forward%20buttons%20%28with%20hotkeys%29.meta.js
// ==/UserScript==

// Set speed var so we can continue setting audio speed after pauses
var speed = "1";

(function() {
    'use strict';

    // Create speed progress bar
    var progressBar = document.createElement('input');
    progressBar.setAttribute('type', 'range');
    progressBar.setAttribute('min', 1);
    progressBar.setAttribute('max', 2);
    progressBar.setAttribute('step', 0.25);
    progressBar.setAttribute('value', 1);
    progressBar.setAttribute('style', 'width: 100px; height: 2px');
    progressBar.style.borderRadius = '5px';

    // Create speed display div for showing the speed
    var speedDisplay = document.createElement('div');
    speedDisplay.innerHTML = "1x";
    speedDisplay.setAttribute('style', 'display: inline-block; font-size: 14px; margin-left:10px;');

    // Create rewind/fastforward div w/ buttons
    var rewindDisplay = document.createElement('div');
    rewindDisplay.innerHTML = "<button id='rewindButton'> << </button><button id='fastforwardButton'> >> </button>";
    rewindDisplay.setAttribute('style', 'display: inline-block; font-size: 10px; padding:3px;');

    // Add elements to page
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(speedDisplay, body.firstChild);
    body.insertBefore(progressBar, body.firstChild);
    body.insertBefore(rewindDisplay, body.firstChild);

    // Setup Rewind and Fast Forward buttons
    var rewindButton = document.getElementById("rewindButton");
    var fastforwardButton = document.getElementById("fastforwardButton");

    // Function to Rewind all audio on page by 5 seconds on [<<] button click
    rewindButton.addEventListener("click", function() {
        var audioElement = document.getElementsByTagName("audio");
        for (var i = 0; i < audioElement.length; i++) {
            audioElement[i].currentTime -= 5;
        }
    });

    // Function to Fast forward all audio on page by 5 seconds on [>>] button click
    fastforwardButton.addEventListener("click", function() {
        var audioElement = document.getElementsByTagName("audio");
        for (var i = 0; i < audioElement.length; i++) {
            audioElement[i].currentTime += 5;
        }
    });

    // Update audio speed and display on progress bar change
    progressBar.oninput = function() {
        var audioElements = document.getElementsByTagName('audio');
        for (var i = 0; i < audioElements.length; i++) {
            audioElements[i].playbackRate = this.value;
            speed = this.value;
        }
        speedDisplay.innerHTML = this.value + 'x';
    }

  // Add "scrolling=no" to the podcast iframe to avoid weird scrolling issues
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    iframe.setAttribute('scrolling', 'no');
    iframe.style.height = "80px";
  });

})();

// Set audio speed every 1 second incase the audio pauses. (When the audio is paused, it weirdly removes the playbackRate on the audio tag, this just "resets" it to the correct speed)
var intervalId = window.setInterval(function(){
  var audioElements = document.getElementsByTagName('audio');
        for (var i = 0; i < audioElements.length; i++) {
            audioElements[i].playbackRate = speed;
        }
}, 1000);


// Allow arrow keys to rewind and fast forward audio by 5 seconds.  Also let Spacebar pause and play audio.
document.addEventListener('keydown', (event) => {
    var progressHolder = document.querySelector(".vjs-progress-holder");
    var startHolder = document.querySelector(".vjs-play-control");
    // Check for left/right arrow key and spacebar
    if (event.key === 'ArrowLeft') {
        // Rewind audio by 5 seconds
        const audio = document.querySelector('audio');
        progressHolder.classList.add("selected");
        audio.currentTime -= 5;
    } else if (event.key === 'ArrowRight') {
        // Fast forward audio by 5 seconds
        const audio = document.querySelector('audio');
        progressHolder.classList.add("selected");
        audio.currentTime += 5;
        // Space bar starts and stops podcast
    } else if (event.key === ' ') {
        // pause or play audio
        var playButton = document.querySelector('.vjs-play-control');
        playButton.click();
    }
});

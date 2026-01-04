// ==UserScript==
// @name         Nightbot Random Next Track
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make nightbot play random tracks from the queue
// @author       DoubleJarvis
// @match        https://beta.nightbot.tv/song_requests
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/368117/Nightbot%20Random%20Next%20Track.user.js
// @updateURL https://update.greasyfork.org/scripts/368117/Nightbot%20Random%20Next%20Track.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  let shuffle = false;
  let initialized = false;

  function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
  }
  // wait until target element is on the page
  async function checkElement(selector) {
    while (document.querySelector(selector) === null) {
        await rafAsync()
    }
    return true;
  }

  checkElement('.col-lg-6.pull-right').then(() => {
    let button = createRandomButton()
    document.getElementsByClassName('col-lg-6 pull-right')[0].prepend(button)
  });

  function toggleShuffle () {
    shuffle = !shuffle
    console.log("Shuffle is now: " + shuffle)
    if (shuffle) {
      playRandomSong();
    }
  }

  function createRandomButton () {
    let button = document.createElement("button")
    button.classList.add('btn', 'btn-default')
    button.innerText = "Toggle Random"
    button.style.marginRight = '3px'
    button.onclick = function () {
      button.classList.toggle('btn-default')
      button.classList.toggle('btn-primary')
      toggleShuffle()
    }
    return button
  }

  function convertToMs (timeString) {
    let minutes, seconds, timearray;
    timearray = timeString.split(':');
    minutes = parseInt(timearray[0]);
    seconds = parseInt(timearray[1]);
    return (seconds + (minutes * 60)) * 1000
  }

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function playRandomSong () {
    // can't cache buttons because they are dynamic
    var promoteButtons = $("button[ng-click='queue.promote(item)']");
    var randomElement = Math.floor(Math.random()*promoteButtons.length);
    var nextButton = $("button[ng-click='skip()']");
    var time, targetTime;
    console.log('Choosing random element from ' + (promoteButtons.length) + ' items');
    console.log('RNGesus gave us: ' + (randomElement + 1));
    $(promoteButtons[randomElement]).trigger('click');
    sleep(3000).then(() => {
      if (!initialized) {
        nextButton.trigger('click');
        initialized = !initialized;
      }
      time = document.getElementsByClassName('table table-striped')[0].children[1].children[0].children[4].innerText;
      targetTime = convertToMs(time) - 10000;
      console.log("Gonna be sleeping for: " + targetTime)
      sleep(targetTime).then(() => {
        if (shuffle) {
          console.log("Slept fine, randoming again")
          playRandomSong();
        } else {
          console.log("Shuffle turned off, not randoming")
        }
      });
    });
  }
})();


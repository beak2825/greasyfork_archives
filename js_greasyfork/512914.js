// ==UserScript==
// @name        Reddxxx - Autoplay / Autoscroll
// @namespace   REDDXXX
// @description Autoplay videos, and autoscroll without the need to be a Premium user
// @version     1.02
// @grant       none
// @include     https://reddxxx.com/*
// @license     MIT
// @author      Mashak
// @downloadURL https://update.greasyfork.org/scripts/512914/Reddxxx%20-%20Autoplay%20%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/512914/Reddxxx%20-%20Autoplay%20%20Autoscroll.meta.js
// ==/UserScript==

(function() {
var interval = null; // Time interval automatically set, to detect new videos to observe
var scrollInterval = null; // Time interval automatically set, to autoscroll
var displayRatio = 0.2; // Play videos when 20% (default) of the player is visible (value between ]0,1]).
var scrollTimer = 10; // Time (in ms) between each 1px scroll (default to 10ms)
var scrollIncrement = 2; // Time increment (in ms) to add/subtract to the current autoscroll (default to 2ms)
var unmuteAll = false; // Unmute all the videos currently playing if set to true (default to false)
var startKey = "k"; // Bind to (re)start the script (default to "k")
var stopKey = "s"; // Bind to stop the script (default to "s")
var fasterKey = "+"; // Bind to accelerate the autoscroll (default to "+")
var slowerKey = "-"; // Bind to slowdown the autoscroll (default to "-")

// Observer used to automatically play or pause videos depending of their position in the viewport
var observer = new IntersectionObserver((entries, observer) => { 
  entries.forEach(entry => {
    var elem = entry.target;
    if(entry.intersectionRatio < displayRatio) {
      elem.pause();
    } else {
      if (elem.paused) {
        elem.setAttribute("autoplay", true);
        elem.setAttribute("loop", true);
        if (unmuteAll && elem.muted) elem.muted = false;
        elem.play();
      }
    }
  });
}, {threshold: displayRatio});

// Main script, attaching the observer to each video detected to automatically play/pause them
function startVid() {
  preventPause();
  var videosList = document.getElementsByTagName("video");
  for(var i = 0; i < videosList.length; i++) {
    var observedState = videosList[i].getAttribute("data-observe");
    if(observedState !== "true") {
      videosList[i].setAttribute("data-observe", true);
      observer.observe(videosList[i]);
    }
  }
  var slidersList = document.querySelectorAll('button[aria-label="next"]');
  for(var i = 0; i < slidersList.length; i++) {
    slidersList[i].click();
  }
}

// Used to counter the site preventing us from playing the videos
function preventPause() {
  var checkList = document.querySelectorAll('button[aria-label="play/pause"]');
  for(var i = 0; i < checkList.length; i++) {
    var startedState = checkList[i].getAttribute("data-started");
    if(startedState !== "true") {
      checkList[i].setAttribute("data-started", true);
      checkList[i].click();
    }
  }
}

// Scroll the page by 1px vertically (for smooth scrolling)
function pageScroll() {
    window.scrollBy(0,1);
}
  
// Reset the scroll interval
function resetScroll() {
  clearInterval(scrollInterval);
  scrollInterval = setInterval(pageScroll, scrollTimer);
}
  
// Keystrokes
var previousKeyStroke = null;
function keyStrokes(event) {
  if (document.activeElement.localName == "input") return;
  var ek = event.key;
  var tmpPreviousKeyStroke = previousKeyStroke;
  previousKeyStroke = ek;
  if (tmpPreviousKeyStroke == "Control") return;
  switch (ek) {
    case startKey:
      console.log("(Re)started");
      clearInterval(interval);
      interval = setInterval(startVid, 1000);
      resetScroll();
      break;
    case stopKey:
      console.log("Stopped");
      clearInterval(interval);
      clearInterval(scrollInterval);
      break;
    case fasterKey:
      scrollTimer -= scrollIncrement;
      if (scrollTimer <= 0) scrollTimer = 1;
      resetScroll();
      break;
    case slowerKey:
      scrollTimer += scrollIncrement;
			resetScroll();
      break;
    default:
  }
}
document.onkeydown = keyStrokes;

})();
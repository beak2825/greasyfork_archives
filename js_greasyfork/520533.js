// ==UserScript==
// @name        Redgifs - Autoscroll
// @namespace   REDGIFS
// @description Allow you to view the videos on Redgifs sequentially without the need to scroll yourself. Should work on all the pages with videos on them, one by one (you may need to change the view, like going in fullscreen view).
// @version     1.023
// @grant       none
// @include     https://www.redgifs.com/*
// @license     MIT
// @author      Mashak
// @downloadURL https://update.greasyfork.org/scripts/520533/Redgifs%20-%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/520533/Redgifs%20-%20Autoscroll.meta.js
// ==/UserScript==

(function() {
var switchInterval = null; // Time interval automatically set, to autoscroll
var unmuteAll = true; // Unmute all the videos currently playing if set to true (default to false)
const startKey = ":"; // Bind to (re)start the script (default to ":")
const stopKey = "s"; // Bind to stop the script (default to "s")
const prevKey = "a"; // Bind to switch to the previous video (default to "a")
const nextKey = "d"; // Bind to switch to the next video (default to "d")
const loopKey = "l"; // Bind to loop the current video (default to "l")
const centerKey = "c"; // Bind to center the view on the current video (default to "c")
const unblockKey = "u"; // Bind to unblock the script (default to "u")
var endCall = false; // Used to trigger "video ended" call only once
var init = false; // Check if the init occurred, else we do it
var currentPage = null; // Used to reset init in case of page change (useful to remove useless blocks again)
var currentGif = 0; // Used to find the next element in case the script is stuck (childNodes id)
const playerWidth = Math.floor(window.innerWidth * 0.8); // We increase the player size (80% of the size of the window by default, else you can set pixels there, e.g.: 1440)
const maxTries = 20; // If no video is found we stop the script after this amount of tries.
var currentTries = 0; // Current amount of tries
  
// Override CSS
var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'data:text/css,' +
  // Selectors start here
  '.page.wide,.page.feed,.watchFeed {width: ' + playerWidth + 'px !important;}' +
  '.previewFeed,.nicheGifList .previewFeed .GifPreview,.watchFeed {max-width: unset !important;}';
document.getElementsByTagName("HEAD")[0].appendChild(link);

// Main script - Autoscroll the page to the next video
function pageScroll() {
  if (this.currentTime > 1 || endCall == true) return;
  clearInterval(switchInterval);
  console.log("Auto scroll", this.currentTime, endCall);
  endCall = true;
  var elem = document.getElementsByClassName("isLoaded")[0];
  elem.currentTime = elem.duration;
  scrollAction(1);
  if (unmuteAll) elem.muted = false;
  switchInterval = setInterval(setupNewVid, 2000);
}

// Manual scroll the page to the next video
function manualScroll(up = false) {
  clearInterval(switchInterval);
  console.log("Manual scroll", up);
  endCall = true;
  var elem = document.getElementsByClassName("isLoaded")[0];
  up ? scrollAction(-1) : scrollAction(1);
  if (unmuteAll) elem.muted = false;
  switchInterval = setInterval(setupNewVid, 2000);
}
  
// Reset the scroll interval
function resetScroll() {
  clearInterval(switchInterval);
  elem = document.getElementsByClassName("isLoaded")[0];
  elem.removeEventListener('timeupdate', pageScroll);
  if (unmuteAll) elem.muted = false;
  switchInterval = setInterval(setupNewVid, 2000);
}

// Remove elements of a specific selector
function removeElements(selector) {
  document.querySelectorAll(selector).forEach(elem => elem.remove());
}
  
// Init the autoscroll
function initScroll() {
  if (window.location.pathname != currentPage) currentGif = 0; // Prevent reset of position on unblocking the script
  currentPage = window.location.pathname;
  
  // Removing useless blocks
  removeElements(".FeedModule");
  removeElements(".StreamateCameraDispatcher");
  
  if (document.getElementsByClassName("isLoaded").length == 0) {
    scrollAction(1, true);
    currentTries++;
    if (currentTries >= maxTries) {
      console.log("Video not found, script aborted.");
    } else {
      setTimeout(initScroll, 500);
    }
  } else {
    endCall = true;
    document.getElementsByClassName("isLoaded")[0].currentTime = 0;
    init = true;
    resetScroll();
    centerVid();
  }
}

// Setup the new video properly after the switch
function setupNewVid() {
  elem = document.getElementsByClassName("isLoaded")[0];
  elem.setAttribute("loop", false);
  elem.addEventListener('timeupdate', pageScroll, false);
  endCall = false;
  centerVid();
}

// Scrolling action (separated for easier debug)
function scrollAction(value, init = false) {
  var elem = document.getElementsByClassName('previewFeed')[0].childNodes[currentGif];
  if (value > 0) {
    elem = elem.nextElementSibling;
    currentGif++;
  } else {
    elem = elem.previousElementSibling;
    if (currentGif > 0) currentGif--;
  }
  elem.scrollIntoView({ block: "center" });
}
  
// Loop the current video
function loopVid() {
  console.log("Looping current video");
  clearInterval(switchInterval);
  elem = document.getElementsByClassName("isLoaded")[0];
  elem.setAttribute("loop", true);
  elem.removeEventListener('timeupdate', pageScroll);
}
  
// Center the video
function centerVid() {
  elem = document.getElementsByClassName("isLoaded")[0];
  elem.scrollIntoView({ block: "center" });
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
      if (window.location.pathname != currentPage) init = false;
      if (!init) {
        initScroll();
      } else {
        resetScroll();
      }
      break;
    case stopKey:
      console.log("Stopped");
      document.getElementsByClassName("isLoaded")[0].removeEventListener('timeupdate', pageScroll);
      clearInterval(switchInterval);
      break;
    case prevKey:
      manualScroll(true, true);
      break;
    case nextKey:
      manualScroll(false, true);
      break;
    case loopKey:
      loopVid();
      break;
    case centerKey:
      centerVid();
    case unblockKey:
      init = false;
      initScroll();
    default:
  }
}
document.onkeydown = keyStrokes;

})();
// ==UserScript==
// @name        A-B looper (Audio and Video)
// @namespace   Continuously replays a user-defined segment from A to B
// @match       *://*/*
// @grant       none
// @version     Alpha-v1
// @author      JesusisLord
// @description Replays a segment back and forth between two user-defined markers
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484081/A-B%20looper%20%28Audio%20and%20Video%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484081/A-B%20looper%20%28Audio%20and%20Video%29.meta.js
// ==/UserScript==
// Variables for looping functionality, initialized for clarity
let timeA = null; // Time positions for looping
let timeB = null;
let click = 0; // Counter for click-based actions
let looper_video = null; // Reference to the video element

// Helper function to check for text field focus
function isAnyTextFieldFocused() {
  const activeElement = document.activeElement;

  // Early return for null or undefined activeElement
  if (!activeElement) {
    return false;
  }

  // Optimized matching for text fields
  const tagName = activeElement.tagName.toLowerCase();
  return (
    tagName === "textarea" || // Direct check for textareas
    (tagName === "input" && activeElement.type === "text") // Text input validation
  );
}

// Function to retrieve the currently playing video
function getVideo() {
  // Directly select all videos using querySelectorAll
  const videos = document.querySelectorAll('video');

  // Check if any videos are found
  if (videos.length > 0) {
    // Find the currently playing video based on paused state
    let currentVideo = Array.from(videos).find(video => !video.paused);

    // If no video is currently playing, find the one with the highest currentTime
    if (!currentVideo) {
      currentVideo = Array.from(videos).reduce((currentVid, nextVid) => {
        return nextVid.currentTime > currentVid.currentTime ? nextVid : currentVid;
      }, videos[0]); // Start with the first video as the initial value
    }

    return currentVideo;
  } else {
    // Return null if no videos are found
    return null;
  }
}

// Initialize MutationObserver to detect video changes
const observer = new MutationObserver(() => {
  getVideo(); // Refresh video detection on changes
});
// Configure the observer to watch for changes in video elements
observer.observe(document.body, { childList: true, subtree: true });

// Core looping algorithm
function loopingAlgorithm() {
  click++;

  if (click === 1) {
    pointA(looper_video);
  } else if (click === 2) {
    pointB(looper_video);
  } else {
    // Reset click counter after the third click
    click = 0;
  }
}

// Functions for setting loop points
function pointA(vid) {
  timeA = vid.currentTime;
}

function pointB(vid) {
  timeB = vid.currentTime;
  vid.ontimeupdate = function () { gotoPointA(vid) };
}

function gotoPointA(vid) {
  if (vid.currentTime >= timeB && click == 2) {
    vid.currentTime = timeA;
  }
}

function run() {
  looper_video = getVideo();

  if (looper_video && looper_video.src) {
      loopingAlgorithm();
  }
}


// Event listener for key press
document.addEventListener("keydown", (event) => {
  if (!isAnyTextFieldFocused() && event.code === "KeyA") {
    run();
  }
});
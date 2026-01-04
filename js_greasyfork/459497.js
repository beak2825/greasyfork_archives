// ==UserScript==
// @name        Mega.nz Swipe Gestures
// @match       *://*.mega.nz/*
// @grant       none
// @version     1.1.1
// @author      NoUser
// @description Add swipe gestures to mega.nz.
// @namespace   https://greasyfork.org/en/scripts/459497-mega-nz-swipe-gestures
// @homepage    https://greasyfork.org/en/scripts/459497-mega-nz-swipe-gestures
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459497/Meganz%20Swipe%20Gestures.user.js
// @updateURL https://update.greasyfork.org/scripts/459497/Meganz%20Swipe%20Gestures.meta.js
// ==/UserScript==

// Add touch event listeners to the document
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// Variables to keep track of touch events
var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  // Check if the user has made a horizontal swipe
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    // Check if the user has swiped right
    if (xDiff > 0) {
      document.querySelector('.gallery-btn.next').click();
    }
    // Check if the user has swiped left
    else {
      document.querySelector('.gallery-btn.previous').click();
    }
  } else {
    // Check if the user has made a vertical swipe
    // Check if the user has swiped down
    // User has to swipe down at least 16 pixels for it to activate
    if (yDiff < -16) {
      document.querySelector('.v-btn.close').click();
    }
  }

  // Reset values
  xDown = null;
  yDown = null;
}
// ==UserScript==
// @name     SBA learning center - Video helper
// @description Quick and dirty: 2x speed + auto-advance to next video
// @version  1.1.1
// @include  https://learn.sba.gov/learning-center-*
// @grant    none
// @namespace https://greasyfork.org/users/720061
// @downloadURL https://update.greasyfork.org/scripts/419050/SBA%20learning%20center%20-%20Video%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/419050/SBA%20learning%20center%20-%20Video%20helper.meta.js
// ==/UserScript==

// Define our helpers
function assert(val, message) {
  if (!val) {
    throw new Error(message);
  }
}

// Define our main function
function main() {
  // Find our video element
  let videoEl = document.querySelector('video');
  
  // If there's no video element yet, check again in 500ms
  if (!videoEl) {
    setTimeout(main, 500);
   	return; 
  }
  
  // Adjust its playback speed and add an auto-next hook
  videoEl.playbackRate = 2;
  videoEl.addEventListener('ended', () => {
    console.log('Video ended, moving to next video');
    let nextArrowEl = document.querySelector('a.event-footer-button-link i.right');
    assert(nextArrowEl, 'Couldn\'t find "Next" link\'s arrow element');
    let nextEl = nextArrowEl.parentNode.parentNode;
    assert(nextEl, 'Couldn\'t find "Next" link element');
    window.location = nextEl.href;
  });
  
  // Start playing our video
  // Cannot get autoplay working, this is good enough
  // videoEl.play();
  //   var evt = document.createEvent("MouseEvents");
  //   evt.initEvent("click", true, true);
  //   document.querySelector('.video-buttons button[aria-label="play"]').click();
}

// When the page loads
window.addEventListener('DOMContentLoaded', (evt) => {
  // DEV: GreaseMonkey doesn't expose errors normally
	try {
    main();
  } catch (err) {
  	console.error(err);
		throw err;
  }
});
// ==UserScript==
// @name         Remove Facebook Video Advertisements
// @namespace    https://greasyfork.org/en/scripts/462105-remove-facebook-video-advertisements
// @version      1.0.1a
// @description  Prevents Facebook advertisements playing while watching videos on facebook.
// @author       Daile Alimo
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462105/Remove%20Facebook%20Video%20Advertisements.user.js
// @updateURL https://update.greasyfork.org/scripts/462105/Remove%20Facebook%20Video%20Advertisements.meta.js
// ==/UserScript==

// Stops advertisements playing during a video.
// Hides the video overlay, this is done because since event doesn't propagate Facebook does not know the video has stopped buffering and will show a buffering icon over the video.
window.addEventListener('play', function(event) {
   event.stopImmediatePropagation();
   event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].setAttribute('hidden', 'hidden');
   event.target.parentNode.childNodes[1].childNodes[0].childNodes[0].setAttribute('hidden', 'hidden');
   document.querySelector('[aria-label="Unmute"]').click();
   event.target.muted = false;
}, true);

// Stops advertisements playing at the end of a video.
// Makes the video overlay visible again.
window.addEventListener('ended', function(event) {
   event.stopImmediatePropagation();
   event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].removeAttribute('hidden');
   event.target.parentNode.childNodes[1].childNodes[0].childNodes[0].removeAttribute('hidden', 'hidden');
   document.querySelector('[aria-label="Unmute"]').click();
   event.target.muted = false;
}, true);
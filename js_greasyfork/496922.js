// ==UserScript==
// @name        hide twitter video controls (until hover)
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      minnieo
// @description 6/3/2024, 1:04:59 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496922/hide%20twitter%20video%20controls%20%28until%20hover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496922/hide%20twitter%20video%20controls%20%28until%20hover%29.meta.js
// ==/UserScript==



document.addEventListener("DOMContentLoaded", () => {
  const videoControls = document.querySelector('div[data-testid="videoComponent"] div.css-175oi2r.r-18u37iz.r-n7gxbd');
  videoControls.style.display = 'none';

  if (videoControls) { // Check if videoControls exists
    // Show controls when the mouse enters the area
    videoControls.addEventListener('mouseenter', () => {
      videoControls.style.display = 'block';
    });

    // Hide controls when the mouse leaves the area
    videoControls.addEventListener('mouseout', () => {
      videoControls.style.display = 'none';
    });
  } else {
    console.error('Video controls element not found.');
  }
});

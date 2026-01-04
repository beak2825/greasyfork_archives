// ==UserScript==
// @name        Mangasee123 Fast Scroll
// @namespace   http://tampermonkey.net/
// @version     0.2
// @description Simulate Option + Down arrow when I just press down arrow on mangasee123.com with smooth scrolling. 
// @author      You
// @match       https://mangasee123.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/499155/Mangasee123%20Fast%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/499155/Mangasee123%20Fast%20Scroll.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function smoothScroll(duration, distance) {
    let start = null;

    const easeInOutQuad = (t) => t<.5 ? 2*t*t : 1-((t-1)*(t-1)*2);

    requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easedProgress = easeInOutQuad(Math.min(progress / duration, 1));
      window.scrollBy(0, distance * easedProgress);
      if (easedProgress < 1) {
        requestAnimationFrame(step);
      }
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 40 && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      // Down arrow pressed without modifiers (Ctrl, Shift, Alt)
      event.preventDefault();
      smoothScroll(150, 300); // Adjust duration (ms) and scroll amount as needed
    }
  });
})();

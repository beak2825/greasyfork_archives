// ==UserScript==
// @name         ultra fps simulator
// @namespace    Violentmonkey Scripts
// @match        *://*/*
// @grant        none
// @version      1.1
// @author       moongazer07
// @license      IPFMO/∞-1
// @description  Simulates high-FPS requestAnimationFrame (~1000 FPS or more)
// @downloadURL https://update.greasyfork.org/scripts/542363/ultra%20fps%20simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/542363/ultra%20fps%20simulator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const cb = [];
  let running = true;

  // Replace requestAnimationFrame
  window.requestAnimationFrame = f => cb.push(f);

  // Run callbacks in a tight loop using MessageChannel (faster than setInterval)
  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    const now = document.timeline?.currentTime || performance.now();
    const callbacks = cb.splice(0, cb.length);
    callbacks.forEach(fn => fn(now));
    if (running) channel.port2.postMessage(null); // loop
  };
  channel.port2.postMessage(null);

})();

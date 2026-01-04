// ==UserScript==
// @name         Bloxd.io Stealth Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Undetectable flight/god mode for Bloxd.io
// @author       Anonymous
// @match        *://bloxd.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534349/Bloxdio%20Stealth%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/534349/Bloxdio%20Stealth%20Mod.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let flightEnabled = false;
  const flightSpeed = 0.5;

  // Stealthy keybind setup
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF' && e.ctrlKey) { // Ctrl+F toggles flight
      flightEnabled = !flightEnabled;
      e.preventDefault();
    }
  });

  // Wait for game objects to load
  const interval = setInterval(() => {
    if (typeof playerEntity === 'undefined') return;

    clearInterval(interval);

    // Proxy-based physics override
    const originalUpdate = playerEntity.update;
    playerEntity.update = new Proxy(originalUpdate, {
      apply: (target, thisArg, args) => {
        if (flightEnabled) {
          thisArg.velocity.y = 0;
          thisArg.position.y += flightSpeed * (keys.ArrowUp - keys.ArrowDown);
        }
        return Reflect.apply(target, thisArg, args);
      }
    });

    // God mode implementation
    playerEntity.takeDamage = () => 0;
  }, 100);
})();

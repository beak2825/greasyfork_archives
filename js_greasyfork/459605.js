// ==UserScript==
// @name         🐭️ MouseHunt - Hide Big Jaq's Big Spice Ad
// @version      1.0.0
// @description  Hides the Big Jaq banner above your journal.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459605/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Hide%20Big%20Jaq%27s%20Big%20Spice%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/459605/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Hide%20Big%20Jaq%27s%20Big%20Spice%20Ad.meta.js
// ==/UserScript==
((function () {
  'use strict';

  const addStyles = document.createElement('style');
  addStyles.innerHTML = '.campPage-campHUDBlock.MiniEventBigJackCampHUD { display: none; }';
  document.head.appendChild(addStyles);
})());

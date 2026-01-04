// ==UserScript==
// @name         🐭️ MouseHunt - Fix New Year's Button Clickable Area
// @version      1.0.0
// @description  Fixes the clickable area for the New Year's Button in the HUD.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457265/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Fix%20New%20Year%27s%20Button%20Clickable%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/457265/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Fix%20New%20Year%27s%20Button%20Clickable%20Area.meta.js
// ==/UserScript==
((function () {
  'use strict';

  const addStyles = document.createElement('style');
  addStyles.innerHTML = '.headsUpDisplayWinterHuntRegionView__newYearsButton { z-index: 10; }';
  document.head.appendChild(addStyles);
})());

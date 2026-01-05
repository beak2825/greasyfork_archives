// ==UserScript==
// @name         Shift to toggle fire for weapon
// @namespace    meatman2tasty
// @version      1.4
// @description  Shift to toggle
// @author       Meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27094/Shift%20to%20toggle%20fire%20for%20weapon.user.js
// @updateURL https://update.greasyfork.org/scripts/27094/Shift%20to%20toggle%20fire%20for%20weapon.meta.js
// ==/UserScript==

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 16) {
    incWeapon(-1);
  }
});
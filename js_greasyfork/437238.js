// ==UserScript==
// @name        Cheat for checkboxolympics.com
// @namespace   https://reddit.com/u/daviderosi
// @match       *://*.checkboxolympics.com/*
// @grant       none
// @version     1.0.1
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author      u/daviderosi
// @description A cheat for checkboxolympics.com that lets you get a time of around under 0.010 on all game modes.
// @downloadURL https://update.greasyfork.org/scripts/437238/Cheat%20for%20checkboxolympicscom.user.js
// @updateURL https://update.greasyfork.org/scripts/437238/Cheat%20for%20checkboxolympicscom.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
const epic = setInterval(() => {
  if (document.querySelector(".setGo").className.includes("going")) {
    setTimeout(() => {
      document.querySelectorAll("input:not(disabled)").forEach((el) => {
        el.click();
      });
    }, 1);
  }
}, 1);
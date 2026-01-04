// ==UserScript==
// @name        Reddit auto dark mode for newest UI
// @namespace   Violentmonkey Scripts
// @match       https://*.reddit.com/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description 2/29/2024, 5:21:54 PM
// @downloadURL https://update.greasyfork.org/scripts/488721/Reddit%20auto%20dark%20mode%20for%20newest%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/488721/Reddit%20auto%20dark%20mode%20for%20newest%20UI.meta.js
// ==/UserScript==
const syncTheme = () => {
  const modeSwitch = document.querySelector('[name=darkmode-switch-name]')
  if (!modeSwitch) return console.warn(`Dark mode switch not found on reddit.com, skipping auto dark mode...`)
  const isLightToggled = modeSwitch.getAttribute('checked') === null;
  const lightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (isLightToggled !== lightMode) modeSwitch.click();
}

addEventListener("load", () => {
  syncTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);
});

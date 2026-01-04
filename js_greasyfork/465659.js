// ==UserScript==
// @name          YouTube Shorts Spacebar Pause
// @namespace     Violentmonkey Scripts
// @version       0.0.3
// @description   Revert back the spacebar pause on YouTube Shorts
// @match         *://www.youtube.com/shorts/*
// @exclude       *://www.youtube.com/embed/*
// @compatible    firefox
// @grant         none
// @author        Nekrux
// @license       GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/465659/YouTube%20Shorts%20Spacebar%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/465659/YouTube%20Shorts%20Spacebar%20Pause.meta.js
// ==/UserScript==

var customEvent = new Event('keydown', {
  bubbles: true,
  cancelable: true,
  key: 'k',
  code: 'KeyK',
  which: 75,
});

// Aggiunge un listener all'evento keydown della barra spaziatrice
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    document.dispatchEvent(customEvent);
  }
});
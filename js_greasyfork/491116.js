// ==UserScript==
// @name Trigger debug on hotkey for any site
// @namespace K33p_Qu13t's Weird Scripts
// @match *://*/*
// @grant none
// @version 1.1
// @author K33p_Qu13t
// @license MIT
// @description Messing with hard-to-catch events again? Trigger debug at any site by pressing hotkey combination (default is for ctrl+q), then inspect anything you want!
// @downloadURL https://update.greasyfork.org/scripts/491116/Trigger%20debug%20on%20hotkey%20for%20any%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/491116/Trigger%20debug%20on%20hotkey%20for%20any%20site.meta.js
// ==/UserScript==

/** Char to trigger Debug with ctrl+char pressed*/
const hotkeyChar = 'q';

let millisecondsHolded = 0;
let holdStartTime;
let timeoutId;

const onKeyDown = (e) => {
  if (!e.repeat && e.ctrlKey && e.key === hotkeyChar) {
        clearTimeout(timeoutId);
        // Set when started to hold hotkey
        holdStartTime = Date.now();

        document.addEventListener('keyup', onKeyUp);
    }
}

const onKeyUp = () => {
  millisecondsHolded = Date.now() - holdStartTime;
  timeoutId = setTimeout(() => {
      // Stop any code flow
      debugger;
  }, millisecondsHolded);

  document.removeEventListener('keyup', onKeyUp);
}

document.addEventListener('keydown', onKeyDown);

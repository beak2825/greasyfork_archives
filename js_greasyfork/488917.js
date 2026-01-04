// ==UserScript==
// @name        YouTube Control Locker
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.0
// @description Locks and unlocks player controls on YouTube (except spacebar, J, K, L, and ESC)
// @author      drizzy
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488917/YouTube%20Control%20Locker.user.js
// @updateURL https://update.greasyfork.org/scripts/488917/YouTube%20Control%20Locker.meta.js
// ==/UserScript==

let controlsLocked = false;

function toggleControls() {
  controlsLocked = !controlsLocked;
  lockLabel.textContent = controlsLocked ? 'Locked' : 'Unlocked';
  lockLabel.style.backgroundColor = controlsLocked ? 'red' : 'green';
}

let lockLabel = document.createElement('div');
lockLabel.textContent = 'Unlocked';
lockLabel.style.position = 'absolute';
lockLabel.style.bottom = '56px';
lockLabel.style.right = '0px';
lockLabel.style.padding = '5px 10px';
lockLabel.style.backgroundColor = 'green';
lockLabel.style.color = 'white';
lockLabel.style.cursor = 'pointer';
lockLabel.style.zIndex = '9999';
lockLabel.addEventListener('click', toggleControls);
document.body.appendChild(lockLabel);

window.addEventListener('keydown', function(event) {
  if (controlsLocked &&
     ((event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105))) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);
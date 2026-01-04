// ==UserScript==
// @name         Flappy Hawk enemies remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes obstacles and centers the helicopter in the Delta Force Flappy Hawk mini game.
// @author       Honzi
// @license      MIT
// @match        https://www.playdeltaforce.com/act/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527296/Flappy%20Hawk%20enemies%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/527296/Flappy%20Hawk%20enemies%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

function removeEnemy() {
  const enemies = document.querySelectorAll("[class^='enemy-type']");
  enemies.forEach((enemy) => enemy.remove());
}

function moveHeli() {
  const heli = document.querySelector('.npc');
  heli.style.top = '555px';
}

document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('btn-start')) {
    setInterval(() => {
      removeEnemy();
      moveHeli();
    }, 500);
  }
});

console.warn('The script is running!');

})();
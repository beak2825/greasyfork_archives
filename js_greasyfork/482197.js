// ==UserScript==
// @name         Nitro Math Bot
// @namespace    Nitro Math Bot
// @version      1.0
// @description  None
// @match        https://www.nitromath.com/play
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482197/Nitro%20Math%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/482197/Nitro%20Math%20Bot.meta.js
// ==/UserScript==



(function () {
  'use strict';

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function moveMouseRandomly() {
    const body = document.body;
    const offsetX = getRandomNumber(0, body.offsetWidth);
    const offsetY = getRandomNumber(0, body.offsetHeight);

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: offsetX,
      clientY: offsetY,
    });

    body.dispatchEvent(event);
  }

  function reloadPage() {
    location.reload();
  }

  setInterval(moveMouseRandomly, 1000);
  setInterval(reloadPage, 100000);
})();
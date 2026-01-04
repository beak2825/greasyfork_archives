// ==UserScript==
// @name      interstellar
// @namespace http://tampermonkey.net/
// @version 2.3.2
// @description Bot
// @author Chill
// @match https://www.nitromath.com/play
// @match https://www.nitromath.com/login
// @match https://www.nitromath.com/garage
// @icon https://www.google.com/s2/favicons?sz=64&domain=nitromath.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/481112/interstellar.user.js
// @updateURL https://update.greasyfork.org/scripts/481112/interstellar.meta.js
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

  function pressEnterKey() {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
    });

    document.dispatchEvent(event);
  }

  setInterval(moveMouseRandomly, 1000);
  setInterval(pressEnterKey, 5000);

function clickElement() {
var targetElement = document.querySelector('#root > div.structure.structure--nitromath.structure--noAds > main > div.race.race--nitro-math.card.card--b.card--shadow.card--grit.card--f.card--o.card--sq > div > div > div.raceResults.raceResults--default > div.raceResults-footer.row.row--o.row--s.ptxxs.pbxs > div > div.g-b.g-b--3of12.race-results--cta > div > button'); 
if (targetElement) {
targetElement.click();
}
}
function clickElements() {
var targetElement = document.querySelector('body > div.modal.is-active.modal--a.modal--m > div.modal-container > div > div.modal-body.pts.pbxs > div.modal--math-problem-type-selector--content > div > div:nth-child(1) > div.math-problem-type-selector--problem-type--desc'); // Replace with your element selector
if (targetElement) {
targetElement.click();
}
}
function clickElementt() {
var targetElement = document.querySelector('#root > div.wrapper > div > main > div > section > div.row.row--xl.row--o.well--p.well--xl_p > div > div:nth-child(3) > form > button'); // Replace with element selector
if (targetElement) {
targetElement.click();
}
}
setInterval(clickElement, 1000)
setInterval(clickElements, 1000)
setInterval(clickElementt, 1000)
})();
// ==UserScript==
// @name        Dumbing of Age Comic Next Link
// @namespace   https://greasyfork.org/en/users/1378062-leon-barrett
// @description Makes the image a link to the next comic, and arrow keys control movement.
// @match       https://www.dumbingofage.com/*/comic/*
// @version     0.1
// @grant       none
// @license     unlicense
// @downloadURL https://update.greasyfork.org/scripts/511831/Dumbing%20of%20Age%20Comic%20Next%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/511831/Dumbing%20of%20Age%20Comic%20Next%20Link.meta.js
// ==/UserScript==

function getNextAndPrevious() {
  const prev = document.querySelector("a.navi-prev");
  const next = document.querySelector("a.navi-next");
  return {prev: prev, next: next};
}

var links = getNextAndPrevious();

function leftArrowPressed() {
  if (links.prev) {
    window.location = links.prev.href;
  }
}

function rightArrowPressed() {
  if (links.next) {
    window.location = links.next.href;
  }
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.keyCode) {
    case 37:
      leftArrowPressed();
      break;
    case 39:
      rightArrowPressed();
      break;
  }
};

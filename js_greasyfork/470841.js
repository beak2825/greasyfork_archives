// ==UserScript==
// @name         Useless Things Series: The Line
// @version      1.2
// @description  Adds a fading line mouse tail at the top of webpages
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/470841/Useless%20Things%20Series%3A%20The%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/470841/Useless%20Things%20Series%3A%20The%20Line.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const tail = createTail();

  document.body.appendChild(tail);

  function createTail() {
    const tailElement = document.createElement('div');
    tailElement.style.position = 'fixed';
    tailElement.style.top = '0';
    tailElement.style.left = '0';
    tailElement.style.width = '0';
    tailElement.style.height = '4px';
    tailElement.style.opacity = '1';
    tailElement.style.transition = 'width 0.3s linear, opacity 1s ease-out';
    return tailElement;
  }

  function updateTail(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    tail.style.width = mouseX + 'px';
    tail.style.opacity = '1';
  }

  function fadeOutTail() {
    tail.style.opacity = '0';
  }

  function changeColor() {
    const randomColor = getRandomColor();
    tail.style.backgroundColor = randomColor;
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function fadeInTail() {
    tail.style.opacity = '1';
    changeColor();
  }

  document.addEventListener('mousemove', updateTail);

  let timeoutId;

  document.addEventListener('mousemove', function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fadeOutTail, 2000);
  });

  document.addEventListener('mouseover', fadeInTail);

})();

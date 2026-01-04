// ==UserScript==
// @name         		Simple Dark Mode
// @description                 Simple Dark Mode for any site
// @namespace    		http://your.namespace.com
// @version      		0.01
// @author       		bunny777
// @grant        		none
// @match        		*://*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495228/Simple%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/495228/Simple%20Dark%20Mode.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const toggleButton = document.createElement('button'),
    style = document.createElement('style');

  toggleButton.innerText = 'ON';
  toggleButton.style.position = 'fixed';
  toggleButton.style.width = '30px';
  toggleButton.style.top = '5px';
  toggleButton.style.right = '5px';
  toggleButton.style.padding = '5px';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '20px';
  toggleButton.style.backgroundColor = '#000000';
  toggleButton.style.color = '#ffffff';
  toggleButton.style.fontSize = '10px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.boxShadow = '2px';
  toggleButton.style.zIndex = 9999;
  document.body.appendChild(toggleButton);

  function darkMode() {
    style.innerText = 'html,img,video,button,svg:not(button svg),canvas {filter: invert(.9);}';
    document.head.appendChild(style);
  }
  darkMode();

  document.addEventListener('DOMContentLoaded', darkMode);
  toggleButton.addEventListener('click', () => {

    if (style.innerText === 'html,img,video,button,svg:not(button svg),canvas {filter: invert(0);}') {
      style.innerText = 'html,img,video,button,svg:not(button svg),canvas {filter: invert(.9);}';
      toggleButton.innerText = 'ON';
    } else {
      style.innerText = 'html,img,video,button,svg:not(button svg),canvas {filter: invert(0);}';
      toggleButton.innerText = 'OFF';
    }
    document.head.appendChild(style);
  });
})();
// ==UserScript==
// @name         		SDM
// @version      		0.2.1
// @author       		bunny778
// @match        		*://*/*
// @exclude-match		*://*twitch.tv/*
// @description         Simple Dark Mode for any site
// @namespace    		http://your.namespace.com
// @grant        		none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497311/SDM.user.js
// @updateURL https://update.greasyfork.org/scripts/497311/SDM.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const toggleButton = document.createElement('button'),
    style = document.createElement('style'),
    sdmCss = 'html, img, video, button, svg:not(button svg), canvas {filter: invert(.9);}',
    sdmCssOff = 'html, img, video, button, svg:not(button svg), canvas {filter: invert(0);}';

  toggleButton.innerText = 'O';
  toggleButton.style.cssText = `
    position: fixed;
    z-index: 9999;
    width: 35px;
    height: 40px;
    top: 150px;
    right: -25px;
    padding: 5px;
    border: solid 1px #abb0b3;
    border-radius: 4px 0px 0px 4px;
    border-right-style: none;
    background-color: #000000;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  `;
  document.body.appendChild(toggleButton);

  toggleButton.addEventListener('mouseover', (e) => {
    e.target.style.right = '0px';
  });
  toggleButton.addEventListener('mouseout', (e) => {
    e.target.style.right = '-25px';
  });

  style.innerText = sdmCss;
  document.head.appendChild(style);

  toggleButton.addEventListener('click', () => {
    if (style.innerText === sdmCssOff) {
      style.innerText = sdmCss;
      toggleButton.innerText = 'O';
    } else {
        style.innerText = sdmCssOff;
        toggleButton.innerText = 'X';
      }
    document.head.appendChild(style);
  });
})();
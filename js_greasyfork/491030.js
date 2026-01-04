// ==UserScript==
// @name         Trimps Ultra Wide Fix
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.4
// @description  loads Trimps in an iframe that stays within 4:3 to 16:9 aspect ratio to keep the game playable on all screen/browser sizes
// @author       Alistair1231
// @match        https://trimps.github.io/
// @icon         https://icons.duckduckgo.com/ip2/github.io.ico
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491030/Trimps%20Ultra%20Wide%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/491030/Trimps%20Ultra%20Wide%20Fix.meta.js
// ==/UserScript==
// https://github.com/Alistair1231/my-userscripts/raw/master/trimpsUltraWideFix.user.js
// https://greasyfork.org/en/scripts/491030-trimps-ultra-wide-fix

(() => {
  'use strict';
  // only run CSS stuff in iframe
  if (window.self !== window.top) {
    GM.addStyle(
      `
    #noQueue {
      font-size: 1.5vw;
    }
    #foremenCount, #buildSpeed {
      font-size: 1.5vw;
    }
    `
    );

    return;
  }
  // clear page
  document.body.innerHTML = '';

  // load current page in iframe with dimensions 16:10
  const iframe = document.createElement('iframe');
  iframe.src = location.href;

  // set iframe size, to be no wider than 16:9 and no taller than 4:3
  iframe.style.height = '100vh';
  iframe.style.width = '100vw';
  iframe.style.maxWidth = '177.78vh'; // max width is 16:9 aspect ratio, i.e. 178% of height (177.78vh = 16/9 * 100vh)
  iframe.style.maxHeight = '75vw'; // max height is 4:3 aspect, i.e. 75% of width (75vw = 3/4 * 100vw)

  // center iframe horizontally and vertically
  iframe.style.position = 'absolute';
  iframe.style.top = '50%';
  iframe.style.left = '50%';
  iframe.style.transform = 'translate(-50%, -50%)';

  document.body.appendChild(iframe);

})();
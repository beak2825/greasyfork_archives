// ==UserScript==
// @name         B- Bigger chain timer
// @description  Increase the size of the chain timer
// @version      1.1
// @author       ScatterBean [3383329]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/530623/B-%20Bigger%20chain%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/530623/B-%20Bigger%20chain%20timer.meta.js
// ==/UserScript==

(() => {
  "use strict";
   const elements = document.getElementsByClassName('bar-timeleft___B9RGV')[0];
    elements.style.marginTop = '10px';
    elements.style.marginLeft = '-70px';
    elements.style.fontSize = '60px';
    elements.style.color = 'white';
   }
)();
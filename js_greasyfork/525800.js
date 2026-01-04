// ==UserScript==
// @name        green theme
// @namespace   Violentmonkey Scripts
// @match       *://scratch.mit.edu/*
// @grant       none
// @version     1.0
// @author      cake__5
// @description 2/3/2025, 4:41:38 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525800/green%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/525800/green%20theme.meta.js
// ==/UserScript==

// this userscript sets the background color to green and text color to white
const style = document.createElement('style');
    style.innerHTML = `
      * {
        background-color: #28a128 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);

// ==UserScript==
// @name         V2EX 😆
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace ❤️ with 😆 in v2ex
// @author       iyeatse
// @license      WTFPL
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454304/V2EX%20%F0%9F%98%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454304/V2EX%20%F0%9F%98%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 40px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    const likes = document.querySelectorAll('#Main .box .cell .small.fade');
    for (const like of likes) {
        const emoji = document.createElement('div');
        emoji.className = 'tooltip';
        emoji.innerHTML = '😆';

        const toolTip = document.createElement('span');
        toolTip.className = 'tooltiptext';
        toolTip.innerHTML = '+' + like.innerText.trim();

        emoji.appendChild(toolTip);
        like.parentNode.replaceChild(emoji, like);
    }
})();
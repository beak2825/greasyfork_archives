// ==UserScript==
// @name         Thicker Scrollbar for scrollmenu
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  make this shit bigger fr how am i suppose to scroll when its 1px
// @match        https://hdporncomics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdporncomics.com
// @grant        none
// @license      MIT
// @author       crunchy2382
// @downloadURL https://update.greasyfork.org/scripts/540968/Thicker%20Scrollbar%20for%20scrollmenu.user.js
// @updateURL https://update.greasyfork.org/scripts/540968/Thicker%20Scrollbar%20for%20scrollmenu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    div.scrollmenu::-webkit-scrollbar {
      height: 12px !important;
    }
  `;
  document.head.appendChild(style);
})();

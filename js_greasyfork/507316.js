// ==UserScript==
// @name         Code Fonts Better
// @namespace    http://tampermonkey.net/
// @namespace    https://www.cnblogs.com/xiaozhu0602
// @version      1.0
// @description  Change the fonts of code
// @author       typerxiaozhu
// @match        *://*/*
// @icon         https://s2.loli.net/2024/09/07/PL67zbYskErtT3q.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507316/Code%20Fonts%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/507316/Code%20Fonts%20Better.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let codeBlockStyle = document.createElement('style');
  codeBlockStyle.innerText = `code{
    font-family: 'Consolas' !important;
  }`;
  document.body.appendChild(codeBlockStyle);
})();
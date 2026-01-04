// ==UserScript==
// @name         GitHub 自动换行
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  GitHub Pre、Code自动换行
// @author       Dongyi An
// @match        https://github.com/markyun/My-blog/blob/master/Front-end-Developer-Questions/Questions-and-Answers/README.md
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402941/GitHub%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/402941/GitHub%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const css = `
        pre, code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
    `;
  const textNode = document.createTextNode(css);
  const style = document.createElement('style');

  style.appendChild(textNode);
  document.head.appendChild(style);
})();
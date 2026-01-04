// ==UserScript==
// @name         知乎公式MathJax
// @version      0.0.1
// @description  MathJax.showMathMenu
// @icon         https://static.zhihu.com/favicon.ico

// @author       You
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457038/%E7%9F%A5%E4%B9%8E%E5%85%AC%E5%BC%8FMathJax.user.js
// @updateURL https://update.greasyfork.org/scripts/457038/%E7%9F%A5%E4%B9%8E%E5%85%AC%E5%BC%8FMathJax.meta.js
// ==/UserScript==

let __MathJax;

Object.defineProperty(window, 'MathJax', {
  get() {
    return __MathJax;
  },
  set(m) {
    __MathJax = m;
    __MathJax.showMathMenu = true;
  }
});
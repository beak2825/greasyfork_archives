// ==UserScript==
// @name            AtCoder Better Font
// @name:ja         AtCoder Better Font
// @namespace       https://github.com/xe-o
// @version         0.1
// @description     Make fonts on AtCoder more readable
// @description:ja  AtCoderのフォントをより見やすくします
// @author          XERO
// @license         MIT
// @match           https://atcoder.jp/*
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/464188/AtCoder%20Better%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/464188/AtCoder%20Better%20Font.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const css = `
    body, p, a, h3, h4, h5, .h3, .h4, .h5 {
      font-family: 'Noto Sans JP', "Helvetica Neue", arial, sans-serif;
    }
    h2, .h2 {
      font-family: 'Lato', "Helvetica Neue", arial, sans-serif;
    }
    .base {
      font: bold 1.1em KaTeX_Main,Times New Roman, serif;
    }
    code, kbd, pre, samp {
      font-family: Menlo, Monaco, Consolas, Noto Sans JP, "Courier New", monospace;
    }
    code {
      color: #d53434;
      background-color: #f1efef;
    }
    #task-statement code {
      font-size: 1.2em !important;
    }
  `;

  const styleNode = document.createTextNode(css);
  document.head.insertAdjacentHTML("beforeend", "<style></style>");
  document.head.lastElementChild.appendChild(styleNode);
})();
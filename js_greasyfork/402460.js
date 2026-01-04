// ==UserScript==
// @name         MathML Polyfill
// @name:zh-CN   MathML兼容性改善
// @description  Display MathML on unsupported browser, using MathJax
// @description:zh-CN  使用MathJax在不受支持的浏览器上显示MathML内容
// @namespace    https://greasyfork.org/users/197529
// @version      1.0.0
// @author       kkocdko
// @license      Unlicense
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/402460/MathML%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/402460/MathML%20Polyfill.meta.js
// ==/UserScript==
"use strict";

if (window.MathMLElement) {
  alert(
    "You don't need this user-script because the current browsers natively support MathML."
  );
} else if (document.querySelector("math")) {
  document.head.appendChild(document.createElement("script")).src =
    "https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-chtml.js";
}

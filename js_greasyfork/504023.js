// ==UserScript==
// @name        Claude TeX Renderer
// @namespace   Violentmonkey Scripts
// @match       https://claude.ai/*
// @license MIT
// @match       https://claude.site/*
// @grant       none
// @version     1.0
// @author      KorigamiK
// @description  Render LaTeX math formulas on the page using MathJax
// @downloadURL https://update.greasyfork.org/scripts/504023/Claude%20TeX%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/504023/Claude%20TeX%20Renderer.meta.js
// ==/UserScript==
// deno-lint-ignore-file no-window no-window-prefix

(function () {
  "use strict";
  function insertMathJaxLibrary() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
    script.async = true;
    document.head.appendChild(script);
  }

  function configureMathJax() {
    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEscapes: true,
      },
      svg: {
        fontCache: "global",
      },
    };
  }

  function renderMathJax() {
    window.MathJax.typesetPromise();
  }

  function createRenderButton() {
    const button = document.createElement("button");
    button.textContent = "Render Latex";
    button.style.cssText = `
      position: fixed;
      bottom: 90px;
      left: 10px;
      padding: 10px 10px;
      background-color: rgba(255, 255, 255, 0.4);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      z-index: 9999;
`;

    button.addEventListener("mouseenter", function () {
      button.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    });
    button.addEventListener("mouseleave", function () {
      button.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
    });

    button.addEventListener("click", renderMathJax, false);

    document.body.appendChild(button);
  }

  // Main execution
  insertMathJaxLibrary();
  configureMathJax();
  createRenderButton();

  window.addEventListener("load", renderMathJax, false);
})();

// ==UserScript==
// @name         Colab: Pseudocode Arrow Assignment Operator with Fira Font (←)
// @namespace    https://greasyfork.org/users/867680
// @version      1.5
// @description  Use Fira Mono in Colab, apply Fira Code to '<-' only if %%pseudocode is at the start of a line in current code-cell 
// @author       You
// @match        https://colab.research.google.com/drive/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542951/Colab%3A%20Pseudocode%20Arrow%20Assignment%20Operator%20with%20Fira%20Font%20%28%E2%86%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542951/Colab%3A%20Pseudocode%20Arrow%20Assignment%20Operator%20with%20Fira%20Font%20%28%E2%86%90%29.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');
    @import url('https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css');

    .view-line,
    .monaco-editor .mtk {
      font-family: 'Fira Mono', monospace !important;
      font-feature-settings: "liga" on, "calt" on;
      font-variant-ligatures: none;
      font-size: 13px !important;
    }
  `);

  const patchArrowSpans = () => {
    const spans = document.querySelectorAll('.view-line span');

    for (const span of spans) {
      if (
        span.childNodes.length === 1 &&
        span.textContent === '<-'
      ) {
        const cell = span.closest('.codecell, .cell');
        if (!cell) continue;

        const viewLines = cell.querySelectorAll('.view-line');
          let hasPseudocode = false;
          for (let i = 0; i < viewLines.length; i++) {
              const lineText = viewLines[i]?.textContent?.trim();
              if (lineText !== '') {
                  hasPseudocode = lineText.startsWith('%%pseudocode');
                  if (hasPseudocode) { break; }
              }
          }

        if (hasPseudocode) {
          span.style.fontFamily = "'Fira Code', monospace";
          span.style.display = 'inline-block';
          span.dataset.arrowFixed = 'true';
        } else {
          span.style.fontFamily = "'Fira Mono', monospace";
          span.style.display = '';
          delete span.dataset.arrowFixed;
        }
      }
    }
  };

  setInterval(patchArrowSpans, 300);
})();

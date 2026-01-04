// ==UserScript==
// @name            notion-inline-math-equations
// @namespace       https://github.com/ghosw/notion-inline-math-equations
// @match           https://www.notion.so/*
// @version         0.0.2
// @description     Render Latex in notion
// @require         https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require         https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398453/notion-inline-math-equations.user.js
// @updateURL https://update.greasyfork.org/scripts/398453/notion-inline-math-equations.meta.js
// ==/UserScript==

// Acknowledgement
// This script was inspired by: https://github.com/evertheylen/notion-inline-math & https://github.com/Penguinlay/notion-inline-latex

// right-padding for inline math mode
GM_addStyle(`
.katex {
    padding-right: 0 !important;
}
`);

let timeBetweenRenders = 500;

function htmlToElement(str) {
    var template = document.createElement('template');
    str = str.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = str;
    return template.content.firstChild;
}

// render inline LaTeX
function renderInlineLaTeX() {
  activeEl = document.activeElement;
  activeEl.classList.add('do-not-render-katex-123456789');
  let el = document.getElementsByClassName("notion-page-content")[0];
  
  if (!el) {
    return;
  }

  renderMathInElement(el, {
    delimiters: [
      // LaTeX delimiters (uncomment/add as needed)
      { left: "$$" , right: "$$" , display: true  },
      // { left: "\\[", right: "\\]", display: true  },
      // { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false }
    ],
    ignoredClasses: ['do-not-render-katex-123456789']
  });
  activeEl.classList.remove('do-not-render-katex-123456789');
}

katexLink = htmlToElement('<link href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css" type="text/css" rel="stylesheet">');
document.head.appendChild(katexLink);
setInterval(renderInlineLaTeX, timeBetweenRenders);
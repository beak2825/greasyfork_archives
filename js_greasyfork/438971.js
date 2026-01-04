// ==UserScript==
// @name         Render KaTex on GitHub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Render KaTex math in GitHub MD files
// @author       Explosion-Scratch
// @match        https://github.com/*.md
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @require      https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/contrib/auto-render.min.js
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438971/Render%20KaTex%20on%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/438971/Render%20KaTex%20on%20GitHub.meta.js
// ==/UserScript==

renderMathInElement(document.body, {
    delimiters: [
  {left: "$$", right: "$$", display: true},
  {left: "$", right: "$", display: false},
  {left: "\\(", right: "\\)", display: false},
  {left: "\\begin{equation}", right: "\\end{equation}", display: true},
  {left: "\\begin{align}", right: "\\end{align}", display: true},
  {left: "\\begin{alignat}", right: "\\end{alignat}", display: true},
  {left: "\\begin{gather}", right: "\\end{gather}", display: true},
  {left: "\\begin{CD}", right: "\\end{CD}", display: true},
  {left: "\\[", right: "\\]", display: true}
]
});
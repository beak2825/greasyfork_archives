// ==UserScript==
// @name         newLISP-Documentation-Highlight
// @namespace    https://github.com/kosh04/userscript
// @version      0.20181005
// @description  Provide syntax hightlighting in newLISP documentation
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @match        http://www.newlisp.org/*/newlisp_manual.html
// @match        http://www.newlisp.org/*/CodePatterns.html
// @match        http://newlisp.nfshost.com/*/newlisp_manual.html
// @match        http://newlisp.nfshost.com/*/CodePatterns.html
// @require              http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require              http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/lisp.min.js
// @resource default.css http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css
// @resource github.css  http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css
// @resource zenburn.css http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/zenburn.min.css
// @author       KOBAYASHI Shigeru (kosh)
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/5394/newLISP-Documentation-Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/5394/newLISP-Documentation-Highlight.meta.js
// ==/UserScript==

/* global hljs */

GM_addStyle(GM_getResourceText("default.css"));
GM_addStyle(`
code {
  /* font-size: 110%; */
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
}
.arw {
  color: inherit;
}
`);

document.querySelectorAll("pre").forEach(pre => {
    const code = document.createElement("code");
    code.classList.add("lisp"); // assume lang=lisp

    // wrapInner: <pre>...</pre> => <pre><code>...</code></pre>
    code.innerHTML = pre.innerHTML;
    pre.innerHTML = code.outerHTML;
});

hljs.configure({languages:["lisp", "c", "bash"]});
hljs.initHighlighting();

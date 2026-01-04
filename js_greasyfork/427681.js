// ==UserScript==
// @name        Use MathJax on Wikipedia
// @description Inject MathJax script and hide the fallback images
// @namespace   https://greasyfork.org/en/scripts/427681-use-mathjax-on-wikipedia
// @homepage    https://greasyfork.org/en/scripts/427681-use-mathjax-on-wikipedia
// @icon        https://www.mathjax.org/favicon.ico
// @match       https://*.wikipedia.org/*
// @version     1.0
// @author      SriSyadasti
// @grant       none
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/427681/Use%20MathJax%20on%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/427681/Use%20MathJax%20on%20Wikipedia.meta.js
// ==/UserScript==

// This script is for Chrome only.
// For Firefox use this addon: https://addons.mozilla.org/en-US/firefox/addon/native-mathml/

// Style copied from: https://github.com/fred-wang/webextension-native-mathml/blob/master/content-scripts/mediawiki.css

var sty = document.createElement("style"); 
sty.textContent = `.mwe-math-mathml-a11y {
    clip: auto !important;
    overflow: visible !important;
    position: static !important;
    width: auto !important;
    height: auto !important;
    opacity: 1 !important;
    display: inherit !important;
}
.mwe-math-mathml-inline ~ .lazy-image-placeholder,
.mwe-math-mathml-display ~ .lazy-image-placeholder,
.mwe-math-mathml-inline + .mwe-math-fallback-image-inline,
.mwe-math-mathml-display + .mwe-math-fallback-image-display {
    display: none !important;
}`
document.head.appendChild(sty);

var scr = document.createElement("script"); 
scr.id = "MathJax-script";
scr.async = true;
scr.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
document.head.appendChild(scr);

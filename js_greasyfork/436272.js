// ==UserScript==
// @name         ZJ MathJax 3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use MathJax 3 for Zerojudge
// @author       LFsWang
// @match        https://zerojudge.tw/ShowProblem*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436272/ZJ%20MathJax%203.user.js
// @updateURL https://update.greasyfork.org/scripts/436272/ZJ%20MathJax%203.meta.js
// ==/UserScript==

(function() {
    'use strict';
    MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        }
    };
    var GM_JQ = document.createElement('script');
    GM_JQ.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    GM_JQ.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(GM_JQ);
})();
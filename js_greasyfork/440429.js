// ==UserScript==
// @name            Do Not Translate
// @version         0.0.1
// @description     防止浏览器翻译某些内容
// @description:en  Prevent translation of some elements
// @icon            https://ssl.gstatic.com/translate/favicon.ico

// @author          ml98
// @namespace       http://tampermonkey.net/
// @license         MIT

// @match           http://*/*
// @match           https://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/440429/Do%20Not%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/440429/Do%20Not%20Translate.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const rules = [
        /* {
            url: "regex to match url",
            selector: "selectors like tag, .class or #id"
        }, */
        {
            url: /.*/, /* for all sites */
            selector: "pre, code, .MathJax, .katex, .CodeMirror"
        }, {
            url: /https:\/\/github\.com/,
            selector: ".highlight"
        }, {
            url: /math\.stackexchange\.com/,
            selector: ".math-container"
        }, {
            url: /www\.mathworks\.com/,
            selector: ".code_responsive, .CodeBlock"
        }, {
            url: /wikipedia.org/,
            selector: "i, .monospaced, .texhtml"
        }
    ];

    rules.filter(rule => rule.url.test(document.URL)).forEach(rule => {
        setInterval(() => {
            document.querySelectorAll(rule.selector).forEach(element => {
                element.setAttribute("translate", "no");
            });
        }, 2000);
    });
})();



// ==UserScript==
// @name         Hack Font for GitHub
// @namespace    HackGitHub
// @version      1.0
// @description  Set Font Hack as monofont for GitHub
// @author       Gleb Liutsko
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436700/Hack%20Font%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/436700/Hack%20Font%20for%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cssStyle = `
    .blob-code-inner, pre code, .CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like {
        font-family: Hack;
    }`;

    let styleElement = document.createElement('style');
    styleElement.innerText = cssStyle;

    document.head.appendChild(styleElement);
})();
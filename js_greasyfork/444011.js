// ==UserScript==
// @name        Oracle Java Documentation Syntax Highlighter
// @namespace   Violentmonkey Scripts
// @match       *://docs.oracle.com/javase/tutorial/*
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @require     https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/prism-java.min.js
// @resource    prismCSS https://cdn.jsdelivr.net/npm/prismjs@1.28.0/themes/prism.min.css
// @version     1.0
// @author      tcharts-boop
// @license     MIT
// @description 4/25/2022, 11:46:18 PM
// @downloadURL https://update.greasyfork.org/scripts/444011/Oracle%20Java%20Documentation%20Syntax%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/444011/Oracle%20Java%20Documentation%20Syntax%20Highlighter.meta.js
// ==/UserScript==

/* Source Code */

const css = GM_getResourceText("prismCSS");
GM_addStyle(css);

let codeBlockClassElements = document.querySelectorAll('.codeblock');

codeBlockClassElements.forEach(e => {

    if (e.tagName !== 'PRE') {
        e = e.querySelector('pre');
    }

    codeText = e.textContent;
    e.textContent = '';

    codeElement = document.createElement('code');
    codeElement.textContent = codeText;
    codeElement.classList.add('language-java');

    e.appendChild(codeElement);
});
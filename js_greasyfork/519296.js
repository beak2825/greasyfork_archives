// ==UserScript==
// @name         Elon Musk Replacer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replaces mentions of Elon Musk with a more accurate representation 🤏🍆
// @author       Dogecoin Hash
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519296/Elon%20Musk%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/519296/Elon%20Musk%20Replacer.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';
    const targetText = /Elon Musk/gi;
    const replacement = '🤏🍆';
    
    function replaceTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(targetText, replacement);
        }
        else if (node.nodeType === Node.ELEMENT_NODE &&
                !['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'TEXTAREA', 'CODE'].includes(node.nodeName)) {
            node.childNodes.forEach(replaceTextContent);
        }
    }

    function periodicCheck() {
        replaceTextContent(document.body);
    }

    periodicCheck();
    setInterval(periodicCheck, 5000);
})();
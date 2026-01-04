// ==UserScript==
// @name         ep-bot
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  copy answer to clipboard
// @author       EP-bot
// @match        https://app.educationperfect.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532937/ep-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/532937/ep-bot.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 EP-bot

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

(function () {
    'use strict';
    let dictionary = {};
    function replaceSemicolons(text) { return text.replace(/;/g, ','); }
    function extractTextPairs() {
        const newDict = {};
        const pairs = document.querySelectorAll('.targetLanguage.question-label');
        pairs.forEach(pair => {
            const base = pair.parentElement.querySelector('.baseLanguage.question-label');
            if (base) {
                let q = replaceSemicolons(pair.textContent.trim());
                let a = replaceSemicolons(base.textContent.trim());
                if (q && a) { newDict[q] = a; newDict[a] = q; }
            }
        });
        const same = Object.keys(newDict).length === Object.keys(dictionary).length && Object.keys(newDict).every(k => dictionary[k] === newDict[k]);
        if (!same && Object.keys(newDict).length > 0) { dictionary = newDict; }
    }
    function getStartsWithHint() {
        const hintElement = document.querySelector('span[ng-if="hint"]');
        if (hintElement && hintElement.textContent.includes("starts with")) {
            const match = hintElement.textContent.match(/starts with '(\w)'/);
            return match ? match[1] : null;
        }
        return null;
    }
    function filterAnswer(answer, startsWith) {
        if (!startsWith) return answer;
        const options = answer.split(', ').filter(word => word.toLowerCase().startsWith(startsWith.toLowerCase()));
        return options.length > 0 ? options[0] : answer;
    }
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            const node = mutation.target;
            if (node && node.nodeType === Node.ELEMENT_NODE && node.id === 'question-text') {
                const originalText = node.textContent.trim();
                if (dictionary[originalText]) {
                    const answer = dictionary[originalText];
                    const startsWith = getStartsWithHint();
                    const finalAnswer = filterAnswer(answer, startsWith);
                    navigator.clipboard.writeText(finalAnswer);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    setInterval(extractTextPairs, 200);
})();
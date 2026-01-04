// ==UserScript==
// @name         DOM Text Collector with File Name
// @namespace    http://tampermonkey.net/
// @version      2024-07-22
// @description  Collect visible text from DOM, add file name, and copy to clipboard on menu command with case name input.
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.0.0-rc.7/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501483/DOM%20Text%20Collector%20with%20File%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/501483/DOM%20Text%20Collector%20with%20File%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function collectVisibleTextAsJSON(caseName) {
        let texts = [];
        function traverseNodes(node) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '' && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                let textWithoutIcons = node.nodeValue.trim().replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]/g, '');
                if (textWithoutIcons !== '') {
                    texts.push(textWithoutIcons);
                }
            }
            if (node.hasChildNodes()) {
                node.childNodes.forEach(child => {
                    if (child.nodeType !== Node.ELEMENT_NODE || (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE')) {
                        traverseNodes(child);
                    }
                });
            }
        }
        traverseNodes(document.body);
        return JSON.stringify({ "file": caseName + ".png", "text": texts.join('\n') }, null, 2);
    }

    GM_registerMenuCommand("Collect Text", function() {
        const caseName = prompt('Please enter the case name:');
        if (caseName) {
            const jsonText = collectVisibleTextAsJSON(caseName);
            GM_setClipboard(jsonText);
            alert('Text collected and copied to clipboard for case: ' + caseName);
        }
    });
})();
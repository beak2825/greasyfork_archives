// ==UserScript==
// @name         Copy ChatGPT's all replies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a Copy button to the first element with class "ml-1" on https://chat.openai.com to copy content of all elements with class "prose" with basic formatting.
// @author       You
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464892/Copy%20ChatGPT%27s%20all%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/464892/Copy%20ChatGPT%27s%20all%20replies.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getFormattedText(element) {
        let result = '';
        for (const child of element.childNodes) {
            switch (child.nodeType) {
                case Node.TEXT_NODE:
                    result += child.textContent;
                    break;
                case Node.ELEMENT_NODE:
                    switch (child.tagName) {
                        case 'BR':
                            result += '\n';
                            break;
                        case 'P':
                            result += getFormattedText(child) + '\n\n';
                            break;
                        case 'OL':
                        case 'UL':
                            const items = child.querySelectorAll('li');
                            if (child.tagName === 'OL') {
                                items.forEach((item, index) => {
                                    result += `${index + 1}. ${getFormattedText(item)}\n`;
                                });
                            } else {
                                items.forEach(item => {
                                    result += `- ${getFormattedText(item)}\n`;
                                });
                            }
                            result += '\n';
                            break;
                        default:
                            result += getFormattedText(child);
                    }
            }
        }
        return result;
    }
    function addCopyButton() {
        const ml1Element = document.querySelector('.ml-1');
        if (!ml1Element) return;
        const copyButton = document.createElement('button');
        copyButton.className = 'btn relative btn-neutral border-0 md:border';
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => {
            const proseElements = document.querySelectorAll('.prose');
            let formattedText = '';
            for (const proseElement of proseElements) {
                formattedText += getFormattedText(proseElement);
            }
            navigator.clipboard.writeText(formattedText).then(() => {
                console.log('Prose content copied to clipboard with basic formatting.');
            }).catch(err => {
                console.error('Error copying prose content to clipboard:', err);
            });
        });
        ml1Element.appendChild(copyButton);
    }
    window.addEventListener('load', () => {
        setTimeout(addCopyButton, 1000);
    });
})();
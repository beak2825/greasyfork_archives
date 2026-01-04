// ==UserScript==
// @name         SAP AI Playground | Copy Pre Content Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a copy button to copy the content of the specified pre element
// @author       ChatGPT, tddschn
// @match        https://ai-playground.cfapps.sap.hana.ondemand.com/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464127/SAP%20AI%20Playground%20%7C%20Copy%20Pre%20Content%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/464127/SAP%20AI%20Playground%20%7C%20Copy%20Pre%20Content%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processChildNodes(element) {
        let textContent = '';

        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                textContent += child.textContent;
            } else if (child.tagName === 'BR') {
                textContent += '\n';
            }
        }

        return textContent;
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function addButton() {
        const preElement = document.querySelector('body > div > div:nth-child(2) > div:nth-child(2) > pre');
        if (preElement) {
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.style.position = 'absolute';
            copyButton.style.zIndex = 1000;
            copyButton.addEventListener('click', () => {
                const preContent = processChildNodes(preElement);
                copyToClipboard(preContent);
            });

            preElement.parentElement.insertBefore(copyButton, preElement);
        }
    }

    addButton();
})();

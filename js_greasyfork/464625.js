// ==UserScript==
// @name         Split Text Content into Textareas for use in ChatGPT
// @namespace    http://summarizebooks.sbs/
// @version      1.0
// @description  Split text content of a webpage into parts, each containing 10 sentences, and place each part inside a textarea with a Copy button.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464625/Split%20Text%20Content%20into%20Textareas%20for%20use%20in%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/464625/Split%20Text%20Content%20into%20Textareas%20for%20use%20in%20ChatGPT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const splitButtonStyle = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        width: 24px;
        height: 24px;
        background-color: transparent;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    `;

    const textareaStyle = `
        width: 500px;
        height: 200px;
        margin: 10px 0;
        resize: vertical;
    `;

    const copyButtonStyle = `
        display: block;
        width: 100px;
        padding: 5px 0;
        margin: 20px;
        background-color: #4CAF50;
        color: white;
        text-align: center;
        cursor: pointer;
        border: none;
        border-radius: 5px;
    `;

    const splitTextContent = () => {
        const sentences = document.body.innerText.match(/[^.!?。！？]+[.!?。！？]+/g) || [];
        const chunks = [];
        let chunk = '';
        let chunkLength = 0;
    
        sentences.forEach((sentence) => {
            const trimmedSentence = sentence.trim();
            chunk += ' ' + trimmedSentence;
            chunkLength += trimmedSentence.length;
    
            if (chunkLength > 1000) {
                chunks.push(chunk);
                chunk = '';
                chunkLength = 0;
            }
        });
    
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        document.body.innerHTML = chunks.map(chunk => {
            return `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <textarea style="${textareaStyle}">${chunk}</textarea>
                    <span>Characters: ${chunk.length}</span>
                </div>
            `;
        }).join('\n');

        chunks.forEach((chunk, index) => {
            const escapedChunk = encodeURIComponent(chunk);
            const copyButton = document.createElement('button');
            copyButton.style.cssText = copyButtonStyle;
            copyButton.innerText = 'Copy';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(decodeURIComponent(escapedChunk));
                copyButton.style.backgroundColor = '#3f51b5';
            });

            const textarea = document.querySelectorAll('textarea')[index];
            const charCounter = document.querySelectorAll('span')[index];

            textarea.addEventListener('input', () => {
                charCounter.textContent = `Characters: ${textarea.value.length}`;
            });

            document.querySelectorAll('div')[index].appendChild(copyButton);
        });
    };




    const createSplitButton = () => {
        const splitButton = document.createElement('button');
        splitButton.innerText = '✂️';
        splitButton.style.cssText = splitButtonStyle;
        splitButton.addEventListener('click', splitTextContent);
        return splitButton;
    };

    const splitButton = createSplitButton();
    document.body.appendChild(splitButton);

    document.querySelector('body.notion-body').style.overflow = 'auto';
})();
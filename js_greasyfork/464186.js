// ==UserScript==
// @name         Click ChatGPT Last Sentence to Continue
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  To continue the last response with one click.
// @author       CY Fung
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/464186/Click%20ChatGPT%20Last%20Sentence%20to%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/464186/Click%20ChatGPT%20Last%20Sentence%20to%20Continue.meta.js
// ==/UserScript==

'use strict';
(function () {
    'use strict';

    let allLen = 0;
    let cid1 = 0;

    function lastOfArr(elements) {
        return elements && elements.length >= 1 ? elements[elements.length - 1] : null;
    }

    function addStyleText(t) {
        let s = document.createElement('style');
        s.textContent = t;
        document.head.appendChild(s);
        return s;
    }

    function getSelectableRows(element) {
        let childNodes = [];
        let nodeA = element.firstChild;
        while (nodeA instanceof Node) {
            let node = nodeA;
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'P') {
                    //
                } else if (node.tagName === 'OL' || node.tagName === 'UL') {
                    node = lastOfArr(node.querySelectorAll('li'));
                } else if (node.tagName === 'PRE') {
                    node = lastOfArr(node.querySelectorAll('code'));
                } else {
                    node = null;
                }
                if (node) {
                    let textContent = node.textContent;
                    if (textContent.length >= 1 && textContent.trim().length >= 1) {
                        childNodes.push(node);
                    }
                }
            }
            nodeA = nodeA.nextSibling;
        }
        return childNodes;
    }

    let previousRow = null;

    const cssStyle = `
    .last-row-message.message-stopped:hover{
      background: rgba(125,125,125,0.25);
      cursor:pointer;
    }
    `;

    async function setTextAreaMessage(textarea, message) {
        textarea.focus();
        await new Promise(window.requestAnimationFrame);
        textarea.value = '';
        if (message) {
            await new Promise(window.requestAnimationFrame);
            textarea.value = message;
        }
        await new Promise(window.requestAnimationFrame);
        try {
            document.execCommand("insertText", false, " ")
        } catch (e) { }
    }

    function getRandomElement(array) {
        let randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    function preMultilineTextProcess(text) {
        let lines = text.split('\n');
        for(let i =lines.length-1; i>=0; i--){
            let noSymbolLine = lines[i].replace(/[\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F\x80-\xFF]+/g,'').trim();
            // exclude symbols
            // remains number, english letters, chinese, ....
            if(noSymbolLine.length>0){
                let foundAt = i;
                text = lines.slice(foundAt).join('\n').trim();
                return text;
            }
        }
        return text;
    }

    function howToSay(s) {
        if (!s) return null;
        s = s.trim().replace(/(\r\n|\n\r|\r)/g,'\n');
        s = preMultilineTextProcess(s);
        let sk = 0;
        if (s.includes('\n')) sk = 3;
        else if (s.includes('```') || s.includes('`')) sk = 3;
        else if (s.includes('\"')) sk = 2;
        else sk = 1;

        if (sk == 3) {
            s = '```\n' + s.replace(/\`\`\`/g, '\n\n') + '\n```';
        } else if (sk == 2) {
            s = '`' + s + '`';
        } else if (sk == 1) {
            s = '"' + s + '"';
        }
        let arr = [
            // `Your last response stopped at ${s}. Please continue.`,
            `Please continue on your last response which stopped at ${s}.`,
            `Continue on your last response from ${s}.`,
            `Please resume your last response which paused at ${s}.`,
            `Resume your last response from ${s}.`,

            // `Your previous response stopped at ${s}. Please continue.`,
            `Please continue on your previous response which stopped at ${s}.`,
            `Continue on your previous response from ${s}.`,
            `Please resume your previous response which paused at ${s}.`,
            `Resume your previous response from ${s}.`,
        ];
        return getRandomElement(arr);
    }


    function howToSayCode() {
        let arr = [
            `Please continue the coding with the last incomplete line that you left off in your last response.`,
            `Please continue the coding with the last incomplete line that you left off in your previous response.`,
            `Please continue the coding with the last incomplete line that you abruptly ended in your last response.`,
            `Please continue the coding with the last incomplete line that you abruptly ended in your previous response.`
        ];
        return getRandomElement(arr);
    }

    function clickLastRowMessageHandler(evt) {
        if (!evt || !evt.target) return;
        let target = evt.target.closest('.last-row-message.message-stopped');
        if (!target) return;
        let p = target;
        let textarea = null;
        while (p = p.parentNode) {
            if (textarea = p.querySelector('textarea[placeholder]')) break;
        }
        if (textarea !== null) {
            evt.preventDefault();
            let display = '';
            if (target.closest('code')) {
                display = howToSayCode();
            } else {
                display = howToSay(target.textContent);
            }
            setTextAreaMessage(textarea, display);
        }
    }

    let newMessageFoundResult = null;

    const newMessageFoundTFunc = () => {
        let message = newMessageFoundResult;
        if(message && message.isConnected === false){
            newMessageFoundResult = null;
            clearCid1(); // removed
            allLen = 0;
            checkNewMessage();
            return;
        }
        if (message === null) return;
        let selectableRows = getSelectableRows(message);
        let lastRow = selectableRows[selectableRows.length - 1] || null;
        if(lastRow === null && message.lastChild instanceof Text){
            // this could happen when GPT's response is purely a text without formatting. (Least Chance)
            lastRow = message;
        }

        if (lastRow !== previousRow && lastRow) {
            let mRow = previousRow;
            previousRow = lastRow;
            if (mRow !== null) {
                mRow.classList.remove('last-row-message', 'message-stopped', 'message-checking');
                mRow.removeAttribute('title');
                mRow.removeEventListener('click', clickLastRowMessageHandler, false);
            }
            lastRow.classList.add('last-row-message', 'message-checking');
            lastRow.removeAttribute('title');
            lastRow.classList.remove('message-stopped');

            lastRow.addEventListener('click', clickLastRowMessageHandler, false);
            if (mRow === null) {
                let lastRowCss= document.querySelector('#last-row-css');
                if(lastRowCss === null){
                    let style = addStyleText(cssStyle);
                    style.id = 'last-row-css'
                }
            }
            rowText = '';
        }
    };

    function clearCid1(){
        if (cid1 > 0) clearInterval(cid1);
        cid1 = 0;
    }

    function newMessageFound(message) {
        clearCid1();
        if (!message) return;
        newMessageFoundResult = message;
        cid1 = setInterval(newMessageFoundTFunc, 100);
    }

    let counter = 0;
    let rowText = '';
    let di = 0;
    let lastStreamState = false; // as there are some bugs for the detection, reset once result-streaming is flipped.

    function checkNewMessage() {
        let all = document.querySelectorAll('div.markdown.prose:not(:empty)');
        let cLen = all.length;
        if (cLen !== allLen) {
            allLen = cLen;
            if (allLen >= 1) newMessageFound(all[all.length - 1]);
        }
    }

    function reset() {
        previousRow = null;
        rowText = '';
        counter = 0;
    }

    setInterval(() => { // 30ms
        let oldLastStreamState = lastStreamState;
        let newLastStreamState = false;
        
        di++;
        if ((di % 10) === 0) { // 300ms
            if (di > 900) di = 0;
            checkNewMessage();
        }

        if (previousRow !== null && previousRow.isConnected === false) {
            previousRow = null;
        }

        if (previousRow !== null) {
            if (previousRow.closest('.result-streaming')) {
                newLastStreamState = true;
            } else {
                let text = previousRow.textContent;
                if (rowText !== text) {
                    let mText = rowText;
                    rowText = text;
                    counter = 0;
                    let k = 3;
                    let g = mText.length - k;
                    if (g > 0 && text.length > mText.length && text.substring(0, g) === mText.substring(0, g) && previousRow.classList.contains('message-checking')) {
                        previousRow.classList.remove('message-checking');
                    }
                }
                if (counter < 96) counter++;
                if (counter === 20) {
                    previousRow.classList.add('message-stopped');
                    previousRow.classList.remove('message-checking');

                    previousRow.setAttribute('title', 'click to ask continue');
                }
            }
        }

        if (oldLastStreamState !== newLastStreamState) {
            lastStreamState = newLastStreamState;
            reset();
        }

    }, 30);

    // Your code here...
})();
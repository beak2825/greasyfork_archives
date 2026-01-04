// ==UserScript==
// @name         ChatGPT Text File Scaler
// @version      1.8
// @author       refracta
// @description  ChatGPT utility to cut and transfer text files
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/462212/ChatGPT%20Text%20File%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/462212/ChatGPT%20Text%20File%20Scaler.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    function insertAfter(referenceNode, newNode) {
        if (!!referenceNode.nextSibling) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        } else {
            referenceNode.parentNode.appendChild(newNode);
        }
    }

    function waitFor(valueFunction, inspectPeriod = 100) {
        return new Promise(resolve => {
            let interval = setInterval(async _ => {
                try {
                    let value = valueFunction();
                    value = value instanceof Promise ? await value : value;
                    if (value) {
                        clearInterval(interval);
                        resolve(value);
                    }
                } catch (e) {}
            }, inspectPeriod);
        });
    }

    function writeMessage(text) {
        let textarea = document.querySelector('textarea');
        textarea.value = text;

        let event = new Event('input', {
            bubbles: true
        });
        textarea.dispatchEvent(event);
    }

    async function clickSendButton() {
        do {
            document.querySelector('button.absolute').disabled = false;
            let clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent("click", true, true);
            document.querySelector('button.absolute').dispatchEvent(clickEvent);
            if (document.querySelector('textarea')?.value === '') {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));

        } while (true);
    }

    async function waitResponse() {
        await waitFor(_ => document.querySelector('button.absolute.p-1 > span > svg'));
    }

    async function sendMessage(text) {
        writeMessage(text);
        clickSendButton();
        await waitResponse();
    }

    function clearMessages(messageLimit) {
        let messages = Array.from(document.querySelectorAll('.flex-1.overflow-hidden > div > div > div > div:nth-child(1) > div'));
        while (messages.length > messageLimit) {
            messages.shift().remove();
        }
    }

    function updateLoadTextFileSpan() {
        let loadTextFileSpan = document.querySelector('#load-text-file');
        if (loadTextFileSpan) {
            loadTextFileSpan.textContent = `Load text file (${localStorage.buffer.length})`;
        }
    }

    async function sendTextFile() {
        const firstMessage = 'I am going to provide you a book in multiple messages.';
        const insertMessage = 'Here is the next page, please do not respond aside from confirmation:\n\n';
        const splitLength = 2000;
        const messageLimit = 30;

        await sendMessage(firstMessage);
        while (localStorage.buffer.length > 0) {
            let length = splitLength - insertMessage.length;
            let text = localStorage.buffer.slice(0, length);
            await sendMessage(insertMessage + text);
            localStorage.buffer = localStorage.buffer.slice(length);
            updateLoadTextFileSpan();
            clearMessages(messageLimit);
        }
    }

    function getText() {
        return new Promise(resolve => {
            let input = document.createElement("input");
            input.type = "file";
            input.accept = "text/plain";
            input.onchange = (event) => {
                let file = event.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    localStorage.buffer = localStorage.buffer ? localStorage.buffer : '';

    let isUIProcessing = false;
    setInterval(async _ => {
        if (!document.querySelector('#load-text-file') && !isUIProcessing) {
            try {
                isUIProcessing = true;

                let bottomMenu = document.querySelector('div > nav > div.border-t.border-white\\/20.pt-2');

                let sendTextFileButton = createElement(`<a href="#" class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>Send text file</a>`);
                sendTextFileButton.addEventListener('click', sendTextFile);
                bottomMenu.prepend(sendTextFileButton);

                let loadTextFileButton = createElement(`<a href="#" class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg><span id="load-text-file">Load text file  (${localStorage.buffer.length})</span></a>`);
                loadTextFileButton.addEventListener('mousedown', async(event) => {
                    localStorage.buffer = event.button === 0 ? await getText() : await navigator.clipboard.readText();
                    updateLoadTextFileSpan();
                });

                loadTextFileButton.addEventListener('contextmenu', event => {
                    event.preventDefault();
                    event.stopPropagation();
                });
                bottomMenu.prepend(loadTextFileButton);
            } catch (e) {}
            finally {
                isUIProcessing = false;
            }
        }
    }, 100);

})();
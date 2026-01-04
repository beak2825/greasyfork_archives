// ==UserScript==
// @name         ChatGPT One-Click Search
// @name         ChatGPT 一键搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This user script allows you to search selected text with OpenAI's ChatGPT in just one click. Simply select text on any webpage and press Ctrl+Enter to open a new tab with ChatGPT, automatically inputting the selected text as a query.
// @description  一键使用 OpenAI 的 ChatGPT 搜索选定的文本。只需在任意网页上选择文本，按下 Ctrl+Enter，即可在新标签页中打开 ChatGPT，并自动将所选文本作为查询输入。
// @author       lele123a
// @match        *://*/*
// @license      MIT
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/462470/ChatGPT%20One-Click%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/462470/ChatGPT%20One-Click%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const openChatGPTWithQuery = (query) => {
        //想用其他模型就改这一行 ↓↓↓↓↓↓
        const url = `https://chat.openai.com/chat?model=text-davinci-002-render-sha`;
        //↑↑↑↑↑
        const encodedQuery = encodeURIComponent(query);
        const newTab = GM_openInTab(`${url}#q=${encodedQuery}`, { active: true });
    };

    const searchWithChatGPT = () => {
        const selectedText = window.getSelection().toString().trim();

        if (selectedText) {
            openChatGPTWithQuery(selectedText);
        }
    };

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            searchWithChatGPT();
        }
    });

    const inputToChatGPT = (query) => {
        const inputSelector = 'textarea[data-id="root"]';
        const sendButtonSelector = 'button[class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2"]';

        const inputElement = document.querySelector(inputSelector);
        const sendButton = document.querySelector(sendButtonSelector);

        if (inputElement && sendButton) {
            inputElement.value = query;

            // Create an event to trigger the related events of the input box after setting the value
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);

            // Click the send button
            sendButton.click();
        } else {
            console.error('Input element or send button not found');
        }
    };

    const checkIfChatGPTPageAndInput = () => {
        if (location.hostname === 'chat.openai.com' && location.pathname === '/chat' && decodeURIComponent(location.hash.substring(3)) != '') {
            const query = decodeURIComponent(location.hash.substring(3));

            if (query !== '') {
                setTimeout(() => {
                    inputToChatGPT(query);
                }, 3000);
            }
        }
    };

    checkIfChatGPTPageAndInput();
})();
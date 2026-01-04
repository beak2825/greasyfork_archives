// ==UserScript==
// @name         ChatGPT 对话问题导航
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在ChatGPT页面添加一个对话导航目录，并为每个项添加序号，加入可控制显示/隐藏的按钮，默认状态为显示
// @author       Angury
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495341/ChatGPT%20%E5%AF%B9%E8%AF%9D%E9%97%AE%E9%A2%98%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/495341/ChatGPT%20%E5%AF%B9%E8%AF%9D%E9%97%AE%E9%A2%98%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tocContainer = document.createElement('div');
    tocContainer.id = 'tocContainer';
    tocContainer.style.cssText = 'position: fixed; right: 0; top: 50px; width: 200px; height: 80vh; overflow-y: auto; background-color: #fff; border: 1px solid #ccc; padding: 10px; z-index: 1000; display: block;';

    const toggleButton = document.createElement('div');
    toggleButton.innerHTML = '&#9654;'; // Unicode character for rightward triangle, indicating the menu is open
    toggleButton.style.cssText = 'position: fixed; right: 0; top: 30px; width: 30px; height: 20px; padding: 5px; text-align: center; cursor: pointer; z-index: 1001; background-color: transparent; border: none;';

    document.body.appendChild(toggleButton);
    document.body.appendChild(tocContainer);

    toggleButton.onclick = function() {
        tocContainer.style.display = tocContainer.style.display === 'block' ? 'none' : 'block';
        toggleButton.innerHTML = tocContainer.style.display === 'none' ? '&#9664;' : '&#9654;';
    };

    function updateTOC() {
        const messages = document.querySelectorAll('div[data-message-author-role="user"]');
        if (messages.length === tocContainer.childNodes.length) {
            return; // Skip update if the count of messages hasn't changed
        }

        tocContainer.innerHTML = ''; // Clear previous entries

        messages.forEach((message, index) => {
            const lastDiv = message.querySelector('div:last-child div:last-child');
            if (!lastDiv) return; // Skip if no div found

            const questionId = `question-${index}`;
            lastDiv.id = questionId;

            let questionText = lastDiv.textContent.trim() || `......`;
            questionText = questionText.length > 9 ? `${questionText.substring(0, 8)}...` : questionText;
            let formattedIndex = ("0" + (index + 1)).slice(-2);  // Two-digit numbering

            const tocItem = document.createElement('div');
            tocItem.textContent = `${formattedIndex} ${questionText}`;
            tocItem.style.cssText = 'cursor: pointer; margin-bottom: 5px;';
            tocItem.onclick = function() {
                document.getElementById(questionId).scrollIntoView({ behavior: 'smooth' });
            };

            tocContainer.appendChild(tocItem);
        });
    }

    // Use MutationObserver to listen for changes in the DOM
    const observer = new MutationObserver(mutations => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) shouldUpdate = true;
        });
        if (shouldUpdate) updateTOC();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    updateTOC();  // Initial update
})();

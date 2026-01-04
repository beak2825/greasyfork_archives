// ==UserScript==
// @name         ChatGPT Hide Highlight Button
// @namespace    https://github.com/MinhThanh03
// @version      1.2
// @description  Hide the highlight "Ask ChatGPT" button shown when you select text on ChatGPT web.
// @author       MinhThanh03
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543045/ChatGPT%20Hide%20Highlight%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/543045/ChatGPT%20Hide%20Highlight%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAskChatGPTButton() {
        try {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent && btn.textContent.includes('Ask ChatGPT')) {
                    btn.style.display = 'none';
                }
            });
        } catch (err) {
            console.error('Error hiding Ask ChatGPT button:', err);
        }
    }

    // Run once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideAskChatGPTButton);
    } else {
        hideAskChatGPTButton();
    }

    // Observe DOM changes
    try {
        const observer = new MutationObserver(hideAskChatGPTButton);
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (err) {
        console.error('MutationObserver error:', err);
    }
})();
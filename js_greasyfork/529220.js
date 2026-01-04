// ==UserScript==
// @name         Highlight GPT-4.1 Mini Responses
// @description  Highlights GPT-4.1 Mini responses with a semi-transparent red background
// @match        https://chat.openai.com/*
// @match        https://chat.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @version 0.0.1.20250521112547
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/529220/Highlight%20GPT-41%20Mini%20Responses.user.js
// @updateURL https://update.greasyfork.org/scripts/529220/Highlight%20GPT-41%20Mini%20Responses.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function highlightMiniResponses() {
        document.querySelectorAll('article').forEach(container => {
            const modelSlug = container.querySelector('[data-message-model-slug]');
            if (modelSlug?.getAttribute('data-message-model-slug') === 'gpt-4-1-mini') {
                Object.assign(container.style, {
                    backgroundColor: "rgba(255, 0, 0, 0.2)", // Semi-transparent red background
                    borderRadius: "8px"
                });
            } else {
                container.style.backgroundColor = "transparent";
            }
        });
    }

    highlightMiniResponses();

    const observer = new MutationObserver(highlightMiniResponses);
    observer.observe(document.body, { childList: true, subtree: true });
})();

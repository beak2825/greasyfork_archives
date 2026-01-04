// ==UserScript==
// @name         ChatGPT Hide Reasoning
// @namespace    ChatGPT Tools by Vishanka
// @version      0.1
// @description  Hide the GPT reasoning so that if it constantly is expanded you finally can live in peace
// @author       Vishanka
// @license      Proprietary
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527043/ChatGPT%20Hide%20Reasoning.user.js
// @updateURL https://update.greasyfork.org/scripts/527043/ChatGPT%20Hide%20Reasoning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .mb-4.border-l-2.pl-4.dark\\:border-token-text-secondary {
            display: none !important;
        }
    `);
})();
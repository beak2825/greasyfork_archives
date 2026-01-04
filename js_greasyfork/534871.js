// ==UserScript==
// @name         AI for Watch
// @namespace    https://chat.openai.com/
// @version      1.1
// @description  Optimize ChatGPT UI for display on Apple Watch
// @author       YourName
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534871/AI%20for%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/534871/AI%20for%20Watch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const removeThreadBottomContainer = () => {
        const el = document.getElementById("thread-bottom-container");
        if (el) {
            el.remove();
            console.log("✔ Removed #thread-bottom-container");
        }
    };

    const trimSidebar = () => {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;

        // Keep only the last direct child
        while (sidebar.children.length > 1) {
            sidebar.removeChild(sidebar.firstElementChild);
        }

        const firstChild = sidebar.firstElementChild;
        if (firstChild && firstChild.children.length > 1) {
            const children = Array.from(firstChild.children);
            children.slice(0, -1).forEach(child => child.remove());
            console.log("✔ Trimmed #sidebar to last element and its last sub-element");
        }
    };

    const trimChatHistory = () => {
        const chatHistory = document.querySelector('[aria-label="Chat history"]');
        if (!chatHistory) return;

        const children = Array.from(chatHistory.children);
        if (children.length > 2) {
            children.slice(2).forEach(child => child.remove());
            console.log("✔ Trimmed chat history to first 2 items");
        }
    };

    const optimizeUI = () => {
        removeThreadBottomContainer();
        trimSidebar();
        trimChatHistory();
    };

    // Initial run
    optimizeUI();

    // Observe for dynamic SPA changes
    const observer = new MutationObserver(() => {
        requestAnimationFrame(optimizeUI); // smoother execution
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

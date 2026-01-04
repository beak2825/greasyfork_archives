// ==UserScript==
// @name         Fullwidth LLMs
// @namespace    https://enira.moe/
// @version      0.1
// @description  Resizes LLM interfaces to full width. Currently supports ChatGPT, Claude, Deepseek, and Gemini.
// @author       エニラ
// @match        https://chatgpt.com/c/*
// @match        https://operator.chatgpt.com/c/*
// @match        https://claude.ai/chat/*
// @match        https://chat.deepseek.com/a/chat/*
// @match        https://gemini.google.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525674/Fullwidth%20LLMs.user.js
// @updateURL https://update.greasyfork.org/scripts/525674/Fullwidth%20LLMs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Returns the nth parent of an element.
     * @param {Element} element - The starting element.
     * @param {number} n - The number of levels to go up (0 returns the element itself).
     * @returns {Element} - The nth parent element.
     */
    function nthParent(element, n) {
        let current = element;
        for (let i = 0; i < n; i++) {
            if (current.parentElement) {
                current = current.parentElement;
            } else {
                break;
            }
        }
        return current;
    }

    /**
     * Removes classes from the given element that match the provided regular expression.
     * @param {Element} element - The element from which classes will be removed.
     * @param {RegExp} regex - The regular expression to test class names against.
     */
    function removeClassesByRegex(element, regex) {
        if (!element || !element.classList) return;
        [...element.classList].forEach(cls => {
            if (regex.test(cls)) {
                element.classList.remove(cls);
            }
        });
    }

    setInterval(() => {
        const url = window.location.href;

        if (url.includes("chatgpt.com")) {
            document.querySelectorAll('.group\\/conversation-turn, form').forEach(child => {
                const wrapper = nthParent(child, 1);
                removeClassesByRegex(wrapper, /max-w/);
            });
        }

        else if (url.includes("claude.ai")) {
            const form = document.querySelector('fieldset');

            const wrapper = nthParent(form, 3);
            removeClassesByRegex(wrapper, /max-w/);

            const chat = wrapper.children[0];
            removeClassesByRegex(chat, /max-w/);
        }

        else if (url.includes("chat.deepseek.com")) {
            const root = document.querySelector(':root');
            root.style.setProperty('--message-list-max-width', '100%');
        }

        else if (url.includes("gemini.google.com")) {
            const form = document.querySelector('.input-area-container');
            removeClassesByRegex(form, /input-area-container/);

            const chat = document.querySelector('.conversation-container');
            removeClassesByRegex(chat, /conversation-container/);

            const container = document.querySelector('input-container');
            container.style.setProperty('max-width', '100%');
        }
    }, 125);
})();

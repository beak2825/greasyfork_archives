// ==UserScript==
// @name         ChatGPT
// @namespace    yelfive
// @version      2025-03-12
// @description  A utils for ChatGPT.com
// @author       You
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529509/ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/529509/ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.insertAdjacentHTML('beforeend', /*css*/`<style>
    body main div[data-message-author-role="user"]>div.w-full>div.relative {
        background: #6d6dff;
        color: white;
    }
    </style>`)

    function saveInput() {
        const dom = document.querySelector('#prompt-textarea p');
        if (!dom) return;
        if (!dom.textContent) return;
        const input = dom.textContent;

        localStorage.setItem('__input', input);
    }

    // setInterval(saveInput, 500);

    let lastIndex = null;

    function getHistory() {
        const list = [...document.querySelectorAll('[data-message-author-role="user"]')].map(d => d.querySelector('.whitespace-pre-wrap').textContent);
        const unsubmitted = localStorage.getItem('__input');
        if (unsubmitted && unsubmitted !== list[list.length - 1]) list.push(unsubmitted);
        return list;
    }
    document.addEventListener('keyup', (ev) => {
        if (ev.target.id !== 'prompt-textarea') return;
        let input;

        const dom = document.querySelector('#prompt-textarea p');
        if (ev.code === 'ArrowUp') {
            const _his = getHistory();
            if (lastIndex === null) lastIndex = _his.length;
            if (lastIndex > 0) {
                input = _his[--lastIndex];
            } else {
                return;
            }
        } else if (ev.code === 'ArrowDown') {
            const _his = getHistory();
            if (lastIndex === null) lastIndex = _his.length;
            if (lastIndex < _his.length - 1) {
                input = _his[++lastIndex]
            } else {
                return;
            }
        } else{
            saveInput();
        }

        if (input) dom.innerHTML = input;
    });
})();
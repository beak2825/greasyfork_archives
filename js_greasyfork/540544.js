// ==UserScript==
// @name         LZT User Notes 2.0
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Добавляет заметки о пользователях на форум и маркет
// @author       lolz.live/matbast0s
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/540544/LZT%20User%20Notes%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/540544/LZT%20User%20Notes%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
    .userNoteInput {
        width: 100%;
        min-height: 40px;
        background: #2d2d2d;
        color: #D6D6D6;
        border: 1px solid transparent;
        border-radius: 6px;
        margin-top: 5px;
        padding: 10px;
        resize: none;
        overflow: hidden;
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        box-sizing: border-box;
        outline: none;
    }
    .userNoteInput:focus {
        border-color: #318463;
    }`;
    document.head.appendChild(style);

    const init = () => {
        const profileLink = document.querySelector('a.depositUsername')?.href;
        const depositBlock = document.querySelector('.section.insuranceDeposit');

        if (profileLink && depositBlock) {
            const userId = document.querySelector('a.page_counter[href*="userthreads"]')
                 ?.href.match(/userthreads\/(\d+)/)?.[1];

            const noteBox = document.createElement("div");
            noteBox.style.marginTop = "10px";
            noteBox.innerHTML = `
<div style="
        background: #272727;
        padding: 8px;
        border-radius: 6px;
        margin-bottom: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: rgb(148, 148, 148);
        line-height: 16px;">
        <strong>Заметка о пользователе</strong>
        <textarea
        id="userNoteField"
        class="userNoteInput"
        placeholder="Напишите что-нибудь..."></textarea>
</div>`;
            depositBlock.parentElement.insertBefore(noteBox, depositBlock);

            const textarea = noteBox.querySelector('#userNoteField');
            const autoResize = (el) => {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            };

            textarea.value = GM_getValue("note_" + userId, "");
            textarea.addEventListener("input", () => {
                GM_setValue("note_" + userId, textarea.value);
                autoResize(textarea);
            });
            autoResize(textarea);
        }
    };
    window.addEventListener('load', init);
})();

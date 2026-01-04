// ==UserScript==
// @name         Hidder for LZT
// @namespace    Wi33y | https://zelenka.guru/p_gr/
// @version      1.8
// @description  Custom BG for LZT
// @match        https://zelenka.guru/*
// @exclude      https://zelenka.guru/conversations/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477880/Hidder%20for%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/477880/Hidder%20for%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const users = ["3359264", "3288862", "4239220", "4384290", "3726655", "3169654", "3611834", "2630871", "6266214", "713065", "3771941", "885272", "4389845", "3812139", "2849651", "7549668", "14641", "3740180", "3498220", "2683190"];
    const codeToInsert = `[exceptids="${users.join(', ')}"]ㅤ  ㅤ  ㅤ ㅤㅤ[/exceptids]`;

    function insertCode() {
        const textarea = document.querySelector(".fr-element");
        if (textarea) {
            textarea.focus(); // Добавляем фокус на текстовое поле
            document.execCommand("insertText", false, codeToInsert); // Вставляем текст
        }
    }

    // Вызываем функцию insertCode при загрузке страницы
    insertCode();
})();

// ==UserScript==
// @name         Google Drive Direct Download Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопку для получения прямой ссылки на скачивание файла из Google Drive
// @author       Rodion & ChatGPT
// @match        https://drive.google.com/file/d/*
// @icon         https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/535334/Google%20Drive%20Direct%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/535334/Google%20Drive%20Direct%20Download%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверка, что страница загружена
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 500);
    }

    function getFileId() {
        const match = window.location.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    function createButton(fileId) {
        const button = document.createElement('button');
        button.innerText = '🔗 Получить прямую ссылку';
        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            padding: 10px 14px;
            background-color: #0f9d58;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
        `;

        button.onclick = () => {
            const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
            GM_setClipboard(directLink);
            alert("Прямая ссылка скопирована в буфер обмена:\n\n" + directLink);
        };

        document.body.appendChild(button);
    }

    const fileId = getFileId();
    if (fileId) {
        waitForElement('div[jscontroller]', () => {
            createButton(fileId);
        });
    }
})();

// ==UserScript==
// @name         Отключение безопасного просмотра ВК
// @version      1.3
// @description  Добавляет кнопку для отключения безопасного поиска видео = можно искать порно
// @author       awaw
// @match        https://vk.com/*
// @grant        none
// @license      MIT
// @namespace awaw
// @downloadURL https://update.greasyfork.org/scripts/508677/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B0%20%D0%92%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/508677/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B0%20%D0%92%D0%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        if (window.location.href.includes('/video') && !document.querySelector('#notsafeButton')) {
            const button = document.createElement('button');
            button.id = 'notsafeButton';
            button.innerText = 'Вкл 18+';
            button.style.position = 'fixed';
            button.style.top = '6px';
            button.style.right = '6px';
            button.style.padding = '6px';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '9999';

            document.body.appendChild(button);

            button.addEventListener('click', function() {
                let currentUrl = window.location.href;
                if (currentUrl.includes('?')) {
                    currentUrl += '&notsafe=1';
                } else {
                    currentUrl += '?notsafe=1';
                }
                window.location.href = currentUrl;
            });
        }
    }

    function removeButton() {
        const button = document.querySelector('#notsafeButton');
        if (button) {
            button.remove();
        }
    }

    function checkPage() {
        if (window.location.href.includes('/video')) {
            addButton();
        } else {
            removeButton();
        }
    }

    checkPage();

    const observer = new MutationObserver(() => {
        checkPage();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
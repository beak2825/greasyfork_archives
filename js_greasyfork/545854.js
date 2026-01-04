// ==UserScript==
// @name         Тестовый скрипт
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Решено
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545854/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/545854/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function likeAllMessages() {
        const likeButtons = document.querySelectorAll('button.js-likeButton'); // кнопки лайка
        let count = 0;

        likeButtons.forEach(btn => {
            if (!btn.classList.contains('is-active')) { // проверяем, что ещё не лайкнуто
                btn.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                count++;
            }
        });

        alert(`Лайки проставлены! Всего: ${count}`);
    }

    function addLikeButton() {
        const btn = document.createElement("button");
        btn.innerText = "Поставить все лайки";
        btn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background-color: #0099FF;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        btn.onclick = likeAllMessages;

        document.body.appendChild(btn);
    }

    // Ждём полной загрузки страницы
    window.addEventListener("load", () => {
        addLikeButton();
    });

})();
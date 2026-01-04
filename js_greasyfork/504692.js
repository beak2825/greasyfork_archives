// ==UserScript==
// @name         Бегущий статус пользователя - Left
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Добавляет анимацию бегущей строки к статусу пользователя и в предпросмотре профиля
// @author       Alderson
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @namespace    http://tampermonkey.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504692/%D0%91%D0%B5%D0%B3%D1%83%D1%89%D0%B8%D0%B9%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F%20-%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/504692/%D0%91%D0%B5%D0%B3%D1%83%D1%89%D0%B8%D0%B9%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F%20-%20Left.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавление стилей для анимации бегущей строки
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes marquee {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .marquee, .userBlurb {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            box-sizing: border-box;
        }
        .marquee span, .userBlurb {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 5s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // Применение анимации к элементам
    const applyMarquee = () => {
        document.querySelectorAll('.marquee span, .userBlurb').forEach(el => {
            if (!el.style.animation) {
                el.style.animation = 'marquee 5s linear infinite';
            }
        });
    };

    // Наблюдение за изменениями в DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                applyMarquee();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализация при загрузке
    applyMarquee();
})();
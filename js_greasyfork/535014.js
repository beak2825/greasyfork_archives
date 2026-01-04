// ==UserScript==
// @name         Ficbook: фон сайта + сброс
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Меняет фон сайта и добавляет сброс, убирает кнопку изменения фона профиля. Код открыт для использования, модификации и распространения.
// @author       varaslaw
// @match        https://ficbook.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535014/Ficbook%3A%20%D1%84%D0%BE%D0%BD%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%2B%20%D1%81%D0%B1%D1%80%D0%BE%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/535014/Ficbook%3A%20%D1%84%D0%BE%D0%BD%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%2B%20%D1%81%D0%B1%D1%80%D0%BE%D1%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== CSS для кнопок =====
    const style = document.createElement('style');
    style.textContent = `
        .custom-btn-container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .custom-btn {
            background-color: #444;
            color: white;
            border: none;
            padding: 5px 10px;
            font-size: 11px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.8;
        }

        .custom-btn:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // ===== Кнопки =====
    const container = document.createElement('div');
    container.className = 'custom-btn-container';

    const btnBg = document.createElement('button');
    btnBg.innerText = 'Фон сайта';
    btnBg.className = 'custom-btn';

    const btnReset = document.createElement('button');
    btnReset.innerText = 'Сброс';
    btnReset.className = 'custom-btn';

    container.appendChild(btnBg);
    container.appendChild(btnReset);
    document.body.appendChild(container);

    // ===== Загрузка ранее сохранённого =====
    const savedSiteBg = localStorage.getItem('customFicbookBg');
    if (savedSiteBg) applySiteBackground(savedSiteBg);

    // ===== ФОН САЙТА =====
    btnBg.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                const url = e.target.result;
                applySiteBackground(url);
                localStorage.setItem('customFicbookBg', url);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    });

    function applySiteBackground(url) {
        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }

    // ===== СБРОС =====
    btnReset.addEventListener('click', () => {
        localStorage.removeItem('customFicbookBg');
        document.body.style.backgroundImage = '';
    });
})();
